import React from 'react';
import { motion } from 'motion/react';
import { Car, Rocket, Gift, Gamepad2, Trophy, Lock } from 'lucide-react';

export function QuestMap({ progress, onNodeClick }: any) {
  // Extract nodes to component state/props if needed, but for now just define locally
  const nodesArr = [
    { id: 1, type: 'game', label: 'Math Dash', icon: <Car className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-purple-500' },
    { id: 2, type: 'game', label: 'Word Jump', icon: <Rocket className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-blue-400' },
    { id: 3, type: 'reward', label: 'Mystery Box', icon: <Gift className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-amber-400' },
    { id: 4, type: 'game', label: 'Logic Blocks', icon: <Gamepad2 className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-lime-400' },
    { id: 5, type: 'boss', label: 'Boss Level', icon: <Trophy className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white border-4 border-black p-4 md:p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col shrink-0 overflow-hidden">
      <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-black mb-4 md:mb-6 shrink-0">Adventure Path</h3>
      <div className="w-full overflow-x-auto custom-scrollbar pb-6 pt-10 -mt-10 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="relative flex items-center justify-between gap-8 md:gap-12 w-max min-w-full px-4 md:px-8">
          {/* Path Background Line */}
          <div className="absolute left-0 right-0 h-4 md:h-6 bg-gray-200 top-1/2 -translate-y-1/2 z-0 rounded-full border-y-4 border-black"></div>
          
          {/* Path Progress Line */}
          <div 
            className="absolute left-0 h-4 md:h-6 bg-lime-400 top-1/2 -translate-y-1/2 z-0 rounded-full border-y-4 border-black transition-all duration-1000"
            style={{ width: `calc(${(Math.min(progress, nodesArr.length - 1) / (nodesArr.length - 1)) * 100}% + 2rem)` }}
          ></div>

          {nodesArr.map((node, idx) => {
          const isUnlocked = progress >= idx;
          const isCurrent = progress === idx;
          return (
            <motion.div 
              key={node.id}
              whileHover={isUnlocked ? { scale: 1.1, y: -5 } : {}}
              whileTap={isUnlocked ? { scale: 0.9 } : {}}
              onClick={() => isUnlocked && onNodeClick(node)}
              className={`relative z-10 w-14 h-14 md:w-24 md:h-24 rounded-full border-4 border-black flex items-center justify-center cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors shrink-0
                ${isUnlocked ? node.color : 'bg-gray-300'}
                ${isCurrent ? 'ring-4 ring-lime-400 ring-offset-4' : ''}
              `}
            >
              <div className={isUnlocked ? 'text-white' : 'text-gray-500'}>
                {isUnlocked ? node.icon : <Lock className="w-6 h-6 md:w-8 md:h-8" />}
              </div>
              {isCurrent && (
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-14 md:-top-16 bg-black text-white text-xs md:text-sm font-black px-3 py-1 md:px-4 md:py-2 rounded-full uppercase tracking-widest border-2 border-white whitespace-nowrap"
                >
                  You!
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
