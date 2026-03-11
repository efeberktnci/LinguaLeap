import { AppLanguage } from '../i18n/translations';
import { AssessmentTier, CefrLevel, LearnMode, Lesson, QuizQuestion, Unit } from '../types';
import { UNITS } from './mockData';

export type LearnTargetLanguage = 'en' | 'de' | 'es' | 'tr';

export interface LearnLanguageOption {
  code: LearnTargetLanguage;
  flag: string;
  label: string;
}

export interface LearnModeCard {
  id: string;
  mode: LearnMode;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  timeLimitSec?: number;
  xpBoost: number;
}

export interface BattlePassTrackItem {
  rewardId: string;
  level: number;
  title: string;
  subtitle: string;
  icon: string;
  gems: number;
  premium: boolean;
  claimable: boolean;
  claimed: boolean;
  priceLabel?: string;
}

type DifficultyMeta = {
  label: string;
  description: string;
  unitOffset: number;
  questionCount: number;
  xpScale: number;
  challengeTimeLimit: number;
};

const DIFFICULTY_META: Record<AssessmentTier, DifficultyMeta> = {
  starter: {
    label: 'Baslangic Rotasi',
    description: 'Kisa cumleler ve temel kelimelerle sakin ilerleme.',
    unitOffset: 0,
    questionCount: 7,
    xpScale: 1,
    challengeTimeLimit: 75,
  },
  explorer: {
    label: 'Kesif Rotasi',
    description: 'Karma sorular, daha fazla dinleme ve hizli gecis.',
    unitOffset: 1,
    questionCount: 8,
    xpScale: 1.12,
    challengeTimeLimit: 68,
  },
  navigator: {
    label: 'Ileri Rotasi',
    description: 'Daha uzun cumleler ve daha yogun turler.',
    unitOffset: 2,
    questionCount: 9,
    xpScale: 1.24,
    challengeTimeLimit: 60,
  },
  master: {
    label: 'Ustalik Rotasi',
    description: 'Zor patternler, yogun dinleme ve baski altinda test.',
    unitOffset: 3,
    questionCount: 10,
    xpScale: 1.38,
    challengeTimeLimit: 52,
  },
};

export const CEFR_LEVELS: CefrLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2'];

const CEFR_TO_TIER: Record<CefrLevel, AssessmentTier> = {
  A0: 'starter',
  A1: 'explorer',
  A2: 'explorer',
  B1: 'navigator',
  B2: 'master',
};

export const LEARN_LANGUAGE_OPTIONS: LearnLanguageOption[] = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'English' },
  { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', label: 'Deutsch' },
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', label: 'Español' },
  { code: 'tr', flag: '\u{1F1F9}\u{1F1F7}', label: 'Türkçe' },
];

export const LEARN_MODE_CARDS: Record<LearnMode, LearnModeCard[]> = {
  standard: [
    { id: 'standard_path', mode: 'standard', title: 'Standard Path', subtitle: 'Bolum bolum ilerle, crown topla.', icon: '📚', badge: 'Ana Mod', xpBoost: 1 },
    { id: 'standard_pronounce', mode: 'standard', title: 'Speak Mix', subtitle: 'Telaffuz agirlikli mini rota.', icon: '🎙️', badge: 'Speech', xpBoost: 1.15 },
    { id: 'story_cafe', mode: 'standard', title: 'Cafe Story', subtitle: 'Kisa hikaye ve anlama sorulari.', icon: '☕', badge: 'Story', xpBoost: 1.2 },
    { id: 'conversation_checkin', mode: 'standard', title: 'Hotel Check-in', subtitle: 'Mini diyalog akisinda cevap ver.', icon: '💬', badge: 'Talk', xpBoost: 1.22 },
  ],
  timed: [
    { id: 'timed_rush', mode: 'timed', title: '60s Rush', subtitle: 'Sure bitmeden maksimum dogru yap.', icon: '⚡', badge: 'Carpan', timeLimitSec: 60, xpBoost: 1.6 },
    { id: 'timed_combo', mode: 'timed', title: 'Combo Sprint', subtitle: 'Hatayi azalt, carpan katlansin.', icon: '⏱️', badge: 'Hiz', timeLimitSec: 72, xpBoost: 1.8 },
  ],
  review: [
    { id: 'review_mistakes', mode: 'review', title: 'Mistake Lab', subtitle: 'Zorlandigin soru tiplerini karisik tekrar et.', icon: '🧠', badge: 'Tekrar', xpBoost: 1.2 },
    { id: 'review_listen', mode: 'review', title: 'Listening Repair', subtitle: 'Dinleme ve anlamayi temizle.', icon: '🎧', badge: 'Review', xpBoost: 1.15 },
    { id: 'review_notebook', mode: 'review', title: 'Notebook Run', subtitle: 'En cok yanlis yaptigin kelimelere odaklan.', icon: '📝', badge: 'Focus', xpBoost: 1.18 },
  ],
  boss: [
    { id: 'boss_gate', mode: 'boss', title: 'Boss Gate', subtitle: 'Karismik ve sert final sorulari.', icon: '🏆', badge: 'Boss', timeLimitSec: 90, xpBoost: 2.1 },
    { id: 'boss_survival', mode: 'boss', title: 'Survival Ladder', subtitle: 'Arka arkaya dogruyla yuksel.', icon: '🔥', badge: 'Elite', timeLimitSec: 75, xpBoost: 2.3 },
  ],
};

