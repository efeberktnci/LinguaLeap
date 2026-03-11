import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Modal, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import LessonNode from '../components/LessonNode';
import { AssessmentTier, CefrLevel, LearnMode, RootStackParamList } from '../types';
import TopBar from '../components/TopBar';
import UnitHeader from '../components/UnitHeader';
import AppSymbol from '../components/AppSymbol';
import { useLanguage, useUser } from '../hooks';
import {
  getAssessmentLabel,
  getCefrLevelFromTier,
  getChallengeQuestions,
  getLearnModeCards,
  getLessonQuestions,
  getPlacementAssessmentQuestions,
  getTierFromCefrLevel,
  getUnlockedCefrLevels,
  getUnitsForTargetLanguage,
  CEFR_LEVELS,
  LEARN_LANGUAGE_OPTIONS,
  LearnModeCard,
  LearnTargetLanguage,
} from '../data/learningContent';

type LearnNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const NODE_SIZE = 72;
const STEP_Y = 118;
const AREA_WIDTH = Math.min(Dimensions.get('window').width - 20, 380);
const CENTER = Math.floor((AREA_WIDTH - NODE_SIZE) / 2);
const MODES: LearnMode[] = ['standard', 'timed', 'review', 'boss'];

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
  const { user, setActiveLearnMode, setLearnLevel, setLearnTargetLanguage } = useUser();
  const { language, tx } = useLanguage();
  const defaultTargetLanguage: LearnTargetLanguage = language === 'en' ? 'tr' : 'en';

  const [targetLanguage, setTargetLanguage] = useState<LearnTargetLanguage>((user?.learnPreferences?.learnTargetLanguage as LearnTargetLanguage) ?? defaultTargetLanguage);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeMode, setMode] = useState<LearnMode>((user?.learnPreferences?.activeMode as LearnMode) ?? 'standard');
  const [showPlacementPrompt, setShowPlacementPrompt] = useState(false);
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel>((user?.learnPreferences?.cefrLevel as CefrLevel) ?? 'A0');

  useEffect(() => {
    setMode((user?.learnPreferences?.activeMode as LearnMode) ?? 'standard');
  }, [user?.learnPreferences?.activeMode]);

  useEffect(() => {
    setSelectedCefr((user?.learnPreferences?.cefrLevel as CefrLevel) ?? 'A0');
    setShowPlacementPrompt(Boolean(user && !user.learnPreferences?.placementPromptSeen && !user.placement?.completed));
    setTargetLanguage((user?.learnPreferences?.learnTargetLanguage as LearnTargetLanguage) ?? defaultTargetLanguage);
  }, [defaultTargetLanguage, user]);

  const placementTier: AssessmentTier = getTierFromCefrLevel(selectedCefr);
  const placementCompleted = user?.placement?.completed ?? false;
  const recentQuestionIds = user?.learnPreferences?.recentQuestionIds ?? [];
  const weakFocuses = useMemo(
    () =>
      Object.values(user?.mistakeBuckets ?? {})
        .sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
        .slice(0, 5)
        .map((item) => item.focus),
    [user?.mistakeBuckets]
  );
  const completedLessons =
    (user?.learnPreferences?.languageLessonProgress?.[targetLanguage]?.length
      ? user.learnPreferences.languageLessonProgress[targetLanguage]
      : user?.completedLessons) ?? [];
  const autoUnlockedByProgress = useMemo(() => {
    const lessonCount = completedLessons.length;
    const levels: CefrLevel[] = ['A0'];
    if (lessonCount >= 5) levels.push('A1');
    if (lessonCount >= 10) levels.push('A2');
    if (lessonCount >= 15) levels.push('B1');
    if (lessonCount >= 20) levels.push('B2');
    if (lessonCount >= 26) levels.push('C1');
    if (lessonCount >= 32) levels.push('C2');
    return levels;
  }, [completedLessons.length]);
  const unlockedCefrLevels = useMemo(() => {
    const stored = user?.learnPreferences?.unlockedCefrLevels ?? ['A0'];
    if (placementCompleted && user?.placement?.tier) {
      return Array.from(new Set([...stored, ...getUnlockedCefrLevels(getCefrLevelFromTier(user.placement.tier))]));
    }
    return Array.from(new Set([...stored, ...autoUnlockedByProgress]));
  }, [user?.learnPreferences?.unlockedCefrLevels, placementCompleted, user?.placement?.tier, autoUnlockedByProgress]);

  const units = useMemo(
    () => getUnitsForTargetLanguage(targetLanguage, { tier: placementTier, mode: activeMode }),
    [targetLanguage, placementTier, activeMode]
  );

  const modeCards = useMemo(
    () => getLearnModeCards(activeMode, placementTier),
    [activeMode, placementTier]
  );

  const targetOption = LEARN_LANGUAGE_OPTIONS.find((opt) => opt.code === targetLanguage);
  const localizedTierLabel =
    placementTier === 'starter'
      ? tx('Baslangic Rota')
      : placementTier === 'explorer'
        ? tx('Kesif Rotasi')
        : placementTier === 'navigator'
          ? tx('Ileri Rota')
          : tx('Ustalik Rotasi');

  const getModeLabel = (mode: LearnMode) => {
    if (mode === 'standard') return tx('Standart');
    if (mode === 'timed') return tx('Sureli');
    if (mode === 'review') return tx('Tekrar');
    return tx('Boss');
  };

  const handleModeChange = async (mode: LearnMode) => {
    setMode(mode);
    await setActiveLearnMode?.(mode);
  };

  const handleLessonPress = (lesson: any) => {
    const questions = getLessonQuestions(lesson, language, targetLanguage, {
      tier: placementTier,
      mode: activeMode,
      recentQuestionIds,
      weakFocuses: activeMode === 'review' ? weakFocuses : [],
      seed: `${lesson.id}:${Date.now()}`,
    });

    navigation.navigate('Lesson', {
      lesson,
      questions,
      session: {
        kind: 'lesson',
        mode: activeMode,
        targetLanguage,
        assessmentTier: placementTier,
        saveProgress: true,
        multiplierEligible: activeMode === 'timed',
        timeLimitSec: activeMode === 'timed' ? 70 : undefined,
      },
    });
  };

  const handlePlacementStart = () => {
    setShowPlacementPrompt(false);
    const questions = getPlacementAssessmentQuestions(language, targetLanguage, recentQuestionIds);
    navigation.navigate('Lesson', {
      lesson: {
        id: 'placement_assessment',
        type: 'trophy',
        title: 'Placement Assessment',
        completed: false,
        crowns: 0,
        maxCrowns: 1,
        xpReward: 0,
      },
      questions,
      session: {
        kind: 'assessment',
        mode: 'assessment',
        targetLanguage,
        saveProgress: false,
      },
    });
  };

  const handleSkipPlacement = async () => {
    await setLearnLevel?.('A0', ['A0'], true);
    setSelectedCefr('A0');
    setShowPlacementPrompt(false);
  };

  const handleCefrSelect = async (level: CefrLevel) => {
    if (!unlockedCefrLevels.includes(level)) return;
    setSelectedCefr(level);
    await setLearnLevel?.(level, unlockedCefrLevels, true);
  };

  const handleChallengePress = (card: LearnModeCard) => {
    const questions = getChallengeQuestions(card, language, targetLanguage, placementTier, recentQuestionIds, weakFocuses);

    navigation.navigate('Lesson', {
      lesson: {
        id: card.id,
        type: card.mode === 'boss' ? 'trophy' : card.mode === 'review' ? 'dumbbell' : 'star',
        title: card.title,
        completed: false,
        crowns: 0,
        maxCrowns: 1,
        xpReward: Math.round(20 * card.xpBoost),
        difficulty: placementTier,
        modeTag: card.mode,
      },
      questions,
      session: {
        kind: card.mode === 'review' ? 'review' : 'challenge',
        mode: card.mode,
        targetLanguage,
        assessmentTier: placementTier,
        saveProgress: false,
        multiplierEligible: card.mode === 'timed',
        timeLimitSec: card.timeLimitSec,
        challengeName: card.title,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TopBar compact />

      <View style={styles.heroShell}>
        <View style={styles.targetBar}>
          <View style={styles.targetInfo}>
            <Text style={styles.targetEyebrow}>{tx('Ogrenilecek Dili Sec')}</Text>
          </View>
          <View style={styles.targetMeta}>
            <TouchableOpacity style={styles.targetChip} onPress={() => setPickerVisible(true)}>
              <AppSymbol symbol={targetOption?.flag ?? '\u{1F1EC}\u{1F1E7}'} size={14} color={COLORS.blueDark} style={styles.targetChipFlag} />
              <Text style={styles.targetChipText}>{targetOption?.label ?? 'English'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cefrScroll}
        contentContainerStyle={styles.cefrRail}
      >
        <View style={styles.cefrRow}>
          {CEFR_LEVELS.map((level) => {
            const active = selectedCefr === level;
            const unlocked = unlockedCefrLevels.includes(level);
            return (
              <TouchableOpacity
                key={level}
                style={[styles.cefrChip, active && styles.cefrChipActive, !unlocked && styles.cefrChipLocked]}
                onPress={() => handleCefrSelect(level)}
                disabled={!unlocked}
              >
                <Text style={[styles.cefrChipText, active && styles.cefrChipTextActive, !unlocked && styles.cefrChipTextLocked]}>{level}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.modeRail}>
        {MODES.map((mode) => {
          const active = activeMode === mode;
          const label = getModeLabel(mode);

          return (
            <TouchableOpacity
              key={mode}
              style={[styles.modeChip, active && styles.modeChipActive]}
              onPress={() => handleModeChange(mode)}
            >
              <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeMode === 'standard' ? (
          <>
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
                  const progressKey = `${targetLanguage}:${lesson.id}`;
                  const crownsDone = Math.max(0, user?.lessonProgress?.[progressKey]?.crowns ?? user?.lessonProgress?.[lesson.id]?.crowns ?? 0);
                  const starRating = Math.max(0, Math.min(3, crownsDone));

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
          </>
        ) : (
          <View style={styles.challengeGrid}>
            {modeCards.map((card) => (
              <TouchableOpacity key={card.id} style={styles.challengeCard} onPress={() => handleChallengePress(card)} activeOpacity={0.88}>
                <View style={styles.challengeTopRow}>
                  <View style={styles.challengeIconWrap}>
                    <AppSymbol symbol={card.icon} size={24} color={COLORS.blueDark} />
                  </View>
                  <Text style={styles.challengeBadge}>{card.badge}</Text>
                </View>
                <Text style={styles.challengeTitle}>{card.title}</Text>
                <Text style={styles.challengeSubtitle}>{card.subtitle}</Text>
                <View style={styles.challengeMetaRow}>
                  <Text style={styles.challengeMeta}>XP x{card.xpBoost.toFixed(1)}</Text>
                  {card.timeLimitSec ? <Text style={styles.challengeMeta}>{card.timeLimitSec}s</Text> : <Text style={styles.challengeMeta}>Adaptive</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
                onPress={async () => {
                  setTargetLanguage(option.code);
                  await setLearnTargetLanguage?.(option.code);
                  setPickerVisible(false);
                }}
              >
                <AppSymbol symbol={option.flag} size={18} color={COLORS.blueDark} style={styles.optionFlag} />
                <Text style={styles.optionLabel}>{option.label}</Text>
                {targetLanguage === option.code && <AppSymbol symbol="✓" size={18} color={COLORS.primary} style={styles.optionCheck} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showPlacementPrompt} transparent animationType="fade" onRequestClose={() => setShowPlacementPrompt(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{tx('Placement test almak ister misin?')}</Text>
            <Text style={styles.modalSubtitle}>{tx('Girersen direkt seviyene gore baslarsin. Girmezsen A0dan tek tek ilerlersin.')}</Text>
            <TouchableOpacity style={[styles.promptButton, styles.promptButtonPrimary]} onPress={handlePlacementStart}>
              <Text style={styles.promptButtonPrimaryText}>{tx('TESTE GIR')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.promptButton, styles.promptButtonSecondary]} onPress={handleSkipPlacement}>
              <Text style={styles.promptButtonSecondaryText}>{tx('SIMDI DEGIL')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgCanvas },
  heroShell: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: UI.radius.md,
    backgroundColor: COLORS.bgPanel,
    borderWidth: 1,
    borderColor: COLORS.skyLine,
    overflow: 'hidden',
  },
  targetBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  targetInfo: { flex: 1, minWidth: 0 },
  targetMeta: { alignItems: 'flex-end' },
  targetEyebrow: { fontSize: 11, color: COLORS.ink, ...FONTS.bold, textTransform: 'uppercase', letterSpacing: 1.2 },
  targetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: UI.radius.pill,
    borderWidth: 1,
    borderColor: COLORS.skyLine,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  targetChipFlag: { fontSize: 13 },
  targetChipText: { fontSize: 12, color: COLORS.blueDark, ...FONTS.bold },
  cefrScroll: {
    flexGrow: 0,
    height: 40,
    maxHeight: 40,
    marginBottom: 4,
  },
  cefrRail: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cefrRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  cefrChip: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: UI.radius.pill,
    backgroundColor: COLORS.bgPanel,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
  },
  cefrChipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blueDark,
  },
  cefrChipLocked: {
    opacity: 0.38,
  },
  cefrChipText: { fontSize: 12, color: COLORS.ink, ...FONTS.bold },
  cefrChipTextActive: { color: COLORS.white },
  cefrChipTextLocked: { color: COLORS.hare },
  modeRail: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 4,
    padding: 3,
    borderRadius: UI.radius.pill,
    backgroundColor: COLORS.bgPanel,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    gap: 6,
  },
  modeChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: UI.radius.pill,
  },
  modeChipActive: {
    backgroundColor: COLORS.primary,
  },
  modeChipText: { fontSize: 12, color: COLORS.inkSoft, ...FONTS.semiBold },
  modeChipTextActive: { color: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  challengeGrid: { paddingHorizontal: 16, gap: 12 },
  challengeCard: {
    backgroundColor: COLORS.bgPanel,
    borderRadius: UI.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    ...SHADOWS.medium,
  },
  challengeTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  challengeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgPanelAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.skyLine,
  },
  challengeBadge: {
    fontSize: 11,
    color: COLORS.primaryDark,
    ...FONTS.bold,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: UI.radius.pill,
  },
  challengeTitle: { fontSize: 20, color: COLORS.ink, ...FONTS.bold, marginTop: 14 },
  challengeSubtitle: { fontSize: 13, color: COLORS.inkSoft, lineHeight: 19, marginTop: 6 },
  challengeMetaRow: { marginTop: 16, flexDirection: 'row', gap: 10 },
  challengeMeta: {
    fontSize: 12,
    color: COLORS.blueDark,
    ...FONTS.semiBold,
    backgroundColor: COLORS.bgPanelAlt,
    borderWidth: 1,
    borderColor: COLORS.skyLine,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: UI.radius.pill,
  },
  pathArea: { width: AREA_WIDTH, alignSelf: 'center' },
  nodeAbsolute: { position: 'absolute', width: NODE_SIZE, height: NODE_SIZE },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.lg, padding: 20, borderWidth: 1, borderColor: COLORS.mintLine },
  modalTitle: { fontSize: 22, color: COLORS.ink, ...FONTS.bold },
  modalSubtitle: { fontSize: 13, color: COLORS.inkSoft, marginTop: 6, marginBottom: 16 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: UI.radius.md,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    backgroundColor: COLORS.white,
    marginTop: 10,
  },
  optionRowActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  optionFlag: { fontSize: 18 },
  optionLabel: { marginLeft: 10, flex: 1, fontSize: 15, color: COLORS.ink, ...FONTS.semiBold },
  optionCheck: { fontSize: 18 },
  promptButton: {
    marginTop: 10,
    borderRadius: UI.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  promptButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryDark,
  },
  promptButtonSecondary: {
    backgroundColor: COLORS.bgPanelAlt,
    borderWidth: 1,
    borderColor: COLORS.skyLine,
  },
  promptButtonPrimaryText: { fontSize: 14, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  promptButtonSecondaryText: { fontSize: 14, color: COLORS.blueDark, ...FONTS.bold },
});
