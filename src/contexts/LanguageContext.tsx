import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';

import en from '../locales/en.json';
import id from '../locales/id.json';
import zh from '../locales/zh.json';

type TranslationMap = Record<string, unknown>;

const translations: Record<Language, TranslationMap> = { en, id, zh };

const STORAGE_KEY = 'porto-language';

function detectBrowserLanguage(): Language {
  try {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (browserLang === 'id') return 'id';
    if (browserLang === 'zh') return 'zh';
    return 'en';
  } catch {
    return 'en';
  }
}

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'id' || stored === 'zh') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return detectBrowserLanguage();
}

function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current === 'string') return current;
  return undefined;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // localStorage unavailable
    }
  }, [language]);

  const t = useCallback((key: string): string => {
    const value = getNestedValue(translations[language], key);
    if (value !== undefined) return value;

    // Fallback to English
    if (language !== 'en') {
      const fallback = getNestedValue(translations.en, key);
      if (fallback !== undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation for key "${key}" in language "${language}". Falling back to English.`);
        }
        return fallback;
      }
    }

    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation key: "${key}"`);
    }
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
