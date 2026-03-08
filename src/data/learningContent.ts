import { AppLanguage } from '../i18n/translations';
import { Lesson, QuizQuestion, Unit } from '../types';
import { UNITS } from './mockData';

export type LearnTargetLanguage = 'en' | 'de' | 'es' | 'tr';

export interface LearnLanguageOption {
  code: LearnTargetLanguage;
  flag: string;
  label: string;
}

export const LEARN_LANGUAGE_OPTIONS: LearnLanguageOption[] = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'English' },
  { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', label: 'Deutsch' },
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', label: 'Español' },
  { code: 'tr', flag: '\u{1F1F9}\u{1F1F7}', label: 'Türkçe' },
];

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
  pronounceHint: string;
  langName: Record<LearnTargetLanguage, string>;
}> = {
  tr: {
    translateWord: (word, toName) => `"${word}" ifadesini ${toName} diline çevir`,
    chooseCorrect: (word, toName) => `"${word}" için doğru ${toName} karşılığını seç`,
    translateSentence: (toName) => `Cümleyi ${toName} diline çevir`,
    fillBlank: 'Boşluğu doğru kelimeyle tamamla',
    listenPrompt: 'Hoparlöre dokun, sesi dinle ve doğru seçeneği işaretle',
    pronouncePrompt: (toName) => `${toName} kelimeyi mikrofona doğru telaffuz et`,
    pronounceHint: 'Mikrofona bas ve ekrandaki kelimeyi net söyle',
    langName: { tr: 'Türkçe', en: 'İngilizce', de: 'Almanca', es: 'İspanyolca' },
  },
  en: {
    translateWord: (word, toName) => `Translate "${word}" to ${toName}`,
    chooseCorrect: (word, toName) => `Choose the correct ${toName} translation for "${word}"`,
    translateSentence: (toName) => `Translate the sentence to ${toName}`,
    fillBlank: 'Complete the blank with the correct word',
    listenPrompt: 'Tap the speaker, listen carefully, then pick the correct answer',
    pronouncePrompt: (toName) => `Pronounce the ${toName} word into the microphone`,
    pronounceHint: 'Tap the mic and clearly speak the shown word',
    langName: { tr: 'Turkish', en: 'English', de: 'German', es: 'Spanish' },
  },
  de: {
    translateWord: (word, toName) => `Übersetze "${word}" auf ${toName}`,
    chooseCorrect: (word, toName) => `Wähle die richtige ${toName}-Übersetzung für "${word}"`,
    translateSentence: (toName) => `Übersetze den Satz auf ${toName}`,
    fillBlank: 'Fülle die Lücke mit dem richtigen Wort',
    listenPrompt: 'Tippe auf den Lautsprecher, höre zu und wähle die richtige Antwort',
    pronouncePrompt: (toName) => `Sprich das ${toName}-Wort ins Mikrofon`,
    pronounceHint: 'Tippe auf das Mikrofon und sprich das Wort deutlich',
    langName: { tr: 'Türkisch', en: 'Englisch', de: 'Deutsch', es: 'Spanisch' },
  },
  es: {
    translateWord: (word, toName) => `Traduce "${word}" a ${toName}`,
    chooseCorrect: (word, toName) => `Elige la traducción correcta en ${toName} para "${word}"`,
    translateSentence: (toName) => `Traduce la oración a ${toName}`,
    fillBlank: 'Completa el espacio con la palabra correcta',
    listenPrompt: 'Toca el altavoz, escucha y elige la respuesta correcta',
    pronouncePrompt: (toName) => `Pronuncia la palabra en ${toName} usando el micrófono`,
    pronounceHint: 'Toca el micrófono y pronuncia claramente la palabra',
    langName: { tr: 'Turco', en: 'Inglés', de: 'Alemán', es: 'Español' },
  },
};

const seeded = (seed: string, offset = 0) => {
  let n = 0;
  for (let i = 0; i < seed.length; i += 1) n += seed.charCodeAt(i) * (i + 5);
  return (n + offset * 71) % 9999;
};

