import { setDocument, getDocument, queryCollection } from '../config/firebase';
import {
  AssessmentTier,
  BattlePassState,
  DailyXP,
  LeaderboardEntry,
  LearnMode,
  LearnPreferences,
  LessonProgress,
  PlacementState,
  RewardChest,
  UserProfile,
} from '../types';

const USERS = 'users';
const LEADERBOARD = 'leaderboard';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'ach_1', icon: '🔥', title: 'Ateş Başlangıcı', unlocked: false },
  { id: 'ach_2', icon: '⚡', title: 'Durdurulamaz', unlocked: false },
  { id: 'ach_3', icon: '🏆', title: 'Demir İrade', unlocked: false },
  { id: 'ach_4', icon: '💎', title: 'XP Avcısı', unlocked: false },
  { id: 'ach_5', icon: '🎯', title: 'Kusursuz Atış', unlocked: false },
  { id: 'ach_6', icon: '📚', title: 'Kitap Kurdu', unlocked: false },
  { id: 'ach_7', icon: '🌟', title: 'İlk Zafer', unlocked: false },
  { id: 'ach_8', icon: '🦁', title: 'Korkusuz', unlocked: false },
];

const EMPTY_WEEK: DailyXP[] = [
  { day: 'Pzt', xp: 0 },
  { day: 'Sal', xp: 0 },
  { day: 'Çar', xp: 0 },
  { day: 'Per', xp: 0 },
  { day: 'Cum', xp: 0 },
  { day: 'Cmt', xp: 0 },
  { day: 'Paz', xp: 0 },
];

const DEFAULT_PLACEMENT: PlacementState = {
  completed: false,
  score: 0,
  total: 0,
  tier: 'starter',
  lastTakenAt: '',
};

const DEFAULT_BATTLE_PASS: BattlePassState = {
  seasonName: 'Spring Sprint',
  xp: 0,
  level: 1,
  premiumUnlocked: false,
  claimedRewardIds: [],
};

const DEFAULT_LEARN_PREFERENCES: LearnPreferences = {
  activeMode: 'standard',
  learnTargetLanguage: 'en',
  recentQuestionIds: [],
  sessionSeeds: {},
  placementPromptSeen: false,
  cefrLevel: 'A0',
  unlockedCefrLevels: ['A0'],
};

const getBattlePassLevel = (xp: number) => Math.max(1, Math.floor(xp / 120) + 1);

const buildRewardChest = (level: number): RewardChest => {
  const rarity: RewardChest['rarity'] = level % 10 === 0 ? 'epic' : level % 5 === 0 ? 'rare' : 'common';

  if (rarity === 'epic') {
    return {
      id: `level_${level}_epic`,
      level,
      title: `Level ${level} Epic Chest`,
      rarity,
      icon: '🏆',
      gems: 120,
      hearts: 3,
      xpBoostMinutes: 30,
      claimed: false,
    };
  }

  if (rarity === 'rare') {
    return {
      id: `level_${level}_rare`,
      level,
      title: `Level ${level} Rare Chest`,
      rarity,
      icon: '💎',
      gems: 60,
      hearts: 2,
      xpBoostMinutes: 15,
      claimed: false,
    };
  }

  return {
    id: `level_${level}_common`,
    level,
    title: `Level ${level} Chest`,
    rarity,
    icon: '🎁',
    gems: 25,
    hearts: 1,
    xpBoostMinutes: 5,
    claimed: false,
  };
};

const ensureProfileDefaults = (profile: UserProfile): UserProfile => ({
  ...profile,
  placement: profile.placement ?? DEFAULT_PLACEMENT,
  battlePass: {
    ...DEFAULT_BATTLE_PASS,
    ...(profile.battlePass ?? {}),
    claimedRewardIds: profile.battlePass?.claimedRewardIds ?? [],
  },
  rewardChests: profile.rewardChests ?? [],
  learnPreferences: {
    ...DEFAULT_LEARN_PREFERENCES,
    ...(profile.learnPreferences ?? {}),
    recentQuestionIds: profile.learnPreferences?.recentQuestionIds ?? [],
    sessionSeeds: profile.learnPreferences?.sessionSeeds ?? {},
  },
  mistakeBuckets: profile.mistakeBuckets ?? {},
});

function getDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayStr(today: Date): string {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateStr(yesterday);
}

