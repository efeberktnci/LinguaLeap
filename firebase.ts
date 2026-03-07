import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =====================================================
// FIREBASE KURULUMU:
// 1. https://console.firebase.google.com adresine git
// 2. Yeni proje oluştur (LinguaLeap)
// 3. Authentication → Sign-in method → Email/Password AÇ
// 4. Firestore Database → Create database → test mode
// 5. Project settings → Your apps → Web app ekle
// 6. Aşağıdaki bilgileri kendi bilgilerinle değiştir
// =====================================================

const firebaseConfig = {
  apiKey: 'BURAYA_API_KEY',
  authDomain: 'BURAYA_AUTH_DOMAIN.firebaseapp.com',
  projectId: 'BURAYA_PROJECT_ID',
  storageBucket: 'BURAYA_STORAGE_BUCKET.appspot.com',
  messagingSenderId: 'BURAYA_SENDER_ID',
  appId: 'BURAYA_APP_ID',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
