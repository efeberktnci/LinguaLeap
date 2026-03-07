# LinguaLeap

Dil öğrenme uygulaması. React Native + Expo + TypeScript + Firebase.

Gerçek kullanıcı kaydı, oturum yönetimi, Firestore veritabanı ve canlı leaderboard ile çalışır.

## Teknolojiler

- **React Native** + **Expo SDK 50**
- **TypeScript** (strict mode)
- **Firebase Auth** — Kayıt, giriş, şifre sıfırlama
- **Cloud Firestore** — Kullanıcı verileri, ilerleme, leaderboard
- **React Navigation 6** — Auth flow + Bottom Tabs + Native Stack
- **Context API** — Auth state + real-time Firestore sync
- **Custom Hooks** — useAuth, useUser, useLesson
- **Jest** — Unit & component testler
- **ESLint + Prettier** — Kod kalitesi

## Kurulum

```bash
git clone https://github.com/KULLANICI_ADIN/LinguaLeap.git
cd LinguaLeap
npm install
```

Firebase kurulumu için **FIREBASE_SETUP.md** dosyasını takip et. Sonra:

```bash
npx expo start
```

## Mimari

```
src/
├── config/firebase.ts       # Firebase bağlantısı
├── context/AuthContext.tsx   # Auth state + Firestore sync
├── services/firestore.ts    # Tüm veritabanı işlemleri
├── hooks/index.ts           # useAuth, useUser, useLesson
├── types/index.ts           # Merkezi tip tanımları
├── navigation/
│   └── RootNavigator.tsx    # Auth flow (login/register ↔ ana uygulama)
├── screens/
│   ├── auth/                # Login, Register, ForgotPassword
│   ├── HomeScreen.tsx
│   ├── LearnScreen.tsx
│   ├── LessonScreen.tsx
│   ├── LeaderboardScreen.tsx
│   ├── ShopScreen.tsx
│   └── ProfileScreen.tsx
├── components/              # Yeniden kullanılabilir bileşenler
├── data/mockData.ts         # Ders içerikleri ve quiz soruları
├── theme/colors.ts
└── utils/helpers.ts
```

## Gerçek Zamanlı Özellikler

- Kayıt olunca Firestore'da profil oluşur
- XP kazanınca seviye, streak, haftalık grafik anlık güncellenir
- Quiz bitince ders ilerlemesi ve taçlar kaydedilir
- Leaderboard canlı güncellenir (onSnapshot)
- Başarılar otomatik açılır (7 gün streak, 1000 XP vs.)
- Can kaybetme, elmas harcama gerçek zamanlı

## Komutlar

```bash
npm start              # Expo dev server
npm test               # Jest testleri
npm run lint           # ESLint kontrolü
npm run format         # Prettier formatlama
npm run type-check     # TypeScript kontrol
```

## Lisans

MIT