export async function createUserProfile(uid: string, email: string, name: string, username: string, token: string): Promise<UserProfile> {
  const nowStr = new Date().toISOString();
  const profile: UserProfile = {
    uid,
    email,
    name,
    username: `@${username.toLowerCase().replace(/\s/g, '_')}`,
    avatar: '🦉',
    level: 1,
    totalXP: 0,
    currentXP: 0,
    xpToNextLevel: 100,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    hearts: 5,
    maxHearts: 5,
    gems: 100,
    crowns: 0,
    league: 'Bronze',
    leagueRank: 0,
    createdAt: nowStr,
    coursesActive: ['en_tr'],
    achievements: DEFAULT_ACHIEVEMENTS,
    weeklyXP: [...EMPTY_WEEK],
    dailyGoal: 250,
    dailyXPEarned: 0,
    completedLessons: [],
    lessonProgress: {},
    placement: DEFAULT_PLACEMENT,
    battlePass: DEFAULT_BATTLE_PASS,
    rewardChests: [],
    learnPreferences: DEFAULT_LEARN_PREFERENCES,
    mistakeBuckets: {},
  };

  await setDocument(USERS, uid, profile, token);
  await setDocument(LEADERBOARD, uid, { uid, name, avatar: '🦉', xp: 0, league: 'Bronze' }, token);
  return profile;
}

export async function getUserProfile(uid: string, token: string): Promise<UserProfile | null> {
  const profile = await getDocument(USERS, uid, token);
  return profile ? ensureProfileDefaults(profile) : null;
}

export async function addXP(uid: string, amount: number, token: string): Promise<void> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return;

  let newCurrentXP = profile.currentXP + amount;
  let newLevel = profile.level;
  let newXpToNext = profile.xpToNextLevel;

  while (newCurrentXP >= newXpToNext) {
    newCurrentXP -= newXpToNext;
    newLevel += 1;
    newXpToNext = Math.floor(100 * Math.pow(1.15, newLevel - 1));
  }

  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weeklyXP = [...(profile.weeklyXP || EMPTY_WEEK)];
  weeklyXP[dayIndex] = { ...weeklyXP[dayIndex], xp: (weeklyXP[dayIndex]?.xp || 0) + amount };

  const todayStr = getDateStr(today);
  const yesterdayStr = getYesterdayStr(today);
  const lastActive = profile.lastActiveDate || '';
  let streak = profile.streak || 0;

  if (lastActive !== todayStr) {
    if (lastActive === yesterdayStr) streak += 1;
    else streak = 1;
  }

  let consecutive = 0;
  for (let i = dayIndex; i >= 0; i -= 1) {
    const dayXP = weeklyXP[i]?.xp ?? 0;
    if (dayXP > 0) consecutive += 1;
    else break;
  }
  if (consecutive > streak) streak = consecutive;

  const longestStreak = Math.max(profile.longestStreak || 0, streak);
  const newTotalXP = profile.totalXP + amount;
  const battlePassXP = (profile.battlePass?.xp ?? 0) + amount;
  const battlePassLevel = getBattlePassLevel(battlePassXP);
  const rewardChests = [...(profile.rewardChests ?? [])];

  if (newLevel > profile.level) {
    for (let level = profile.level + 1; level <= newLevel; level += 1) {
      const chest = buildRewardChest(level);
      if (!rewardChests.some((item) => item.id === chest.id)) {
        rewardChests.push(chest);
      }
    }
  }

  const achievements = checkAchievements(profile, {
    totalXP: newTotalXP,
    streak,
    completedLessons: profile.completedLessons || [],
  });

  const updates = {
    ...profile,
    currentXP: newCurrentXP,
    totalXP: newTotalXP,
    level: newLevel,
    xpToNextLevel: newXpToNext,
    dailyXPEarned: (profile.dailyXPEarned || 0) + amount,
    weeklyXP,
    streak,
    longestStreak,
    lastActiveDate: todayStr,
    achievements,
    rewardChests,
    battlePass: {
      ...(profile.battlePass ?? DEFAULT_BATTLE_PASS),
      xp: battlePassXP,
      level: battlePassLevel,
    },
  };

  await setDocument(USERS, uid, updates, token);
  await setDocument(LEADERBOARD, uid, {
    uid,
    name: profile.name,
    avatar: profile.avatar,
    xp: newTotalXP,
    league: profile.league,
  }, token);
}

export async function loseHeart(uid: string, token: string): Promise<void> {
  const profile = await getUserProfile(uid, token);
  if (!profile || profile.hearts <= 0) return;
  await setDocument(USERS, uid, { ...profile, hearts: profile.hearts - 1 }, token);
}

