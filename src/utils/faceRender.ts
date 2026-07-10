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

    // Prefer framing on the actual head geometry (named "head"/"head-mesh" in
    // the Kenney rig) so raised arms/hands or off-pose poses never throw the
    // crop off — this measures just the head, not a fraction of whole-body
    // height, which broke down whenever a pose raised the total bounding box.
    let headBox: THREE.Box3 | null = null;
    model.traverse((o: any) => {
      if (o.isMesh && /head/i.test(o.name)) {
        const b = new THREE.Box3().setFromObject(o);
        headBox = headBox ? headBox.union(b) : b;
      }
    });

    let center: THREE.Vector3;
    let frameH: number;
    if (headBox) {
      const hsz = new THREE.Vector3(); headBox.getSize(hsz);
      center = headBox.getCenter(new THREE.Vector3());
      frameH = Math.max(hsz.x, hsz.y, hsz.z) * 1.35;

      // Hide everything that isn't the head itself. A tight crop centered on
      // the head still renders whatever geometry happens to sit in that
      // region — on a body-mesh that includes arms, a hand-near-face pose
      // (waving, holding glasses, etc.) shows up right next to/over the face.
      // Isolating the head mesh guarantees only the face ever renders, no
      // matter what the rest of the body is doing.
      model.traverse((o: any) => {
        if (o.isMesh && !/head/i.test(o.name)) o.visible = false;
      });
    } else {
      // Fallback for models with no dedicated head mesh (e.g. pets): estimate
      // the head as the top headFrac of the whole-body bounding box.
      const box = new THREE.Box3().setFromObject(model);
      const sz = new THREE.Vector3(); box.getSize(sz);
      const headH = sz.y * headFrac;
      center = new THREE.Vector3((box.min.x + box.max.x) / 2, box.max.y - headH / 2, (box.min.z + box.max.z) / 2);
      frameH = headH * 1.5;
    }

    const fov = 30;
    const dist = (frameH / 2) / Math.tan((fov * Math.PI) / 360);
    const cam = new THREE.PerspectiveCamera(fov, 1, 0.01, 100);
    cam.position.set(center.x, center.y, center.z + dist); cam.lookAt(center.x, center.y, center.z);

    const r = getRenderer();
    r.render(scene, cam);
    const url = r.domElement.toDataURL('image/png');
    scene.clear();
    return url;
  })();

  cache.set(key, cached);
  return cached;
}
