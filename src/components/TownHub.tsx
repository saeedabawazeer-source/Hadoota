import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { characterFor } from '../data/characters';
import { complexionFor } from '../data/complexions';
import { SIZE } from './GroundedModel';

// Apply a complexion colormap (or restore original) to every textured mesh in a scene.
function applyComplexion(scene: THREE.Object3D, complexion?: string) {
  const url = complexionFor(complexion).texture;
  scene.traverse((o: any) => {
    if (!o.isMesh || !o.material) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m: any) => {
      if (!m.map && !m.userData?.origMap) return;
      if (!m.userData.origMap) m.userData.origMap = m.map;
      if (!url) { if (m.userData.origMap) { m.map = m.userData.origMap; m.needsUpdate = true; } return; }
      const t = new THREE.TextureLoader().load(url, () => { m.needsUpdate = true; });
      t.flipY = false; t.colorSpace = THREE.SRGBColorSpace;
      m.map = t; m.needsUpdate = true;
    });
  });
}

/* The family HOME ISLAND — a clean floating home hub (NOT a game launcher).
   Family members stand in the middle; a banner spans the island. */

const ISLAND_TALL = '/mini-world/island/block-grass-overhang-large-tall.glb';
const T = 2.08;
const TOP = 2;

// clean rounded island
const TILES: [number, number][] = [];
for (let cx = -3; cx <= 3; cx++) for (let cz = -3; cz <= 3; cz++) {
  if (cx * cx + cz * cz <= 10.5) TILES.push([cx * T, cz * T]);
}

// small decorative houses around the back + sides (front stays open for the family + banner)
const HOUSES: { src: string; pos: [number, number, number]; rot: number; height: number }[] = [
  { src: '/mini-world/city/building-type-b.glb', pos: [0, TOP, -4.6], rot: Math.PI, height: 2.6 },
  { src: '/mini-world/city/building-type-c.glb', pos: [-3.8, TOP, -2.6], rot: Math.PI * 0.72, height: 2.3 },
  { src: '/mini-world/city/building-type-e.glb', pos: [3.8, TOP, -2.6], rot: -Math.PI * 0.72, height: 2.4 },
  { src: '/mini-world/city/building-type-i.glb', pos: [-4.6, TOP, 0.6], rot: Math.PI / 2, height: 2.2 },
  { src: '/mini-world/city/building-type-m.glb', pos: [4.6, TOP, 0.6], rot: -Math.PI / 2, height: 2.3 },
];

const I = '/mini-world/island/';
const PROPS: { src: string; pos: [number, number, number]; rot: number; scale: number }[] = [
  { src: I + 'tree.glb', pos: [-3.4, TOP, -0.6], rot: 0, scale: 1 },
  { src: I + 'tree-pine.glb', pos: [3.4, TOP, -0.6], rot: 0.3, scale: 1 },
  { src: I + 'tree-pine-small.glb', pos: [-4.2, TOP, 2.6], rot: 0, scale: 1 },
  { src: I + 'tree.glb', pos: [4.2, TOP, 2.6], rot: 0.5, scale: 1 },
  { src: I + 'flowers.glb', pos: [-2, TOP, 2.4], rot: 0, scale: 1 },
  { src: I + 'flowers-tall.glb', pos: [2, TOP, 2.4], rot: 0.5, scale: 1 },
  { src: I + 'mushrooms.glb', pos: [-1.4, TOP, 3.4], rot: 0, scale: 1 },
  { src: I + 'coin-gold.glb', pos: [1.2, TOP, 3.3], rot: 0, scale: 1 },
  { src: I + 'chest.glb', pos: [3, TOP, 3.4], rot: -0.5, scale: 1 },
  { src: I + 'hedge.glb', pos: [-3, TOP, 3.4], rot: 0, scale: 1 },
  { src: I + 'star.glb', pos: [0, TOP + 0.6, 2.2], rot: 0, scale: 1 },
  { src: '/mini-world/fantasy/fountain-round.glb', pos: [0, TOP, -0.2], rot: 0, scale: 0.42 },
];

function Raw({ src, pos, rot = 0, scale = 1 }: { src: string; pos: [number, number, number]; rot: number; scale: number }) {
  const { scene } = useGLTF(src);
  const c = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={c} position={pos} rotation={[0, rot, 0]} scale={scale} />;
}

function Sized({ src, pos, rot = 0, height }: { src: string; pos: [number, number, number]; rot: number; height: number }) {
  const { scene } = useGLTF(src);
  const c = useMemo(() => scene.clone(true), [scene]);
  const { scale, yOff } = useMemo(() => {
    const b = new THREE.Box3().setFromObject(c); const s = new THREE.Vector3(); b.getSize(s);
    const sy = Number.isFinite(s.y) && s.y > 0.001 ? s.y : 1;
    const sc = Math.min(50, Math.max(0.01, height / sy));
    return { scale: sc, yOff: -(Number.isFinite(b.min.y) ? b.min.y : 0) * sc };
  }, [c, height]);
  return <primitive object={c} position={[pos[0], pos[1] + yOff, pos[2]]} rotation={[0, rot, 0]} scale={scale} />;
}

