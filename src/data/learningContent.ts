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

export const CEFR_LEVELS: CefrLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const CEFR_TO_TIER: Record<CefrLevel, AssessmentTier> = {
  A0: 'starter',
  A1: 'explorer',
  A2: 'explorer',
  B1: 'navigator',
  B2: 'master',
  C1: 'master',
  C2: 'master',
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
  good_morning: { tr: 'Günaydın', en: 'Good morning', de: 'Guten Morgen', es: 'Buenos días' },
  good_evening: { tr: 'İyi akşamlar', en: 'Good evening', de: 'Guten Abend', es: 'Buenas noches' },
  nice_meet: { tr: 'Tanıştığımıza memnun oldum', en: 'Nice to meet you', de: 'Freut mich', es: 'Mucho gusto' },
  how_are_you: { tr: 'Nasılsın', en: 'How are you', de: 'Wie geht es dir', es: 'Cómo estás' },
  water: { tr: 'Su', en: 'Water', de: 'Wasser', es: 'Agua' },
  bread: { tr: 'Ekmek', en: 'Bread', de: 'Brot', es: 'Pan' },
  apple: { tr: 'Elma', en: 'Apple', de: 'Apfel', es: 'Manzana' },
  coffee: { tr: 'Kahve', en: 'Coffee', de: 'Kaffee', es: 'Café' },
  tea: { tr: 'Çay', en: 'Tea', de: 'Tee', es: 'Té' },
  menu: { tr: 'Menü', en: 'Menu', de: 'Speisekarte', es: 'Menú' },
  milk: { tr: 'Süt', en: 'Milk', de: 'Milch', es: 'Leche' },
  soup: { tr: 'Çorba', en: 'Soup', de: 'Suppe', es: 'Sopa' },
  orange_juice: { tr: 'Portakal suyu', en: 'Orange juice', de: 'Orangensaft', es: 'Jugo de naranja' },
  bill: { tr: 'Hesap', en: 'Bill', de: 'Rechnung', es: 'Cuenta' },
  mother: { tr: 'Anne', en: 'Mother', de: 'Mutter', es: 'Madre' },
  father: { tr: 'Baba', en: 'Father', de: 'Vater', es: 'Padre' },
  friend: { tr: 'Arkadaş', en: 'Friend', de: 'Freund', es: 'Amigo' },
  happy: { tr: 'Mutlu', en: 'Happy', de: 'Glücklich', es: 'Feliz' },
  family: { tr: 'Aile', en: 'Family', de: 'Familie', es: 'Familia' },
  child: { tr: 'Çocuk', en: 'Child', de: 'Kind', es: 'Niño' },
  sister: { tr: 'Kız kardeş', en: 'Sister', de: 'Schwester', es: 'Hermana' },
  brother: { tr: 'Erkek kardeş', en: 'Brother', de: 'Bruder', es: 'Hermano' },
  married: { tr: 'Evli', en: 'Married', de: 'Verheiratet', es: 'Casado' },
  neighbor: { tr: 'Komşu', en: 'Neighbor', de: 'Nachbar', es: 'Vecino' },
  station: { tr: 'İstasyon', en: 'Station', de: 'Bahnhof', es: 'Estación' },
  hotel: { tr: 'Otel', en: 'Hotel', de: 'Hotel', es: 'Hotel' },
  right: { tr: 'Sağa', en: 'Right', de: 'Rechts', es: 'Derecha' },
  ticket: { tr: 'Bilet', en: 'Ticket', de: 'Ticket', es: 'Boleto' },
  airport: { tr: 'Havalimanı', en: 'Airport', de: 'Flughafen', es: 'Aeropuerto' },
  bus: { tr: 'Otobüs', en: 'Bus', de: 'Bus', es: 'Autobús' },
  left: { tr: 'Sola', en: 'Left', de: 'Links', es: 'Izquierda' },
  subway: { tr: 'Metro', en: 'Subway', de: 'U-Bahn', es: 'Metro' },
  passport: { tr: 'Pasaport', en: 'Passport', de: 'Reisepass', es: 'Pasaporte' },
  luggage: { tr: 'Bavul', en: 'Luggage', de: 'Gepäck', es: 'Equipaje' },
  red: { tr: 'Kırmızı', en: 'Red', de: 'Rot', es: 'Rojo' },
  shirt: { tr: 'Gömlek', en: 'Shirt', de: 'Hemd', es: 'Camisa' },
  cheap: { tr: 'Ucuz', en: 'Cheap', de: 'Günstig', es: 'Barato' },
  price: { tr: 'Fiyat', en: 'Price', de: 'Preis', es: 'Precio' },
  shoes: { tr: 'Ayakkabı', en: 'Shoes', de: 'Schuhe', es: 'Zapatos' },
  market: { tr: 'Pazar', en: 'Market', de: 'Markt', es: 'Mercado' },
  expensive: { tr: 'Pahalı', en: 'Expensive', de: 'Teuer', es: 'Caro' },
  size: { tr: 'Beden', en: 'Size', de: 'Größe', es: 'Talla' },
  discount: { tr: 'İndirim', en: 'Discount', de: 'Rabatt', es: 'Descuento' },
  cash: { tr: 'Nakit', en: 'Cash', de: 'Bargeld', es: 'Efectivo' },
  morning: { tr: 'Sabah', en: 'Morning', de: 'Morgen', es: 'Mañana' },
  evening: { tr: 'Akşam', en: 'Evening', de: 'Abend', es: 'Noche' },
  breakfast: { tr: 'Kahvaltı', en: 'Breakfast', de: 'Frühstück', es: 'Desayuno' },
  work: { tr: 'Çalışmak', en: 'Work', de: 'Arbeiten', es: 'Trabajar' },
  study: { tr: 'Ders çalışmak', en: 'Study', de: 'Lernen', es: 'Estudiar' },
  sleep: { tr: 'Uyumak', en: 'Sleep', de: 'Schlafen', es: 'Dormir' },
  lunch: { tr: 'Öğle yemeği', en: 'Lunch', de: 'Mittagessen', es: 'Almuerzo' },
  dinner: { tr: 'Akşam yemeği', en: 'Dinner', de: 'Abendessen', es: 'Cena' },
  exercise: { tr: 'Egzersiz', en: 'Exercise', de: 'Training', es: 'Ejercicio' },
  shower: { tr: 'Duş', en: 'Shower', de: 'Dusche', es: 'Ducha' },
  meeting: { tr: 'Toplantı', en: 'Meeting', de: 'Besprechung', es: 'Reunión' },
  office: { tr: 'Ofis', en: 'Office', de: 'Büro', es: 'Oficina' },
  teacher: { tr: 'Öğretmen', en: 'Teacher', de: 'Lehrer', es: 'Profesor' },
  student: { tr: 'Öğrenci', en: 'Student', de: 'Schüler', es: 'Estudiante' },
  project: { tr: 'Proje', en: 'Project', de: 'Projekt', es: 'Proyecto' },
  exam: { tr: 'Sınav', en: 'Exam', de: 'Prüfung', es: 'Examen' },
  manager: { tr: 'Yönetici', en: 'Manager', de: 'Manager', es: 'Gerente' },
  report: { tr: 'Rapor', en: 'Report', de: 'Bericht', es: 'Informe' },
  intern: { tr: 'Stajyer', en: 'Intern', de: 'Praktikant', es: 'Practicante' },
  presentation: { tr: 'Sunum', en: 'Presentation', de: 'Präsentation', es: 'Presentación' },
  schedule: { tr: 'Program', en: 'Schedule', de: 'Zeitplan', es: 'Horario' },
  deadline: { tr: 'Son teslim tarihi', en: 'Deadline', de: 'Frist', es: 'Fecha limite' },
  research: { tr: 'Araştırma', en: 'Research', de: 'Forschung', es: 'Investigacion' },
  negotiate: { tr: 'Muzakere etmek', en: 'Negotiate', de: 'Verhandeln', es: 'Negociar' },
  policy: { tr: 'Politika', en: 'Policy', de: 'Richtlinie', es: 'Politica' },
  strategy: { tr: 'Strateji', en: 'Strategy', de: 'Strategie', es: 'Estrategia' },
  improve: { tr: 'Gelistirmek', en: 'Improve', de: 'Verbessern', es: 'Mejorar' },
  solution: { tr: 'Cozum', en: 'Solution', de: 'Losung', es: 'Solucion' },
  confident: { tr: 'Kendinden emin', en: 'Confident', de: 'Selbstsicher', es: 'Seguro' },
  discussion: { tr: 'Tartisma', en: 'Discussion', de: 'Diskussion', es: 'Discusion' },
  analysis: { tr: 'Analiz', en: 'Analysis', de: 'Analyse', es: 'Analisis' },
  outcome: { tr: 'Sonuç', en: 'Outcome', de: 'Ergebnis', es: 'Resultado' },
  customer: { tr: 'Müşteri', en: 'Customer', de: 'Kunde', es: 'Cliente' },
  contract: { tr: 'Sözleşme', en: 'Contract', de: 'Vertrag', es: 'Contrato' },
  colleague: { tr: 'İş arkadaşı', en: 'Colleague', de: 'Kollege', es: 'Colega' },
  feedback: { tr: 'Geri bildirim', en: 'Feedback', de: 'Feedback', es: 'Retroalimentacion' },
  budget: { tr: 'Bütçe', en: 'Budget', de: 'Budget', es: 'Presupuesto' },
  proposal: { tr: 'Teklif', en: 'Proposal', de: 'Vorschlag', es: 'Propuesta' },
  appointment: { tr: 'Randevu', en: 'Appointment', de: 'Termin', es: 'Cita' },
  reservation: { tr: 'Rezervasyon', en: 'Reservation', de: 'Reservierung', es: 'Reserva' },
  quarter: { tr: 'Çeyrek', en: 'Quarter', de: 'Quartal', es: 'Trimestre' },
  client: { tr: 'Danışan', en: 'Client', de: 'Kunde', es: 'Cliente' },
};

