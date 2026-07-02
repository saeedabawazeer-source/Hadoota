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

  const currentSeed = ['Fin', 'Jae', 'Poh', 'Mol'].includes(seed) ? seed : 'Fin';

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
            src={`/characters/Wormies - ${currentSeed}.svg`} 
            alt="Mascot" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain wormie-stroke" 
            style={{ filter: `hue-rotate(${color}deg)` }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
