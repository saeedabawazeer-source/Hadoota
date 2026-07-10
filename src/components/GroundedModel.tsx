import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Loads a GLB, measures its real bounding box, and scales it to a target
// real-world HEIGHT (metres) with its base sitting on the ground (y=0).
// This keeps proportions sane — a building towers over a car over a kid —
// instead of every model rendering the same size.
export function GroundedModel({
  src, height, position = [0, 0, 0], rotation = 0,
}: { src: string; height: number; position?: [number, number, number]; rotation?: number }) {
  const { scene } = useGLTF(src);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const { scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    // Guard against bad measurements (0 / NaN / Infinity) so nothing blows up.
    const sy = Number.isFinite(size.y) && size.y > 0.001 ? size.y : 1;
    const s = Math.min(50, Math.max(0.01, height / sy));
    const minY = Number.isFinite(box.min.y) ? box.min.y : 0;
    return { scale: s, yOffset: -minY * s };
  }, [cloned, height]);
  return (
    <group position={[position[0], position[1] + yOffset, position[2]]} rotation={[0, rotation, 0]}>
      <primitive object={cloned} scale={scale} />
    </group>
  );
}

// Real-world target heights (metres) shared across the app.
export const SIZE = {
  character: 1.6,
  car: 1.5,
  house: 3.6,
  building: 6.5,
  tower: 12,
  tree: 3.2,
  light: 4.2,
  prop: 1.1,
};