const UNIT_VOCAB: Record<number, string[]> = {
  1: ['hello', 'bye', 'my_name', 'please', 'thanks', 'sorry', 'good_morning', 'good_evening', 'nice_meet', 'how_are_you'],
  2: ['water', 'bread', 'apple', 'coffee', 'tea', 'menu', 'milk', 'soup', 'orange_juice', 'bill'],
  3: ['mother', 'father', 'friend', 'happy', 'family', 'child', 'sister', 'brother', 'married', 'neighbor'],
  4: ['station', 'hotel', 'right', 'ticket', 'airport', 'bus', 'left', 'subway', 'passport', 'luggage', 'reservation', 'appointment'],
  5: ['red', 'shirt', 'cheap', 'price', 'shoes', 'market', 'expensive', 'size', 'discount', 'cash'],
  6: ['morning', 'evening', 'breakfast', 'work', 'study', 'sleep', 'lunch', 'dinner', 'exercise', 'shower'],
  7: ['meeting', 'office', 'teacher', 'student', 'project', 'exam', 'manager', 'report', 'intern', 'presentation', 'colleague', 'feedback'],
};

const TIER_BONUS_VOCAB: Record<AssessmentTier, string[]> = {
  starter: ['hello', 'please', 'thanks', 'water', 'bread', 'friend', 'good_morning', 'tea'],
  explorer: ['family', 'hotel', 'ticket', 'price', 'study', 'teacher', 'discount', 'lunch', 'reservation', 'appointment'],
  navigator: ['airport', 'meeting', 'project', 'schedule', 'research', 'solution', 'manager', 'presentation', 'feedback', 'colleague'],
  master: ['deadline', 'negotiate', 'policy', 'strategy', 'confident', 'discussion', 'analysis', 'contract', 'budget', 'proposal', 'quarter', 'client'],
};