function FamilyMember({ seed, pos, rotation = 0, complexion }: { seed: string; pos: [number, number, number]; rotation?: number; complexion?: string }) {
  const group = useRef<THREE.Group>(null);
  const char = characterFor(seed);
  const { scene, animations } = useGLTF(char.model);
  const { actions } = useAnimations(animations, group);
  const scale = useMemo(() => {
    const b = new THREE.Box3().setFromObject(scene); const s = new THREE.Vector3(); b.getSize(s);
    const sy = Number.isFinite(s.y) && s.y > 0.001 ? s.y : 1;
    return Math.min(20, Math.max(0.05, (SIZE.character * 1.25) / sy)); // a touch bigger — they're the focus
  }, [scene]);
  useEffect(() => { const a = actions['idle'] || actions['emote-yes']; a?.reset().fadeIn(0.3).play(); return () => { a?.fadeOut(0.2); }; }, [actions]);
  useEffect(() => { if (char.kind === 'hero') applyComplexion(scene, complexion); }, [scene, complexion, char.kind]);
  return <group ref={group} position={pos} rotation={[0, rotation, 0]} scale={scale}><primitive object={scene} /></group>;
}

// tall welcome banner behind the town (doesn't block the family in front)
function IslandBanner({ text }: { text: string }) {
  const W = 8.5;
  return (
    <group position={[0, TOP, -5.6]}>
      <mesh position={[-W / 2, 2.1, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 4.2, 8]} /><meshStandardMaterial color="#6f4a29" /></mesh>
      <mesh position={[W / 2, 2.1, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 4.2, 8]} /><meshStandardMaterial color="#6f4a29" /></mesh>
      <mesh position={[0, 3.5, 0]} castShadow><boxGeometry args={[W + 0.3, 1.1, 0.12]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 3.5, 0.07]}><boxGeometry args={[W - 0.1, 0.85, 0.02]} /><meshStandardMaterial color="#f97316" /></mesh>
      <Text position={[0, 3.5, 0.11]} fontSize={0.6} letterSpacing={0.05} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">{text}</Text>
    </group>
  );
}

const CAM: [number, number, number] = [13, 12, 16];
const LOOK: [number, number, number] = [0, 1.2, 1];
function CameraRig() {
  const { camera } = useThree();
  useFrame(() => { camera.position.set(CAM[0], CAM[1], CAM[2]); camera.lookAt(LOOK[0], LOOK[1], LOOK[2]); });
  return null;
}

const SPOT_POS: [number, number][] = [[-1.3, 1.6], [1.3, 1.6], [0, 0.7], [-2.6, 1.1], [2.6, 1.1], [0, 2.3], [-1.4, -0.1], [1.4, -0.1]];

function Island({ seed, parentSeeds, familyName, members, complexion }: { seed: string; parentSeeds: string[]; familyName: string; members?: { id: string; seed: string }[]; complexion?: string }) {
  const meMarked = useRef(false); meMarked.current = false;
  const family = (members && members.length)
    ? members.slice(0, 8).map((m, i) => {
        const me = !meMarked.current && m.seed === seed; if (me) meMarked.current = true;
        return { key: m.id, seed: m.seed, x: SPOT_POS[i][0], z: SPOT_POS[i][1], me };
      })
    : [{ key: 'me', seed, x: -1.3, z: 1.6, me: true }, ...(parentSeeds[0] ? [{ key: 'p0', seed: parentSeeds[0], x: 1.3, z: 1.6, me: false }] : []), ...(parentSeeds[1] ? [{ key: 'p1', seed: parentSeeds[1], x: 0, z: 0.7, me: false }] : [])];
  return (
    <Float speed={1.1} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
      {TILES.map(([x, z], i) => <Raw key={i} src={ISLAND_TALL} pos={[x, 0, z]} rot={0} scale={1} />)}
      {/* clean flat grass floor over the blocks */}
      <mesh position={[0, TOP + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6.1, 56]} />
        <meshStandardMaterial color="#7cc069" />
      </mesh>
      {HOUSES.map((h, i) => <Sized key={i} src={h.src} pos={h.pos} rot={h.rot} height={h.height} />)}
      {PROPS.map((p, i) => <Raw key={i} src={p.src} pos={p.pos} rot={p.rot} scale={p.scale} />)}
      {/* the family, front-and-centre */}
      {family.map((f) => <FamilyMember key={f.key} seed={f.seed} pos={[f.x, TOP, f.z]} rotation={f.x < 0 ? 0.25 : -0.25} complexion={f.me ? complexion : undefined} />)}
      <IslandBanner text={`${familyName} ISLAND`} />
    </Float>
  );
}

export function TownHub({ seed, familyName, parentSeeds, members, complexion }: { seed: string; familyName: string; parentSeeds: string[]; members?: { id: string; seed: string }[]; complexion?: string; onPlay?: (id: string) => void }) {
  return (
    <div className="relative w-full h-full">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: CAM, fov: 34 }} gl={{ alpha: true }}>
        <hemisphereLight args={["#ffffff", "#7fb0d0", 1.15]} />
        <directionalLight position={[8, 14, 6]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
        <CameraRig />
        <Suspense fallback={null}>
          <Island seed={seed} parentSeeds={parentSeeds} familyName={familyName} members={members} complexion={complexion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

[ISLAND_TALL, ...HOUSES.map((h) => h.src), ...PROPS.map((p) => p.src)].forEach((s) => useGLTF.preload(s));
