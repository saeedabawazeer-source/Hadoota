// Animals are no longer a playable avatar choice (see HERO_SEEDS in
// characters.ts) — instead each one is cast as the host/guide for a specific
// game or learning subject, matching their personality from PET_DEFS.
//
// key = the GAME_CONFIGS key (data/games3d.ts) or 'Stories' for StoryEngine.
export const GAME_HOSTS: Record<string, string> = {
  'Math Dash':   'pet-monkey',   // Coco — clever, counts bananas, loves a challenge
  'Counting':    'pet-chick',    // Peep — simple, sunny, toddler-friendly
  'Spelling':    'pet-fox',      // Rusty — sly and quick with wordplay
  'Shapes':      'pet-bunny',    // Nibbles — bright, bouncy, colorful
  'Memory Quiz': 'pet-lion',     // Leo — king of the animal kingdom hosts "find the animal"
  'Science':     'pet-elephant', // Peanut — famous memory, curious about how things work
  'Geography':   'pet-parrot',   // Kiwi — well-traveled, chatty tour-guide energy
  Stories:       'pet-deer',     // Fern — gentle, dreamy, perfect for storytime
};

export function hostFor(key: string): string | undefined {
  return GAME_HOSTS[key];
}
