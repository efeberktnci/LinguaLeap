import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Modal, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { COLORS, FONTS } from '../theme/colors';
import LessonNode from '../components/LessonNode';
import { RootStackParamList } from '../types';
import TopBar from '../components/TopBar';
import UnitHeader from '../components/UnitHeader';
import { useLanguage, useUser } from '../hooks';
import {
  getLessonQuestions,
  getUnitsForTargetLanguage,
  LEARN_LANGUAGE_OPTIONS,
  LearnTargetLanguage,
} from '../data/learningContent';

type LearnNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const NODE_SIZE = 72;
const STEP_Y = 118;
const AREA_WIDTH = Math.min(Dimensions.get('window').width - 20, 380);
const CENTER = Math.floor((AREA_WIDTH - NODE_SIZE) / 2);

type PositionedLesson = {
  id: string;
  type: 'star' | 'book' | 'trophy' | 'dumbbell';
  title: string;
  completed: boolean;
  crowns: number;
  maxCrowns: number;
  xpReward: number;
  starRating: number;
  showStars: boolean;
  locked?: boolean;
  current?: boolean;
  x: number;
  y: number;
};

const clampX = (x: number) => Math.max(12, Math.min(x, AREA_WIDTH - NODE_SIZE - 12));

const seeded = (unitIndex: number, n: number) => {
  let value = (unitIndex + 3) * 197 + (n + 11) * 131;
  value ^= value << 13;
  value ^= value >> 17;
  value ^= value << 5;
  return Math.abs(value);
};

const buildPattern = (unitIndex: number, lessonCount: number, startX: number): number[] => {
  const xs: number[] = [];
  const startJitter = (seeded(unitIndex, 0) % 10) - 5;
  xs.push(clampX(startX + startJitter));

  for (let i = 1; i < lessonCount; i += 1) {
    const prev = xs[i - 1];
    const amplitude = 56 + (seeded(unitIndex, i) % 42);
    const direction = (i + unitIndex) % 2 === 0 ? 1 : -1;
    const drift = (seeded(unitIndex, i + 19) % 26) - 13;
    const candidate = prev + direction * amplitude + drift;
    xs.push(clampX(candidate));
  }

  return xs;
};

