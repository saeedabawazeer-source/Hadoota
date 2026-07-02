import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { ParentAccount, KidProfile, Reward, Task } from '../types';

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'Extra Screen Time (30m)', cost: 50, icon: 'gamepad' },
  { id: '2', title: 'Choose Movie Night', cost: 100, icon: 'film' },
  { id: '3', title: 'Stay Up Late (1hr)', cost: 150, icon: 'moon' },
];

// Helpers for localStorage persistence of device identity
function getStoredFamilyId(): string | null {
  return localStorage.getItem('h_family_id');
}
function setStoredFamilyId(id: string) {
  localStorage.setItem('h_family_id', id);
}
function getDeviceRole(): 'parent' | 'child' | null {
  return localStorage.getItem('h_device_role') as 'parent' | 'child' | null;
}
function setDeviceRole(role: 'parent' | 'child') {
  localStorage.setItem('h_device_role', role);
}

export function useParentStore() {
  const [parentAccount, setParentAccount] = useState<ParentAccount | null>(null);
  const [rewards, setRewardsState] = useState<Reward[]>(DEFAULT_REWARDS);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [activeKidId, setActiveKidId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(getStoredFamilyId());
  const [pairingCode, setPairingCode] = useState<string | null>(localStorage.getItem('h_pairing_code'));

  // ------------------------------------------------------------------
  // LOAD: fetch all data from Supabase for the stored family_id
  // ------------------------------------------------------------------
  useEffect(() => {
    const storedFamilyId = getStoredFamilyId();
    if (!storedFamilyId) {
      setIsLoaded(true);
      return;
    }

    (async () => {
      try {
        // Fetch family
        const { data: family } = await supabase
          .from('families')
          .select('*')
          .eq('id', storedFamilyId)
          .single();

        if (!family) {
          // Family doesn't exist anymore — clear local state
          localStorage.removeItem('h_family_id');
          setIsLoaded(true);
          return;
        }

        // Fetch pairing code
        const { data: codeRow } = await supabase
          .from('pairing_codes')
          .select('code')
          .eq('family_id', storedFamilyId)
          .eq('is_active', true)
          .limit(1)
          .single();
        if (codeRow) setPairingCode(codeRow.code);

        // Fetch children
        const { data: children } = await supabase
          .from('children')
          .select('*')
          .eq('family_id', storedFamilyId);

        // Fetch rewards
        const { data: rewardsData } = await supabase
          .from('rewards')
          .select('*')
          .eq('family_id', storedFamilyId)
          .eq('is_active', true);

        // Fetch tasks
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*')
          .eq('family_id', storedFamilyId);

        // Fetch game sessions to build stats per kid
        const { data: gameSessions } = await supabase
          .from('game_sessions')
          .select('*')
          .in('child_id', (children || []).map(c => c.id));

        // Build KidProfile objects from DB rows
        const kidProfiles: KidProfile[] = (children || []).map(c => {
          const kidSessions = (gameSessions || []).filter(g => g.child_id === c.id);
          const totalCorrect = kidSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
          const totalWrong = kidSessions.reduce((sum, s) => sum + (s.wrong_answers || 0), 0);
          const totalStarsEarned = kidSessions.reduce((sum, s) => sum + (s.stars_earned || 0), 0);

          return {
            id: c.id,
            name: c.name,
            age: c.age,
            avatarSeed: c.avatar_seed,
            interests: c.interests || [],
            difficulty: c.difficulty,
            linkCode: '', // will be populated below
            stars: c.stars,
            streak: c.streak,
            questProgress: c.quest_progress,
            gameStats: {
              gamesPlayed: kidSessions.length,
              totalCorrect,
              totalWrong,
              totalStarsEarned,
              subjectStats: {},
              dailyActivity: [],
            },
          };
        });

        // Set link codes — all kids in the same family share the family pairing code
        kidProfiles.forEach(k => { k.linkCode = codeRow?.code || ''; });

        const account: ParentAccount = {
          parents: [{ id: 'parent-1', name: 'Parent' }], // placeholder — we store parent name locally
          kids: kidProfiles,
          createdAt: new Date(family.created_at).getTime(),
        };

        // Restore parent name from localStorage if available
        const storedParentName = localStorage.getItem('h_parent_name');
        if (storedParentName) {
          account.parents = [{ id: 'parent-1', name: storedParentName }];
        }

        // Restore additional parents
        const storedParents = localStorage.getItem('h_extra_parents');
        if (storedParents) {
          try {
            const extra = JSON.parse(storedParents);
            account.parents = [account.parents[0], ...extra];
          } catch { /* ignore */ }
        }

        setParentAccount(account);
        setFamilyId(storedFamilyId);

        // Map rewards from DB format
        if (rewardsData && rewardsData.length > 0) {
          setRewardsState(rewardsData.map(r => ({
            id: r.id,
            title: r.title,
            cost: r.cost,
            icon: r.icon || 'star',
          })));
        }

        // Map tasks from DB format
        if (tasksData) {
          setTasksState(tasksData.map(t => ({
            id: t.id,
            title: t.title,
            type: t.type,
            reward: t.reward_stars,
            isChore: t.is_chore,
            status: t.status as 'pending' | 'done' | 'approved',
            kidId: t.child_id,
            completedAt: t.completed_at ? new Date(t.completed_at).getTime() : undefined,
          })));
        }
      } catch (err) {
        console.error('[Hadoota] Failed to load from Supabase:', err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const isParentSetup = parentAccount !== null;

  // ------------------------------------------------------------------
  // PARENT ACCOUNT
  // ------------------------------------------------------------------
  const createParentAccount = async (name: string): Promise<string | null> => {
    try {
      // Call the RPC to create family + pairing code
      const { data, error } = await supabase.rpc('create_family_with_code', {
        pin_hash: 'demo', // no real PIN hash for now
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No data returned from create_family_with_code');

      const { family_id: newFamilyId, pairing_code: newCode } = data[0];

      // Store in localStorage
      setStoredFamilyId(newFamilyId);
      setDeviceRole('parent');
      localStorage.setItem('h_parent_name', name);

      // Seed default rewards into DB for this family
      const rewardInserts = DEFAULT_REWARDS.map(r => ({
        family_id: newFamilyId,
        title: r.title,
        cost: r.cost,
        icon: r.icon,
      }));
      const { data: insertedRewards } = await supabase
        .from('rewards')
        .insert(rewardInserts)
        .select();

      const newAccount: ParentAccount = {
        parents: [{ id: 'parent-1', name }],
        kids: [],
        createdAt: Date.now(),
      };

      setParentAccount(newAccount);
      setFamilyId(newFamilyId);
      setPairingCode(newCode);
      localStorage.setItem('h_pairing_code', newCode);

      if (insertedRewards) {
        setRewardsState(insertedRewards.map(r => ({
          id: r.id,
          title: r.title,
          cost: r.cost,
          icon: r.icon || 'star',
        })));
      }

      return newFamilyId;
    } catch (err) {
      console.error('[Hadoota] Failed to create parent account:', err);
      return null;
    }
  };

  const addParent = (name: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      const newParent = { id: Date.now().toString(), name };
      const newAccount = { ...prev, parents: [...prev.parents, newParent] };
      // Persist extra parents locally (they don't go to DB)
      const extras = newAccount.parents.slice(1);
      localStorage.setItem('h_extra_parents', JSON.stringify(extras));
      return newAccount;
    });
  };

  // ------------------------------------------------------------------
  // KID PROFILES
  // ------------------------------------------------------------------
  const addKid = async (kid: Omit<KidProfile, 'id' | 'linkCode' | 'stars' | 'streak' | 'questProgress' | 'gameStats'>): Promise<KidProfile> => {
    const currentFamilyId = familyId || getStoredFamilyId();
    if (!currentFamilyId) throw new Error('No family ID — run createParentAccount first');

    const { data, error } = await supabase
      .from('children')
      .insert({
        family_id: currentFamilyId,
        name: kid.name,
        age: kid.age,
        avatar_seed: kid.avatarSeed,
        interests: kid.interests || [],
        difficulty: kid.difficulty || 'easy',
      })
      .select()
      .single();

    if (error) throw error;

    const newKid: KidProfile = {
      id: data.id,
      name: data.name,
      age: data.age,
      avatarSeed: data.avatar_seed,
      interests: data.interests || [],
      difficulty: data.difficulty,
      linkCode: pairingCode || localStorage.getItem('h_pairing_code') || '',
      stars: 0,
      streak: 0,
      questProgress: 0,
      gameStats: { gamesPlayed: 0, totalStarsEarned: 0, totalCorrect: 0, totalWrong: 0, subjectStats: {}, dailyActivity: [] },
    };

    setParentAccount(prev => {
      if (!prev) return prev;
      return { ...prev, kids: [...prev.kids, newKid] };
    });

    return newKid;
  };

  const updateKid = async (id: string, updates: Partial<KidProfile>) => {
    // Map frontend field names to DB column names
    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.avatarSeed !== undefined) dbUpdates.avatar_seed = updates.avatarSeed;
    if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
    if (updates.stars !== undefined) dbUpdates.stars = updates.stars;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.questProgress !== undefined) dbUpdates.quest_progress = updates.questProgress;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('children').update(dbUpdates).eq('id', id);
    }

    setParentAccount(prev => {
      if (!prev) return prev;
      return { ...prev, kids: prev.kids.map(k => k.id === id ? { ...k, ...updates } : k) };
    });
  };

  const removeKid = async (id: string) => {
    await supabase.from('children').delete().eq('id', id);
    setParentAccount(prev => {
      if (!prev) return prev;
      return { ...prev, kids: prev.kids.filter(k => k.id !== id) };
    });
  };

  const getKidByLinkCode = (code: string): KidProfile | undefined => {
    // This is now used for local lookup after Supabase validation
    return parentAccount?.kids.find(k => k.linkCode === code);
  };

  const getKidById = (id: string): KidProfile | undefined => {
    return parentAccount?.kids.find(k => k.id === id);
  };

  const regenerateLinkCode = async (kidId: string): Promise<string> => {
    const currentFamilyId = familyId || getStoredFamilyId();
    if (!currentFamilyId) return '';

    // Deactivate old codes
    await supabase
      .from('pairing_codes')
      .update({ is_active: false })
      .eq('family_id', currentFamilyId);

    // Generate new code via the DB function
    const { data: newCode } = await supabase.rpc('generate_pairing_code');

    if (newCode) {
      await supabase.from('pairing_codes').insert({
        family_id: currentFamilyId,
        code: newCode,
      });
      setPairingCode(newCode);

      // Update all kid linkCodes in local state
      setParentAccount(prev => {
        if (!prev) return prev;
        return { ...prev, kids: prev.kids.map(k => ({ ...k, linkCode: newCode })) };
      });

      return newCode;
    }
    return '';
  };

  // ------------------------------------------------------------------
  // VALIDATE PAIRING CODE (for child device)
  // ------------------------------------------------------------------
  const validatePairingCode = async (code: string): Promise<{ familyId: string; kids: KidProfile[] } | null> => {
    try {
      const { data: validatedFamilyId, error } = await supabase.rpc('validate_pairing_code', {
        input_code: code,
      });

      if (error || !validatedFamilyId) return null;

      // Fetch children for this family
      const { data: children } = await supabase
        .from('children')
        .select('*')
        .eq('family_id', validatedFamilyId);

      if (!children || children.length === 0) return null;

      // Fetch game sessions for stats
      const { data: gameSessions } = await supabase
        .from('game_sessions')
        .select('*')
        .in('child_id', children.map(c => c.id));

      const kidProfiles: KidProfile[] = children.map(c => {
        const kidSessions = (gameSessions || []).filter(g => g.child_id === c.id);
        return {
          id: c.id,
          name: c.name,
          age: c.age,
          avatarSeed: c.avatar_seed,
          interests: c.interests || [],
          difficulty: c.difficulty,
          linkCode: code,
          stars: c.stars,
          streak: c.streak,
          questProgress: c.quest_progress,
          gameStats: {
            gamesPlayed: kidSessions.length,
            totalCorrect: kidSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0),
            totalWrong: kidSessions.reduce((sum, s) => sum + (s.wrong_answers || 0), 0),
            totalStarsEarned: kidSessions.reduce((sum, s) => sum + (s.stars_earned || 0), 0),
            subjectStats: {},
            dailyActivity: [],
          },
        };
      });

      // Store family_id for this child device
      setStoredFamilyId(validatedFamilyId);
      setDeviceRole('child');
      setFamilyId(validatedFamilyId);

      // Also load rewards and tasks
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .eq('family_id', validatedFamilyId)
        .eq('is_active', true);

      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('family_id', validatedFamilyId);

      // Build a parent account object for the child device
      const account: ParentAccount = {
        parents: [{ id: 'parent-1', name: 'Parent' }],
        kids: kidProfiles,
        createdAt: Date.now(),
      };
      setParentAccount(account);

      if (rewardsData && rewardsData.length > 0) {
        setRewardsState(rewardsData.map(r => ({
          id: r.id, title: r.title, cost: r.cost, icon: r.icon || 'star',
        })));
      }

      if (tasksData) {
        setTasksState(tasksData.map(t => ({
          id: t.id, title: t.title, type: t.type, reward: t.reward_stars,
          isChore: t.is_chore, status: t.status as 'pending' | 'done' | 'approved',
          kidId: t.child_id,
          completedAt: t.completed_at ? new Date(t.completed_at).getTime() : undefined,
        })));
      }

      return { familyId: validatedFamilyId, kids: kidProfiles };
    } catch (err) {
      console.error('[Hadoota] Pairing code validation failed:', err);
      return null;
    }
  };

  // ------------------------------------------------------------------
  // GAME STATS & PROGRESS
  // ------------------------------------------------------------------
  const addStarsToKid = async (kidId: string, amount: number) => {
    // Update in Supabase
    const kid = parentAccount?.kids.find(k => k.id === kidId);
    if (kid) {
      await supabase
        .from('children')
        .update({ stars: kid.stars + amount })
        .eq('id', kidId);
    }

    setParentAccount(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            return {
              ...k,
              stars: k.stars + amount,
              gameStats: { ...k.gameStats, totalStarsEarned: k.gameStats.totalStarsEarned + amount },
            };
          }
          return k;
        }),
      };
    });
  };

  const recordAnswerForKid = async (kidId: string, isCorrect: boolean) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            return {
              ...k,
              gameStats: {
                ...k.gameStats,
                totalCorrect: isCorrect ? k.gameStats.totalCorrect + 1 : k.gameStats.totalCorrect,
                totalWrong: !isCorrect ? k.gameStats.totalWrong + 1 : k.gameStats.totalWrong,
              },
            };
          }
          return k;
        }),
      };
    });
  };

  const recordGamePlayedForKid = async (kidId: string) => {
    setParentAccount(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            return {
              ...k,
              gameStats: { ...k.gameStats, gamesPlayed: k.gameStats.gamesPlayed + 1 },
            };
          }
          return k;
        }),
      };
    });
  };

  const advanceQuestForKid = async (kidId: string, amount: number = 25) => {
    const kid = parentAccount?.kids.find(k => k.id === kidId);
    if (kid) {
      const newProgress = kid.questProgress + amount >= 100 ? 0 : kid.questProgress + amount;
      await supabase.from('children').update({ quest_progress: newProgress }).eq('id', kidId);
    }

    setParentAccount(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        kids: prev.kids.map(k => {
          if (k.id === kidId) {
            const newProgress = k.questProgress + amount;
            return { ...k, questProgress: newProgress >= 100 ? 0 : newProgress };
          }
          return k;
        }),
      };
    });
    recordGamePlayedForKid(kidId);
  };

  // ------------------------------------------------------------------
  // TASKS (chores)
  // ------------------------------------------------------------------
  const getTasksForKid = (kidId: string) => tasks.filter(t => t.kidId === kidId);

  const addTask = async (task: Omit<Task, 'id' | 'status'>) => {
    const currentFamilyId = familyId || getStoredFamilyId();
    if (!currentFamilyId) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        family_id: currentFamilyId,
        child_id: task.kidId || null,
        title: task.title,
        type: task.type,
        reward_stars: task.reward,
        is_chore: task.isChore,
      })
      .select()
      .single();

    if (data) {
      const newTask: Task = {
        id: data.id,
        title: data.title,
        type: data.type,
        reward: data.reward_stars,
        isChore: data.is_chore,
        status: 'pending',
        kidId: data.child_id,
      };
      setTasksState(prev => [...prev, newTask]);
    }
  };

  const markTaskDone = async (taskId: string) => {
    await supabase
      .from('tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', taskId);
    setTasksState(prev => prev.map(t => t.id === taskId ? { ...t, status: 'done' as const } : t));
  };

  const approveTask = async (taskId: string) => {
    // Use the RPC that also pays out stars (fixes the chore approval bug!)
    await supabase.rpc('approve_task_and_pay', { task_id: taskId });

    // Update local state
    const task = tasks.find(t => t.id === taskId);
    if (task && task.kidId) {
      // Refresh kid's star count from DB
      const { data: updatedKid } = await supabase
        .from('children')
        .select('stars')
        .eq('id', task.kidId)
        .single();

      if (updatedKid) {
        setParentAccount(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            kids: prev.kids.map(k => k.id === task.kidId ? { ...k, stars: updatedKid.stars } : k),
          };
        });
      }
    }
    setTasksState(prev => prev.map(t => t.id === taskId ? { ...t, status: 'approved' as const } : t));
  };

  const removeTask = async (taskId: string) => {
    await supabase.from('tasks').delete().eq('id', taskId);
    setTasksState(prev => prev.filter(t => t.id !== taskId));
  };

  // ------------------------------------------------------------------
  // REWARDS
  // ------------------------------------------------------------------
  const setRewards = async (newRewards: Reward[]) => {
    const currentFamilyId = familyId || getStoredFamilyId();
    setRewardsState(newRewards);

    if (!currentFamilyId) return;

    // Find added rewards (no UUID id) and removed rewards
    const currentIds = new Set(rewards.map(r => r.id));
    const newIds = new Set(newRewards.map(r => r.id));

    // Remove deleted rewards
    for (const r of rewards) {
      if (!newIds.has(r.id)) {
        await supabase.from('rewards').update({ is_active: false }).eq('id', r.id);
      }
    }

    // Add new rewards
    for (const r of newRewards) {
      if (!currentIds.has(r.id)) {
        const { data } = await supabase
          .from('rewards')
          .insert({
            family_id: currentFamilyId,
            title: r.title,
            cost: r.cost,
            icon: r.icon || 'gift',
          })
          .select()
          .single();

        if (data) {
          // Update the local state with the real DB id
          setRewardsState(prev => prev.map(existing =>
            existing.id === r.id ? { ...existing, id: data.id } : existing
          ));
        }
      }
    }
  };

  // ------------------------------------------------------------------
  // REFRESH (for child device to pull latest data)
  // ------------------------------------------------------------------
  const refreshData = async () => {
    const currentFamilyId = familyId || getStoredFamilyId();
    if (!currentFamilyId) return;

    // Refresh tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('family_id', currentFamilyId);

    if (tasksData) {
      setTasksState(tasksData.map(t => ({
        id: t.id, title: t.title, type: t.type, reward: t.reward_stars,
        isChore: t.is_chore, status: t.status as 'pending' | 'done' | 'approved',
        kidId: t.child_id,
        completedAt: t.completed_at ? new Date(t.completed_at).getTime() : undefined,
      })));
    }

    // Refresh children
    const { data: children } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', currentFamilyId);

    if (children) {
      setParentAccount(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          kids: prev.kids.map(k => {
            const updated = children.find(c => c.id === k.id);
            if (updated) {
              return { ...k, stars: updated.stars, streak: updated.streak, questProgress: updated.quest_progress };
            }
            return k;
          }),
        };
      });
    }

    // Refresh rewards
    const { data: rewardsData } = await supabase
      .from('rewards')
      .select('*')
      .eq('family_id', currentFamilyId)
      .eq('is_active', true);

    if (rewardsData) {
      setRewardsState(rewardsData.map(r => ({
        id: r.id, title: r.title, cost: r.cost, icon: r.icon || 'star',
      })));
    }
  };

  return {
    isLoaded,
    parentAccount, isParentSetup,
    createParentAccount, addParent,
    addKid, updateKid, removeKid, getKidByLinkCode, getKidById, regenerateLinkCode,
    addStarsToKid, recordAnswerForKid, recordGamePlayedForKid, advanceQuestForKid,
    rewards, setRewards,
    tasks, setTasks: setTasksState, getTasksForKid, addTask, markTaskDone, approveTask, removeTask,
    activeKidId, setActiveKidId,
    // New Supabase-specific exports
    familyId, pairingCode, validatePairingCode, refreshData,
  };
}
