import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { useUser } from '../hooks';

const TopBar: React.FC<{ showLanguage?: boolean }> = ({ showLanguage = true }) => {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      {showLanguage && (
        <TouchableOpacity style={styles.langButton}>
          <Text style={styles.flag}>🇬🇧</Text>
        </TouchableOpacity>
      )}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statValue, { color: COLORS.accent }]}>{user?.streak ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={[styles.statValue, { color: COLORS.blue }]}>{user?.gems ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={[styles.statValue, { color: COLORS.red }]}>{user?.hearts ?? 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.swan },
  langButton: { width: 40, height: 32, borderRadius: 8, borderWidth: 2, borderColor: COLORS.swan, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.snow },
  flag: { fontSize: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 18 },
  statValue: { fontSize: 15, ...FONTS.bold },
});
