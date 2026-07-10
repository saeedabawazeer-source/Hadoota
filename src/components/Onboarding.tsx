import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Lock, Check, User, Heart, Gift, Copy, CheckCircle } from 'lucide-react';
import type { KidProfile, Difficulty } from '../types';
import { CHARACTERS, characterFor, AVATAR_SEEDS } from '../data/characters';

interface ParentOnboardingProps {
  onComplete: (data: { parentName: string; kid: Omit<KidProfile, 'id' | 'linkCode' | 'stars' | 'streak' | 'questProgress' | 'gameStats'> }) => void;
  onBack: () => void;
}
const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const INTEREST_OPTIONS = ['Math', 'Reading', 'Science', 'Art', 'Music', 'Sports', 'Animals', 'Space'];

export function Onboarding({ onComplete, onBack }: ParentOnboardingProps) {
  const [step, setStep] = useState(0);
  // Parent info
  const [parentName, setParentName] = useState('');
  // Kid info
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState(6);
  const [avatarSeed, setAvatarSeed] = useState(CHARACTERS[0].id);
  const [interests, setInterests] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const steps = [
    { title: "Welcome, Parent!", subtitle: "Let's set up your account first" },
    { title: "Add Your Child", subtitle: "Tell us about your little learner" },
    { title: "Pick Their Avatar", subtitle: "Choose a hero for your child" },
    { title: "What Do They Love?", subtitle: "Select their interests" },
    { title: "Set Difficulty", subtitle: "Choose the right challenge level" },
  ];

  const canAdvance = () => {
    if (step === 0) return parentName.trim().length >= 1;
    if (step === 1) return kidName.trim().length >= 1;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return true;
    return false;
  };

  const handleNext = () => {
    if (step === 4) {
      onComplete({
        parentName: parentName.trim(),
        kid: { name: kidName.trim(), age: kidAge, avatarSeed, interests, difficulty },
      });
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) { onBack(); return; }
    setStep(s => s - 1);
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  return (
    <div className="h-[100dvh] w-full bg-purple-600 font-sans flex flex-col items-center justify-center p-6 overflow-hidden relative"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500 rounded-full opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-700 rounded-full opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-lime-400/10 rounded-3xl rotate-12"></div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-3 mb-6 md:mb-10 z-10 shrink-0">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === step ? 1.3 : 1 }}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black transition-colors ${i <= step ? 'bg-lime-400' : 'bg-white/30'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-lg min-h-0 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-2 md:mb-3" style={{ textShadow: '2px 2px 0px black' }}>
              {steps[step].title}
            </h2>
            <p className="text-lime-400 font-bold text-sm md:text-lg uppercase tracking-widest mb-6 md:mb-8">
              {steps[step].subtitle}
            </p>

            {/* Step 0: Parent Name */}
            {step === 0 && (
              <div className="w-full flex flex-col gap-4">
                <div>
                  <label className="text-white/80 font-bold text-sm uppercase tracking-widest mb-2 block text-left">Your Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="e.g. Sarah, Ahmed..."
                    maxLength={30}
                    autoFocus
                    className="w-full bg-white border-4 border-black p-4 md:p-5 rounded-2xl text-xl md:text-2xl font-black text-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-lime-400 placeholder:text-gray-300"
                    aria-label="Parent name"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Kid Name + Age */}
            {step === 1 && (
              <div className="w-full flex flex-col gap-5">
                <div>
                  <label className="text-white/80 font-bold text-sm uppercase tracking-widest mb-2 block text-left">Child's Name</label>
                  <input
                    type="text"
                    value={kidName}
                    onChange={e => setKidName(e.target.value)}
                    placeholder="Type their name..."
                    maxLength={20}
                    autoFocus
                    className="w-full bg-white border-4 border-black p-4 md:p-5 rounded-2xl text-xl md:text-2xl font-black text-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-lime-400 placeholder:text-gray-300"
                    aria-label="Child's name"
                  />
                </div>
                <div>
                  <label className="text-white/80 font-bold text-sm uppercase tracking-widest mb-3 block text-left">Age</label>
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {AGE_OPTIONS.map(a => (
                      <motion.button key={a} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setKidAge(a)}
                        className={`aspect-square rounded-2xl border-4 border-black font-black text-xl md:text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors
                          ${kidAge === a ? 'bg-lime-400 text-black ring-4 ring-white' : 'bg-white text-black hover:bg-lime-100'}`}
                        aria-label={`Age ${a}`}>
                        {a}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Avatar */}
            {step === 2 && (
              <div className="w-full flex flex-col items-center gap-5">
                <motion.div key={avatarSeed} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 md:w-44 md:h-44 bg-purple-300 border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
                  <img src={characterFor(avatarSeed).poster} alt="Avatar" className="w-24 h-24 md:w-36 md:h-36 object-contain" />
                </motion.div>
                <div className="grid grid-cols-4 gap-2 md:gap-3 w-full max-w-sm">
                  {AVATAR_SEEDS.map(seed => (
                    <motion.button key={seed} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setAvatarSeed(seed)}
                      className={`aspect-square rounded-xl border-3 md:border-4 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center
                        ${avatarSeed === seed ? 'ring-4 ring-lime-400 ring-offset-2 ring-offset-purple-600' : 'hover:brightness-105'}`}
                      style={{ background: characterFor(seed).accent }}
                      aria-label={`Avatar ${characterFor(seed).name}`}>
                      <img src={characterFor(seed).poster} alt={seed} className="w-full h-full object-contain p-1" />
                    </motion.button>
                  ))}
                </div>
                <p className="text-white font-black text-base uppercase tracking-widest">{characterFor(avatarSeed).name} · {characterFor(avatarSeed).role}</p>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div className="w-full">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {INTEREST_OPTIONS.map(interest => (
                    <motion.button key={interest} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => toggleInterest(interest)}
                      className={`p-4 md:p-5 rounded-2xl border-4 border-black font-black text-lg md:text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors flex items-center gap-3
                        ${interests.includes(interest) ? 'bg-lime-400 text-black' : 'bg-white text-black hover:bg-lime-100'}`}>
                      {interests.includes(interest) && <CheckCircle className="w-5 h-5 shrink-0" />}
                      {interest}
                    </motion.button>
                  ))}
                </div>
                <p className="text-white/50 font-bold text-xs uppercase tracking-widest mt-4 text-center">
                  {interests.length === 0 ? 'Select any that apply (optional)' : `${interests.length} selected`}
                </p>
              </div>
            )}

            {/* Step 4: Difficulty */}
            {step === 4 && (
              <div className="w-full flex flex-col gap-4">
                {([
                  { val: 'easy' as const, label: 'Easy', desc: 'Ages 3-5 · Simple counting, shapes, letters', color: 'bg-green-400' },
                  { val: 'medium' as const, label: 'Medium', desc: 'Ages 6-8 · Addition, spelling, basic science', color: 'bg-yellow-400' },
                  { val: 'hard' as const, label: 'Hard', desc: 'Ages 9-12 · Multiplication, geography, logic', color: 'bg-red-400' },
                ]).map(d => (
                  <motion.button key={d.val} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setDifficulty(d.val)}
                    className={`${d.color} border-4 border-black p-5 md:p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left transition-all
                      ${difficulty === d.val ? 'ring-4 ring-white ring-offset-4 ring-offset-purple-600' : ''}`}>
                    <h3 className="font-black text-2xl uppercase">{d.label}</h3>
                    <p className="font-bold text-black/70 text-sm mt-1">{d.desc}</p>
                  </motion.button>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 w-full max-w-lg z-10 shrink-0 mt-4 md:mt-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack}
          className="bg-white/20 border-4 border-white/40 text-white px-6 py-4 rounded-2xl font-black text-lg uppercase flex items-center gap-2 hover:bg-white/30 transition-colors"
          aria-label="Go back">
          <ArrowLeft className="w-5 h-5" /> Back
        </motion.button>

        <motion.button
          whileHover={canAdvance() ? { scale: 1.05 } : {}}
          whileTap={canAdvance() ? { scale: 0.95 } : {}}
          onClick={handleNext}
          disabled={!canAdvance()}
          className={`flex-1 border-4 border-black px-6 py-4 rounded-2xl font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all
            ${canAdvance() ? 'bg-lime-400 text-black hover:bg-lime-300' : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 shadow-none'}`}
          aria-label={step === 4 ? 'Finish setup' : 'Next step'}>
          {step === 4 ? (
            <>All Set! <Sparkles className="w-5 h-5" /></>
          ) : (
            <>Next <ArrowRight className="w-5 h-5" /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
