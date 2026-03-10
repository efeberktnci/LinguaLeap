import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

import { COLORS, FONTS } from '../theme/colors';
import { RootStackParamList } from '../types';
import { useLesson, useUser, useAuth } from '../hooks';
import ProgressBar from '../components/ProgressBar';
import AppSymbol from '../components/AppSymbol';
import * as firestoreService from '../services/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

type RecognitionPermission = { granted: boolean };
type RecognitionSubscription = { remove?: () => void };
type SpeechRecognitionModuleLike = {
  addListener?: (eventName: string, listener: (event?: any) => void) => RecognitionSubscription;
  requestPermissionsAsync?: () => Promise<RecognitionPermission>;
  start?: (options: any) => void;
  stop?: () => void;
};

let SpeechRecognitionModule: SpeechRecognitionModuleLike | null = null;
SpeechRecognitionModule = (ExpoSpeechRecognitionModule as SpeechRecognitionModuleLike) ?? null;

const OPTION_LABELS = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)'];

const ICONS = {
  heart: '\u2764\uFE0F',
  brokenHeart: '\u{1F494}',
  party: '\u{1F389}',
  check: '\u2705',
  cross: '\u274C',
} as const;

const normalizeAnswer = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\sçğıöşüÇĞİÖŞÜáéíóúÁÉÍÓÚñÑäöüÄÖÜßàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const levenshteinDistance = (a: string, b: string) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[a.length][b.length];
};

const pronunciationScore = (spoken: string, expected: string) => {
  const s = normalizeAnswer(spoken);
  const e = normalizeAnswer(expected);
  if (!s || !e) return 0;
  const distance = levenshteinDistance(s, e);
  const maxLen = Math.max(s.length, e.length);
  return maxLen === 0 ? 0 : 1 - distance / maxLen;
};

