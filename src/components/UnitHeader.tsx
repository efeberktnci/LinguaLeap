import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { Unit } from '../types';

interface UnitHeaderProps {
  unit: Unit;
}

const UnitHeader: React.FC<UnitHeaderProps> = ({ unit }) => {
  return (
    <View style={[styles.container, { backgroundColor: unit.color }]}>
      <View style={styles.glowCircleTop} />
      <View style={styles.glowCircleRight} />

      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.unitLabel}>ÜNİTE {unit.id.split('_')[1]}</Text>
          <Text style={styles.title}>{unit.title}</Text>
          <Text style={styles.description}>{unit.description}</Text>
        </View>

        <View style={styles.iconWrapOuter}>
          <View style={styles.iconWrapInner}>
            <Text style={styles.icon}>{unit.icon}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UnitHeader;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  glowCircleTop: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -35,
    left: -20,
  },
  glowCircleRight: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.10)',
    right: -30,
    top: -10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    paddingRight: 10,
  },
  unitLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    ...FONTS.medium,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    color: COLORS.white,
    ...FONTS.bold,
    marginTop: 4,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 6,
    lineHeight: 20,
  },
  iconWrapOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 34,
  },
});