import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Trophy, X, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export function FallingBlocksGame({ onClose, addStars, showToast, playSound, advanceQuest, gameData }: any) {
  const [lane, setLane] = useState(1); // 0, 1, 2
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [blockY, setBlockY] = useState(0); // 0 to 100
  const [gameOver, setGameOver] = useState(false);

  const currentQuestion = gameData.questions[questionIndex % gameData.questions.length];

  const generateQuestion = () => {
    const q = gameData.questions[(questionIndex + 1) % gameData.questions.length];
    setQuestionIndex(i => i + 1);
    
    // Create answers array with the correct answer and 2 random options
    const newAnswers = [...q.options].sort(() => Math.random() - 0.5);
    setAnswers(newAnswers);
    setBlockY(0);
  };

  useEffect(() => {
    const newAnswers = [...currentQuestion.options].sort(() => Math.random() - 0.5);
    setAnswers(newAnswers);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const speed = 1.0 + (score * 0.1); // Increases speed as score goes up
    const interval = setInterval(() => {
      setBlockY(y => y + speed);
    }, 50);
    return () => clearInterval(interval);
  }, [gameOver, score]);

  useEffect(() => {
    if (blockY >= 85 && !gameOver) {
      const playerAnswer = answers[lane];
      const correct = currentQuestion.a;
      
      if (playerAnswer === correct) {
        playSound('win');
        setScore(s => s + 1);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8, x: lane === 0 ? 0.3 : lane === 1 ? 0.5 : 0.7 },
          colors: ['#a3e635', '#ffffff']
        });
        generateQuestion();
      } else {
        playSound('wrong');
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
  }, [blockY, lane, answers, currentQuestion, gameOver, score, playSound, addStars, showToast, confetti]);

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
        <h2 className="text-5xl font-black text-white uppercase mb-4">Game Over!</h2>
        <p className="text-3xl font-bold text-white mb-8">Score: {score}</p>
        <p className="text-2xl font-bold text-lime-400 mb-8">+{score * 10} Stars!</p>
        <button 
          onClick={() => {
            advanceQuest();
            onClose();
          }}
          className="bg-lime-400 border-4 border-black text-black px-8 py-4 rounded-full font-black text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-500"
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 rounded-3xl overflow-hidden relative border-4 border-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-black/50 backdrop-blur-sm">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          ))}
        </div>
        <div className="text-white font-black text-3xl">{score}</div>
        <button onClick={onClose} className="bg-white rounded-full p-2 border-2 border-black">
          <X className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Question */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-white border-4 border-black px-8 py-4 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center w-[90%] max-w-md">
        <h2 className="text-2xl md:text-3xl font-black text-black mb-2">{currentQuestion.q}</h2>
        <div className="flex justify-center scale-75 md:scale-100 origin-top">
          {currentQuestion.visual}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex mt-40">
        {/* Lanes */}
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 border-r-2 border-gray-700/50 relative" onClick={() => setLane(i)}>
            {/* Block */}
            <div 
              className="absolute w-full flex justify-center transition-all duration-75"
              style={{ top: `${blockY}%` }}
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-gradient-to-b from-blue-400 to-blue-600 border-4 border-black w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-12 bg-white/20 blur-md rounded-full"></div>
                <span className="text-white font-black text-2xl md:text-3xl relative z-10" style={{ textShadow: '2px 2px 0px black' }}>{answers[i]}</span>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Player Catcher */}
        <div 
          className="absolute bottom-10 w-1/3 flex justify-center transition-all duration-200"
          style={{ left: `${lane * 33.33}%` }}
        >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-gradient-to-t from-lime-500 to-lime-300 border-4 border-black w-24 h-16 md:w-32 md:h-20 rounded-t-3xl rounded-b-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 w-full h-8 bg-white/20"></div>
              {gameData.mascot && <div className="w-10 h-10 md:w-12 md:h-12 text-black relative z-10 drop-shadow-md">{gameData.mascot}</div>}
            </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-gray-800 border-t-4 border-black flex items-center justify-center gap-8 p-4 z-20">
        <button 
          onClick={moveLeft}
          className="flex-1 h-full bg-white border-4 border-black rounded-2xl font-black text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center justify-center"
        >
          <ArrowLeft className="w-10 h-10" />
        </button>
        <button 
          onClick={moveRight}
          className="flex-1 h-full bg-white border-4 border-black rounded-2xl font-black text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center justify-center"
        >
          <ArrowRight className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
