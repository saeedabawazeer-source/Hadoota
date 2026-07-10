import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Heart, Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { characterFor } from '../data/characters';
import { GAME_CONFIGS } from '../data/games3d';
import type { Round } from '../data/games3d';
import { HostBadge } from './HostBadge';

/* ---------------- tunables (easy to adjust from a screenshot) ---------------- */
const LANES = [-2.4, 0, 2.4];
const PLAYER_Z = 0;
const SPAWN_Z = -40;
const RESOLVE_Z = -1.5;
const CHAR_Y = 0.55;      // how high the character sits on the car
const CHAR_SCALE = 1.0;
const CAR_SCALE = 1.0;
const VEHICLE_FACING = Math.PI; // rotate car + character to drive AWAY from the camera

const CARS = ['/mini-world/cars/sedan-sports.glb', '/mini-world/cars/race.glb', '/mini-world/cars/taxi.glb', '/mini-world/cars/police.glb'];

/* ---------------- model helpers ---------------- */
function CarModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={CAR_SCALE} />;
}

/* ---------------- dense scrolling city ---------------- */
const CITY_BUILDINGS = [
  '/mini-world/city/building-type-a.glb', '/mini-world/city/building-type-b.glb', '/mini-world/city/building-type-c.glb',
  '/mini-world/city/building-type-e.glb', '/mini-world/city/building-type-g.glb', '/mini-world/city/building-type-i.glb',
  '/mini-world/city/building-type-k.glb', '/mini-world/city/building-type-m.glb', '/mini-world/city/building-type-o.glb',
  '/mini-world/city/building-type-q.glb',
];
const DOWNTOWN = [
  '/mini-world/downtown/building-a.glb', '/mini-world/downtown/building-c.glb', '/mini-world/downtown/building-e.glb',
  '/mini-world/downtown/building-g.glb', '/mini-world/downtown/building-skyscraper-a.glb',
  '/mini-world/downtown/building-skyscraper-b.glb', '/mini-world/downtown/building-skyscraper-c.glb',
];
const TREES = ['/mini-world/city/tree-large.glb', '/mini-world/city/tree-small.glb'];
const LIGHTS = ['/mini-world/props/light-square.glb', '/mini-world/props/light-curved.glb'];
const PROPS = ['/mini-world/city/planter.glb', '/mini-world/city/fence-1x3.glb'];

const ROWS = 12;
const SPACING = 6.5;
const CITY_DEPTH = ROWS * SPACING;

interface Item { src: string; x: number; z: number; rot: number; scale: number; }
function buildCity(): Item[] {
  const items: Item[] = [];
  for (let r = 0; r < ROWS; r++) {
    const z = -r * SPACING;
    const tall = r % 4 === 0; // skyline pockets
    // left building
    items.push({ src: (tall ? DOWNTOWN : CITY_BUILDINGS)[r % (tall ? DOWNTOWN.length : CITY_BUILDINGS.length)], x: -7.3 - (r % 2) * 0.7, z, rot: Math.PI / 2, scale: (tall ? 2.0 : 1.7) + (r % 3) * 0.2 });
    // right building
    items.push({ src: (tall ? DOWNTOWN : CITY_BUILDINGS)[(r + 4) % (tall ? DOWNTOWN.length : CITY_BUILDINGS.length)], x: 7.3 + (r % 2) * 0.7, z: z - 3, rot: -Math.PI / 2, scale: (tall ? 2.1 : 1.7) + ((r + 1) % 3) * 0.2 });
    // second row of buildings further back for depth
    items.push({ src: DOWNTOWN[(r + 2) % DOWNTOWN.length], x: -11.5, z: z - 1.5, rot: Math.PI / 2, scale: 2.4 });
    items.push({ src: DOWNTOWN[(r + 5) % DOWNTOWN.length], x: 11.5, z: z - 4, rot: -Math.PI / 2, scale: 2.4 });
    // trees + lights near the curb
    items.push({ src: r % 2 ? TREES[0] : LIGHTS[0], x: -5.0, z: z - 3.2, rot: 0, scale: r % 2 ? 1.2 : 1.0 });
    items.push({ src: r % 2 ? LIGHTS[1] : TREES[1], x: 5.0, z: z - 1.4, rot: Math.PI, scale: r % 2 ? 1.0 : 1.2 });
    // props
    if (r % 3 === 0) items.push({ src: PROPS[r % PROPS.length], x: -4.6, z: z - 5, rot: 0, scale: 1 });
    // parked cars along the roadside
    if (r % 3 === 1) items.push({ src: CARS[r % CARS.length], x: -3.5, z: z - 2, rot: 0, scale: 1 });
    if (r % 4 === 2) items.push({ src: CARS[(r + 2) % CARS.length], x: 3.5, z: z - 4, rot: Math.PI, scale: 1 });
  }
  return items;
}

