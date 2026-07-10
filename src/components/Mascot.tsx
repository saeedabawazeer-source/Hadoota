import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { characterFor } from '../data/characters';

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

  const character = characterFor(seed);
  const src = character.poster;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -220, rotate: -20 }}
          animate={emotion === 'sad'
            ? { x: 0, rotate: [0, -6, 6, -6, 0] }
            : { x: 0, rotate: 0, y: [0, -10, 0] }}
          exit={{ x: -220, rotate: -20 }}
          transition={emotion === 'sad'
            ? { x: { type: 'spring', stiffness: 200, damping: 15 }, rotate: { duration: 0.4 } }
            : { x: { type: 'spring', stiffness: 200, damping: 15 }, y: { repeat: Infinity, duration: 0.9, ease: 'easeInOut' } }}
          className="absolute bottom-4 left-4 z-50 pointer-events-none"
        >
          <img
            src={src}
            alt="Mascot"
            className="w-28 h-28 md:w-40 md:h-40 object-contain"
            style={{ filter: `hue-rotate(${color}deg) drop-shadow(5px 6px 0px rgba(0,0,0,0.9))` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
