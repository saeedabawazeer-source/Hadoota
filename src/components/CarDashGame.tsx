import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Car, Heart, Trophy, X } from 'lucide-react';

export function CarDashGame({ onClose, addStars, showToast, playSound, advanceQuest }: any) {
  const [lane, setLane] = useState(1); // 0, 1, 2
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState({ num1: 2, num2: 2, op: '+' });
  const [answers, setAnswers] = useState([3, 4, 5]);
  const [blockY, setBlockY] = useState(0); // 0 to 100
  const [gameOver, setGameOver] = useState(false);

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
  }, [blockY, lane, answers, question, gameOver, score, playSound, addStars, showToast]);

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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-white border-4 border-black px-8 py-4 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl font-black text-black">{question.num1} {question.op} {question.num2} = ?</h2>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex">
        {/* Lanes */}
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 border-r-2 border-gray-700/50 relative" onClick={() => setLane(i)}>
            {/* Block */}
            <div 
              className="absolute w-full flex justify-center transition-all duration-75"
              style={{ top: `${blockY}%` }}
            >
              <div className="bg-blue-500 border-4 border-black w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-white font-black text-3xl">{answers[i]}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Car */}
        <div 
          className="absolute bottom-10 w-1/3 flex justify-center transition-all duration-200"
          style={{ left: `${lane * 33.33}%` }}
        >
          <div className="bg-lime-400 border-4 border-black w-20 h-24 md:w-24 md:h-32 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
            <Car className="w-12 h-12 text-black" />
            <div className="absolute -bottom-4 left-2 w-4 h-8 bg-gray-800 rounded-full"></div>
            <div className="absolute -bottom-4 right-2 w-4 h-8 bg-gray-800 rounded-full"></div>
            <div className="absolute -top-4 left-2 w-4 h-8 bg-gray-800 rounded-full"></div>
            <div className="absolute -top-4 right-2 w-4 h-8 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-gray-800 border-t-4 border-black flex items-center justify-center gap-8 p-4 z-20">
        <button 
          onClick={moveLeft}
          className="flex-1 h-full bg-white border-4 border-black rounded-2xl font-black text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          LEFT
        </button>
        <button 
          onClick={moveRight}
          className="flex-1 h-full bg-white border-4 border-black rounded-2xl font-black text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          RIGHT
        </button>
      </div>
    </div>
  );
}
