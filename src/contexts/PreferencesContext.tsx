import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  UserPreferences,
  Theme,
  InterfaceMode,
  PerformanceMode,
  VisualEffects,
  MusicSettings,
} from '../types';
import { getPreferences, savePreferences } from '../lib/storage';

function getDefaultPreferences(): UserPreferences {
  let prefersReducedMotion = false;
  let prefersDark = false;

  try {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    // matchMedia unavailable
  }

  return {
    theme: prefersDark ? 'dark' : 'light',
    language: 'en',
    interfaceMode: 'comfortable',
    performanceMode: 'full',
    visualEffects: {
      particles: !prefersReducedMotion,
      animations: !prefersReducedMotion,
      blur: true,
      motionReduction: prefersReducedMotion,
      cursorEffects: !prefersReducedMotion,
    },
    music: {
      enabled: false,
      volume: 0.5,
      playlist: 'ambient',
    },
  };
}

function getInitialPreferences(): UserPreferences {
  const stored = getPreferences();
  if (stored) return stored;
  return getDefaultPreferences();
}

interface PreferencesContextValue {
  preferences: UserPreferences;
  setTheme: (theme: Theme) => void;
  setMusic: (music: MusicSettings) => void;
  setVisualEffects: (effects: VisualEffects) => void;
  setInterfaceMode: (mode: InterfaceMode) => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(getInitialPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setTheme = useCallback((theme: Theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  }, []);

  const setMusic = useCallback((music: MusicSettings) => {
    setPreferences((prev) => ({ ...prev, music }));
  }, []);

  const setVisualEffects = useCallback((visualEffects: VisualEffects) => {
    setPreferences((prev) => ({ ...prev, visualEffects }));
  }, []);

  const setInterfaceMode = useCallback((interfaceMode: InterfaceMode) => {
    setPreferences((prev) => ({ ...prev, interfaceMode }));
  }, []);

  const setPerformanceMode = useCallback((performanceMode: PerformanceMode) => {
    setPreferences((prev) => ({ ...prev, performanceMode }));
  }, []);

  const resetPreferences = useCallback(() => {
    const defaults = getDefaultPreferences();
    setPreferences(defaults);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setTheme,
        setMusic,
        setVisualEffects,
        setInterfaceMode,
        setPerformanceMode,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
