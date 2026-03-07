import {
  doc, setDoc, getDoc, updateDoc, collection,
  query, orderBy, limit, getDocs, increment, serverTimestamp,
  onSnapshot, Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
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

export async function createUserProfile(
  uid: string,
  email: string,
  name: string,
  username: string,
): Promise<UserProfile> {
  const now = new Date().toISOString();
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
    lastActiveDate: now.split('T')[0],
    hearts: 5,
    maxHearts: 5,
    gems: 50,
    crowns: 0,
    league: 'Bronze',
    leagueRank: 0,
    createdAt: now,
    coursesActive: ['en_tr'],
    achievements: DEFAULT_ACHIEVEMENTS,
    weeklyXP: [...EMPTY_WEEK],
    dailyGoal: 50,
    dailyXPEarned: 0,
    completedLessons: [],
    lessonProgress: {},
  };

  await setDoc(doc(db, USERS, uid), profile);
  await updateLeaderboard(uid, name, '🦉', 0, 'Bronze');
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile) => void,
): Unsubscribe {
  return onSnapshot(doc(db, USERS, uid), (snap) => {
    if (snap.exists()) callback(snap.data() as UserProfile);
  });
}

export async function addXP(uid: string, amount: number): Promise<void> {
  const profile = await getUserProfile(uid);
  if (!profile) return;

  let newCurrentXP = profile.currentXP + amount;
  let newLevel = profile.level;
  let newXpToNext = profile.xpToNextLevel;

  while (newCurrentXP >= newXpToNext) {
    newCurrentXP -= newXpToNext;
    newLevel++;
    newXpToNext = Math.floor(100 * Math.pow(1.15, newLevel - 1));
  }

  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weeklyXP = [...profile.weeklyXP];
  weeklyXP[dayIndex] = { ...weeklyXP[dayIndex], xp: weeklyXP[dayIndex].xp + amount };

  const todayStr = today.toISOString().split('T')[0];
  const lastActive = profile.lastActiveDate;
  let streak = profile.streak;
  let longestStreak = profile.longestStreak;

  if (lastActive !== todayStr) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === yesterdayStr) {
      streak += 1;
    } else if (lastActive !== todayStr) {
      streak = 1;
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  const achievements = checkAchievements(profile, {
    totalXP: profile.totalXP + amount,
    streak,
    completedLessons: profile.completedLessons,
  });

  await updateDoc(doc(db, USERS, uid), {
    currentXP: newCurrentXP,
    totalXP: profile.totalXP + amount,
    level: newLevel,
    xpToNextLevel: newXpToNext,
    dailyXPEarned: profile.dailyXPEarned + amount,
    weeklyXP,
    streak,
    longestStreak,
    lastActiveDate: todayStr,
    achievements,
  });

  await updateLeaderboard(uid, profile.name, profile.avatar, profile.totalXP + amount, profile.league);
}

export async function loseHeart(uid: string): Promise<void> {
  const profile = await getUserProfile(uid);
  if (!profile || profile.hearts <= 0) return;
  await updateDoc(doc(db, USERS, uid), { hearts: profile.hearts - 1 });
}

export async function refillHearts(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  if (!profile || profile.gems < 350) return false;
  await updateDoc(doc(db, USERS, uid), {
    hearts: profile.maxHearts,
    gems: profile.gems - 350,
  });
  return true;
}

export async function spendGems(uid: string, amount: number): Promise<boolean> {
  const profile = await getUserProfile(uid);
  if (!profile || profile.gems < amount) return false;
  await updateDoc(doc(db, USERS, uid), { gems: profile.gems - amount });
  return true;
}

export async function completeLesson(
  uid: string,
  lessonId: string,
  score: number,
  totalQuestions: number,
): Promise<void> {
  const profile = await getUserProfile(uid);
  if (!profile) return;

  const completedLessons = profile.completedLessons.includes(lessonId)
    ? profile.completedLessons
    : [...profile.completedLessons, lessonId];

  const accuracy = score / totalQuestions;
  const crownsEarned = accuracy >= 1 ? 3 : accuracy >= 0.8 ? 2 : 1;

  const existing = profile.lessonProgress[lessonId];
  const progress: LessonProgress = {
    lessonId,
    crowns: Math.max(existing?.crowns ?? 0, crownsEarned),
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    attempts: (existing?.attempts ?? 0) + 1,
    lastAttempt: new Date().toISOString(),
  };

  const totalCrowns = Object.values({ ...profile.lessonProgress, [lessonId]: progress })
    .reduce((sum, p) => sum + p.crowns, 0);

  await updateDoc(doc(db, USERS, uid), {
    completedLessons,
    [`lessonProgress.${lessonId}`]: progress,
    crowns: totalCrowns,
  });
}

export async function resetDailyXP(uid: string): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { dailyXPEarned: 0 });
}

export async function updateUserAvatar(uid: string, avatar: string): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { avatar });
}

export async function updateDailyGoal(uid: string, goal: number): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { dailyGoal: goal });
}

async function updateLeaderboard(
  uid: string, name: string, avatar: string, xp: number, league: string,
): Promise<void> {
  await setDoc(doc(db, LEADERBOARD, uid), { uid, name, avatar, xp, league });
}

export async function getLeaderboard(topN: number = 20): Promise<LeaderboardEntry[]> {
  const q = query(collection(db, LEADERBOARD), orderBy('xp', 'desc'), limit(topN));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as LeaderboardEntry);
}

export function subscribeToLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void,
  topN: number = 20,
): Unsubscribe {
  const q = query(collection(db, LEADERBOARD), orderBy('xp', 'desc'), limit(topN));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as LeaderboardEntry));
  });
}

function checkAchievements(
  profile: UserProfile,
  updates: { totalXP: number; streak: number; completedLessons: string[] },
) {
  const achs = [...profile.achievements];
  const rules: Record<string, () => boolean> = {
    ach_1: () => updates.streak >= 7,
    ach_2: () => updates.streak >= 14,
    ach_3: () => updates.streak >= 30,
    ach_4: () => updates.totalXP >= 1000,
    ach_7: () => updates.completedLessons.length >= 1,
    ach_6: () => updates.completedLessons.length >= 50,
  };

  for (const ach of achs) {
    if (!ach.unlocked && rules[ach.id]?.()) {
      ach.unlocked = true;
    }
  }
  return achs;
}