const UNIT_COPY: Record<LearnTargetLanguage, Record<string, { title: string; description: string }>> = {
  en: {
    unit_1: { title: 'Basic Phrases', description: 'Greetings and introductions' },
    unit_2: { title: 'Food & Drinks', description: 'Ordering and daily food words' },
    unit_3: { title: 'Family & Relations', description: 'Talking about people close to you' },
    unit_4: { title: 'Travel', description: 'Directions and transportation' },
    unit_5: { title: 'Shopping', description: 'Store communication and prices' },
    unit_6: { title: 'Daily Routine', description: 'Common actions through the day' },
    unit_7: { title: 'Work & Education', description: 'Office and school language' },
  },
  de: {
    unit_1: { title: 'Grundlagen', description: 'Begrüßung und Vorstellung' },
    unit_2: { title: 'Essen und Trinken', description: 'Bestellen und Alltagssprache' },
    unit_3: { title: 'Familie und Beziehungen', description: 'Über nahestehende Personen sprechen' },
    unit_4: { title: 'Reisen', description: 'Richtungen und Verkehr' },
    unit_5: { title: 'Einkaufen', description: 'Kommunikation im Laden und Preise' },
    unit_6: { title: 'Tagesablauf', description: 'Tägliche Gewohnheiten und Aktivitäten' },
    unit_7: { title: 'Arbeit und Bildung', description: 'Sprache im Büro und in der Schule' },
  },
  es: {
    unit_1: { title: 'Frases Básicas', description: 'Saludos y presentaciones' },
    unit_2: { title: 'Comida y Bebida', description: 'Pedidos y palabras del día a día' },
    unit_3: { title: 'Familia y Relaciones', description: 'Hablar de personas cercanas' },
    unit_4: { title: 'Viajes', description: 'Direcciones y transporte' },
    unit_5: { title: 'Compras', description: 'Comunicación en tienda y precios' },
    unit_6: { title: 'Rutina Diaria', description: 'Acciones comunes durante el día' },
    unit_7: { title: 'Trabajo y Educación', description: 'Lenguaje de oficina y escuela' },
  },
  tr: {
    unit_1: { title: 'Temel Kalıplar', description: 'Selamlaşma ve tanışma' },
    unit_2: { title: 'Yiyecek ve İçecek', description: 'Sipariş ve günlük yiyecek kelimeleri' },
    unit_3: { title: 'Aile ve İlişkiler', description: 'Yakın çevrenden insanlardan bahsetme' },
    unit_4: { title: 'Seyahat', description: 'Yön sorma ve ulaşım' },
    unit_5: { title: 'Alışveriş', description: 'Mağazada iletişim ve fiyatlar' },
    unit_6: { title: 'Günlük Rutin', description: 'Gün içinde yaptığımız temel işler' },
    unit_7: { title: 'İş ve Eğitim', description: 'Ofis ve okul konuşmaları' },
  },
};

const LESSON_COPY: Record<LearnTargetLanguage, Record<string, string>> = {
  en: {
    lesson_1_1: 'Greetings', lesson_1_2: 'Introduce Yourself', lesson_1_3: 'Goodbye', lesson_1_4: 'Unit Test', lesson_1_5: 'Practice',
    lesson_2_1: 'Fruits', lesson_2_2: 'Drinks', lesson_2_3: 'Restaurant', lesson_2_4: 'Practice', lesson_2_5: 'Unit Test',
    lesson_3_1: 'Family', lesson_3_2: 'Friends', lesson_3_3: 'Emotions', lesson_3_4: 'Practice', lesson_3_5: 'Unit Test',
    lesson_4_1: 'Transport', lesson_4_2: 'Directions', lesson_4_3: 'Hotel', lesson_4_4: 'Unit Test', lesson_4_5: 'Practice',
    lesson_5_1: 'Colors', lesson_5_2: 'Clothes', lesson_5_3: 'Prices', lesson_5_4: 'Practice', lesson_5_5: 'Unit Test',
    lesson_6_1: 'Morning', lesson_6_2: 'Daily Plan', lesson_6_3: 'Habits', lesson_6_4: 'Practice', lesson_6_5: 'Unit Test',
    lesson_7_1: 'Office', lesson_7_2: 'Meetings', lesson_7_3: 'School', lesson_7_4: 'Practice', lesson_7_5: 'Unit Test',
  },
  de: {
    lesson_1_1: 'Begrüßung', lesson_1_2: 'Vorstellung', lesson_1_3: 'Verabschiedung', lesson_1_4: 'Einheitstest', lesson_1_5: 'Übung',
    lesson_2_1: 'Früchte', lesson_2_2: 'Getränke', lesson_2_3: 'Restaurant', lesson_2_4: 'Übung', lesson_2_5: 'Einheitstest',
    lesson_3_1: 'Familie', lesson_3_2: 'Freunde', lesson_3_3: 'Gefühle', lesson_3_4: 'Übung', lesson_3_5: 'Einheitstest',
    lesson_4_1: 'Verkehr', lesson_4_2: 'Richtungen', lesson_4_3: 'Hotel', lesson_4_4: 'Einheitstest', lesson_4_5: 'Übung',
    lesson_5_1: 'Farben', lesson_5_2: 'Kleidung', lesson_5_3: 'Preise', lesson_5_4: 'Übung', lesson_5_5: 'Einheitstest',
    lesson_6_1: 'Morgen', lesson_6_2: 'Tagesplan', lesson_6_3: 'Gewohnheiten', lesson_6_4: 'Übung', lesson_6_5: 'Einheitstest',
    lesson_7_1: 'Büro', lesson_7_2: 'Besprechung', lesson_7_3: 'Schule', lesson_7_4: 'Übung', lesson_7_5: 'Einheitstest',
  },
  es: {
    lesson_1_1: 'Saludos', lesson_1_2: 'Presentarte', lesson_1_3: 'Despedidas', lesson_1_4: 'Prueba de Unidad', lesson_1_5: 'Práctica',
    lesson_2_1: 'Frutas', lesson_2_2: 'Bebidas', lesson_2_3: 'Restaurante', lesson_2_4: 'Práctica', lesson_2_5: 'Prueba de Unidad',
    lesson_3_1: 'Familia', lesson_3_2: 'Amigos', lesson_3_3: 'Emociones', lesson_3_4: 'Práctica', lesson_3_5: 'Prueba de Unidad',
    lesson_4_1: 'Transporte', lesson_4_2: 'Direcciones', lesson_4_3: 'Hotel', lesson_4_4: 'Prueba de Unidad', lesson_4_5: 'Práctica',
    lesson_5_1: 'Colores', lesson_5_2: 'Ropa', lesson_5_3: 'Precios', lesson_5_4: 'Práctica', lesson_5_5: 'Prueba de Unidad',
    lesson_6_1: 'Mañana', lesson_6_2: 'Plan Diario', lesson_6_3: 'Hábitos', lesson_6_4: 'Práctica', lesson_6_5: 'Prueba de Unidad',
    lesson_7_1: 'Oficina', lesson_7_2: 'Reunión', lesson_7_3: 'Escuela', lesson_7_4: 'Práctica', lesson_7_5: 'Prueba de Unidad',
  },
  tr: {
    lesson_1_1: 'Selamlaşma', lesson_1_2: 'Kendini Tanıt', lesson_1_3: 'Vedalaşma', lesson_1_4: 'Ünite Testi', lesson_1_5: 'Pratik',
    lesson_2_1: 'Meyveler', lesson_2_2: 'İçecekler', lesson_2_3: 'Restoran', lesson_2_4: 'Pratik', lesson_2_5: 'Ünite Testi',
    lesson_3_1: 'Aile', lesson_3_2: 'Arkadaşlar', lesson_3_3: 'Duygular', lesson_3_4: 'Pratik', lesson_3_5: 'Ünite Testi',
    lesson_4_1: 'Ulaşım', lesson_4_2: 'Yönler', lesson_4_3: 'Otel', lesson_4_4: 'Ünite Testi', lesson_4_5: 'Pratik',
    lesson_5_1: 'Renkler', lesson_5_2: 'Kıyafetler', lesson_5_3: 'Fiyatlar', lesson_5_4: 'Pratik', lesson_5_5: 'Ünite Testi',
    lesson_6_1: 'Sabah', lesson_6_2: 'Günlük Plan', lesson_6_3: 'Alışkanlıklar', lesson_6_4: 'Pratik', lesson_6_5: 'Ünite Testi',
    lesson_7_1: 'Ofis', lesson_7_2: 'Toplantı', lesson_7_3: 'Okul', lesson_7_4: 'Pratik', lesson_7_5: 'Ünite Testi',
  },
};

