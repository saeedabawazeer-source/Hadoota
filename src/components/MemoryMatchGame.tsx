import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Plane, Rocket, Star as StarIcon, Moon, Sun, Cloud, Heart, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const ICONS = [Plane, Rocket, StarIcon, Moon, Sun, Cloud];

export function MemoryMatchGame({ onClose, addStars, showToast, playSound, advanceQuest }: any) {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Initialize deck
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((Icon, idx) => ({ id: idx, Icon }));
    setCards(deck);
  }, []);

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    
    playSound('pop');
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].Icon === cards[newFlipped[1]].Icon;
      
      if (match) {
        playSound('win');
        setMatched(prev => [...prev, ...newFlipped]);
        setFlipped([]);
        
        // Confetti for match
        confetti({ particleCount: 20, spread: 40, colors: ['#A3E635', '#FFFFFF'] });

        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            setGameOver(true);
            const score = Math.max(10, 50 - moves * 2);
            addStars(score);
            showToast(`Earned ${score} Stars!`);
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.8 }, colors: ['#A3E635', '#FFFFFF'] });
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-purple-600 p-6 rounded-3xl">
        <Trophy className="w-32 h-32 text-yellow-400 mb-6" />
        <h2 className="text-5xl font-bold text-white uppercase mb-4">You Win!</h2>
        <p className="text-3xl font-bold text-white mb-8">Moves: {moves}</p>
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
    <div className="w-full h-full flex flex-col bg-indigo-900 rounded-3xl overflow-hidden relative border border-slate-200 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase" >Memory Match</h2>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-xl shadow-xl shadow-slate-200/50 uppercase">
          Moves: {moves}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl mx-auto min-h-0 place-items-center">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          const Icon = card.Icon;
          
          return (
            <motion.div
              key={card.id}
              onClick={() => handleFlip(idx)}
              className="w-full aspect-square relative cursor-pointer perspective-1000"
              whileHover={{ scale: isFlipped ? 1 : 1.05 }}
              whileTap={{ scale: isFlipped ? 1 : 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Back of Card (Hidden) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-lime-400 border border-slate-200 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Star className="w-10 h-10 md:w-16 md:h-16 text-slate-800 opacity-30" />
                </div>
                
                {/* Front of Card (Visible when flipped) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center backface-hidden [transform:rotateY(180deg)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Icon className={`w-12 h-12 md:w-20 md:h-20 ${matched.includes(idx) ? 'text-green-500' : 'text-purple-500'}`} />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
