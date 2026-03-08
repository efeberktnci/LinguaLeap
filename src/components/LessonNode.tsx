import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
  starRating?: number;
  showStars?: boolean;
  lesson: Lesson & {
    locked?: boolean;
    current?: boolean;
    completed?: boolean;
  };
  unitColor: string;
  unitShadow: string;
  onPress?: (lesson: Lesson) => void;
}

const LessonNode: React.FC<LessonNodeProps> = ({
  lesson,
  unitColor,
  unitShadow,
  onPress,
  starRating = 0,
  showStars = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.18)).current;

  useEffect(() => {
    if (!lesson.current || lesson.locked) return;

    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 850,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 850,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.42,
            duration: 850,
            useNativeDriver: false,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.18,
            duration: 850,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    anim.start();

    return () => {
      anim.stop();
    };
  }, [lesson.current, lesson.locked, glowOpacity, scale]);

  const handlePress = () => {
    if (lesson.locked) return;
    onPress?.(lesson);
  };

  const isLocked = !!lesson.locked;
  const isCompleted = !!lesson.completed;

  let bgColor = unitColor;
  let shadowColor = unitShadow;
  let iconColor = COLORS.white;

  if (isLocked) {
    bgColor = COLORS.swan;
    shadowColor = COLORS.borderDark;
    iconColor = COLORS.hare;
  } else if (isCompleted) {
    bgColor = unitColor;
    shadowColor = unitShadow;
    iconColor = COLORS.white;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={isLocked ? 1 : 0.82}
        disabled={isLocked}
      >
        {!isLocked && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              {
                backgroundColor: unitColor,
                opacity: glowOpacity,
              },
            ]}
          />
        )}

        <View
          style={[
            styles.shadow,
            {
              backgroundColor: shadowColor,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.node,
            {
              backgroundColor: bgColor,
              transform: [{ scale }],
            },
          ]}
        >
          <Ionicons
            name={ICON_MAP[lesson.type] ?? 'star'}
            size={28}
            color={iconColor}
          />
        </Animated.View>

        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={16} color={COLORS.wolf} />
          </View>
        )}

        {isCompleted && !isLocked && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark" size={14} color={COLORS.white} />
          </View>
        )}
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          isLocked && styles.titleLocked,
        ]}
        numberOfLines={1}
      >
        {lesson.title}
      </Text>

      {showStars && !isLocked && (
        <View style={styles.starRow}>
          {[1, 2, 3].map((slot) => {
            const fill = Math.max(0, Math.min(1, starRating - (slot - 1)));
            const iconName = fill >= 0.99 ? 'star' : fill >= 0.49 ? 'star-half' : 'star-outline';
            return (
              <Ionicons
                key={slot}
                name={iconName as any}
                size={14}
                color={fill > 0 ? '#FFC800' : COLORS.borderDark}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default LessonNode;

const styles = StyleSheet.create({
  wrapper: {
    width: 72,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    left: -9,
    top: -9,
  },
  shadow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    top: 5,
  },
  node: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.swan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    position: 'absolute',
    left: -3,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.eel,
    textAlign: 'center',
    ...FONTS.medium,
  },
  titleLocked: {
    color: COLORS.hare,
  },
  starRow: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 2,
  },
});
