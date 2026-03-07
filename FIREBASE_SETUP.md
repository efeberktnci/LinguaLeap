# Firebase Kurulum Rehberi

## 1. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com) adresine git
2. "Add project" → proje adı: **LinguaLeap** → oluştur
3. Google Analytics opsiyonel, kapatabilirsin

## 2. Authentication Aç

1. Sol menüden **Authentication** seçin
2. **Get started** butonuna tıkla
3. Sign-in method sekmesinde **Email/Password** → aktif et → kaydet

## 3. Firestore Veritabanı Oluştur

1. Sol menüden **Firestore Database** seç
2. **Create database** → **Start in test mode** → konum seç → oluştur

### Güvenlik Kuralları (Production için)

Firestore Rules sekmesine git ve şunu yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /leaderboard/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4. Web App Ekle

1. Project settings (dişli ikon) → Your apps → Web (</>) ikonu
2. App nickname: **LinguaLeap** → Register app
3. Firebase config bilgilerini kopyala

## 5. Config Dosyasını Güncelle

`src/config/firebase.ts` dosyasını aç ve kendi bilgilerini yaz:

```typescript
const firebaseConfig = {
  apiKey: 'AIzaSy...',           // kendi key'in
  authDomain: 'lingualeap-xxxxx.firebaseapp.com',
  projectId: 'lingualeap-xxxxx',
  storageBucket: 'lingualeap-xxxxx.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc...',
};
```

## 6. Çalıştır

```bash
npm install
npx expo start
```

Artık kayıt olduğunda Firestore'da kullanıcı profili oluşur,
XP kazandığında gerçek zamanlı güncellenir,
leaderboard canlı çalışır.

## Firestore Veri Yapısı

```
users/
  {uid}/
    name, email, level, totalXP, currentXP, streak,
    hearts, gems, crowns, league, achievements[],
    weeklyXP[], completedLessons[], lessonProgress{}

leaderboard/
  {uid}/
    name, avatar, xp, league
```
