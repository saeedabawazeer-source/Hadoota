import React from 'react';
import type { AvatarConfig } from './avatar';

// A bold, blocky "face only" avatar rendered as crisp SVG.
export function AvatarFace({ cfg, size = 96, rounded = 26, showBg = true }: { cfg: AvatarConfig; size?: number; rounded?: number; showBg?: boolean }) {
  const s = cfg.skin, hc = cfg.hairColor;
  const STROKE = '#000';
  const sw = 4;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ display: 'block' }}>
      {showBg && <rect x="1" y="1" width="118" height="118" rx={rounded} fill={cfg.bg} stroke={STROKE} strokeWidth={sw} />}

      {/* hair behind (afro / long back) */}
      {cfg.hair === 'afro' && <circle cx="60" cy="42" r="40" fill={hc} stroke={STROKE} strokeWidth={sw} />}
      {cfg.hair === 'long' && <rect x="24" y="36" width="72" height="62" rx="20" fill={hc} stroke={STROKE} strokeWidth={sw} />}

      {/* ears */}
      <circle cx="31" cy="66" r="8" fill={s} stroke={STROKE} strokeWidth={sw} />
      <circle cx="89" cy="66" r="8" fill={s} stroke={STROKE} strokeWidth={sw} />

      {/* head */}
      <rect x="30" y="32" width="60" height="62" rx="20" fill={s} stroke={STROKE} strokeWidth={sw} />

      {/* hair front */}
      {cfg.hair === 'short' && <path d="M30 52 C30 30 47 26 60 26 C73 26 90 30 90 52 C90 44 84 40 84 40 L84 44 C74 36 46 36 36 44 L36 40 C36 40 30 44 30 52 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />}
      {cfg.hair === 'buzz' && <path d="M32 50 C32 34 46 30 60 30 C74 30 88 34 88 50 C82 42 38 42 32 50 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />}
      {cfg.hair === 'swoop' && <path d="M30 52 C30 30 47 24 62 24 C80 24 90 34 90 48 C86 40 70 34 60 40 C52 44 40 44 30 52 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />}
      {cfg.hair === 'bun' && <>
        <circle cx="60" cy="20" r="11" fill={hc} stroke={STROKE} strokeWidth={sw} />
        <path d="M32 48 C32 34 46 30 60 30 C74 30 88 34 88 48 C82 40 38 40 32 48 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />
      </>}
      {cfg.hair === 'long' && <path d="M30 52 C30 30 47 26 60 26 C73 26 90 30 90 52 C86 44 74 40 60 40 C46 40 34 44 30 52 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />}
      {cfg.hair === 'cap' && <>
        <path d="M30 46 C30 30 46 26 60 26 C74 26 90 30 90 46 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="60" cy="47" rx="34" ry="7" fill={hc} stroke={STROKE} strokeWidth={sw} />
      </>}

      {/* eyes */}
      {cfg.glasses === 'sun' ? null : <>
        <ellipse cx="50" cy="64" rx="6" ry="8" fill="#fff" stroke={STROKE} strokeWidth="3" />
        <ellipse cx="70" cy="64" rx="6" ry="8" fill="#fff" stroke={STROKE} strokeWidth="3" />
        <circle cx="50" cy="65" r="3.2" fill="#1c1c1c" />
        <circle cx="70" cy="65" r="3.2" fill="#1c1c1c" />
      </>}

      {/* nose */}
      {cfg.nose === 'button' && <circle cx="60" cy="74" r="3.5" fill="rgba(0,0,0,0.18)" />}
      {cfg.nose === 'wide' && <ellipse cx="60" cy="74" rx="6" ry="3.4" fill="rgba(0,0,0,0.18)" />}
      {cfg.nose === 'small' && <circle cx="60" cy="74" r="2.2" fill="rgba(0,0,0,0.18)" />}

      {/* mouth */}
      <path d="M52 82 Q60 89 68 82" fill="none" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />

      {/* glasses */}
      {cfg.glasses === 'round' && <g fill="none" stroke={STROKE} strokeWidth="3.5">
        <circle cx="50" cy="64" r="9" /><circle cx="70" cy="64" r="9" /><line x1="59" y1="64" x2="61" y2="64" />
      </g>}
      {cfg.glasses === 'square' && <g fill="none" stroke={STROKE} strokeWidth="3.5">
        <rect x="41" y="57" width="16" height="14" rx="3" /><rect x="63" y="57" width="16" height="14" rx="3" /><line x1="57" y1="64" x2="63" y2="64" />
      </g>}
      {cfg.glasses === 'sun' && <g stroke={STROKE} strokeWidth="3.5">
        <rect x="41" y="57" width="16" height="14" rx="4" fill="#1c1c1c" /><rect x="63" y="57" width="16" height="14" rx="4" fill="#1c1c1c" /><line x1="57" y1="63" x2="63" y2="63" />
      </g>}

      {/* facial hair */}
      {cfg.facial === 'mustache' && <path d="M50 80 Q60 76 70 80 Q60 84 50 80 Z" fill={hc} stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />}
      {cfg.facial === 'beard' && <path d="M36 74 C36 96 50 98 60 98 C70 98 84 96 84 74 C84 86 72 90 60 90 C48 90 36 86 36 74 Z" fill={hc} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />}
      {cfg.facial === 'stubble' && <path d="M38 76 C38 94 50 96 60 96 C70 96 82 94 82 76 C82 86 72 89 60 89 C48 89 38 86 38 76 Z" fill={hc} opacity="0.28" />}
    </svg>
  );
}
