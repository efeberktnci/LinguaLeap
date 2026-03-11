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

export type AssessmentTier = 'starter' | 'explorer' | 'navigator' | 'master';
export type LearnMode = 'standard' | 'timed' | 'review' | 'boss';
export type CefrLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2';

export interface PlacementState {
  completed: boolean;
  score: number;
  total: number;
  tier: AssessmentTier;
  lastTakenAt: string;
}

export interface RewardChest {
  id: string;
  level: number;
  title: string;
  rarity: 'common' | 'rare' | 'epic';
  icon: string;
  gems: number;
  hearts: number;
  xpBoostMinutes: number;
  claimed: boolean;
}

export interface BattlePassState {
  seasonName: string;
  xp: number;
  level: number;
  premiumUnlocked: boolean;
  claimedRewardIds: string[];
}

export interface LearnPreferences {
  activeMode: LearnMode;
  learnTargetLanguage: 'en' | 'de' | 'es' | 'tr';
  recentQuestionIds: string[];
  sessionSeeds: Record<string, number>;
  placementPromptSeen: boolean;
  cefrLevel: CefrLevel;
  unlockedCefrLevels: CefrLevel[];
}

export interface MistakeBucket {
  focus: string;
  wrong: number;
  correct: number;
  lastSeen: string;
}

export type LeagueName =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Sapphire'
  | 'Ruby'
  | 'Emerald'
  | 'Amethyst'
  | 'Pearl'
  | 'Obsidian'
  | 'Diamond';

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
  placement: PlacementState;
  battlePass: BattlePassState;
  rewardChests: RewardChest[];
  learnPreferences: LearnPreferences;
  mistakeBuckets: Record<string, MistakeBucket>;
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
  difficulty?: AssessmentTier;
  modeTag?: LearnMode;
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

export type QuestionType = 'translate' | 'select' | 'fillBlank' | 'listen' | 'pronounce' | 'match';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  prompt?: string;
  sentence?: string;
  audioText?: string;
  audioLanguage?: string;
  options?: string[];
  correctAnswer?: string;
  xp: number;
  focus?: string;
  difficulty?: AssessmentTier;
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

export interface LessonSessionMeta {
  kind: 'lesson' | 'assessment' | 'challenge' | 'review';
  mode: LearnMode | 'assessment';
  targetLanguage?: string;
  assessmentTier?: AssessmentTier;
  timeLimitSec?: number;
  multiplierEligible?: boolean;
  saveProgress?: boolean;
  challengeName?: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Lesson: { lesson: Lesson; questions: QuizQuestion[]; session?: LessonSessionMeta };
  MistakesNotebook: undefined;
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
