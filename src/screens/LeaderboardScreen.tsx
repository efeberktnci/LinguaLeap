import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { useUser, useAuth, useLanguage } from '../hooks';
import { getLeagueInfo, formatNumber } from '../utils/helpers';
import { LeaderboardEntry } from '../types';
import * as firestoreService from '../services/firestore';

const LeaderboardScreen: React.FC = () => {
  const { user, uid } = useUser();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, tx } = useLanguage();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      if (authUser?.idToken) {
        const data = await firestoreService.getLeaderboard(authUser.idToken, 20);
        setEntries(data);
      }
    } catch (err) {
      // Leaderboard yuklenemediyse bos kalsin
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const leagueInfo = getLeagueInfo(user.league);
  const userRank = entries.findIndex((e) => e.uid === user.uid) + 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('leaderboard.title')}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Lig Karti */}
        <View style={styles.leagueCard}>
          <View style={styles.leagueIconContainer}>
            <Text style={styles.leagueIcon}>{leagueInfo.icon}</Text>
          </View>
          <Text style={styles.leagueName}>{user.league} {tx('Lig')}</Text>
          <Text style={styles.leagueSubtitle}>
            {entries.length > 0 ? tx('Top 10da kal ve yuksel!') : tx('Ders tamamlayarak siralamaya gir!')}
          </Text>
          <View style={styles.leagueStats}>
            <View style={styles.leagueStatItem}>
              <Text style={styles.leagueStatValue}>{userRank > 0 ? `#${userRank}` : '-'}</Text>
              <Text style={styles.leagueStatLabel}>{tx('Siralama')}</Text>
            </View>
            <View style={styles.leagueStatDivider} />
            <View style={styles.leagueStatItem}>
              <Text style={styles.leagueStatValue}>{formatNumber(user.totalXP)}</Text>
              <Text style={styles.leagueStatLabel}>{tx('Toplam XP')}</Text>
            </View>
          </View>
        </View>

        {/* Tablar */}
        <View style={styles.tabContainer}>
          {['weekly', 'allTime'].map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'weekly' ? t('leaderboard.thisWeek') : t('leaderboard.allTime')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Liste */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{tx('Siralama yukleniyor...')}</Text>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyTitle}>{tx('Henuz Siralama Yok')}</Text>
            <Text style={styles.emptyDesc}>{tx('Ders tamamlayarak siralamada yerini al!')}</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {entries.map((entry, index) => {
              const isTop3 = index < 3;
              const isCurrentUser = entry.uid === user.uid;

              return (
                <View key={entry.uid || index} style={[styles.userRow, isCurrentUser && styles.userRowCurrent, isTop3 && styles.userRowTop3]}>
                  <View style={styles.rankContainer}>
                    {isTop3 ? (
                      <Text style={styles.rankMedal}>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Text>
                    ) : (
                      <Text style={[styles.rankText, isCurrentUser && styles.rankTextCurrent]}>{index + 1}</Text>
                    )}
                  </View>
                  <View style={styles.userInfo}>
                    <View style={[styles.userAvatar, isCurrentUser && styles.userAvatarCurrent]}>
                      <Text style={styles.userAvatarText}>{entry.avatar}</Text>
                    </View>
                    <View>
                      <Text style={[styles.userName, isCurrentUser && styles.userNameCurrent]}>{entry.name}</Text>
                      {isCurrentUser && <Text style={styles.youBadge}>{tx('Sen')}</Text>}
                    </View>
                  </View>
                  <View style={styles.xpContainer}>
                    <Text style={[styles.xpValue, isCurrentUser && styles.xpValueCurrent]}>{formatNumber(entry.xp)}</Text>
                    <Text style={styles.xpLabel}>XP</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {entries.length > 0 && (
          <View style={styles.zoneInfo}>
            <View style={styles.zoneItem}>
              <View style={[styles.zoneIndicator, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.zoneText}>{tx('Yukselme bolgesi (Top 10)')}</Text>
            </View>
            <View style={styles.zoneItem}>
              <View style={[styles.zoneIndicator, { backgroundColor: COLORS.red }]} />
              <Text style={styles.zoneText}>{tx('Dusme bolgesi (Son 5)')}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgSecondary },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.swan, alignItems: 'center' },
  headerTitle: { fontSize: 20, color: COLORS.owl, ...FONTS.bold },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  leagueCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: COLORS.swan },
  leagueIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  leagueIcon: { fontSize: 44 },
  leagueName: { fontSize: 22, color: COLORS.owl, ...FONTS.bold },
  leagueSubtitle: { fontSize: 14, color: COLORS.wolf, marginTop: 4, textAlign: 'center' },
  leagueStats: { flexDirection: 'row', marginTop: 20, gap: 24, alignItems: 'center' },
  leagueStatItem: { alignItems: 'center' },
  leagueStatValue: { fontSize: 20, color: COLORS.owl, ...FONTS.bold },
  leagueStatLabel: { fontSize: 12, color: COLORS.wolf, ...FONTS.medium, marginTop: 2 },
  leagueStatDivider: { width: 1, height: 32, backgroundColor: COLORS.swan },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 14, padding: 4, marginBottom: 16, borderWidth: 2, borderColor: COLORS.swan },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, color: COLORS.wolf, ...FONTS.semiBold },
  tabTextActive: { color: COLORS.white },
  loadingContainer: { alignItems: 'center', padding: 40 },
  loadingText: { fontSize: 14, color: COLORS.wolf, marginTop: 12 },
  emptyContainer: { alignItems: 'center', padding: 40, backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 2, borderColor: COLORS.swan },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, color: COLORS.owl, ...FONTS.bold },
  emptyDesc: { fontSize: 14, color: COLORS.wolf, marginTop: 8, textAlign: 'center' },
  listContainer: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.swan },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.polar },
  userRowCurrent: { backgroundColor: COLORS.primaryBg },
  userRowTop3: { backgroundColor: '#FFFCF0' },
  rankContainer: { width: 32, alignItems: 'center' },
  rankMedal: { fontSize: 22 },
  rankText: { fontSize: 15, color: COLORS.wolf, ...FONTS.bold },
  rankTextCurrent: { color: COLORS.primaryDark },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 10 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center' },
  userAvatarCurrent: { backgroundColor: COLORS.primary },
  userAvatarText: { fontSize: 20 },
  userName: { fontSize: 15, color: COLORS.eel, ...FONTS.semiBold },
  userNameCurrent: { color: COLORS.primaryDark, ...FONTS.bold },
  youBadge: { fontSize: 11, color: COLORS.primary, ...FONTS.bold, marginTop: 1 },
  xpContainer: { alignItems: 'flex-end' },
  xpValue: { fontSize: 16, color: COLORS.eel, ...FONTS.bold },
  xpValueCurrent: { color: COLORS.primaryDark },
  xpLabel: { fontSize: 11, color: COLORS.hare, ...FONTS.medium },
  zoneInfo: { marginTop: 16, gap: 8 },
  zoneItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  zoneIndicator: { width: 12, height: 12, borderRadius: 6 },
  zoneText: { fontSize: 13, color: COLORS.wolf },
});






