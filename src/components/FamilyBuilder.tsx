import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';
import { HERO_CHARACTERS, characterFor } from '../data/characters';
import type { FamilyMember } from '../types';
import { FaceIcon } from './FaceIcon';

const ROLES = ['Me', 'Mom', 'Dad', 'Brother', 'Sister', 'Grandma', 'Grandpa', 'Baby'];

export function FamilyBuilder({ members, addMember, updateMember, removeMember, onClose }: {
  members: FamilyMember[];
  addMember: (m: Omit<FamilyMember, 'id'>) => void;
  updateMember: (id: string, u: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;
  onClose: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Mom');
  const [seed, setSeed] = useState(HERO_CHARACTERS[1].id);

  const reset = () => { setEditingId(null); setName(''); setRole('Mom'); setSeed(HERO_CHARACTERS[1].id); };
  const startEdit = (m: FamilyMember) => { setEditingId(m.id); setName(m.name); setRole(m.role); setSeed(m.seed); };
  const save = () => {
    const n = name.trim() || role;
    if (editingId) updateMember(editingId, { name: n, role, seed });
    else addMember({ name: n, role, seed });
    reset();
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto pt-2 pb-6">
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4 text-center" style={{ textShadow: '2px 2px 0 #000' }}>My Family</h2>

      {/* existing members */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-5">
        {members.map((m) => (
          <motion.button key={m.id} whileHover={{ y: -4 }} onClick={() => startEdit(m)}
            className={`relative bg-white border-4 border-black rounded-2xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center ${editingId === m.id ? 'ring-4 ring-lime-400' : ''}`}>
            <span onClick={(e) => { e.stopPropagation(); removeMember(m.id); if (editingId === m.id) reset(); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-black z-10">✕</span>
            <div className="w-14 h-14 rounded-[10px] overflow-hidden" style={{ background: characterFor(m.seed).accent }}>
              <FaceIcon seed={m.seed} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-sm uppercase truncate w-full text-center mt-1">{m.name}</span>
            <span className="font-bold text-[10px] uppercase text-gray-500">{m.role}</span>
          </motion.button>
        ))}
        {members.length === 0 && <p className="col-span-full text-center text-white/80 font-bold py-4">Add your family below 👇</p>}
      </div>

      {/* editor */}
      <div className="bg-white border-4 border-black rounded-3xl p-4 md:p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black uppercase text-lg mb-3">{editingId ? 'Edit member' : 'Add a member'}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. Mom, Ali...)"
          className="w-full bg-gray-100 border-4 border-black rounded-2xl px-4 py-3 font-black text-lg mb-3 focus:outline-none focus:ring-4 focus:ring-purple-400" />
        <div className="flex flex-wrap gap-2 mb-3">
          {ROLES.map((r) => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full border-3 border-black font-black text-xs uppercase ${role === r ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>{r}</button>
          ))}
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
          {HERO_CHARACTERS.map((c) => (
            <button key={c.id} onClick={() => setSeed(c.id)}
              className={`aspect-square rounded-xl border-4 border-black flex items-center justify-center ${seed === c.id ? 'ring-4 ring-lime-400' : ''}`}
              style={{ background: c.accent }}>
              <FaceIcon seed={c.id} alt={c.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="flex-1 bg-lime-400 border-4 border-black rounded-2xl py-3 font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none">
            {editingId ? <><Check className="w-5 h-5" /> Save</> : <><Plus className="w-5 h-5" /> Add to Family</>}
          </button>
          {editingId && <button onClick={reset} className="bg-gray-200 border-4 border-black rounded-2xl px-5 font-black uppercase">New</button>}
        </div>
      </div>

      <button onClick={onClose} className="mt-5 bg-white border-4 border-black rounded-2xl py-3 font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
        <X className="w-5 h-5" /> Done
      </button>
    </div>
  );
}
