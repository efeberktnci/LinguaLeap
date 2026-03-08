import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLanguage, PHRASE_TRANSLATIONS, TRANSLATIONS, TranslationKey } from '../i18n/translations';

interface LanguageOption {
  code: AppLanguage;
  label: string;
  flag: string;
}

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (next: AppLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
  tx: (text: string) => string;
  options: LanguageOption[];
  activeFlag: string;
}

const STORAGE_KEY = 'lingualeap_language';

const options: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'tr', label: 'Turkce', flag: '\u{1F1F9}\u{1F1F7}' },
  { code: 'de', label: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'es', label: 'Espanol', flag: '\u{1F1EA}\u{1F1F8}' },
];

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: async () => {},
  t: (key) => TRANSLATIONS.en[key],
  tx: (text) => text,
  options,
  activeFlag: '\u{1F1EC}\u{1F1E7}',
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'tr' || saved === 'de' || saved === 'es') {
        setLanguageState(saved);
      }
    })();
  }, []);

  const setLanguage = async (next: AppLanguage) => {
    setLanguageState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo<LanguageContextValue>(() => {
    const activeFlag = options.find((o) => o.code === language)?.flag ?? options[0].flag;
    return {
      language,
      setLanguage,
      t: (key: TranslationKey) => TRANSLATIONS[language][key] ?? TRANSLATIONS.en[key],
      tx: (text: string) => PHRASE_TRANSLATIONS[language][text] ?? text,
      options,
      activeFlag,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => useContext(LanguageContext);
