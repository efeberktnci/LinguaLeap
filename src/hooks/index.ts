import { useContext, useMemo, useCallback, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { calculateProgress } from '../utils/helpers';
import * as firestoreService from '../services/firestore';
import { AssessmentTier, LearnMode, QuizQuestion } from '../types';
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

  const savePlacementResult = useCallback(async (score: number, total: number, tier: AssessmentTier) => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.savePlacementResult(authUser.uid, score, total, tier, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const setActiveLearnMode = useCallback(async (mode: LearnMode) => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.setActiveLearnMode(authUser.uid, mode, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const setLearnTargetLanguage = useCallback(async (learnTargetLanguage: 'en' | 'de' | 'es' | 'tr') => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.setLearnTargetLanguage(authUser.uid, learnTargetLanguage, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const claimRewardChest = useCallback(async (chestId: string) => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.claimRewardChest(authUser.uid, chestId, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const claimBattlePassReward = useCallback(async (rewardId: string, gemReward: number) => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.claimBattlePassReward(authUser.uid, rewardId, gemReward, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const unlockBattlePassPremium = useCallback(async () => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.unlockBattlePassPremium(authUser.uid, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  const setLearnLevel = useCallback(async (cefrLevel: 'A0' | 'A1' | 'A2' | 'B1' | 'B2', unlockedCefrLevels: ('A0' | 'A1' | 'A2' | 'B1' | 'B2')[], placementPromptSeen = true) => {
    if (!authUser?.uid || !authUser?.idToken) return null;
    const profile = await firestoreService.setLearnLevel(authUser.uid, cefrLevel, unlockedCefrLevels, placementPromptSeen, authUser.idToken);
    await refreshProfile();
    return profile;
  }, [authUser?.uid, authUser?.idToken, refreshProfile]);

  
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
    savePlacementResult,
    setActiveLearnMode,
    setLearnTargetLanguage,
    claimRewardChest,
    claimBattlePassReward,
    unlockBattlePassPremium,
    setLearnLevel,
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
  forcedFinished: boolean;
}

export function useLesson(questions: QuizQuestion[], options: { disableHeartLoss?: boolean } = {}) {
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
    forcedFinished: false,
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

  const passed = hearts > 0 && (questions.length === 0 ? false : state.score / questions.length >= 0.5);

  const selectAnswer = useCallback(
    (answer: string) => {
      if (state.showResult) return;
      setState((prev) => ({ ...prev, selectedAnswer: answer }));
    },
    [state.showResult]
  );

  const checkAnswer = useCallback(async (answerOverride?: string) => {
    if (!currentQuestion) return;

    const submittedAnswer = answerOverride ?? state.selectedAnswer;
    const correct = submittedAnswer === currentQuestion.correctAnswer;

    setState((prev) => ({
      ...prev,
      selectedAnswer: submittedAnswer ?? prev.selectedAnswer,
      isCorrect: correct,
      showResult: true,
      score: correct ? prev.score + 1 : prev.score,
      totalXP: correct
        ? prev.totalXP + (currentQuestion.xp ?? 10)
        : prev.totalXP,
    }));

    if (user?.uid && user?.idToken) {
      await firestoreService.recordQuestionOutcome(
        user.uid,
        currentQuestion.focus,
        correct,
        user.idToken
      );

      if (correct) {
        await firestoreService.addXP(
          user.uid,
          currentQuestion.xp ?? 10,
          user.idToken
        );
      } else if (!options.disableHeartLoss) {
        await firestoreService.loseHeart(
          user.uid,
          user.idToken
        );
      }

      await refreshProfile();
    }
  }, [state.selectedAnswer, currentQuestion, user?.uid, user?.idToken, options.disableHeartLoss]);

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

  const forceFinish = useCallback(() => {
    setState((prev) => ({ ...prev, isFinished: true, forcedFinished: true, showResult: false }));
  }, []);

  const addBonusXP = useCallback(async (amount: number) => {
    if (!user?.uid || !user?.idToken || amount <= 0) return;
    await firestoreService.addXP(user.uid, amount, user.idToken);
    setState((prev) => ({ ...prev, totalXP: prev.totalXP + amount }));
    await refreshProfile();
  }, [user?.uid, user?.idToken, refreshProfile]);

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
        questions.map((question) => question.id),
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
    forceFinish,
    addBonusXP,
  };
}


export function useLanguage() {
  return useLanguageContext();
}
