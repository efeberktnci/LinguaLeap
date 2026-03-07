export interface Achievement {
  id: string;
  icon: string;
  title: string;
  unlocked: boolean;
}

export interface DailyXP {
  day: string;
  xp: number;
}

export type LeagueName =
  | 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Ruby'
  | 'Emerald' | 'Amethyst' | 'Pearl' | 'Obsidian' | 'Diamond';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  gems: number;
  crowns: number;
  league: LeagueName;
  leagueRank: number;
  createdAt: string;
  coursesActive: string[];
  achievements: Achievement[];
  weeklyXP: DailyXP[];
  dailyGoal: number;
  dailyXPEarned: number;
  completedLessons: string[];
  lessonProgress: Record<string, LessonProgress>;
}

export interface LessonProgress {
  lessonId: string;
  crowns: number;
  bestScore: number;
  attempts: number;
  lastAttempt: string;
}

export interface Language {
  id: string;
  name: string;
  flag: string;
  progress: number;
}

export type LessonType = 'star' | 'book' | 'trophy' | 'dumbbell';

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  completed: boolean;
  crowns: number;
  maxCrowns: number;
  xpReward: number;
  current?: boolean;
  locked?: boolean;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  shadowColor: string;
  icon: string;
  completed: boolean;
  lessons: Lesson[];
}

export type QuestionType = 'translate' | 'select' | 'fillBlank' | 'listen' | 'match';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  prompt?: string;
  sentence?: string;
  audioText?: string;
  options?: string[];
  correctAnswer?: string;
  xp: number;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  avatar: string;
  xp: number;
  league: string;
  isUser?: boolean;
}

export type ShopCurrency = 'gem' | 'free';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  currency: ShopCurrency;
}

export interface DailyQuest {
  id: string;
  title: string;
  icon: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}

export interface LeagueInfo {
  icon: string;
  color: string;
  next: LeagueName | null;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Lesson: { lesson: Lesson; questions: QuizQuestion[] };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Learn: undefined;
  Leaderboard: undefined;
  Shop: undefined;
  Profile: undefined;
};
