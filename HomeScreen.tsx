import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';
import { LANGUAGES } from '../data/mockData';
import { AppContext } from '../context/AppContext';
import { useUser } from '../hooks/useUser';
import { getGreeting } from '../utils/helpers';
import { RootStackParamList } from '../types';
import ProgressBar from '../components/ProgressBar';
import DailyQuestCard from '../components/DailyQuestCard';
import TopBar from '../components/TopBar';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

interface Props {
  navigation: HomeNavProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, dailyProgress, levelProgress, dailyGoalReached } = useUser();
  const { state } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakFire}>🔥</Text>
            <View>
              <Text style={styles.streakCount}>{user.streak} günlük seri!</Text>
              <Text style={styles.streakSub}>En uzun: {user.longestStreak} gün</Text>
            </View>
          </View>
          <View style={styles.weekDots}>
            {user.weeklyXP.map((day, index) => (
              <View key={index} style={styles.dayDot}>
                <View style={[styles.dot, day.xp > 0 ? styles.dotActive : styles.dotInactive]}>
                  {day.xp > 0 && <Ionicons name="checkmark" size={10} color={COLORS.white} />}
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Günlük Hedef</Text>
            <Text style={styles.sectionBadge}>{user.dailyXPEarned}/{user.dailyGoal} XP</Text>
          </View>
          <ProgressBar progress={dailyProgress} height={16} color={dailyGoalReached ? '#FFD700' : COLORS.blue} style={{ marginTop: 8 }} />
          {dailyGoalReached && <Text style={styles.goalComplete}>🎉 Günlük hedefe ulaştın!</Text>}
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktif Kurslar</Text>
          <View style={styles.coursesRow}>
            {LANGUAGES.filter((l) => l.progress > 0).map((lang) => (
              <TouchableOpacity key={lang.id} style={styles.courseCard}>
                <Text style={styles.courseFlag}>{lang.flag}</Text>
                <Text style={styles.courseName}>{lang.name}</Text>
                <ProgressBar progress={lang.progress} height={6} color={COLORS.primary} showShadow={false} style={{ marginTop: 8, width: '100%' }} />
                <Text style={styles.coursePercent}>{Math.round(lang.progress * 100)}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Görevler</Text>
          {state.dailyQuests.map((quest) => (
            <DailyQuestCard key={quest.id} quest={quest} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Başlat</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: COLORS.primary }]} onPress={() => navigation.navigate('HomeTabs')}>
              <Ionicons name="play" size={24} color={COLORS.white} />
              <Text style={styles.quickActionText}>Derse Devam Et</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: COLORS.blue }]}>
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
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8, ...SHADOWS.medium },
  quickActionText: { fontSize: 15, color: COLORS.white, ...FONTS.bold },
});
