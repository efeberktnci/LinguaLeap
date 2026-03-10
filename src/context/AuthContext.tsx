import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseApi from '../config/firebase';
import { UserProfile } from '../types';
import * as firestoreService from '../services/firestore';

interface AuthUser {
  uid: string;
  email: string;
  idToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  setProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  clearError: () => {},
  setProfile: () => {},
  refreshProfile: async () => {},
});

const STORAGE_KEY = 'lingualeap_auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadSavedAuth();
  }, []);

  // Her 30 saniyede profili yenile
  useEffect(() => {
    if (!state.user) return;
    const interval = setInterval(() => {
      refreshProfile();
    }, 30000);
    return () => clearInterval(interval);
  }, [state.user?.uid]);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    try {
      const profile = await firestoreService.getUserProfile(state.user.uid, state.user.idToken);
      if (profile) {
        setState((prev) => ({ ...prev, profile }));
      }
    } catch {
      return;
    }
  }, [state.user]);

  const loadSavedAuth = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const user: AuthUser = JSON.parse(saved);
        const tokens = await firebaseApi.refreshIdToken(user.refreshToken);
        const updatedUser = { ...user, idToken: tokens.idToken, refreshToken: tokens.refreshToken };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        const profile = await firestoreService.getUserProfile(updatedUser.uid, updatedUser.idToken);
        setState({ user: updatedUser, profile, loading: false, error: null });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setState({ user: null, profile: null, loading: false, error: null });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await firebaseApi.signIn(email, password);
      const user: AuthUser = { uid: result.uid, email: result.email, idToken: result.idToken, refreshToken: result.refreshToken };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      const profile = await firestoreService.getUserProfile(user.uid, user.idToken);
      setState({ user, profile, loading: false, error: null });
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: getErrorMessage(err.message) }));
    }
  };

  const signUp = async (email: string, password: string, name: string, username: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await firebaseApi.signUp(email, password);
      const user: AuthUser = { uid: result.uid, email: result.email, idToken: result.idToken, refreshToken: result.refreshToken };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      const profile = await firestoreService.createUserProfile(user.uid, email, name, username, user.idToken);
      setState({ user, profile, loading: false, error: null });
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: getErrorMessage(err.message) }));
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({ user: null, profile: null, loading: false, error: null });
  };

  const resetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await firebaseApi.resetPassword(email);
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: getErrorMessage(err.message) }));
      throw err;
    }
  };

  const clearError = () => setState((prev) => ({ ...prev, error: null }));
  const setProfile = (profile: UserProfile) => setState((prev) => ({ ...prev, profile }));

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, resetPassword, clearError, setProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'EMAIL_EXISTS': 'Bu e-posta zaten kullanılıyor.',
    'INVALID_EMAIL': 'Geçersiz e-posta adresi.',
    'WEAK_PASSWORD': 'Şifre en az 6 karakter olmalı.',
    'EMAIL_NOT_FOUND': 'Kullanıcı bulunamadı.',
    'INVALID_PASSWORD': 'Yanlış şifre.',
    'TOO_MANY_ATTEMPTS_TRY_LATER': 'Çok fazla deneme. Biraz bekle.',
    'INVALID_LOGIN_CREDENTIALS': 'E-posta veya şifre hatalı.',
  };

  for (const [key, msg] of Object.entries(messages)) {
    if (code.includes(key)) return msg;
  }

  return 'Bir hata oluştu. Tekrar dene.';
}