const DISTRACTOR_CLUSTERS: string[][] = [
  ['hello', 'bye', 'good_morning', 'good_evening', 'nice_meet', 'how_are_you', 'thanks', 'sorry', 'please', 'my_name'],
  ['water', 'coffee', 'tea', 'milk', 'orange_juice', 'soup', 'bread', 'apple', 'menu', 'bill'],
  ['mother', 'father', 'sister', 'brother', 'family', 'child', 'friend', 'neighbor', 'married', 'happy'],
  ['station', 'hotel', 'airport', 'ticket', 'bus', 'subway', 'passport', 'luggage', 'reservation', 'appointment'],
  ['right', 'left', 'market', 'price', 'cheap', 'expensive', 'discount', 'cash', 'size', 'shoes', 'shirt', 'red'],
  ['morning', 'evening', 'breakfast', 'lunch', 'dinner', 'exercise', 'shower', 'work', 'study', 'sleep'],
  ['meeting', 'office', 'teacher', 'student', 'project', 'exam', 'manager', 'report', 'presentation', 'intern', 'colleague', 'feedback'],
  ['schedule', 'deadline', 'research', 'analysis', 'solution', 'strategy', 'policy', 'proposal', 'budget', 'quarter', 'contract', 'client', 'customer', 'discussion', 'confident', 'improve', 'negotiate', 'outcome'],
];

