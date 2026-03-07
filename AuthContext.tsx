import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserProfile } from '../types';
import { createUserProfile, getUserProfile, subscribeToUserProfile } from '../services/firestore';

interface AuthState {
  user: User | null;
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
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setState((prev) => ({ ...prev, user: firebaseUser, profile, loading: false }));
      } else {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!state.user) return;
    const unsub = subscribeToUserProfile(state.user.uid, (profile) => {
      setState((prev) => ({ ...prev, profile }));
    });
    return unsub;
  }, [state.user?.uid]);

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const msg = getErrorMessage(err.code);
      setState((prev) => ({ ...prev, loading: false, error: msg }));
    }
  };

  const signUp = async (email: string, password: string, name: string, username: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile = await createUserProfile(cred.user.uid, email, name, username);
      setState((prev) => ({ ...prev, profile, loading: false }));
    } catch (err: any) {
      const msg = getErrorMessage(err.code);
      setState((prev) => ({ ...prev, loading: false, error: msg }));
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setState({ user: null, profile: null, loading: false, error: null });
  };

  const resetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const msg = getErrorMessage(err.code);
      setState((prev) => ({ ...prev, error: msg }));
      throw err;
    }
  };

  const clearError = () => setState((prev) => ({ ...prev, error: null }));
  const setProfile = (profile: UserProfile) => setState((prev) => ({ ...prev, profile }));

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, resetPassword, clearError, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Bu e-posta zaten kullanılıyor.',
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
    'auth/user-not-found': 'Kullanıcı bulunamadı.',
    'auth/wrong-password': 'Yanlış şifre.',
    'auth/too-many-requests': 'Çok fazla deneme. Biraz bekle.',
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  };
  return messages[code] ?? 'Bir hata oluştu. Tekrar dene.';
}
