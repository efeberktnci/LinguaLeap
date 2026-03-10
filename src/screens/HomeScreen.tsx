import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';
import { useUser, useAuth, useLanguage } from '../hooks';
import { calculateProgress } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';
import TopBar from '../components/TopBar';
import AppSymbol from '../components/AppSymbol';
import { UNITS } from '../data/mockData';

const DAILY_GOAL = 250;

type LevelCardTheme = {
  backgroundColor: string;
  borderColor: string;
  badgeColor: string;
  progressColor: string;
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useUser();
  const { refreshProfile } = useAuth();
  const { t, tx } = useLanguage();

  const getLocalizedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return tx('Iyi geceler');
    if (hour < 12) return tx('Gunaydin');
    if (hour < 18) return tx('Iyi gunler');
    return tx('Iyi aksamlar');
  };

  // Ekran her açıldığında profili yenile
  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // XP günlük hedefi geçmesin
  const cappedDailyXP = Math.min(user.dailyXPEarned, DAILY_GOAL);
  const dailyProgress = calculateProgress(cappedDailyXP, DAILY_GOAL);
  const dailyGoalReached = cappedDailyXP >= DAILY_GOAL;

  const levelProgress = calculateProgress(user.currentXP, user.xpToNextLevel);

  // Seviye görünümü: levele göre tema
  const level = user.level ?? 1;
  let levelTheme: LevelCardTheme = {
    backgroundColor: COLORS.white,
    borderColor: COLORS.swan,
    badgeColor: COLORS.secondary,
    progressColor: COLORS.secondary,
  };

  if (level < 10) {
    // Başlangıç: yeşil tonlar
    levelTheme = {
      backgroundColor: '#F1FBEA',
      borderColor: COLORS.primaryBg,
      badgeColor: COLORS.primary,
      progressColor: COLORS.primary,
    };
  } else if (level < 30) {
    // Orta: mavi tonlar
    levelTheme = {
      backgroundColor: '#E8F4FD',
      borderColor: COLORS.blueLight,
      badgeColor: COLORS.blue,
      progressColor: COLORS.blue,
    };
  } else if (level < 60) {
    // İleri: mor tonlar
    levelTheme = {
      backgroundColor: '#F5ECFF',
      borderColor: COLORS.secondary,
      badgeColor: COLORS.secondaryDark,
      progressColor: COLORS.secondaryDark,
    };
  } else {
    // Usta: kırmızı / elmas tonları
    levelTheme = {
      backgroundColor: '#FFF0F0',
      borderColor: COLORS.redLight,
      badgeColor: COLORS.red,
      progressColor: COLORS.red,
    };
  }

  // Tamamlanan ders sayısı
  const completedCount = (user.completedLessons || []).length;

  // Hatasız ünite tamamlandı mı? (bir ünitedeki tüm dersler tam taç)
  const lessonProgressMap = user.lessonProgress || {};
  const lessonDefById = new Map<string, { maxCrowns: number }>();
  UNITS.forEach((unit) => {
    unit.lessons.forEach((lesson) => {
      lessonDefById.set(lesson.id, { maxCrowns: lesson.maxCrowns });
    });
  });

  const hasPerfectUnit = UNITS.some((unit) => {
    // Bu ünitedeki tüm dersler için progress var ve taç sayısı maxCrowns'a eşit veya büyükse
    return unit.lessons.every((lesson) => {
      const progress = (lessonProgressMap as any)[lesson.id];
      if (!progress) return false;
      const def = lessonDefById.get(lesson.id);
      if (!def) return false;
      return (progress.crowns || 0) >= def.maxCrowns;
    });
  });

  // Günlük görevler - gerçek veriden hesaplama
  const quests = [
    {
      id: 'dq_1',
      title: tx('1 ders tamamla'),
      icon: '📖',
      progress: Math.min(completedCount, 1),
      target: 1,
      xpReward: 10,
      completed: completedCount >= 1,
    },
    {
      id: 'dq_2',
      title: `${DAILY_GOAL} XP ${tx('XP kazan')}`,
      icon: '⚡',
      progress: Math.min(user.dailyXPEarned, DAILY_GOAL),
      target: DAILY_GOAL,
      xpReward: 15,
      completed: user.dailyXPEarned >= DAILY_GOAL,
    },
    {
      id: 'dq_3',
      title: tx('Hatasiz unite bitir'),
      icon: '🎯',
      progress: hasPerfectUnit ? 1 : 0,
      target: 1,
      xpReward: 20,
      completed: hasPerfectUnit,
    },
  ];

  // Aktif kurslar - gerçek veriden
  const courses = (user.coursesActive || []).map((courseId: string) => {
    if (courseId === 'en_tr') {
      const totalLessons = 23; // toplam ders
      const done = (user.completedLessons || []).length;
      const progress = totalLessons > 0 ? Math.min(done / totalLessons, 1) : 0;
      return { id: 'en', name: tx('Ingilizce'), flag: '\u{1F1EC}\u{1F1E7}', progress };
    }
    return { id: courseId, name: courseId, flag: '🌍', progress: 0 };
  });

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Karsilama */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greeting}>{getLocalizedGreeting()},</Text>
            <Text style={styles.userName}>{user.name}!</Text>
            <Text style={styles.greetingSub}>{tx('Derslerine devam edelim mi?')}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <AppSymbol symbol={user.avatar} size={34} color={COLORS.blueDark} style={styles.avatar} />
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <AppSymbol symbol="🔥" size={28} color={COLORS.accent} style={styles.streakFire} />
            <View>
              <Text style={styles.streakCount}>
                {user.streak > 0 ? `${user.streak} ${tx('gunluk seri')}!` : tx('Seriyi baslat!')}
              </Text>
              <Text style={styles.streakSub}>
                {user.longestStreak > 0 ? `${tx('En uzun')}: ${user.longestStreak} ${tx('gun')}` : tx('Bugun ilk dersini tamamla')}
              </Text>
            </View>
          </View>
          <View style={styles.weekDots}>
            {(user.weeklyXP || []).map((day: any, index: number) => (
              <View key={index} style={styles.dayDot}>
                <View style={[styles.dot, day.xp > 0 ? styles.dotActive : styles.dotInactive]}>
                  {day.xp > 0 && <Ionicons name="checkmark" size={10} color={COLORS.white} />}
                </View>
                <Text style={styles.dayLabel}>{tx(day.day)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Günlük Hedef */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.dailyGoal')}</Text>
            <Text style={styles.sectionBadge}>{cappedDailyXP}/{DAILY_GOAL} XP</Text>
          </View>
          <ProgressBar progress={dailyProgress} height={16} color={dailyGoalReached ? '#FFD700' : COLORS.blue} style={{ marginTop: 8 }} />
          {dailyGoalReached && <Text style={styles.goalComplete}>{tx('Gunluk hedefe ulastin!')}</Text>}
        </View>

        {/* Seviye */}
        <View style={[styles.levelCard, { backgroundColor: levelTheme.backgroundColor, borderColor: levelTheme.borderColor }]}>
          <View style={styles.levelRow}>
            <View style={[styles.levelBadge, { backgroundColor: levelTheme.badgeColor }]}>
              <Text style={styles.levelNumber}>{user.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>{t('home.level')} {user.level}</Text>
              <ProgressBar progress={levelProgress} height={10} color={levelTheme.progressColor} style={{ marginTop: 4 }} />
              <Text style={styles.levelXP}>{user.currentXP} / {user.xpToNextLevel} XP</Text>
            </View>
          </View>
        </View>

        {/* Aktif Kurslar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.activeCourses')}</Text>
          <View style={styles.coursesRow}>
            {courses.map((course: any) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => navigation.navigate('Learn')}>
                <AppSymbol symbol={course.flag} size={24} color={COLORS.blueDark} style={styles.courseFlag} />
                <Text style={styles.courseName}>{course.name}</Text>
                <ProgressBar progress={course.progress} height={6} color={COLORS.primary} showShadow={false} style={{ marginTop: 8, width: '100%' }} />
                <Text style={styles.coursePercent}>{Math.round(course.progress * 100)}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Günlük Görevler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.dailyQuests')}</Text>
          {quests.map((quest) => {
            const questProgress = Math.min(quest.progress / quest.target, 1);
            return (
              <View key={quest.id} style={[styles.questCard, quest.completed && styles.questCardDone]}>
                <View style={styles.questIconWrap}>
                  <AppSymbol symbol={quest.icon} size={20} color={COLORS.blueDark} style={styles.questIcon} />
                </View>
                <View style={styles.questContent}>
                  <Text style={[styles.questTitle, quest.completed && styles.questTitleDone]}>{quest.title}</Text>
                  <ProgressBar progress={questProgress} height={10} color={quest.completed ? COLORS.primary : COLORS.blue} style={{ marginTop: 6 }} />
                </View>
                <View style={styles.questReward}>
                  {quest.completed ? (
                    <View style={styles.questCheck}>
                      <AppSymbol symbol="✓" size={14} color={COLORS.white} style={styles.questCheckText} />
                    </View>
                  ) : (
                    <Text style={styles.questXP}>+{quest.xpReward} XP</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Hızlı Başlat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickStart')}</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: COLORS.primary }]} onPress={() => navigation.navigate('Learn')}>
              <Ionicons name="play" size={24} color={COLORS.white} />
              <Text style={styles.quickActionText}>{t('home.continueLesson')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: COLORS.blue }]} onPress={() => navigation.navigate('Learn')}>
              <Ionicons name="refresh" size={24} color={COLORS.white} />
              <Text style={styles.quickActionText}>{t('home.review')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgSecondary },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  greetingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: COLORS.swan },
  greetingLeft: { flex: 1 },
  greeting: { fontSize: 16, color: COLORS.wolf, ...FONTS.medium },
  userName: { fontSize: 26, color: COLORS.owl, ...FONTS.bold, marginTop: 2 },
  greetingSub: { fontSize: 13, color: COLORS.hare, ...FONTS.regular, marginTop: 4 },
  avatarContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  avatar: { fontSize: 36 },
  streakCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 2, borderColor: '#FFE0B2' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  streakFire: { fontSize: 36 },
  streakCount: { fontSize: 18, color: COLORS.owl, ...FONTS.bold },
  streakSub: { fontSize: 13, color: COLORS.wolf, ...FONTS.regular, marginTop: 2 },
  weekDots: { flexDirection: 'row', justifyContent: 'space-around' },
  dayDot: { alignItems: 'center', gap: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: COLORS.accent },
  dotInactive: { backgroundColor: COLORS.swan },
  dayLabel: { fontSize: 11, color: COLORS.wolf, ...FONTS.medium },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, color: COLORS.owl, ...FONTS.bold, marginBottom: 12 },
  sectionBadge: { fontSize: 14, color: COLORS.black, ...FONTS.bold, marginBottom: 12 },
  goalComplete: { fontSize: 14, color: COLORS.primaryDark, ...FONTS.semiBold, marginTop: 8, textAlign: 'center' },
  levelCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 2, borderColor: COLORS.swan },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  levelNumber: { fontSize: 20, color: COLORS.white, ...FONTS.bold },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 16, color: COLORS.owl, ...FONTS.bold },
  levelXP: { fontSize: 12, color: COLORS.wolf, ...FONTS.regular, marginTop: 4 },
  coursesRow: { flexDirection: 'row', gap: 12 },
  courseCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: COLORS.swan },
  courseFlag: { fontSize: 32 },
  courseName: { fontSize: 14, color: COLORS.owl, ...FONTS.semiBold, marginTop: 6 },
  coursePercent: { fontSize: 12, color: COLORS.wolf, ...FONTS.medium, marginTop: 4 },
  questCard: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 2, borderColor: COLORS.swan, marginBottom: 8 },
  questCardDone: { borderColor: COLORS.primaryBg, backgroundColor: '#F8FFF0' },
  questIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  questIcon: { fontSize: 20 },
  questContent: { flex: 1 },
  questTitle: { fontSize: 14, color: COLORS.eel, ...FONTS.semiBold },
  questTitleDone: { color: COLORS.primaryDark },
  questReward: { marginLeft: 12 },
  questXP: { fontSize: 13, color: COLORS.accent, ...FONTS.bold },
  questCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  questCheckText: { color: COLORS.white, fontSize: 14, ...FONTS.bold },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8, ...SHADOWS.medium },
  quickActionText: { fontSize: 15, color: COLORS.white, ...FONTS.bold },
});