const LearnScreen: React.FC = () => {
  const navigation = useNavigation<LearnNavProp>();
  const { user } = useUser();
  const { language, tx } = useLanguage();

  const [targetLanguage, setTargetLanguage] = useState<LearnTargetLanguage | null>(null);
  const [pickerVisible, setPickerVisible] = useState(true);

  const completedLessons = user?.completedLessons ?? [];

  const units = useMemo(
    () => getUnitsForTargetLanguage((language as LearnTargetLanguage) ?? 'en'),
    [language]
  );

  const targetOption = LEARN_LANGUAGE_OPTIONS.find((opt) => opt.code === targetLanguage);

  const handleLessonPress = (lesson: any) => {
    if (!targetLanguage) return;

    const questions = getLessonQuestions(lesson, language, targetLanguage);
    navigation.navigate('Lesson', { lesson, questions });
  };

  return (
    <View style={styles.container}>
      <TopBar />

      <View style={styles.targetBar}>
        <Text style={styles.targetTitle}>{tx('Ogrenilecek Dil')}</Text>
        <TouchableOpacity style={styles.targetChip} onPress={() => setPickerVisible(true)}>
          <Text style={styles.targetChipFlag}>{targetOption?.flag ?? '\u{1F1EC}\u{1F1E7}'}</Text>
          <Text style={styles.targetChipText}>{targetOption?.label ?? 'English'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {(() => {
          let carryStartX = CENTER;

          return units.map((unit, unitIndex) => {
            const pattern = buildPattern(unitIndex, unit.lessons.length, carryStartX);

            const positionedLessons: PositionedLesson[] = unit.lessons.map((lesson, index) => {
              const prevLesson = unit.lessons[index - 1];
              let unlocked = false;

              if (unitIndex === 0 && index === 0) {
                unlocked = true;
              } else if (index > 0) {
                unlocked = completedLessons.includes(prevLesson?.id ?? '');
              } else {
                const prevUnit = units[unitIndex - 1];
                const lastLessonPrevUnit = prevUnit?.lessons[prevUnit.lessons.length - 1];
                unlocked = completedLessons.includes(lastLessonPrevUnit?.id ?? '');
              }

              const completed = completedLessons.includes(lesson.id);
              const crownsDone = Math.max(0, user?.lessonProgress?.[lesson.id]?.crowns ?? 0);
              const maxCrowns = Math.max(lesson.maxCrowns || 1, 1);
              const ratio = Math.max(0, Math.min(1, crownsDone / maxCrowns));
              const starRating = Math.round(ratio * 6) / 2;

              return {
                ...lesson,
                locked: !unlocked,
                completed,
                current: unlocked && !completed,
                starRating,
                showStars: unlocked,
                x: pattern[index % pattern.length],
                y: index * STEP_Y,
              };
            });

            const unitHeight = (positionedLessons.length - 1) * STEP_Y + NODE_SIZE + 30;
            carryStartX = pattern[pattern.length - 1];

            return (
              <View key={unit.id}>
                <UnitHeader unit={unit} />

                <View style={[styles.pathArea, { height: unitHeight }]}>
                  <Svg width={AREA_WIDTH} height={unitHeight} style={StyleSheet.absoluteFill}>
                    {positionedLessons.map((lesson, index) => {
                      const nextLesson = positionedLessons[index + 1];
                      if (!nextLesson) return null;

                      const x1 = lesson.x + NODE_SIZE / 2;
                      const y1 = lesson.y + NODE_SIZE / 2;
                      const x2 = nextLesson.x + NODE_SIZE / 2;
                      const y2 = nextLesson.y + NODE_SIZE / 2;

                      const wave = unitIndex % 2 === 0 ? 54 : 40;
                      const cx1 = x1 + (index % 2 === 0 ? 8 : -8);
                      const cy1 = y1 + wave;
                      const cx2 = x2 + (index % 2 === 0 ? -8 : 8);
                      const cy2 = y2 - wave;

                      const isLocked = !!lesson.locked || !!nextLesson.locked;

                      return (
                        <React.Fragment key={`${lesson.id}-${nextLesson.id}`}>
                          <Path
                            d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                            stroke={'rgba(255,255,255,0.45)'}
                            strokeWidth={12}
                            strokeLinecap="round"
                            fill="none"
                            opacity={isLocked ? 0.25 : 0.6}
                          />
                          <Path
                            d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                            stroke={isLocked ? COLORS.swan : unit.color}
                            strokeWidth={8}
                            strokeLinecap="round"
                            fill="none"
                            opacity={isLocked ? 0.65 : 1}
                          />
                        </React.Fragment>
                      );
                    })}
                  </Svg>

                  {positionedLessons.map((lesson) => (
                    <View
                      key={lesson.id}
                      style={[
                        styles.nodeAbsolute,
                        {
                          left: lesson.x,
                          top: lesson.y,
                        },
                      ]}
                    >
                      <LessonNode
                        lesson={lesson}
                        unitColor={unit.color}
                        unitShadow={unit.shadowColor}
                        onPress={handleLessonPress}
                        starRating={lesson.starRating}
                        showStars={lesson.showStars}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          });
        })()}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{tx('Hangi dili ogrenmek istiyorsun?')}</Text>
            <Text style={styles.modalSubtitle}>{tx('Secimden sonra tum unite ve sorular buna gore gelir.')}</Text>

            {LEARN_LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[styles.optionRow, targetLanguage === option.code && styles.optionRowActive]}
                onPress={() => {
                  setTargetLanguage(option.code);
                  setPickerVisible(false);
                }}
              >
                <Text style={styles.optionFlag}>{option.flag}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {targetLanguage === option.code && <Text style={styles.optionCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgSecondary,
  },
  targetBar: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.swan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetTitle: {
    fontSize: 13,
    color: COLORS.wolf,
    ...FONTS.medium,
  },
  targetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.snow,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.swan,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  targetChipFlag: { fontSize: 16 },
  targetChipText: { fontSize: 13, color: COLORS.eel, ...FONTS.semiBold },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pathArea: {
    width: AREA_WIDTH,
    alignSelf: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 28,
  },
  nodeAbsolute: {
    position: 'absolute',
    width: NODE_SIZE,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.swan,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.owl,
    ...FONTS.bold,
  },
  modalSubtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: COLORS.wolf,
    ...FONTS.regular,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.swan,
    marginTop: 8,
  },
  optionRowActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  optionFlag: { fontSize: 20 },
  optionLabel: { flex: 1, fontSize: 15, color: COLORS.eel, ...FONTS.semiBold },
  optionCheck: { fontSize: 16, color: COLORS.primaryDark, ...FONTS.bold },
});
