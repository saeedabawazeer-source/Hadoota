import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Heart, Trophy, X, Scissors } from 'lucide-react';
import confetti from 'canvas-confetti';
import { characterFor } from '../data/characters';
import { complexionFor } from '../data/complexions';
import { GAME_CONFIGS, escalate } from '../data/games3d';
import type { Round } from '../data/games3d';
import { MathDrive3D } from './MathDrive3D';
import { HostBadge } from './HostBadge';

/* =====================================================================
   Shared bits used by every "pick-the-answer" mechanic.
   GameShell owns score / lives / rounds / game-over. Each Scene just
   draws a different 3D world and calls onPick(i) when the kid taps.
   ===================================================================== */

const LANE_X = [-2.7, 0, 2.7];
const POD_COLORS = ['#d946ef', '#22c55e', '#3b82f6'];

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

// A character grounded at y=0, facing the camera, that reacts to right/wrong.
function SceneChar({ seed, complexion, reaction, pos = [0, 0, 1], facing = 0, height = 1.7 }: {
  seed: string; complexion?: string; reaction: 'idle' | 'yes' | 'no'; pos?: [number, number, number]; facing?: number; height?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const char = characterFor(seed);
  const { scene, animations } = useGLTF(char.model);
  const { actions } = useAnimations(animations, group);
  const current = useRef('');
  const scale = useMemo(() => {
    const b = new THREE.Box3().setFromObject(scene); const s = new THREE.Vector3(); b.getSize(s);
    const sy = Number.isFinite(s.y) && s.y > 0.001 ? s.y : 1;
    return Math.min(20, Math.max(0.05, height / sy));
  }, [scene, height]);
  useEffect(() => { if (char.kind === 'hero') applyComplexion(scene, complexion); }, [scene, complexion, char.kind]);

  useFrame(() => {
    if (!actions) return;
    const want =
      reaction === 'yes' ? (actions['emote-yes'] ? 'emote-yes' : actions['gesture-positive'] ? 'gesture-positive' : actions['dance'] ? 'dance' : 'idle')
      : reaction === 'no' ? (actions['emote-no'] ? 'emote-no' : actions['gesture-negative'] ? 'gesture-negative' : 'idle')
      : 'idle';
    if (want !== current.current) {
      const next = actions[want] || actions['idle'];
      const prev = current.current && actions[current.current];
      if (next) { next.reset().fadeIn(0.15).play(); if (prev) prev.fadeOut(0.15); current.current = want; }
    }
  });
  return <group ref={group} position={pos} rotation={[0, facing, 0]} scale={scale}><primitive object={scene} /></group>;
}

interface SceneProps {
  round: Round; avatarSeed: string; complexion?: string; hostSeed?: string;
  reaction: 'idle' | 'yes' | 'no'; picked: number | null; locked: boolean; removedIdx?: number | null;
  onPick: (i: number) => void;
}

/* =====================================================================
   MECHANIC 1 — GARDEN TAP
   A calm orchard. Three answer balloons bob in the air; tap the right
   one. Correct pops with confetti, wrong wobbles. Pre-readers friendly.
   ===================================================================== */
function Balloon({ i, label, picked, correctIdx, locked, onPick }: {
  i: number; label: string; picked: number | null; correctIdx: number; locked: boolean; onPick: (i: number) => void;
}) {
  const g = useRef<THREE.Group>(null);
  const t0 = useMemo(() => Math.random() * 10, []);
  const wasRight = locked && picked === i && i === correctIdx;
  const wasWrong = locked && picked === i && i !== correctIdx;
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime + t0;
    g.current.position.y = 1.15 + Math.sin(t * 1.6) * 0.16;
    const target = wasRight ? 0.001 : 1;                    // correct balloon pops away
    const s = g.current.scale.x + (target - g.current.scale.x) * 0.2;
    g.current.scale.setScalar(s);
    g.current.rotation.z = wasWrong ? Math.sin(t * 30) * 0.18 : 0; // wrong balloon shakes
  });
  return (
    <group ref={g} position={[LANE_X[i], 1.15, 2.0]}
      onClick={(e) => { e.stopPropagation(); if (!locked) onPick(i); }}
      onPointerOver={() => { if (!locked) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
      {/* string */}
      <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.02, 0.02, 0.9, 6]} /><meshStandardMaterial color="#5b3d22" /></mesh>
      {/* balloon body */}
      <mesh castShadow><sphereGeometry args={[0.95, 24, 24]} /><meshStandardMaterial color={POD_COLORS[i]} emissive={POD_COLORS[i]} emissiveIntensity={0.25} /></mesh>
      <Html position={[0, 0, 0.9]} center distanceFactor={9} pointerEvents="none">
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 44, color: '#fff', textShadow: '3px 3px 0 #000', whiteSpace: 'nowrap' }}>{label}</div>
      </Html>
    </group>
  );
}

