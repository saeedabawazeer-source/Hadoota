import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Star, Lock, Unlock, Home, Gamepad2, CheckCircle, Store, Settings, User, Volume2, ArrowLeft, ArrowRight, X, Flame, Car, Rocket, Brain, Wand2, Calculator, Lightbulb, Shapes, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStickyState } from './hooks/useStickyState';
import { useSound } from './hooks/useSound';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { CarDashGame } from './components/CarDashGame';
import { WordPopGame } from './components/WordPopGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { QuestMap } from './components/QuestMap';
import { CountingGame } from './components/CountingGame';
import { ShapeSortGame } from './components/ShapeSortGame';
import { StoryEngine, StoryCard } from './components/StoryEngine';
import { QuizGame } from './components/QuizGame';
import { ParentDashboard } from './components/ParentDashboard';
import { mathQuestions, spellingQuestions, logicQuestions, scienceQuestions, geographyQuestions, memoryQuestions } from './data/questions';
import type { Task, Reward, GameStats } from './types';

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'Extra 30m Screen Time', cost: 500, icon: 'tv' },
  { id: '2', title: 'Ice Cream Trip', cost: 1500, icon: 'ice-cream' },
  { id: '3', title: 'New Toy ($10)', cost: 5000, icon: 'gift' },
];
const DEFAULT_STATS: GameStats = { gamesPlayed: 0, totalCorrect: 0, totalWrong: 0, totalStarsEarned: 0, subjectStats: {}, dailyActivity: [] };

