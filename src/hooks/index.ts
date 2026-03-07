import { useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { calculateProgress } from '../utils/helpers';
import * as firestoreService from '../services/firestore';
import { QuizQuestion } from '../types';

export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  const { profile, user } = useContext(AuthContext);

  const levelProgress = useMemo(
    () => calculateProgress(profile?.currentXP ?? 0, profile?.xpToNextLevel ?? 100),
    [profile?.currentXP, profile?.xpToNextLevel],
  );

  const dailyProgress = useMemo(
    () => calculateProgress(Math.min(profile?.dailyXPEarned ?? 0, 250), 250),
    [profile?.dailyXPEarned],
  );

  const dailyGoalReached = (profile?.dailyXPEarned ?? 0) >= 250;

  const unlockedAchievements = useMemo(
    () => profile?.achievements?.filter((a) => a.unlocked).length ?? 0,
    [profile?.achievements],
  );

  const addXP = useCallback(async (amount: number) => {
    if (!user?.uid || !user?.idToken) return;
    await firestoreService.addXP(user.uid, amount, user.idToken);
  }, [user?.uid, user?.idToken]);

  const spendGems = useCallback(async (amount: number) => {
    if (!user?.uid || !user?.idToken) return false;
    return firestoreService.spendGems(user.uid, amount, user.idToken);
  }, [user?.uid, user?.idToken]);

  const refillHearts = useCallback(async () => {
    if (!user?.uid || !user?.idToken) return false;
    return firestoreService.refillHearts(user.uid, user.idToken);
  }, [user?.uid, user?.idToken]);

  return { user: profile, uid: user?.uid ?? null, levelProgress, dailyProgress, dailyGoalReached, unlockedAchievements, addXP, spendGems, refillHearts };
}

interface LessonState {
  currentIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showResult: boolean;
  score: number;
  totalXP: number;
  isFinished: boolean;
}

export function useLesson(questions: QuizQuestion[]) {
  const { user, profile } = useContext(AuthContext);

  // Hearts Firebase'den geliyor, local state yok
  const hearts = profile?.hearts ?? 5;

  const [state, setState] = useState<LessonState>({
    currentIndex: 0,
    selectedAnswer: null,
    isCorrect: null,
    showResult: false,
    score: 0,
    totalXP: 0,
    isFinished: false,
  });

  const currentQuestion = questions[state.currentIndex];
  const progress = (state.currentIndex + (state.showResult ? 1 : 0)) / questions.length;
  const accuracy = questions.length > 0 ? Math.round((state.score / questions.length) * 100) : 0;
  const passed = hearts > 0;

  const selectAnswer = useCallback((answer: string) => {
    if (state.showResult) return;
    setState((prev) => ({ ...prev, selectedAnswer: answer }));
  }, [state.showResult]);

  const checkAnswer = useCallback(async () => {
    if (!state.selectedAnswer || !currentQuestion) return;
    const correct = state.selectedAnswer === currentQuestion.correctAnswer;

    setState((prev) => ({
      ...prev,
      isCorrect: correct,
      showResult: true,
      score: correct ? prev.score + 1 : prev.score,
      totalXP: correct ? prev.totalXP + (currentQuestion.xp ?? 10) : prev.totalXP,
    }));

    // Firebase'e yaz - hearts orada güncelleniyor
    if (user?.uid && user?.idToken) {
      if (correct) {
        await firestoreService.addXP(user.uid, currentQuestion.xp ?? 10, user.idToken);
      } else {
        await firestoreService.loseHeart(user.uid, user.idToken);
      }
    }
  }, [state.selectedAnswer, currentQuestion, user?.uid, user?.idToken]);

  const continueLesson = useCallback(() => {
    if (hearts <= 0 || state.currentIndex + 1 >= questions.length) {
      setState((prev) => ({ ...prev, isFinished: true }));
      return;
    }
    setState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      selectedAnswer: null,
      isCorrect: null,
      showResult: false,
    }));
  }, [hearts, state.currentIndex, questions.length]);

  const finishLesson = useCallback(async (lessonId: string) => {
    if (!user?.uid || !user?.idToken) return;
    await firestoreService.completeLesson(user.uid, lessonId, state.score, questions.length, user.idToken);
  }, [user?.uid, user?.idToken, state.score, questions.length]);

  return {
    ...state,
    hearts,
    currentQuestion,
    progress,
    accuracy,
    passed,
    selectAnswer,
    checkAnswer,
    continueLesson,
    finishLesson,
  };
}