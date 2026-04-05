import React from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, Zap } from 'lucide-react';

export function QuestMap({ progress, onNodeClick }: any) {
  const level = Math.min(progress + 1, 10);
  const pct = Math.min((progress / 10) * 100, 100);

  return (
    <div className="bg-white border-4 border-black px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="font-black text-sm md:text-base uppercase tracking-widest text-black">Level {level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-black text-sm text-gray-500 uppercase tracking-widest">{progress} Completed</span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full h-5 bg-gray-200 rounded-full border-2 border-black overflow-hidden relative">
        <motion.div 
          className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />
        {pct >= 100 && (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
            className="absolute right-1 top-1/2 -translate-y-1/2">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </motion.div>
        )}
      </div>
      <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-1.5 text-right uppercase tracking-widest">
        {progress >= 10 ? 'All quests complete! 🎉' : `${10 - progress} quests to next reward`}
      </p>
    </div>
  );
}