const PHRASES: Record<string, Record<LearnTargetLanguage, string>> = {
  hello: { tr: 'Merhaba', en: 'Hello', de: 'Hallo', es: 'Hola' },
  bye: { tr: 'Görüşürüz', en: 'See you', de: 'Bis bald', es: 'Hasta luego' },
  my_name: { tr: 'Benim adım', en: 'My name is', de: 'Ich heiße', es: 'Me llamo' },
  please: { tr: 'Lütfen', en: 'Please', de: 'Bitte', es: 'Por favor' },
  thanks: { tr: 'Teşekkür ederim', en: 'Thank you', de: 'Danke', es: 'Gracias' },
  sorry: { tr: 'Üzgünüm', en: 'Sorry', de: 'Entschuldigung', es: 'Lo siento' },
  water: { tr: 'Su', en: 'Water', de: 'Wasser', es: 'Agua' },
  bread: { tr: 'Ekmek', en: 'Bread', de: 'Brot', es: 'Pan' },
  apple: { tr: 'Elma', en: 'Apple', de: 'Apfel', es: 'Manzana' },
  coffee: { tr: 'Kahve', en: 'Coffee', de: 'Kaffee', es: 'Café' },
  tea: { tr: 'Çay', en: 'Tea', de: 'Tee', es: 'Té' },
  menu: { tr: 'Menü', en: 'Menu', de: 'Speisekarte', es: 'Menú' },
  mother: { tr: 'Anne', en: 'Mother', de: 'Mutter', es: 'Madre' },
  father: { tr: 'Baba', en: 'Father', de: 'Vater', es: 'Padre' },
  friend: { tr: 'Arkadaş', en: 'Friend', de: 'Freund', es: 'Amigo' },
  happy: { tr: 'Mutlu', en: 'Happy', de: 'Glücklich', es: 'Feliz' },
  family: { tr: 'Aile', en: 'Family', de: 'Familie', es: 'Familia' },
  child: { tr: 'Çocuk', en: 'Child', de: 'Kind', es: 'Niño' },
  station: { tr: 'İstasyon', en: 'Station', de: 'Bahnhof', es: 'Estación' },
  hotel: { tr: 'Otel', en: 'Hotel', de: 'Hotel', es: 'Hotel' },
  right: { tr: 'Sağa', en: 'Right', de: 'Rechts', es: 'Derecha' },
  ticket: { tr: 'Bilet', en: 'Ticket', de: 'Ticket', es: 'Boleto' },
  airport: { tr: 'Havalimanı', en: 'Airport', de: 'Flughafen', es: 'Aeropuerto' },
  bus: { tr: 'Otobüs', en: 'Bus', de: 'Bus', es: 'Autobús' },
  red: { tr: 'Kırmızı', en: 'Red', de: 'Rot', es: 'Rojo' },
  shirt: { tr: 'Gömlek', en: 'Shirt', de: 'Hemd', es: 'Camisa' },
  cheap: { tr: 'Ucuz', en: 'Cheap', de: 'Günstig', es: 'Barato' },
  price: { tr: 'Fiyat', en: 'Price', de: 'Preis', es: 'Precio' },
  shoes: { tr: 'Ayakkabı', en: 'Shoes', de: 'Schuhe', es: 'Zapatos' },
  market: { tr: 'Pazar', en: 'Market', de: 'Markt', es: 'Mercado' },
  morning: { tr: 'Sabah', en: 'Morning', de: 'Morgen', es: 'Mañana' },
  evening: { tr: 'Akşam', en: 'Evening', de: 'Abend', es: 'Noche' },
  breakfast: { tr: 'Kahvaltı', en: 'Breakfast', de: 'Frühstück', es: 'Desayuno' },
  work: { tr: 'Çalışmak', en: 'Work', de: 'Arbeiten', es: 'Trabajar' },
  study: { tr: 'Ders çalışmak', en: 'Study', de: 'Lernen', es: 'Estudiar' },
  sleep: { tr: 'Uyumak', en: 'Sleep', de: 'Schlafen', es: 'Dormir' },
  meeting: { tr: 'Toplantı', en: 'Meeting', de: 'Besprechung', es: 'Reunión' },
  office: { tr: 'Ofis', en: 'Office', de: 'Büro', es: 'Oficina' },
  teacher: { tr: 'Öğretmen', en: 'Teacher', de: 'Lehrer', es: 'Profesor' },
  student: { tr: 'Öğrenci', en: 'Student', de: 'Schüler', es: 'Estudiante' },
  project: { tr: 'Proje', en: 'Project', de: 'Projekt', es: 'Proyecto' },
  exam: { tr: 'Sınav', en: 'Exam', de: 'Prüfung', es: 'Examen' },
};

const UNIT_VOCAB: Record<number, string[]> = {
  1: ['hello', 'bye', 'my_name', 'please', 'thanks', 'sorry'],
  2: ['water', 'bread', 'apple', 'coffee', 'tea', 'menu'],
  3: ['mother', 'father', 'friend', 'happy', 'family', 'child'],
  4: ['station', 'hotel', 'right', 'ticket', 'airport', 'bus'],
  5: ['red', 'shirt', 'cheap', 'price', 'shoes', 'market'],
  6: ['morning', 'evening', 'breakfast', 'work', 'study', 'sleep'],
  7: ['meeting', 'office', 'teacher', 'student', 'project', 'exam'],
};

