import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';
import { useUser, useAuth } from '../hooks';
import { getGreeting, calculateProgress } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';
import TopBar from '../components/TopBar';

const DAILY_GOAL = 250;

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, uid } = useUser();
  const { refreshProfile } = useAuth();

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

  // Tamamlanan ders sayısı
  const completedCount = (user.completedLessons || []).length;

  // Günlük görevler - gerçek veriden hesaplama
  const quests = [
    {
      id: 'dq_1',
      title: '1 ders tamamla',
      icon: '📖',
      progress: Math.min(completedCount, 1),
      target: 1,
      xpReward: 10,
      completed: completedCount >= 1,
    },
    {
      id: 'dq_2',
      title: `${DAILY_GOAL} XP kazan`,
      icon: '⚡',
      progress: Math.min(user.dailyXPEarned, DAILY_GOAL),
      target: DAILY_GOAL,
      xpReward: 15,
      completed: user.dailyXPEarned >= DAILY_GOAL,
    },
    {
      id: 'dq_3',
      title: 'Hatasız ders bitir',
      icon: '🎯',
      progress: 0, // TODO: track perfect lessons
      target: 1,
      xpReward: 20,
      completed: false,
    },
  ];

  // Aktif kurslar - gerçek veriden
  const courses = (user.coursesActive || []).map((courseId: string) => {
    if (courseId === 'en_tr') {
      const totalLessons = 23; // toplam ders
      const done = (user.completedLessons || []).length;
      const progress = totalLessons > 0 ? Math.min(done / totalLessons, 1) : 0;
      return { id: 'en', name: 'İngilizce', flag: '🇬🇧', progress };
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
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user.name}! 👋</Text>
            <Text style={styles.greetingSub}>Derslerine devam edelim mi?</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user.avatar}</Text>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakFire}>🔥</Text>
            <View>
              <Text style={styles.streakCount}>
                {user.streak > 0 ? `${user.streak} günlük seri!` : 'Seriyi başlat!'}
              </Text>
              <Text style={styles.streakSub}>
                {user.longestStreak > 0 ? `En uzun: ${user.longestStreak} gün` : 'Bugün ilk dersini tamamla'}
              </Text>
            </View>
          </View>
          <View style={styles.weekDots}>
            {(user.weeklyXP || []).map((day: any, index: number) => (
              <View key={index} style={styles.dayDot}>
                <View style={[styles.dot, day.xp > 0 ? styles.dotActive : styles.dotInactive]}>
                  {day.xp > 0 && <Ionicons name="checkmark" size={10} color={COLORS.white} />}
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Günlük Hedef */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Günlük Hedef</Text>
            <Text style={styles.sectionBadge}>{cappedDailyXP}/{DAILY_GOAL} XP</Text>
          </View>
          <ProgressBar progress={dailyProgress} height={16} color={dailyGoalReached ? '#FFD700' : COLORS.blue} style={{ marginTop: 8 }} />
          {dailyGoalReached && <Text style={styles.goalComplete}>🎉 Günlük hedefe ulaştın!</Text>}
        </View>

        {/* Seviye */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{user.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Seviye {user.level}</Text>
              <ProgressBar progress={levelProgress} height={10} color={COLORS.secondary} style={{ marginTop: 4 }} />
              <Text style={styles.levelXP}>{user.currentXP} / {user.xpToNextLevel} XP</Text>
            </View>
          </View>
        </View>

        {/* Aktif Kurslar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktif Kurslar</Text>
          <View style={styles.coursesRow}>
            {courses.map((course: any) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => navigation.navigate('Learn')}>
                <Text style={styles.courseFlag}>{course.flag}</Text>
                <Text style={styles.courseName}>{course.name}</Text>
                <ProgressBar progress={course.progress} height={6} color={COLORS.primary} showShadow={false} style={{ marginTop: 8, width: '100%' }} />
                <Text style={styles.coursePercent}>{Math.round(course.progress * 100)}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Günlük Görevler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Görevler</Text>
          {quests.map((quest) => {
            const questProgress = Math.min(quest.progress / quest.target, 1);
            return (
              <View key={quest.id} style={[styles.questCard, quest.completed && styles.questCardDone]}>
                <View style={styles.questIconWrap}>
                  <Text style={styles.questIcon}>{quest.icon}</Text>
                </View>
                <View style={styles.questContent}>
                  <Text style={[styles.questTitle, quest.completed && styles.questTitleDone]}>{quest.title}</Text>
                  <ProgressBar progress={questProgress} height={10} color={quest.completed ? COLORS.primary : COLORS.blue} style={{ marginTop: 6 }} />
                </View>
                <View style={styles.questReward}>
                  {quest.completed ? (
                    <View style={styles.questCheck}>
                      <Text style={styles.questCheckText}>✓</Text>
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
          <Text style={styles.sectionTitle}>Hızlı Başlat</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: COLORS.primary }]} onPress={() => navigation.navigate('Learn')}>
              <Ionicons name="play" size={24} color={COLORS.white} />
              <Text style={styles.quickActionText}>Derse Devam Et</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: COLORS.blue }]} onPress={() => navigation.navigate('Learn')}>
              <Ionicons name="refresh" size={24} color={COLORS.white} />
              <Text style={styles.quickActionText}>Tekrar Yap</Text>
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
  sectionBadge: { fontSize: 14, color: COLORS.blue, ...FONTS.bold, marginBottom: 12 },
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
