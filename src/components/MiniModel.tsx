import React from 'react';

// Generic <model-viewer> wrapper for any mini-3D world model (cars, buildings,
// arcade machines, market props...). No auto-rotate, lazy-loaded, gentle.
// Rendered via React.createElement so no JSX type augmentation is needed.

interface MiniModelProps {
  src: string;
  animation?: string;
  orbit?: string;      // camera-orbit
  className?: string;
  style?: React.CSSProperties;
}

export function MiniModel({ src, animation, orbit = '25deg 72deg 3.6m', className = '', style }: MiniModelProps) {
  return React.createElement('model-viewer', {
    src,
    alt: 'Mini 3D model',
    'camera-controls': true,
    'disable-zoom': true,
    'interaction-prompt': 'none',
    loading: 'lazy',
    reveal: 'auto',
    autoplay: animation ? true : undefined,
    'animation-name': animation,
    'shadow-intensity': '0.9',
    'shadow-softness': '1',
    exposure: '1.1',
    'camera-orbit': orbit,
    'min-camera-orbit': 'auto 60deg auto',
    'max-camera-orbit': 'auto 88deg 6m',
    className,
    style: { width: '100%', height: '100%', background: 'transparent', ...style },
  });
}