function CityMesh({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

function City({ speedRef }: { speedRef: React.MutableRefObject<number> }) {
  const items = useMemo(() => buildCity(), []);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const zs = useRef<number[]>(items.map((it) => it.z));
  useFrame((_, dt) => {
    for (let i = 0; i < items.length; i++) {
      zs.current[i] += speedRef.current * dt;
      if (zs.current[i] > 14) zs.current[i] -= CITY_DEPTH;
      const g = refs.current[i];
      if (g) g.position.z = zs.current[i];
    }
  });
  return (
    <group>
      {items.map((it, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }} position={[it.x, 0, it.z]} rotation={[0, it.rot, 0]} scale={it.scale}>
          <Suspense fallback={null}><CityMesh src={it.src} /></Suspense>
        </group>
      ))}
    </group>
  );
}

function Character({ seed, reactionRef }: { seed: string; reactionRef: React.MutableRefObject<string> }) {
  const group = useRef<THREE.Group>(null);
  // Single player instance — use the scene directly (cloning a skinned mesh breaks its animations).
  const { scene, animations } = useGLTF(characterFor(seed).model);
  const { actions } = useAnimations(animations, group);
  const current = useRef<string>('');

  useFrame(() => {
    const want = reactionRef.current;
    if (want !== current.current && actions) {
      const next = actions[want] || actions['drive'] || actions['idle'];
      if (next) {
        const prev = current.current && actions[current.current];
        next.reset().fadeIn(0.2).play();
        if (prev) prev.fadeOut(0.2);
        current.current = want;
      }
    }
  });

  return (
    <group ref={group} position={[0, CHAR_Y, -0.1]} scale={CHAR_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

/* ---------------- moving lane stripes for motion feel ---------------- */
function Road({ speedRef }: { speedRef: React.MutableRefObject<number> }) {
  const stripes = useRef<THREE.Group>(null);
  const count = 14;
  const gap = 4;
  useFrame((_, dt) => {
    if (!stripes.current) return;
    stripes.current.children.forEach((c) => {
      c.position.z += speedRef.current * dt;
      if (c.position.z > 8) c.position.z -= count * gap;
    });
  });
  return (
    <group>
      {/* grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -14]} receiveShadow>
        <planeGeometry args={[60, 90]} />
        <meshStandardMaterial color="#8fd05a" />
      </mesh>
      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -14]} receiveShadow>
        <planeGeometry args={[8, 90]} />
        <meshStandardMaterial color="#454b57" />
      </mesh>
      {/* sidewalk edges */}
      {[-4.3, 4.3].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -14]}>
          <planeGeometry args={[0.8, 90]} />
          <meshStandardMaterial color="#c8cdd6" />
        </mesh>
      ))}
      {/* dashed center + lane lines */}
      <group ref={stripes}>
        {Array.from({ length: count }).map((_, i) =>
          [-1.2, 1.2].map((x) => (
            <mesh key={`${i}-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -i * gap]}>
              <planeGeometry args={[0.18, 1.8]} />
              <meshStandardMaterial color="#ffe36e" />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

/* ---------------- answer gates (HTML labels support numbers, letters, emoji) ---------------- */
function Gates({ answers, gateRef }: { answers: string[]; gateRef: React.MutableRefObject<THREE.Group | null> }) {
  const colors = ['#d946ef', '#22c55e', '#3b82f6'];
  return (
    <group ref={gateRef}>
      {answers.map((a, i) => (
        <group key={i} position={[LANES[i], 0, 0]}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2.0, 2.8, 0.3]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.45} />
          </mesh>
          <Html position={[0, 1.5, 0.2]} center distanceFactor={9} pointerEvents="none">
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 46, color: '#fff', textShadow: '3px 3px 0 #000', whiteSpace: 'nowrap' }}>{a}</div>
          </Html>
        </group>
      ))}
    </group>
  );
}

/* ---------------- player (car + character) ---------------- */
function Player({ seed, laneRef, reactionRef, carSrc }: { seed: string; laneRef: React.MutableRefObject<number>; reactionRef: React.MutableRefObject<string>; carSrc: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    const targetX = LANES[laneRef.current];
    group.current.position.x += (targetX - group.current.position.x) * Math.min(1, dt * 10);
    group.current.position.y = Math.sin(performance.now() * 0.006) * 0.04; // gentle bob
  });
  return (
    <group ref={group} position={[0, 0, PLAYER_Z]}>
      <group rotation={[0, VEHICLE_FACING, 0]}>
        <Suspense fallback={null}>
          <CarModel src={carSrc} />
          <Character seed={seed} reactionRef={reactionRef} />
        </Suspense>
      </group>
    </group>
  );
}

/* ---------------- director: drives gate + resolves ---------------- */
function Director({ speedRef, gateRef, gateZRef, laneRef, answersRef, correctRef, lockRef, runningRef, onResolve }: any) {
  useFrame((_, dt) => {
    if (!runningRef.current || lockRef.current) return;
    gateZRef.current += speedRef.current * dt;
    if (gateRef.current) gateRef.current.position.z = gateZRef.current;
    if (gateZRef.current >= RESOLVE_Z) {
      lockRef.current = true;
      onResolve(laneRef.current === correctRef.current);
    }
  });
  return null;
}

/* ============================================================ */
export function MathDrive3D({ onClose, addStars, showToast, playSound, advanceQuest, avatarSeed = 'Fin', gameKey = 'Math Dash', difficulty = 'easy' }: any) {
  const config = GAME_CONFIGS[gameKey] || GAME_CONFIGS['Math Dash'];
  const first = useMemo(() => config.makeRound(difficulty), [config, difficulty]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState<Round>(first);
  const [lane, setLane] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const carSrc = useMemo(() => CARS[Math.floor(Math.random() * CARS.length)], []);

  const laneRef = useRef(1);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const correctRef = useRef(first.correct);
  const answersRef = useRef<string[]>(first.answers);
  const gateRef = useRef<THREE.Group | null>(null);
  const gateZRef = useRef(SPAWN_Z);
  const speedRef = useRef(8);
  const lockRef = useRef(false);
  const runningRef = useRef(true);
  const reactionRef = useRef('drive');

  const newQuestion = () => {
    const r = config.makeRound(difficulty);
    correctRef.current = r.correct; answersRef.current = r.answers;
    setRound(r);
    gateZRef.current = SPAWN_Z;
    lockRef.current = false;
  };

  useEffect(() => { newQuestion(); /* eslint-disable-next-line */ }, []);

  const resolve = (correct: boolean) => {
    if (correct) {
      scoreRef.current += 1; setScore(scoreRef.current);
      speedRef.current = Math.min(18, 9 + scoreRef.current * 0.5);
      reactionRef.current = 'emote-yes'; playSound('win');
      confetti({ particleCount: 130, spread: 100, startVelocity: 45, origin: { y: 0.55 }, colors: ['#a3e635', '#f97316', '#9333ea', '#fde047', '#ffffff'] });
      setTimeout(() => confetti({ particleCount: 60, spread: 70, angle: 60, origin: { x: 0, y: 0.7 } }), 120);
      setTimeout(() => confetti({ particleCount: 60, spread: 70, angle: 120, origin: { x: 1, y: 0.7 } }), 120);
      setTimeout(() => { reactionRef.current = 'drive'; }, 900);
    } else {
      livesRef.current -= 1; setLives(livesRef.current);
      reactionRef.current = 'emote-no'; playSound('lose');
      if (livesRef.current <= 0) {
        runningRef.current = false;
        addStars(scoreRef.current * 10);
        if (scoreRef.current > 0) showToast(`Earned ${scoreRef.current * 10} Stars!`);
        setTimeout(() => setGameOver(true), 700);
        return;
      }
      setTimeout(() => { reactionRef.current = 'drive'; }, 900);
    }
    setTimeout(newQuestion, 250);
  };

  const move = (dir: number) => {
    if (!runningRef.current) return;
    laneRef.current = Math.max(0, Math.min(2, laneRef.current + dir));
    setLane(laneRef.current); playSound('whoosh');
  };
  const goLane = (i: number) => { if (!runningRef.current) return; laneRef.current = i; setLane(i); playSound('whoosh'); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') move(-1); if (e.key === 'ArrowRight') move(1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const restart = () => {
    scoreRef.current = 0; livesRef.current = 3; laneRef.current = 1; speedRef.current = 9;
    setScore(0); setLives(3); setLane(1); runningRef.current = true; reactionRef.current = 'drive';
    setGameOver(false); newQuestion();
  };

  return (
    <div className="w-full h-full flex flex-col bg-sky-300 rounded-3xl overflow-hidden relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* HUD: hearts + score row */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5 bg-black/40 rounded-full px-3 py-2">
            {[0, 1, 2].map(i => <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />)}
          </div>
          <HostBadge seed={config.host} />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-lime-400 border-4 border-black rounded-full px-5 py-1.5 font-black text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">{score}</div>
          <button onClick={onClose} className="bg-white rounded-full p-2 border-2 border-black"><X className="w-7 h-7 text-black" /></button>
        </div>
      </div>

      {/* Big question banner — clearly readable for kids */}
      <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl">
        <div className="bg-white border-4 md:border-[6px] border-black px-6 py-3 md:py-4 rounded-[1.5rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <span className="block font-black uppercase text-xs md:text-sm tracking-[0.3em] text-purple-600 mb-0.5">{config.label}</span>
          <h2 className="text-4xl md:text-6xl font-black text-black whitespace-nowrap leading-none">{round.prompt}</h2>
          {round.big && <div className="text-5xl md:text-7xl leading-tight mt-1 break-words whitespace-normal">{round.big}</div>}
        </div>
      </div>

      {/* 3D scene */}
      <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 5.5, 8], fov: 45 }} className="flex-1">
        <color attach="background" args={["#bfe6fb"]} />
        <fog attach="fog" args={["#bfe6fb", 22, 46]} />
        <hemisphereLight args={["#ffffff", "#8fd05a", 1.1]} />
        <directionalLight position={[6, 12, 6]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}>
          <Road speedRef={speedRef} />
          <City speedRef={speedRef} />
          <Gates answers={round.answers} gateRef={gateRef} />
          <Player seed={avatarSeed} laneRef={laneRef} reactionRef={reactionRef} carSrc={carSrc} />
        </Suspense>
        <Director speedRef={speedRef} gateRef={gateRef} gateZRef={gateZRef} laneRef={laneRef}
          answersRef={answersRef} correctRef={correctRef} lockRef={lockRef} runningRef={runningRef} onResolve={resolve} />
      </Canvas>

      {/* lane controls */}
      <div className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-center gap-6 p-4 z-30">
        <button onClick={() => move(-1)} className="flex-1 max-w-[220px] h-full bg-white border-4 border-black rounded-2xl font-black text-3xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">◀</button>
        <button onClick={() => move(1)} className="flex-1 max-w-[220px] h-full bg-white border-4 border-black rounded-2xl font-black text-3xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">▶</button>
      </div>

      {/* invisible lane tap zones */}
      <div className="absolute inset-0 top-20 bottom-24 flex z-20">
        {[0, 1, 2].map(i => <button key={i} aria-label={`Lane ${i + 1}`} onClick={() => goLane(i)} className="flex-1" />)}
      </div>

      {gameOver && (
        <div className="absolute inset-0 z-40 bg-purple-600/95 flex flex-col items-center justify-center gap-4 text-center p-6">
          <Trophy className="w-24 h-24 text-yellow-400" style={{ filter: 'drop-shadow(3px 3px 0 #000)' }} />
          <h2 className="text-5xl font-black text-white uppercase" style={{ textShadow: '3px 3px 0 #000' }}>Game Over!</h2>
          <p className="text-3xl font-black text-white">Score: {score}</p>
          <p className="text-2xl font-black text-lime-400">+{score * 10} Stars!</p>
          <div className="flex gap-4">
            <button onClick={restart} className="bg-lime-400 border-4 border-black text-black px-8 py-4 rounded-full font-black text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Again</button>
            <button onClick={() => { advanceQuest(); onClose(); }} className="bg-white border-4 border-black text-black px-8 py-4 rounded-full font-black text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// preload world + a car so first frame is ready
[...CARS, ...CITY_BUILDINGS, ...DOWNTOWN, ...TREES, ...LIGHTS, ...PROPS].forEach((m) => useGLTF.preload(m));
