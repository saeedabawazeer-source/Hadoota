// Renders a crisp, straight-on FACE snapshot of a character's 3D model.
// Used for avatar icons / style thumbnails so they show the head (not a full
// body) in the exact 3D art style. Results are cached per model+complexion.
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

const SIZE = 160;
let renderer: THREE.WebGLRenderer | null = null;
const loader = new GLTFLoader();
const cache = new Map<string, Promise<string>>();
const gltfCache = new Map<string, Promise<THREE.Object3D>>();

function getRenderer() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  return renderer;
}

function loadModel(url: string): Promise<THREE.Object3D> {
  let p = gltfCache.get(url);
  if (!p) {
    p = new Promise<THREE.Object3D>((res, rej) => loader.load(url, (g) => res(g.scene), undefined, rej));
    gltfCache.set(url, p);
  }
  return p;
}

async function applyComplexion(root: THREE.Object3D, complexionUrl: string) {
  const tex = await new Promise<THREE.Texture>((res, rej) =>
    new THREE.TextureLoader().load(complexionUrl, res, undefined, rej));
  tex.flipY = false; tex.colorSpace = THREE.SRGBColorSpace;
  root.traverse((o: any) => {
    if (o.isMesh && o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m: any) => { if (m.map) { m.map = tex; m.needsUpdate = true; } });
    }
  });
}

/** Returns a PNG data URL of the model's face. headFrac ~0.36 heroes, ~0.60 pets. */
export function getFace(modelUrl: string, headFrac: number, complexionUrl?: string | null): Promise<string> {
  const key = `${modelUrl}|${complexionUrl || ''}`;
  let cached = cache.get(key);
  if (cached) return cached;

  cached = (async () => {
    const base = await loadModel(modelUrl);
    // clone so per-complexion recolor never touches the shared copy
    const model = base.clone(true);
    if (complexionUrl) await applyComplexion(model, complexionUrl);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 2.4));
    const dl = new THREE.DirectionalLight(0xffffff, 2.0); dl.position.set(1, 2, 4); scene.add(dl);
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const sz = new THREE.Vector3(); box.getSize(sz);
    const headH = sz.y * headFrac;
    const cyy = box.max.y - headH / 2;
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
    const fov = 30, frameH = headH * 1.5;
    const dist = (frameH / 2) / Math.tan((fov * Math.PI) / 360) + Math.max(sz.x, sz.z);
    const cam = new THREE.PerspectiveCamera(fov, 1, 0.01, 100);
    cam.position.set(cx, cyy, cz + dist); cam.lookAt(cx, cyy, cz);

    const r = getRenderer();
    r.render(scene, cam);
    const url = r.domElement.toDataURL('image/png');
    scene.clear();
    return url;
  })();

  cache.set(key, cached);
  return cached;
}
