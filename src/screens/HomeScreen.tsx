import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import { useUser, useAuth, useLanguage } from '../hooks';
import { calculateProgress } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';
import TopBar from '../components/TopBar';
import AppSymbol from '../components/AppSymbol';
import { UNITS } from '../data/mockData';
import { BATTLE_PASS_PRICE_LABEL, getBattlePassRewardPreview } from '../data/learningContent';

const DAILY_GOAL = 250;

type LevelCardTheme = {
  backgroundColor: string;
  borderColor: string;
  badgeColor: string;
  progressColor: string;
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, claimRewardChest } = useUser();
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
  const battlePass = user.battlePass;
  const nextBattlePassReward = getBattlePassRewardPreview(battlePass.level);
  const battlePassProgress = ((battlePass.xp % 120) || 0) / 120;
  const unclaimedChest = (user.rewardChests || []).find((chest: any) => !chest.claimed);

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
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroTag}>
              <AppSymbol symbol="🌟" size={14} color={COLORS.primaryDark} style={styles.heroTagIcon} />
              <Text style={styles.heroTagText}>{tx('Bugun odakta kal')}</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{cappedDailyXP}/{DAILY_GOAL} XP</Text>
            </View>
          </View>
          <View style={styles.greetingLeft}>
            <Text style={styles.greeting}>{getLocalizedGreeting()},</Text>
            <Text style={styles.userName}>{user.name}!</Text>
            <Text style={styles.greetingSub}>{tx('Derslerine devam edelim mi?')}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <AppSymbol symbol={user.avatar} size={34} color={COLORS.blueDark} style={styles.avatar} />
          </View>
          <View style={styles.heroStatsRow}>
            <View style={[styles.heroStatCard, styles.heroStatCardPrimary]}>
              <Text style={styles.heroStatValue}>{completedCount}</Text>
              <Text style={styles.heroStatLabel}>{tx('Tamamlanan')}</Text>
            </View>
            <View style={[styles.heroStatCard, styles.heroStatCardCool]}>
              <Text style={styles.heroStatValue}>{user.streak}</Text>
              <Text style={styles.heroStatLabel}>{tx('Seri')}</Text>
            </View>
            <View style={[styles.heroStatCard, styles.heroStatCardWarm]}>
              <Text style={styles.heroStatValue}>{user.level}</Text>
              <Text style={styles.heroStatLabel}>{t('home.level')}</Text>
            </View>
          </View>
        </View>

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
                  {day.xp > 0 && <AppSymbol symbol="✓" size={10} color={COLORS.white} style={styles.dayCheckIcon} />}
                </View>
                <Text style={styles.dayLabel}>{tx(day.day)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.dailyGoal')}</Text>
            <Text style={styles.sectionBadge}>{cappedDailyXP}/{DAILY_GOAL} XP</Text>
          </View>
          <ProgressBar progress={dailyProgress} height={16} color={dailyGoalReached ? '#FFD700' : COLORS.blue} style={{ marginTop: 8 }} />
          {dailyGoalReached && <Text style={styles.goalComplete}>{tx('Gunluk hedefe ulastin!')}</Text>}
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tx('Battle Pass')}</Text>
          <View style={styles.battlePassCard}>
            <View style={styles.battlePassHeader}>
              <View>
                <Text style={styles.battlePassTitle}>{tx(battlePass.seasonName)}</Text>
                <Text style={styles.battlePassSub}>{tx('Seviye')} {battlePass.level} • {tx('Sonraki odul')}: {nextBattlePassReward.title}</Text>
              </View>
              <View style={styles.battlePassBadge}>
                <AppSymbol symbol={nextBattlePassReward.icon} size={18} color={COLORS.blueDark} />
                <Text style={styles.battlePassBadgeText}>+{nextBattlePassReward.gems}</Text>
              </View>
            </View>
            <ProgressBar progress={battlePassProgress} height={12} color={COLORS.blue} style={{ marginTop: 12 }} />
            <Text style={styles.battlePassPriceText}>{BATTLE_PASS_PRICE_LABEL}</Text>
            <TouchableOpacity style={styles.battlePassButton} onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.battlePassButtonText}>{tx("SHOP'TA BATTLE PASS'I AC")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {unclaimedChest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tx('Seviye Kutusu')}</Text>
            <View style={styles.chestCard}>
              <View style={styles.chestIconWrap}>
                <AppSymbol symbol={unclaimedChest.icon} size={26} color={COLORS.accentDark} />
              </View>
              <View style={styles.chestInfo}>
                <Text style={styles.chestTitle}>{unclaimedChest.title}</Text>
                <Text style={styles.chestSubtitle}>+{unclaimedChest.gems} gem • +{unclaimedChest.hearts} can • {unclaimedChest.xpBoostMinutes} dk boost</Text>
              </View>
              <TouchableOpacity style={styles.chestButton} onPress={() => claimRewardChest?.(unclaimedChest.id)}>
                <Text style={styles.chestButtonText}>{tx('AC')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  container: { flex: 1, backgroundColor: COLORS.bgCanvas },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 28 },
  heroCard: { overflow: 'hidden', backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.lg, padding: 20, marginBottom: 18, borderWidth: 1, borderColor: COLORS.mintLine, ...SHADOWS.medium },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: COLORS.primarySoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: UI.radius.pill },
  heroTagIcon: { fontSize: 14 },
  heroTagText: { fontSize: 12, color: COLORS.primaryDark, ...FONTS.bold },
  heroBadge: { backgroundColor: COLORS.bgPanelAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: UI.radius.pill, borderWidth: 1, borderColor: COLORS.skyLine },
  heroBadgeText: { fontSize: 12, color: COLORS.blueDark, ...FONTS.bold },
  greetingLeft: { flex: 1 },
  greeting: { fontSize: 16, color: COLORS.inkSoft, ...FONTS.medium },
  userName: { fontSize: 30, color: COLORS.ink, ...FONTS.bold, marginTop: 2 },
  greetingSub: { fontSize: 14, color: COLORS.inkSoft, ...FONTS.regular, marginTop: 6, maxWidth: '80%' },
  avatarContainer: { position: 'absolute', right: 20, top: 62, width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.mintLine },
  avatar: { fontSize: 36 },
  heroStatsRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  heroStatCard: { flex: 1, borderRadius: UI.radius.md, paddingVertical: 14, paddingHorizontal: 12, borderWidth: 1 },
  heroStatCardPrimary: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.mintLine },
  heroStatCardCool: { backgroundColor: COLORS.bgPanelAlt, borderColor: COLORS.skyLine },
  heroStatCardWarm: { backgroundColor: COLORS.accentSoft, borderColor: '#F4D6A2' },
  heroStatValue: { fontSize: 20, color: COLORS.ink, ...FONTS.bold },
  heroStatLabel: { fontSize: 12, color: COLORS.inkSoft, ...FONTS.medium, marginTop: 4 },
  streakCard: { backgroundColor: UI.card.warm.backgroundColor, borderRadius: UI.radius.lg, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: UI.card.warm.borderColor },
  streakLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  streakFire: { fontSize: 36 },
  streakCount: { fontSize: 22, color: COLORS.ink, ...FONTS.bold },
  streakSub: { fontSize: 13, color: COLORS.inkSoft, ...FONTS.regular, marginTop: 2 },
  weekDots: { flexDirection: 'row', justifyContent: 'space-around' },
  dayDot: { alignItems: 'center', gap: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: COLORS.accent },
  dotInactive: { backgroundColor: '#E6E2DB' },
  dayCheckIcon: { fontSize: 10 },
  dayLabel: { fontSize: 11, color: COLORS.inkSoft, ...FONTS.medium },
  section: { marginBottom: 22 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, color: COLORS.ink, ...FONTS.bold, marginBottom: 12 },
  sectionBadge: { fontSize: 14, color: COLORS.ink, ...FONTS.bold, marginBottom: 12 },
  goalComplete: { fontSize: 14, color: COLORS.primaryDark, ...FONTS.semiBold, marginTop: 8, textAlign: 'center' },
  levelCard: { backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.md, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: COLORS.mintLine },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelBadge: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  levelNumber: { fontSize: 20, color: COLORS.white, ...FONTS.bold },
  levelInfo: { flex: 1, gap: 2 },
  levelTitle: { fontSize: 16, color: COLORS.ink, ...FONTS.bold },
  levelXP: { fontSize: 12, color: COLORS.inkSoft, ...FONTS.regular, marginTop: 4 },
  coursesRow: { flexDirection: 'row', gap: 12 },
  courseCard: { flex: 1, backgroundColor: COLORS.bgPanelAlt, borderRadius: UI.radius.md, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: COLORS.skyLine },
  courseFlag: { fontSize: 28, color: COLORS.blueDark, ...FONTS.bold },
  courseName: { fontSize: 14, color: COLORS.ink, ...FONTS.semiBold, marginTop: 6 },
  coursePercent: { fontSize: 12, color: COLORS.inkSoft, ...FONTS.medium, marginTop: 4 },
  questCard: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.md, borderWidth: 1, borderColor: COLORS.mintLine, marginBottom: 10 },
  questCardDone: { borderColor: COLORS.mintLine, backgroundColor: COLORS.primarySoft },
  questIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.bgCanvas, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  questIcon: { fontSize: 20 },
  questContent: { flex: 1 },
  questTitle: { fontSize: 14, color: COLORS.ink, ...FONTS.semiBold },
  questTitleDone: { color: COLORS.primaryDark },
  questReward: { marginLeft: 12 },
  questXP: { fontSize: 13, color: COLORS.accent, ...FONTS.bold },
  questCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  questCheckText: { color: COLORS.white, fontSize: 14, ...FONTS.bold },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: UI.radius.md, gap: 8, ...SHADOWS.medium },
  quickActionText: { fontSize: 15, color: COLORS.white, ...FONTS.bold },
  battlePassCard: { backgroundColor: '#12273A', borderRadius: UI.radius.lg, padding: 18, ...SHADOWS.medium },
  battlePassHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  battlePassTitle: { fontSize: 18, color: COLORS.white, ...FONTS.bold },
  battlePassSub: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 6, maxWidth: 220 },
  battlePassBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderRadius: UI.radius.pill, paddingHorizontal: 10, paddingVertical: 8 },
  battlePassBadgeText: { fontSize: 12, color: COLORS.blueDark, ...FONTS.bold },
  battlePassPriceText: { marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.72)', ...FONTS.semiBold },
  battlePassButton: { marginTop: 14, backgroundColor: COLORS.accent, borderRadius: UI.radius.md, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.accentDark },
  battlePassButtonText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  chestCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.accentSoft, borderRadius: UI.radius.md, padding: 16, borderWidth: 1, borderColor: '#F4D6A2' },
  chestIconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFE2B6', alignItems: 'center', justifyContent: 'center' },
  chestInfo: { flex: 1 },
  chestTitle: { fontSize: 15, color: COLORS.ink, ...FONTS.bold },
  chestSubtitle: { fontSize: 12, color: COLORS.inkSoft, marginTop: 4, lineHeight: 18 },
  chestButton: { backgroundColor: COLORS.accentDark, borderRadius: UI.radius.md, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: '#A86200' },
  chestButtonText: { fontSize: 12, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
});