const UI_COPY: Record<AppLanguage, {
  translateWord: (word: string, toName: string) => string;
  chooseCorrect: (word: string, toName: string) => string;
  translateSentence: (toName: string) => string;
  fillBlank: string;
  listenPrompt: string;
  pronouncePrompt: (toName: string) => string;
  langName: Record<LearnTargetLanguage, string>;
}> = {
  tr: {
    translateWord: (word, toName) => `"${word}" ifadesini ${toName} diline cevir`,
    chooseCorrect: (word, toName) => `"${word}" icin dogru ${toName} karsiligini sec`,
    translateSentence: (toName) => `Cumleyi ${toName} diline cevir`,
    fillBlank: 'Boslugu dogru kelimeyle tamamla',
    listenPrompt: 'Hoparlore dokun, dinle ve dogru cevabi sec',
    pronouncePrompt: (toName) => `${toName} kelimeyi dogru telaffuz et`,
    langName: { tr: 'Turkce', en: 'Ingilizce', de: 'Almanca', es: 'Ispanyolca' },
  },
  en: {
    translateWord: (word, toName) => `Translate "${word}" to ${toName}`,
    chooseCorrect: (word, toName) => `Choose the correct ${toName} translation for "${word}"`,
    translateSentence: (toName) => `Translate the sentence to ${toName}`,
    fillBlank: 'Complete the blank with the correct word',
    listenPrompt: 'Tap the speaker, listen, then choose the correct answer',
    pronouncePrompt: (toName) => `Pronounce the ${toName} word into the microphone`,
    langName: { tr: 'Turkish', en: 'English', de: 'German', es: 'Spanish' },
  },
  de: {
    translateWord: (word, toName) => `Ubersetze "${word}" auf ${toName}`,
    chooseCorrect: (word, toName) => `Wahle die richtige ${toName}-Ubersetzung fur "${word}"`,
    translateSentence: (toName) => `Ubersetze den Satz auf ${toName}`,
    fillBlank: 'Ergänze die Lücke mit dem richtigen Wort',
    listenPrompt: 'Tippe auf den Lautsprecher, hore zu und wähle die richtige Antwort',
    pronouncePrompt: (toName) => `Sprich das ${toName}-Wort ins Mikrofon`,
    langName: { tr: 'Turkisch', en: 'Englisch', de: 'Deutsch', es: 'Spanisch' },
  },
  es: {
    translateWord: (word, toName) => `Traduce "${word}" a ${toName}`,
    chooseCorrect: (word, toName) => `Elige la traduccion correcta en ${toName} para "${word}"`,
    translateSentence: (toName) => `Traduce la oracion a ${toName}`,
    fillBlank: 'Completa el espacio con la palabra correcta',
    listenPrompt: 'Toca el altavoz, escucha y elige la respuesta correcta',
    pronouncePrompt: (toName) => `Pronuncia la palabra en ${toName} usando el microfono`,
    langName: { tr: 'Turco', en: 'Ingles', de: 'Aleman', es: 'Espanol' },
  },
};

type QuestionOptions = {
  tier?: AssessmentTier;
  mode?: LearnMode;
  recentQuestionIds?: string[];
  seed?: string;
  weakFocuses?: string[];
};

const seeded = (seed: string, offset = 0) => {
  let n = 0;
  for (let i = 0; i < seed.length; i += 1) n += seed.charCodeAt(i) * (i + 7);
  return (n + offset * 97) % 999983;
};

const sortBySeed = <T,>(items: T[], seed: string) =>
  [...items].sort((a, b) => seeded(`${seed}:${JSON.stringify(a)}`) - seeded(`${seed}:${JSON.stringify(b)}`));

const getSpeechLanguageCode = (language: LearnTargetLanguage) => {
  if (language === 'de') return 'de-DE';
  if (language === 'es') return 'es-ES';
  if (language === 'tr') return 'tr-TR';
  return 'en-US';
};

const getSourceLang = (uiLanguage: AppLanguage, targetLanguage: LearnTargetLanguage): LearnTargetLanguage => {
  if (uiLanguage === targetLanguage) return targetLanguage === 'en' ? 'tr' : 'en';
  return uiLanguage as LearnTargetLanguage;
};

const parseLessonMeta = (lessonId: string) => {
  const [, unitRaw, lessonRaw] = lessonId.split('_');
  return {
    unitNo: Number(unitRaw) || 1,
    lessonNo: Number(lessonRaw) || 1,
  };
};

const buildOptions = (correct: string, candidatePool: string[], seed: string) => {
  const unique = Array.from(new Set(candidatePool.filter((item) => item && item !== correct)));
  const distractors = sortBySeed(unique, seed).slice(0, 3);
  return sortBySeed([correct, ...distractors], `${seed}:options`);
};

