import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const SHAPES = [
  { name: 'Circle', emoji: '🔴', color: 'bg-red-400', sides: 0 },
  { name: 'Square', emoji: '🟦', color: 'bg-blue-400', sides: 4 },
  { name: 'Triangle', emoji: '🔺', color: 'bg-yellow-400', sides: 3 },
  { name: 'Star', emoji: '⭐', color: 'bg-amber-400', sides: 5 },
  { name: 'Diamond', emoji: '🔷', color: 'bg-cyan-400', sides: 4 },
  { name: 'Heart', emoji: '❤️', color: 'bg-pink-400', sides: 0 },
  { name: 'Pentagon', emoji: '⬟', color: 'bg-purple-400', sides: 5 },
  { name: 'Hexagon', emoji: '⬡', color: 'bg-green-400', sides: 6 },
];

interface ShapeSortGameProps {
  onClose: () => void;
  addStars: (n: number) => void;
  showToast: (msg: string) => void;
  playSound: (type: 'pop' | 'win' | 'lose') => void;
  advanceQuest: () => void;
  difficulty?: string;
}

interface Challenge {
  type: 'identify' | 'count_sides' | 'odd_one_out';
  prompt: string;
  shapes: typeof SHAPES[number][];
  options: string[];
  answer: string;
}

function generateChallenge(difficulty: string): Challenge {
  const types: Challenge['type'][] = difficulty === 'easy'
    ? ['identify']
    : difficulty === 'medium'
      ? ['identify', 'count_sides']
      : ['identify', 'count_sides', 'odd_one_out'];

  const type = types[Math.floor(Math.random() * types.length)];
  const shuffled = [...SHAPES].sort(() => Math.random() - 0.5);

  if (type === 'identify') {
    const target = shuffled[0];
    const wrongNames = shuffled.filter(s => s.name !== target.name).slice(0, 2).map(s => s.name);
    return {
      type,
      prompt: `What shape is this?`,
      shapes: [target],
      options: [target.name, ...wrongNames].sort(() => Math.random() - 0.5),
      answer: target.name,
    };
  }

  if (type === 'count_sides') {
    const withSides = SHAPES.filter(s => s.sides > 0);
    const target = withSides[Math.floor(Math.random() * withSides.length)];
    const wrongs = [target.sides + 1, Math.max(1, target.sides - 1)].map(String);
    return {
      type,
      prompt: `How many sides does a ${target.name} have?`,
      shapes: [target],
      options: [String(target.sides), ...wrongs].sort(() => Math.random() - 0.5),
      answer: String(target.sides),
    };
  }

  // odd_one_out
  const mainShape = shuffled[0];
  const oddShape = shuffled.find(s => s.name !== mainShape.name)!;
  const display = [mainShape, mainShape, oddShape, mainShape].sort(() => Math.random() - 0.5);
  return {
    type,
    prompt: 'Which one is different?',
    shapes: display,
    options: [mainShape.name, oddShape.name, shuffled[2]?.name || 'Pentagon'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).sort(() => Math.random() - 0.5),
    answer: oddShape.name,
  };
}

export function ShapeSortGame({ onClose, addStars, showToast, playSound, advanceQuest, difficulty = 'easy' }: ShapeSortGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(() => generateChallenge(difficulty));
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const maxRounds = 10;

  useEffect(() => {
    setChallenge(generateChallenge(difficulty));
    setAnswered(false);
    setSelectedAnswer(null);
  }, [round, difficulty]);

  const handleAnswer = (answer: string) => {
    if (answered || gameOver) return;
    setAnswered(true);
    setSelectedAnswer(answer);

    if (answer === challenge.answer) {
      playSound('win');
      const pts = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 25;
      setScore(s => s + 1);
      addStars(pts);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ['#A3E635', '#FFFFFF'] });

      setTimeout(() => {
        if (round + 1 >= maxRounds) {
          setGameOver(true);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } else {
          setRound(r => r + 1);
        }
      }, 1200);
    } else {
      playSound('lose');
      setLives(l => {
        if (l <= 1) {
          setTimeout(() => {
            setGameOver(true);
            if (score > 0) showToast(`Earned ${score * 5} Stars!`);
          }, 800);
          return 0;
        }
        setTimeout(() => setRound(r => r + 1), 1200);
        return l - 1;
      });
    }
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-violet-400 to-purple-600 p-6 rounded-3xl">
        <Trophy className="w-28 h-28 md:w-36 md:h-36 text-yellow-300 mb-6 drop-shadow-lg" />
        <h2 className="text-4xl md:text-5xl font-bold text-white uppercase mb-3" >
          {score >= maxRounds * 0.7 ? 'Shape Master!' : score > 0 ? 'Good Job!' : 'Game Over!'}
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-white mb-2">{score} / {maxRounds} Correct</p>
        <button
          onClick={() => { advanceQuest(); onClose(); }}
          className="bg-lime-400 border border-slate-200 text-slate-800 px-8 py-4 rounded-full font-bold text-xl uppercase shadow-xl shadow-slate-200/50 hover:bg-lime-500 mt-6 transition-colors"
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-indigo-300 to-violet-500 rounded-3xl overflow-hidden relative border border-slate-200 shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 shrink-0 z-20 bg-slate-800/20 backdrop-blur-sm">
        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-7 h-7 md:w-8 md:h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500/50'}`} />
          ))}
        </div>
        <div className="bg-white border border-slate-200 px-4 py-1.5 rounded-full font-bold text-sm md:text-base shadow-xl shadow-slate-200/50 uppercase tracking-widest">
          {round + 1} / {maxRounds}
        </div>
        <button onClick={onClose} className="bg-white rounded-full p-2 border border-slate-200 hover:bg-red-100 transition-colors" aria-label="Close game">
          <X className="w-5 h-5 md:w-6 md:h-6 text-slate-800" />
        </button>
      </div>

      {/* Prompt */}
      <div className="text-center py-3 md:py-4 shrink-0 z-10 px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white uppercase" >
          {challenge.prompt}
        </h2>
      </div>

      {/* Shape display */}
      <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 px-6 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center justify-center gap-4 md:gap-6 flex-wrap"
          >
            {challenge.shapes.map((shape, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                className={`w-24 h-24 md:w-32 md:h-32 ${shape.color} border border-slate-200 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50`}
              >
                <span className="text-5xl md:text-6xl">{shape.emoji}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 px-4 pb-4 shrink-0">
        {challenge.options.map(opt => {
          let btnClass = 'bg-white border border-slate-200 text-slate-800 hover:bg-lime-100';
          if (answered) {
            if (opt === challenge.answer) btnClass = 'bg-green-500 border border-slate-200 text-white';
            else if (opt === selectedAnswer) btnClass = 'bg-red-500 border border-slate-200 text-white';
            else btnClass = 'bg-gray-300 border border-slate-200 text-gray-500 opacity-50';
          }
          return (
            <motion.button
              key={opt}
              whileHover={!answered ? { scale: 1.05 } : {}}
              whileTap={!answered ? { scale: 0.92 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`py-4 md:py-5 rounded-2xl font-bold text-lg md:text-2xl uppercase shadow-xl shadow-slate-200/50 transition-all ${btnClass}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