const UNIT_CONTEXT_TEMPLATES: Record<number, Record<LearnTargetLanguage, string[]>> = {
  1: {
    tr: ['Kapidan girince ilk kelimen genelde "{term}" olur.', 'Yeni biriyle konusmaya "{term}" diyerek baslayabilirsin.', 'Kisa ve dogal bir giris icin "{term}" iyi bir secimdir.'],
    en: ['When you walk in, "{term}" is often the first thing you say.', 'You can start a new conversation with "{term}".', '"{term}" works well as a short and natural opener.'],
    de: ['Wenn du hereinkommst, sagst du oft zuerst "{term}".', 'Du kannst ein neues Gesprach mit "{term}" beginnen.', '"{term}" ist ein kurzer und naturlicher Einstieg.'],
    es: ['Cuando entras, "{term}" suele ser lo primero que dices.', 'Puedes empezar una nueva conversacion con "{term}".', '"{term}" funciona bien como una entrada corta y natural.'],
  },
  2: {
    tr: ['Kafede siparis verirken "{term}" kelimesi isine yarar.', 'Masadaki secenekler arasinda "{term}" da var.', 'Yemek veya icecek isterken "{term}" sik kullanilir.'],
    en: ['"{term}" is useful when ordering at a cafe.', '"{term}" is one of the options on the table.', 'You hear "{term}" often when asking for food or drinks.'],
    de: ['"{term}" ist praktisch, wenn du im Cafe bestellst.', '"{term}" gehort zu den Optionen auf dem Tisch.', 'Beim Bestellen von Essen oder Getranken hort man oft "{term}".'],
    es: ['"{term}" sirve cuando haces un pedido en una cafeteria.', '"{term}" aparece entre las opciones de la mesa.', 'Se usa mucho "{term}" al pedir comida o bebida.'],
  },
  3: {
    tr: ['Evde aileden bahsederken "{term}" dogal durur.', 'Yakın cevreni anlatirken "{term}" kelimesi gerekebilir.', 'Kisisel bir hikayede "{term}" gecmesi normaldir.'],
    en: ['"{term}" sounds natural when talking about family at home.', 'You may need "{term}" when describing people close to you.', 'It is normal to hear "{term}" in a personal story.'],
    de: ['"{term}" klingt naturlich, wenn man zu Hause uber Familie spricht.', 'Du brauchst "{term}", wenn du nahe Personen beschreibst.', 'In einer personlichen Geschichte kommt "{term}" oft vor.'],
    es: ['"{term}" suena natural cuando hablas de la familia en casa.', 'Puede hacer falta "{term}" al describir a personas cercanas.', 'Es normal ver "{term}" en una historia personal.'],
  },
  4: {
    tr: ['Yolculuk sirasinda "{term}" kelimesi cok ise yarar.', 'Havalimaninda veya otelde "{term}" duyabilirsin.', 'Yon sorarken ya da hareket ederken "{term}" kullanilir.'],
    en: ['"{term}" is very useful while traveling.', 'You may hear "{term}" at the airport or in a hotel.', '"{term}" appears when asking for directions or moving around.'],
    de: ['"{term}" ist auf Reisen sehr nützlich.', 'Am Flughafen oder im Hotel horst du oft "{term}".', '"{term}" erscheint beim Fragen nach dem Weg oder unterwegs.'],
    es: ['"{term}" es muy util mientras viajas.', 'Puedes oir "{term}" en el aeropuerto o en un hotel.', '"{term}" aparece al pedir direcciones o al moverte.'],
  },
  5: {
    tr: ['Magazada fiyat bakarken "{term}" aklinda kalir.', 'Alisveris yaparken "{term}" gibi kelimeler fark yaratir.', 'Kasada veya reyonda "{term}" duymak normaldir.'],
    en: ['"{term}" stands out when you are checking prices in a store.', 'Words like "{term}" make a difference while shopping.', 'It is normal to hear "{term}" at the counter or near the shelves.'],
    de: ['"{term}" fallt auf, wenn du im Laden Preise vergleichst.', 'Worter wie "{term}" helfen dir beim Einkaufen.', 'An der Kasse oder im Regal horst du oft "{term}".'],
    es: ['"{term}" destaca cuando revisas precios en una tienda.', 'Palabras como "{term}" ayudan mientras compras.', 'Es normal oir "{term}" en la caja o cerca de los productos.'],
  },
  6: {
    tr: ['Gunluk plan kurarken "{term}" kelimesi sikca cikar.', 'Sabahdan aksama kadar rutinde "{term}" vardir.', '"{term}" gunun normal akisinda gecen bir ifadedir.'],
    en: ['"{term}" comes up often when planning the day.', 'From morning to evening, "{term}" appears in the routine.', '"{term}" is part of a normal daily flow.'],
    de: ['"{term}" taucht oft auf, wenn du den Tag planst.', 'Von morgens bis abends gehort "{term}" zur Routine.', '"{term}" ist Teil eines normalen Tagesablaufs.'],
    es: ['"{term}" aparece mucho cuando organizas el dia.', 'De la manana a la noche, "{term}" entra en la rutina.', '"{term}" forma parte de un ritmo diario normal.'],
  },
  7: {
    tr: ['Ofiste veya okulda "{term}" kelimesi oldukca yaygindir.', 'Profesyonel bir ortamda "{term}" duymak normaldir.', 'Ders ya da is akisi icinde "{term}" onemli olabilir.'],
    en: ['"{term}" is common in the office or at school.', 'It is normal to hear "{term}" in a professional setting.', '"{term}" can be important in a lesson or work flow.'],
    de: ['"{term}" ist im Buro oder in der Schule sehr ublich.', 'In einem professionellen Umfeld hort man oft "{term}".', '"{term}" kann im Unterricht oder bei der Arbeit wichtig sein.'],
    es: ['"{term}" es comun en la oficina o en la escuela.', 'Es normal escuchar "{term}" en un entorno profesional.', '"{term}" puede ser importante en clase o en el trabajo.'],
  },
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

const QUESTION_PROMPT_VARIANTS = {
  tr: {
    translateWord: [
      (word: string, toName: string) => `"${word}" ifadesini ${toName} diline cevir`,
      (word: string, toName: string) => `"${word}" kelimesinin ${toName} karsiligini bul`,
      (word: string, toName: string) => `${toName} dilinde "${word}" nasil soylenir?`,
    ],
    chooseCorrect: [
      (word: string, toName: string) => `"${word}" icin dogru ${toName} karsiligini sec`,
      (word: string, toName: string) => `"${word}" ifadesine en uygun ${toName} cevabi bul`,
      (word: string, toName: string) => `"${word}" ile eslesen ${toName} secenegi sec`,
    ],
    translateSentence: [
      (toName: string) => `Cumleyi ${toName} diline cevir`,
      (toName: string) => `Bu ifadeyi ${toName} dilinde tamamla`,
      (toName: string) => `Asagidaki cumlenin ${toName} karsiligini bul`,
    ],
    fillBlank: ['Boslugu dogru kelimeyle tamamla', 'Eksik kelimeyi sec', 'Cumledeki boslugu doldur'],
    listenPrompt: [
      'Hoparlore dokun, dinle ve dogru cevabi sec',
      'Dinledigini anlayip dogru secenegi bul',
      'Sesi dinle ve anlamca dogru cevabi sec',
    ],
    pronouncePrompt: [
      (toName: string) => `${toName} kelimeyi dogru telaffuz et`,
      (toName: string) => `Mikrofona konus ve ${toName} kelimeyi net soyle`,
      (toName: string) => `${toName} ifadeyi sesli olarak tekrar et`,
    ],
  },
  en: {
    translateWord: [
      (word: string, toName: string) => `Translate "${word}" to ${toName}`,
      (word: string, toName: string) => `Find the ${toName} meaning of "${word}"`,
      (word: string, toName: string) => `How do you say "${word}" in ${toName}?`,
    ],
    chooseCorrect: [
      (word: string, toName: string) => `Choose the correct ${toName} translation for "${word}"`,
      (word: string, toName: string) => `Pick the best ${toName} match for "${word}"`,
      (word: string, toName: string) => `Select the ${toName} option that fits "${word}"`,
    ],
    translateSentence: [
      (toName: string) => `Translate the sentence to ${toName}`,
      (toName: string) => `Build the ${toName} version of this sentence`,
      (toName: string) => `Find the correct ${toName} sentence`,
    ],
    fillBlank: ['Complete the blank with the correct word', 'Choose the missing word', 'Fill in the missing part'],
    listenPrompt: [
      'Tap the speaker, listen, then choose the correct answer',
      'Listen carefully and choose the matching answer',
      'Play the audio and select the right meaning',
    ],
    pronouncePrompt: [
      (toName: string) => `Pronounce the ${toName} word into the microphone`,
      (toName: string) => `Say the ${toName} term clearly into the mic`,
      (toName: string) => `Repeat the ${toName} word out loud`,
    ],
  },
  de: {
    translateWord: [
      (word: string, toName: string) => `Ubersetze "${word}" auf ${toName}`,
      (word: string, toName: string) => `Finde die ${toName}-Bedeutung von "${word}"`,
      (word: string, toName: string) => `Wie sagt man "${word}" auf ${toName}?`,
    ],
    chooseCorrect: [
      (word: string, toName: string) => `Wahle die richtige ${toName}-Ubersetzung fur "${word}"`,
      (word: string, toName: string) => `Finde die beste ${toName}-Antwort fur "${word}"`,
      (word: string, toName: string) => `Wahle die passende ${toName}-Option fur "${word}"`,
    ],
    translateSentence: [
      (toName: string) => `Ubersetze den Satz auf ${toName}`,
      (toName: string) => `Bilde die richtige ${toName}-Version des Satzes`,
      (toName: string) => `Finde den passenden Satz auf ${toName}`,
    ],
    fillBlank: ['Erganze die Lucke mit dem richtigen Wort', 'Wahle das fehlende Wort', 'Fulle die Lucke passend aus'],
    listenPrompt: [
      'Tippe auf den Lautsprecher, hore zu und wahle die richtige Antwort',
      'Hore genau hin und entscheide dich fur die passende Antwort',
      'Spiele den Ton ab und wähle die richtige Bedeutung',
    ],
    pronouncePrompt: [
      (toName: string) => `Sprich das ${toName}-Wort ins Mikrofon`,
      (toName: string) => `Sage den ${toName}-Begriff deutlich ins Mikrofon`,
      (toName: string) => `Wiederhole das ${toName}-Wort laut`,
    ],
  },
  es: {
    translateWord: [
      (word: string, toName: string) => `Traduce "${word}" a ${toName}`,
      (word: string, toName: string) => `Busca el significado en ${toName} de "${word}"`,
      (word: string, toName: string) => `Como se dice "${word}" en ${toName}?`,
    ],
    chooseCorrect: [
      (word: string, toName: string) => `Elige la traduccion correcta en ${toName} para "${word}"`,
      (word: string, toName: string) => `Selecciona la mejor opcion en ${toName} para "${word}"`,
      (word: string, toName: string) => `Encuentra la opcion en ${toName} que coincide con "${word}"`,
    ],
    translateSentence: [
      (toName: string) => `Traduce la oracion a ${toName}`,
      (toName: string) => `Construye la version en ${toName} de esta frase`,
      (toName: string) => `Encuentra la oracion correcta en ${toName}`,
    ],
    fillBlank: ['Completa el espacio con la palabra correcta', 'Elige la palabra que falta', 'Rellena el hueco con la opcion correcta'],
    listenPrompt: [
      'Toca el altavoz, escucha y elige la respuesta correcta',
      'Escucha con atencion y selecciona la respuesta adecuada',
      'Reproduce el audio y elige el significado correcto',
    ],
    pronouncePrompt: [
      (toName: string) => `Pronuncia la palabra en ${toName} usando el microfono`,
      (toName: string) => `Di el termino en ${toName} con claridad`,
      (toName: string) => `Repite en voz alta la palabra en ${toName}`,
    ],
  },
} as const;

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

const getUnitForKey = (key: string) =>
  Number(
    Object.entries(UNIT_VOCAB).find(([, keys]) => keys.includes(key))?.[0] ?? 1
  );

const getTierUnitWindow = (unitNo: number, tier: AssessmentTier) => {
  const units = [unitNo];
  if (tier !== 'starter' && unitNo > 1) units.push(unitNo - 1);
  if (tier !== 'starter' && unitNo < Object.keys(UNIT_VOCAB).length) units.push(unitNo + 1);
  if (tier === 'master' && unitNo + 2 <= Object.keys(UNIT_VOCAB).length) units.push(unitNo + 2);
  return Array.from(new Set(units)).sort((a, b) => a - b);
};

const getClusterKeysForKey = (key: string) =>
  DISTRACTOR_CLUSTERS.find((cluster) => cluster.includes(key)) ?? [];

const getPromptVariant = <
  T extends keyof typeof QUESTION_PROMPT_VARIANTS['tr']
>(
  language: AppLanguage,
  kind: T,
  seed: string
) => {
  const variants = QUESTION_PROMPT_VARIANTS[language]?.[kind] ?? QUESTION_PROMPT_VARIANTS.en[kind];
  return variants[seeded(seed) % variants.length];
};

const prioritizeFreshKeys = (keys: string[], recentQuestionIds: string[], seed: string) =>
  sortBySeed(Array.from(new Set(keys)), `${seed}:freshness`).sort((a, b) => {
    const aRecent = recentQuestionIds.some((questionId) => questionId.includes(`_${a}_`)) ? 1 : 0;
    const bRecent = recentQuestionIds.some((questionId) => questionId.includes(`_${b}_`)) ? 1 : 0;
    return aRecent - bRecent;
  });

const rankDistractorCloseness = (correct: string, candidate: string) => {
  const correctWords = correct.trim().split(/\s+/).length;
  const candidateWords = candidate.trim().split(/\s+/).length;
  const lengthPenalty = Math.abs(correct.length - candidate.length);
  const wordPenalty = Math.abs(correctWords - candidateWords) * 8;
  const firstLetterPenalty =
    correct.charAt(0).toLocaleLowerCase('tr-TR') === candidate.charAt(0).toLocaleLowerCase('tr-TR') ? 0 : 2;
  return lengthPenalty + wordPenalty + firstLetterPenalty;
};

const buildOptions = (correct: string, pools: string[][], seed: string) => {
  const scored = new Map<string, number>();

  pools.forEach((pool, poolIndex) => {
    Array.from(new Set(pool.filter((item) => item && item !== correct))).forEach((candidate) => {
      const weightedScore = rankDistractorCloseness(correct, candidate) + poolIndex * 6;
      const existing = scored.get(candidate);
      if (existing === undefined || weightedScore < existing) {
        scored.set(candidate, weightedScore);
      }
    });
  });

  const ranked = Array.from(scored.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([candidate]) => candidate);

  const distractors = sortBySeed(ranked.slice(0, 10), `${seed}:ranked`).slice(0, 3);
  return sortBySeed([correct, ...distractors], `${seed}:options`);
};

const getContextualExample = (key: string, lang: LearnTargetLanguage, term: string, variant: number) => {
  const unitNo = getUnitForKey(key);
  const templates = UNIT_CONTEXT_TEMPLATES[unitNo]?.[lang] ?? UNIT_CONTEXT_TEMPLATES[1][lang];
  const template = templates[variant % templates.length];
  return template.replace('{term}', term);
};

const getNaturalExample = (key: string, lang: LearnTargetLanguage, term: string, variant = 0) => {
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
    case 'good_morning':
      return lang === 'tr' ? `Sabah ofise girince "${term}" dersin.` : lang === 'en' ? `You say "${term}" when you arrive in the morning.` : lang === 'de' ? `Am Morgen sagst du "${term}", wenn du ankommst.` : `Dices "${term}" al llegar por la manana.`;
    case 'good_evening':
      return lang === 'tr' ? `Aksam birini gorunce "${term}" demek dogaldir.` : lang === 'en' ? `It is natural to say "${term}" when you see someone in the evening.` : lang === 'de' ? `Am Abend ist "${term}" eine passende Begrussung.` : `Es natural decir "${term}" al ver a alguien por la noche.`;
    case 'nice_meet':
      return lang === 'tr' ? `Yeni biriyle tanisinca "${term}" dersin.` : lang === 'en' ? `You say "${term}" when meeting someone new.` : lang === 'de' ? `Wenn du jemanden neu triffst, sagst du "${term}".` : `Dices "${term}" al conocer a alguien nuevo.`;
    case 'how_are_you':
      return lang === 'tr' ? `Samimi bir baslangic icin "${term}" diye sorarsin.` : lang === 'en' ? `For a friendly start, you ask "${term}".` : lang === 'de' ? `Fur einen freundlichen Einstieg fragst du "${term}".` : `Para empezar de forma amable preguntas "${term}".`;
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
    case 'bill':
      return lang === 'tr' ? `Yemekten sonra "${term}" isteyebilir misin?` : lang === 'en' ? `Can you ask for the "${term}" after the meal?` : lang === 'de' ? `Kannst du nach dem Essen um die "${term}" bitten?` : `Puedes pedir la "${term}" despues de comer?`;
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
    case 'sister':
      return lang === 'tr' ? `Benim "${term}" universitede okuyor.` : lang === 'en' ? `My "${term}" studies at university.` : lang === 'de' ? `Meine "${term}" studiert an der Universitat.` : `Mi "${term}" estudia en la universidad.`;
    case 'brother':
      return lang === 'tr' ? `Kucuk "${term}" futbolu cok seviyor.` : lang === 'en' ? `My younger "${term}" loves football.` : lang === 'de' ? `Mein kleiner "${term}" liebt Fussball.` : `Mi "${term}" menor ama el futbol.`;
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
    case 'passport':
      return lang === 'tr' ? `Kontrolde "${term}" hazir tut.` : lang === 'en' ? `Keep your "${term}" ready at the control desk.` : lang === 'de' ? `Halte deinen "${term}" an der Kontrolle bereit.` : `Ten listo tu "${term}" en el control.`;
    case 'luggage':
      return lang === 'tr' ? `Benim "${term}" mavi etiketli.` : lang === 'en' ? `My "${term}" has a blue tag.` : lang === 'de' ? `Mein "${term}" hat ein blaues Etikett.` : `Mi "${term}" tiene una etiqueta azul.`;
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
    case 'discount':
      return lang === 'tr' ? `Bu hafta bu urunde buyuk bir "${term}" var.` : lang === 'en' ? `There is a big "${term}" on this item this week.` : lang === 'de' ? `Diese Woche gibt es auf diesen Artikel einen grossen "${term}".` : `Esta semana hay un gran "${term}" en este producto.`;
    case 'size':
      return lang === 'tr' ? `Bu gomlegin buyuk "${term}" var mi?` : lang === 'en' ? `Do you have this shirt in a larger "${term}"?` : lang === 'de' ? `Gibt es dieses Hemd in einer grosseren "${term}"?` : `Tienes esta camisa en una "${term}" mas grande?`;
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
    case 'exercise':
      return lang === 'tr' ? `Isten sonra biraz "${term}" yaparim.` : lang === 'en' ? `I do some "${term}" after work.` : lang === 'de' ? `Nach der Arbeit mache ich etwas "${term}".` : `Hago algo de "${term}" despues del trabajo.`;
    case 'shower':
      return lang === 'tr' ? `Kosudan sonra hemen "${term}" alirim.` : lang === 'en' ? `I take a "${term}" right after running.` : lang === 'de' ? `Nach dem Laufen nehme ich sofort eine "${term}".` : `Me doy una "${term}" justo despues de correr.`;
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
    case 'manager':
      return lang === 'tr' ? `Yeni "${term}" haftalik hedefleri anlatti.` : lang === 'en' ? `The new "${term}" explained the weekly goals.` : lang === 'de' ? `Der neue "${term}" hat die Wochenziele erklart.` : `El nuevo "${term}" explico los objetivos de la semana.`;
    case 'report':
      return lang === 'tr' ? `Aksamdan once bu "${term}" gondermem gerekiyor.` : lang === 'en' ? `I need to send this "${term}" before evening.` : lang === 'de' ? `Ich muss diesen "${term}" vor dem Abend senden.` : `Necesito enviar este "${term}" antes de la tarde.`;
    case 'presentation':
      return lang === 'tr' ? `Yarin sabah bir "${term}" yapacagim.` : lang === 'en' ? `Tomorrow morning I will give a "${term}".` : lang === 'de' ? `Morgen fruh halte ich eine "${term}".` : `Manana por la manana hare una "${term}".`;
    case 'schedule':
      return lang === 'tr' ? `Bugunun "${term}" biraz yogun.` : lang === 'en' ? `Today's "${term}" is a bit busy.` : lang === 'de' ? `Der heutige "${term}" ist etwas voll.` : `El "${term}" de hoy esta un poco lleno.`;
    case 'deadline':
      return lang === 'tr' ? `Bu gorev icin son "${term}" cuma.` : lang === 'en' ? `The final "${term}" for this task is Friday.` : lang === 'de' ? `Die letzte "${term}" fur diese Aufgabe ist Freitag.` : `La "${term}" final para esta tarea es el viernes.`;
    case 'analysis':
      return lang === 'tr' ? `Toplantidan once verilerin "${term}" hazir olmali.` : lang === 'en' ? `The data "${term}" should be ready before the meeting.` : lang === 'de' ? `Die "${term}" der Daten sollte vor dem Meeting bereit sein.` : `El "${term}" de los datos debe estar listo antes de la reunion.`;
    case 'feedback':
      return lang === 'tr' ? `Sunumdan sonra ekipten "${term}" topluyoruz.` : lang === 'en' ? `We collect "${term}" from the team after the presentation.` : lang === 'de' ? `Nach der Prasentation sammeln wir "${term}" vom Team.` : `Recogemos "${term}" del equipo despues de la presentacion.`;
    case 'budget':
      return lang === 'tr' ? `Yeni proje icin ayri bir "${term}" gerekiyor.` : lang === 'en' ? `The new project needs a separate "${term}".` : lang === 'de' ? `Das neue Projekt braucht ein eigenes "${term}".` : `El nuevo proyecto necesita un "${term}" aparte.`;
    case 'proposal':
      return lang === 'tr' ? `Toplantida yeni bir "${term}" sunduk.` : lang === 'en' ? `We presented a new "${term}" in the meeting.` : lang === 'de' ? `Im Meeting haben wir ein neues "${term}" vorgestellt.` : `Presentamos una nueva "${term}" en la reunion.`;
    case 'appointment':
      return lang === 'tr' ? `Doktorla yarin sabah bir "${term}" var.` : lang === 'en' ? `There is an "${term}" with the doctor tomorrow morning.` : lang === 'de' ? `Morgen fruh gibt es einen "${term}" beim Arzt.` : `Hay una "${term}" con el medico manana por la manana.`;
    case 'reservation':
      return lang === 'tr' ? `Aksam yemegi icin bir "${term}" yaptik.` : lang === 'en' ? `We made a "${term}" for dinner.` : lang === 'de' ? `Wir haben eine "${term}" fur das Abendessen gemacht.` : `Hicimos una "${term}" para la cena.`;
    case 'quarter':
      return lang === 'tr' ? `Bu "${term}" satislar daha guclu gidiyor.` : lang === 'en' ? `Sales are stronger this "${term}".` : lang === 'de' ? `In diesem "${term}" laufen die Verkaufszahlen besser.` : `Las ventas van mejor en este "${term}".`;
    default:
      return getContextualExample(key, lang, term, variant);
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

  const sentence = getNaturalExample(key, lang, term, variant);
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
  return rotated.slice(0, Math.min(rotated.length, 7));
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
  const allKeys = Object.keys(PHRASES);
  const desiredKeyCount = tier === 'master' ? 8 : tier === 'navigator' ? 7 : tier === 'explorer' ? 6 : 5;
  const tierUnits = getTierUnitWindow(unitNo, tier);
  const tierWindowKeys = Array.from(
    new Set(tierUnits.flatMap((number) => UNIT_VOCAB[number] ?? []))
  );

  const lessonKeys = prioritizeFreshKeys([
    ...weakFocuses.filter((focus) => Object.prototype.hasOwnProperty.call(PHRASES, focus)),
    ...TIER_BONUS_VOCAB[tier],
    ...pickLessonKeys(unitNo, lessonNo, sessionSeed),
    ...sortBySeed(tierWindowKeys, `${sessionSeed}:tierWindow`).slice(0, tier === 'master' ? 4 : tier === 'navigator' ? 3 : 2),
  ], recentQuestionIds, sessionSeed).slice(0, desiredKeyCount);
  const contextKeys = Array.from(new Set([...(UNIT_VOCAB[unitNo] ?? []), ...tierWindowKeys, ...lessonKeys]));
  const unitTargetPool = contextKeys.map((key) => PHRASES[key][targetLanguage]);
  const unitSourcePool = contextKeys.map((key) => PHRASES[key][sourceLanguage]);
  const targetPool = Array.from(new Set([
    ...unitTargetPool,
    ...allKeys.map((key) => PHRASES[key][targetLanguage]),
  ]));
  const sourcePool = Array.from(new Set([
    ...unitSourcePool,
    ...allKeys.map((key) => PHRASES[key][sourceLanguage]),
  ]));

  const pool: QuizQuestion[] = [];

  lessonKeys.forEach((key, index) => {
    const source = PHRASES[key][sourceLanguage];
    const target = PHRASES[key][targetLanguage];
    const clusterKeys = getClusterKeysForKey(key);
    const clusterTargetPool = clusterKeys.map((clusterKey) => PHRASES[clusterKey][targetLanguage]);
    const clusterSourcePool = clusterKeys.map((clusterKey) => PHRASES[clusterKey][sourceLanguage]);
    const sentenceOptionKeys = prioritizeFreshKeys([
      key,
      ...sortBySeed(clusterKeys.filter((clusterKey) => clusterKey !== key), `${sessionSeed}:${key}:clusterSentence`).slice(0, 3),
      ...sortBySeed(lessonKeys.filter((lessonKey) => lessonKey !== key), `${sessionSeed}:${key}:lessonSentence`).slice(0, 3),
    ], recentQuestionIds, `${sessionSeed}:${key}:sentenceOptions`).slice(0, 6);
    const targetSentence = buildSentence(key, targetLanguage, tier, index);
    const sourceSentence = buildSentence(key, sourceLanguage, tier, index);
    const sentenceOptions = sentenceOptionKeys.map((candidateKey, candidateIndex) =>
      buildSentence(candidateKey, targetLanguage, tier, candidateIndex)
    );
    const baseXP = Math.round(10 * DIFFICULTY_META[tier].xpScale * (mode === 'boss' ? 1.4 : mode === 'timed' ? 1.2 : mode === 'review' ? 1.1 : 1));
    const translateWordPrompt = getPromptVariant(uiLanguage, 'translateWord', `${sessionSeed}:${key}:translatePrompt`) as (word: string, toName: string) => string;
    const chooseCorrectPrompt = getPromptVariant(uiLanguage, 'chooseCorrect', `${sessionSeed}:${key}:selectPrompt`) as (word: string, toName: string) => string;
    const translateSentencePrompt = getPromptVariant(uiLanguage, 'translateSentence', `${sessionSeed}:${key}:sentencePrompt`) as (toName: string) => string;
    const fillBlankPrompt = getPromptVariant(uiLanguage, 'fillBlank', `${sessionSeed}:${key}:blankPrompt`) as string;
    const listenPrompt = getPromptVariant(uiLanguage, 'listenPrompt', `${sessionSeed}:${key}:listenPrompt`) as string;
    const pronouncePrompt = getPromptVariant(uiLanguage, 'pronouncePrompt', `${sessionSeed}:${key}:pronouncePrompt`) as (toName: string) => string;

    pool.push(
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_translate`,
        type: 'translate',
        question: translateWordPrompt(source, targetName),
        prompt: source,
        options: buildOptions(target, [clusterTargetPool, unitTargetPool, targetPool], `${sessionSeed}:${key}:translate`),
        correctAnswer: target,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_select`,
        type: 'select',
        question: chooseCorrectPrompt(source, targetName),
        prompt: source,
        options: buildOptions(target, [clusterTargetPool, unitTargetPool, targetPool], `${sessionSeed}:${key}:select`),
        correctAnswer: target,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_reverse`,
        type: 'select',
        question: chooseCorrectPrompt(target, ui.langName[sourceLanguage]),
        prompt: target,
        options: buildOptions(source, [clusterSourcePool, unitSourcePool, sourcePool], `${sessionSeed}:${key}:reverse`),
        correctAnswer: source,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_blank`,
        type: 'fillBlank',
        question: fillBlankPrompt,
        sentence: targetSentence.replace(target, '_____'),
        options: buildOptions(target, [clusterTargetPool, unitTargetPool, targetPool], `${sessionSeed}:${key}:blank`),
        correctAnswer: target,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_sentence`,
        type: 'translate',
        question: translateSentencePrompt(targetName),
        prompt: sourceSentence,
        options: buildOptions(targetSentence, [sentenceOptions, sentenceOptions], `${sessionSeed}:${key}:sentence`),
        correctAnswer: targetSentence,
        xp: baseXP + 2,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_listen`,
        type: 'listen',
        question: listenPrompt,
        audioText: target,
        audioLanguage: getSpeechLanguageCode(targetLanguage),
        options: buildOptions(source, [clusterSourcePool, unitSourcePool, sourcePool], `${sessionSeed}:${key}:listen`),
        correctAnswer: source,
        xp: baseXP,
        focus: key,
        difficulty: tier,
      },
      {
        id: `${lesson.id}_${mode}_${tier}_${key}_pronounce`,
        type: 'pronounce',
        question: pronouncePrompt(targetName),
        prompt: target,
        audioText: target,
        audioLanguage: getSpeechLanguageCode(targetLanguage),
        options: buildOptions(target, [clusterTargetPool, unitTargetPool, targetPool], `${sessionSeed}:${key}:pronounce`),
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
  if (tier === 'master') return 'C1';
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

  return UNITS.map((unit, unitIndex) => {
    const unitCopy = UNIT_COPY[displayLanguage][unit.id];
    const gated = unitIndex < meta.unitOffset;
    return {
      ...unit,
      title: unitCopy?.title ?? unit.title,
      description: gated ? meta.description : unitCopy?.description ?? unit.description,
      completed: gated ? true : unit.completed,
      icon: unit.icon,
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
