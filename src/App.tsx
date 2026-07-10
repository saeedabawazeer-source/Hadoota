import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Star, Lock, Unlock, Home, Gamepad2, CheckCircle, Store, Settings, User, Volume2, ArrowLeft, ArrowRight, X, Flame, Car, Rocket, Brain, Wand2, Calculator, Lightbulb, Shapes, Hash, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStickyState } from './hooks/useStickyState';
import { useSound } from './hooks/useSound';
import { useParentStore } from './hooks/useParentStore';
import { useChatStore } from './hooks/useChatStore';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { KidLinkEntry } from './components/KidLinkEntry';
import { GameRouter } from './components/Games3D';
import { WordPopGame } from './components/WordPopGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { QuestMap } from './components/QuestMap';
import { CountingGame } from './components/CountingGame';
import { ShapeSortGame } from './components/ShapeSortGame';
import { StoryEngine, StoryCard } from './components/StoryEngine';
import { QuizGame } from './components/QuizGame';
import { ParentDashboard } from './components/ParentDashboard';
import { FamilyChatPanel } from './components/FamilyChatPanel';
import { FamilyBuilder } from './components/FamilyBuilder';
import { CharacterCreator } from './components/CharacterCreator';
import { AvatarFace } from './avatar/AvatarFace';
import { DEFAULT_AVATAR } from './avatar/avatar';
import { mathQuestions, spellingQuestions, logicQuestions, scienceQuestions, geographyQuestions, memoryQuestions } from './data/questions';
import { characterFor, HERO_CHARACTERS } from './data/characters';
import { SELECTABLE_COMPLEXIONS } from './data/complexions';
import { FaceIcon } from './components/FaceIcon';
import { GAME_CONFIGS } from './data/games3d';
import { MiniViewer } from './components/MiniViewer';
import { TownHub } from './components/TownHub';
import type { Task, Reward, GameStats, AppView, KidProfile, ParentProfile } from './types';

