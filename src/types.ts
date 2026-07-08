// --- Core App Types ---

export interface ParentProfile {
  id: string;
  name: string;
}

export interface ParentAccount {
  parents: ParentProfile[];
  kids: KidProfile[];
  createdAt: number;
}

export interface KidProfile {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  characterColor?: number;
  interests: string[];
  difficulty: Difficulty;
  linkCode: string;
  stars: number;
  streak: number;
  questProgress: number;
  gameStats: GameStats;
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
  kidId?: string;
  completedAt?: number;
}

export interface Message {
  id: string;
  familyId: string;
  senderId: string;
  senderName: string;
  senderType: 'parent' | 'child';
  recipientId: string | null; // null = group chat, set = DM
  content: string;
  type: 'text' | 'image' | 'audio';
  createdAt: number;
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

export type AppView = 'landing' | 'parent-setup' | 'kid-link' | 'kid' | 'parent';
export type KidTab = 'home' | 'games' | 'chores' | 'stories' | 'store' | 'settings' | 'chat';
export type SoundType = 'pop' | 'win' | 'lose' | 'click' | 'whoosh';
export type Difficulty = 'easy' | 'medium' | 'hard';
