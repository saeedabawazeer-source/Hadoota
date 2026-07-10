import { useState, useEffect, useCallback } from 'react';
import type { ParentAccount, KidProfile, Reward, Task, ParentProfile, FamilyMember } from '../types';

// ---------------------------------------------------------------------------
// Local-first store. The app works fully offline (single device / browser):
// parents create an account, generate a kid pairing code, add kids, and kids
// link with that code — all persisted to localStorage. No backend required.
// (If a Supabase backend is later configured, this can be swapped back out.)
// ---------------------------------------------------------------------------

const DB_KEY = 'h_local_db_v1';

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: 'Extra Screen Time (30m)', cost: 50, icon: 'gamepad' },
  { id: 'r2', title: 'Choose Movie Night', cost: 100, icon: 'film' },
  { id: 'r3', title: 'Stay Up Late (1hr)', cost: 150, icon: 'moon' },
];

interface LocalDB {
  family: { id: string; name: string; code: string; createdAt: number } | null;
  parents: ParentProfile[];
  kids: KidProfile[];
  rewards: Reward[];
  tasks: Task[];
  members: FamilyMember[];
}

const emptyStats = () => ({ gamesPlayed: 0, totalCorrect: 0, totalWrong: 0, totalStarsEarned: 0, subjectStats: {}, dailyActivity: [] });
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2) + Date.now());
const genCode = () => {
  // 5-digit numeric code (matches the kid link-entry screen)
  let c = '';
  for (let i = 0; i < 5; i++) c += Math.floor(Math.random() * 10);
  return c;
};

function loadDB(): LocalDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) { const db = JSON.parse(raw); db.members = db.members || []; return db; }
  } catch { /* ignore */ }
  return { family: null, parents: [], kids: [], rewards: DEFAULT_REWARDS, tasks: [], members: [] };
}
function saveDB(db: LocalDB) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* ignore */ }
}

