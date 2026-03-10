import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import AppSymbol from './AppSymbol';

interface StreakBadgeProps {
  streak: number;
  size?: 'medium' | 'large';
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, size = 'medium' }) => {
  const isLarge = size === 'large';
  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <AppSymbol symbol="🔥" size={isLarge ? 28 : 16} color={COLORS.accent} style={[styles.fire, isLarge && styles.fireLarge]} />
      <Text style={[styles.count, isLarge && styles.countLarge]}>{streak}</Text>
    </View>
  );
};

export default StreakBadge;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  containerLarge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24 },
  fire: { fontSize: 16 },
  fireLarge: { fontSize: 28 },
  count: { fontSize: 14, color: COLORS.accent, ...FONTS.bold },
  countLarge: { fontSize: 22 },
});
