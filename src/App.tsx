import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Brain, Settings, Sparkles, 
  PlayCircle, Mic, Trophy, Star, Lock, Unlock, Wand2, 
  Loader2, Volume2, Gamepad2, ArrowLeft, ArrowRight, X, Flame, Home, User,
  Coins, Sailboat, Apple, Cat, Dog, Sun, Circle, Moon, Rocket, Plane, Bird, Turtle, Fish, Globe, Map, Compass, Heart, Shield, HeartHandshake, CheckCircle, XCircle, PartyPopper, Frown, Calculator, Lightbulb, Eye, Telescope, Microscope, FlaskConical, Magnet, Leaf, Star as StarIcon,
  Gift, Store, Car, TrendingUp, Check, Target
} from 'lucide-react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CarDashGame } from './components/CarDashGame';
import { WordPopGame } from './components/WordPopGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { QuestMap } from './components/QuestMap';

// --- Helpers & Hooks ---
const playSound = (type: 'win' | 'lose' | 'pop') => {
  // Removed sound effects per user request
};

function useStickyState(defaultValue: any, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

const KID_NAME = "Sultan";

// --- Main App ---
const gameData: Record<string, any> = {
  'Math': {
    title: "Pirate Math!",
    tutorial: "Ahoy matey! Count the treasures and pick the right number to win stars!",
    mascot: <Calculator className="w-full h-full text-blue-500" />,
    questions: [
      { 
        q: "You found 3 gold coins and 2 silver coins. How many total?", 
        visual: <div className="flex items-center gap-4 text-yellow-400"><div className="flex"><Coins className="w-12 h-12"/><Coins className="w-12 h-12"/><Coins className="w-12 h-12"/></div> <span className="text-black font-black">+</span> <div className="flex"><Coins className="w-12 h-12"/><Coins className="w-12 h-12"/></div></div>, 
        options: [4, 5, 6], a: 5 
      },
      { 
        q: "A pirate ship has 4 sails, another has 3. Total sails?", 
        visual: <div className="flex items-center gap-4 text-blue-400"><div className="flex"><Sailboat className="w-12 h-12"/><Sailboat className="w-12 h-12"/><Sailboat className="w-12 h-12"/><Sailboat className="w-12 h-12"/></div> <span className="text-black font-black">+</span> <div className="flex"><Sailboat className="w-12 h-12"/><Sailboat className="w-12 h-12"/><Sailboat className="w-12 h-12"/></div></div>, 
        options: [6, 7, 8], a: 7 
      }
    ]
  },
  'Subtraction Safari': {
    title: "Subtraction Safari!",
    tutorial: "Help the animals by subtracting the right amount!",
    mascot: <Calculator className="w-full h-full text-red-500" />,
    questions: [
      { 
        q: "You have 5 apples and eat 2. How many are left?", 
        visual: <div className="flex items-center gap-4 text-red-500"><div className="flex"><Apple className="w-12 h-12"/><Apple className="w-12 h-12"/><Apple className="w-12 h-12"/><Apple className="w-12 h-12"/><Apple className="w-12 h-12"/></div> <span className="text-black font-black">-</span> <div className="flex"><Apple className="w-12 h-12"/><Apple className="w-12 h-12"/></div></div>, 
        options: [2, 3, 4], a: 3 
      },
      { 
        q: "There are 4 birds, 1 flies away. How many are left?", 
        visual: <div className="flex items-center gap-4 text-blue-400"><div className="flex"><Bird className="w-12 h-12"/><Bird className="w-12 h-12"/><Bird className="w-12 h-12"/><Bird className="w-12 h-12"/></div> <span className="text-black font-black">-</span> <div className="flex"><Bird className="w-12 h-12"/></div></div>, 
        options: [2, 3, 4], a: 3 
      }
    ]
  },
  'Spelling': {
    title: "Word Ninja!",
    tutorial: "Find the missing letter to complete the word!",
    mascot: <BookOpen className="w-full h-full text-purple-500" />,
    questions: [
      { q: "Find the missing letter: C _ T (Meow!)", visual: <div className="flex flex-col items-center gap-4"><Cat className="w-24 h-24 text-orange-400" /><span>C _ T</span></div>, options: ['A', 'E', 'O'], a: 'A' },
      { q: "Find the missing letter: D O _ (Woof!)", visual: <div className="flex flex-col items-center gap-4"><Dog className="w-24 h-24 text-amber-600" /><span>D O _</span></div>, options: ['G', 'B', 'P'], a: 'G' },
      { q: "What spells 'Sun'?", visual: <div className="flex flex-col items-center gap-4"><Sun className="w-24 h-24 text-yellow-400" /></div>, options: ['SON', 'SUN', 'SAN'], a: 'SUN' }
    ]
  },
  'Logic': {
    title: "Space Pattern!",
    tutorial: "Look at the shapes and guess what comes next!",
    mascot: <Lightbulb className="w-full h-full text-yellow-500" />,
    questions: [
      { q: "What comes next?", visual: <div className="flex items-center gap-4"><Circle className="w-12 h-12 text-red-500 fill-current"/><Circle className="w-12 h-12 text-blue-500 fill-current"/><Circle className="w-12 h-12 text-red-500 fill-current"/><Circle className="w-12 h-12 text-blue-500 fill-current"/><span className="text-black">?</span></div>, options: ['Red', 'Blue', 'Green'], a: 'Red' },
      { q: "Which is the odd one out?", visual: <div className="flex items-center gap-4"><StarIcon className="w-12 h-12 text-yellow-400 fill-current"/><StarIcon className="w-12 h-12 text-yellow-400 fill-current"/><Moon className="w-12 h-12 text-gray-400 fill-current"/><StarIcon className="w-12 h-12 text-yellow-400 fill-current"/></div>, options: ['Star', 'Moon', 'Sun'], a: 'Moon' },
      { q: "What comes next?", visual: <div className="flex items-center gap-4"><Rocket className="w-12 h-12 text-red-500"/><Plane className="w-12 h-12 text-blue-500"/><Rocket className="w-12 h-12 text-red-500"/><Plane className="w-12 h-12 text-blue-500"/><span className="text-black">?</span></div>, options: ['Rocket', 'Plane', 'Earth'], a: 'Rocket' }
    ]
  },
  'Memory': {
    title: "Memory Match!",
    tutorial: "Remember the animals and answer the questions!",
    mascot: <Eye className="w-full h-full text-lime-600" />,
    questions: [
      { q: "Which animal has a shell?", visual: <div className="flex items-center gap-8"><Turtle className="w-16 h-16 text-green-500"/><Bird className="w-16 h-16 text-blue-400"/><Fish className="w-16 h-16 text-orange-400"/></div>, options: ['Turtle', 'Bird', 'Fish'], a: 'Turtle' },
      { q: "Which one can fly?", visual: <div className="flex items-center gap-8"><Turtle className="w-16 h-16 text-green-500"/><Bird className="w-16 h-16 text-blue-400"/><Fish className="w-16 h-16 text-orange-400"/></div>, options: ['Turtle', 'Bird', 'Fish'], a: 'Bird' },
      { q: "Which one lives in water?", visual: <div className="flex items-center gap-8"><Turtle className="w-16 h-16 text-green-500"/><Bird className="w-16 h-16 text-blue-400"/><Fish className="w-16 h-16 text-orange-400"/></div>, options: ['Dog', 'Cat', 'Fish'], a: 'Fish' }
    ]
  },
  'Geography': {
    title: "World Explorer!",
    tutorial: "Learn about our big beautiful world!",
    mascot: <Telescope className="w-full h-full text-blue-600" />,
    questions: [
      { q: "Which of these is a map?", visual: <div className="flex items-center gap-4"><Map className="w-32 h-32 text-green-600" /></div>, options: ['Map', 'Book', 'Shoe'], a: 'Map' },
      { q: "What shape is the Earth?", visual: <div className="flex items-center gap-4"><Globe className="w-32 h-32 text-blue-500" /></div>, options: ['Round', 'Flat', 'Square'], a: 'Round' }
    ]
  }
};

export default function App() {
  const [view, setView] = useStickyState('kid', 'app_view');
  const [stars, setStars] = useStickyState(1250, 'app_stars');
  const [avatarSeed, setAvatarSeed] = useStickyState('Felix', 'app_avatar');
  const [rewards, setRewards] = useStickyState([
    { id: '1', title: 'Extra 30m Screen Time', cost: 500, icon: 'tv' },
    { id: '2', title: 'Ice Cream Trip', cost: 1500, icon: 'ice-cream' },
    { id: '3', title: 'New Toy ($10)', cost: 5000, icon: 'gift' }
  ], 'app_rewards');
  const [assignedTasks, setAssignedTasks] = useStickyState([], 'app_assigned_tasks');
  const [streak, setStreak] = useStickyState(3, 'app_streak');
  const [questProgress, setQuestProgress] = useStickyState(0, 'app_quest_progress');
  
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addStars = (amount: number) => {
    setStars((prev: number) => prev + amount);
  };

  return (
    <div 
      className="h-[100dvh] w-full bg-orange-500 font-sans selection:bg-lime-400 flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 overflow-hidden"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
      }}
    >
      
      {/* Floating Desktop Sidebar */}
      {view === 'kid' && (
        <nav className="hidden md:flex flex-col w-24 lg:w-32 bg-purple-600 border-4 border-black rounded-[2rem] items-center py-6 gap-6 z-40 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0 h-full">
          <div className="bg-lime-400 p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <div className="flex flex-col gap-4 flex-1 w-full px-3">
            <NavButton icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavButton icon={<Gamepad2 />} label="Games" active={activeTab === 'games'} onClick={() => setActiveTab('games')} />
            <NavButton icon={<CheckCircle />} label="Chores" active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} />
            <NavButton icon={<BookOpen />} label="Stories" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} />
            
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { playSound('pop'); setActiveTab('store'); }}
              className={`bg-lime-400 border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto my-4 transition-colors ${activeTab === 'store' ? 'ring-4 ring-white' : ''}`}
            >
              <Store className="w-8 h-8 text-black" />
            </motion.button>
            
            <NavButton icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </nav>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-4 md:gap-6 relative">
        
        {/* Unified Floating Header (No background, no border) */}
        <header className="flex justify-between items-center shrink-0 z-20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 md:gap-2 bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
            <motion.span key={stars} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-black text-sm md:text-base">{stars}</motion.span>
          </motion.div>
          
          <button 
            onClick={() => { playSound('pop'); view === 'kid' ? setActiveModal('PIN') : setView('kid'); }}
            className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-400 transition-colors"
          >
            {view === 'kid' ? <Lock className="w-4 h-4 md:w-5 md:h-5 text-black" /> : <Unlock className="w-4 h-4 md:w-5 md:h-5 text-black" />}
          </button>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col min-h-0"
            >
                {view === 'kid' ? (
                  <KidViews 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    setActiveModal={setActiveModal} 
                    avatarSeed={avatarSeed} 
                    stars={stars}
                    setStars={setStars}
                    rewards={rewards}
                    streak={streak}
                    questProgress={questProgress}
                    setQuestProgress={setQuestProgress}
                    showToast={showToast}
                    assignedTasks={assignedTasks}
                    addStars={addStars}
                  />
                ) : (
                  <ParentDashboard 
                    rewards={rewards}
                    setRewards={setRewards}
                    assignedTasks={assignedTasks}
                    setAssignedTasks={setAssignedTasks}
                  />
                )}
              </motion.div>
            </AnimatePresence>
        </main>
      </div>

      {/* Floating Mobile Bottom Nav */}
      {view === 'kid' && (
        <nav className="md:hidden sticky bottom-0 left-0 right-0 h-20 bg-purple-600 border-4 border-black rounded-[2rem] mt-auto flex items-center z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 mb-safe">
          <div className="flex-1 flex justify-around items-center pl-2 pr-10">
            <NavButton icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavButton icon={<Gamepad2 />} label="Games" active={activeTab === 'games'} onClick={() => setActiveTab('games')} />
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-30">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { playSound('pop'); setActiveTab('store'); }}
              className={`bg-lime-400 border-4 border-black p-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${activeTab === 'store' ? 'ring-4 ring-white ring-offset-4 ring-offset-purple-600' : ''}`}
            >
              <Store className="w-8 h-8 text-black" />
            </motion.button>
          </div>
          
          <div className="flex-1 flex justify-around items-center pr-2 pl-10">
            <NavButton icon={<CheckCircle />} label="Chores" active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} />
            <NavButton icon={<BookOpen />} label="Stories" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} />
          </div>
        </nav>
      )}

      {/* Modals (Full Screen Overlays) */}
      <AnimatePresence>
        {activeModal && (
          <ModalWrapper 
            onClose={() => setActiveModal(null)}
            fullScreen={activeModal.startsWith('Game:') || activeModal.startsWith('Story:')}
          >
            {activeModal === 'PIN' && <PinPad onSuccess={() => { setView('parent'); setActiveModal(null); showToast('Parent Mode Unlocked'); }} />}
            {activeModal === 'Settings' && <SettingsPanel avatarSeed={avatarSeed} setAvatarSeed={setAvatarSeed} onClose={() => setActiveModal(null)} />}
            {activeModal === 'Voice Assistant' && <VoiceAssistant onClose={() => setActiveModal(null)} />}
            {activeModal.startsWith('Game: Math Dash') && <CarDashGame onClose={() => setActiveModal(null)} addStars={addStars} showToast={showToast} playSound={playSound} advanceQuest={() => {
              setQuestProgress(p => p + 1);
              const task = assignedTasks?.find((t: any) => t.title === 'Math Dash');
              if (task) {
                addStars(task.reward);
                showToast(`Quest Complete! +${task.reward} Stars!`);
                setAssignedTasks(assignedTasks.filter((t: any) => t.id !== task.id));
              }
            }} />}
            {activeModal === 'Game: Spelling' && (
              <WordPopGame 
                onClose={() => setActiveModal(null)} 
                addStars={addStars} 
                showToast={showToast} 
                playSound={playSound} 
                advanceQuest={() => {
                  setQuestProgress(p => p + 1);
                  const task = assignedTasks?.find((t: any) => t.title === 'Word Ninja');
                  if (task) {
                    addStars(task.reward);
                    showToast(`Quest Complete! +${task.reward} Stars!`);
                    setAssignedTasks(assignedTasks.filter((t: any) => t.id !== task.id));
                  }
                }} 
                gameData={gameData['Spelling']} 
              />
            )}
            {activeModal === 'Game: Logic' && (
              <MemoryMatchGame 
                onClose={() => setActiveModal(null)} 
                addStars={addStars} 
                showToast={showToast} 
                playSound={playSound} 
                advanceQuest={() => {
                  setQuestProgress(p => p + 1);
                  const task = assignedTasks?.find((t: any) => t.title === 'Logic Blocks');
                  if (task) {
                    addStars(task.reward);
                    showToast(`Quest Complete! +${task.reward} Stars!`);
                    setAssignedTasks(assignedTasks.filter((t: any) => t.id !== task.id));
                  }
                }} 
              />
            )}
            {activeModal.startsWith('Game:') && !activeModal.startsWith('Game: Math Dash') && activeModal !== 'Game: Spelling' && activeModal !== 'Game: Logic' && <InteractiveGame gameType={activeModal.split(': ')[1]} onClose={() => setActiveModal(null)} addStars={addStars} showToast={showToast} advanceQuest={() => {
              setQuestProgress(p => p + 1);
              const gameType = activeModal.split(': ')[1];
              const task = assignedTasks?.find((t: any) => t.title === gameData[gameType]?.title || t.type === gameType);
              if (task) {
                addStars(task.reward);
                showToast(`Quest Complete! +${task.reward} Stars!`);
                setAssignedTasks(assignedTasks.filter((t: any) => t.id !== task.id));
              }
            }} />}
            {activeModal.startsWith('Story:') && <StoryEngine topic={activeModal.split(': ')[1]} onClose={() => setActiveModal(null)} />}
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-lime-400 border-4 border-lime-400 px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-lg md:text-2xl uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Navigation Button ---
function NavButton({ icon, label, active, onClick }: any) {
  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={() => { playSound('pop'); onClick(); }}
      className={`flex flex-col items-center justify-center gap-1 transition-all w-16 md:w-full ${active ? 'text-white scale-110' : 'text-white/70 hover:text-white'}`}
    >
      <div className={`${active ? 'bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl text-black' : 'p-2 text-white'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 md:w-8 md:h-8" })}
      </div>
      <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
    </motion.button>
  );
}

// --- Kid Views (Strictly contained within h-full) ---
function KidViews({ activeTab, setActiveTab, setActiveModal, avatarSeed, stars, setStars, rewards, streak, questProgress, setQuestProgress, showToast, assignedTasks, addStars }: any) {
  
  if (activeTab === 'store') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">REWARD STORE</h2>
          <div className="bg-lime-400 border-4 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <Star className="w-5 h-5 md:w-8 md:h-8 fill-amber-400 text-amber-400" />
            <span className="font-black text-xl md:text-3xl">{stars}</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto pr-2 custom-scrollbar pb-4 md:pb-0 content-start">
          {rewards.map((reward: any) => (
            <div key={reward.id} className="bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-4">
              <div className="w-24 h-24 bg-purple-100 rounded-full border-4 border-black flex items-center justify-center">
                {reward.icon === 'tv' && <Gamepad2 className="w-12 h-12 text-purple-500" />}
                {reward.icon === 'ice-cream' && <StarIcon className="w-12 h-12 text-pink-500" />}
                {reward.icon === 'gift' && <Gift className="w-12 h-12 text-amber-500" />}
              </div>
              <h3 className="font-black text-2xl uppercase tracking-tighter">{reward.title}</h3>
              <div className="flex-1"></div>
              <button 
                onClick={() => {
                  if (stars >= reward.cost) {
                    setStars(stars - reward.cost);
                    showToast(`Redeemed: ${reward.title}!`);
                  } else {
                    showToast(`Need ${reward.cost - stars} more stars!`);
                  }
                }}
                className={`w-full py-4 rounded-2xl border-4 border-black font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-transform active:translate-y-1 active:shadow-none
                  ${stars >= reward.cost ? 'bg-lime-400 hover:bg-lime-500 text-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                `}
              >
                <Star className={`w-6 h-6 ${stars >= reward.cost ? 'fill-black text-black' : 'fill-gray-500 text-gray-500'}`} />
                {reward.cost}
              </button>
            </div>
          ))}
          {rewards.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
              <Store className="w-24 h-24 mb-4 opacity-50" />
              <p className="font-black text-2xl uppercase">No rewards available yet!</p>
              <p className="font-bold text-lg">Ask your parents to add some.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'chores') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">MY CHORES</h2>
          <div className="bg-lime-400 border-4 border-black p-2 md:p-3 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-black" />
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 custom-scrollbar pb-4 md:pb-0 content-start">
          {assignedTasks?.filter((t: any) => t.isChore).map((chore: any) => (
             <div key={chore.id} className="bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-4">
               <div className="w-20 h-20 bg-blue-100 rounded-full border-4 border-black flex items-center justify-center">
                 <Target className="w-10 h-10 text-blue-500" />
               </div>
               <h3 className="font-black text-2xl uppercase tracking-tighter">{chore.title}</h3>
               <div className="flex-1"></div>
               <button 
                 onClick={() => {
                   // Optimistic completion for now, real app would wait for parent approval
                   addStars(chore.reward);
                   showToast(`Chore Complete! +${chore.reward} Stars!`);
                   // Note: Here we'd ideally mark as pending parent approval
                 }}
                 className="w-full py-4 rounded-2xl border-4 border-black font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-500 transition-transform active:translate-y-1 active:shadow-none text-black"
               >
                 <Check className="w-6 h-6" /> I Did It! (+{chore.reward})
               </button>
             </div>
          ))}
          {(!assignedTasks || assignedTasks.filter((t: any) => t.isChore).length === 0) && (
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
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">GAMES</h2>
        </div>
        
        {assignedTasks && assignedTasks.filter((t: any) => !t.isChore).length > 0 && (
          <div className="shrink-0 bg-yellow-300 border-4 border-black p-4 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-xl md:text-2xl uppercase mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-red-500" />
              Assigned Quests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignedTasks.filter((t: any) => !t.isChore).map((task: any) => (
                <button 
                  key={task.id}
                  onClick={() => setActiveModal(`Game: ${task.title}`)}
                  className="bg-white border-4 border-black p-4 rounded-xl font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex justify-between items-center text-left"
                >
                  <span className="truncate pr-2">{task.title}</span>
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm shrink-0 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> {task.reward}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto pr-2 custom-scrollbar pb-4 md:pb-0 content-start">
          <ActionCard color="bg-purple-500" title="Math Dash" icon={<Car />} onClick={() => setActiveModal('Game: Math Dash')} textColor="text-white" />
          <ActionCard color="bg-lime-400" title="Word Jump" icon={<Rocket />} onClick={() => setActiveModal('Game: Spelling')} textColor="text-black" />
          <ActionCard color="bg-white" title="Logic Blocks" icon={<Gamepad2 />} onClick={() => setActiveModal('Game: Logic')} textColor="text-black" />
          <ActionCard color="bg-black" title="Memory Match" icon={<Brain />} onClick={() => setActiveModal('Game: Memory')} textColor="text-lime-400" />
        </div>
      </div>
    );
  }

  if (activeTab === 'stories') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">STORIES</h2>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 custom-scrollbar pb-4 md:pb-0 content-start">
          <ActionCard color="bg-lime-400" title="Magic Maker" icon={<Wand2 />} onClick={() => setActiveModal('Story: Magic')} textColor="text-black" />
          <StoryCard title="Jungle Quest" image="jungle explorer" onClick={() => setActiveModal('Story: Jungle Explorer')} />
          <StoryCard title="Space Dino" image="dinosaur in space" onClick={() => setActiveModal('Story: Space Dinosaur')} />
          <StoryCard title="Ocean Explorer" image="submarine ocean" onClick={() => setActiveModal('Story: Ocean Explorer')} />
        </div>
        
        <div className="shrink-0 mt-2 md:mt-4 bg-blue-100 border-4 border-black p-4 md:p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <h3 className="font-black text-2xl uppercase mb-2">Need a story buddy?</h3>
            <p className="font-bold">Talk to the friendly book wizard!</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playSound('pop'); setActiveModal('Voice Assistant'); }}
            className="bg-lime-400 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Mic className="w-10 h-10 text-black" />
          </motion.button>
        </div>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="w-full h-full flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto min-h-0">
        <div className="shrink-0 bg-white border-4 border-black p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">SETTINGS</h2>
        </div>
        <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 custom-scrollbar pb-4 md:pb-0">
          <button onClick={() => setActiveModal('Settings')} className="shrink-0 h-32 md:h-40 bg-purple-500 border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between text-white hover:bg-purple-600 transition-colors">
            <span className="font-black uppercase text-2xl md:text-4xl" style={{ textShadow: '2px 2px 0px black' }}>Change Avatar</span>
            <User className="w-12 h-12 md:w-16 md:h-16" />
          </button>
          <button className="shrink-0 h-32 md:h-40 bg-white border-4 border-black p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between text-black hover:bg-gray-100 transition-colors">
            <span className="font-black uppercase text-2xl md:text-4xl">Sound Options</span>
            <Volume2 className="w-12 h-12 md:w-16 md:h-16" />
          </button>
        </div>
      </div>
    );
  }

  // HOME SCREEN
  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 custom-scrollbar pb-4 md:pb-0 content-start">
      {/* Hero Profile */}
      <div className="shrink-0 flex items-center justify-between bg-white border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-lime-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black uppercase tracking-tighter leading-none">Hi,<br/>{KID_NAME}!</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="bg-lime-400 border-4 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(Math.min(streak, 5))].map((_, i) => (
                  <Flame key={i} className="w-5 h-5 md:w-6 md:h-6 text-red-500 fill-red-500" />
                ))}
                {streak === 0 && <Flame className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />}
                {streak > 5 && <span className="font-black text-red-500 ml-1">+{streak - 5}</span>}
              </div>
              <span className="font-black uppercase text-sm md:text-lg ml-2">{streak} Days!</span>
            </div>
          </div>
        </div>
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          onClick={() => setActiveModal('Settings')}
          className="relative z-10 w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 bg-purple-300 border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl md:rounded-3xl flex items-center justify-center cursor-pointer"
        >
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=transparent`} alt="Avatar" className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40" />
        </motion.div>
      </div>

      {/* Quest Map */}
      <QuestMap 
        progress={questProgress} 
        onNodeClick={(node: any) => {
          if (node.type === 'game') {
            if (node.label === 'Math Dash') setActiveModal('Game: Math Dash');
            else if (node.label === 'Word Jump') setActiveModal('Game: Spelling');
            else if (node.label === 'Logic Blocks') setActiveModal('Game: Logic');
            else setActiveModal(`Game: ${node.label}`);
          } else if (node.type === 'reward') {
            setActiveTab('store');
          } else if (node.type === 'boss') {
            showToast("Boss Level Locked!");
          }
        }} 
      />

      {/* Today's Chores (Preview) */}
      <div className="flex flex-col gap-3 md:gap-4 shrink-0">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-xl md:text-2xl uppercase tracking-widest text-black">Today's Chores</h3>
          <button onClick={() => setActiveTab('chores')} className="bg-white border-2 border-black px-3 py-1 rounded-full font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-400">View All</button>
        </div>
        
        {(!assignedTasks || assignedTasks.filter((t: any) => t.isChore).length === 0) ? (
          <div className="bg-white border-4 border-dashed border-gray-300 rounded-3xl p-6 text-center mt-2">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-black text-gray-400 text-base md:text-xl uppercase tracking-widest">No chores yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-2">
            {(assignedTasks || []).filter((t: any) => t.isChore).slice(0, 2).map((chore: any) => (
              <div key={chore.id} className="bg-blue-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                <span className="font-black text-lg truncate pr-2">{chore.title}</span>
                <button 
                  onClick={() => {
                     addStars(chore.reward);
                     showToast(`Chore Complete! +${chore.reward} Stars!`);
                  }}
                  className="shrink-0 bg-lime-400 border-2 border-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-lime-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                >
                  <CheckCircle className="w-6 h-6 text-black" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Playing */}
      <div className="flex flex-col gap-3 md:gap-4 shrink-0">
        <h3 className="font-black text-xl md:text-2xl uppercase tracking-widest text-black">Jump Back In</h3>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <ActionCard color="bg-purple-500" title="Math" icon={<Gamepad2 />} onClick={() => setActiveModal('Game: Math')} textColor="text-white" />
          <ActionCard color="bg-white" title="Stories" icon={<BookOpen />} onClick={() => setActiveTab('stories')} textColor="text-black" />
        </div>
      </div>
    </div>
  );
}

// --- Reusable Cards ---
function ActionCard({ color, title, icon, onClick, textColor }: any) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
      onClick={() => { playSound('pop'); onClick(); }}
      className={`${color} border-4 border-black p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-3 md:gap-6 h-full transition-all`}
    >
      <div className={`p-3 md:p-6 rounded-xl md:rounded-2xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${color === 'bg-black' ? 'bg-lime-400' : 'bg-white/50'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-10 h-10 md:w-16 md:h-16 text-black" })}
      </div>
      <span className={`font-black uppercase tracking-widest ${textColor} text-xl md:text-3xl lg:text-4xl leading-none text-center`} style={textColor === 'text-white' ? { textShadow: '2px 2px 0px black' } : {}}>{title}</span>
    </motion.button>
  );
}

