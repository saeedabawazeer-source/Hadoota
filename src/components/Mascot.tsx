import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MascotProps {
  seed: string;
  color: number;
  emotion?: 'idle' | 'happy' | 'sad';
}

export function Mascot({ seed, color, emotion = 'idle' }: MascotProps) {
  const [internalEmotion, setInternalEmotion] = useState(emotion);
  
  useEffect(() => {
    if (emotion !== 'idle') {
      setInternalEmotion(emotion);
      const t = setTimeout(() => setInternalEmotion('idle'), 1000);
      return () => clearTimeout(t);
    }
  }, [emotion]);

  const currentSeed = ['Fin', 'Jae', 'Poh', 'Mol'].includes(seed) ? seed : 'Fin';
  
  const getAnim = () => {
    switch(internalEmotion) {
      case 'happy': return { y: [0, -20, 0], scale: [1, 1.1, 1] };
      case 'sad': return { y: [0, 5, 0], scale: [1, 0.9, 1], rotate: [0, -10, 0] };
      default: return { y: [0, -5, 0] }; // idle
    }
  };

  return (
    <motion.div 
      animate={getAnim()} 
      transition={internalEmotion === 'idle' ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : { duration: 0.5 }}
      className="absolute bottom-4 left-4 z-50 pointer-events-none"
    >
      <img 
        src={`/characters/Wormies - ${currentSeed}.svg`} 
        alt="Mascot" 
        className="w-24 h-24 md:w-32 md:h-32 object-contain wormie-stroke" 
        style={{ filter: `hue-rotate(${color}deg)` }} 
      />
    </motion.div>
  );
}
