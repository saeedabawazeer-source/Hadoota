// Complexion (skin-tone) options for the mini heroes.
// Each maps to a recolored copy of the shared colormap where only the skin
// texels were remapped (clothing/hair untouched). Selecting one swaps the
// character's base-color texture so the 3D model actually changes complexion.

export interface Complexion {
  id: string;
  label: string;
  swatch: string;       // UI dot color (mid-tone)
  texture: string | null; // colormap to apply; null = original
}

export const COMPLEXIONS: Complexion[] = [
  { id: 'default',   label: 'Original',  swatch: '#f0b490', texture: null },
  { id: 'porcelain', label: 'Porcelain', swatch: '#ffe1c6', texture: '/characters/mini/models/Textures/complexion/porcelain.png' },
  { id: 'light',     label: 'Light',     swatch: '#f4c19f', texture: '/characters/mini/models/Textures/complexion/light.png' },
  { id: 'medium',    label: 'Medium',    swatch: '#dc9e78', texture: '/characters/mini/models/Textures/complexion/medium.png' },
  { id: 'tan',       label: 'Tan',       swatch: '#c48460', texture: '/characters/mini/models/Textures/complexion/tan.png' },
  { id: 'deep',      label: 'Deep',      swatch: '#9e6548', texture: '/characters/mini/models/Textures/complexion/deep.png' },
  { id: 'rich',      label: 'Rich',      swatch: '#784d36', texture: '/characters/mini/models/Textures/complexion/rich.png' },
];

export function complexionFor(id: string | undefined): Complexion {
  return COMPLEXIONS.find((c) => c.id === id) ?? COMPLEXIONS[0];
}
