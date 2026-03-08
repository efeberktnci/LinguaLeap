import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { COLORS } from '../theme/colors';
import LessonNode from '../components/LessonNode';
import { UNITS, QUIZ_QUESTIONS } from '../data/mockData';
import { Lesson, RootStackParamList } from '../types';
import TopBar from '../components/TopBar';
import UnitHeader from '../components/UnitHeader';
import { useUser } from '../hooks';

type LearnNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const NODE_SIZE = 72;
const STEP_Y = 118;
const AREA_WIDTH = 360;

// Sağa doğru akan snake
const RIGHT_PATTERN = [144, 228, 276, 228, 144, 60, 24, 60];
// Sola doğru ayna snake
const LEFT_PATTERN = [144, 60, 24, 60, 144, 228, 276, 228];

type PositionedLesson = Lesson & {
  locked?: boolean;
  current?: boolean;
  completed?: boolean;
  x: number;
  y: number;
};

const LearnScreen: React.FC = () => {
  const navigation = useNavigation<LearnNavProp>();
  const { user } = useUser();

  const completedLessons = user?.completedLessons ?? [];

  const handleLessonPress = (lesson: Lesson) => {
    const questions =
      QUIZ_QUESTIONS[lesson.id] ?? QUIZ_QUESTIONS['lesson_3_2'];

    navigation.navigate('Lesson', { lesson, questions });
  };

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {UNITS.map((unit, unitIndex) => {
          const pattern = unitIndex % 2 === 0 ? RIGHT_PATTERN : LEFT_PATTERN;

          const positionedLessons: PositionedLesson[] = unit.lessons.map(
            (lesson, index) => {
              const prevLesson = unit.lessons[index - 1];

              let unlocked = false;

              // İlk unit'in ilk dersi her zaman açık
              if (unitIndex === 0 && index === 0) {
                unlocked = true;
              }
              // Aynı unit içinde sırayla ilerleme
              else if (index > 0) {
                unlocked = completedLessons.includes(prevLesson?.id ?? '');
              }
              // Yeni unit açılması: önceki unit'in son dersi bitmiş olmalı
              else {
                const prevUnit = UNITS[unitIndex - 1];
                const lastLessonPrevUnit =
                  prevUnit?.lessons[prevUnit.lessons.length - 1];

                unlocked = completedLessons.includes(lastLessonPrevUnit?.id ?? '');
              }

              const completed =
                completedLessons.includes(lesson.id) || !!lesson.completed;

              return {
                ...lesson,
                locked: !unlocked,
                completed,
                current: unlocked && !completed,
                x: pattern[index % pattern.length],
                y: index * STEP_Y,
              };
            }
          );

          const unitHeight =
            (positionedLessons.length - 1) * STEP_Y + NODE_SIZE + 30;

          return (
            <View key={unit.id}>
              <UnitHeader unit={unit} />

              <View style={[styles.pathArea, { height: unitHeight }]}>
                <Svg
                  width={AREA_WIDTH}
                  height={unitHeight}
                  style={StyleSheet.absoluteFill}
                >
                  {positionedLessons.map((lesson, index) => {
                    const nextLesson = positionedLessons[index + 1];
                    if (!nextLesson) return null;

                    const x1 = lesson.x + NODE_SIZE / 2;
                    const y1 = lesson.y + NODE_SIZE / 2;
                    const x2 = nextLesson.x + NODE_SIZE / 2;
                    const y2 = nextLesson.y + NODE_SIZE / 2;

                    const cx1 = x1;
                    const cy1 = y1 + 46;
                    const cx2 = x2;
                    const cy2 = y2 - 46;

                    const isLocked = !!lesson.locked || !!nextLesson.locked;

                    return (
                      <Path
                        key={`${lesson.id}-${nextLesson.id}`}
                        d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                        stroke={isLocked ? COLORS.swan : unit.color}
                        strokeWidth={8}
                        strokeLinecap="round"
                        fill="none"
                        opacity={isLocked ? 0.55 : 1}
                      />
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
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgSecondary,
  },
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
});