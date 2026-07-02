import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import type { KidProfile } from '../types';

interface KidLinkEntryProps {
  onLink: (kid: KidProfile) => void;
  onBack: () => void;
  getKidByLinkCode: (code: string) => KidProfile | undefined;
}

export function KidLinkEntry({ onLink, onBack, getKidByLinkCode }: KidLinkEntryProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [linkedKid, setLinkedKid] = useState<KidProfile | null>(null);

  const handleSubmit = () => {
    if (code.length !== 5) { setError('Code must be 5 digits'); return; }
    const kid = getKidByLinkCode(code);
    if (!kid) { setError('Invalid code. Ask your parent for the right one!'); return; }
    setLinkedKid(kid);
    // Short delay for the welcome animation, then link
    setTimeout(() => onLink(kid), 2500);
  };

  if (linkedKid) {
    return (
      <div className="h-[100dvh] w-full bg-purple-600 font-sans flex flex-col items-center justify-center p-6 overflow-hidden relative">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center gap-6 z-10">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="w-36 h-36 md:w-48 md:h-48 bg-purple-300 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
            <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${linkedKid.avatarSeed}&backgroundColor=transparent`}
              alt="Avatar" className="w-28 h-28 md:w-40 md:h-40" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-black text-white uppercase text-center" style={{ textShadow: '3px 3px 0px black' }}>
            Hi, {linkedKid.name}!
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-lime-400 font-bold text-lg md:text-xl uppercase tracking-widest text-center">
            Your parent set everything up for you ✨
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                className="w-4 h-4 bg-lime-400 rounded-full border-2 border-black" />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-lime-400 font-sans flex flex-col items-center justify-center p-6 overflow-hidden relative"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-lime-300 rounded-full opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-lime-500 rounded-full opacity-30"></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md gap-8">
        {/* Icon */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <KeyRound className="w-16 h-16 text-purple-600" />
        </motion.div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
            Enter Your Code
          </h1>
          <p className="font-bold text-black/60 text-base md:text-lg mt-2">
            Ask your parent for the 5-digit code
          </p>
        </div>

        {/* Code Input */}
        <div className="w-full">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && code.length === 5 && handleSubmit()}
            placeholder="• • • • •"
            autoFocus
            className="w-full bg-white border-4 border-black p-5 md:p-6 rounded-2xl text-4xl md:text-5xl font-black text-center text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-purple-500 tracking-[0.7em] placeholder:tracking-[0.5em] placeholder:text-gray-300"
            aria-label="Enter 5-digit link code"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500 text-white border-4 border-black px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
            className="bg-white/50 border-4 border-black/30 text-black px-5 py-4 rounded-2xl font-black text-lg uppercase flex items-center gap-2 hover:bg-white/70 transition-colors"
            aria-label="Go back">
            <ArrowLeft className="w-5 h-5" /> Back
          </motion.button>

          <motion.button
            whileHover={code.length === 5 ? { scale: 1.05 } : {}}
            whileTap={code.length === 5 ? { scale: 0.95 } : {}}
            onClick={handleSubmit}
            disabled={code.length !== 5}
            className={`flex-1 border-4 border-black px-6 py-4 rounded-2xl font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all
              ${code.length === 5 ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 shadow-none'}`}
            aria-label="Connect">
            Let's Go! <Sparkles className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
