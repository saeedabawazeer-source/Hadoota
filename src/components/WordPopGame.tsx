import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trophy, X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WordPopGame({ onClose, addStars, showToast, playSound, advanceQuest, gameData }: any) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [balloons, setBalloons] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  const currentQuestion = gameData.questions[questionIndex % gameData.questions.length];

  const generateBalloons = () => {
    const options = [...currentQuestion.options].sort(() => Math.random() - 0.5);
    const newBalloons = options.map((opt, i) => ({
      id: Math.random().toString(),
      letter: opt,
      x: 15 + (i * 30) + (Math.random() * 10 - 5), // Spread across width
      speed: 10 + Math.random() * 5 + (score * 0.5), // Faster as score increases
      color: ['bg-red-500', 'bg-blue-500', 'bg-lime-500', 'bg-purple-500', 'bg-yellow-500'][Math.floor(Math.random() * 5)]
    }));
    setBalloons(newBalloons);
  };

  useEffect(() => {
    generateBalloons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => {
    if (gameOver || balloons.length === 0) return;
    
    let animationFrameId: number;
    
    // Float balloons up by decrementing a virtual Y value (we'll manage their position using a continuous effect or just CSS animations)
    // Actually, framer-motion handles the floating animation. We just need to check if they clicked the right one.
    // If we want them to fly off screen and respawn, we can just let CSS do it. Let's make it simpler: The balloons stay on screen bobbing, or they float up and new ones appear.
    // Let's just have them float up slowly using framer-motion y: [100vh, -200px]. If they don't click, they lose a life.

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, balloons]);

  const handlePop = (balloon: any, e: any) => {
    if (gameOver) return;
    
    const correct = currentQuestion.a;
    
    if (balloon.letter === correct) {
      playSound('win');
      setScore(s => s + 1);
      
      // Confetti at click location
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({ particleCount: 30, spread: 50, origin: { x, y }, colors: ['#A3E635', '#FFFFFF'] });
      
      // Next question
      setBalloons([]); // clear current
      setTimeout(() => setQuestionIndex(i => i + 1), 500);
    } else {
      playSound('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLives(l => {
        if (l <= 1) {
          setGameOver(true);
          addStars(score * 10);
          if (score > 0) showToast(`Earned ${score * 10} Stars!`);
          return 0;
        }
        return l - 1;
      });
      // Pop the wrong balloon visually
      setBalloons(b => b.filter(x => x.id !== balloon.id));
    }
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-blue-400 p-6 rounded-3xl">
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
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col bg-sky-300 rounded-3xl overflow-hidden relative border border-slate-200 shadow-xl shadow-slate-200/50"
    >
      {/* Background Clouds */}
      <motion.div animate={{ x: [-50, 50, -50] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-20 left-10 w-32 h-16 bg-white/80 rounded-full blur-sm"></motion.div>
      <motion.div animate={{ x: [50, -50, 50] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute top-40 right-20 w-40 h-20 bg-white/60 rounded-full blur-sm"></motion.div>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-slate-800/20 backdrop-blur-sm">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600/50'}`} />
          ))}
        </div>
        <div className="text-white font-bold text-3xl" >{score}</div>
      </div>

      {/* Question */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-white border border-slate-200 px-8 py-4 rounded-3xl shadow-xl shadow-slate-200/50 text-center w-[90%] max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{currentQuestion.q}</h2>
        <div className="flex justify-center scale-75 md:scale-100 origin-top">
          {currentQuestion.visual}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex overflow-hidden w-full">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: '100vh', x: `${balloon.x}vw` }}
              animate={{ y: '-20vh', x: `${balloon.x + (Math.random() * 10 - 5)}vw` }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: balloon.speed, ease: "linear" }}
              onAnimationComplete={() => {
                // If balloon reaches top and it was the correct answer, they lose a life.
                // But Framer Motion onAnimationComplete fires for exits too.
                // Let's just keep it simple and continuously respawn balloons if they fly away.
                if (balloons.find(b => b.id === balloon.id)) {
                   generateBalloons(); // Respawn if missed
                }
              }}
              onClick={(e) => handlePop(balloon, e)}
              className="absolute bottom-0 w-20 h-24 md:w-28 md:h-32 flex flex-col items-center justify-end cursor-pointer"
            >
              {/* Balloon */}
              <div className={`w-full h-[80%] ${balloon.color} rounded-[50%] border border-slate-200 shadow-[ inset_-10px_-10px_0px_rgba(0,0,0,0.2) ] flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute top-2 left-4 w-6 h-6 bg-white/40 rounded-full blur-[2px]"></div>
                <span className="text-white font-bold text-4xl md:text-5xl z-10" >{balloon.letter}</span>
              </div>
              {/* String */}
              <div className="w-1 h-[20%] bg-slate-800"></div>
              {/* Knot */}
              <div className="w-4 h-3 bg-current text-white border border-slate-200 rounded-b-full"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
    </motion.div>
  );
}
