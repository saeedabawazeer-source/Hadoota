// Hadoota's character cast — "Mini" heroes + Cube Pet animals.
// Each has a low-poly 3D model (GLB, baked animation clips) and a poster image.
// avatarSeed on a kid profile matches Character.id.

export interface Character {
  id: string;        // matches avatarSeed
  name: string;      // display name
  role: string;      // short archetype
  blurb: string;     // one-line personality
  likes: string;     // fun detail
  model: string;     // GLB for 3D display
  poster: string;    // PNG full-body render (3D fallback)
  accent: string;    // signature brand color
  kind: 'hero' | 'pet'; // heroes support complexion editing; pets are animals
  idle?: string;     // preferred idle animation clip name
}

const HEROES: Character[] = [
  { id: 'Fin',  name: 'Fin',  role: 'The Explorer',  accent: '#f97316', kind: 'hero',
    blurb: 'Brave and always first to try. Fin turns every lesson into an adventure.',
    likes: 'maps, shortcuts & big quests',
    model: '/characters/mini/models/Fin.glb',  poster: '/characters/mini/posters/Fin.png' },
  { id: 'Jae',  name: 'Jae',  role: 'The Spark',     accent: '#ec4899', kind: 'hero',
    blurb: 'Bubbly, fast and full of cheer. Jae keeps the whole crew smiling.',
    likes: 'races, high-fives & confetti',
    model: '/characters/mini/models/Jae.glb',  poster: '/characters/mini/posters/Jae.png' },
  { id: 'Poh',  name: 'Poh',  role: 'The Joker',     accent: '#84cc16', kind: 'hero',
    blurb: 'Goofy and playful — Poh turns even hard problems into a fun game.',
    likes: 'jokes, silly faces & snacks',
    model: '/characters/mini/models/Poh.glb',  poster: '/characters/mini/posters/Poh.png' },
  { id: 'Mol',  name: 'Mol',  role: 'The Inventor',  accent: '#9333ea', kind: 'hero',
    blurb: 'Curious tinkerer with a thousand ideas. Mol loves figuring things out.',
    likes: 'gadgets, buttons & why-questions',
    model: '/characters/mini/models/Mol.glb',  poster: '/characters/mini/posters/Mol.png' },
  { id: 'Lumi', name: 'Lumi', role: 'The Dreamer',   accent: '#d946ef', kind: 'hero',
    blurb: 'Gentle and imaginative, Lumi finds a little magic in everything.',
    likes: 'drawing, stars & daydreams',
    model: '/characters/mini/models/Lumi.glb', poster: '/characters/mini/posters/Lumi.png' },
  { id: 'Bibo', name: 'Bibo', role: 'The Rock',      accent: '#3b82f6', kind: 'hero',
    blurb: 'Calm, patient and kind. Bibo is the steady friend who never gives up.',
    likes: 'teamwork, building & fair play',
    model: '/characters/mini/models/Bibo.glb', poster: '/characters/mini/posters/Bibo.png' },
  { id: 'Zuzu', name: 'Zuzu', role: 'The Speedster', accent: '#f59e0b', kind: 'hero',
    blurb: 'Competitive and daring, Zuzu loves a challenge and a good high score.',
    likes: 'speedruns, sports & winning',
    model: '/characters/mini/models/Zuzu.glb', poster: '/characters/mini/posters/Zuzu.png' },
  { id: 'Taro', name: 'Taro', role: 'The Brain',     accent: '#14b8a6', kind: 'hero',
    blurb: 'A clever bookworm who loves puzzles, patterns and cool facts.',
    likes: 'books, riddles & big words',
    model: '/characters/mini/models/Taro.glb', poster: '/characters/mini/posters/Taro.png' },
  { id: 'Remy', name: 'Remy', role: 'The Builder',   accent: '#0ea5e9', kind: 'hero',
    blurb: 'Loves stacking, fixing and making things from scratch.',
    likes: 'blocks, tools & big builds',
    model: '/characters/mini/models/Remy.glb', poster: '/characters/mini/posters/Remy.png' },
  { id: 'Sunny', name: 'Sunny', role: 'The Sunshine', accent: '#facc15', kind: 'hero',
    blurb: 'Warm, giggly and always looking on the bright side.',
    likes: 'singing, sunshine & friends',
    model: '/characters/mini/models/Sunny.glb', poster: '/characters/mini/posters/Sunny.png' },
  { id: 'Kai', name: 'Kai', role: 'The Adventurer',   accent: '#22c55e', kind: 'hero',
    blurb: 'Always packing for the next big expedition.',
    likes: 'trails, maps & the outdoors',
    model: '/characters/mini/models/Kai.glb', poster: '/characters/mini/posters/Kai.png' },
  { id: 'Ivy', name: 'Ivy', role: 'The Artist',       accent: '#e11d48', kind: 'hero',
    blurb: 'Sees the world in colors and turns everything into art.',
    likes: 'paint, patterns & doodles',
    model: '/characters/mini/models/Ivy.glb', poster: '/characters/mini/posters/Ivy.png' },
];