export default function App() {
  // Onboarding state
  const [setupDone, setSetupDone] = useStickyState(false, 'h_setup');
  const [childName, setChildName] = useStickyState('', 'h_name');
  const [childAge, setChildAge] = useStickyState(6, 'h_age');
  const [avatarSeed, setAvatarSeed] = useStickyState('Felix', 'h_avatar');
  const [parentPin, setParentPin] = useStickyState('1234', 'h_pin');

  // App state
  const [view, setView] = useState<'landing' | 'onboarding' | 'kid' | 'parent'>('landing');
  const [stars, setStars] = useStickyState(0, 'h_stars');
  const [rewards, setRewards] = useStickyState<Reward[]>(DEFAULT_REWARDS, 'h_rewards');
  const [assignedTasks, setAssignedTasks] = useStickyState<Task[]>([], 'h_tasks');
  const [streak, setStreak] = useStickyState(0, 'h_streak');
  const [questProgress, setQuestProgress] = useStickyState(0, 'h_quest');
  const [gameStats, setGameStats] = useStickyState<GameStats>(DEFAULT_STATS, 'h_stats');
  const [soundEnabled, setSoundEnabled] = useStickyState(true, 'h_sound');
  const [difficulty, setDifficulty] = useStickyState('easy', 'h_diff');

  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const playSound = useSound(soundEnabled);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const addStars = (amount: number) => {
    setStars((p: number) => p + amount);
    setGameStats((s: GameStats) => ({ ...s, totalStarsEarned: s.totalStarsEarned + amount }));
  };
  const recordAnswer = (correct: boolean) => {
    setGameStats((s: GameStats) => ({
      ...s,
      totalCorrect: s.totalCorrect + (correct ? 1 : 0),
      totalWrong: s.totalWrong + (correct ? 0 : 1),
    }));
  };
  const recordGamePlayed = () => {
    setGameStats((s: GameStats) => ({ ...s, gamesPlayed: s.gamesPlayed + 1 }));
  };

  // Handle initial view if needed
  useEffect(() => {
    if (setupDone && view === 'onboarding') setView('kid');
  }, [setupDone]);

  // Landing Page
  if (view === 'landing') {
    return <LandingPage setupDone={setupDone} onTryApp={() => setView(setupDone ? 'kid' : 'onboarding')} />;
  }

  // Onboarding
  if (!setupDone && view === 'onboarding') {
    return (
      <Onboarding
        onComplete={({ name, age, avatarSeed: av, pin }) => {
          setChildName(name); setChildAge(age); setAvatarSeed(av); setParentPin(pin);
          setSetupDone(true); setView('kid');
        }}
        onBack={() => setView('landing')}
      />
    );
  }

  const advanceQuest = () => {
    setQuestProgress((p: number) => p + 1);
    recordGamePlayed();
  };

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
          <button onClick={() => { playSound('pop'); view === 'kid' ? setActiveModal('PIN') : setView('kid'); }}
            className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-400 transition-colors"
            aria-label={view === 'kid' ? 'Open parent controls' : 'Switch to kid mode'}>
            {view === 'kid' ? <Lock className="w-4 h-4 md:w-5 md:h-5 text-black" /> : <Unlock className="w-4 h-4 md:w-5 md:h-5 text-black" />}
          </button>
        </header>

        <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto min-h-0 flex flex-col" role="main">
          <AnimatePresence mode="wait">
            <motion.div key={view + activeTab} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col min-h-0">
              {view === 'kid' ? (
                <KidViews activeTab={activeTab} setActiveTab={setActiveTab} setActiveModal={setActiveModal} avatarSeed={avatarSeed}
                  stars={stars} setStars={setStars} rewards={rewards} streak={streak} questProgress={questProgress} setQuestProgress={setQuestProgress}
                  showToast={showToast} assignedTasks={assignedTasks} addStars={addStars} playSound={playSound} childName={childName} difficulty={difficulty}
                  setAssignedTasks={setAssignedTasks} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}
                  setDifficulty={setDifficulty} setAvatarSeed={setAvatarSeed} />
              ) : (
                <ParentDashboard rewards={rewards} setRewards={setRewards} assignedTasks={assignedTasks} setAssignedTasks={setAssignedTasks}
                  gameStats={gameStats} childName={childName} />
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
            <NavBtn icon={<BookOpen />} label="Stories" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} />
          </div>
        </nav>
      )}

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <ModalWrap onClose={() => setActiveModal(null)} fullScreen={activeModal.startsWith('Game:') || activeModal.startsWith('Story:')}>
            {activeModal === 'PIN' && <PinPad pin={parentPin} onSuccess={() => { setView('parent'); setActiveModal(null); showToast('Parent Mode Unlocked'); }} />}
            {activeModal === 'Settings' && <SettingsPanel avatarSeed={avatarSeed} setAvatarSeed={setAvatarSeed} onClose={() => setActiveModal(null)} />}
            {activeModal === 'Game: Math Dash' && <CarDashGame onClose={() => setActiveModal(null)} {...gameModalProps} />}
            {activeModal === 'Game: Spelling' && <WordPopGame onClose={() => setActiveModal(null)} {...gameModalProps}
              gameData={{ title: 'Word Ninja!', tutorial: 'Find the right answer!', questions: spellingQuestions.filter(q => q.difficulty === difficulty || difficulty === 'all').slice(0, 5).map(q => ({ q: q.q, visual: null, options: q.options, a: q.a })) }} />}
            {activeModal === 'Game: Logic' && <MemoryMatchGame onClose={() => setActiveModal(null)} {...gameModalProps} />}
            {activeModal === 'Game: Counting' && <CountingGame onClose={() => setActiveModal(null)} {...gameModalProps} difficulty={difficulty} />}
            {activeModal === 'Game: Shapes' && <ShapeSortGame onClose={() => setActiveModal(null)} {...gameModalProps} difficulty={difficulty} />}
            {activeModal === 'Game: Science' && <QuizGame title="Science Lab!" icon={<Lightbulb className="w-full h-full text-yellow-500" />} questions={scienceQuestions} difficulty={difficulty} onClose={() => setActiveModal(null)} {...gameModalProps} />}
            {activeModal === 'Game: Geography' && <QuizGame title="World Explorer!" icon={<Calculator className="w-full h-full text-blue-500" />} questions={geographyQuestions} difficulty={difficulty} onClose={() => setActiveModal(null)} {...gameModalProps} />}
            {activeModal === 'Game: Memory Quiz' && <QuizGame title="Memory Master!" icon={<Brain className="w-full h-full text-lime-600" />} questions={memoryQuestions} difficulty={difficulty} onClose={() => setActiveModal(null)} {...gameModalProps} />}
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
        {React.cloneElement(icon, { className: "w-6 h-6 md:w-8 md:h-8" })}
      </div>
      <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
    </motion.button>
  );
}

