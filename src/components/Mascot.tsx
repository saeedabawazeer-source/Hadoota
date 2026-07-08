import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MascotProps {
  seed: string;
  color: number;
  emotion?: 'idle' | 'happy' | 'sad';
}

export function Mascot({ seed, color, emotion = 'idle' }: MascotProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (emotion === 'happy') {
      setIsVisible(true);
      // Fire confetti from bottom left
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.1, y: 0.9 },
        colors: ['#a3e635', '#f97316', '#9333ea', '#ffffff']
      });
      
      const t = setTimeout(() => setIsVisible(false), 2500);
      return () => clearTimeout(t);
    } else if (emotion === 'sad') {
      setIsVisible(true);
      const t = setTimeout(() => setIsVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [emotion]);

  const seedToAnimal: Record<string, string> = {
    Fin: 'penguin.png',
    Jae: 'bear.png',
    Poh: 'frog.png',
    Mol: 'monkey.png'
  };
  const currentAnimal = seedToAnimal[seed] || 'penguin.png';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ x: -200, rotate: -20 }}
          animate={{ x: 0, rotate: 0 }}
          exit={{ x: -200, rotate: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="absolute bottom-4 left-4 z-50 pointer-events-none"
        >
          <img 
            src={`/characters/kenney/${currentAnimal}`} 
            alt="Mascot" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform" 
            style={{ filter: `hue-rotate(${color}deg) drop-shadow(4px 4px 0px rgba(0,0,0,1))` }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
