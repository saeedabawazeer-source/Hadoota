// Config for the customizable "block face" avatar (head only, no body).

export interface AvatarConfig {
  bg: string;
  skin: string;
  hair: string;       // style id
  hairColor: string;
  glasses: string;    // none | round | square | sun
  facial: string;     // none | mustache | beard | stubble
  nose: string;       // button | wide | small
}

export const SKINS = ['#FFE0BD', '#F3C89B', '#E0AC69', '#C68642', '#9B6640', '#6B4226'];
export const HAIR = ['none', 'short', 'afro', 'buzz', 'swoop', 'bun', 'long', 'cap'];
export const HAIR_COLORS = ['#1C1C1C', '#3B2417', '#6B4226', '#B07A34', '#E3C063', '#B0B0B0', '#C0392B', '#8E44AD', '#2E86DE', '#27AE60'];
export const GLASSES = ['none', 'round', 'square', 'sun'];
export const FACIAL = ['none', 'mustache', 'beard', 'stubble'];
export const NOSE = ['button', 'wide', 'small'];
export const BGS = ['#f97316', '#9333ea', '#3b82f6', '#a3e635', '#ec4899', '#f59e0b', '#14b8a6', '#ef4444'];

export const DEFAULT_AVATAR: AvatarConfig = {
  bg: '#a3e635', skin: '#E0AC69', hair: 'short', hairColor: '#1C1C1C',
  glasses: 'round', facial: 'none', nose: 'button',
};

export function randomAvatar(): AvatarConfig {
  const p = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  return { bg: p(BGS), skin: p(SKINS), hair: p(HAIR), hairColor: p(HAIR_COLORS), glasses: p(GLASSES), facial: p(FACIAL), nose: p(NOSE) };
}
