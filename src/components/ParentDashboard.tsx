import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, X, CheckCircle, Target, TrendingUp, Check, Users, Copy, ArrowLeft, Plus, KeyRound } from 'lucide-react';
import type { Task, Reward, GameStats, KidProfile, ParentAccount, ParentProfile } from '../types';

interface ParentDashboardProps {
  rewards: Reward[];
  setRewards: (r: Reward[]) => void;
  assignedTasks: Task[];
  setAssignedTasks: (t: Task[]) => void;
  gameStats: GameStats;
  childName: string;
  activeKid: KidProfile | null;
  parentAccount: ParentAccount | null;
  activeParent: ParentProfile | null;
  addParent: (name: string) => void;
  addStarsToKid: (kidId: string, stars: number) => void;
  onSelectKid: (kid: KidProfile) => void;
  onBack: () => void;
}

export function ParentDashboard({ rewards, setRewards, assignedTasks, setAssignedTasks, gameStats, childName, activeKid, parentAccount, activeParent, addParent, addStarsToKid, onSelectKid, onBack }: ParentDashboardProps) {
  const [tab, setTab] = useState<'overview' | 'rewards' | 'tasks' | 'kids'>('overview');
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPts, setNewTaskPts] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [showAddParent, setShowAddParent] = useState(false);
  const [newParentName, setNewParentName] = useState('');

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
      setAssignedTasks([...assignedTasks, { id: Date.now().toString(), title: newTaskTitle, type: 'Custom', reward: parseInt(newTaskPts), isChore, status: 'pending', kidId: activeKid?.id }]);
      setNewTaskTitle(''); setNewTaskPts('');
    }
  };

  const approveTask = (id: string) => {
    const task = assignedTasks.find(t => t.id === id);
    if (task && task.kidId) {
      addStarsToKid(task.kidId, task.reward);
    }
    setAssignedTasks(assignedTasks.map(t => t.id === id ? { ...t, status: 'approved' as const } : t));
  };

  const removeTask = (id: string) => {
    setAssignedTasks(assignedTasks.filter(t => t.id !== id));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const pendingApproval = assignedTasks.filter(t => t.status === 'done');
  const kids = parentAccount?.kids || [];

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'kids' as const, label: `Kids (${kids.length})` },
    { id: 'rewards' as const, label: 'Rewards' },
    { id: 'tasks' as const, label: 'Chores' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
      {/* Header */}
      <div className="shrink-0 bg-white border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl md:rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/characters/Wormies - UI.svg" className="w-12 h-12 md:w-16 md:h-16" alt="Parent Hub" />
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-black uppercase">PARENT HUB</h2>
            <p className="text-gray-500 font-bold text-sm">Welcome, {activeParent?.name || 'Parent'}</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
          className="bg-purple-600 text-white border-4 border-black px-4 py-2 rounded-xl font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>
      </div>

      {/* Tab Switcher */}
      <div className="shrink-0 flex gap-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-black text-sm uppercase border-4 border-black transition-colors whitespace-nowrap cursor-pointer
              ${tab === t.id ? 'bg-lime-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black/50 hover:bg-lime-100'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Pending Approvals (always visible) */}
      {pendingApproval.length > 0 && (
        <div className="shrink-0 bg-yellow-300 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-lg uppercase mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Pending Approval</h3>
          <div className="space-y-2">
            {pendingApproval.map(t => (
              <div key={t.id} className="flex justify-between items-center bg-white border-3 border-black p-3 rounded-xl">
                <span className="font-bold">{t.title} <span className="text-gray-500 text-sm">(+{t.reward} pts)</span></span>
                <div className="flex gap-2">
                  <button onClick={() => approveTask(t.id)} className="bg-green-500 text-white border-2 border-black p-2 rounded-lg font-bold text-sm cursor-pointer" aria-label="Approve"><Check className="w-4 h-4" /></button>
                  <button onClick={() => removeTask(t.id)} className="bg-red-500 text-white border-2 border-black p-2 rounded-lg cursor-pointer" aria-label="Reject"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {tab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Kid Selector */}
            {kids.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {kids.map(k => (
                  <button key={k.id} onClick={() => onSelectKid(k)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-4 border-black font-bold cursor-pointer transition-colors
                      ${activeKid?.id === k.id ? 'bg-lime-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-lime-100'}`}>
                    <img src={`/characters/Wormies - ${(k.id.charCodeAt(k.id.length-1) % 4 === 0) ? 'Fin' : (k.id.charCodeAt(k.id.length-1) % 4 === 1) ? 'Jae' : (k.id.charCodeAt(k.id.length-1) % 4 === 2) ? 'Poh' : 'Mol'}.svg`}
                      alt={k.name} className="w-8 h-8 rounded-full border-2 border-black object-cover bg-purple-200" />
                    {k.name}
                  </button>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-6">
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

            {/* Active Kid Info */}
            {activeKid && (
              <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                <img src={`/characters/Wormies - ${(activeKid.id.charCodeAt(activeKid.id.length-1) % 4 === 0) ? 'Fin' : (activeKid.id.charCodeAt(activeKid.id.length-1) % 4 === 1) ? 'Jae' : (activeKid.id.charCodeAt(activeKid.id.length-1) % 4 === 2) ? 'Poh' : 'Mol'}.svg`}
                  alt={activeKid.name} className="w-16 h-16 rounded-2xl border-4 border-black bg-purple-200 object-cover" />
                <div className="flex-1">
                  <h3 className="font-black text-xl uppercase">{activeKid.name}</h3>
                  <p className="font-bold text-gray-500 text-sm">Age {activeKid.age} · {activeKid.difficulty} mode · {activeKid.stars} ⭐</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase text-gray-400">Link Code</p>
                  <button onClick={() => copyCode(activeKid.linkCode)}
                    className="bg-purple-100 border-2 border-black px-3 py-1 rounded-lg font-black text-lg tracking-widest flex items-center gap-1 cursor-pointer hover:bg-purple-200 transition-colors">
                    {activeKid.linkCode}
                    {copiedCode === activeKid.linkCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Manage Parents Section */}
            <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-lg uppercase flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Family Managers</h3>
                {!showAddParent && (
                  <button onClick={() => setShowAddParent(true)} className="bg-lime-400 border-2 border-black px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 hover:bg-lime-300">
                    <Plus className="w-4 h-4" /> Add Parent
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {parentAccount?.parents.map(p => (
                  <div key={p.id} className="bg-gray-100 border-2 border-black px-3 py-1.5 rounded-lg font-bold text-sm">
                    {p.name} {p.id === activeParent?.id && <span className="text-lime-600 text-xs">(You)</span>}
                  </div>
                ))}
              </div>
              
              {showAddParent && (
                <div className="bg-blue-50 border-2 border-black p-4 rounded-xl">
                  <h4 className="font-bold text-sm mb-3">Add a Co-Parent</h4>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={newParentName} onChange={e => setNewParentName(e.target.value)}
                      className="flex-1 border-2 border-black p-2 rounded-lg font-bold min-w-0" />
                    <button onClick={() => { if (newParentName) { addParent(newParentName); setShowAddParent(false); setNewParentName(''); } }}
                      className="bg-blue-500 text-white border-2 border-black px-4 py-2 rounded-lg font-bold hover:bg-blue-600 cursor-pointer">
                      Add
                    </button>
                    <button onClick={() => setShowAddParent(false)} className="bg-gray-200 border-2 border-black px-3 py-2 rounded-lg hover:bg-gray-300 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'kids' && (
          <div className="flex flex-col gap-4">
            {kids.map(k => (
              <div key={k.id} className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                <img src={`/characters/Wormies - ${(k.id.charCodeAt(k.id.length-1) % 4 === 0) ? 'Fin' : (k.id.charCodeAt(k.id.length-1) % 4 === 1) ? 'Jae' : (k.id.charCodeAt(k.id.length-1) % 4 === 2) ? 'Poh' : 'Mol'}.svg`}
                  alt={k.name} className="w-14 h-14 rounded-2xl border-4 border-black bg-purple-200 object-cover" />
                <div className="flex-1">
                  <h3 className="font-black text-lg uppercase">{k.name}</h3>
                  <p className="font-bold text-gray-500 text-sm">Age {k.age} · {k.difficulty} · {k.stars} ⭐</p>
                  {k.interests.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {k.interests.map(i => (
                        <span key={i} className="bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-full text-xs font-bold">{i}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-center shrink-0">
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Device Code</p>
                  <button onClick={() => copyCode(k.linkCode)}
                    className="bg-lime-400 border-2 border-black px-3 py-2 rounded-xl font-black text-xl tracking-widest flex items-center gap-2 cursor-pointer hover:bg-lime-300 transition-colors">
                    <KeyRound className="w-4 h-4" />
                    {k.linkCode}
                    {copiedCode === k.linkCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {kids.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center">
                <img src="/characters/Wormies - Staying Home.svg" alt="No kids" className="w-32 h-32 opacity-70 mb-4" />
                <p className="font-bold text-gray-500">No kids added yet.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'rewards' && (
          <div className="bg-white border-4 border-black p-4 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0 h-full">
            <h3 className="font-black text-lg md:text-2xl uppercase border-b-4 border-black pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">Manage Rewards</h3>
            <div className="flex gap-2 mb-3 shrink-0">
              <input type="text" placeholder="Reward Name" value={newRewardTitle} onChange={e => setNewRewardTitle(e.target.value)}
                className="flex-1 border-4 border-black p-2 md:p-3 rounded-xl font-bold min-w-0" aria-label="Reward name" />
              <input type="number" placeholder="Cost" value={newRewardCost} onChange={e => setNewRewardCost(e.target.value)}
                className="w-16 md:w-20 border-4 border-black p-2 md:p-3 rounded-xl font-bold" aria-label="Star cost" />
              <button onClick={addReward} className="bg-lime-400 border-4 border-black px-3 md:px-4 rounded-xl font-black uppercase hover:bg-lime-500 cursor-pointer" aria-label="Add reward">Add</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {rewards.map(r => (
                <div key={r.id} className="flex justify-between items-center bg-gray-100 border-3 border-black p-3 rounded-xl">
                  <div className="flex items-center gap-2"><Gift className="w-5 h-5 text-purple-600 shrink-0" /><span className="font-bold truncate">{r.title}</span></div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-black text-yellow-500 flex items-center gap-1"><Star className="w-4 h-4 fill-current" />{r.cost}</span>
                    <button onClick={() => setRewards(rewards.filter(x => x.id !== r.id))} className="bg-red-500 text-white border-2 border-black p-1.5 rounded-lg cursor-pointer" aria-label="Remove reward"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {rewards.length === 0 && (
                <div className="text-center py-8 flex flex-col items-center">
                  <img src="/characters/Wormies - Celebration.svg" alt="No rewards" className="w-24 h-24 opacity-60 mb-3" />
                  <p className="text-gray-500 font-bold">No rewards set yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="bg-white border-4 border-black p-4 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0 h-full">
            <h3 className="font-black text-lg md:text-2xl uppercase border-b-4 border-black pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">
              Assign Chores {activeKid && <span className="text-purple-500 text-base">for {activeKid.name}</span>}
            </h3>
            <div className="flex gap-2 mb-2 shrink-0">
              <input type="text" placeholder="Task/Chore" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                className="flex-1 border-4 border-black p-2 md:p-3 rounded-xl font-bold min-w-0" aria-label="Task name" />
              <input type="number" placeholder="Pts" value={newTaskPts} onChange={e => setNewTaskPts(e.target.value)}
                className="w-14 md:w-20 border-4 border-black p-2 md:p-3 rounded-xl font-bold" aria-label="Star points" />
            </div>
            <div className="flex gap-2 mb-3 shrink-0">
              <button onClick={() => addTask(false)} className="flex-1 bg-yellow-400 border-4 border-black p-2 md:p-3 rounded-xl font-black text-sm md:text-base uppercase hover:bg-yellow-500 cursor-pointer">+ Game Quest</button>
              <button onClick={() => addTask(true)} className="flex-1 bg-blue-400 border-4 border-black p-2 md:p-3 rounded-xl font-black text-sm md:text-base uppercase text-white hover:bg-blue-500 flex items-center justify-center gap-1 cursor-pointer">
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
                  <button onClick={() => removeTask(t.id)} className="bg-red-500 text-white border-2 border-black p-1.5 rounded-lg shrink-0 cursor-pointer" aria-label="Remove task"><X className="w-4 h-4" /></button>
                </div>
              ))}
              {assignedTasks.filter(t => t.status === 'pending').length === 0 && (
                <div className="text-center py-8 flex flex-col items-center">
                  <img src="/characters/Wormies - Chat.svg" alt="No tasks" className="w-24 h-24 opacity-60 mb-3" />
                  <p className="text-gray-500 font-bold">No tasks assigned.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
