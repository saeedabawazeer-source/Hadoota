import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Lock, Check, User } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: { name: string; age: number; avatarSeed: string; pin: string }) => void;
  onBack: () => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Jasper', 'Oliver', 'Mia', 'Leo', 'Zoe', 'Sam', 'Luna', 'Max', 'Nala', 'Koda'];
const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function Onboarding({ onComplete, onBack }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [avatarSeed, setAvatarSeed] = useState('Felix');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');

  const steps = [
    { title: "What's your name?", subtitle: "We'll use this to personalize everything" },
    { title: "How old are you?", subtitle: "This helps us pick the right difficulty" },
    { title: "Choose your hero!", subtitle: "Pick an avatar that looks like you" },
    { title: "Parent PIN", subtitle: "Set a 4-digit PIN for parent controls" },
  ];

  const canAdvance = () => {
    if (step === 0) return name.trim().length >= 1;
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return pin.length === 4 && pin === pinConfirm;
    return false;
  };

  const handleNext = () => {
    if (step === 3) {
      if (pin.length !== 4) { setPinError('PIN must be 4 digits'); return; }
      if (pin !== pinConfirm) { setPinError('PINs do not match'); return; }
      onComplete({ name: name.trim(), age, avatarSeed, pin });
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) { onBack(); return; }
    setStep(s => s - 1);
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
      <div className="flex gap-3 mb-8 md:mb-12 z-10 shrink-0">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === step ? 1.3 : 1 }}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full border border-slate-200 transition-colors ${i <= step ? 'bg-lime-400' : 'bg-white/30'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-lg min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white uppercase mb-2 md:mb-3" >
              {steps[step].title}
            </h2>
            <p className="text-lime-400 font-bold text-sm md:text-lg uppercase tracking-widest mb-8 md:mb-10">
              {steps[step].subtitle}
            </p>

            {/* Step 0: Name */}
            {step === 0 && (
              <div className="w-full">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && canAdvance() && handleNext()}
                  placeholder="Type your name..."
                  maxLength={20}
                  autoFocus
                  className="w-full bg-white border border-slate-200 p-5 md:p-6 rounded-2xl text-2xl md:text-3xl font-bold text-center text-slate-800 shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-lime-400 placeholder:text-gray-300"
                  aria-label="Child's name"
                />
              </div>
            )}

            {/* Step 1: Age */}
            {step === 1 && (
              <div className="w-full grid grid-cols-5 gap-3 md:gap-4">
                {AGE_OPTIONS.map(a => (
                  <motion.button
                    key={a}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAge(a)}
                    className={`aspect-square rounded-2xl border border-slate-200 font-bold text-2xl md:text-3xl shadow-xl shadow-slate-200/50 transition-colors
                      ${age === a ? 'bg-lime-400 text-slate-800 ring-4 ring-white' : 'bg-white text-slate-800 hover:bg-lime-100'}`}
                    aria-label={`Age ${a}`}
                  >
                    {a}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 2: Avatar */}
            {step === 2 && (
              <div className="w-full flex flex-col items-center gap-6">
                <motion.div
                  key={avatarSeed}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-36 h-36 md:w-48 md:h-48 bg-purple-300 border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/micah/svg?seed=${avatarSeed}&backgroundColor=transparent`}
                    alt="Avatar"
                    className="w-28 h-28 md:w-40 md:h-40"
                  />
                </motion.div>

                <div className="grid grid-cols-6 gap-2 md:gap-3 w-full max-w-sm">
                  {AVATAR_SEEDS.map(seed => (
                    <motion.button
                      key={seed}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAvatarSeed(seed)}
                      className={`aspect-square rounded-xl border-3 md:border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 transition-all
                        ${avatarSeed === seed ? 'ring-4 ring-lime-400 ring-offset-2 ring-offset-purple-600 bg-lime-100' : 'bg-purple-200 hover:bg-purple-100'}`}
                      aria-label={`Avatar ${seed}`}
                    >
                      <img
                        src={`https://api.dicebear.com/9.x/micah/svg?seed=${seed}&backgroundColor=transparent`}
                        alt={seed}
                        className="w-full h-full"
                      />
                    </motion.button>
                  ))}
                </div>

                <p className="text-white/60 font-bold text-sm uppercase tracking-widest">{avatarSeed}</p>
              </div>
            )}

            {/* Step 3: PIN */}
            {step === 3 && (
              <div className="w-full flex flex-col gap-4 max-w-xs mx-auto">
                <div className="bg-slate-800/20 rounded-2xl p-4 mb-2">
                  <div className="flex items-center gap-2 text-lime-400 mb-2">
                    <Lock className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">For parents only</span>
                  </div>
                  <p className="text-white/70 font-bold text-xs">This PIN protects the parent dashboard. Don't share it with your child.</p>
                </div>

                <div>
                  <label className="text-white/80 font-bold text-sm uppercase tracking-widest mb-2 block text-left">Enter PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                    placeholder="• • • •"
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-3xl font-bold text-center text-slate-800 shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-lime-400 tracking-[1em] placeholder:tracking-[0.5em]"
                    aria-label="Enter parent PIN"
                  />
                </div>

                <div>
                  <label className="text-white/80 font-bold text-sm uppercase tracking-widest mb-2 block text-left">Confirm PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinConfirm}
                    onChange={e => { setPinConfirm(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                    placeholder="• • • •"
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-3xl font-bold text-center text-slate-800 shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-lime-400 tracking-[1em] placeholder:tracking-[0.5em]"
                    aria-label="Confirm parent PIN"
                  />
                </div>

                {pinError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-300 font-bold text-sm uppercase text-center">
                    {pinError}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 w-full max-w-lg z-10 shrink-0 mt-6 md:mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="bg-white/20 border-4 border-white/40 text-white px-6 py-4 rounded-2xl font-bold text-lg uppercase flex items-center gap-2 hover:bg-white/30 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </motion.button>

        <motion.button
          whileHover={canAdvance() ? { scale: 1.05 } : {}}
          whileTap={canAdvance() ? { scale: 0.95 } : {}}
          onClick={handleNext}
          disabled={!canAdvance()}
          className={`flex-1 border border-slate-200 px-6 py-4 rounded-2xl font-bold text-xl uppercase shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2 transition-all
            ${canAdvance() ? 'bg-lime-400 text-slate-800 hover:bg-lime-300' : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 shadow-none'}`}
          aria-label={step === 3 ? 'Finish setup' : 'Next step'}
        >
          {step === 3 ? (
            <>Let's Go! <Sparkles className="w-5 h-5" /></>
          ) : (
            <>Next <ArrowRight className="w-5 h-5" /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