const getNaturalExample = (key: string, lang: LearnTargetLanguage, term: string) => {
  switch (key) {
    case 'hello':
      return lang === 'tr' ? `Yeni biriyle tanisinca "${term}" dersin.` : lang === 'en' ? `You say "${term}" when you meet someone.` : lang === 'de' ? `Du sagst "${term}", wenn du jemanden triffst.` : `Dices "${term}" cuando conoces a alguien.`;
    case 'bye':
      return lang === 'tr' ? `Ayrilirken "${term}" demek dogaldir.` : lang === 'en' ? `It is natural to say "${term}" when you leave.` : lang === 'de' ? `Beim Weggehen ist "${term}" passend.` : `Es natural decir "${term}" al irte.`;
    case 'my_name':
      return lang === 'tr' ? `Kendini tanitirken "${term} Efe." diyebilirsin.` : lang === 'en' ? `When introducing yourself, you can say "${term} Efe."` : lang === 'de' ? `Beim Vorstellen kannst du "${term} Efe." sagen.` : `Al presentarte puedes decir "${term} Efe."`;
    case 'please':
      return lang === 'tr' ? `Bir sey isterken "${term}" kullanilir.` : lang === 'en' ? `"${term}" is used when asking for something.` : lang === 'de' ? `"${term}" benutzt man, wenn man um etwas bittet.` : `"${term}" se usa al pedir algo.`;
    case 'thanks':
      return lang === 'tr' ? `Birisi yardim edince "${term}" dersin.` : lang === 'en' ? `You say "${term}" when someone helps you.` : lang === 'de' ? `Du sagst "${term}", wenn dir jemand hilft.` : `Dices "${term}" cuando alguien te ayuda.`;
    case 'sorry':
      return lang === 'tr' ? `Kucuk bir hata yaptiginda "${term}" dersin.` : lang === 'en' ? `You say "${term}" after a small mistake.` : lang === 'de' ? `Nach einem kleinen Fehler sagst du "${term}".` : `Dices "${term}" despues de un pequeno error.`;
    case 'water':
      return lang === 'tr' ? `Masada bir bardak "${term}" var.` : lang === 'en' ? `There is a glass of "${term}" on the table.` : lang === 'de' ? `Auf dem Tisch steht ein Glas "${term}".` : `Hay un vaso de "${term}" en la mesa.`;
    case 'bread':
      return lang === 'tr' ? `Kahvaltida biraz "${term}" aliyorum.` : lang === 'en' ? `I am taking some "${term}" for breakfast.` : lang === 'de' ? `Zum Fruhstuck nehme ich etwas "${term}".` : `Tomo algo de "${term}" para el desayuno.`;
    case 'apple':
      return lang === 'tr' ? `Cantamda bir "${term}" tasiyorum.` : lang === 'en' ? `I carry an "${term}" in my bag.` : lang === 'de' ? `Ich habe einen "${term}" in meiner Tasche.` : `Llevo una "${term}" en mi bolso.`;
    case 'coffee':
      return lang === 'tr' ? `Sabah bir fincan "${term}" iyi gelir.` : lang === 'en' ? `A cup of "${term}" feels good in the morning.` : lang === 'de' ? `Am Morgen tut eine Tasse "${term}" gut.` : `Una taza de "${term}" viene bien por la manana.`;
    case 'tea':
      return lang === 'tr' ? `Aksam olunca sicak "${term}" isterim.` : lang === 'en' ? `In the evening I want hot "${term}".` : lang === 'de' ? `Am Abend mochte ich heissen "${term}".` : `Por la tarde quiero "${term}" caliente.`;
    case 'menu':
      return lang === 'tr' ? `Restoranda once "${term}" isteriz.` : lang === 'en' ? `At the restaurant we ask for the "${term}" first.` : lang === 'de' ? `Im Restaurant fragen wir zuerst nach der "${term}".` : `En el restaurante primero pedimos el "${term}".`;
    case 'mother':
      return lang === 'tr' ? `Benim "${term}" cok iyi yemek yapar.` : lang === 'en' ? `My "${term}" cooks very well.` : lang === 'de' ? `Meine "${term}" kocht sehr gut.` : `Mi "${term}" cocina muy bien.`;
    case 'father':
      return lang === 'tr' ? `Bugun "${term}" ile disari ciktim.` : lang === 'en' ? `Today I went out with my "${term}".` : lang === 'de' ? `Heute war ich mit meinem "${term}" draussen.` : `Hoy sali con mi "${term}".`;
    case 'friend':
      return lang === 'tr' ? `En yakin "${term}" burada oturuyor.` : lang === 'en' ? `My closest "${term}" lives here.` : lang === 'de' ? `Mein bester "${term}" wohnt hier.` : `Mi mejor "${term}" vive aqui.`;
    case 'happy':
      return lang === 'tr' ? `Guzel bir haber alinca "${term}" hissedersin.` : lang === 'en' ? `Good news makes you feel "${term}".` : lang === 'de' ? `Gute Nachrichten lassen dich "${term}" fuhlen.` : `Una buena noticia te hace sentir "${term}".`;
    case 'family':
      return lang === 'tr' ? `Hafta sonu tum "${term}" bir araya gelir.` : lang === 'en' ? `The whole "${term}" gets together on weekends.` : lang === 'de' ? `Am Wochenende kommt die ganze "${term}" zusammen.` : `Toda la "${term}" se reune el fin de semana.`;
    case 'child':
      return lang === 'tr' ? `Parkta kosan bir "${term}" goruyorum.` : lang === 'en' ? `I see a "${term}" running in the park.` : lang === 'de' ? `Ich sehe ein "${term}" im Park laufen.` : `Veo a un "${term}" corriendo en el parque.`;
    case 'station':
      return lang === 'tr' ? `Tren icin "${term}" gitmemiz gerekiyor.` : lang === 'en' ? `We need to go to the "${term}" for the train.` : lang === 'de' ? `Fur den Zug mussen wir zum "${term}".` : `Necesitamos ir a la "${term}" para el tren.`;
    case 'hotel':
      return lang === 'tr' ? `Bu gece bir "${term}" kalacagiz.` : lang === 'en' ? `Tonight we will stay in a "${term}".` : lang === 'de' ? `Heute Nacht ubernachten wir im "${term}".` : `Esta noche nos quedaremos en un "${term}".`;
    case 'right':
      return lang === 'tr' ? `Koseye gelince "${term}" don.` : lang === 'en' ? `Turn "${term}" when you reach the corner.` : lang === 'de' ? `Biege an der Ecke "${term}" ab.` : `Gira a la "${term}" al llegar a la esquina.`;
    case 'ticket':
      return lang === 'tr' ? `Otobuse binmeden once "${term}" al.` : lang === 'en' ? `Buy a "${term}" before you board the bus.` : lang === 'de' ? `Kaufe ein "${term}", bevor du in den Bus steigst.` : `Compra un "${term}" antes de subir al autobus.`;
    case 'airport':
      return lang === 'tr' ? `Sabah erkenden "${term}" gidecegiz.` : lang === 'en' ? `We will go to the "${term}" early in the morning.` : lang === 'de' ? `Am fruhen Morgen fahren wir zum "${term}".` : `Iremos al "${term}" temprano por la manana.`;
    case 'bus':
      return lang === 'tr' ? `Bu "${term}" merkeze gidiyor.` : lang === 'en' ? `This "${term}" goes to the city center.` : lang === 'de' ? `Dieser "${term}" fahrt ins Zentrum.` : `Este "${term}" va al centro.`;
    case 'red':
      return lang === 'tr' ? `Bugun "${term}" bir ceket giydim.` : lang === 'en' ? `Today I wore a "${term}" jacket.` : lang === 'de' ? `Heute trage ich eine "${term}" Jacke.` : `Hoy llevo una chaqueta "${term}".`;
    case 'shirt':
      return lang === 'tr' ? `Dolapta yeni bir "${term}" var.` : lang === 'en' ? `There is a new "${term}" in the closet.` : lang === 'de' ? `Im Schrank hangt ein neues "${term}".` : `Hay una "${term}" nueva en el armario.`;
    case 'cheap':
      return lang === 'tr' ? `Bu urun sandigimdan daha "${term}".` : lang === 'en' ? `This product is more "${term}" than I expected.` : lang === 'de' ? `Dieses Produkt ist "${term}" als ich dachte.` : `Este producto es mas "${term}" de lo que esperaba.`;
    case 'price':
      return lang === 'tr' ? `Bu urunun "${term}" nedir?` : lang === 'en' ? `What is the "${term}" of this item?` : lang === 'de' ? `Wie hoch ist der "${term}" fur diesen Artikel?` : `Cual es el "${term}" de este articulo?`;
    case 'shoes':
      return lang === 'tr' ? `Yeni "${term}" yuruyus icin rahat.` : lang === 'en' ? `The new "${term}" are comfortable for walking.` : lang === 'de' ? `Die neuen "${term}" sind bequem zum Laufen.` : `Los "${term}" nuevos son comodos para caminar.`;
    case 'market':
      return lang === 'tr' ? `Aksamustu "${term}" ugrayacagim.` : lang === 'en' ? `I will stop by the "${term}" this evening.` : lang === 'de' ? `Am Abend gehe ich noch zum "${term}".` : `Pasare por el "${term}" esta tarde.`;
    case 'morning':
      return lang === 'tr' ? `Ben genelde erken "${term}" kalkarim.` : lang === 'en' ? `I usually wake up early in the "${term}".` : lang === 'de' ? `Ich stehe normalerweise fruh am "${term} auf.` : `Normalmente me levanto temprano por la "${term}".`;
    case 'evening':
      return lang === 'tr' ? `Bugun "${term}" yuruyuse cikacagim.` : lang === 'en' ? `This "${term}" I will go for a walk.` : lang === 'de' ? `Heute "${term} gehe ich spazieren.` : `Esta "${term} saldre a caminar.`;
    case 'breakfast':
      return lang === 'tr' ? `Her gun hafif bir "${term}" yaparim.` : lang === 'en' ? `I have a light "${term}" every day.` : lang === 'de' ? `Ich esse jeden Tag ein leichtes "${term}".` : `Tomo un "${term}" ligero cada dia.`;
    case 'work':
      return lang === 'tr' ? `Saat dokuzda "${term}" baslarim.` : lang === 'en' ? `I start "${term}" at nine o'clock.` : lang === 'de' ? `Um neun Uhr beginne ich mit der "${term}.` : `Empiezo el "${term}" a las nueve.`;
    case 'study':
      return lang === 'tr' ? `Aksam yemeginden sonra "${term}" iyi gidiyor.` : lang === 'en' ? `After dinner, some "${term}" goes well.` : lang === 'de' ? `Nach dem Abendessen tut etwas "${term}" gut.` : `Despues de cenar viene bien un poco de "${term}".`;
    case 'sleep':
      return lang === 'tr' ? `Gece gec olmadan "${term}" istiyorum.` : lang === 'en' ? `Before it gets late, I want to "${term}".` : lang === 'de' ? `Bevor es spat wird, mochte ich "${term}.` : `Antes de que sea tarde, quiero "${term}".`;
    case 'meeting':
      return lang === 'tr' ? `On birde bir "${term}" var.` : lang === 'en' ? `There is a "${term}" at eleven.` : lang === 'de' ? `Um elf Uhr ist ein "${term}.` : `Hay una "${term}" a las once.`;
    case 'office':
      return lang === 'tr' ? `Bugun erken "${term}" gidiyorum.` : lang === 'en' ? `Today I am going to the "${term}" early.` : lang === 'de' ? `Heute gehe ich fruh ins "${term}.` : `Hoy voy temprano a la "${term}".`;
    case 'teacher':
      return lang === 'tr' ? `Yeni "${term}" cok net anlatiyor.` : lang === 'en' ? `The new "${term}" explains things clearly.` : lang === 'de' ? `Der neue "${term}" erklart sehr klar.` : `El nuevo "${term}" explica muy claro.`;
    case 'student':
      return lang === 'tr' ? `Sinifta oturan her "${term}" not aliyor.` : lang === 'en' ? `Every "${term}" in the class is taking notes.` : lang === 'de' ? `Jeder "${term}" in der Klasse macht Notizen.` : `Cada "${term}" de la clase esta tomando apuntes.`;
    case 'project':
      return lang === 'tr' ? `Bu hafta yeni bir "${term}" teslim edecegiz.` : lang === 'en' ? `We will deliver a new "${term}" this week.` : lang === 'de' ? `Diese Woche geben wir ein neues "${term}" ab.` : `Esta semana entregaremos un nuevo "${term}".`;
    case 'exam':
      return lang === 'tr' ? `Yarin zor bir "${term}" bizi bekliyor.` : lang === 'en' ? `A difficult "${term}" is waiting for us tomorrow.` : lang === 'de' ? `Morgen wartet eine schwere "${term}" auf uns.` : `Manana nos espera un "${term}" dificil.`;
    default:
      return lang === 'tr' ? `Bugun yeni kelimen "${term}".` : lang === 'en' ? `Today's new word is "${term}".` : lang === 'de' ? `Dein neues Wort heute ist "${term}".` : `Tu palabra nueva de hoy es "${term}".`;
  }
};