export default function App() {
  const store = useParentStore();
  const chatStore = useChatStore(store.familyId);

  // View state (not persisted — always starts at landing)
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // The currently active kid profile (set when kid links via code or parent selects)
  const [activeKid, setActiveKid] = useState<KidProfile | null>(null);
  
  // The currently active parent (set after PIN entry)
  const [activeParent, setActiveParent] = useState<ParentProfile | null>(null);

  const [soundEnabled, setSoundEnabled] = useStickyState(true, 'h_sound');
  const playSound = useSound(soundEnabled);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const childName = activeKid?.name || '';
  const avatarSeed = activeKid?.avatarSeed || 'Fin';
  const characterColor = activeKid?.characterColor || 0;
  const complexion = activeKid?.complexion || 'default';
  const stars = activeKid?.stars || 0;
  const streak = activeKid?.streak || 0;
  const questProgress = activeKid?.questProgress || 0;
  const difficulty = activeKid?.difficulty || 'easy';
  const gameStats = activeKid?.gameStats || { gamesPlayed: 0, totalCorrect: 0, totalWrong: 0, totalStarsEarned: 0, subjectStats: {}, dailyActivity: [] };

  // Kid-specific mutations that go through store
  const addStars = (amount: number) => {
    if (!activeKid) return;
    store.addStarsToKid(activeKid.id, amount);
    // Update local ref
    setActiveKid(prev => prev ? { ...prev, stars: prev.stars + amount } : prev);
  };

  const recordAnswer = (correct: boolean) => {
    if (!activeKid) return;
    store.recordAnswerForKid(activeKid.id, correct);
  };

  const advanceQuest = () => { if (activeKid) store.advanceQuestForKid(activeKid.id, 25); };

  if (!store.isLoaded) {
    return (
      <div className="h-[100dvh] w-full bg-purple-600 font-sans flex items-center justify-center text-white text-2xl font-black uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  const setAvatarSeed = (seed: string) => {
    if (!activeKid) return;
    store.updateKid(activeKid.id, { avatarSeed: seed });
    setActiveKid(prev => prev ? { ...prev, avatarSeed: seed } : prev);
  };

  const setComplexion = (id: string) => {
    if (!activeKid) return;
    store.updateKid(activeKid.id, { complexion: id });
    setActiveKid(prev => prev ? { ...prev, complexion: id } : prev);
  };

  const setStars = (fn: (p: number) => number) => {
    if (!activeKid) return;
    const newStars = fn(activeKid.stars);
    store.updateKid(activeKid.id, { stars: newStars });
    setActiveKid(prev => prev ? { ...prev, stars: newStars } : prev);
  };

  // Tasks for the active kid
  const assignedTasks = activeKid ? store.getTasksForKid(activeKid.id) : [];
  const setAssignedTasks = (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    // This is a compatibility shim — direct mutations go through store
    if (typeof newTasks === 'function') {
      const updated = newTasks(assignedTasks);
      store.setTasks(prev => [...prev.filter(t => t.kidId !== activeKid?.id), ...updated]);
    } else {
      store.setTasks(prev => [...prev.filter(t => t.kidId !== activeKid?.id), ...newTasks]);
    }
  };

  // --- ROUTING ---

  // Landing Page
  if (view === 'landing') {
    return (
      <LandingPage
        isParentSetup={store.isParentSetup}
        onParentSetup={() => setView(store.isParentSetup ? 'parent' : 'parent-setup')}
        onKidLink={() => setView('kid-link')}
      />
    );
  }

  // Parent Onboarding
  if (view === 'parent-setup') {
    return (
      <Onboarding
        onComplete={async ({ parentName, kid }) => {
          await store.createParentAccount(parentName);
          // createParentAccount is now async — wait for it to finish, then add kid
          // Small delay to ensure state has settled
          setTimeout(async () => {
            const newKid = await store.addKid(kid);
            setActiveKid(newKid);
            setView('parent');
          }, 100);
        }}
        onBack={() => setView('landing')}
      />
    );
  }

  // Kid Link Entry
  if (view === 'kid-link') {
    return (
      <KidLinkEntry
        getKidByLinkCode={store.getKidByLinkCode}
        validatePairingCode={store.validatePairingCode}
        onLink={(kid) => { setActiveKid(kid); store.setActiveKidId(kid.id); setView('kid'); }}
        onBack={() => setView('landing')}
      />
    );
  }

  // Parent Selector (when multiple parents exist)
  if (view === 'parent' && !activeParent && store.isParentSetup) {
    if (store.parentAccount!.parents.length === 1) {
      setActiveParent(store.parentAccount!.parents[0]);
      if (!activeKid && store.parentAccount!.kids.length > 0) {
        setActiveKid(store.parentAccount!.kids[0]);
      }
      return <div className="h-[100dvh] bg-purple-600" />;
    }

    return (
      <div className="h-[100dvh] w-full bg-purple-600 font-sans flex flex-col items-center justify-center p-4 md:p-6"
           style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="w-full max-w-md bg-white border-4 border-black p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-full">
          <h2 className="text-3xl font-black uppercase mb-6 text-black text-center shrink-0">Who's Managing?</h2>
          <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            {store.parentAccount!.parents.map(p => (
              <motion.button key={p.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                setActiveParent(p);
                if (!activeKid && store.parentAccount!.kids.length > 0) setActiveKid(store.parentAccount!.kids[0]);
              }} className="bg-lime-400 border-4 border-black p-4 rounded-2xl font-black text-xl md:text-2xl uppercase hover:bg-lime-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer shrink-0">
                {p.name}
              </motion.button>
            ))}
          </div>
          <button onClick={() => setView('landing')} className="mt-6 shrink-0 bg-gray-200 border-4 border-black p-3 rounded-xl font-bold uppercase hover:bg-gray-300 flex items-center justify-center gap-2 w-full cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>
      </div>
    );
  }

  const gameModalProps = {
    addStars, showToast, playSound,
    advanceQuest: () => {
      advanceQuest();
      const gameType = activeModal?.split(': ')[1] || '';
      const task = assignedTasks?.find((t: Task) => t.title === gameType || t.type === gameType);
      if (task) { addStars(task.reward); showToast(`Quest Complete! +${task.reward} Stars!`); setAssignedTasks(assignedTasks.filter((t: Task) => t.id !== task.id)); }
    },
  };

  // Main App
  return (
    <div className="h-[100dvh] w-full bg-orange-500 font-sans selection:bg-lime-400 flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 overflow-hidden"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>

      {/* Desktop Sidebar */}
      {view === 'kid' && (
        <nav className="hidden md:flex flex-col w-24 lg:w-32 bg-purple-600 border-4 border-black rounded-[2rem] items-center py-6 gap-6 z-40 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0 h-full" role="navigation" aria-label="Main navigation">
          <div className="bg-lime-400 p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4"><Sparkles className="w-8 h-8 text-black" /></div>
          <div className="flex flex-col gap-4 flex-1 w-full px-3">
            <NavBtn icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavBtn icon={<Gamepad2 />} label="Games" active={activeTab === 'games'} onClick={() => setActiveTab('games')} />
            <NavBtn icon={<CheckCircle />} label="Chores" active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} />
            <NavBtn icon={<MessageCircle />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
            <NavBtn icon={<BookOpen />} label="Stories" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { playSound('pop'); setActiveTab('store'); }}
              className={`bg-lime-400 border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto my-4 ${activeTab === 'store' ? 'ring-4 ring-white' : ''}`} aria-label="Reward Store">
              <Store className="w-8 h-8 text-black" />
            </motion.button>
            <NavBtn icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </nav>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-4 md:gap-6 relative">
        <header className="flex justify-between items-center shrink-0 z-20">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 md:gap-2 bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" aria-label={`${stars} stars`}>
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
            <motion.span key={stars} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-black text-sm md:text-base">{stars}</motion.span>
          </motion.div>
        </header>

        <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto min-h-0 flex flex-col" role="main">
          <AnimatePresence mode="wait">
            <motion.div key={view + activeTab} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col min-h-0">
              {view === 'kid' ? (
                <KidViews activeTab={activeTab} setActiveTab={setActiveTab} setActiveModal={setActiveModal} activeModal={activeModal} avatarSeed={avatarSeed} characterColor={characterColor} complexion={complexion}
                  familyName={store.parentAccount?.parents?.[0]?.name || childName || 'Our'}
                  members={store.members} avatarConfig={activeKid?.avatarConfig}
                  saveAvatarConfig={(cfg: any) => { if (activeKid) { store.updateKid(activeKid.id, { avatarConfig: cfg }); setActiveKid(prev => prev ? { ...prev, avatarConfig: cfg } : prev); } }}
                  parentSeeds={HERO_CHARACTERS.filter(c => c.id !== avatarSeed).slice(0, Math.max(1, (store.parentAccount?.parents?.length || 1))).map(c => c.id)}
                  stars={stars} setStars={setStars} rewards={store.rewards} streak={streak} questProgress={questProgress} setQuestProgress={() => advanceQuest()}
                  showToast={showToast} assignedTasks={assignedTasks} addStars={addStars} playSound={playSound} childName={childName} difficulty={difficulty}
                  setAssignedTasks={setAssignedTasks} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} chatStore={chatStore} activeKid={activeKid} parentAccount={store.parentAccount}
                  setDifficulty={(d: any) => { if (activeKid) { store.updateKid(activeKid.id, { difficulty: d }); setActiveKid(prev => prev ? { ...prev, difficulty: d } : prev); } }} setAvatarSeed={setAvatarSeed} />
              ) : (
                <ParentDashboard rewards={store.rewards} setRewards={store.setRewards} assignedTasks={assignedTasks} setAssignedTasks={setAssignedTasks}
                  gameStats={gameStats} childName={childName} activeKid={activeKid} parentAccount={store.parentAccount} activeParent={activeParent} addParent={store.addParent}
                  addStarsToKid={store.addStarsToKid} chatStore={chatStore}
                  onSelectKid={(kid) => setActiveKid(kid)} onBack={() => setView('landing')} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Nav */}
      {view === 'kid' && (
        <nav className="md:hidden sticky bottom-0 left-0 right-0 h-20 bg-purple-600 border-4 border-black rounded-[2rem] mt-auto flex items-center z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" role="navigation" aria-label="Mobile navigation">
          <div className="flex-1 flex justify-around items-center pl-2 pr-10">
            <NavBtn icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavBtn icon={<Gamepad2 />} label="Games" active={activeTab === 'games'} onClick={() => setActiveTab('games')} />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-30">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { playSound('pop'); setActiveTab('store'); }}
              className={`bg-lime-400 border-4 border-black p-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${activeTab === 'store' ? 'ring-4 ring-white ring-offset-4 ring-offset-purple-600' : ''}`} aria-label="Reward Store">
              <Store className="w-8 h-8 text-black" />
            </motion.button>
          </div>
          <div className="flex-1 flex justify-around items-center pr-2 pl-10">
            <NavBtn icon={<CheckCircle />} label="Chores" active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} />
            <NavBtn icon={<MessageCircle />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          </div>
        </nav>
      )}

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <ModalWrap onClose={() => setActiveModal(null)} fullScreen={activeModal.startsWith('Game:') || activeModal.startsWith('Story:')}>
            {activeModal === 'Settings' && <SettingsPanel avatarSeed={avatarSeed} complexion={complexion}
              setAvatarSeed={setAvatarSeed}
              setComplexion={setComplexion}
              onClose={() => setActiveModal(null)} />}
            {activeModal === 'Family' && <FamilyBuilder members={store.members} addMember={store.addMember} updateMember={store.updateMember} removeMember={store.removeMember} onClose={() => setActiveModal(null)} />}
            {activeModal.startsWith('Game:') && <GameRouter onClose={() => setActiveModal(null)} {...gameModalProps} avatarSeed={avatarSeed} characterColor={characterColor} complexion={complexion} gameKey={activeModal.split(': ')[1]} difficulty={difficulty} />}
            {activeModal.startsWith('Story:') && <StoryEngine topic={activeModal.split(': ')[1]} onClose={() => setActiveModal(null)} kidName={childName} />}
          </ModalWrap>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-lime-400 border-4 border-lime-400 px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-lg md:text-2xl uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 whitespace-nowrap" role="alert">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Nav Button ---
function NavBtn({ icon, label, active, onClick }: { icon: React.ReactElement; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={onClick} aria-label={label} aria-current={active ? 'page' : undefined}
      className={`flex flex-col items-center justify-center gap-1 transition-all w-16 md:w-full ${active ? 'text-white scale-110' : 'text-white/70 hover:text-white'}`}>
      <div className={active ? 'bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl text-black' : 'p-2 text-white'}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 md:w-8 md:h-8" })}
      </div>
      <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
    </motion.button>
  );
}

// --- Kid Views ---
function KidViews({ activeTab, setActiveTab, setActiveModal, activeModal, avatarSeed, characterColor, complexion, familyName, parentSeeds, members, avatarConfig, saveAvatarConfig, stars, setStars, rewards, streak, questProgress, setQuestProgress, showToast, assignedTasks, addStars, playSound, childName, difficulty, setAssignedTasks, soundEnabled, setSoundEnabled, setDifficulty, setAvatarSeed, chatStore, activeKid, parentAccount }: any) {
  if (activeTab === 'store') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">REWARD STORE</h2>
          <div className="bg-lime-400 border-4 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <Star className="w-5 h-5 md:w-8 md:h-8 fill-amber-400 text-amber-400" /><span className="font-black text-xl md:text-3xl">{stars}</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto pr-2 pb-4 md:pb-0 content-start">
          {rewards.map((r: Reward) => (
            <div key={r.id} className="bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-purple-100 rounded-full border-4 border-black flex items-center justify-center">
                <Star className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tighter">{r.title}</h3>
              <div className="flex-1" />
              <button onClick={() => { if (stars >= r.cost) { setStars(stars - r.cost); showToast(`Redeemed: ${r.title}!`); } else showToast(`Need ${r.cost - stars} more stars!`); }}
                className={`w-full py-3 rounded-2xl border-4 border-black font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none
                  ${stars >= r.cost ? 'bg-lime-400 hover:bg-lime-500 text-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                <Star className={`w-5 h-5 ${stars >= r.cost ? 'fill-black text-black' : 'fill-gray-500 text-gray-500'}`} />{r.cost}
              </button>
            </div>
          ))}
          {rewards.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
              <Store className="w-24 h-24 mb-4 opacity-50" /><p className="font-black text-2xl uppercase">No rewards yet!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'chat' && activeKid) {
    // Build family members list from parentAccount
    const familyMembers: { id: string; name: string; type: 'parent' | 'child' }[] = [];
    if (parentAccount) {
      for (const p of parentAccount.parents) {
        familyMembers.push({ id: p.id, name: p.name, type: 'parent' });
      }
      for (const k of parentAccount.kids) {
        familyMembers.push({ id: k.id, name: k.name, type: 'child' });
      }
    }
    return (
      <div className="w-full h-full flex flex-col gap-3 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-black">MESSAGES</h2>
          <div className="bg-lime-400 border-3 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><MessageCircle className="w-5 h-5 text-black" /></div>
        </div>
        <div className="flex-1 min-h-0">
          <FamilyChatPanel
            chatStore={chatStore}
            currentUserId={activeKid.id}
            currentUserName={activeKid.name}
            currentUserType="child"
            familyMembers={familyMembers}
            compact
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'chores') {
    const chores = (assignedTasks || []).filter((t: Task) => t.isChore && (t.status === 'pending' || t.status === 'done'));
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">MY CHORES</h2>
          <div className="bg-lime-400 border-4 border-black p-2 md:p-3 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-black" /></div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 pb-4 md:pb-0 content-start">
          {chores.map((chore: Task) => (
            <div key={chore.id} className={`bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-4 ${chore.status === 'done' ? 'opacity-70' : ''}`}>
              <div className="w-20 h-20 bg-blue-100 rounded-full border-4 border-black flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tighter">{chore.title}</h3>
              <div className="flex-1" />
              <button 
                onClick={() => {
                  if (chore.status === 'pending') {
                    setAssignedTasks(assignedTasks.map((t: Task) => t.id === chore.id ? { ...t, status: 'done' } : t));
                    showToast('Waiting for parent approval!');
                    playSound('pop');
                  }
                }}
                disabled={chore.status === 'done'}
                className={`w-full py-3 rounded-2xl border-4 border-black font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-transform ${chore.status === 'done' ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none translate-y-1' : 'bg-lime-400 hover:bg-lime-500 text-black active:translate-y-1 active:shadow-none cursor-pointer'}`}>
                {chore.status === 'done' ? 'Pending Approval' : 'I Did It!'}
                <Star className={`w-5 h-5 ${chore.status === 'done' ? 'fill-gray-500 text-gray-500' : 'fill-black text-black'}`} />{chore.reward}
              </button>
            </div>
          ))}
          {chores.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
              <CheckCircle className="w-24 h-24 mb-4 opacity-50 text-lime-600" />
              <p className="font-black text-2xl uppercase text-black">All Done!</p>
              <p className="font-bold text-lg text-black">No chores assigned right now.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'games') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">GAMES</h2>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border-4 border-black rounded-xl px-3 py-2 font-black uppercase bg-lime-400 text-black" aria-label="Difficulty level">
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto pr-2 pb-4 md:pb-0 content-start">
          {Object.values(GAME_CONFIGS).map((g) => (
            <GameCard key={g.key} bg={g.color} title={g.title} emoji={g.emoji} onClick={() => setActiveModal('Game: ' + g.key)} />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'stories') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">STORIES</h2>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 pb-4 md:pb-0 content-start">
          <GameCard color="bg-lime-400" title="Magic Maker" iconImg="/icons/Main/Star/64px/Blue Star 1st 64px.png" onClick={() => setActiveModal('Story: Magic')} />
          <StoryCard title="Jungle Quest" image="jungle explorer" onClick={() => setActiveModal('Story: Jungle Explorer')} />
          <StoryCard title="Space Dino" image="dinosaur in space" onClick={() => setActiveModal('Story: Space Dinosaur')} />
          <StoryCard title="Ocean Explorer" image="submarine ocean" onClick={() => setActiveModal('Story: Ocean Explorer')} />
        </div>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">SETTINGS</h2>
        </div>
        <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 pb-4 md:pb-0">
          <button onClick={() => setActiveModal('Settings')} className="shrink-0 h-28 md:h-36 bg-purple-500 border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between text-white hover:bg-purple-600 transition-colors">
            <span className="font-black uppercase text-2xl md:text-4xl" style={{ textShadow: '2px 2px 0px black' }}>Change Avatar</span>
            <User className="w-12 h-12 md:w-16 md:h-16" />
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className={`shrink-0 h-28 md:h-36 border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between transition-colors ${soundEnabled ? 'bg-lime-400 text-black hover:bg-lime-500' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'}`}>
            <span className="font-black uppercase text-2xl md:text-4xl">Sound {soundEnabled ? 'ON' : 'OFF'}</span>
            <Volume2 className="w-12 h-12 md:w-16 md:h-16" />
          </button>
          <div className="shrink-0 bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black uppercase text-xl mb-3">Difficulty Level</h3>
            <div className="flex gap-3">
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-2xl border-4 border-black font-black uppercase text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors ${difficulty === d ? 'bg-lime-400 text-black' : 'bg-gray-100 text-gray-500'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HOME SCREEN
  return (
    <div className="w-full h-full flex flex-col gap-3 md:gap-5 overflow-y-auto pr-1 pb-4 md:pb-0 content-start">
      {/* Greeting on top */}
      <div className="shrink-0 flex items-center gap-3">
        <motion.div whileTap={{ scale: 0.92 }} onClick={() => setActiveModal('Settings')}
          className="w-12 h-12 md:w-16 md:h-16 border-4 border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center cursor-pointer shrink-0" style={{ background: characterFor(avatarSeed).accent }}>
          <FaceIcon seed={avatarSeed} complexion={complexion} alt="Avatar" className="w-full h-full object-cover" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none truncate">Hi, {childName || 'Friend'}!</h1>
          {streak > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {[...Array(Math.min(streak, 3))].map((_, i) => <Flame key={i} className="w-4 h-4 text-red-500 fill-red-500" />)}
              <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">{streak} day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* The floating island — lives directly in the UI, no box (unmounts while a game is open) */}
      <div className="shrink-0 relative h-[46vh] md:h-[52vh] -mx-2 md:-mx-4">
        {!activeModal?.startsWith('Game:') && (
          <TownHub seed={avatarSeed} complexion={complexion} familyName={familyName} parentSeeds={parentSeeds} members={members} onPlay={setActiveModal} />
        )}
      </div>

      {/* Chores Preview */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-black">Chores</h3>
          <button onClick={() => setActiveTab('chores')} className="bg-white border-2 border-black px-3 py-1 rounded-full font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-400 uppercase tracking-widest">View All</button>
        </div>
        {(!assignedTasks || assignedTasks.filter((t: Task) => t.isChore && t.status === 'pending').length === 0) ? (
          <div className="bg-white/60 border-3 border-dashed border-gray-300 rounded-2xl p-4 text-center"><p className="font-bold text-gray-400 text-sm uppercase tracking-widest">✅ No chores right now</p></div>
        ) : (
          <div className="flex flex-col gap-2">
            {assignedTasks.filter((t: Task) => t.isChore && t.status === 'pending').slice(0, 2).map((chore: Task) => (
              <div key={chore.id} className="bg-white border-3 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                <span className="font-black text-sm truncate pr-2">{chore.title}</span>
                <button onClick={() => { setAssignedTasks(assignedTasks.map((t: Task) => t.id === chore.id ? { ...t, status: 'done' as const } : t)); showToast('Sent for approval!'); }}
                  className="shrink-0 bg-lime-400 border-2 border-black px-3 py-1 rounded-full font-bold text-xs uppercase hover:bg-lime-500 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" aria-label="Mark as done">
                  Done ✋
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Game Card ---
function GameCard({ color, title, iconImg, emoji, bg, onClick, white, lime }: { color?: string; title: string; iconImg?: string; emoji?: string; bg?: string; onClick: () => void; white?: boolean; lime?: boolean }) {
  const textColor = white ? 'text-white' : lime ? 'text-lime-400' : 'text-black';
  return (
    <motion.button whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      style={bg ? { background: bg } : undefined}
      className={`${color || ''} border-4 border-black p-4 md:p-6 rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-2 md:gap-3 group h-36 md:h-48 cursor-pointer transition-colors relative overflow-hidden`}>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      <div className="relative z-10 flex items-center justify-center">
        {emoji
          ? <span className="text-5xl md:text-7xl" style={{ filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.4))' }}>{emoji}</span>
          : <img src={iconImg} alt={title} className="w-10 h-10 md:w-16 md:h-16 object-contain" />}
      </div>
      <span className="font-black uppercase tracking-tighter text-lg md:text-2xl text-center leading-tight relative z-10 text-white" style={{ textShadow: '2px 2px 0 #000' }}>{title}</span>
    </motion.button>
  );
}

// --- Modal Wrapper ---
function ModalWrap({ children, onClose, fullScreen }: { children: React.ReactNode; onClose: () => void; fullScreen: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${fullScreen ? 'bg-purple-600' : 'bg-black/90 backdrop-blur-sm p-4 md:p-8'}`} role="dialog" aria-modal="true"
      style={fullScreen ? { paddingTop: 'max(0px, env(safe-area-inset-top))', paddingBottom: 'max(0px, env(safe-area-inset-bottom))' } : {}}>
      <motion.div initial={{ scale: fullScreen ? 1 : 0.9 }} animate={{ scale: 1 }} exit={{ scale: fullScreen ? 1 : 0.9 }}
        className={`w-full h-full relative flex flex-col ${fullScreen ? 'bg-purple-600' : 'bg-purple-600 max-w-4xl rounded-3xl md:rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden'}`}>
        {!fullScreen && (
          <button onClick={onClose} className="absolute top-3 right-3 md:top-6 md:right-6 z-50 p-2 md:p-3 bg-white border-4 border-black hover:bg-lime-400 rounded-full text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" aria-label="Close">
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}
        <div className={`flex-1 overflow-y-auto flex flex-col ${fullScreen ? 'p-6 md:p-12' : 'p-4 md:p-10'}`}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

// --- Settings Panel ---
function SettingsPanel({ avatarSeed, complexion, setAvatarSeed, setComplexion, onClose }: { avatarSeed: string; complexion: string; setAvatarSeed: (s: string) => void; setComplexion: (c: string) => void; onClose: () => void }) {
  // Playable avatars are heroes only — animals host games/stories instead
  // (see data/gameHosts.ts), so there's no hero/animal toggle here anymore.
  const roster = HERO_CHARACTERS;
  const current = characterFor(avatarSeed);
  const currentSeed = current.id;

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto pt-4 overflow-y-auto pb-4">
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-3 shrink-0" style={{ textShadow: '2px 2px 0px black' }}>Make Your Buddy</h2>

      <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-3 shrink-0" style={{ background: current.accent }}>
        <MiniViewer seed={currentSeed} animation="idle" complexion={complexion} />
      </div>

      <div className="bg-black/30 border-2 border-black/40 rounded-2xl px-4 py-2.5 mb-4 w-full text-center shrink-0">
        <span className="text-lg font-black text-white uppercase">{current.name}</span>{' '}
        <span className="font-black uppercase text-xs tracking-widest text-lime-300">· {current.role}</span>
        <p className="font-bold text-xs text-white/90 mt-1">{current.blurb}</p>
      </div>

      {/* Skin tone */}
      <div className="bg-white border-4 border-black p-3 rounded-2xl w-full mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-center uppercase mb-2 text-sm">Skin Tone</h3>
        <div className="flex justify-center flex-wrap gap-2.5">
          {SELECTABLE_COMPLEXIONS.map(cx => (
            <button key={cx.id} onClick={() => setComplexion(cx.id)} title={cx.label}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-4 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform ${complexion === cx.id ? 'ring-4 ring-offset-1 ring-lime-500' : ''}`}
              style={{ background: cx.swatch }} />
          ))}
        </div>
      </div>

      {/* Pick a style — thumbnail grid */}
      <div className="bg-white border-4 border-black p-3 rounded-2xl w-full mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-center uppercase mb-2 text-sm">Pick a Style</h3>
        <div className="grid grid-cols-4 gap-2">
          {roster.map(c => (
            <button key={c.id} onClick={() => setAvatarSeed(c.id)} title={c.name}
              className={`aspect-square rounded-xl border-4 border-black overflow-hidden cursor-pointer hover:scale-105 transition-transform ${currentSeed === c.id ? 'ring-4 ring-purple-500' : ''}`}
              style={{ background: c.accent }}>
              <FaceIcon seed={c.id} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <button onClick={onClose} className="shrink-0 w-full bg-lime-400 border-4 border-black text-black py-3 md:py-4 rounded-2xl font-black text-xl md:text-2xl uppercase hover:bg-lime-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer">Save</button>
    </div>
  );
}