// Cube Pet animals — animated (idle/walk/dance/gesture). Selectable as a "style".
const PET_DEFS: Array<[string, string, string, string, string]> = [
  // id, name, role, likes, accent
  ['cat',      'Milo',    'The Cat',       'naps, boxes & yarn',        '#f59e0b'],
  ['dog',      'Biscuit', 'The Pup',       'fetch, walks & belly rubs', '#f97316'],
  ['bunny',    'Nibbles', 'The Bunny',     'carrots, hops & hugs',      '#f472b6'],
  ['fox',      'Rusty',   'The Fox',       'sneaking, leaves & games',  '#ea580c'],
  ['panda',    'Bao',     'The Panda',     'bamboo, rolls & snacks',    '#10b981'],
  ['tiger',    'Rawr',    'The Tiger',     'pouncing, stripes & races', '#f59e0b'],
  ['penguin',  'Pip',     'The Penguin',   'sliding, fish & snow',      '#38bdf8'],
  ['elephant', 'Peanut',  'The Elephant',  'splashing, trunks & fun',   '#a78bfa'],
  ['lion',     'Leo',     'The Lion',      'roars, sun & big naps',     '#eab308'],
  ['monkey',   'Coco',    'The Monkey',    'bananas, swings & jokes',   '#d97706'],
  ['koala',    'Kobi',    'The Koala',     'trees, hugs & sleep',       '#94a3b8'],
  ['pig',      'Waddle',  'The Pig',       'mud, snacks & giggles',     '#fb7185'],
  ['deer',     'Fern',    'The Deer',      'meadows, leaps & stars',    '#84cc16'],
  ['parrot',   'Kiwi',    'The Parrot',    'colors, songs & chatter',   '#22c55e'],
  ['chick',    'Peep',    'The Chick',     'seeds, peeps & sunshine',   '#facc15'],
  ['cow',      'Moo',     'The Cow',       'grass, fields & moos',      '#f43f5e'],
];

const PETS: Character[] = PET_DEFS.map(([id, name, role, likes, accent]) => ({
  id: `pet-${id}`, name, role, accent, kind: 'pet' as const,
  blurb: `${name} is a friendly ${role.replace('The ', '').toLowerCase()} who loves to learn with you.`,
  likes,
  model: `/characters/pets/models/${id}.glb`,
  poster: `/characters/pets/posters/${id}.png`,
  idle: 'idle',
}));

export const CHARACTERS: Character[] = [...HEROES, ...PETS];
export const HERO_CHARACTERS = HEROES;
export const PET_CHARACTERS = PETS;

export const CREW_BANNER = '/characters/mini/crew-banner.png';

export const AVATAR_SEEDS = CHARACTERS.map((c) => c.id);

export function characterFor(seed: string | undefined): Character {
  return CHARACTERS.find((c) => c.id === seed) ?? CHARACTERS[0];
}

// Small-avatar image (poster). Existing <img src={characterSrc(seed)} /> keeps working.
export function characterSrc(seed: string | undefined): string {
  return characterFor(seed).poster;
}

// Head-crop icon for small avatars / thumbnails (face only, same art style).
export function characterFace(seed: string | undefined): string {
  return characterFor(seed).poster.replace('/posters/', '/faces/');
}

// 3D model path for the live viewer.
export function characterModel(seed: string | undefined): string {
  return characterFor(seed).model;
}