// --- Kid Views ---
function KidViews({ activeTab, setActiveTab, setActiveModal, avatarSeed, stars, setStars, rewards, streak, questProgress, setQuestProgress, showToast, assignedTasks, addStars, playSound, childName, difficulty, setAssignedTasks, soundEnabled, setSoundEnabled, setDifficulty, setAvatarSeed }: any) {
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

  if (activeTab === 'chores') {
    const chores = (assignedTasks || []).filter((t: Task) => t.isChore && t.status === 'pending');
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">MY CHORES</h2>
          <div className="bg-lime-400 border-4 border-black p-2 md:p-3 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-black" /></div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 pb-4 md:pb-0 content-start">
          {chores.map((chore: Task) => (
            <div key={chore.id} className="bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full border-4 border-black flex items-center justify-center"><CheckCircle className="w-10 h-10 text-blue-500" /></div>
              <h3 className="font-black text-2xl uppercase tracking-tighter">{chore.title}</h3>
              <button onClick={() => {
                setAssignedTasks((assignedTasks || []).map((t: Task) => t.id === chore.id ? { ...t, status: 'done' as const } : t));
                showToast('Sent to parent for approval!');
              }}
                className="w-full py-4 rounded-2xl border-4 border-black font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-500 active:translate-y-1 active:shadow-none text-black">
                ✋ I Did It! (+{chore.reward})
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
          <GameCard color="bg-purple-500" title="Math Dash" icon={<Car />} onClick={() => setActiveModal('Game: Math Dash')} white />
          <GameCard color="bg-lime-400" title="Word Jump" icon={<Rocket />} onClick={() => setActiveModal('Game: Spelling')} />
          <GameCard color="bg-white" title="Logic Blocks" icon={<Gamepad2 />} onClick={() => setActiveModal('Game: Logic')} />
          <GameCard color="bg-black" title="Memory Match" icon={<Brain />} onClick={() => setActiveModal('Game: Memory Quiz')} lime />
          <GameCard color="bg-sky-400" title="Counting" icon={<Hash />} onClick={() => setActiveModal('Game: Counting')} white />
          <GameCard color="bg-violet-500" title="Shapes" icon={<Shapes />} onClick={() => setActiveModal('Game: Shapes')} white />
          <GameCard color="bg-amber-400" title="Science" icon={<Lightbulb />} onClick={() => setActiveModal('Game: Science')} />
          <GameCard color="bg-emerald-500" title="Geography" icon={<Calculator />} onClick={() => setActiveModal('Game: Geography')} white />
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
          <GameCard color="bg-lime-400" title="Magic Maker" icon={<Wand2 />} onClick={() => setActiveModal('Story: Magic')} />
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
      {/* Compact Profile + Level */}
      <div className="shrink-0 flex items-center gap-3 md:gap-5 bg-white border-4 border-black p-3 md:p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 }} onClick={() => setActiveModal('Settings')}
          className="w-16 h-16 md:w-20 md:h-20 bg-purple-300 border-3 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl md:rounded-2xl flex items-center justify-center cursor-pointer shrink-0">
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=transparent`} alt="Avatar" className="w-14 h-14 md:w-18 md:h-18" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none truncate">Hi, {childName || 'Friend'}!</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex -space-x-0.5">
              {streak > 0 ? [...Array(Math.min(streak, 3))].map((_, i) => <Flame key={i} className="w-4 h-4 text-red-500 fill-red-500" />) : <Flame className="w-4 h-4 text-gray-400" />}
            </div>
            <span className="font-bold text-xs md:text-sm text-gray-500 uppercase tracking-widest">{streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <QuestMap progress={questProgress} />

      {/* Quick Play - 4 game launchers */}
      <div className="shrink-0">
        <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-black mb-2">Play Now</h3>
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {[
            { color: 'bg-purple-500', emoji: '🏎️', label: 'Math', modal: 'Game: Math Dash' },
            { color: 'bg-sky-400', emoji: '🎈', label: 'Words', modal: 'Game: Spelling' },
            { color: 'bg-amber-400', emoji: '🧠', label: 'Memory', modal: 'Game: Memory Quiz' },
            { color: 'bg-violet-500', emoji: '🔬', label: 'Science', modal: 'Game: Science' },
          ].map(g => (
            <motion.button key={g.label} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModal(g.modal)}
              className={`${g.color} border-3 md:border-4 border-black rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col items-center gap-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
              <span className="text-2xl md:text-3xl">{g.emoji}</span>
              <span className="font-black text-[10px] md:text-xs uppercase tracking-wider text-white" style={{ textShadow: '1px 1px 0px black' }}>{g.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* More Games Row */}
      <div className="shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-black">More Games</h3>
          <button onClick={() => setActiveTab('games')} className="bg-white border-2 border-black px-3 py-1 rounded-full font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-400 uppercase tracking-widest">See All →</button>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {[
            { color: 'bg-lime-400', emoji: '🔢', label: 'Count', modal: 'Game: Counting' },
            { color: 'bg-pink-400', emoji: '🔷', label: 'Shapes', modal: 'Game: Shapes' },
            { color: 'bg-emerald-500', emoji: '🌍', label: 'Geo', modal: 'Game: Geography' },
          ].map(g => (
            <motion.button key={g.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModal(g.modal)}
              className={`${g.color} border-3 md:border-4 border-black rounded-xl md:rounded-2xl p-2 md:p-3 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
              <span className="text-xl md:text-2xl">{g.emoji}</span>
              <span className="font-black text-xs md:text-sm uppercase tracking-wider text-black">{g.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Quick Launch */}
      <motion.button whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
        onClick={() => setActiveTab('stories')}
        className="shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-black rounded-2xl p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between cursor-pointer active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h3 className="font-black text-lg md:text-2xl text-white uppercase" style={{ textShadow: '1px 1px 0px black' }}>AI Stories ✨</h3>
          <p className="font-bold text-white/70 text-xs md:text-sm uppercase tracking-widest">Generate a magic story</p>
        </div>
        <span className="text-4xl md:text-5xl">📖</span>
      </motion.button>

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
function GameCard({ color, title, icon, onClick, white, lime }: { color: string; title: string; icon: React.ReactElement; onClick: () => void; white?: boolean; lime?: boolean }) {
  const textClass = white ? 'text-white' : lime ? 'text-lime-400' : 'text-black';
  return (
    <motion.button whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`${color} border-4 border-black p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-3 md:gap-6 h-full`}>
      <div className={`p-3 md:p-6 rounded-xl md:rounded-2xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${color === 'bg-black' ? 'bg-lime-400' : 'bg-white/50'}`}>
        {React.cloneElement(icon, { className: "w-10 h-10 md:w-16 md:h-16 text-black" })}
      </div>
      <span className={`font-black uppercase tracking-widest ${textClass} text-xl md:text-3xl lg:text-4xl leading-none text-center`} style={white ? { textShadow: '2px 2px 0px black' } : {}}>{title}</span>
    </motion.button>
  );
}

// --- Modal Wrapper ---
function ModalWrap({ children, onClose, fullScreen }: { children: React.ReactNode; onClose: () => void; fullScreen: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${fullScreen ? 'bg-purple-600' : 'bg-black/90 backdrop-blur-sm p-4 md:p-8'}`} role="dialog" aria-modal="true">
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

// --- PIN Pad ---
function PinPad({ pin, onSuccess }: { pin: string; onSuccess: () => void }) {
  const [entry, setEntry] = useState('');
  const [shake, setShake] = useState(false);
  const handlePress = (num: string) => {
    const newPin = entry + num;
    setEntry(newPin);
    if (newPin === pin) onSuccess();
    else if (newPin.length >= 4) { setShake(true); setTimeout(() => { setShake(false); setEntry(''); }, 500); }
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-black text-lime-400 rounded-full flex items-center justify-center mb-6 md:mb-8 border-4 border-lime-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
        <Lock className="w-8 h-8 md:w-10 md:h-10" />
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-2 md:mb-4 shrink-0" style={{ textShadow: '2px 2px 0px black' }}>Parent Area</h2>
      <p className="text-lime-400 font-bold mb-6 md:mb-8 uppercase tracking-widest text-sm md:text-lg shrink-0">Enter your PIN</p>
      <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="flex justify-center gap-4 md:gap-6 mb-8 md:mb-10 shrink-0">
        {[0,1,2,3].map(i => <div key={i} className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-black ${i < entry.length ? 'bg-lime-400' : 'bg-white'}`} />)}
      </motion.div>
      <div className="grid grid-cols-3 gap-3 md:gap-6 w-full shrink-0">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handlePress(n.toString())} className="h-16 md:h-20 bg-white border-4 border-black hover:bg-lime-400 rounded-xl md:rounded-2xl text-3xl md:text-4xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">{n}</button>
        ))}
        <div />
        <button onClick={() => handlePress('0')} className="h-16 md:h-20 bg-white border-4 border-black hover:bg-lime-400 rounded-xl md:rounded-2xl text-3xl md:text-4xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">0</button>
        <button onClick={() => setEntry(entry.slice(0, -1))} className="h-16 md:h-20 bg-orange-400 border-4 border-black hover:bg-orange-500 rounded-xl md:rounded-2xl text-xl md:text-2xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">DEL</button>
      </div>
    </div>
  );
}

// --- Settings Panel ---
function SettingsPanel({ avatarSeed, setAvatarSeed, onClose }: { avatarSeed: string; setAvatarSeed: (s: string) => void; onClose: () => void }) {
  const seeds = ['Felix', 'Aneka', 'Jasper', 'Oliver', 'Mia', 'Leo', 'Zoe', 'Sam', 'Luna', 'Max', 'Nala', 'Koda'];
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 shrink-0" style={{ textShadow: '2px 2px 0px black' }}>Customize Hero</h2>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full">
        <div className="w-40 h-40 md:w-56 md:h-56 bg-purple-300 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8 flex items-center justify-center shrink-0">
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=transparent`} alt="Avatar" className="w-32 h-32 md:w-48 md:h-48" />
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-8 w-full shrink-0">
          <button onClick={() => setAvatarSeed(seeds[(seeds.indexOf(avatarSeed) - 1 + seeds.length) % seeds.length])} className="p-4 bg-white border-4 border-black hover:bg-lime-400 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" aria-label="Previous avatar"><ArrowLeft className="w-6 h-6 text-black" /></button>
          <span className="text-2xl md:text-4xl font-black text-white uppercase w-28 md:w-40 text-center" style={{ textShadow: '2px 2px 0px black' }}>{avatarSeed}</span>
          <button onClick={() => setAvatarSeed(seeds[(seeds.indexOf(avatarSeed) + 1) % seeds.length])} className="p-4 bg-white border-4 border-black hover:bg-lime-400 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" aria-label="Next avatar"><ArrowRight className="w-6 h-6 text-black" /></button>
        </div>
      </div>
      <button onClick={onClose} className="shrink-0 w-full bg-lime-400 border-4 border-black text-black py-4 md:py-6 rounded-2xl font-black text-2xl md:text-3xl uppercase hover:bg-lime-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Save Changes</button>
    </div>
  );
}
