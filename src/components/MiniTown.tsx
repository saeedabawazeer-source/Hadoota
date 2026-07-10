import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { characterFor } from '../data/characters';

// A small, calm 3D "town square" vignette used across the kid app so the whole
// experience feels like it lives inside the same mini-3D world. One canvas,
// low detail, gentle motion — light enough to sit behind UI.

const TOWN = {
  buildings: [
    { src: '/mini-world/city/building-type-a.glb', pos: [-4.2, 0, -4], rot: Math.PI / 2, scale: 1.7 },
    { src: '/mini-world/downtown/building-skyscraper-a.glb', pos: [4.4, 0, -5], rot: -Math.PI / 2, scale: 2.0 },
    { src: '/mini-world/city/building-type-g.glb', pos: [-6.5, 0, -6.5], rot: Math.PI / 2, scale: 1.8 },
    { src: '/mini-world/downtown/building-c.glb', pos: [6.8, 0, -7], rot: -Math.PI / 2, scale: 1.9 },
  ],
  props: [
    { src: '/mini-world/city/tree-large.glb', pos: [-2.6, 0, -1.5], rot: 0, scale: 1.2 },
    { src: '/mini-world/city/tree-small.glb', pos: [2.7, 0, -1], rot: 0, scale: 1.2 },
    { src: '/mini-world/props/light-square.glb', pos: [-3.4, 0, 0.5], rot: 0, scale: 1.0 },
    { src: '/mini-world/cars/taxi.glb', pos: [3.3, 0, 1], rot: -Math.PI / 2.2, scale: 1.0 },
  ],
};

function Model({ src, pos, rot, scale }: { src: string; pos: number[]; rot: number; scale: number }) {
  const { scene } = useGLTF(src);
  const c = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={c} position={pos as any} rotation={[0, rot, 0]} scale={scale} />;
}

function Hero({ seed }: { seed: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(characterFor(seed).model);
  const { actions } = useAnimations(animations, group);
  React.useEffect(() => {
    const a = actions['emote-yes'] || actions['idle'];
    a?.reset().fadeIn(0.3).play();
    return () => { a?.fadeOut(0.2); };
  }, [actions]);
  useFrame(() => { if (group.current) group.current.position.y = Math.sin(performance.now() * 0.004) * 0.03; });
  return (
    <group ref={group} position={[0, 0, 0.5]} rotation={[0, 0.3, 0]} scale={1.6}>
      <primitive object={scene} />
    </group>
  );
}

export function MiniTown({ seed, className = '', style }: { seed: string; className?: string; style?: React.CSSProperties }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 3.2, 6.2], fov: 42 }} className={className}
      style={{ width: '100%', height: '100%', ...style }}>
      <color attach="background" args={["#bfe6fb"]} />
      <fog attach="fog" args={["#bfe6fb", 14, 30]} />
      <hemisphereLight args={["#ffffff", "#8fd05a", 1.1]} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#8fd05a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial color="#b9bfca" />
      </mesh>
      <Suspense fallback={null}>
        {TOWN.buildings.map((b, i) => <Model key={`b${i}`} {...b} />)}
        {TOWN.props.map((p, i) => <Model key={`p${i}`} {...p} />)}
        <Hero seed={seed} />
      </Suspense>
    </Canvas>
  );
}

[...TOWN.buildings, ...TOWN.props].forEach((m) => useGLTF.preload(m.src));