const getSpeechLanguageCode = (language: LearnTargetLanguage) => {
  if (language === 'de') return 'de-DE';
  if (language === 'es') return 'es-ES';
  if (language === 'tr') return 'tr-TR';
  return 'en-US';
};

const buildOptions = (
  correct: string,
  pool: string[],
  globalPool: string[],
  fallbackPool: string[],
  seed: string,
  index: number
) => {
  const localCandidates = Array.from(new Set(pool.filter((p) => p && p !== correct)));
  const globalCandidates = Array.from(new Set(globalPool.filter((p) => p && p !== correct)));
  const candidates = [...localCandidates, ...globalCandidates.filter((p) => !localCandidates.includes(p))];

  const shuffled = candidates.sort((a, b) => seeded(`${seed}:${a}`, index) - seeded(`${seed}:${b}`, index));
  const picked = shuffled.slice(0, 3);

  if (picked.length < 3) {
    for (const word of fallbackPool) {
      if (picked.length >= 3) break;
      if (word !== correct && !picked.includes(word)) picked.push(word);
    }
  }

  const options = [correct, ...picked];
  return options.sort((a, b) => seeded(`${seed}:${a}`, index + 7) - seeded(`${seed}:${b}`, index + 7));
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

const pickUnitPhrase = (unitNo: number, lessonNo: number, qNo: number) => {
  const list = UNIT_VOCAB[unitNo] ?? UNIT_VOCAB[1];
  return list[(lessonNo + qNo - 2) % list.length];
};

const buildSentence = (key: string, lang: LearnTargetLanguage) => {
  const term = PHRASES[key][lang];

  const templates: Record<LearnTargetLanguage, string[]> = {
    tr: [
      `Bugünkü kelime: ${term}.`,
      `Bu ifadeyi tekrar et: ${term}.`,
      `Örnek kullanım: ${term}.`,
      `Ders notu: ${term}.`,
    ],
    en: [
      `Today's word is ${term}.`,
      `Repeat this expression: ${term}.`,
      `Example usage: ${term}.`,
      `Lesson note: ${term}.`,
    ],
    de: [
      `Das Wort von heute ist ${term}.`,
      `Wiederhole diesen Ausdruck: ${term}.`,
      `Beispielverwendung: ${term}.`,
      `Lektionsnotiz: ${term}.`,
    ],
    es: [
      `La palabra de hoy es ${term}.`,
      `Repite esta expresión: ${term}.`,
      `Uso de ejemplo: ${term}.`,
      `Nota de la lección: ${term}.`,
    ],
  };

  const pick = seeded(`${key}:${lang}`, 3) % templates[lang].length;
  return templates[lang][pick];
};

export const getUnitsForTargetLanguage = (displayLanguage: LearnTargetLanguage): Unit[] =>
  UNITS.map((unit) => {
    const unitCopy = UNIT_COPY[displayLanguage][unit.id];
    return {
      ...unit,
      title: unitCopy?.title ?? unit.title,
      description: unitCopy?.description ?? unit.description,
      lessons: unit.lessons.map((lesson) => ({
        ...lesson,
        title: LESSON_COPY[displayLanguage][lesson.id] ?? lesson.title,
      })),
    };
  });

export const getLessonQuestions = (lesson: Lesson, uiLanguage: AppLanguage, targetLanguage: LearnTargetLanguage): QuizQuestion[] => {
  const ui = UI_COPY[uiLanguage] ?? UI_COPY.en;
  const sourceLanguage = getSourceLang(uiLanguage, targetLanguage);
  const targetName = ui.langName[targetLanguage];
  const { unitNo, lessonNo } = parseLessonMeta(lesson.id);

  const keyA = pickUnitPhrase(unitNo, lessonNo, 1);
  const keyB = pickUnitPhrase(unitNo, lessonNo, 2);
  const keyC = pickUnitPhrase(unitNo, lessonNo, 3);
  const keyD = pickUnitPhrase(unitNo, lessonNo, 4);
  const keyE = pickUnitPhrase(unitNo, lessonNo, 5);
  const keyF = pickUnitPhrase(unitNo, lessonNo, 6);

  const unitPool = UNIT_VOCAB[unitNo] ?? UNIT_VOCAB[1];
  const allPoolKeys = Array.from(new Set(Object.values(UNIT_VOCAB).flat()));

  const sourcePool = unitPool.map((k) => PHRASES[k][sourceLanguage]);
  const targetPool = unitPool.map((k) => PHRASES[k][targetLanguage]);
  const globalSourcePool = allPoolKeys.map((k) => PHRASES[k][sourceLanguage]);
  const globalTargetPool = allPoolKeys.map((k) => PHRASES[k][targetLanguage]);

  const sourceSentencePool = unitPool.map((k) => buildSentence(k, sourceLanguage));
  const targetSentencePool = unitPool.map((k) => buildSentence(k, targetLanguage));

  const q1Source = PHRASES[keyA][sourceLanguage];
  const q1Correct = PHRASES[keyA][targetLanguage];
  const q2Source = PHRASES[keyB][sourceLanguage];
  const q2Correct = PHRASES[keyB][targetLanguage];
  const q3PromptSentence = buildSentence(keyC, sourceLanguage);
  const q3Correct = buildSentence(keyC, targetLanguage);
  const q4Correct = PHRASES[keyD][targetLanguage];
  const q5Audio = PHRASES[keyE][targetLanguage];
  const q5Correct = PHRASES[keyE][sourceLanguage];
  const q6Word = PHRASES[keyF][targetLanguage];

  return [
    {
      id: `${lesson.id}_q1`,
      type: 'translate',
      question: ui.translateWord(q1Source, targetName),
      prompt: q1Source,
      options: buildOptions(q1Correct, targetPool, globalTargetPool, globalTargetPool, lesson.id, 1),
      correctAnswer: q1Correct,
      xp: 10,
    },
    {
      id: `${lesson.id}_q2`,
      type: 'select',
      question: ui.chooseCorrect(q2Source, targetName),
      prompt: q2Source,
      options: buildOptions(q2Correct, targetPool, globalTargetPool, globalTargetPool, lesson.id, 2),
      correctAnswer: q2Correct,
      xp: 10,
    },
    {
      id: `${lesson.id}_q3`,
      type: 'translate',
      question: ui.translateSentence(targetName),
      prompt: q3PromptSentence,
      options: buildOptions(q3Correct, targetSentencePool, [...targetSentencePool, ...sourceSentencePool], targetSentencePool, lesson.id, 3),
      correctAnswer: q3Correct,
      xp: 10,
    },
    {
      id: `${lesson.id}_q4`,
      type: 'fillBlank',
      question: ui.fillBlank,
      sentence: buildSentence(keyD, targetLanguage).replace(q4Correct, '_____'),
      options: buildOptions(q4Correct, targetPool, globalTargetPool, globalTargetPool, lesson.id, 4),
      correctAnswer: q4Correct,
      xp: 10,
    },
    {
      id: `${lesson.id}_q5`,
      type: 'listen',
      question: ui.listenPrompt,
      audioText: q5Audio,
      audioLanguage: getSpeechLanguageCode(targetLanguage),
      options: buildOptions(q5Correct, sourcePool, globalSourcePool, globalSourcePool, lesson.id, 5),
      correctAnswer: q5Correct,
      xp: 10,
    },
    {
      id: `${lesson.id}_q6`,
      type: 'pronounce',
      question: ui.pronouncePrompt(targetName),
      prompt: q6Word,
      audioText: q6Word,
      audioLanguage: getSpeechLanguageCode(targetLanguage),
      correctAnswer: q6Word,
      xp: 15,
    },
  ];
};