const LessonScreen: React.FC<Props> = ({ route, navigation }) => {
  const { questions } = route.params;
  const lesson = useLesson(questions);

  const { user } = useUser();
  const { user: authUser, refreshProfile } = useAuth();

  const q = lesson.currentQuestion;
  const speechRecognitionAvailable = Boolean(SpeechRecognitionModule);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isEvaluatingPronunciation, setIsEvaluatingPronunciation] = useState(false);
  const [micLevel, setMicLevel] = useState(0.2);
  const [pronunciationMessage, setPronunciationMessage] = useState<string | null>(null);

  const pronunciationHandledRef = useRef(false);
  const soundBars = useRef([
    new Animated.Value(0.18),
    new Animated.Value(0.34),
    new Animated.Value(0.5),
    new Animated.Value(0.24),
    new Animated.Value(0.44),
    new Animated.Value(0.28),
  ]).current;

  const barAnimations = useMemo(
    () =>
      soundBars.map((bar, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: 0.95,
              duration: 180 + index * 40,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: 0.2,
              duration: 180 + index * 40,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: false,
            }),
          ])
        )
      ),
    [soundBars]
  );

  useEffect(() => {
    if (!SpeechRecognitionModule?.addListener) return;

    const startSub = SpeechRecognitionModule.addListener('start', () => {
      setIsRecognizing(true);
      setMicLevel(0.2);
    });

    const endSub = SpeechRecognitionModule.addListener('end', () => {
      setIsRecognizing(false);
      setMicLevel(0.2);
    });

    const errorSub = SpeechRecognitionModule.addListener('error', () => {
      setIsRecognizing(false);
      setMicLevel(0.2);
      setPronunciationMessage('Mikrofon algılanamadı. Tekrar dene.');
    });

    const volumeSub = SpeechRecognitionModule.addListener('volumechange', (event: any) => {
      const raw = typeof event?.value === 'number' ? event.value : typeof event?.volume === 'number' ? event.volume : -2;
      const normalized = Math.max(0, Math.min(1, (raw + 2) / 12));
      setMicLevel(normalized);
    });

    const resultSub = SpeechRecognitionModule.addListener('result', (event: any) => {
      if (!q || q.type !== 'pronounce' || lesson.showResult || pronunciationHandledRef.current) return;

      const transcript = (event?.results?.[0]?.transcript ?? '').trim();
      const isFinal = Boolean(event?.isFinal);
      if (!isFinal || !transcript) return;

      pronunciationHandledRef.current = true;
      const expected = (q.correctAnswer ?? '').trim();
      const score = pronunciationScore(transcript, expected);
      const isCorrect = score >= 0.78 || normalizeAnswer(transcript).includes(normalizeAnswer(expected));
      const finalAnswer = isCorrect ? expected : transcript;

      setPronunciationMessage(isCorrect ? 'Doğru telaffuz, harika!' : 'Yanlış telaffuz, tekrar dene.');
      setIsEvaluatingPronunciation(true);

      lesson.selectAnswer(finalAnswer);
      setTimeout(() => {
        lesson.checkAnswer(finalAnswer);
      }, 140);
    });

    return () => {
      startSub?.remove?.();
      endSub?.remove?.();
      errorSub?.remove?.();
      volumeSub?.remove?.();
      resultSub?.remove?.();
    };
  }, [q, lesson.showResult, lesson.selectAnswer, lesson.checkAnswer]);

  useEffect(() => {
    const saveLessonProgress = async () => {
      if (!lesson.isFinished) return;

      try {
        await lesson.finishLesson(route.params.lesson.id);
        await refreshProfile();
      } catch (error) {
        console.warn('FINISH LESSON ERROR:', error);
      }
    };

    saveLessonProgress();
  }, [lesson.isFinished, lesson, refreshProfile, route.params.lesson.id]);

  useEffect(() => {
    pronunciationHandledRef.current = false;
    setIsRecognizing(false);
    setIsEvaluatingPronunciation(false);
    setMicLevel(0.2);
    SpeechRecognitionModule?.stop?.();

    if (q?.type === 'pronounce' && !speechRecognitionAvailable) {
      setPronunciationMessage('Mikrofon bu buildde hazır değil. Aşağıdan doğru kelimeyi seç.');
    } else {
      setPronunciationMessage(null);
    }
  }, [q?.id, q?.type, speechRecognitionAvailable]);

  useEffect(() => {
    if (isRecognizing) {
      barAnimations.forEach((anim) => anim.stop());
      const base = Math.max(0.15, Math.min(1, micLevel));
      soundBars.forEach((bar, idx) => {
        const target = Math.min(1, base + (idx % 2 === 0 ? 0.1 : 0.25));
        Animated.timing(bar, {
          toValue: target,
          duration: 80,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    if (isSpeaking) {
      const parallel = Animated.parallel(barAnimations, { stopTogether: true });
      parallel.start();
      return () => {
        parallel.stop();
      };
    }

    barAnimations.forEach((anim) => anim.stop());
    soundBars.forEach((bar, idx) => {
      bar.setValue(0.2 + (idx % 2) * 0.16);
    });
  }, [isSpeaking, isRecognizing, micLevel, barAnimations, soundBars]);

  useEffect(
    () => () => {
      Speech.stop();
      SpeechRecognitionModule?.stop?.();
    },
    []
  );

  const handleClose = () => {
    Alert.alert('Dersten çık', 'Emin misin? İlerleme kaybolacak.', [
      { text: 'Kal', style: 'cancel' },
      { text: 'Çık', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const handleRefillHearts = async () => {
    if (!authUser?.uid || !authUser?.idToken) return;

    try {
      const success = await firestoreService.refillHearts(authUser.uid, authUser.idToken);

      if (!success) {
        Alert.alert('Yetersiz Elmas', 'Canları yenilemek için 350 elmas gerekiyor.');
        return;
      }

      await refreshProfile();
      Alert.alert('Canlar Yenilendi', '5 can eklendi.');
      navigation.goBack();
    } catch (error) {
      console.warn('REFILL ERROR:', error);
      Alert.alert('Hata', 'Canlar yenilenemedi.');
    }
  };

  const handleSpeak = useCallback(() => {
    if (!q || (q.type !== 'listen' && q.type !== 'pronounce')) return;

    const text = (q.audioText ?? q.prompt ?? '').trim();
    if (!text) return;

    Speech.stop();
    setIsSpeaking(true);

    Speech.speak(text, {
      language: q.audioLanguage ?? 'en-US',
      pitch: 1,
      rate: 0.92,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [q]);

  const handlePronunciationStart = useCallback(async () => {
    if (!q || q.type !== 'pronounce' || lesson.showResult || isRecognizing) return;

    if (!SpeechRecognitionModule) {
      setPronunciationMessage('Mikrofon bu buildde desteklenmiyor. Aşağıdan doğru kelimeyi seç.');
      return;
    }

    try {
      const permission = await SpeechRecognitionModule.requestPermissionsAsync?.();
      if (!permission?.granted) {
        Alert.alert('Mikrofon İzni Gerekli', 'Telaffuz testi için mikrofon izni vermelisin.');
        return;
      }

      pronunciationHandledRef.current = false;
      setMicLevel(0.2);
      setPronunciationMessage('Konuş... parmağını çekince dinleme bitecek.');

      SpeechRecognitionModule.start?.({
        lang: q.audioLanguage ?? 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        volumeChangeEventOptions: { enabled: true, intervalMillis: 80 },
      });
    } catch {
      setPronunciationMessage('Mikrofon başlatılamadı. Tekrar dene.');
    }
  }, [q, lesson.showResult, isRecognizing]);

  const handlePronunciationStop = useCallback(() => {
    if (!isRecognizing) return;
    SpeechRecognitionModule?.stop?.();
    setPronunciationMessage('Dinleme bitti, sonuç işleniyor...');
    setIsRecognizing(false);
  }, [isRecognizing]);

  const handleCheckButtonPress = useCallback(() => {
    if (isEvaluatingPronunciation) return;

    if (lesson.showResult) {
      lesson.continueLesson();
      return;
    }

    lesson.checkAnswer();
  }, [isEvaluatingPronunciation, lesson]);

  if ((user?.hearts ?? 0) <= 0 && !lesson.isFinished) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#FFF5F5' }]}>
        <View style={styles.noHeartsContainer}>
          <AppSymbol symbol={ICONS.brokenHeart} size={52} style={styles.noHeartsEmoji} />
          <Text style={styles.noHeartsTitle}>Canların Bitti</Text>
          <Text style={styles.noHeartsDesc}>Devam etmek için canlarını yenile.</Text>

          <View style={styles.heartsDisplay}>
            {Array.from({ length: 5 }).map((_, i) => (
              <AppSymbol key={i} symbol="♡" size={28} color={COLORS.hare} style={styles.heartIcon} />
            ))}
          </View>

          <TouchableOpacity style={styles.refillButton} onPress={handleRefillHearts}>
            <Text style={styles.refillButtonText}>CANLARI YENİLE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <Text style={styles.exitButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (lesson.isFinished) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: lesson.passed ? '#F0FFF0' : '#FFF5F5' }]}>
        <View style={styles.finishedContainer}>
          <AppSymbol symbol={lesson.passed ? ICONS.party : ICONS.brokenHeart} size={54} style={styles.finishedEmoji} />
          <Text style={[styles.finishedTitle, { color: lesson.passed ? COLORS.primaryDark : COLORS.red }]}>
            {lesson.passed ? 'Ders Tamamlandı' : 'Canların Bitti'}
          </Text>

          <View style={styles.statsGrid}>
            {[
              { value: `${lesson.totalXP} XP`, label: 'Toplam XP' },
              { value: `%${lesson.accuracy}`, label: 'Doğruluk' },
              { value: `${lesson.score}/${questions.length}`, label: 'Doğru Sayısı' },
            ].map((stat, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statBoxValue} numberOfLines={1}>{stat.value}</Text>
                <Text style={styles.statBoxLabel} numberOfLines={2}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.accuracySection}>
            <Text style={styles.accuracyLabel}>Performans</Text>
            <ProgressBar
              progress={lesson.score / questions.length}
              height={20}
              color={lesson.accuracy >= 80 ? COLORS.primary : lesson.accuracy >= 50 ? COLORS.accent : COLORS.red}
              style={{ marginTop: 8 }}
            />
          </View>

          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: lesson.passed ? COLORS.primary : COLORS.blue }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.finishButtonText}>{lesson.passed ? 'DEVAM ET' : 'TEKRAR DENE'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!q) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Ders yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={COLORS.hare} />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <ProgressBar progress={lesson.progress} height={14} color={COLORS.primary} />
        </View>

        <View style={styles.heartsContainer}>
          <AppSymbol symbol={ICONS.heart} size={18} color={COLORS.red} style={styles.heartText} />
          <Text style={styles.heartCount}>{user?.hearts ?? 0}</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {q.type === 'translate' && 'Çeviri'}
            {q.type === 'select' && 'Seçim'}
            {q.type === 'fillBlank' && 'Boşluk Doldur'}
            {q.type === 'listen' && 'Dinleme'}
            {q.type === 'pronounce' && 'Pronunciation Test'}
            {q.type === 'match' && 'Eşleştirme'}
          </Text>
        </View>

        <Text style={styles.questionText}>{q.question}</Text>

        {q.type === 'listen' && (
          <View style={styles.promptCardListen}>
            <TouchableOpacity style={styles.speakerButton} onPress={handleSpeak}>
              <Ionicons name="volume-high" size={28} color={COLORS.blue} />
            </TouchableOpacity>

            <View style={styles.soundWaveWrap}>
              {soundBars.map((bar, idx) => (
                <Animated.View
                  key={`listen-wave-${idx}`}
                  style={[
                    styles.soundBar,
                    {
                      height: bar.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 34],
                      }),
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {q.type === 'pronounce' && (
          <View style={styles.pronounceCard}>
            <Text style={styles.pronounceWord}>{q.prompt}</Text>
            <Text style={styles.pronounceSub}>{pronunciationMessage ?? 'Mikrofon butonuna basılı tutarak konuş'}</Text>
            {!speechRecognitionAvailable && (
              <Text style={styles.pronounceFallback}>Mikrofon modu için development build gerekir.</Text>
            )}

            <View style={styles.pronounceButtons}>
              <TouchableOpacity
                style={[
                  styles.micButton,
                  isRecognizing && styles.micButtonActive,
                  !speechRecognitionAvailable && styles.micButtonDisabled,
                ]}
                onPressIn={handlePronunciationStart}
                onPressOut={handlePronunciationStop}
                disabled={!speechRecognitionAvailable || lesson.showResult}
              >
                <Ionicons name={isRecognizing ? 'mic' : 'mic-outline'} size={24} color={COLORS.white} />
                <Text style={styles.micButtonText}>{isRecognizing ? 'Konuşuyorsun...' : 'Basılı Tut'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listenAgainButton} onPress={handleSpeak}>
                <Ionicons name="volume-medium" size={20} color={COLORS.blueDark} />
                <Text style={styles.listenAgainText}>Önce dinle</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pronounceWaveWrap}>
              {soundBars.map((bar, idx) => (
                <Animated.View
                  key={`pronounce-wave-${idx}`}
                  style={[
                    styles.soundBar,
                    {
                      height: bar.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 34],
                      }),
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {q.type !== 'listen' && q.type !== 'pronounce' && (q.prompt || q.sentence) && (
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>{q.prompt ?? q.sentence}</Text>
          </View>
        )}

        {(q.type !== 'pronounce' || !speechRecognitionAvailable) && !!q.options?.length && (
          <View style={styles.optionsContainer}>
            {q.options.map((option, index) => {
              const isSelected = lesson.selectedAnswer === option;
              const isAnswer = option === q.correctAnswer;

              let optionStyle: any[] = [styles.option];
              let textStyle: any[] = [styles.optionText];

              if (lesson.showResult) {
                if (isAnswer) {
                  optionStyle = [styles.option, styles.optionCorrect];
                  textStyle = [styles.optionText, styles.optionTextCorrect];
                } else if (isSelected && !isAnswer) {
                  optionStyle = [styles.option, styles.optionIncorrect];
                  textStyle = [styles.optionText, styles.optionTextIncorrect];
                }
              } else if (isSelected) {
                optionStyle = [styles.option, styles.optionSelected];
                textStyle = [styles.optionText, styles.optionTextSelected];
              }

              const optionLabel = OPTION_LABELS[index] ?? `${String.fromCharCode(97 + index)})`;

              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => lesson.selectAnswer(option)}
                  disabled={lesson.showResult}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.optionIndex, isSelected && !lesson.showResult && styles.optionIndexSelected]}>
                      <Text style={[styles.optionIndexText, isSelected && !lesson.showResult && styles.optionIndexTextSelected]}>{optionLabel}</Text>
                    </View>

                    <Text style={textStyle}>{option}</Text>

                    {lesson.showResult && isAnswer && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
                    )}

                    {lesson.showResult && isSelected && !isAnswer && (
                      <Ionicons name="close-circle" size={24} color={COLORS.red} style={{ marginLeft: 'auto' }} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={[styles.bottomBar, lesson.showResult && (lesson.isCorrect ? styles.bottomBarCorrect : styles.bottomBarIncorrect)]}>
        {lesson.showResult && (
          <View style={styles.resultFeedback}>
            <AppSymbol symbol={lesson.isCorrect ? ICONS.check : ICONS.cross} size={24} style={styles.resultIcon} />
            <View>
              <Text style={[styles.resultText, { color: lesson.isCorrect ? COLORS.primaryDark : COLORS.redDark }]}> 
                {lesson.isCorrect ? 'Harika!' : 'Yanlış!'}
              </Text>
              {!lesson.isCorrect && <Text style={styles.correctAnswerText}>Doğrusu: {q.correctAnswer}</Text>}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.checkButton,
            ((!lesson.selectedAnswer && !lesson.showResult) || isEvaluatingPronunciation) && styles.checkButtonDisabled,
            lesson.showResult && lesson.isCorrect && styles.checkButtonCorrect,
            lesson.showResult && !lesson.isCorrect && styles.checkButtonIncorrect,
          ]}
          onPress={handleCheckButtonPress}
          disabled={(!lesson.selectedAnswer && !lesson.showResult) || isEvaluatingPronunciation}
        >
          <Text style={styles.checkButtonText}>
            {lesson.showResult ? 'DEVAM ET' : isEvaluatingPronunciation ? 'DEGERLENDIRILIYOR...' : 'KONTROL ET'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 8 : 16, paddingBottom: 12, gap: 12 },
  closeButton: { padding: 4 },
  progressBarContainer: { flex: 1 },
  heartsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heartText: { fontSize: 18 },
  heartCount: { fontSize: 16, color: COLORS.red, ...FONTS.bold },
  questionContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.snow, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  typeBadgeText: { fontSize: 13, color: COLORS.wolf, ...FONTS.medium },
  questionText: { fontSize: 22, color: COLORS.owl, ...FONTS.bold, lineHeight: 30, marginBottom: 20 },
  promptCard: { backgroundColor: COLORS.snow, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 2, borderColor: COLORS.swan },
  promptCardListen: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.snow, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 2, borderColor: COLORS.swan, gap: 12 },
  speakerButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.blueLight + '45', alignItems: 'center', justifyContent: 'center' },
  soundWaveWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 6, height: 36 },
  pronounceWaveWrap: { marginTop: 12, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 6, height: 36 },
  soundBar: { width: 8, borderRadius: 8, backgroundColor: COLORS.blue },
  pronounceCard: { backgroundColor: COLORS.snow, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 2, borderColor: COLORS.swan },
  pronounceWord: { fontSize: 30, color: COLORS.owl, ...FONTS.bold, textAlign: 'center' },
  pronounceSub: { marginTop: 8, fontSize: 13, color: COLORS.wolf, textAlign: 'center', ...FONTS.medium },
  pronounceFallback: { marginTop: 6, fontSize: 12, color: COLORS.redDark, textAlign: 'center', ...FONTS.medium },
  pronounceButtons: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  micButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.blueDark, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  micButtonActive: { backgroundColor: COLORS.red },
  micButtonDisabled: { backgroundColor: COLORS.hare },
  micButtonText: { color: COLORS.white, fontSize: 14, ...FONTS.bold },
  listenAgainButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.blueLight + '2A', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  listenAgainText: { color: COLORS.blueDark, fontSize: 13, ...FONTS.semiBold },
  promptText: { fontSize: 20, color: COLORS.owl, ...FONTS.semiBold },
  optionsContainer: { gap: 10 },
  option: { borderWidth: 2, borderColor: COLORS.swan, borderRadius: 14, padding: 14, backgroundColor: COLORS.white, borderBottomWidth: 4, borderBottomColor: COLORS.swan },
  optionSelected: { borderColor: COLORS.blue, borderBottomColor: COLORS.blueDark, backgroundColor: COLORS.blueLight + '15' },
  optionCorrect: { borderColor: COLORS.primary, borderBottomColor: COLORS.primaryDark, backgroundColor: COLORS.primaryBg },
  optionIncorrect: { borderColor: COLORS.red, borderBottomColor: COLORS.redDark, backgroundColor: COLORS.redLight + '20' },
  optionContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIndex: { width: 34, height: 28, borderRadius: 8, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.swan },
  optionIndexSelected: { backgroundColor: COLORS.blue, borderColor: COLORS.blueDark },
  optionIndexText: { fontSize: 13, color: COLORS.wolf, ...FONTS.bold },
  optionIndexTextSelected: { color: COLORS.white },
  optionText: { fontSize: 16, color: COLORS.eel, ...FONTS.medium, flex: 1 },
  optionTextSelected: { color: COLORS.blueDark },
  optionTextCorrect: { color: COLORS.primaryDark, ...FONTS.bold },
  optionTextIncorrect: { color: COLORS.redDark },
  bottomBar: { padding: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16, borderTopWidth: 1, borderTopColor: COLORS.swan, backgroundColor: COLORS.white },
  bottomBarCorrect: { backgroundColor: '#E8F8D8', borderTopColor: COLORS.primaryBg },
  bottomBarIncorrect: { backgroundColor: '#FFEAEA', borderTopColor: COLORS.redLight },
  resultFeedback: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  resultIcon: { fontSize: 24 },
  resultText: { fontSize: 18, ...FONTS.bold },
  correctAnswerText: { fontSize: 14, color: COLORS.redDark, ...FONTS.medium, marginTop: 2 },
  checkButton: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  checkButtonDisabled: { backgroundColor: COLORS.swan, borderBottomColor: COLORS.borderDark },
  checkButtonCorrect: { backgroundColor: COLORS.primary, borderBottomColor: COLORS.primaryDark },
  checkButtonIncorrect: { backgroundColor: COLORS.red, borderBottomColor: COLORS.redDark },
  checkButtonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  finishedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  finishedEmoji: { fontSize: 64, marginBottom: 16 },
  finishedTitle: { fontSize: 28, ...FONTS.bold, marginBottom: 24, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24, width: '100%' },
  statBox: { flex: 1, minHeight: 86, backgroundColor: COLORS.white, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.swan },
  statBoxValue: { fontSize: 19, color: COLORS.owl, ...FONTS.bold, textAlign: 'center' },
  statBoxLabel: { fontSize: 11, lineHeight: 13, color: COLORS.wolf, ...FONTS.medium, marginTop: 6, textAlign: 'center' },
  accuracySection: { width: '100%', marginBottom: 30 },
  accuracyLabel: { fontSize: 14, color: COLORS.wolf, ...FONTS.semiBold },
  finishButton: { width: '100%', borderRadius: 16, padding: 18, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  finishButtonText: { fontSize: 17, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  noHeartsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  noHeartsEmoji: { fontSize: 64, marginBottom: 16 },
  noHeartsTitle: { fontSize: 26, color: COLORS.red, ...FONTS.bold, marginBottom: 8 },
  noHeartsDesc: { fontSize: 15, color: COLORS.wolf, textAlign: 'center', marginBottom: 24 },
  heartsDisplay: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  heartIcon: { fontSize: 36 },
  refillButton: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 18, width: '100%', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark, marginBottom: 12 },
  refillButtonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  exitButton: { padding: 14, width: '100%', alignItems: 'center' },
  exitButtonText: { fontSize: 16, color: COLORS.wolf, ...FONTS.semiBold },
});
