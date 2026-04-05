import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, PartyPopper, Frown, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Question } from '../types';
import { getQuestionsByDifficulty } from '../data/questions';

interface QuizGameProps {
  title: string;
  icon: React.ReactNode;
  questions: Question[];
  difficulty: string;
  onClose: () => void;
  addStars: (n: number) => void;
  showToast: (msg: string) => void;
  playSound: (type: 'pop' | 'win' | 'lose') => void;
  advanceQuest: () => void;
}

export function QuizGame({ title, icon, questions: allQuestions, difficulty, onClose, addStars, showToast, playSound, advanceQuest }: QuizGameProps) {
  const [questions] = useState(() => getQuestionsByDifficulty(allQuestions, difficulty).slice(0, 8));
  const [step, setStep] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shake, setShake] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOpt, setSelectedOpt] = useState<any>(null);

  const handleAnswer = (opt: any) => {
    if (answerState !== 'idle') return;
    setSelectedOpt(opt);
    if (String(opt) === String(questions[step].a)) {
      setAnswerState('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#A3E635', '#FFFFFF'] });
      const points = 10 * (streak + 1);
      addStars(points);
      setStreak(s => s + 1);
      showToast(`+${points} Stars!`);
      setTimeout(() => {
        setAnswerState('idle'); setSelectedOpt(null);
        if (step < questions.length - 1) setStep(s => s + 1);
        else { confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); setStep(s => s + 1); }
      }, 1500);
    } else {
      setAnswerState('wrong'); setStreak(0); setShake(true);
      setTimeout(() => { setShake(false); setAnswerState('idle'); setSelectedOpt(null); }, 800);
    }
  };

  if (showTutorial) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center gap-6 md:gap-8 bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 md:w-36 md:h-36">{icon}</motion.div>
        <h3 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter">{title}</h3>
        <p className="text-black/80 font-bold text-lg md:text-2xl uppercase tracking-widest">Answer questions to earn stars!</p>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Difficulty: {difficulty.toUpperCase()}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowTutorial(false)}
          className="bg-lime-400 border-4 border-black text-black px-12 py-6 rounded-3xl font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mt-4">
          Let's Play!
        </motion.button>
      </motion.div>
    );
  }

  if (step >= questions.length) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center gap-6 md:gap-8">
        <Trophy className="w-24 h-24 md:w-40 md:h-40 text-lime-400 mx-auto animate-bounce shrink-0" />
        <h3 className="text-4xl md:text-6xl font-black text-white uppercase mb-2 md:mb-4" style={{ textShadow: '2px 2px 0px black' }}>You Win!</h3>
        <p className="text-lime-400 font-bold text-xl md:text-2xl uppercase tracking-widest">Completed {title}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { advanceQuest(); onClose(); }}
          className="shrink-0 bg-lime-400 border-4 border-black text-black px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-3xl font-black text-2xl md:text-3xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mt-4 md:mt-8">
          Claim Reward
        </motion.button>
      </motion.div>
    );
  }

  const q = questions[step];
  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-8 min-h-0">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-2xl md:text-4xl font-black text-white uppercase" style={{ textShadow: '2px 2px 0px black' }}>{title}</h3>
        {streak > 1 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 md:gap-2 bg-black border-4 border-lime-400 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-[2px_2px_0px_0px_rgba(163,230,53,1)]">
            <Flame className="w-5 h-5 md:w-6 md:h-6 text-lime-400" /><span className="text-lime-400 font-black text-lg md:text-xl">{streak}x</span>
          </motion.div>
        )}
      </div>
      <div className="w-full h-4 md:h-6 bg-purple-800 border-4 border-black rounded-full overflow-hidden shrink-0">
        <motion.div className="h-full bg-lime-400 border-r-4 border-black" animate={{ width: `${(step / questions.length) * 100}%` }} transition={{ type: "spring", stiffness: 100 }} />
      </div>
      <motion.div key={step} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="flex-1 bg-white border-4 border-black p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-4 md:gap-8 min-h-0 relative">
        <motion.div animate={answerState === 'correct' ? { y: [0, -20, 0], scale: [1, 1.2, 1] } : answerState === 'wrong' ? { rotate: [-10, 10, -10, 10, 0] } : { y: [0, -5, 0] }}
          transition={{ duration: answerState === 'idle' ? 2 : 0.5, repeat: answerState === 'idle' ? Infinity : 0 }}
          className="absolute -top-10 -right-4 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-black p-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          {answerState === 'correct' ? <PartyPopper className="w-full h-full text-green-500" /> : answerState === 'wrong' ? <Frown className="w-full h-full text-red-500" /> : icon}
        </motion.div>
        <p className="font-black text-2xl md:text-4xl text-center leading-tight text-black uppercase">{q.q}</p>
      </motion.div>
      <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 shrink-0">
        {q.options.map((opt: any) => {
          let btnClass = "bg-lime-400 border-4 border-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black transition-colors";
          if (answerState !== 'idle') {
            if (String(opt) === String(q.a)) btnClass = btnClass.replace('bg-lime-400', 'bg-green-500').replace('text-black', 'text-white');
            else if (opt === selectedOpt) btnClass = btnClass.replace('bg-lime-400', 'bg-red-500').replace('text-black', 'text-white');
            else btnClass = btnClass.replace('bg-lime-400', 'bg-gray-300') + ' opacity-50 text-gray-500';
          }
          return (
            <motion.button key={String(opt)} whileHover={answerState === 'idle' ? { scale: 1.02 } : {}} whileTap={answerState === 'idle' ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)} className={btnClass} disabled={answerState !== 'idle'}>
              {opt}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