const ORCHARD = [
  { src: '/mini-world/island/tree.glb', pos: [-4.6, 0, -2.4] as [number, number, number], s: 1.4 },
  { src: '/mini-world/island/tree-pine.glb', pos: [4.6, 0, -2.4] as [number, number, number], s: 1.4 },
  { src: '/mini-world/island/flowers.glb', pos: [-3.4, 0, 1.4] as [number, number, number], s: 1.2 },
  { src: '/mini-world/island/flowers-tall.glb', pos: [3.4, 0, 1.4] as [number, number, number], s: 1.2 },
  { src: '/mini-world/island/mushrooms.glb', pos: [-1.8, 0, 2.2] as [number, number, number], s: 1.1 },
  { src: '/mini-world/island/hedge.glb', pos: [2.0, 0, 2.2] as [number, number, number], s: 1.1 },
];
function Prop({ src, pos, s }: { src: string; pos: [number, number, number]; s: number }) {
  const { scene } = useGLTF(src);
  const c = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={c} position={pos} scale={s} />;
}

function GardenScene({ round, avatarSeed, complexion, reaction, picked, locked, onPick }: SceneProps) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 3.4, 8.2], fov: 42 }} className="flex-1">
      <color attach="background" args={["#bde8ff"]} />
      <hemisphereLight args={["#ffffff", "#8fd05a", 1.15]} />
      <directionalLight position={[6, 12, 6]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}>
        {/* soft grassy ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
          <circleGeometry args={[9, 48]} /><meshStandardMaterial color="#7cc95f" />
        </mesh>
        {ORCHARD.map((p, i) => <Prop key={i} src={p.src} pos={p.pos} s={p.s} />)}
        {round.answers.map((a, i) => (
          <Balloon key={i} i={i} label={a} picked={picked} correctIdx={round.correct} locked={locked} onPick={onPick} />
        ))}
        <SceneChar seed={avatarSeed} complexion={complexion} reaction={reaction} pos={[0, 0, -0.8]} facing={0} height={1.7} />
      </Suspense>
    </Canvas>
  );
}

/* =====================================================================
   MECHANIC 2 — QUIZ STAGE
   A game-show podium. Three big buzzer buttons rise in front of the
   host character; tap one. Correct lights green + lifts, wrong dims red.
   ===================================================================== */
function Podium({ i, label, picked, correctIdx, locked, removed, onPick }: {
  i: number; label: string; picked: number | null; correctIdx: number; locked: boolean; removed?: boolean; onPick: (i: number) => void;
}) {
  const g = useRef<THREE.Group>(null);
  const revealRight = locked && i === correctIdx;
  const revealWrong = locked && picked === i && i !== correctIdx;
  const color = removed ? '#4b4b57' : revealRight ? '#22c55e' : revealWrong ? '#ef4444' : POD_COLORS[i];
  useFrame(() => {
    if (!g.current) return;
    const target = revealRight ? 0.55 : 0;                 // correct podium lifts
    g.current.position.y += (target - g.current.position.y) * 0.15;
  });
  return (
    <group ref={g} position={[LANE_X[i], 0, 1.6]}
      onClick={(e) => { e.stopPropagation(); if (!locked && !removed) onPick(i); }}
      onPointerOver={() => { if (!locked && !removed) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
      {/* stand */}
      <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[1.9, 1.1, 1.0]} /><meshStandardMaterial color="#3a2f4a" /></mesh>
      {/* button top */}
      <mesh position={[0, 1.35, 0.05]} castShadow><boxGeometry args={[1.7, 0.55, 0.9]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={removed ? 0.05 : 0.5} /></mesh>
      <Html position={[0, 1.4, 0.55]} center distanceFactor={11} pointerEvents="none">
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 22, lineHeight: 1.05, color: removed ? 'rgba(255,255,255,0.35)' : '#fff', textShadow: '2px 2px 0 #000', textAlign: 'center', width: 130, wordBreak: 'break-word' }}>{removed ? '✕' : label}</div>
      </Html>
    </group>
  );
}

function StageScene({ round, avatarSeed, complexion, hostSeed, reaction, picked, locked, removedIdx, onPick }: SceneProps) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 3.8, 8], fov: 42 }} className="flex-1">
      <color attach="background" args={["#2a1650"]} />
      <hemisphereLight args={["#ffffff", "#4c1d95", 1.0]} />
      <directionalLight position={[0, 12, 8]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[0, 9, 2]} angle={0.7} penumbra={0.6} intensity={1.6} color="#ffd36e" />
      <Suspense fallback={null}>
        {/* stage floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
          <circleGeometry args={[9, 48]} /><meshStandardMaterial color="#6d28d9" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
          <ringGeometry args={[3.4, 3.7, 48]} /><meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} />
        </mesh>
        {round.answers.map((a, i) => (
          <Podium key={i} i={i} label={a} picked={picked} correctIdx={round.correct} locked={locked} removed={removedIdx === i} onPick={onPick} />
        ))}
        {/* The subject's animal host runs the show; falls back to the kid's own avatar if a subject has none. */}
        <SceneChar seed={hostSeed || avatarSeed} complexion={complexion} reaction={reaction} pos={[0, 0, -2.4]} facing={0} height={2.0} />
      </Suspense>
    </Canvas>
  );
}

