import React, { useState } from 'react';
import { Check, X, Shuffle } from 'lucide-react';
import { AvatarFace } from '../avatar/AvatarFace';
import { AvatarConfig, SKINS, HAIR, HAIR_COLORS, GLASSES, FACIAL, NOSE, BGS, DEFAULT_AVATAR, randomAvatar } from '../avatar/avatar';

const LABEL: Record<string, string> = { none: 'None', short: 'Short', afro: 'Afro', buzz: 'Buzz', swoop: 'Swoop', bun: 'Bun', long: 'Long', cap: 'Cap', round: 'Round', square: 'Square', sun: 'Shades', mustache: 'Mustache', beard: 'Beard', stubble: 'Stubble', button: 'Button', wide: 'Wide', small: 'Small' };

function Swatches({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((c) => (
        <button key={c} onClick={() => onChange(c)}
          className={`w-9 h-9 rounded-xl border-4 border-black ${value === c ? 'ring-4 ring-lime-400' : ''}`} style={{ background: c }} />
      ))}
    </div>
  );
}
function Pills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-3 py-1.5 rounded-full border-3 border-black font-black text-xs uppercase ${value === o ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>{LABEL[o] || o}</button>
      ))}
    </div>
  );
}

export function CharacterCreator({ initial, title = 'Create Your Character', onSave, onClose }: {
  initial?: AvatarConfig; title?: string; onSave: (cfg: AvatarConfig) => void; onClose: () => void;
}) {
  const [cfg, setCfg] = useState<AvatarConfig>(initial || DEFAULT_AVATAR);
  const set = (k: keyof AvatarConfig, v: string) => setCfg((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex-1 flex flex-col w-full max-w-lg mx-auto pt-1 pb-4">
      <h2 className="text-2xl md:text-4xl font-black text-white uppercase mb-3 text-center" style={{ textShadow: '2px 2px 0 #000' }}>{title}</h2>

      {/* preview */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="border-4 border-black rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <AvatarFace cfg={cfg} size={140} />
        </div>
        <button onClick={() => setCfg(randomAvatar())} className="bg-yellow-400 border-4 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" title="Randomize"><Shuffle className="w-6 h-6" /></button>
      </div>

      <div className="bg-white border-4 border-black rounded-3xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 overflow-y-auto">
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Skin</p><Swatches options={SKINS} value={cfg.skin} onChange={(v) => set('skin', v)} /></div>
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Hair</p><Pills options={HAIR} value={cfg.hair} onChange={(v) => set('hair', v)} /></div>
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Hair color</p><Swatches options={HAIR_COLORS} value={cfg.hairColor} onChange={(v) => set('hairColor', v)} /></div>
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Glasses</p><Pills options={GLASSES} value={cfg.glasses} onChange={(v) => set('glasses', v)} /></div>
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Facial hair</p><Pills options={FACIAL} value={cfg.facial} onChange={(v) => set('facial', v)} /></div>
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Nose</p><Pills options={NOSE} value={cfg.nose} onChange={(v) => set('nose', v)} /></div>
        <div><p className="font-black uppercase text-xs mb-1.5 text-gray-500">Background</p><Swatches options={BGS} value={cfg.bg} onChange={(v) => set('bg', v)} /></div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={() => { onSave(cfg); onClose(); }} className="flex-1 bg-lime-400 border-4 border-black rounded-2xl py-3 font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none">
          <Check className="w-5 h-5" /> Save
        </button>
        <button onClick={onClose} className="bg-gray-200 border-4 border-black rounded-2xl px-5 font-black uppercase"><X className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
