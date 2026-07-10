import React, { useEffect, useRef } from 'react';
import { characterFor } from '../data/characters';
import { complexionFor } from '../data/complexions';

// Wraps Google's <model-viewer> web component (loaded from index.html) to show
// a Mini character's 3D model with a baked animation. Falls back to the poster
// image while (or if) the model can't load, so it degrades gracefully.
// Rendered via React.createElement so we don't need to augment JSX types.

interface MiniViewerProps {
  seed: string;
  animation?: string;   // clip name, e.g. 'idle', 'walk', 'sprint'
  complexion?: string;  // complexion id — recolors the skin on heroes
  autoRotate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MiniViewer({ seed, animation = 'idle', complexion, autoRotate = true, className = '', style }: MiniViewerProps) {
  const c = characterFor(seed);
  const ref = useRef<any>(null);

  // Swap the character's base-color texture to the chosen complexion colormap.
  useEffect(() => {
    const mv = ref.current;
    if (!mv || c.kind !== 'hero') return;
    const comp = complexionFor(complexion);
    let cancelled = false;
    const url = comp.texture ?? c.model.replace(/[^/]+\.glb$/, 'Textures/colormap.png');
    const apply = async () => {
      try {
        const model = mv.model;
        if (!model || !model.materials) return;
        const tex = await mv.createTexture(new URL(url, window.location.origin).href);
        if (cancelled) return;
        for (const mat of model.materials) {
          const ti = mat?.pbrMetallicRoughness?.baseColorTexture;
          if (ti && typeof ti.setTexture === 'function') ti.setTexture(tex);
        }
      } catch { /* ignore */ }
    };
    if (mv.model) apply();
    const onLoad = () => { if (!cancelled) apply(); };
    mv.addEventListener('load', onLoad);
    return () => { cancelled = true; mv.removeEventListener('load', onLoad); };
  }, [seed, complexion, c.kind, c.model]);

  return React.createElement('model-viewer', {
    ref,
    src: c.model,
    poster: c.poster,
    alt: c.name,
    'camera-controls': true,
    autoplay: true,
    'animation-name': animation,
    'interaction-prompt': 'none',
    'shadow-intensity': '1',
    'shadow-softness': '0.9',
    exposure: '1.05',
    'camera-orbit': '25deg 74deg 3.4m',
    'min-camera-orbit': 'auto 55deg auto',
    'max-camera-orbit': 'auto 95deg 4.6m',
    'disable-zoom': true,
    className,
    style: { width: '100%', height: '100%', background: 'transparent', ...style },
  });
}
