import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { Lesson, LessonType } from '../types';

const ICON_MAP: Record<LessonType, keyof typeof Ionicons.glyphMap> = {
  star: 'star',
  book: 'book',
  trophy: 'trophy',
  dumbbell: 'barbell',
};

interface LessonNodeProps {
  lesson: Lesson;
  unitColor: string;
  unitShadow: string;
  onPress?: (lesson: Lesson) => void;
  index: number;
}

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, unitColor, unitShadow, onPress, index }) => {
  const isTrophy = lesson.type === 'trophy';
  const nodeSize = isTrophy ? 72 : 64;
  const iconSize = isTrophy ? 28 : 22;

  let bgColor = unitColor;
  let borderColor = unitShadow;
  let iconColor = COLORS.white;

  if (lesson.locked) {
    bgColor = COLORS.swan;
    borderColor = COLORS.borderDark;
    iconColor = COLORS.hare;
  } else if (lesson.completed && lesson.crowns >= lesson.maxCrowns) {
    bgColor = '#FFD700';
    borderColor = '#DAA520';
  }

  const offsets = [0, 30, 45, 30, 0, -30, -45, -30];
  const offsetX = offsets[index % offsets.length];

  return (
    <View style={[styles.wrapper, { marginLeft: offsetX }]}>
      <TouchableOpacity
        onPress={() => !lesson.locked && onPress?.(lesson)}
        activeOpacity={lesson.locked ? 1 : 0.7}
        disabled={lesson.locked}
      >
        <View style={[styles.shadow, { width: nodeSize, height: nodeSize, borderRadius: nodeSize / 2, backgroundColor: borderColor, top: 4 }]} />
        <View style={[styles.node, { width: nodeSize, height: nodeSize, borderRadius: nodeSize / 2, backgroundColor: bgColor }]}>
          <Ionicons name={ICON_MAP[lesson.type] ?? 'star'} size={iconSize} color={iconColor} />
          {lesson.completed && !isTrophy && (
            <View style={styles.crownRow}>
              {Array.from({ length: lesson.maxCrowns }).map((_, i) => (
                <Text key={i} style={[styles.crownDot, i < lesson.crowns && styles.crownDotActive]}>
                  {i < lesson.crowns ? '♛' : '○'}
                </Text>
              ))}
            </View>
          )}
        </View>
        {lesson.current && (
          <View style={styles.currentIndicator}>
            <View style={styles.startBadge}>
              <Text style={styles.startText}>BAŞLA</Text>
            </View>
          </View>
        )}
        {lesson.locked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={16} color={COLORS.wolf} />
          </View>
        )}
      </TouchableOpacity>
      <Text style={[styles.title, lesson.locked && styles.titleLocked]} numberOfLines={1}>
        {lesson.title}
      </Text>
    </View>
  );
};

export default LessonNode;

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 6 },
  shadow: { position: 'absolute', left: 0 },
  node: { alignItems: 'center', justifyContent: 'center' },
  crownRow: { flexDirection: 'row', position: 'absolute', bottom: -2, gap: 1 },
  crownDot: { fontSize: 7, color: COLORS.hare },
  crownDotActive: { color: '#FFD700', fontSize: 8 },
  currentIndicator: { position: 'absolute', top: -36, alignSelf: 'center', left: '50%', marginLeft: -30 },
  startBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  startText: { color: COLORS.white, fontSize: 12, ...FONTS.bold, letterSpacing: 1 },
  lockOverlay: { position: 'absolute', bottom: -2, right: -2, backgroundColor: COLORS.white, borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.swan },
  title: { marginTop: 8, fontSize: 12, color: COLORS.eel, ...FONTS.medium },
  titleLocked: { color: COLORS.hare },
});