export async function refillHearts(uid: string, token: string): Promise<boolean> {
  const profile = await getUserProfile(uid, token);
  if (!profile) return false;

  await setDocument(USERS, uid, { ...profile, hearts: profile.maxHearts }, token);
  return true;
}

export async function spendGems(uid: string, amount: number, token: string): Promise<boolean> {
  const profile = await getUserProfile(uid, token);
  if (!profile || profile.gems < amount) return false;
  await setDocument(USERS, uid, { ...profile, gems: profile.gems - amount }, token);
  return true;
}

export async function updateUserAvatar(uid: string, avatar: string, token: string): Promise<void> {
  const profile = await getUserProfile(uid, token);
  if (!profile) return;

  await setDocument(USERS, uid, { ...profile, avatar }, token);
  await setDocument(LEADERBOARD, uid, {
    uid,
    name: profile.name,
    avatar,
    xp: profile.totalXP,
    league: profile.league,
  }, token);
}

export async function completeLesson(
  uid: string,
  lessonId: string,
  score: number,
  totalQuestions: number,
  perfect: boolean,
  questionIds: string[],
  token: string,
): Promise<void> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return;

  const completedLessons = (profile.completedLessons || []).includes(lessonId)
    ? profile.completedLessons
    : [...(profile.completedLessons || []), lessonId];

  const accuracy = score / totalQuestions;
  const crownsEarned = accuracy >= 1 ? 3 : accuracy >= 0.8 ? 2 : 1;
  const existing = (profile.lessonProgress || {})[lessonId];

  const progress: LessonProgress = {
    lessonId,
    crowns: Math.max(existing?.crowns ?? 0, crownsEarned),
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    attempts: (existing?.attempts ?? 0) + 1,
    lastAttempt: new Date().toISOString(),
  };

  const newLessonProgress = { ...(profile.lessonProgress || {}), [lessonId]: progress };
  const totalCrowns = Object.values(newLessonProgress).reduce((sum: number, p: any) => sum + (p.crowns || 0), 0);
  const recentQuestionIds = [
    ...questionIds,
    ...(profile.learnPreferences?.recentQuestionIds ?? []),
  ].filter((value, index, arr) => arr.indexOf(value) === index).slice(0, 60);

  await setDocument(USERS, uid, {
    ...profile,
    completedLessons,
    lessonProgress: newLessonProgress,
    crowns: totalCrowns,
    learnPreferences: {
      ...(profile.learnPreferences ?? DEFAULT_LEARN_PREFERENCES),
      recentQuestionIds,
    },
  }, token);
}

export async function getLeaderboard(token: string, topN: number = 20): Promise<LeaderboardEntry[]> {
  return await queryCollection(LEADERBOARD, token, 'xp', topN);
}

export async function resetUserStats(uid: string, token: string): Promise<UserProfile | null> {
  const profile = await getUserProfile(uid, token);
  if (!profile) return null;

  const resetProfile: UserProfile = {
    ...profile,
    level: 1,
    totalXP: 0,
    currentXP: 0,
    xpToNextLevel: 100,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    hearts: 5,
    maxHearts: 5,
    gems: 100,
    crowns: 0,
    league: 'Bronze',
    leagueRank: 0,
    achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
    weeklyXP: [...EMPTY_WEEK],
    dailyGoal: 250,
    dailyXPEarned: 0,
    completedLessons: [],
    lessonProgress: {},
    placement: DEFAULT_PLACEMENT,
    battlePass: DEFAULT_BATTLE_PASS,
    rewardChests: [],
    learnPreferences: DEFAULT_LEARN_PREFERENCES,
    mistakeBuckets: {},
  };

  await setDocument(USERS, uid, resetProfile, token);
  await setDocument(LEADERBOARD, uid, {
    uid,
    name: resetProfile.name,
    avatar: resetProfile.avatar,
    xp: 0,
    league: resetProfile.league,
  }, token);

  return resetProfile;
}

