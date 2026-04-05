// --- Core App Types ---

export interface Child {
  name: string;
  age: number;
  avatarSeed: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  reward: number;
  isChore: boolean;
  status: 'pending' | 'done' | 'approved';
  completedAt?: number;
}

export interface GameStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalWrong: number;
  totalStarsEarned: number;
  subjectStats: Record<string, SubjectStats>;
  dailyActivity: DailyActivity[];
}

export interface SubjectStats {
  played: number;
  correct: number;
  wrong: number;
  bestStreak: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  gamesPlayed: number;
  starsEarned: number;
  minutesPlayed: number;
}

export interface Question {
  q: string;
  options: (string | number)[];
  a: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameData {
  title: string;
  tutorial: string;
  icon: string;
  questions: Question[];
}

export type AppView = 'landing' | 'onboarding' | 'kid' | 'parent';
export type KidTab = 'home' | 'games' | 'chores' | 'stories' | 'store' | 'settings';
export type SoundType = 'pop' | 'win' | 'lose' | 'click' | 'whoosh';
export type Difficulty = 'easy' | 'medium' | 'hard';
