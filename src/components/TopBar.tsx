import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { useUser } from '../hooks';

const TopBar: React.FC<{ showLanguage?: boolean }> = ({ showLanguage = true }) => {
  const { user } = useUser();

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        {showLanguage && (
          <TouchableOpacity style={styles.langButton} activeOpacity={0.85}>
            <Text style={styles.flag}>🇬🇧</Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statPill} activeOpacity={0.85}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={[styles.statValue, { color: COLORS.accent }]}>
              {user?.streak ?? 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statPill} activeOpacity={0.85}>
            <Text style={styles.statIcon}>💎</Text>
            <Text style={[styles.statValue, { color: COLORS.blue }]}>
              {user?.gems ?? 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statPill} activeOpacity={0.85}>
            <Text style={[styles.statIcon]}>❤️</Text>
            <Text style={[styles.statValue, { color: COLORS.red }]}>
              {user?.hearts ?? 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  outer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
  },
  langButton: {
    width: 48,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.swan,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  flag: {
    fontSize: 22,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statPill: {
    minWidth: 72,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.snow,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 16,
    ...FONTS.bold,
  },
});