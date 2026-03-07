import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { Unit } from '../types';

interface UnitHeaderProps {
  unit: Unit;
}

const UnitHeader: React.FC<UnitHeaderProps> = ({ unit }) => (
  <View style={[styles.container, { backgroundColor: unit.color }]}>
    <View style={styles.content}>
      <View style={styles.textSection}>
        <Text style={styles.unitLabel}>Ünite {unit.id.split('_')[1]}</Text>
        <Text style={styles.title}>{unit.title}</Text>
        <Text style={styles.description}>{unit.description}</Text>
      </View>
      <View style={styles.iconSection}>
        <Text style={styles.icon}>{unit.icon}</Text>
      </View>
    </View>
  </View>
);

export default UnitHeader;

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 24, marginBottom: 8, borderRadius: 16, overflow: 'hidden' },
  content: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  textSection: { flex: 1 },
  unitLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', ...FONTS.medium, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 22, color: COLORS.white, ...FONTS.bold, marginTop: 2 },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.85)', ...FONTS.regular, marginTop: 4 },
  iconSection: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  icon: { fontSize: 32 },
});
