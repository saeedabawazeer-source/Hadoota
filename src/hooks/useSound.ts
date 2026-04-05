import { useCallback, useRef } from 'react';
import type { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

function playSequence(notes: { freq: number; dur: number; delay: number; type?: OscillatorType }[]) {
  notes.forEach(({ freq, dur, delay, type }) => {
    setTimeout(() => playTone(freq, dur, type || 'sine'), delay * 1000);
  });
}

const SOUNDS: Record<SoundType, () => void> = {
  pop: () => {
    playTone(600, 0.08, 'sine', 0.12);
    setTimeout(() => playTone(900, 0.06, 'sine', 0.08), 50);
  },
  win: () => {
    playSequence([
      { freq: 523, dur: 0.12, delay: 0 },
      { freq: 659, dur: 0.12, delay: 0.1 },
      { freq: 784, dur: 0.12, delay: 0.2 },
      { freq: 1047, dur: 0.3, delay: 0.3, type: 'triangle' },
    ]);
  },
  lose: () => {
    playSequence([
      { freq: 400, dur: 0.15, delay: 0, type: 'sawtooth' },
      { freq: 300, dur: 0.15, delay: 0.15, type: 'sawtooth' },
      { freq: 200, dur: 0.3, delay: 0.3, type: 'sawtooth' },
    ]);
  },
  click: () => {
    playTone(800, 0.04, 'square', 0.06);
  },
  whoosh: () => {
    try {
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {
      // Audio not available
    }
  },
};

export function useSound(enabled: boolean = true) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    SOUNDS[type]?.();
  }, []);

  return playSound;
}
