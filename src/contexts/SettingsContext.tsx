import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { SupportedLanguage } from '../i18n/index';

export type ThemeMode = 'light' | 'dark' | 'system';
export type InterfaceMode = 'compact' | 'comfortable' | 'large';
export type PerformanceMode = 'full' | 'battery-saver' | 'low-gpu' | 'reduced';

export interface VisualEffects {
  particles: boolean;
  animations: boolean;
  blur: boolean;
  motionReduction: boolean;
  cursorEffects: boolean;
}

export interface MusicSettings {
  enabled: boolean;
  volume: number;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: SupportedLanguage;
  music: MusicSettings;
  effects: VisualEffects;
  interfaceMode: InterfaceMode;
  performanceMode: PerformanceMode;
}

interface SettingsContextValue extends UserPreferences {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setMusic: (music: MusicSettings) => void;
  setEffects: (effects: VisualEffects) => void;
  setInterfaceMode: (mode: InterfaceMode) => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'portfolio-settings';

const defaultEffects: VisualEffects = {
  particles: true,
  animations: true,
  blur: true,
  motionReduction: false,
  cursorEffects: true,
};

const defaultMusic: MusicSettings = {
  enabled: false,
  volume: 0.5,
};

function detectBrowserLanguage(): SupportedLanguage {
  const supported: SupportedLanguage[] = ['en', 'id', 'zh'];
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();

  if (supported.includes(langCode as SupportedLanguage)) {
    return langCode as SupportedLanguage;
  }
  return 'en';
}

function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'light',
    language: detectBrowserLanguage(),
    music: defaultMusic,
    effects: defaultEffects,
    interfaceMode: 'comfortable',
    performanceMode: 'full',
  };
}

function loadPersistedSettings(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<UserPreferences>;
      const defaults = getDefaultPreferences();
      return {
        theme: parsed.theme ?? defaults.theme,
        language: parsed.language ?? defaults.language,
        music: parsed.music ?? defaults.music,
        effects: parsed.effects ?? defaults.effects,
        interfaceMode: parsed.interfaceMode ?? defaults.interfaceMode,
        performanceMode: parsed.performanceMode ?? defaults.performanceMode,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return getDefaultPreferences();
}

function persistSettings(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore quota errors
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPersistedSettings);

  // Persist on change
  useEffect(() => {
    persistSettings(preferences);
  }, [preferences]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    let resolvedTheme: 'light' | 'dark';

    if (preferences.theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolvedTheme = preferences.theme;
    }

    root.setAttribute('data-theme', resolvedTheme);
    root.classList.toggle('dark', resolvedTheme === 'dark');

    // Listen for system theme changes when in system mode
    if (preferences.theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        root.classList.toggle('dark', e.matches);
      };
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [preferences.theme]);

  const setTheme = useCallback((theme: ThemeMode) => {
    // Add transition class briefly so theme switch animates smoothly
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 400);
    setPreferences((prev) => ({ ...prev, theme }));
  }, []);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    setPreferences((prev) => ({ ...prev, language }));
  }, []);

  const setMusic = useCallback((music: MusicSettings) => {
    setPreferences((prev) => ({ ...prev, music }));
  }, []);

  const setEffects = useCallback((effects: VisualEffects) => {
    setPreferences((prev) => ({ ...prev, effects }));
  }, []);

  const setInterfaceMode = useCallback((interfaceMode: InterfaceMode) => {
    setPreferences((prev) => ({ ...prev, interfaceMode }));
  }, []);

  const setPerformanceMode = useCallback((performanceMode: PerformanceMode) => {
    setPreferences((prev) => ({ ...prev, performanceMode }));
  }, []);

  const resetSettings = useCallback(() => {
    setPreferences(getDefaultPreferences());
  }, []);

  const value: SettingsContextValue = {
    ...preferences,
    setTheme,
    setLanguage,
    setMusic,
    setEffects,
    setInterfaceMode,
    setPerformanceMode,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