export function useParentStore() {
  const [db, setDb] = useState<LocalDB>(() => loadDB());
  const [activeKidId, setActiveKidId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, []);
  // Persist on every change
  useEffect(() => { saveDB(db); }, [db]);

  const parentAccount: ParentAccount | null = db.family
    ? { parents: db.parents.length ? db.parents : [{ id: 'parent-1', name: 'Parent' }], kids: db.kids, createdAt: db.family.createdAt }
    : null;
  const isParentSetup = db.family !== null;
  const pairingCode = db.family?.code ?? null;
  const familyId = db.family?.id ?? null;

  // ---- Parent account ----
  const createParentAccount = useCallback(async (name: string): Promise<string | null> => {
    const family = { id: uid(), name, code: genCode(), createdAt: Date.now() };
    setDb(prev => ({ ...prev, family, parents: [{ id: 'parent-1', name }], rewards: prev.rewards.length ? prev.rewards : DEFAULT_REWARDS }));
    return family.id;
  }, []);

  const addParent = useCallback((name: string) => {
    setDb(prev => ({ ...prev, parents: [...prev.parents, { id: uid(), name }] }));
  }, []);

  // ---- Kids ----
  const addKid = useCallback(async (kid: Omit<KidProfile, 'id' | 'linkCode' | 'stars' | 'streak' | 'questProgress' | 'gameStats'>): Promise<KidProfile> => {
    const newKid: KidProfile = {
      id: uid(), name: kid.name, age: kid.age, avatarSeed: kid.avatarSeed,
      interests: kid.interests || [], difficulty: kid.difficulty || 'easy',
      linkCode: '', stars: 0, streak: 0, questProgress: 0, gameStats: emptyStats(),
    };
    setDb(prev => {
      newKid.linkCode = prev.family?.code || '';
      const hasMe = prev.members.some(m => m.role === 'Me');
      const members = hasMe ? prev.members : [...prev.members, { id: uid(), name: newKid.name, role: 'Me', seed: newKid.avatarSeed }];
      return { ...prev, kids: [...prev.kids, newKid], members };
    });
    return newKid;
  }, []);

  // ---- Family members (shown on the home island) ----
  const addMember = useCallback((m: Omit<FamilyMember, 'id'>) => {
    setDb(prev => ({ ...prev, members: [...prev.members, { ...m, id: uid() }] }));
  }, []);
  const updateMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setDb(prev => ({ ...prev, members: prev.members.map(m => m.id === id ? { ...m, ...updates } : m) }));
  }, []);
  const removeMember = useCallback((id: string) => {
    setDb(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
  }, []);

  const updateKid = useCallback(async (id: string, updates: Partial<KidProfile>) => {
    setDb(prev => ({ ...prev, kids: prev.kids.map(k => k.id === id ? { ...k, ...updates } : k) }));
  }, []);

  const removeKid = useCallback(async (id: string) => {
    setDb(prev => ({ ...prev, kids: prev.kids.filter(k => k.id !== id) }));
  }, []);

  const getKidByLinkCode = useCallback((code: string): KidProfile | undefined => {
    return db.kids.find(k => k.linkCode?.toUpperCase() === code.toUpperCase());
  }, [db.kids]);

  const getKidById = useCallback((id: string): KidProfile | undefined => db.kids.find(k => k.id === id), [db.kids]);

  const regenerateLinkCode = useCallback(async (_kidId: string): Promise<string> => {
    const code = genCode();
    setDb(prev => prev.family
      ? { ...prev, family: { ...prev.family, code }, kids: prev.kids.map(k => ({ ...k, linkCode: code })) }
      : prev);
    return code;
  }, []);

  // ---- Pairing (kid device) ----
  const validatePairingCode = useCallback(async (code: string): Promise<{ familyId: string; kids: KidProfile[] } | null> => {
    const fresh = loadDB(); // read latest (covers other tabs on same browser)
    if (fresh.family && fresh.family.code.toUpperCase() === code.toUpperCase() && fresh.kids.length > 0) {
      setDb(fresh);
      return { familyId: fresh.family.id, kids: fresh.kids };
    }
    return null;
  }, []);

  // ---- Stats & progress ----
  const addStarsToKid = useCallback(async (kidId: string, amount: number) => {
    setDb(prev => ({ ...prev, kids: prev.kids.map(k => k.id === kidId
      ? { ...k, stars: k.stars + amount, gameStats: { ...k.gameStats, totalStarsEarned: k.gameStats.totalStarsEarned + amount } }
      : k) }));
  }, []);

  const recordAnswerForKid = useCallback(async (kidId: string, isCorrect: boolean) => {
    setDb(prev => ({ ...prev, kids: prev.kids.map(k => k.id === kidId
      ? { ...k, gameStats: { ...k.gameStats, totalCorrect: k.gameStats.totalCorrect + (isCorrect ? 1 : 0), totalWrong: k.gameStats.totalWrong + (isCorrect ? 0 : 1) } }
      : k) }));
  }, []);

  const recordGamePlayedForKid = useCallback(async (kidId: string) => {
    setDb(prev => ({ ...prev, kids: prev.kids.map(k => k.id === kidId
      ? { ...k, gameStats: { ...k.gameStats, gamesPlayed: k.gameStats.gamesPlayed + 1 } } : k) }));
  }, []);

  const advanceQuestForKid = useCallback(async (kidId: string, amount: number = 25) => {
    setDb(prev => ({ ...prev, kids: prev.kids.map(k => {
      if (k.id !== kidId) return k;
      const np = k.questProgress + amount;
      const streakBump = np >= 100 ? k.streak + 1 : k.streak;
      return { ...k, questProgress: np >= 100 ? 0 : np, streak: streakBump, gameStats: { ...k.gameStats, gamesPlayed: k.gameStats.gamesPlayed + 1 } };
    }) }));
  }, []);

  // ---- Tasks ----
  const getTasksForKid = useCallback((kidId: string) => db.tasks.filter(t => t.kidId === kidId), [db.tasks]);

  const setTasks = useCallback((updater: Task[] | ((prev: Task[]) => Task[])) => {
    setDb(prev => ({ ...prev, tasks: typeof updater === 'function' ? (updater as any)(prev.tasks) : updater }));
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'status'>) => {
    setDb(prev => ({ ...prev, tasks: [...prev.tasks, { ...task, id: uid(), status: 'pending' as const }] }));
  }, []);

  const markTaskDone = useCallback(async (taskId: string) => {
    setDb(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: 'done' as const, completedAt: Date.now() } : t) }));
  }, []);

  const approveTask = useCallback(async (taskId: string) => {
    setDb(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      const kids = task?.kidId ? prev.kids.map(k => k.id === task.kidId ? { ...k, stars: k.stars + (task.reward || 0) } : k) : prev.kids;
      return { ...prev, kids, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: 'approved' as const } : t) };
    });
  }, []);

  const removeTask = useCallback(async (taskId: string) => {
    setDb(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
  }, []);

  // ---- Rewards ----
  const setRewards = useCallback((newRewards: Reward[]) => {
    setDb(prev => ({ ...prev, rewards: newRewards }));
  }, []);

  const refreshData = useCallback(async () => { setDb(loadDB()); }, []);

  return {
    isLoaded,
    parentAccount, isParentSetup,
    createParentAccount, addParent,
    addKid, updateKid, removeKid, getKidByLinkCode, getKidById, regenerateLinkCode,
    addStarsToKid, recordAnswerForKid, recordGamePlayedForKid, advanceQuestForKid,
    rewards: db.rewards, setRewards,
    tasks: db.tasks, setTasks, getTasksForKid, addTask, markTaskDone, approveTask, removeTask,
    activeKidId, setActiveKidId,
    members: db.members, addMember, updateMember, removeMember,
    familyId, pairingCode, validatePairingCode, refreshData,
  };
}
