import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, X, CheckCircle, Target, TrendingUp, Check } from 'lucide-react';
import type { Task, Reward, GameStats } from '../types';

interface ParentDashboardProps {
  rewards: Reward[];
  setRewards: (r: Reward[]) => void;
  assignedTasks: Task[];
  setAssignedTasks: (t: Task[]) => void;
  gameStats: GameStats;
  childName: string;
}

export function ParentDashboard({ rewards, setRewards, assignedTasks, setAssignedTasks, gameStats, childName }: ParentDashboardProps) {
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPts, setNewTaskPts] = useState('');

  const accuracy = gameStats.totalCorrect + gameStats.totalWrong > 0
    ? Math.round((gameStats.totalCorrect / (gameStats.totalCorrect + gameStats.totalWrong)) * 100) : 0;

  const addReward = () => {
    if (newRewardTitle && newRewardCost) {
      setRewards([...rewards, { id: Date.now().toString(), title: newRewardTitle, cost: parseInt(newRewardCost), icon: 'gift' }]);
      setNewRewardTitle(''); setNewRewardCost('');
    }
  };

  const addTask = (isChore: boolean) => {
    if (newTaskTitle && newTaskPts) {
      setAssignedTasks([...assignedTasks, { id: Date.now().toString(), title: newTaskTitle, type: 'Custom', reward: parseInt(newTaskPts), isChore, status: 'pending' }]);
      setNewTaskTitle(''); setNewTaskPts('');
    }
  };

  const approveTask = (id: string) => {
    setAssignedTasks(assignedTasks.map(t => t.id === id ? { ...t, status: 'approved' as const } : t));
  };

  const removeTask = (id: string) => {
    setAssignedTasks(assignedTasks.filter(t => t.id !== id));
  };

  const pendingApproval = assignedTasks.filter(t => t.status === 'done');

  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
      <div className="shrink-0 bg-white border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl md:rounded-3xl">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase text-center">PARENT HUB</h2>
        <p className="text-center text-gray-500 font-bold mt-1">Managing {childName}'s learning</p>
      </div>

      {/* Pending Approvals */}
      {pendingApproval.length > 0 && (
        <div className="shrink-0 bg-yellow-300 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-lg uppercase mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Pending Approval</h3>
          <div className="space-y-2">
            {pendingApproval.map(t => (
              <div key={t.id} className="flex justify-between items-center bg-white border-3 border-black p-3 rounded-xl">
                <span className="font-bold">{t.title} <span className="text-gray-500 text-sm">(+{t.reward} pts)</span></span>
                <div className="flex gap-2">
                  <button onClick={() => approveTask(t.id)} className="bg-green-500 text-white border-2 border-black p-2 rounded-lg font-bold text-sm" aria-label="Approve"><Check className="w-4 h-4" /></button>
                  <button onClick={() => removeTask(t.id)} className="bg-red-500 text-white border-2 border-black p-2 rounded-lg" aria-label="Reject"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-3 gap-3 md:gap-6">
        <div className="bg-purple-500 border-4 border-black p-3 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white text-center">
          <p className="text-[10px] md:text-sm font-black uppercase tracking-widest mb-1">Accuracy</p>
          <p className="text-3xl md:text-5xl font-black" style={{ textShadow: '2px 2px 0px black' }}>{accuracy}%</p>
        </div>
        <div className="bg-lime-400 border-4 border-black p-3 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black text-center">
          <p className="text-[10px] md:text-sm font-black uppercase tracking-widest mb-1">Games</p>
          <p className="text-3xl md:text-5xl font-black">{gameStats.gamesPlayed}</p>
        </div>
        <div className="bg-white border-4 border-black p-3 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black text-center">
          <p className="text-[10px] md:text-sm font-black uppercase tracking-widest mb-1">Stars</p>
          <p className="text-3xl md:text-5xl font-black">{gameStats.totalStarsEarned}</p>
        </div>
      </div>

      {/* Management Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-0">
        {/* Rewards */}
        <div className="bg-white border-4 border-black p-4 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0 h-full">
          <h3 className="font-black text-lg md:text-2xl uppercase border-b-4 border-black pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">Manage Rewards</h3>
          <div className="flex gap-2 mb-3 shrink-0">
            <input type="text" placeholder="Reward Name" value={newRewardTitle} onChange={e => setNewRewardTitle(e.target.value)}
              className="flex-1 border-4 border-black p-2 md:p-3 rounded-xl font-bold min-w-0" aria-label="Reward name" />
            <input type="number" placeholder="Cost" value={newRewardCost} onChange={e => setNewRewardCost(e.target.value)}
              className="w-16 md:w-20 border-4 border-black p-2 md:p-3 rounded-xl font-bold" aria-label="Star cost" />
            <button onClick={addReward} className="bg-lime-400 border-4 border-black px-3 md:px-4 rounded-xl font-black uppercase hover:bg-lime-500" aria-label="Add reward">Add</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {rewards.map(r => (
              <div key={r.id} className="flex justify-between items-center bg-gray-100 border-3 border-black p-3 rounded-xl">
                <div className="flex items-center gap-2"><Gift className="w-5 h-5 text-purple-600 shrink-0" /><span className="font-bold truncate">{r.title}</span></div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-yellow-500 flex items-center gap-1"><Star className="w-4 h-4 fill-current" />{r.cost}</span>
                  <button onClick={() => setRewards(rewards.filter(x => x.id !== r.id))} className="bg-red-500 text-white border-2 border-black p-1.5 rounded-lg" aria-label="Remove reward"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {rewards.length === 0 && <p className="text-center text-gray-500 font-bold mt-4">No rewards set yet.</p>}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white border-4 border-black p-4 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0 h-full">
          <h3 className="font-black text-lg md:text-2xl uppercase border-b-4 border-black pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">Assign Tasks</h3>
          <div className="flex gap-2 mb-2 shrink-0">
            <input type="text" placeholder="Task/Chore" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
              className="flex-1 border-4 border-black p-2 md:p-3 rounded-xl font-bold min-w-0" aria-label="Task name" />
            <input type="number" placeholder="Pts" value={newTaskPts} onChange={e => setNewTaskPts(e.target.value)}
              className="w-14 md:w-20 border-4 border-black p-2 md:p-3 rounded-xl font-bold" aria-label="Star points" />
          </div>
          <div className="flex gap-2 mb-3 shrink-0">
            <button onClick={() => addTask(false)} className="flex-1 bg-yellow-400 border-4 border-black p-2 md:p-3 rounded-xl font-black text-sm md:text-base uppercase hover:bg-yellow-500">+ Game Quest</button>
            <button onClick={() => addTask(true)} className="flex-1 bg-blue-400 border-4 border-black p-2 md:p-3 rounded-xl font-black text-sm md:text-base uppercase text-white hover:bg-blue-500 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" /> + Chore
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            <h4 className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-1 shrink-0">Currently Assigned</h4>
            {assignedTasks.filter(t => t.status === 'pending').map(t => (
              <div key={t.id} className="flex justify-between items-center bg-gray-100 border-3 border-black p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  {t.isChore ? <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> : <Target className="w-5 h-5 text-red-500 shrink-0" />}
                  <span className="font-bold truncate">{t.title} <span className="text-sm text-gray-500">({t.reward}pts)</span></span>
                </div>
                <button onClick={() => removeTask(t.id)} className="bg-red-500 text-white border-2 border-black p-1.5 rounded-lg shrink-0" aria-label="Remove task"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {assignedTasks.filter(t => t.status === 'pending').length === 0 && <p className="text-center text-gray-500 font-bold mt-4">No tasks assigned.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
