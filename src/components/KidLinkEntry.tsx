import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import type { KidProfile } from '../types';

interface KidLinkEntryProps {
  onLink: (kid: KidProfile) => void;
  onBack: () => void;
  getKidByLinkCode: (code: string) => KidProfile | undefined;
  validatePairingCode?: (code: string) => Promise<{ familyId: string; kids: KidProfile[] } | null>;
}

export function KidLinkEntry({ onLink, onBack, getKidByLinkCode, validatePairingCode }: KidLinkEntryProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [linkedKid, setLinkedKid] = useState<KidProfile | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [availableKids, setAvailableKids] = useState<KidProfile[]>([]);
  const [showKidPicker, setShowKidPicker] = useState(false);

  const handleSubmit = async () => {
    if (code.length !== 5) { setError('Code must be 5 digits'); return; }

    // Try Supabase validation first
    if (validatePairingCode) {
      setIsValidating(true);
      setError('');
      try {
        const result = await validatePairingCode(code);
        if (result && result.kids.length > 0) {
          if (result.kids.length === 1) {
            // Only one kid — auto-select
            setLinkedKid(result.kids[0]);
            setTimeout(() => onLink(result.kids[0]), 2500);
          } else {
            // Multiple kids — show picker
            setAvailableKids(result.kids);
            setShowKidPicker(true);
          }
          return;
        } else {
          setError('Invalid code. Ask your parent for the right one!');
          return;
        }
      } catch {
        setError('Something went wrong. Try again!');
        return;
      } finally {
        setIsValidating(false);
      }
    }

    // Fallback to local lookup
    const kid = getKidByLinkCode(code);
    if (!kid) { setError('Invalid code. Ask your parent for the right one!'); return; }
    setLinkedKid(kid);
    setTimeout(() => onLink(kid), 2500);
  };

  const selectKid = (kid: KidProfile) => {
    setLinkedKid(kid);
    setShowKidPicker(false);
    setTimeout(() => onLink(kid), 2500);
  };

  // Kid picker screen (when multiple kids in family)
  if (showKidPicker) {
    return (
      <div className="h-[100dvh] w-full bg-purple-600 font-sans overflow-y-auto custom-scrollbar relative">
        <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-6"
          style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md flex flex-col items-center gap-6 z-10 py-4">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase text-center shrink-0" style={{ textShadow: '3px 3px 0px black' }}>
              Who's Playing?
            </h1>
            <p className="text-lime-400 font-bold text-sm md:text-base uppercase tracking-widest text-center shrink-0">
              Tap your name to start!
            </p>
            <div className="flex flex-col gap-4 w-full">
              {availableKids.map(kid => (
                <motion.button key={kid.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => selectKid(kid)}
                  className="bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 cursor-pointer hover:bg-lime-100 transition-colors shrink-0">
                  <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${kid.avatarSeed}&backgroundColor=transparent`}
                    alt={kid.name} className="w-16 h-16 rounded-2xl border-3 border-black bg-purple-200" />
                  <div className="text-left">
                    <h3 className="font-black text-2xl uppercase">{kid.name}</h3>
                    <p className="font-bold text-gray-500 text-sm">Age {kid.age} · {kid.stars} ⭐</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowKidPicker(false); setAvailableKids([]); }}
              className="bg-white/20 border-4 border-white/40 text-white px-6 py-3 rounded-2xl font-black text-lg uppercase flex items-center gap-2 hover:bg-white/30 transition-colors mt-4 shrink-0">
              <ArrowLeft className="w-5 h-5" /> Back
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (linkedKid) {
    return (
      <div className="h-[100dvh] w-full bg-purple-600 font-sans overflow-y-auto custom-scrollbar relative">
        <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-6"
          style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-6 z-10 py-4">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-36 h-36 md:w-48 md:h-48 bg-purple-300 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center shrink-0">
              <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${linkedKid.avatarSeed}&backgroundColor=transparent`}
                alt="Avatar" className="w-28 h-28 md:w-40 md:h-40" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white uppercase text-center shrink-0" style={{ textShadow: '3px 3px 0px black' }}>
              Hi, {linkedKid.name}!
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-lime-400 font-bold text-lg md:text-xl uppercase tracking-widest text-center shrink-0">
              Your parent set everything up for you ✨
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex gap-2 shrink-0">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  className="w-4 h-4 bg-lime-400 rounded-full border-2 border-black" />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-lime-400 font-sans overflow-y-auto custom-scrollbar relative">
      <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-6"
        style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-lime-300 rounded-full opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-lime-500 rounded-full opacity-30"></div>
        </div>

        <div className="z-10 flex flex-col items-center w-full max-w-md gap-6 md:gap-8 py-4">
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
            disabled={isValidating}
            className="w-full bg-white border-4 border-black p-5 md:p-6 rounded-2xl text-4xl md:text-5xl font-black text-center text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-purple-500 tracking-[0.7em] placeholder:tracking-[0.5em] placeholder:text-gray-300 disabled:opacity-60"
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
            whileHover={code.length === 5 && !isValidating ? { scale: 1.05 } : {}}
            whileTap={code.length === 5 && !isValidating ? { scale: 0.95 } : {}}
            onClick={handleSubmit}
            disabled={code.length !== 5 || isValidating}
            className={`flex-1 border-4 border-black px-6 py-4 rounded-2xl font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all
              ${code.length === 5 && !isValidating ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 shadow-none'}`}
            aria-label="Connect">
            {isValidating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Checking...</>
            ) : (
              <>Let's Go! <Sparkles className="w-5 h-5" /></>
            )}
          </motion.button>
        </div>
      </div>
      <p className="mt-6 text-black/40 font-bold text-xs max-w-[250px] text-center shrink-0">
        Your code connects you to your parent's account from any device.
      </p>
      </div>
    </div>
  );
}
