import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import en from './locales/en';
import id from './locales/id';
import zh from './locales/zh';
import type { Locale } from './locales/en';

export type SupportedLanguage = 'en' | 'id' | 'zh';

const locales: Record<SupportedLanguage, Locale> = { en, id, zh };

function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export function useTranslation() {
  const { language } = useSettings();

  const t = useCallback(
    (key: string): string => {
      const locale = locales[language] ?? locales.en;
      const value = getNestedValue(locale, key);

      if (typeof value === 'string') {
        return value;
      }

      // Fallback to English
      if (language !== 'en') {
        const fallbackValue = getNestedValue(locales.en, key);
        if (typeof fallbackValue === 'string') {
          if (import.meta.env.DEV) {
            console.warn(`[i18n] Missing translation for key "${key}" in locale "${language}"`);
          }
          return fallbackValue;
        }
      }

      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation key: "${key}"`);
      }
      return key;
    },
    [language]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const locale = locales[language] ?? locales.en;
      const value = getNestedValue(locale, key);

      if (Array.isArray(value) && value.length > 0) {
        return value as string[];
      }

      // Fallback to English if array is missing or empty
      if (language !== 'en') {
        const fallbackValue = getNestedValue(locales.en, key);
        if (Array.isArray(fallbackValue) && fallbackValue.length > 0) {
          if (import.meta.env.DEV) {
            console.warn(`[i18n] Missing translation array for key "${key}" in locale "${language}"`);
          }
          return fallbackValue as string[];
        }
      }

      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation array key: "${key}"`);
      }
      return [];
    },
    [language]
  );

  return { t, tArray, language };
}

export { locales };
export type { Locale };
