import { useContext, useMemo, useCallback, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { calculateProgress } from '../utils/helpers';
import * as firestoreService from '../services/firestore';
import { QuizQuestion } from '../types';
import { useLanguageContext } from '../context/LanguageContext';

export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  const { profile, user: authUser, refreshProfile } = useContext(AuthContext);

  const levelProgress = useMemo(
    () =>
      calculateProgress(
        profile?.currentXP ?? 0,
        profile?.xpToNextLevel ?? 100
      ),
    [profile?.currentXP, profile?.xpToNextLevel]
  );

  const dailyProgress = useMemo(
    () =>
      calculateProgress(
        Math.min(profile?.dailyXPEarned ?? 0, 250),
        250
      ),
    [profile?.dailyXPEarned]
  );

  const dailyGoalReached = (profile?.dailyXPEarned ?? 0) >= 250;

  const unlockedAchievements = useMemo(
    () => profile?.achievements?.filter((a) => a.unlocked).length ?? 0,
    [profile?.achievements]
  );

  const addXP = useCallback(async (amount: number) => {
    if (!authUser?.uid || !authUser?.idToken) return;
    await firestoreService.addXP(authUser.uid, amount, authUser.idToken);
  }, [authUser?.uid, authUser?.idToken]);

  const spendGems = useCallback(async (amount: number) => {
    if (!authUser?.uid || !authUser?.idToken) return false;
    return firestoreService.spendGems(authUser.uid, amount, authUser.idToken);
  }, [authUser?.uid, authUser?.idToken]);

  const refillHearts = useCallback(async () => {
    if (!authUser?.uid || !authUser?.idToken) return false;
    return firestoreService.refillHearts(authUser.uid, authUser.idToken);
  }, [authUser?.uid, authUser?.idToken]);

  
  const updateAvatar = useCallback(async (avatar: string) => {
    if (!authUser?.uid || !authUser?.idToken) return;
    await firestoreService.updateUserAvatar(authUser.uid, avatar, authUser.idToken);
    await refreshProfile();
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const resetStats = useCallback(async () => {
    if (!authUser?.uid || !authUser?.idToken) return;
    await firestoreService.resetUserStats(authUser.uid, authUser.idToken);
    await refreshProfile();
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  return {
    user: profile,
    profile,
    uid: authUser?.uid ?? null,
    levelProgress,
    dailyProgress,
    dailyGoalReached,
    unlockedAchievements,
    addXP,
    spendGems,
    refillHearts,
    updateAvatar,
    resetStats,
  };
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
  const { user, profile, refreshProfile } = useContext(AuthContext);

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

  const currentQuestion =
    questions && questions.length > 0
      ? questions[state.currentIndex] ?? null
      : null;

  const progress =
    (state.currentIndex + (state.showResult ? 1 : 0)) /
    questions.length;

  const accuracy =
    questions.length > 0
      ? Math.round((state.score / questions.length) * 100)
      : 0;

  const passed = hearts > 0;

  const selectAnswer = useCallback(
    (answer: string) => {
      if (state.showResult) return;
      setState((prev) => ({ ...prev, selectedAnswer: answer }));
    },
    [state.showResult]
  );

  const checkAnswer = useCallback(async () => {
    if (!currentQuestion) return;

    const correct =
      state.selectedAnswer === currentQuestion.correctAnswer;

    setState((prev) => ({
      ...prev,
      isCorrect: correct,
      showResult: true,
      score: correct ? prev.score + 1 : prev.score,
      totalXP: correct
        ? prev.totalXP + (currentQuestion.xp ?? 10)
        : prev.totalXP,
    }));

    if (user?.uid && user?.idToken) {
      if (correct) {
        await firestoreService.addXP(
          user.uid,
          currentQuestion.xp ?? 10,
          user.idToken
        );
      } else {
        await firestoreService.loseHeart(
          user.uid,
          user.idToken
        );
      }

      await refreshProfile();
    }
  }, [state.selectedAnswer, currentQuestion, user?.uid, user?.idToken]);

  const continueLesson = useCallback(() => {
    if (
      !questions ||
      hearts <= 0 ||
      state.currentIndex + 1 >= questions.length
    ) {
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

  const finishLesson = useCallback(
    async (lessonId: string) => {
      if (!user?.uid || !user?.idToken) return;

      const perfect = state.score === questions.length;

      await firestoreService.completeLesson(
        user.uid,
        lessonId,
        state.score,
        questions.length,
        perfect,
        user.idToken
      );
    },
    [user?.uid, user?.idToken, state.score, questions.length]
  );

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


export function useLanguage() {
  return useLanguageContext();
}





