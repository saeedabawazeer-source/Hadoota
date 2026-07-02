import { useState, useEffect } from 'react';
import type { ParentAccount, KidProfile, Reward, Task } from '../types';

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'Extra Screen Time (30m)', cost: 50, icon: 'gamepad' },
  { id: '2', title: 'Choose Movie Night', cost: 100, icon: 'film' },
  { id: '3', title: 'Stay Up Late (1hr)', cost: 150, icon: 'moon' },
];

function generateLinkCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

const getApiUrl = () => `http://${window.location.hostname}:3001/api/data`;

export function useParentStore() {
  const [parentAccount, setParentAccount] = useState<ParentAccount | null>(null);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeKidId, setActiveKidId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(getApiUrl())
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.parentAccount) setParentAccount(data.parentAccount);
          if (data.rewards) setRewards(data.rewards);
          if (data.tasks) setTasks(data.tasks);
          if (data.activeKidId) setActiveKidId(data.activeKidId);
        }
        setIsLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load data from backend:', err);
        setIsLoaded(true); // Still loaded so app can render (maybe offline)
      });
  }, []);

  const saveData = (newState: { parentAccount?: ParentAccount | null, rewards?: Reward[], tasks?: Task[], activeKidId?: string | null }) => {
    const payload = {
      parentAccount: newState.parentAccount !== undefined ? newState.parentAccount : parentAccount,
      rewards: newState.rewards !== undefined ? newState.rewards : rewards,
      tasks: newState.tasks !== undefined ? newState.tasks : tasks,
      activeKidId: newState.activeKidId !== undefined ? newState.activeKidId : activeKidId,
    };
    
    fetch(getApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(console.error);
  };

  const isParentSetup = parentAccount !== null;

  // --- Parent Account ---
  const createParentAccount = (name: string) => {
    const newAccount = {
      parents: [{ id: Date.now().toString(), name }],
      kids: [],
      createdAt: Date.now()
    };
    setParentAccount(newAccount);
    saveData({ parentAccount: newAccount });
  };

  const addParent = (name: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = { ...prev, parents: [...prev.parents, { id: Date.now().toString(), name }] };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
  };

  // --- Kid Profiles ---
  const addKid = (kid: Omit<KidProfile, 'id' | 'linkCode' | 'stars' | 'streak' | 'questProgress' | 'gameStats'>): KidProfile => {
    const newKid: KidProfile = {
      ...kid,
      id: Date.now().toString(),
      linkCode: generateLinkCode(),
      stars: 0, streak: 0, questProgress: 0,
      gameStats: { gamesPlayed: 0, totalStarsEarned: 0, totalCorrect: 0, totalWrong: 0, subjectStats: {}, dailyActivity: [] }
    };
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = { ...prev, kids: [...prev.kids, newKid] };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
    return newKid;
  };

  const updateKid = (id: string, updates: Partial<KidProfile>) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = { ...prev, kids: prev.kids.map(k => k.id === id ? { ...k, ...updates } : k) };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
  };

  const removeKid = (id: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = { ...prev, kids: prev.kids.filter(k => k.id !== id) };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
  };

  const getKidByLinkCode = (code: string): KidProfile | undefined => {
    return parentAccount?.kids.find(k => k.linkCode === code);
  };

  const getKidById = (id: string): KidProfile | undefined => {
    return parentAccount?.kids.find(k => k.id === id);
  };

  const regenerateLinkCode = (kidId: string): string => {
    const newCode = generateLinkCode();
    updateKid(kidId, { linkCode: newCode });
    return newCode;
  };

  // --- Game Stats & Progress ---
  const addStarsToKid = (kidId: string, amount: number) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            return {
              ...k,
              stars: k.stars + amount,
              gameStats: { ...k.gameStats, totalStarsEarned: k.gameStats.totalStarsEarned + amount }
            };
          }
          return k;
        })
      };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
  };

  const recordAnswerForKid = (kidId: string, isCorrect: boolean) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            return {
              ...k,
              gameStats: {
                ...k.gameStats,
                totalCorrect: isCorrect ? k.gameStats.totalCorrect + 1 : k.gameStats.totalCorrect,
                totalWrong: !isCorrect ? k.gameStats.totalWrong + 1 : k.gameStats.totalWrong
              }
            };
          }
          return k;
        })
      };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
  };

  const recordGamePlayedForKid = (kidId: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            return {
              ...k,
              gameStats: { ...k.gameStats, gamesPlayed: k.gameStats.gamesPlayed + 1 }
            };
          }
          return k;
        })
      };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
  };

  const advanceQuestForKid = (kidId: string, amount: number = 25) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newAccount = {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            const newProgress = k.questProgress + amount;
            return { ...k, questProgress: newProgress >= 100 ? 0 : newProgress };
          }
          return k;
        })
      };
      saveData({ parentAccount: newAccount });
      return newAccount;
    });
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
    isLoaded,
    parentAccount, isParentSetup,
    createParentAccount, addParent,
    addKid, updateKid, removeKid, getKidByLinkCode, getKidById, regenerateLinkCode,
    addStarsToKid, recordAnswerForKid, recordGamePlayedForKid, advanceQuestForKid,
    rewards, setRewards,
    tasks, setTasks, getTasksForKid, addTask, markTaskDone, approveTask, removeTask,
    activeKidId, setActiveKidId,
  };
}
