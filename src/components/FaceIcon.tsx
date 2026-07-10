import React, { useState, useEffect } from 'react';
import { characterFor } from '../data/characters';
import { complexionFor } from '../data/complexions';
import { getFace } from '../utils/faceRender';

// Crisp, straight-on face icon rendered from the character's 3D model.
// Falls back to the poster image until the render is ready.
export function FaceIcon({ seed, complexion, className = '', alt = '' }: {
  seed: string; complexion?: string; className?: string; alt?: string;
}) {
  const c = characterFor(seed);
  const [src, setSrc] = useState<string>(c.poster);

  useEffect(() => {
    let alive = true;
    const headFrac = c.kind === 'hero' ? 0.36 : 0.60;
    const cx = c.kind === 'hero' ? complexionFor(complexion).texture : null;
    getFace(c.model, headFrac, cx)
      .then((url) => { if (alive) setSrc(url); })
      .catch(() => { if (alive) setSrc(c.poster); });
    return () => { alive = false; };
  }, [c.model, c.kind, c.poster, complexion]);

  return <img src={src} alt={alt || c.name} className={className} />;
}
