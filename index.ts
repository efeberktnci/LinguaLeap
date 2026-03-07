import { useContext, useMemo, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { calculateProgress } from '../utils/helpers';
import * as firestoreService from '../services/firestore';
import { QuizQuestion } from '../types';
import { useState } from 'react';

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
    () => calculateProgress(profile?.dailyXPEarned ?? 0, profile?.dailyGoal ?? 50),
    [profile?.dailyXPEarned, profile?.dailyGoal],
  );

  const dailyGoalReached = dailyProgress >= 1;

  const unlockedAchievements = useMemo(
    () => profile?.achievements.filter((a) => a.unlocked).length ?? 0,
    [profile?.achievements],
  );

  const addXP = useCallback(
    async (amount: number) => {
      if (!user?.uid) return;
      await firestoreService.addXP(user.uid, amount);
    },
    [user?.uid],
  );

  const spendGems = useCallback(
    async (amount: number) => {
      if (!user?.uid) return false;
      return firestoreService.spendGems(user.uid, amount);
    },
    [user?.uid],
  );

  const refillHearts = useCallback(async () => {
    if (!user?.uid) return false;
    return firestoreService.refillHearts(user.uid);
  }, [user?.uid]);

  return {
    user: profile,
    uid: user?.uid ?? null,
    levelProgress,
    dailyProgress,
    dailyGoalReached,
    unlockedAchievements,
    addXP,
    spendGems,
    refillHearts,
  };
}

interface LessonState {
  currentIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showResult: boolean;
  score: number;
  hearts: number;
  totalXP: number;
  isFinished: boolean;
}

export function useLesson(questions: QuizQuestion[]) {
  const { user } = useContext(AuthContext);

  const [state, setState] = useState<LessonState>({
    currentIndex: 0,
    selectedAnswer: null,
    isCorrect: null,
    showResult: false,
    score: 0,
    hearts: 5,
    totalXP: 0,
    isFinished: false,
  });

  const currentQuestion = questions[state.currentIndex];
  const progress = (state.currentIndex + (state.showResult ? 1 : 0)) / questions.length;
  const accuracy = questions.length > 0 ? Math.round((state.score / questions.length) * 100) : 0;
  const passed = state.hearts > 0;

  const selectAnswer = useCallback(
    (answer: string) => {
      if (state.showResult) return;
      setState((prev) => ({ ...prev, selectedAnswer: answer }));
    },
    [state.showResult],
  );

  const checkAnswer = useCallback(async () => {
    if (!state.selectedAnswer || !currentQuestion) return;

    const correct = state.selectedAnswer === currentQuestion.correctAnswer;

    setState((prev) => ({
      ...prev,
      isCorrect: correct,
      showResult: true,
      score: correct ? prev.score + 1 : prev.score,
      totalXP: correct ? prev.totalXP + (currentQuestion.xp ?? 10) : prev.totalXP,
      hearts: correct ? prev.hearts : Math.max(prev.hearts - 1, 0),
    }));

    if (user?.uid) {
      if (correct) {
        await firestoreService.addXP(user.uid, currentQuestion.xp ?? 10);
      } else {
        await firestoreService.loseHeart(user.uid);
      }
    }
  }, [state.selectedAnswer, currentQuestion, user?.uid]);

  const continueLesson = useCallback(() => {
    if (state.hearts <= 0 || state.currentIndex + 1 >= questions.length) {
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
  }, [state.hearts, state.currentIndex, questions.length]);

  const finishLesson = useCallback(
    async (lessonId: string) => {
      if (!user?.uid) return;
      await firestoreService.completeLesson(user.uid, lessonId, state.score, questions.length);
    },
    [user?.uid, state.score, questions.length],
  );

  return {
    ...state,
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
