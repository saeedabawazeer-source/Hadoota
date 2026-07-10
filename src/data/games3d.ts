import { scienceQuestions, geographyQuestions } from './questions';
import type { Question } from '../types';

// One 3D "drive to the answer" engine, many games. Each config generates a
// round: a prompt (+ optional big emoji line) and 3 answer strings with the
// correct index. Toddler games use emoji so pre-readers can play.

export interface Round { prompt: string; big?: string; answers: string[]; correct: number; }
export interface GameConfig {
  key: string;            // matches the 'Game: X' modal id suffix
  title: string;
  label: string;          // small HUD label, e.g. "Drive to the answer"
  emoji: string;          // tile / card icon
  color: string;
  makeRound: (difficulty: string) => Round;
}

const rnd = (n: number) => Math.floor(Math.random() * n);
function pick3(correct: string, pool: string[]): Round {
  const wrongs = pool.filter((x) => x !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
  const answers = [correct, ...wrongs].sort(() => Math.random() - 0.5);
  return { prompt: '', answers, correct: answers.indexOf(correct) };
}

/* ---- Math ---- */
function mathRound(d: string): Round {
  const add = d === 'easy' ? true : Math.random() > 0.4;
  const max = d === 'easy' ? 9 : d === 'medium' ? 20 : 50;
  let a = rnd(max) + 1, b = rnd(max) + 1;
  if (!add && b > a) { const t = a; a = b; b = t; }
  const ans = add ? a + b : a - b;
  const wrongs = new Set<number>();
  while (wrongs.size < 2) { const w = ans + (rnd(7) - 3); if (w !== ans && w >= 0) wrongs.add(w); }
  const opts = [ans, ...wrongs].sort(() => Math.random() - 0.5);
  return { prompt: `${a} ${add ? '+' : '−'} ${b} = ?`, answers: opts.map(String), correct: opts.indexOf(ans) };
}

/* ---- Counting (toddler) ---- */
const COUNT_EMOJI = ['🚗', '🦆', '🌳', '⭐', '🍎', '🐶', '🎈', '🐟'];
function countingRound(d: string): Round {
  const maxN = d === 'easy' ? 5 : d === 'medium' ? 8 : 12;
  const n = rnd(maxN) + 1;
  const e = COUNT_EMOJI[rnd(COUNT_EMOJI.length)];
  const wrongs = new Set<number>();
  while (wrongs.size < 2) { const w = n + (rnd(5) - 2); if (w !== n && w >= 1) wrongs.add(w); }
  const opts = [n, ...wrongs].sort(() => Math.random() - 0.5);
  return { prompt: 'How many?', big: e.repeat(n), answers: opts.map(String), correct: opts.indexOf(n) };
}

/* ---- Words (first letter) ---- */
const WORDS = [
  { e: '🍎', l: 'A' }, { e: '🐻', l: 'B' }, { e: '🐱', l: 'C' }, { e: '🐶', l: 'D' },
  { e: '🥚', l: 'E' }, { e: '🐟', l: 'F' }, { e: '🍇', l: 'G' }, { e: '🎩', l: 'H' },
  { e: '🍦', l: 'I' }, { e: '🕹️', l: 'J' }, { e: '🔑', l: 'K' }, { e: '🦁', l: 'L' },
  { e: '🌙', l: 'M' }, { e: '👃', l: 'N' }, { e: '🐙', l: 'O' }, { e: '🐷', l: 'P' },
  { e: '👑', l: 'Q' }, { e: '🤖', l: 'R' }, { e: '☀️', l: 'S' }, { e: '🌳', l: 'T' },
];
const LETTERS = WORDS.map((w) => w.l);
function wordsRound(_d: string): Round {
  const w = WORDS[rnd(WORDS.length)];
  const r = pick3(w.l, LETTERS);
  return { ...r, prompt: 'Which letter starts it?', big: w.e };
}

/* ---- Shapes & Colors (toddler) ---- */
const SHAPES = [['circle', '🔴'], ['square', '🟦'], ['triangle', '🔺'], ['star', '⭐'], ['heart', '❤️'], ['diamond', '🔶']];
const COLORS = [['red', '🔴'], ['blue', '🔵'], ['green', '🟢'], ['yellow', '🟡'], ['purple', '🟣'], ['orange', '🟠']];
function shapesRound(_d: string): Round {
  const useColor = Math.random() > 0.5;
  const set = useColor ? COLORS : SHAPES;
  const [name, emoji] = set[rnd(set.length)];
  const r = pick3(emoji, set.map((s) => s[1]));
  return { ...r, prompt: `Find the ${name}` };
}

/* ---- Animals (toddler) ---- */
const ANIMALS = [['dog', '🐶'], ['cat', '🐱'], ['rabbit', '🐰'], ['frog', '🐸'], ['bear', '🐻'], ['fox', '🦊'], ['duck', '🦆'], ['pig', '🐷'], ['lion', '🦁'], ['owl', '🦉']];
function animalsRound(_d: string): Round {
  const [name, emoji] = ANIMALS[rnd(ANIMALS.length)];
  const r = pick3(emoji, ANIMALS.map((a) => a[1]));
  return { ...r, prompt: `Find the ${name}` };
}

/* ---- Bank-fed quizzes (Science / Geography) ---- */
function bankRound(bank: Question[], d: string): Round {
  const pool = bank.filter((q) => q.difficulty === d);
  const q = (pool.length ? pool : bank)[rnd(pool.length ? pool.length : bank.length)];
  const opts = q.options.map(String);
  return { prompt: q.q, answers: opts, correct: opts.indexOf(String(q.a)) };
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
  'Math Dash':   { key: 'Math Dash',   title: 'Math School',  label: 'Drive to the answer',  emoji: '➕', color: '#9333ea', makeRound: mathRound },
  'Counting':    { key: 'Counting',    title: 'Counting Yard', label: 'Count them!',          emoji: '🔢', color: '#a3e635', makeRound: countingRound },
  'Spelling':    { key: 'Spelling',    title: 'Word Wagon',    label: 'Find the letter',      emoji: '🔤', color: '#3b82f6', makeRound: wordsRound },
  'Shapes':      { key: 'Shapes',      title: 'Shape Studio',  label: 'Find it!',             emoji: '🔺', color: '#f97316', makeRound: shapesRound },
  'Memory Quiz': { key: 'Memory Quiz', title: 'Animal Arcade', label: 'Find the animal',      emoji: '🐾', color: '#f59e0b', makeRound: animalsRound },
  'Science':     { key: 'Science',     title: 'Science Lab',   label: 'Pick the answer',      emoji: '🔬', color: '#ec4899', makeRound: (d) => bankRound(scienceQuestions, d) },
  'Geography':   { key: 'Geography',   title: 'World Tower',   label: 'Pick the answer',      emoji: '🌍', color: '#14b8a6', makeRound: (d) => bankRound(geographyQuestions, d) },
};
