import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const EMOJIS_BY_DIFFICULTY: Record<string, string[]> = {
  easy: ['🍎', '🌟', '🐱', '🎈', '🌈'],
  medium: ['🦋', '🐶', '🍕', '🚀', '🎵', '🌸', '🐢'],
  hard: ['🎯', '🧩', '🎪', '🦄', '🌺', '🎭', '🎨', '🦊', '🐙'],
};

interface CountingGameProps {
  onClose: () => void;
  addStars: (n: number) => void;
  showToast: (msg: string) => void;
  playSound: (type: 'pop' | 'win' | 'lose') => void;
  advanceQuest: () => void;
  difficulty?: string;
}

export function CountingGame({ onClose, addStars, showToast, playSound, advanceQuest, difficulty = 'easy' }: CountingGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [items, setItems] = useState<{ id: number; emoji: string; x: number; y: number; delay: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const maxRounds = 10;

  const generateRound = useCallback(() => {
    const emojis = EMOJIS_BY_DIFFICULTY[difficulty] || EMOJIS_BY_DIFFICULTY.easy;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    let count: number;
    if (difficulty === 'easy') count = Math.floor(Math.random() * 6) + 2;      // 2-7
    else if (difficulty === 'medium') count = Math.floor(Math.random() * 8) + 4; // 4-11
    else count = Math.floor(Math.random() * 10) + 6;                              // 6-15

    const newItems = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji,
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 70,
      delay: i * 0.08,
    }));

    const wrong1 = count + Math.floor(Math.random() * 3) + 1;
    const wrong2 = Math.max(1, count - Math.floor(Math.random() * 3) - 1);
    const opts = [count, wrong1, wrong2].sort(() => Math.random() - 0.5);

    setTargetCount(count);
    setItems(newItems);
    setOptions(opts);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [difficulty]);

  useEffect(() => {
    generateRound();
  }, [round, generateRound]);

  const handleAnswer = (answer: number) => {
    if (answered || gameOver) return;
    setAnswered(true);
    setSelectedAnswer(answer);

    if (answer === targetCount) {
      playSound('win');
      const pts = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 25;
      setScore(s => s + 1);
      addStars(pts);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 }, colors: ['#A3E635', '#FFFFFF'] });

      setTimeout(() => {
        if (round + 1 >= maxRounds) {
          setGameOver(true);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          showToast(`Amazing! ${score + 1}/${maxRounds} correct!`);
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
            addStars(score * 5);
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-green-400 to-emerald-600 p-6 rounded-3xl">
        <Trophy className="w-28 h-28 md:w-36 md:h-36 text-yellow-300 mb-6 drop-shadow-lg" />
        <h2 className="text-4xl md:text-5xl font-bold text-white uppercase mb-3" >
          {score >= maxRounds * 0.7 ? 'Amazing!' : score > 0 ? 'Good Try!' : 'Game Over!'}
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-white mb-2">{score} / {maxRounds} Correct</p>
        <p className="text-xl font-bold text-lime-300 mb-8">+{score * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 25)} Stars!</p>
        <button
          onClick={() => { advanceQuest(); onClose(); }}
          className="bg-lime-400 border border-slate-200 text-slate-800 px-8 py-4 rounded-full font-bold text-xl uppercase shadow-xl shadow-slate-200/50 hover:bg-lime-500 transition-colors"
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-sky-300 to-sky-500 rounded-3xl overflow-hidden relative border border-slate-200 shadow-xl shadow-slate-200/50">
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
      <div className="text-center py-3 md:py-4 shrink-0 z-10">
        <h2 className="text-2xl md:text-4xl font-bold text-white uppercase" >
          How many do you see?
        </h2>
      </div>

      {/* Game area with objects */}
      <div className="flex-1 relative mx-4 mb-4 bg-white/20 border border-slate-200 rounded-3xl overflow-hidden shadow-inner min-h-0">
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
              transition={{ delay: item.delay, duration: 0.3, y: { repeat: Infinity, duration: 2 + Math.random(), delay: item.delay } }}
              className="absolute text-4xl md:text-5xl select-none pointer-events-none"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 px-4 pb-4 shrink-0">
        {options.map(opt => {
          let btnClass = 'bg-lime-400 border border-slate-200 text-slate-800 hover:bg-lime-300';
          if (answered) {
            if (opt === targetCount) btnClass = 'bg-green-500 border border-slate-200 text-white scale-105';
            else if (opt === selectedAnswer) btnClass = 'bg-red-500 border border-slate-200 text-white';
            else btnClass = 'bg-gray-300 border border-slate-200 text-gray-500 opacity-50';
          }
          return (
            <motion.button
              key={opt}
              whileHover={!answered ? { scale: 1.08 } : {}}
              whileTap={!answered ? { scale: 0.92 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`py-4 md:py-5 rounded-2xl font-bold text-3xl md:text-4xl shadow-xl shadow-slate-200/50 transition-all ${btnClass}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