function StoryCard({ title, image, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
      onClick={() => { playSound('pop'); onClick(); }}
      className="bg-white border-4 border-black rounded-2xl md:rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer group flex flex-col"
    >
      <div className="aspect-video bg-black overflow-hidden relative border-b-4 border-black">
        <img src={`https://image.pollinations.ai/prompt/cute%20cartoon%20${encodeURIComponent(image)}%203d%20pixar?width=600&height=400&nologo=true`} alt={title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-lime-400" />
        </div>
      </div>
      <div className="p-3 md:p-5 bg-purple-500 flex items-center justify-center shrink-0">
        <h4 className="font-black text-white text-lg md:text-2xl uppercase tracking-tight text-center leading-none" style={{ textShadow: '2px 2px 0px black' }}>{title}</h4>
      </div>
    </motion.div>
  );
}

// --- Parent Dashboard ---
function ParentDashboard({ rewards, setRewards, assignedTasks, setAssignedTasks }: any) {
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('');

  const handleAddReward = () => {
    if (newRewardTitle && newRewardCost) {
      setRewards([...rewards, { id: Date.now().toString(), title: newRewardTitle, cost: parseInt(newRewardCost), icon: 'gift' }]);
      setNewRewardTitle('');
      setNewRewardCost('');
    }
  };

  const handleRemoveReward = (id: string) => {
    setRewards(rewards.filter((r: any) => r.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-6 min-h-0">
      <div className="shrink-0 bg-white border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl md:rounded-3xl">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase text-center">PARENT HUB</h2>
      </div>

      <div className="shrink-0 grid grid-cols-2 gap-4 md:gap-6">
        <div className="bg-purple-500 border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white flex flex-col justify-center items-center text-center">
          <p className="text-xs md:text-lg font-black uppercase tracking-widest mb-1 md:mb-2">Math Accuracy</p>
          <p className="text-4xl md:text-6xl font-black" style={{ textShadow: '2px 2px 0px black' }}>92%</p>
        </div>
        <div className="bg-lime-400 border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black flex flex-col justify-center items-center text-center">
          <p className="text-xs md:text-lg font-black uppercase tracking-widest mb-1 md:mb-2">Focus Time</p>
          <p className="text-4xl md:text-6xl font-black">4.2h</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-0">
        <div className="bg-white border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0 h-full">
          <h3 className="font-black text-xl md:text-3xl uppercase border-b-4 border-black pb-3 md:pb-4 mb-4 md:mb-6 shrink-0">Manage Rewards</h3>
          
          <div className="flex gap-2 mb-4 shrink-0">
            <input 
              type="text" 
              placeholder="Reward Name" 
              value={newRewardTitle}
              onChange={(e) => setNewRewardTitle(e.target.value)}
              className="flex-1 border-4 border-black p-2 md:p-4 rounded-xl font-bold text-lg min-w-0"
            />
            <input 
              type="number" 
              placeholder="Cost" 
              value={newRewardCost}
              onChange={(e) => setNewRewardCost(e.target.value)}
              className="w-20 md:w-24 border-4 border-black p-2 md:p-4 rounded-xl font-bold text-lg"
            />
            <button 
              onClick={handleAddReward}
              className="bg-lime-400 border-4 border-black px-4 md:px-6 rounded-xl font-black uppercase hover:bg-lime-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar min-h-0">
            {rewards.map((reward: any) => (
              <div key={reward.id} className="flex justify-between items-center bg-gray-100 border-4 border-black p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <Gift className="w-6 h-6 text-purple-600 shrink-0" />
                  <span className="font-bold text-xl truncate">{reward.title}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-black text-xl text-yellow-500 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-current" /> {reward.cost}
                  </span>
                  <button 
                    onClick={() => handleRemoveReward(reward.id)}
                    className="bg-red-500 text-white border-4 border-black p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {rewards.length === 0 && (
              <p className="text-center text-gray-500 font-bold mt-4">No rewards set yet. Add some above!</p>
            )}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0 h-full">
          <h3 className="font-black text-xl md:text-3xl uppercase border-b-4 border-black pb-3 md:pb-4 mb-4 md:mb-6 shrink-0">Assign Tasks & Chores</h3>
          
          <div className="flex flex-col gap-4 mb-4 shrink-0">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Custom Task/Chore" 
                className="flex-1 border-4 border-black p-2 md:p-4 rounded-xl font-bold text-lg min-w-0"
                id="custom-task-title"
              />
              <input 
                type="number" 
                placeholder="Pts" 
                className="w-20 md:w-24 border-4 border-black p-2 md:p-4 rounded-xl font-bold text-lg"
                id="custom-task-pts"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const titleInput = document.getElementById('custom-task-title') as HTMLInputElement;
                  const ptsInput = document.getElementById('custom-task-pts') as HTMLInputElement;
                  if (titleInput?.value && ptsInput?.value) {
                    setAssignedTasks([...(assignedTasks || []), { id: Date.now().toString(), title: titleInput.value, type: 'Custom', reward: parseInt(ptsInput.value), isChore: false }]);
                    titleInput.value = '';
                    ptsInput.value = '';
                  }
                }}
                className="flex-1 bg-yellow-400 border-4 border-black p-3 md:p-4 rounded-xl font-black text-lg md:text-xl uppercase hover:bg-yellow-500 transition-colors text-black flex justify-center items-center gap-2"
              >
                + Game Quest
              </button>
              <button 
                onClick={() => {
                  const titleInput = document.getElementById('custom-task-title') as HTMLInputElement;
                  const ptsInput = document.getElementById('custom-task-pts') as HTMLInputElement;
                  if (titleInput?.value && ptsInput?.value) {
                    setAssignedTasks([...(assignedTasks || []), { id: Date.now().toString(), title: titleInput.value, type: 'Custom', reward: parseInt(ptsInput.value), isChore: true }]);
                    titleInput.value = '';
                    ptsInput.value = '';
                  }
                }}
                className="flex-1 bg-blue-400 border-4 border-black p-3 md:p-4 rounded-xl font-black text-lg md:text-xl uppercase hover:bg-blue-500 transition-colors text-white flex justify-center items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                + Real Chore
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar min-h-0">
            <h4 className="font-bold text-gray-500 uppercase tracking-wider mb-2 shrink-0">Currently Assigned</h4>
            {(assignedTasks || []).map((task: any) => (
              <div key={task.id} className="flex justify-between items-center bg-gray-100 border-4 border-black p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  {task.isChore ? <CheckCircle className="w-6 h-6 text-blue-500 shrink-0" /> : <Target className="w-6 h-6 text-red-500 shrink-0" />}
                  <span className="font-bold text-xl truncate">{task.title} <span className="text-sm text-gray-500">({task.reward} pts)</span></span>
                </div>
                <button 
                  onClick={() => setAssignedTasks((assignedTasks || []).filter((t: any) => t.id !== task.id))}
                  className="bg-red-500 text-white border-4 border-black p-2 rounded-lg hover:bg-red-600 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!assignedTasks || assignedTasks.length === 0) && (
              <p className="text-center text-gray-500 font-bold mt-4">No tasks assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Modals & Overlays ---
function ModalWrapper({ children, onClose, fullScreen }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${fullScreen ? 'bg-purple-600' : 'bg-black/90 backdrop-blur-sm p-4 md:p-8'}`}
    >
      <motion.div 
        initial={{ scale: fullScreen ? 1 : 0.9, y: fullScreen ? 0 : 50 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: fullScreen ? 1 : 0.9, y: fullScreen ? 0 : 50 }}
        className={`w-full h-full relative flex flex-col ${fullScreen ? 'bg-purple-600' : 'bg-purple-600 max-w-4xl rounded-3xl md:rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden'}`}
      >
        {!fullScreen && (
          <button onClick={onClose} className="absolute top-3 right-3 md:top-6 md:right-6 z-50 p-2 md:p-3 bg-white border-4 border-black hover:bg-lime-400 rounded-full text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}
        <div className={`flex-1 overflow-y-auto flex flex-col ${fullScreen ? 'p-6 md:p-12' : 'p-4 md:p-10'}`}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PinPad({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const handlePress = (num: string) => {
    playSound('pop');
    const newPin = pin + num;
    setPin(newPin);
    if (newPin === '1234') {
      playSound('win');
      onSuccess();
    } else if (newPin.length >= 4) {
      playSound('lose');
      setShake(true);
      setTimeout(() => { setShake(false); setPin(''); }, 500);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-black text-lime-400 rounded-full flex items-center justify-center mb-6 md:mb-8 border-4 border-lime-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
        <Lock className="w-8 h-8 md:w-10 md:h-10" />
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-2 md:mb-4 shrink-0" style={{ textShadow: '2px 2px 0px black' }}>Parent Area</h2>
      <p className="text-lime-400 font-bold mb-6 md:mb-8 uppercase tracking-widest text-sm md:text-lg shrink-0">Enter PIN (1234)</p>
      
      <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="flex justify-center gap-4 md:gap-6 mb-8 md:mb-10 shrink-0">
        {[0,1,2,3].map(i => (
          <div key={i} className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-black ${i < pin.length ? 'bg-lime-400' : 'bg-white'}`} />
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 md:gap-6 w-full shrink-0">
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <button key={num} onClick={() => handlePress(num.toString())} className="h-16 md:h-20 bg-white border-4 border-black hover:bg-lime-400 rounded-xl md:rounded-2xl text-3xl md:text-4xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">
            {num}
          </button>
        ))}
        <div />
        <button onClick={() => handlePress('0')} className="h-16 md:h-20 bg-white border-4 border-black hover:bg-lime-400 rounded-xl md:rounded-2xl text-3xl md:text-4xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">0</button>
        <button onClick={() => setPin(pin.slice(0, -1))} className="h-16 md:h-20 bg-orange-400 border-4 border-black hover:bg-orange-500 rounded-xl md:rounded-2xl text-xl md:text-2xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">DEL</button>
      </div>
    </div>
  );
}

function SettingsPanel({ avatarSeed, setAvatarSeed, onClose }: any) {
  const seeds = ['Felix', 'Aneka', 'Jasper', 'Oliver', 'Mia', 'Leo', 'Zoe', 'Sam'];
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 shrink-0" style={{ textShadow: '2px 2px 0px black' }}>Customize Hero</h2>
      
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full">
        <div className="w-40 h-40 md:w-56 md:h-56 bg-purple-300 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8 md:mb-10 flex items-center justify-center shrink-0">
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=transparent`} alt="Avatar" className="w-32 h-32 md:w-48 md:h-48" />
        </div>
        
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12 w-full shrink-0">
          <button onClick={() => { playSound('pop'); setAvatarSeed(seeds[(seeds.indexOf(avatarSeed) - 1 + seeds.length) % seeds.length]); }} className="p-4 md:p-5 bg-white border-4 border-black hover:bg-lime-400 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"><ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-black" /></button>
          <span className="text-2xl md:text-4xl font-black text-white uppercase w-28 md:w-40 text-center" style={{ textShadow: '2px 2px 0px black' }}>{avatarSeed}</span>
          <button onClick={() => { playSound('pop'); setAvatarSeed(seeds[(seeds.indexOf(avatarSeed) + 1) % seeds.length]); }} className="p-4 md:p-5 bg-white border-4 border-black hover:bg-lime-400 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"><ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-black" /></button>
        </div>
      </div>

      <button onClick={onClose} className="shrink-0 w-full bg-lime-400 border-4 border-black text-black py-4 md:py-6 rounded-2xl font-black text-2xl md:text-3xl uppercase hover:bg-lime-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">Save Changes</button>
    </div>
  );
}

function VoiceAssistant({ onClose }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12">
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-32 h-32 md:w-48 md:h-48 bg-lime-400 border-4 border-black rounded-full flex items-center justify-center text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] shrink-0"
      >
        <Mic className="w-16 h-16 md:w-24 md:h-24" />
      </motion.div>
      <div className="shrink-0">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-4 md:mb-6" style={{ textShadow: '2px 2px 0px black' }}>Listening...</h2>
        <p className="text-lime-400 font-bold text-xl md:text-3xl uppercase tracking-widest">Try saying "Play Pirate Math"</p>
      </div>
    </div>
  );
}

// --- Interactive Game Engine ---
function InteractiveGame({ gameType, onClose, addStars, showToast, advanceQuest }: any) {
  const [step, setStep] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shake, setShake] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOpt, setSelectedOpt] = useState<any>(null);

  const currentData = gameData[gameType] || gameData['Math'];
  const questions = currentData.questions;

  const handleAnswer = (opt: any) => {
    if (answerState !== 'idle') return;
    setSelectedOpt(opt);

    if (opt === questions[step].a) {
      setAnswerState('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#A3E635', '#FFFFFF'] });
      const points = 10 * (streak + 1);
      addStars(points);
      setStreak(s => s + 1);
      showToast(`+${points} Stars!`);
      
      setTimeout(() => {
        setAnswerState('idle');
        setSelectedOpt(null);
        if (step < questions.length - 1) {
          setStep(s => s + 1);
        } else {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setStep(s => s + 1);
        }
      }, 1500);
    } else {
      setAnswerState('wrong');
      setStreak(0);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setAnswerState('idle');
        setSelectedOpt(null);
      }, 800);
    }
  };

  if (showTutorial) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center gap-6 md:gap-8 bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-32 h-32 md:w-48 md:h-48"
        >
          {currentData.mascot}
        </motion.div>
        <div>
          <h3 className="text-4xl md:text-6xl font-black text-black uppercase mb-4 tracking-tighter">{currentData.title}</h3>
          <p className="text-black/80 font-bold text-xl md:text-3xl uppercase tracking-widest leading-relaxed">{currentData.tutorial}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowTutorial(false)}
          className="bg-lime-400 border-4 border-black text-black px-12 py-6 rounded-3xl font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mt-4 hover:bg-lime-300 transition-colors"
        >
          Let's Play!
        </motion.button>
      </motion.div>
    );
  }

  if (step >= questions.length) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center gap-6 md:gap-8">
        <Trophy className="w-24 h-24 md:w-40 md:h-40 text-lime-400 mx-auto animate-bounce shrink-0" />
        <div className="shrink-0">
          <h3 className="text-4xl md:text-6xl font-black text-white uppercase mb-2 md:mb-4" style={{ textShadow: '2px 2px 0px black' }}>You Win!</h3>
          <p className="text-lime-400 font-bold text-xl md:text-2xl uppercase tracking-widest">Completed {currentData.title}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => {
            advanceQuest();
            onClose();
          }}
          className="shrink-0 bg-lime-400 border-4 border-black text-black px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-3xl font-black text-2xl md:text-3xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mt-4 md:mt-8"
        >
          Claim Reward
        </motion.button>
      </motion.div>
    );
  }

  const q = questions[step];

  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-8 min-h-0">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-2xl md:text-4xl font-black text-white uppercase" style={{ textShadow: '2px 2px 0px black' }}>{currentData.title}</h3>
        {streak > 1 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 md:gap-2 bg-black border-4 border-lime-400 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-[2px_2px_0px_0px_rgba(163,230,53,1)]">
            <Flame className="w-5 h-5 md:w-6 md:h-6 text-lime-400" />
            <span className="text-lime-400 font-black text-lg md:text-xl">{streak}x</span>
          </motion.div>
        )}
      </div>

      <div className="w-full h-4 md:h-6 bg-purple-800 border-4 border-black rounded-full overflow-hidden shrink-0">
        <motion.div 
          className="h-full bg-lime-400 border-r-4 border-black" 
          initial={{ width: `${(step / questions.length) * 100}%` }}
          animate={{ width: `${((step) / questions.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </div>

      <motion.div 
        key={step}
        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="flex-1 bg-white border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-4 md:gap-8 min-h-0 relative"
      >
        <motion.div 
          animate={answerState === 'correct' ? { y: [0, -20, 0], scale: [1, 1.2, 1] } : answerState === 'wrong' ? { rotate: [-10, 10, -10, 10, 0] } : { y: [0, -5, 0] }}
          transition={{ duration: answerState === 'idle' ? 2 : 0.5, repeat: answerState === 'idle' ? Infinity : 0 }}
          className="absolute -top-10 -right-4 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-black p-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center"
        >
          {answerState === 'correct' ? <PartyPopper className="w-full h-full text-green-500" /> : answerState === 'wrong' ? <Frown className="w-full h-full text-red-500" /> : currentData.mascot}
        </motion.div>
        <div className="text-5xl md:text-7xl tracking-widest text-center">{q.visual}</div>
        <p className="font-black text-2xl md:text-4xl text-center leading-tight text-black uppercase">{q.q}</p>
      </motion.div>

      <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 shrink-0">
        {q.options.map((opt: any) => {
          let btnClass = "bg-lime-400 border-4 border-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black transition-colors";
          if (answerState !== 'idle') {
            if (opt === q.a) {
              btnClass = "bg-green-500 border-4 border-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white";
            } else if (opt === selectedOpt) {
              btnClass = "bg-red-500 border-4 border-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white";
            } else {
              btnClass = "bg-gray-300 border-4 border-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-gray-500 opacity-50";
            }
          }

          return (
            <motion.button 
              key={opt}
              whileHover={answerState === 'idle' ? { scale: 1.02 } : {}} 
              whileTap={answerState === 'idle' ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)}
              className={btnClass}
              disabled={answerState !== 'idle'}
            >
              {opt}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

// --- Story Engine ---
function StoryEngine({ topic, onClose }: any) {
  const [prompt, setPrompt] = useState(topic === 'Magic' ? '' : topic);
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingState, setLoadingState] = useState('');
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (topic !== 'Magic' && !hasGenerated.current) {
      hasGenerated.current = true;
      generateStory();
    }
  }, [topic]);

  useEffect(() => {
    const playPageAudio = async () => {
      if (pages.length > 0 && pages[currentPage] && !pages[currentPage].loading) {
        // Stop previous audio
        if (audioSourceRef.current) {
          try { audioSourceRef.current.stop(); } catch (e) {}
          audioSourceRef.current = null;
        }
        window.speechSynthesis.cancel();

        const page = pages[currentPage];

        if (!page.audioData) {
          // Fallback to browser TTS
          const utterance = new SpeechSynthesisUtterance(page.text);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
          return;
        }

        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const audioCtx = audioCtxRef.current;
          
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }

          const binaryString = window.atob(page.audioData);
          const len = binaryString.length;
          // Ensure even length for Int16Array
          const validLen = len % 2 === 0 ? len : len - 1;
          const bytes = new Uint8Array(validLen);
          for (let i = 0; i < validLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Gemini TTS returns raw 16-bit PCM at 24000Hz
          const int16Array = new Int16Array(bytes.buffer);
          const audioBuffer = audioCtx.createBuffer(1, int16Array.length, 24000);
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < int16Array.length; i++) {
            channelData[i] = int16Array[i] / 32768.0;
          }

          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);
          source.start();
          audioSourceRef.current = source;
        } catch (err) {
          console.error("Audio play error:", err);
          // Fallback to browser TTS
          const utterance = new SpeechSynthesisUtterance(page.text);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    playPageAudio();

    return () => {
      if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch (e) {}
      }
      window.speechSynthesis.cancel();
    };
  }, [currentPage, pages]);

  const generateStory = async () => {
    const promptTopic = prompt;
    if (!promptTopic) return;
    
    setLoadingState('Writing the story...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const textRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a cohesive 10-page children's story about: ${promptTopic}. For a 7-year-old named ${KID_NAME}. 
        CRITICAL SAFETY RULE: If the topic is inappropriate for a 7-year-old child (e.g., violence, sexual content, profanity, adult themes, or anything unsafe), set 'isAppropriate' to false, provide a polite refusal message in 'refusalReason', and leave the other fields empty. 
        If the topic is safe, set 'isAppropriate' to true and write the story.
        The story MUST have a clear beginning, middle, climax, and a meaningful moral/message at the end. 
        Each page's text must be exactly 1 short sentence (max 15 words). 
        To ensure visual consistency, provide a 'visualStyle' (e.g., '3D Pixar style, vibrant colors, soft lighting') and a 'mainCharacterDesign' (e.g., 'A 7-year-old boy with curly brown hair wearing a red hoodie'). 
        The 'imagePrompt' for each page should describe the specific action and background for that page.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isAppropriate: { type: Type.BOOLEAN },
              refusalReason: { type: Type.STRING },
              title: { type: Type.STRING },
              moral: { type: Type.STRING },
              visualStyle: { type: Type.STRING },
              mainCharacterDesign: { type: Type.STRING },
              pages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                  },
                  required: ["text", "imagePrompt"]
                }
              }
            },
            required: ["isAppropriate"]
          }
        }
      });
      
      const storyData = JSON.parse(textRes.text || '{}');
      
      if (storyData.isAppropriate === false) {
        setLoadingState(storyData.refusalReason || "I can't write a story about that. Let's pick a fun, kid-friendly topic!");
        setTimeout(() => {
          setLoadingState('');
          onClose();
        }, 4000);
        return;
      }

      const generatedPages = storyData.pages || [];
      const visualStyle = storyData.visualStyle || '3D Pixar style, vibrant colors';
      const characterDesign = storyData.mainCharacterDesign || 'A cute 7-year-old kid';
      
      const initialPages = generatedPages.slice(0, 10).map((p: any) => ({
        text: p.text,
        imagePrompt: p.imagePrompt,
        imageUrl: '',
        audioData: '',
        loading: true
      }));
      
      setPages(initialPages);
      setCurrentPage(0);
      setLoadingState('');

      // Generate media for each page sequentially to avoid rate limits
      for (let index = 0; index < initialPages.length; index++) {
        const page = initialPages[index];
        const fullImagePrompt = `Children's book illustration. Style: ${visualStyle}. Main Character: ${characterDesign}. Scene: ${page.imagePrompt}`;
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullImagePrompt)}?width=800&height=600&nologo=true`;
        
        let audioBase64 = '';
        try {
          const audioRes = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say cheerfully: ${page.text}` }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is a friendly, less robotic voice
                },
              },
            },
          });
          audioBase64 = audioRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
        } catch (audioErr) {
          console.error("TTS Error:", audioErr);
          // Audio generation failed (e.g., quota exceeded). 
          // We leave audioBase64 empty, and the player will fallback to browser TTS.
        }

        setPages(prev => {
          const newPages = [...prev];
          newPages[index] = {
            ...newPages[index],
            imageUrl: imgUrl,
            audioData: audioBase64,
            loading: false
          };
          return newPages;
        });
      }

    } catch (e) {
      console.error(e);
      setLoadingState('Oops! The magic machine had a hiccup. Try again!');
      setTimeout(() => setLoadingState(''), 3000);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      playSound('pop');
      setCurrentPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      playSound('pop');
      setCurrentPage(p => p - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
      {pages.length === 0 && !loadingState && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 md:gap-8 max-w-xl mx-auto w-full">
          <Wand2 className="w-20 h-20 md:w-28 md:h-28 text-lime-400 mx-auto shrink-0" />
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase shrink-0" style={{ textShadow: '2px 2px 0px black' }}>Magic Story</h2>
          <input 
            type="text" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What is it about?" 
            className="w-full bg-white border-4 border-black p-4 md:p-6 rounded-2xl md:rounded-3xl text-xl md:text-3xl font-black text-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-lime-400 shrink-0"
          />
          <button 
            onClick={() => { playSound('pop'); generateStory(); }}
            disabled={!prompt}
            className="w-full bg-lime-400 border-4 border-black text-black py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-2xl md:text-3xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 shrink-0"
          >
            Generate
          </button>
        </div>
      )}

      {loadingState && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8">
          <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-lime-400 animate-spin shrink-0" />
          <p className="font-black text-white text-2xl md:text-4xl uppercase tracking-widest shrink-0 text-center" style={{ textShadow: '2px 2px 0px black' }}>{loadingState}</p>
        </div>
      )}

      {pages.length > 0 && !loadingState && (
        <motion.div key={currentPage} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
          
          <div className="flex justify-between items-center shrink-0">
            <span className="bg-white text-black font-black px-4 py-2 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest">
              Page {currentPage + 1} of {pages.length}
            </span>
            <button onClick={() => { playSound('pop'); setPages([]); setPrompt(''); }} className="bg-white text-black font-black px-4 py-2 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase hover:bg-red-400 transition-colors">
              Close Book
            </button>
          </div>

          <div className="w-full flex-1 bg-black border-4 border-black rounded-2xl md:rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex items-center justify-center min-h-0">
            {pages[currentPage].imageUrl ? (
              <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={pages[currentPage].imageUrl} alt="Story Illustration" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-lime-400 animate-spin" />
                <span className="font-black uppercase text-lime-400 text-sm md:text-base tracking-widest">Drawing Page...</span>
              </div>
            )}
          </div>
          
          <div className="shrink-0 bg-white border-4 border-black p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[30vh] overflow-y-auto">
            <p className="font-black text-black whitespace-pre-wrap text-xl md:text-3xl leading-relaxed uppercase">
              {pages[currentPage].text}
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0">
            <button 
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex-1 bg-white border-4 border-black text-black py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" /> Prev
            </button>
            
            {currentPage < pages.length - 1 ? (
              <button 
                onClick={nextPage}
                className="flex-1 bg-lime-400 border-4 border-black text-black py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-500 transition-colors flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            ) : (
              <button 
                onClick={() => { playSound('win'); setPages([]); setPrompt(''); }}
                className="flex-1 bg-purple-500 border-4 border-black text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                Finish <Star className="w-6 h-6 md:w-8 md:h-8 fill-white" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
