import { useStickyState } from './useStickyState';
import type { ParentAccount, KidProfile, Reward, Task, GameStats } from '../types';

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0, totalCorrect: 0, totalWrong: 0, totalStarsEarned: 0,
  subjectStats: {}, dailyActivity: [],
};

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'Extra 30m Screen Time', cost: 500, icon: 'tv' },
  { id: '2', title: 'Ice Cream Trip', cost: 1500, icon: 'ice-cream' },
  { id: '3', title: 'New Toy ($10)', cost: 5000, icon: 'gift' },
];

function generateLinkCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export function useParentStore() {
  const [parentAccount, setParentAccount] = useStickyState<ParentAccount | null>(null, 'h_parent');
  const [rewards, setRewards] = useStickyState<Reward[]>(DEFAULT_REWARDS, 'h_rewards');
  const [tasks, setTasks] = useStickyState<Task[]>([], 'h_tasks');
  const [activeKidId, setActiveKidId] = useStickyState<string | null>(null, 'h_active_kid');

  const isParentSetup = parentAccount !== null;

  // --- Parent Account ---
  const createParentAccount = (name: string, pin: string) => {
    setParentAccount({
      parents: [{ id: Date.now().toString(), name, pin }],
      kids: [],
      createdAt: Date.now()
    });
  };

  const addParent = (name: string, pin: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      return { ...prev, parents: [...prev.parents, { id: Date.now().toString(), name, pin }] };
    });
  };

  const verifyPin = (pin: string) => {
    return parentAccount?.parents.find(p => p.pin === pin);
  };

  // --- Kid Profiles ---
  const addKid = (kid: Omit<KidProfile, 'id' | 'linkCode' | 'stars' | 'streak' | 'questProgress' | 'gameStats'>): KidProfile => {
    const newKid: KidProfile = {
      ...kid,
      id: Date.now().toString(),
      linkCode: generateLinkCode(),
      stars: 0,
      streak: 0,
      questProgress: 0,
      gameStats: { ...DEFAULT_STATS },
    };
    setParentAccount(prev => prev ? { ...prev, kids: [...prev.kids, newKid] } : prev);
    return newKid;
  };

  const updateKid = (kidId: string, updates: Partial<KidProfile>) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      return { ...prev, kids: prev.kids.map(k => k.id === kidId ? { ...k, ...updates } : k) };
    });
  };

  const removeKid = (kidId: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      return { ...prev, kids: prev.kids.filter(k => k.id !== kidId) };
    });
    if (activeKidId === kidId) setActiveKidId(null);
  };

  const getKidByLinkCode = (code: string): KidProfile | undefined => {
    return parentAccount?.kids.find(k => k.linkCode === code);
  };

  const getKidById = (id: string): KidProfile | undefined => {
    return parentAccount?.kids.find(k => k.id === id);
  };

  const regenerateLinkCode = (kidId: string) => {
    updateKid(kidId, { linkCode: generateLinkCode() });
  };

  // --- Kid-specific state helpers ---
  const addStarsToKid = (kidId: string, amount: number) => {
    updateKid(kidId, {
      stars: (getKidById(kidId)?.stars || 0) + amount,
      gameStats: {
        ...(getKidById(kidId)?.gameStats || DEFAULT_STATS),
        totalStarsEarned: (getKidById(kidId)?.gameStats.totalStarsEarned || 0) + amount,
      },
    });
  };

  const recordAnswerForKid = (kidId: string, correct: boolean) => {
    const kid = getKidById(kidId);
    if (!kid) return;
    updateKid(kidId, {
      gameStats: {
        ...kid.gameStats,
        totalCorrect: kid.gameStats.totalCorrect + (correct ? 1 : 0),
        totalWrong: kid.gameStats.totalWrong + (correct ? 0 : 1),
      },
    });
  };

  const recordGamePlayedForKid = (kidId: string) => {
    const kid = getKidById(kidId);
    if (!kid) return;
    updateKid(kidId, {
      gameStats: { ...kid.gameStats, gamesPlayed: kid.gameStats.gamesPlayed + 1 },
    });
  };

  const advanceQuestForKid = (kidId: string) => {
    const kid = getKidById(kidId);
    if (!kid) return;
    updateKid(kidId, { questProgress: kid.questProgress + 1 });
    recordGamePlayedForKid(kidId);
  };

  // --- Tasks (chores) ---
  const getTasksForKid = (kidId: string) => tasks.filter(t => t.kidId === kidId);

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString(), status: 'pending' as const }]);
  };

  const markTaskDone = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'done' as const } : t));
  };

  const approveTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'approved' as const } : t));
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return {
    parentAccount, isParentSetup,
    createParentAccount, addParent, verifyPin,
    addKid, updateKid, removeKid, getKidByLinkCode, getKidById, regenerateLinkCode,
    addStarsToKid, recordAnswerForKid, recordGamePlayedForKid, advanceQuestForKid,
    rewards, setRewards,
    tasks, setTasks, getTasksForKid, addTask, markTaskDone, approveTask, removeTask,
    activeKidId, setActiveKidId,
  };
}
