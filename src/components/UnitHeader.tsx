import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS } from '../theme/colors';
import { Unit } from '../types';
import AppSymbol from './AppSymbol';

interface UnitHeaderProps {
  unit: Unit;
}

const UnitHeader: React.FC<UnitHeaderProps> = ({ unit }) => {
  return (
    <View style={[styles.container, { backgroundColor: unit.color }]}>
      <View style={styles.glowCircleTop} />
      <View style={styles.glowCircleRight} />

      <Svg style={styles.pattern} width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
        <Path
          d="M0 112 L36 96 L62 118 L95 90 L130 120 L170 86 L205 112 L240 84 L280 112 L320 88"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M0 132 L30 118 L58 136 L94 114 L128 138 L166 108 L202 134 L238 106 L280 132 L320 114"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.unitLabel}>UNITE {unit.id.split('_')[1]}</Text>
          <Text style={styles.title}>{unit.title}</Text>
          <Text style={styles.description}>{unit.description}</Text>
        </View>

        <View style={styles.iconWrapOuter}>
          <View style={styles.iconWrapInner}>
            <AppSymbol symbol={unit.icon} size={34} color={COLORS.white} style={styles.icon} />
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
  pattern: {
    ...StyleSheet.absoluteFillObject,
  },
  glowCircleTop: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.14)',
    top: -45,
    left: -30,
  },
  glowCircleRight: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.12)',
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
    color: 'rgba(255,255,255,0.9)',
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
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  icon: {
    fontSize: 34,
  },
});
