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

  const renderNode = (node: any, idx: number) => {
    const isUnlocked = progress >= idx;
    const isCurrent = progress === idx;
    return (
      <div className="relative flex flex-col items-center">
        <motion.div 
          key={node.id}
          whileHover={isUnlocked ? { scale: 1.1, y: -5 } : {}}
          whileTap={isUnlocked ? { scale: 0.9 } : {}}
          onClick={() => isUnlocked && onNodeClick(node)}
          className={`relative z-10 w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-black flex items-center justify-center cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors
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
              className="absolute -top-12 md:-top-16 bg-black text-white text-[10px] md:text-sm font-black px-2 py-1 md:px-4 md:py-2 rounded-full uppercase tracking-widest border-2 border-white whitespace-nowrap"
            >
              You!
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Small label below */}
        <span className="mt-2 text-[10px] md:text-xs font-black uppercase text-center w-full max-w-[80px] leading-tight">
          {node.label}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border-4 border-black p-4 md:p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col shrink-0 overflow-hidden relative w-full">
      <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-black mb-4 md:mb-6 shrink-0 z-20">Adventure Path</h3>
      
      {/* 0-Scroll Winding Path Container */}
      <div className="relative w-full mx-auto pb-4 pt-8 z-10 flex flex-col gap-16 md:gap-24 px-2 md:px-8">
        
        {/* Row 1 (Nodes 0, 1, 2) */}
        <div className="flex justify-between w-full relative z-10">
          {/* Background line for Row 1 */}
          <div className="absolute top-7 md:top-10 left-0 right-0 h-4 md:h-6 bg-gray-200 -translate-y-1/2 rounded-full border-y-4 border-black z-0"></div>
          {/* Progress line Row 1 */}
          <div 
            className="absolute top-7 md:top-10 left-0 h-4 md:h-6 bg-lime-400 -translate-y-1/2 rounded-full border-y-4 border-black z-0 transition-all duration-1000" 
            style={{ width: `${Math.min(progress, 2) * 50}%` }}
          ></div>

          <div className="z-10">{renderNode(nodesArr[0], 0)}</div>
          <div className="z-10">{renderNode(nodesArr[1], 1)}</div>
          
          <div className="z-10 relative">
            {/* Connector Down from Node 2 to Node 3 */}
            <div className="absolute top-7 md:top-10 left-1/2 w-4 md:w-6 h-20 md:h-28 bg-gray-200 -translate-x-1/2 border-x-4 border-black -z-10"></div>
            {/* Progress line for Connector */}
            {progress >= 2 && (
              <div 
                className="absolute top-7 md:top-10 left-1/2 w-4 md:w-6 bg-lime-400 -translate-x-1/2 border-x-4 border-black -z-10 transition-all duration-1000"
                style={{ height: progress >= 3 ? '100px' : '0px' }}
              ></div>
            )}
            {renderNode(nodesArr[2], 2)}
          </div>
        </div>

        {/* Row 2 (Nodes 3, 4) going backwards mapping right to left */}
        <div className="flex justify-end gap-[20%] md:gap-[25%] w-full relative z-10 pr-[5%]">
          {/* Background line for Row 2 connecting Node 3 and Node 4 */}
          <div className="absolute top-7 md:top-10 right-0 w-[45%] h-4 md:h-6 bg-gray-200 -translate-y-1/2 rounded-l-full border-y-4 border-l-4 border-black z-0"></div>
          
          {/* Progress line Row 2 */}
          {progress >= 3 && (
            <div 
              className="absolute top-7 md:top-10 right-0 h-4 md:h-6 bg-lime-400 -translate-y-1/2 rounded-l-full border-y-4 border-l-4 border-black z-0 transition-all duration-1000" 
              style={{ width: progress >= 4 ? '45%' : '0%' }}
            ></div>
          )}

          <div className="z-10">{renderNode(nodesArr[3], 3)}</div>
          <div className="z-10 mr-auto ml-12">{renderNode(nodesArr[4], 4)}</div>
        </div>

      </div>
    </div>
  );
}