const buildSentence = (key: string, lang: LearnTargetLanguage, difficulty: AssessmentTier, variant: number) => {
  const term = PHRASES[key][lang];
  const hardTail: Record<AssessmentTier, Record<LearnTargetLanguage, string>> = {
    starter: { tr: '', en: '', de: '', es: '' },
    explorer: { tr: ' Bunu dogru yerde kullan.', en: ' Use it in the right place.', de: ' Verwende es an der richtigen Stelle.', es: ' Usala en el lugar correcto.' },
    navigator: { tr: ' Hizli dusun ve cevabi sec.', en: ' Think fast and choose the answer.', de: ' Denke schnell und wahle die Antwort.', es: ' Piensa rapido y elige la respuesta.' },
    master: { tr: ' Baski altinda bile dogru kal.', en: ' Stay accurate under pressure.', de: ' Bleib auch unter Druck präzise.', es: ' Manten la precision bajo presion.' },
  };

  const sentence = getNaturalExample(key, lang, term);
  return `${sentence}${hardTail[difficulty][lang]}`.trim();
};

const buildScenarioQuestions = (
  card: LearnModeCard,
  uiLanguage: AppLanguage,
  targetLanguage: LearnTargetLanguage,
  tier: AssessmentTier,
  recentQuestionIds: string[] = [],
) => {
  const scenarioKeys =
    card.id === 'story_cafe'
      ? ['hello', 'please', 'coffee', 'tea', 'bread', 'thanks']
      : card.id === 'conversation_checkin'
        ? ['hello', 'hotel', 'ticket', 'airport', 'sorry', 'thanks']
        : card.id === 'review_notebook'
          ? ['friend', 'station', 'meeting', 'office', 'family', 'project']
          : [];

  const syntheticLesson: Lesson = {
    id: `${card.id}_${tier}`,
    type: 'book',
    title: card.title,
    completed: false,
    crowns: 0,
    maxCrowns: 1,
    xpReward: Math.round(20 * card.xpBoost),
    difficulty: tier,
    modeTag: card.mode,
  };

  const pool = buildAdaptiveQuestionPool(syntheticLesson, uiLanguage, targetLanguage, {
    tier,
    mode: card.mode,
    seed: `${card.id}:${tier}:${targetLanguage}:scenario`,
    recentQuestionIds,
    weakFocuses: scenarioKeys,
  });

  const preferredTypes = card.id === 'story_cafe'
    ? ['translate', 'listen', 'fillBlank', 'translate', 'pronounce', 'select']
    : ['select', 'translate', 'listen', 'pronounce', 'fillBlank', 'select'];

  const selected: QuizQuestion[] = [];
  preferredTypes.forEach((type) => {
    const found = pool.find((item) => item.type === type && !selected.some((picked) => picked.id === item.id));
    if (found) selected.push(found);
  });

  return [...selected, ...pool.filter((item) => !selected.some((picked) => picked.id === item.id))].slice(0, 8);
};

