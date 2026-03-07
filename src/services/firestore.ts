import { setDocument, getDocument, updateDocument, queryCollection } from '../config/firebase';
import { UserProfile, LeaderboardEntry, LessonProgress, DailyXP } from '../types';

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
  { day: 'Pzt', xp: 0 }, { day: 'Sal', xp: 0 }, { day: 'Çar', xp: 0 },
  { day: 'Per', xp: 0 }, { day: 'Cum', xp: 0 }, { day: 'Cmt', xp: 0 },
  { day: 'Paz', xp: 0 },
];

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
  const now = new Date();
  const nowStr = now.toISOString();
  const profile: UserProfile = {
    uid, email, name,
    username: `@${username.toLowerCase().replace(/\s/g, '_')}`,
    avatar: '🦉', level: 1, totalXP: 0, currentXP: 0, xpToNextLevel: 100,
    streak: 0, longestStreak: 0, lastActiveDate: '',
    hearts: 5, maxHearts: 5, gems: 100, crowns: 0, league: 'Bronze', leagueRank: 0,
    createdAt: nowStr, coursesActive: ['en_tr'], achievements: DEFAULT_ACHIEVEMENTS,
    weeklyXP: [...EMPTY_WEEK], dailyGoal: 250, dailyXPEarned: 0,
    completedLessons: [], lessonProgress: {},
  };
  await setDocument(USERS, uid, profile, token);
  await setDocument(LEADERBOARD, uid, { uid, name, avatar: '🦉', xp: 0, league: 'Bronze' }, token);
  return profile;
}

export async function getUserProfile(uid: string, token: string): Promise<UserProfile | null> {
  return await getDocument(USERS, uid, token);
}

export async function addXP(uid: string, amount: number, token: string): Promise<void> {
  const profile = await getUserProfile(uid, token);
  if (!profile) return;

  // Seviye hesapla
  let newCurrentXP = profile.currentXP + amount;
  let newLevel = profile.level;
  let newXpToNext = profile.xpToNextLevel;

  while (newCurrentXP >= newXpToNext) {
    newCurrentXP -= newXpToNext;
    newLevel++;
    newXpToNext = Math.floor(100 * Math.pow(1.15, newLevel - 1));
  }

  // Haftalık XP güncelle
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weeklyXP = [...(profile.weeklyXP || EMPTY_WEEK)];
  weeklyXP[dayIndex] = { ...weeklyXP[dayIndex], xp: (weeklyXP[dayIndex]?.xp || 0) + amount };

  // Streak hesapla - DÜZGÜN
  const todayStr = getDateStr(today);
  const yesterdayStr = getYesterdayStr(today);
  const lastActive = profile.lastActiveDate || '';
  let streak = profile.streak || 0;
  let longestStreak = profile.longestStreak || 0;

  if (lastActive !== todayStr) {
    // Bugün ilk kez XP kazanıyor
    if (lastActive === yesterdayStr) {
      // Dün de aktifti, streak devam
      streak += 1;
    } else if (lastActive === '') {
      // İlk kez kullanıyor
      streak = 1;
    } else {
      // Ara verilmiş, streak sıfırla
      streak = 1;
    }
    longestStreak = Math.max(longestStreak, streak);
  }
  // Eğer bugün zaten aktifse streak değişmez

  // Başarıları kontrol et
  const newTotalXP = profile.totalXP + amount;
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
  };

  await setDocument(USERS, uid, updates, token);
  await setDocument(LEADERBOARD, uid, {
    uid, name: profile.name, avatar: profile.avatar,
    xp: newTotalXP, league: profile.league,
  }, token);
}

export async function loseHeart(uid: string, token: string): Promise<void> {
  const profile = await getUserProfile(uid, token);
  if (!profile || profile.hearts <= 0) return;
  await setDocument(USERS, uid, { ...profile, hearts: profile.hearts - 1 }, token);
}

export async function refillHearts(uid: string, token: string): Promise<boolean> {
  const profile = await getUserProfile(uid, token);
  if (!profile || profile.gems < 350) return false;
  await setDocument(USERS, uid, { ...profile, hearts: profile.maxHearts, gems: profile.gems - 350 }, token);
  return true;
}

export async function spendGems(uid: string, amount: number, token: string): Promise<boolean> {
  const profile = await getUserProfile(uid, token);
  if (!profile || profile.gems < amount) return false;
  await setDocument(USERS, uid, { ...profile, gems: profile.gems - amount }, token);
  return true;
}

export async function completeLesson(uid: string, lessonId: string, score: number, totalQuestions: number, token: string): Promise<void> {
  const profile = await getUserProfile(uid, token);
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

  await setDocument(USERS, uid, {
    ...profile,
    completedLessons,
    lessonProgress: newLessonProgress,
    crowns: totalCrowns,
  }, token);
}

export async function getLeaderboard(token: string, topN: number = 20): Promise<LeaderboardEntry[]> {
  return await queryCollection(LEADERBOARD, token, 'xp', topN);
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
    ach_5: () => false, // Kusursuz Atış - perfect lesson'da açılır
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
