import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, UI } from '../theme/colors';
import { Unit } from '../types';
import AppSymbol from './AppSymbol';

interface UnitHeaderProps {
  unit: Unit;
}

const UnitHeader: React.FC<UnitHeaderProps> = ({ unit }) => {
  return (
    <View style={[styles.container, { backgroundColor: unit.color }]}>
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
    marginTop: 8,
    marginBottom: 10,
    borderRadius: UI.radius.lg,
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
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
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: UI.radius.pill,
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
    backgroundColor: 'rgba(255,255,255,0.10)',
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
