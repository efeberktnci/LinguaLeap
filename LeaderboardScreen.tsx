import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';
import { LEADERBOARD, USER_PROFILE } from '../data/mockData';
import { getLeagueInfo, formatNumber } from '../utils/helpers';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState('weekly');
  const leagueInfo = getLeagueInfo(USER_PROFILE.league);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sıralama</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* League Badge */}
        <View style={styles.leagueCard}>
          <View style={styles.leagueIconContainer}>
            <Text style={styles.leagueIcon}>{leagueInfo.icon}</Text>
          </View>
          <Text style={styles.leagueName}>{USER_PROFILE.league} Ligi</Text>
          <Text style={styles.leagueSubtitle}>Top 10'da kal ve yüksel!</Text>

          <View style={styles.leagueStats}>
            <View style={styles.leagueStatItem}>
              <Text style={styles.leagueStatValue}>#{USER_PROFILE.leagueRank}</Text>
              <Text style={styles.leagueStatLabel}>Sıralama</Text>
            </View>
            <View style={styles.leagueStatDivider} />
            <View style={styles.leagueStatItem}>
              <Text style={styles.leagueStatValue}>{formatNumber(USER_PROFILE.totalXP)}</Text>
              <Text style={styles.leagueStatLabel}>Toplam XP</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['weekly', 'allTime'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'weekly' ? 'Bu Hafta' : 'Tüm Zamanlar'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          {LEADERBOARD.map((user, index) => {
            const isTop3 = index < 3;
            const isUser = user.isUser;

            return (
              <View
                key={user.id}
                style={[
                  styles.userRow,
                  isUser && styles.userRowCurrent,
                  isTop3 && styles.userRowTop3,
                ]}
              >
                {/* Rank */}
                <View style={[styles.rankContainer, isTop3 && styles.rankContainerTop3]}>
                  {isTop3 ? (
                    <Text style={styles.rankMedal}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                  ) : (
                    <Text style={[styles.rankText, isUser && styles.rankTextCurrent]}>
                      {index + 1}
                    </Text>
                  )}
                </View>

                {/* Avatar & Name */}
                <View style={styles.userInfo}>
                  <View style={[styles.userAvatar, isUser && styles.userAvatarCurrent]}>
                    <Text style={styles.userAvatarText}>{user.avatar}</Text>
                  </View>
                  <View>
                    <Text style={[styles.userName, isUser && styles.userNameCurrent]}>
                      {user.name}
                    </Text>
                    {isUser && (
                      <Text style={styles.youBadge}>Sen</Text>
                    )}
                  </View>
                </View>

                {/* XP */}
                <View style={styles.xpContainer}>
                  <Text style={[styles.xpValue, isUser && styles.xpValueCurrent]}>
                    {formatNumber(user.xp)}
                  </Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Promotion Zone Info */}
        <View style={styles.zoneInfo}>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneIndicator, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.zoneText}>Yükselme bölgesi (Top 10)</Text>
          </View>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneIndicator, { backgroundColor: COLORS.red }]} />
            <Text style={styles.zoneText}>Düşme bölgesi (Son 5)</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgSecondary,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.swan,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.owl,
    ...FONTS.bold,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  leagueCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.swan,
  },
  leagueIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.snow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  leagueIcon: {
    fontSize: 44,
  },
  leagueName: {
    fontSize: 22,
    color: COLORS.owl,
    ...FONTS.bold,
  },
  leagueSubtitle: {
    fontSize: 14,
    color: COLORS.wolf,
    ...FONTS.regular,
    marginTop: 4,
  },
  leagueStats: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 24,
    alignItems: 'center',
  },
  leagueStatItem: {
    alignItems: 'center',
  },
  leagueStatValue: {
    fontSize: 20,
    color: COLORS.owl,
    ...FONTS.bold,
  },
  leagueStatLabel: {
    fontSize: 12,
    color: COLORS.wolf,
    ...FONTS.medium,
    marginTop: 2,
  },
  leagueStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.swan,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.swan,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.wolf,
    ...FONTS.semiBold,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.swan,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.polar,
  },
  userRowCurrent: {
    backgroundColor: COLORS.primaryBg,
  },
  userRowTop3: {
    backgroundColor: '#FFFCF0',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankContainerTop3: {
    width: 32,
  },
  rankMedal: {
    fontSize: 22,
  },
  rankText: {
    fontSize: 15,
    color: COLORS.wolf,
    ...FONTS.bold,
  },
  rankTextCurrent: {
    color: COLORS.primaryDark,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.snow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarCurrent: {
    backgroundColor: COLORS.primary,
  },
  userAvatarText: {
    fontSize: 20,
  },
  userName: {
    fontSize: 15,
    color: COLORS.eel,
    ...FONTS.semiBold,
  },
  userNameCurrent: {
    color: COLORS.primaryDark,
    ...FONTS.bold,
  },
  youBadge: {
    fontSize: 11,
    color: COLORS.primary,
    ...FONTS.bold,
    marginTop: 1,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 16,
    color: COLORS.eel,
    ...FONTS.bold,
  },
  xpValueCurrent: {
    color: COLORS.primaryDark,
  },
  xpLabel: {
    fontSize: 11,
    color: COLORS.hare,
    ...FONTS.medium,
  },
  zoneInfo: {
    marginTop: 16,
    gap: 8,
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  zoneText: {
    fontSize: 13,
    color: COLORS.wolf,
    ...FONTS.regular,
  },
});
