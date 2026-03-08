import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONTS } from '../theme/colors';
import { RootStackParamList } from '../types';
import { useLesson, useUser, useAuth } from '../hooks';
import ProgressBar from '../components/ProgressBar';
import * as firestoreService from '../services/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const LessonScreen: React.FC<Props> = ({ route, navigation }) => {
  const { questions } = route.params;
  const lesson = useLesson(questions);

  const { user } = useUser();
  const { user: authUser, refreshProfile } = useAuth();

  // LESSON FINISH FIREBASE SAVE
  useEffect(() => {
    const saveLessonProgress = async () => {
      if (!lesson.isFinished) return;

      try {
        await lesson.finishLesson(route.params.lesson.id);
        await refreshProfile();
      } catch (error) {
        console.log('FINISH LESSON ERROR:', error);
      }
    };

    saveLessonProgress();
  }, [lesson.isFinished]);

  const handleClose = () => {
    Alert.alert('Dersten çık', 'Emin misin? İlerleme kaybolacak.', [
      { text: 'Kal', style: 'cancel' },
      { text: 'Çık', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

 const handleRefillHearts = async () => {
   if (!authUser?.uid || !authUser?.idToken) return;

   try {
     const success = await firestoreService.refillHearts(
       authUser.uid,
       authUser.idToken
     );

     if (!success) {
       Alert.alert("Yetersiz Gem", "Canları yenilemek için 350 gem gerekiyor.");
       return;
     }

     await refreshProfile();

     Alert.alert('Canlar Yenilendi!', '5 can eklendi.');

     navigation.goBack();

   } catch (error) {
     console.log("REFILL ERROR:", error);
     Alert.alert("Hata", "Canlar yenilenemedi.");
   }
 };

  // Canlar bitti ekranı
  if ((user?.hearts ?? 0) <= 0 && !lesson.isFinished) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#FFF5F5' }]}>
        <View style={styles.noHeartsContainer}>
          <Text style={styles.noHeartsEmoji}>💔</Text>
          <Text style={styles.noHeartsTitle}>Canların Bitti!</Text>
          <Text style={styles.noHeartsDesc}>Devam etmek için canlarını yenile.</Text>

          <View style={styles.heartsDisplay}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} style={styles.heartIcon}>🤍</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.refillButton} onPress={handleRefillHearts}>
            <Text style={styles.refillButtonText}>CANLARI YENİLE (ÜCRETSİZ)</Text>
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
          <Text style={styles.finishedEmoji}>{lesson.passed ? '🎉' : '💔'}</Text>
          <Text style={[styles.finishedTitle, { color: lesson.passed ? COLORS.primaryDark : COLORS.red }]}>
            {lesson.passed ? 'Ders Tamamlandı!' : 'Canların Bitti!'}
          </Text>

          <View style={styles.statsGrid}>
            {[
              { value: lesson.totalXP, label: 'Toplam XP' },
              { value: `%${lesson.accuracy}`, label: 'Doğruluk' },
              { value: `${lesson.score}/${questions.length}`, label: 'Doğru' },
            ].map((stat, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statBoxValue}>{stat.value}</Text>
                <Text style={styles.statBoxLabel}>{stat.label}</Text>
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
            <Text style={styles.finishButtonText}>
              {lesson.passed ? 'DEVAM ET' : 'TEKRAR DENE'}
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  const q = lesson.currentQuestion;

  if (!q) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Ders yükleniyor...
        </Text>
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
          <Text style={styles.heartText}>❤️</Text>
          <Text style={styles.heartCount}>{user?.hearts ?? 0}</Text>
        </View>

      </View>

      <View style={styles.questionContainer}>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {q.type === 'translate' && '🔄 Çeviri'}
            {q.type === 'select' && '✅ Seçim'}
            {q.type === 'fillBlank' && '✏️ Boşluk Doldur'}
            {q.type === 'listen' && '🎧 Dinleme'}
            {q.type === 'match' && '🔗 Eşleştirme'}
          </Text>
        </View>

        <Text style={styles.questionText}>{q.question}</Text>

        {(q.prompt || q.sentence) && (
          <View style={styles.promptCard}>

            {q.type === 'listen' && (
              <TouchableOpacity style={styles.speakerButton}>
                <Ionicons name="volume-high" size={28} color={COLORS.blue} />
              </TouchableOpacity>
            )}

            <Text style={styles.promptText}>{q.prompt ?? q.sentence}</Text>

          </View>
        )}

        <View style={styles.optionsContainer}>

          {q.options?.map((option, index) => {

            const isSelected = lesson.selectedAnswer === option;
            const isAnswer = option === q.correctAnswer;

            let optionStyle = [styles.option];
            let textStyle = [styles.optionText];

            if (lesson.showResult) {

              if (isAnswer) {
                optionStyle = [styles.option, styles.optionCorrect];
                textStyle = [styles.optionText, styles.optionTextCorrect];
              }

              else if (isSelected && !isAnswer) {
                optionStyle = [styles.option, styles.optionIncorrect];
                textStyle = [styles.optionText, styles.optionTextIncorrect];
              }

            }

            else if (isSelected) {
              optionStyle = [styles.option, styles.optionSelected];
              textStyle = [styles.optionText, styles.optionTextSelected];
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => lesson.selectAnswer(option)}
                disabled={lesson.showResult}
                activeOpacity={0.7}
              >

                <View style={styles.optionContent}>

                  <View style={[
                    styles.optionIndex,
                    isSelected && !lesson.showResult && styles.optionIndexSelected
                  ]}>

                    <Text style={[
                      styles.optionIndexText,
                      isSelected && !lesson.showResult && styles.optionIndexTextSelected
                    ]}>
                      {index + 1}
                    </Text>

                  </View>

                  <Text style={textStyle}>{option}</Text>

                  {lesson.showResult && isAnswer &&
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
                  }

                  {lesson.showResult && isSelected && !isAnswer &&
                    <Ionicons name="close-circle" size={24} color={COLORS.red} style={{ marginLeft: 'auto' }} />
                  }

                </View>

              </TouchableOpacity>
            );
          })}

        </View>

      </View>

      <View style={[
        styles.bottomBar,
        lesson.showResult && (lesson.isCorrect ? styles.bottomBarCorrect : styles.bottomBarIncorrect)
      ]}>

        {lesson.showResult && (

          <View style={styles.resultFeedback}>

            <Text style={styles.resultIcon}>
              {lesson.isCorrect ? '✅' : '❌'}
            </Text>

            <View>

              <Text style={[
                styles.resultText,
                { color: lesson.isCorrect ? COLORS.primaryDark : COLORS.redDark }
              ]}>
                {lesson.isCorrect ? 'Harika!' : 'Yanlış!'}
              </Text>

              {!lesson.isCorrect &&
                <Text style={styles.correctAnswerText}>
                  Doğrusu: {q.correctAnswer}
                </Text>
              }

            </View>

          </View>

        )}

        <TouchableOpacity
          style={[
            styles.checkButton,
            !lesson.selectedAnswer && !lesson.showResult && styles.checkButtonDisabled,
            lesson.showResult && lesson.isCorrect && styles.checkButtonCorrect,
            lesson.showResult && !lesson.isCorrect && styles.checkButtonIncorrect
          ]}
          onPress={lesson.showResult ? lesson.continueLesson : lesson.checkAnswer}
          disabled={!lesson.selectedAnswer && !lesson.showResult}
        >
          <Text style={styles.checkButtonText}>
            {lesson.showResult ? 'DEVAM ET' : 'KONTROL ET'}
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
  promptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.snow, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 2, borderColor: COLORS.swan, gap: 12 },
  speakerButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.blueLight + '40', alignItems: 'center', justifyContent: 'center' },
  promptText: { fontSize: 20, color: COLORS.owl, ...FONTS.semiBold, flex: 1 },
  optionsContainer: { gap: 10 },
  option: { borderWidth: 2, borderColor: COLORS.swan, borderRadius: 14, padding: 14, backgroundColor: COLORS.white, borderBottomWidth: 4, borderBottomColor: COLORS.swan },
  optionSelected: { borderColor: COLORS.blue, borderBottomColor: COLORS.blueDark, backgroundColor: COLORS.blueLight + '15' },
  optionCorrect: { borderColor: COLORS.primary, borderBottomColor: COLORS.primaryDark, backgroundColor: COLORS.primaryBg },
  optionIncorrect: { borderColor: COLORS.red, borderBottomColor: COLORS.redDark, backgroundColor: COLORS.redLight + '20' },
  optionContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIndex: { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.swan },
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
  finishedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  finishedEmoji: { fontSize: 64, marginBottom: 16 },
  finishedTitle: { fontSize: 28, ...FONTS.bold, marginBottom: 32, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32, width: '100%' },
  statBox: { flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: COLORS.swan },
  statBoxValue: { fontSize: 24, color: COLORS.owl, ...FONTS.bold },
  statBoxLabel: { fontSize: 12, color: COLORS.wolf, ...FONTS.medium, marginTop: 4 },
  accuracySection: { width: '100%', marginBottom: 40 },
  accuracyLabel: { fontSize: 14, color: COLORS.wolf, ...FONTS.semiBold },
  finishButton: { width: '100%', borderRadius: 16, padding: 18, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  finishButtonText: { fontSize: 17, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  // No hearts screen
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