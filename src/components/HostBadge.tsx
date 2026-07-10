import React from 'react';
import { characterFor } from '../data/characters';
import { FaceIcon } from './FaceIcon';

// Small badge introducing the animal hosting a subject/game — animals are
// guides/hosts for games & stories now, not a playable avatar for the kid
// (see data/gameHosts.ts).
export function HostBadge({ seed }: { seed?: string }) {
  if (!seed) return null;
  const host = characterFor(seed);
  return (
    <div className="flex items-center gap-1.5 bg-black/40 rounded-full pl-1 pr-3 py-1 pointer-events-auto">
      <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shrink-0" style={{ background: host.accent }}>
        <FaceIcon seed={seed} alt={host.name} className="w-full h-full object-cover" />
      </div>
      <span className="text-white font-black text-[10px] uppercase tracking-wide whitespace-nowrap">with {host.name}</span>
    </div>
  );
}
