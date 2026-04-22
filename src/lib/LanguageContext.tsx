'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TranslationKey, t as translate } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nibras-lang', newLang);
      document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang === 'ur' ? 'ur' : 'en';
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ur' : 'en');
  }, [lang, setLang]);

  const t = useCallback((key: TranslationKey) => {
    return translate(key, lang);
  }, [lang]);

  const isRTL = lang === 'ur';

  useEffect(() => {
    const saved = localStorage.getItem('nibras-lang') as Language | null;
    if (saved && (saved === 'en' || saved === 'ur')) {
      setLang(saved);
    }
  }, [setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}