const pickLessonKeys = (unitNo: number, lessonNo: number, seed: string) => {
  const pool = UNIT_VOCAB[unitNo] ?? UNIT_VOCAB[1];
  const rotated = sortBySeed(pool, `${seed}:${unitNo}:${lessonNo}`);
  return rotated.slice(0, Math.min(rotated.length, 5));
};

const formatModeBadge = (mode: LearnMode) => {
  if (mode === 'timed') return 'Speed';
  if (mode === 'review') return 'Review';
  if (mode === 'boss') return 'Boss';
  return 'Path';
};

const buildAdaptiveQuestionPool = (
  lesson: Lesson,
  uiLanguage: AppLanguage,
  targetLanguage: LearnTargetLanguage,
  options: QuestionOptions = {}
) => {
  const tier = options.tier ?? 'starter';
  const mode = options.mode ?? 'standard';
  const sessionSeed = options.seed ?? `${lesson.id}:${tier}:${mode}`;
  const recentQuestionIds = options.recentQuestionIds ?? [];
  const weakFocuses = options.weakFocuses ?? [];
  const ui = UI_COPY[uiLanguage] ?? UI_COPY.en;
  const sourceLanguage = getSourceLang(uiLanguage, targetLanguage);
  const targetName = ui.langName[targetLanguage];
  const { unitNo, lessonNo } = parseLessonMeta(lesson.id);
  const allKeys = Array.from(new Set(Object.values(UNIT_VOCAB).flat()));

  const lessonKeys = Array.from(new Set([
    ...weakFocuses.filter((focus) => allKeys.includes(focus)),
    ...pickLessonKeys(unitNo, lessonNo, sessionSeed),
  ])).slice(0, 5);
  const unitKeys = Array.from(new Set([...(UNIT_VOCAB[unitNo] ?? []), ...lessonKeys]));
  const targetPool = Array.from(new Set([
    ...unitKeys.map((key) => PHRASES[key][targetLanguage]),
    ...allKeys.map((key) => PHRASES[key][targetLanguage]),
  ]));
  const sourcePool = Array.from(new Set([
    ...unitKeys.map((key) => PHRASES[key][sourceLanguage]),
    ...allKeys.map((key) => PHRASES[key][sourceLanguage]),
  ]));

  const pool: QuizQuestion[] = [];

  lessonKeys.forEach((key, index) => {
    const source = PHRASES[key][sourceLanguage];
    const target = PHRASES[key][targetLanguage];
    const targetSentence = buildSentence(key, targetLanguage, tier, index);
    const sourceSentence = buildSentence(key, sourceLanguage, tier, index);
    const sentenceOptions = lessonKeys.map((candidateKey, candidateIndex) =>
      buildSentence(candidateKey, targetLanguage, tier, candidateIndex)
    );
    const baseXP = Math.round(10 * DIFFICULTY_META[tier].xpScale * (mode === 'boss' ? 1.4 : mode === 'timed' ? 1.2 : mode === 'review' ? 1.1 : 1));

    pool.push(
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_translate`,
        type: 'translate',
        question: ui.translateWord(source, targetName),
        prompt: source,
        options: buildOptions(target, targetPool, `${sessionSeed}:${key}:translate`),
        correctAnswer: target,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_select`,
        type: 'select',
        question: ui.chooseCorrect(source, targetName),
        prompt: source,
        options: buildOptions(target, targetPool, `${sessionSeed}:${key}:select`),
        correctAnswer: target,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_reverse`,
        type: 'select',
        question: ui.chooseCorrect(target, ui.langName[sourceLanguage]),
        prompt: target,
        options: buildOptions(source, sourcePool, `${sessionSeed}:${key}:reverse`),
        correctAnswer: source,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_blank`,
        type: 'fillBlank',
        question: ui.fillBlank,
        sentence: targetSentence.replace(target, '_____'),
        options: buildOptions(target, targetPool, `${sessionSeed}:${key}:blank`),
        correctAnswer: target,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_sentence`,
        type: 'translate',
        question: ui.translateSentence(targetName),
        prompt: sourceSentence,
        options: buildOptions(targetSentence, sentenceOptions, `${sessionSeed}:${key}:sentence`),
        correctAnswer: targetSentence,
        xp: baseXP + 2,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_listen`,
        type: 'listen',
        question: ui.listenPrompt,
        audioText: target,
        audioLanguage: getSpeechLanguageCode(targetLanguage),
        options: buildOptions(source, sourcePool, `${sessionSeed}:${key}:listen`),
        correctAnswer: source,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_pronounce`,
        type: 'pronounce',
        question: ui.pronouncePrompt(targetName),
        prompt: target,
        audioText: target,
        audioLanguage: getSpeechLanguageCode(targetLanguage),
        options: buildOptions(target, targetPool, `${sessionSeed}:${key}:pronounce`),
        correctAnswer: target,
        xp: baseXP + 4,
        focus: key,
        difficulty: tier,
      }
    );
  });

  const filtered = sortBySeed(pool, `${sessionSeed}:pool`).filter((question) => !recentQuestionIds.includes(question.id));
  return filtered.length >= DIFFICULTY_META[tier].questionCount ? filtered : sortBySeed(pool, `${sessionSeed}:fallback`);
};

export const getAssessmentLabel = (tier: AssessmentTier) => DIFFICULTY_META[tier].label;

export const evaluatePlacementTier = (score: number, total: number): AssessmentTier => {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.85) return 'master';
  if (ratio >= 0.67) return 'navigator';
  if (ratio >= 0.45) return 'explorer';
  return 'starter';
};

export const getCefrLevelFromTier = (tier: AssessmentTier): CefrLevel => {
  if (tier === 'master') return 'B2';
  if (tier === 'navigator') return 'B1';
  if (tier === 'explorer') return 'A2';
  return 'A0';
};

export const getTierFromCefrLevel = (level: CefrLevel): AssessmentTier => CEFR_TO_TIER[level];

export const getUnlockedCefrLevels = (currentLevel: CefrLevel): CefrLevel[] =>
  CEFR_LEVELS.filter((level) => CEFR_LEVELS.indexOf(level) <= CEFR_LEVELS.indexOf(currentLevel));

export const getUnitsForTargetLanguage = (
  displayLanguage: LearnTargetLanguage,
  options: { tier?: AssessmentTier; mode?: LearnMode } = {}
): Unit[] => {
  const tier = options.tier ?? 'starter';
  const meta = DIFFICULTY_META[tier];
  const tierTitlePrefix =
    tier === 'starter' ? 'Temel' :
    tier === 'explorer' ? 'Kesif' :
    tier === 'navigator' ? 'Ileri' : 'Usta';

  return UNITS.map((unit, unitIndex) => {
    const unitCopy = UNIT_COPY[displayLanguage][unit.id];
    const gated = unitIndex < meta.unitOffset;
    return {
      ...unit,
      title: `${tierTitlePrefix} ${unitCopy?.title ?? unit.title}`,
      description: gated ? `${meta.label}: hizli gecilmis temel rota` : `${unitCopy?.description ?? unit.description} • ${formatModeBadge(options.mode ?? 'standard')}`,
      completed: gated ? true : unit.completed,
      icon: gated ? '⚡' : unit.icon,
      lessons: unit.lessons.map((lesson, lessonIndex) => {
        const harderReward = Math.round(lesson.xpReward * meta.xpScale);
        const isBossTest = (options.mode ?? 'standard') === 'boss' && lesson.type === 'trophy';
        return {
          ...lesson,
          title: isBossTest ? `${LESSON_COPY[displayLanguage][lesson.id] ?? lesson.title} Boss` : LESSON_COPY[displayLanguage][lesson.id] ?? lesson.title,
          xpReward: harderReward,
          difficulty: tier,
          modeTag: options.mode ?? 'standard',
          locked: gated ? false : lesson.locked,
          current: gated ? lessonIndex === 0 : lesson.current,
        };
      }),
    };
  });
};

export const getLessonQuestions = (
  lesson: Lesson,
  uiLanguage: AppLanguage,
  targetLanguage: LearnTargetLanguage,
  options: QuestionOptions = {}
): QuizQuestion[] => {
  const tier = options.tier ?? lesson.difficulty ?? 'starter';
  const mode = options.mode ?? lesson.modeTag ?? 'standard';
  const pool = buildAdaptiveQuestionPool(lesson, uiLanguage, targetLanguage, { ...options, tier, mode });
  const desiredCount = mode === 'boss' ? Math.max(8, DIFFICULTY_META[tier].questionCount + 1) : DIFFICULTY_META[tier].questionCount;
  return pool.slice(0, desiredCount);
};

export const getPlacementAssessmentQuestions = (
  uiLanguage: AppLanguage,
  targetLanguage: LearnTargetLanguage,
  recentQuestionIds: string[] = []
): QuizQuestion[] => {
  const assessmentLesson: Lesson = {
    id: 'assessment_placement_1',
    type: 'trophy',
    title: 'Placement',
    completed: false,
    crowns: 0,
    maxCrowns: 1,
    xpReward: 0,
    difficulty: 'navigator',
  };

  const tiers: AssessmentTier[] = ['starter', 'explorer', 'navigator', 'master'];
  const mixed = tiers.flatMap((tier, index) =>
    buildAdaptiveQuestionPool(assessmentLesson, uiLanguage, targetLanguage, {
      tier,
      mode: 'boss',
      seed: `placement:${targetLanguage}:${tier}:${index}`,
      recentQuestionIds,
    }).slice(0, 3)
  );

  return sortBySeed(mixed, `placement:${targetLanguage}:final`).slice(0, 12);
};

export const getLearnModeCards = (
  mode: LearnMode,
  tier: AssessmentTier
): LearnModeCard[] =>
  LEARN_MODE_CARDS[mode].map((card) => ({
    ...card,
    badge: `${card.badge} • ${DIFFICULTY_META[tier].label}`,
    timeLimitSec: card.timeLimitSec ?? DIFFICULTY_META[tier].challengeTimeLimit,
  }));

export const getChallengeQuestions = (
  card: LearnModeCard,
  uiLanguage: AppLanguage,
  targetLanguage: LearnTargetLanguage,
  tier: AssessmentTier,
  recentQuestionIds: string[] = [],
  weakFocuses: string[] = []
): QuizQuestion[] => {
  if (['story_cafe', 'conversation_checkin', 'review_notebook'].includes(card.id)) {
    return buildScenarioQuestions(card, uiLanguage, targetLanguage, tier, recentQuestionIds);
  }

  const syntheticLesson: Lesson = {
    id: `${card.id}_${tier}`,
    type: card.mode === 'boss' ? 'trophy' : card.mode === 'review' ? 'dumbbell' : 'star',
    title: card.title,
    completed: false,
    crowns: 0,
    maxCrowns: 1,
    xpReward: Math.round(20 * card.xpBoost),
    difficulty: tier,
    modeTag: card.mode,
  };

  const pool = buildAdaptiveQuestionPool(syntheticLesson, uiLanguage, targetLanguage, {
    tier,
    mode: card.mode,
    seed: `${card.id}:${tier}:${targetLanguage}`,
    recentQuestionIds,
    weakFocuses,
  });

  return pool.slice(0, card.mode === 'boss' ? 10 : 8);
};

export const getBattlePassRewardPreview = (level: number) => {
  const isMajor = level % 5 === 0;
  return {
    level,
    title: isMajor ? 'Mega Gem Drop' : 'Gem Bundle',
    icon: isMajor ? '💎' : '🎁',
    gems: isMajor ? 80 : 25,
    summary: isMajor ? 'Buyuk odul, daha fazla gem ve season ilerlemesi.' : 'Kucuk ama hizli bir gem paketi.',
  };
};

export const BATTLE_PASS_PRICE_LABEL = '149.99 TL / sezon';

export const getBattlePassTrack = (
  currentLevel: number,
  claimedRewardIds: string[] = [],
  premiumUnlocked = false,
  maxLevel = 12
): BattlePassTrackItem[] => {
  const items: BattlePassTrackItem[] = [];

  for (let level = 1; level <= maxLevel; level += 1) {
    const isMajor = level % 5 === 0;
    const freeRewardId = `bp_${level}`;
    const premiumRewardId = `bp_premium_${level}`;

    items.push({
      rewardId: freeRewardId,
      level,
      title: isMajor ? 'Mega Gem Drop' : 'Gem Reward',
      subtitle: isMajor ? 'Buyuk free odul' : 'Free reward lane',
      icon: isMajor ? '💎' : '🎁',
      gems: isMajor ? 80 : 25,
      premium: false,
      claimable: currentLevel >= level,
      claimed: claimedRewardIds.includes(freeRewardId) || claimedRewardIds.includes(`bp_${level}`),
    });

    items.push({
      rewardId: premiumRewardId,
      level,
      title: isMajor ? 'Premium Chest' : 'Premium Bonus',
      subtitle: premiumUnlocked ? 'Premium lane aktif' : 'Battle Pass gerekir',
      icon: isMajor ? '🏆' : '⚡',
      gems: isMajor ? 140 : 55,
      premium: true,
      claimable: premiumUnlocked && currentLevel >= level,
      claimed: claimedRewardIds.includes(premiumRewardId),
      priceLabel: premiumUnlocked ? undefined : BATTLE_PASS_PRICE_LABEL,
    });
  }

  return items;
};
