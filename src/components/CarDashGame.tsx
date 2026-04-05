import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Car, Heart, Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function CarDashGame({ onClose, addStars, showToast, playSound, advanceQuest }: any) {
  const [lane, setLane] = useState(1); // 0, 1, 2
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState({ num1: 2, num2: 2, op: '+' });
  const [answers, setAnswers] = useState([3, 4, 5]);
  const [blockY, setBlockY] = useState(0); // 0 to 100
  const [gameOver, setGameOver] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const generateQuestion = () => {
    const isAdd = Math.random() > 0.5;
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const op = isAdd ? '+' : '-';
    let ans = isAdd ? num1 + num2 : num1 - num2;
    if (ans < 0) {
      ans = num2 - num1;
      setQuestion({ num1: num2, num2: num1, op });
    } else {
      setQuestion({ num1, num2, op });
    }

    const wrong1 = ans + Math.floor(Math.random() * 3) + 1;
    const wrong2 = ans - Math.floor(Math.random() * 3) - 1;
    const newAnswers = [ans, wrong1, wrong2].sort(() => Math.random() - 0.5);
    setAnswers(newAnswers);
    setBlockY(0);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const speed = 1.5 + (score * 0.15); // Increases speed as score goes up
    const interval = setInterval(() => {
      setBlockY(y => y + speed);
    }, 50);
    return () => clearInterval(interval);
  }, [gameOver, score]);

  useEffect(() => {
    if (blockY >= 85 && !gameOver) {
      const carAnswer = answers[lane];
      const correct = question.op === '+' ? question.num1 + question.num2 : question.num1 - question.num2;
      
      if (carAnswer === correct) {
        playSound('win');
        setScore(s => s + 1);
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.8, x: lane === 0 ? 0.3 : lane === 1 ? 0.5 : 0.7 },
          colors: ['#a3e635', '#ffffff']
        });
        generateQuestion();
      } else {
        playSound('wrong');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setLives(l => {
          if (l <= 1) {
            setGameOver(true);
            addStars(score * 10);
            if (score > 0) showToast(`Earned ${score * 10} Stars!`);
            return 0;
          }
          return l - 1;
        });
        generateQuestion();
      }
    }
  }, [blockY, lane, answers, question, gameOver, score, playSound, addStars, showToast, confetti]);

  const moveLeft = () => setLane(l => Math.max(0, l - 1));
  const moveRight = () => setLane(l => Math.min(2, l + 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-purple-600 p-6 rounded-3xl">
        <Trophy className="w-32 h-32 text-yellow-400 mb-6" />
        <h2 className="text-5xl font-bold text-white uppercase mb-4">Game Over!</h2>
        <p className="text-3xl font-bold text-white mb-8">Score: {score}</p>
        <p className="text-2xl font-bold text-lime-400 mb-8">+{score * 10} Stars!</p>
        <button 
          onClick={() => {
            advanceQuest();
            onClose();
          }}
          className="bg-lime-400 border border-slate-200 text-slate-800 px-8 py-4 rounded-full font-bold text-2xl uppercase shadow-xl shadow-slate-200/50 hover:bg-lime-500"
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col bg-gray-900 rounded-3xl overflow-hidden relative border border-slate-200 shadow-xl shadow-slate-200/50"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          ))}
        </div>
        <div className="text-white font-bold text-3xl">{score}</div>
        <button onClick={onClose} className="bg-white rounded-full p-2 border border-slate-200">
          <X className="w-6 h-6 text-slate-800" />
        </button>
      </div>

      {/* Question */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-white border border-slate-200 px-8 py-4 rounded-full shadow-xl shadow-slate-200/50">
        <h2 className="text-4xl font-bold text-slate-800">{question.num1} {question.op} {question.num2} = ?</h2>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex bg-gray-800 overflow-hidden">
        {/* Moving Road Dashes */}
        <motion.div 
          animate={{ y: [0, 300] }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          className="absolute inset-0 flex pointer-events-none z-0"
          style={{ height: '200%', top: '-100%' }}
        >
          <div className="flex-1 border-r-8 border-dashed border-white/20"></div>
          <div className="flex-1 border-r-8 border-dashed border-white/20"></div>
          <div className="flex-1"></div>
        </motion.div>

        {/* Lanes */}
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 relative z-10" onClick={() => setLane(i)}>
            {/* Block */}
            <div 
              className="absolute w-full flex justify-center transition-all px-2 md:px-4"
              style={{ top: `${blockY}%` }}
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180, 270, 360] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="bg-fuchsia-600 border-4 border-fuchsia-300 w-full aspect-square max-w-[100px] rounded-full flex items-center justify-center shadow-[0_0_30px_#d946ef] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4),_transparent)] rounded-full pt-1 pl-1"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-60 filter blur-[1px]"></div>
                <span className="text-white font-bold text-4xl md:text-5xl relative z-10" >{answers[i]}</span>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Car */}
        <div 
          className="absolute bottom-10 w-1/3 flex justify-center transition-all duration-200"
          style={{ left: `${lane * 33.33}%` }}
        >
          <motion.div 
            animate={{ y: [0, -3, 0], rotate: [0, -1, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="bg-gradient-to-t from-red-600 to-red-400 border border-slate-200 w-20 h-28 md:w-24 md:h-32 rounded-3xl flex flex-col items-center justify-start pt-4 shadow-xl shadow-slate-200/50 relative z-10"
          >
            <div className="w-12 h-6 bg-blue-300/80 rounded-t-lg border border-slate-200 mb-1"></div>
            <div className="w-12 h-8 bg-blue-300/80 rounded-b-lg border border-slate-200"></div>
            
            <div className="absolute -bottom-2 left-0 w-6 h-10 bg-slate-800 rounded-lg transform -skew-x-12"></div>
            <div className="absolute -bottom-2 right-0 w-6 h-10 bg-slate-800 rounded-lg transform skew-x-12"></div>
            <div className="absolute -top-2 left-1 w-5 h-8 bg-slate-800 rounded-lg"></div>
            <div className="absolute -top-2 right-1 w-5 h-8 bg-slate-800 rounded-lg"></div>
            
            {/* Headlights */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 rounded-full border-2 border-orange-500 shadow-[0_0_10px_#fde047]"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full border-2 border-orange-500 shadow-[0_0_10px_#fde047]"></div>
          </motion.div>
          {/* Dust trail */}
          <motion.div 
            animate={{ opacity: [0.5, 0], scale: [1, 2] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute -bottom-8 bg-white/20 blur-md w-16 h-16 rounded-full"
          ></motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-gray-800 border-t-4 border-black flex items-center justify-center gap-8 p-4 z-20">
        <button 
          onClick={moveLeft}
          className="flex-1 h-full bg-white border border-slate-200 rounded-2xl font-bold text-3xl shadow-xl shadow-slate-200/50 active:translate-y-1 active:shadow-none"
        >
          LEFT
        </button>
        <button 
          onClick={moveRight}
          className="flex-1 h-full bg-white border border-slate-200 rounded-2xl font-bold text-3xl shadow-xl shadow-slate-200/50 active:translate-y-1 active:shadow-none"
        >
          RIGHT
        </button>
      </div>
    </motion.div>
  );
}