const GARDEN_GAMES = new Set(['Counting', 'Shapes', 'Memory Quiz', 'Spelling']);
// Bank-fed trivia subjects — these get the "millionaire" treatment: a
// difficulty ladder that climbs with a streak, plus a one-time 50:50 lifeline.
const STAGE_GAMES = new Set(['Science', 'Geography']);
const TIER_LABEL: Record<string, string> = { easy: '🌱 Rookie', medium: '⭐ Explorer', hard: '🏆 Champion' };

/* =====================================================================
   GAME SHELL — HUD, scoring, round loop, game-over. Mechanic-agnostic.
   ===================================================================== */
function GameShell({ onClose, addStars, showToast, playSound, advanceQuest, avatarSeed, complexion, gameKey, difficulty, Scene }: any) {
  const config = GAME_CONFIGS[gameKey] || GAME_CONFIGS['Counting'];
  const isTrivia = STAGE_GAMES.has(gameKey);
  const [round, setRound] = useState<Round>(() => config.makeRound(difficulty, 0));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [reaction, setReaction] = useState<'idle' | 'yes' | 'no'>('idle');
  const [removedIdx, setRemovedIdx] = useState<number | null>(null);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const lockRef = useRef(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const streakRef = useRef(0);

  const next = (nextStreak = streakRef.current) => {
    setPicked(null); setReaction('idle'); setRemovedIdx(null); lockRef.current = false;
    setRound(config.makeRound(difficulty, nextStreak));
  };

  // When the game (config) or difficulty changes, start a fresh matching round.
  useEffect(() => {
    scoreRef.current = 0; livesRef.current = 3; streakRef.current = 0;
    setScore(0); setLives(3); setStreak(0); setGameOver(false);
    setPicked(null); setReaction('idle'); setRemovedIdx(null); setUsedFiftyFifty(false); lockRef.current = false;
    setRound(config.makeRound(difficulty, 0));
  }, [config, difficulty]);

  const onPick = (i: number) => {
    if (lockRef.current || gameOver) return;
    lockRef.current = true;
    setPicked(i);
    const correct = i === round.correct;
    if (correct) {
      scoreRef.current += 1; setScore(scoreRef.current);
      streakRef.current += 1; setStreak(streakRef.current);
      setReaction('yes'); playSound('win');
      confetti({ particleCount: 130, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors: ['#a3e635', '#f97316', '#9333ea', '#fde047', '#ffffff'] });
      setTimeout(() => next(streakRef.current), 1100);
    } else {
      livesRef.current -= 1; setLives(livesRef.current);
      streakRef.current = 0; setStreak(0);
      setReaction('no'); playSound('lose');
      if (livesRef.current <= 0) {
        addStars(scoreRef.current * 10);
        if (scoreRef.current > 0) showToast(`Earned ${scoreRef.current * 10} Stars!`);
        setTimeout(() => setGameOver(true), 900);
        return;
      }
      setTimeout(() => next(0), 1100);
    }
  };

  const useFiftyFifty = () => {
    if (usedFiftyFifty || lockRef.current || gameOver) return;
    const wrongIdx = round.answers.map((_, i) => i).filter((i) => i !== round.correct);
    const drop = wrongIdx[Math.floor(Math.random() * wrongIdx.length)];
    setRemovedIdx(drop); setUsedFiftyFifty(true);
  };

  const restart = () => {
    scoreRef.current = 0; livesRef.current = 3; streakRef.current = 0;
    setScore(0); setLives(3); setStreak(0); setUsedFiftyFifty(false);
    setGameOver(false); next(0);
  };

  const tier = isTrivia ? TIER_LABEL[escalate(difficulty, streak)] : null;

  return (
    <div className="w-full h-full flex flex-col bg-sky-300 rounded-3xl overflow-hidden relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* HUD (pass-through except the actual badges) */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30 pointer-events-none">
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5 bg-black/40 rounded-full px-3 py-2 pointer-events-auto">
            {[0, 1, 2].map(i => <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />)}
          </div>
          <HostBadge seed={config.host} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="bg-lime-400 border-4 border-black rounded-full px-5 py-1.5 font-black text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">{score}</div>
            <button onClick={onClose} className="bg-white rounded-full p-2 border-2 border-black"><X className="w-7 h-7 text-black" /></button>
          </div>
          {isTrivia && (
            <div className="flex items-center gap-2 pointer-events-auto">
              {tier && <span className="bg-black/40 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">{tier}</span>}
              <button onClick={useFiftyFifty} disabled={usedFiftyFifty}
                title="50:50 — remove one wrong answer"
                className={`flex items-center gap-1 border-2 border-black rounded-full px-3 py-1.5 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${usedFiftyFifty ? 'bg-gray-400 text-gray-600 opacity-60' : 'bg-yellow-300 text-black hover:bg-yellow-200'}`}>
                <Scissors className="w-3.5 h-3.5" /> 50:50
              </button>
            </div>
          )}
        </div>
      </div>

      {/* question banner — compact, pinned to the top so the 3D board below stays clear */}
      <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl pointer-events-none">
        <div className="bg-white border-4 border-black px-5 py-2 md:py-2.5 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
          <span className="block font-black uppercase text-[10px] md:text-xs tracking-[0.3em] text-purple-600">{config.label}</span>
          <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">{round.prompt}</h2>
          {round.big && <div className="text-3xl md:text-4xl leading-tight break-words whitespace-normal">{round.big}</div>}
        </div>
      </div>

      <Scene round={round} avatarSeed={avatarSeed} complexion={complexion} hostSeed={config.host} reaction={reaction} picked={picked} locked={lockRef.current} removedIdx={removedIdx} onPick={onPick} />

      {/* invisible answer columns — guarantees a tap always registers (balloons/podiums are the visual) */}
      <div className="absolute inset-x-0 bottom-0 top-[46%] flex z-20">
        {[0, 1, 2].map(i => <button key={i} aria-label={`Answer ${i + 1}`} onClick={() => onPick(i)} disabled={removedIdx === i} className="flex-1" />)}
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center z-30 pointer-events-none">
        <span className="bg-black/40 text-white font-black uppercase text-sm tracking-widest px-4 py-1.5 rounded-full">Tap your answer</span>
      </div>

      {gameOver && (
        <div className="absolute inset-0 z-40 bg-purple-600/95 flex flex-col items-center justify-center gap-4 text-center p-6">
          <Trophy className="w-24 h-24 text-yellow-400" style={{ filter: 'drop-shadow(3px 3px 0 #000)' }} />
          <h2 className="text-5xl font-black text-white uppercase" style={{ textShadow: '3px 3px 0 #000' }}>Great Job!</h2>
          <p className="text-3xl font-black text-white">Score: {score}</p>
          <p className="text-2xl font-black text-lime-400">+{score * 10} Stars!</p>
          <div className="flex gap-4">
            <button onClick={restart} className="bg-lime-400 border-4 border-black text-black px-8 py-4 rounded-full font-black text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Again</button>
            <button onClick={() => { advanceQuest?.(); onClose(); }} className="bg-white border-4 border-black text-black px-8 py-4 rounded-full font-black text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   ROUTER — maps each game to a genuinely different mechanic.
   ===================================================================== */
export function GameRouter(props: any) {
  const key = props.gameKey;
  if (GARDEN_GAMES.has(key)) return <GameShell {...props} Scene={GardenScene} />;
  if (STAGE_GAMES.has(key)) return <GameShell {...props} Scene={StageScene} />;
  return <MathDrive3D {...props} />; // Math Dash keeps the driving game
}

[...ORCHARD.map(o => o.src)].forEach((s) => useGLTF.preload(s));