export async function savePlacementResult(
  uid: string,
  score: number,
  total: number,
  tier: AssessmentTier,
  token: string,
): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const updatedProfile = {
    ...profile,
    placement: {
      completed: true,
      score,
      total,
      tier,
      lastTakenAt: new Date().toISOString(),
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function setActiveLearnMode(uid: string, mode: LearnMode, token: string): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const updatedProfile = {
    ...profile,
    learnPreferences: {
      ...(profile.learnPreferences ?? DEFAULT_LEARN_PREFERENCES),
      activeMode: mode,
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function setLearnTargetLanguage(
  uid: string,
  learnTargetLanguage: 'en' | 'de' | 'es' | 'tr',
  token: string,
): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const updatedProfile = {
    ...profile,
    learnPreferences: {
      ...(profile.learnPreferences ?? DEFAULT_LEARN_PREFERENCES),
      learnTargetLanguage,
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function setLearnLevel(
  uid: string,
  cefrLevel: 'A0' | 'A1' | 'A2' | 'B1' | 'B2',
  unlockedCefrLevels: ('A0' | 'A1' | 'A2' | 'B1' | 'B2')[],
  placementPromptSeen: boolean,
  token: string,
): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const updatedProfile = {
    ...profile,
    learnPreferences: {
      ...(profile.learnPreferences ?? DEFAULT_LEARN_PREFERENCES),
      cefrLevel,
      unlockedCefrLevels,
      placementPromptSeen,
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function claimRewardChest(uid: string, chestId: string, token: string): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const chest = (profile.rewardChests ?? []).find((item) => item.id === chestId && !item.claimed);
  if (!chest) return profile;

  const rewardChests = (profile.rewardChests ?? []).map((item) =>
    item.id === chestId ? { ...item, claimed: true } : item
  );

  const updatedProfile = {
    ...profile,
    rewardChests,
    gems: profile.gems + chest.gems,
    hearts: Math.min(profile.maxHearts, profile.hearts + chest.hearts),
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function claimBattlePassReward(uid: string, rewardId: string, gemReward: number, token: string): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const rewardLevel = Number(rewardId.split('_').pop()) || 1;
  const requiresPremium = rewardId.includes('premium');

  if (
    (profile.battlePass?.claimedRewardIds ?? []).includes(rewardId) ||
    (profile.battlePass?.level ?? 1) < rewardLevel ||
    (requiresPremium && !profile.battlePass?.premiumUnlocked)
  ) {
    return profile;
  }

  const updatedProfile = {
    ...profile,
    gems: profile.gems + gemReward,
    battlePass: {
      ...(profile.battlePass ?? DEFAULT_BATTLE_PASS),
      claimedRewardIds: [...(profile.battlePass?.claimedRewardIds ?? []), rewardId],
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function unlockBattlePassPremium(uid: string, token: string): Promise<UserProfile | null> {
  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  if (profile.battlePass?.premiumUnlocked) return profile;

  const updatedProfile = {
    ...profile,
    battlePass: {
      ...(profile.battlePass ?? DEFAULT_BATTLE_PASS),
      premiumUnlocked: true,
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

export async function recordQuestionOutcome(uid: string, focus: string | undefined, correct: boolean, token: string): Promise<UserProfile | null> {
  if (!focus) return null;

  const rawProfile = await getUserProfile(uid, token);
  const profile = rawProfile ? ensureProfileDefaults(rawProfile) : null;
  if (!profile) return null;

  const current = profile.mistakeBuckets?.[focus] ?? {
    focus,
    wrong: 0,
    correct: 0,
    lastSeen: '',
  };

  const updatedProfile = {
    ...profile,
    mistakeBuckets: {
      ...(profile.mistakeBuckets ?? {}),
      [focus]: {
        focus,
        wrong: current.wrong + (correct ? 0 : 1),
        correct: current.correct + (correct ? 1 : 0),
        lastSeen: new Date().toISOString(),
      },
    },
  };

  await setDocument(USERS, uid, updatedProfile, token);
  return updatedProfile;
}

function checkAchievements(
  profile: UserProfile,
  updates: { totalXP: number; streak: number; completedLessons: string[] },
) {
  const achs = [...(profile.achievements || [])];

  const rules: Record<string, () => boolean> = {
    ach_1: () => updates.streak >= 7,
    ach_2: () => updates.streak >= 14,
    ach_3: () => updates.streak >= 30,
    ach_4: () => updates.totalXP >= 1000,
    ach_5: () => false,
    ach_7: () => updates.completedLessons.length >= 1,
    ach_6: () => updates.completedLessons.length >= 50,
    ach_8: () => updates.completedLessons.length >= 10,
  };

  for (const ach of achs) {
    if (!ach.unlocked && rules[ach.id]?.()) {
      ach.unlocked = true;
    }
  }

  return achs;
}
