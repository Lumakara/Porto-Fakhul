import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  UserPreferences,
  Theme,
  InterfaceMode,
  PerformanceMode,
  VisualEffects,
  MusicSettings,
  AudioSettings,
  AISettings,
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

  const defaultPersonality =
    "You are Fakhul's AI assistant embedded in his portfolio website. Fakhul Rohman is a creative web developer based in Depok, West Java, Indonesia, with experience in React, TypeScript, Tailwind CSS, network/CCTV technical work, and quality control. You are warm, concise, and a little playful. Help visitors learn about Fakhul's skills, projects, and how to get in touch. Keep answers short and friendly.";

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
      tilt: !prefersReducedMotion,
    },
    music: {
      enabled: false,
      volume: 0.5,
      playlist: 'ambient',
    },
    audio: {
      uiSounds: false,
      volume: 0.3,
    },
    ai: {
      apiKey: '',
      model: 'gpt-4o-mini',
      personality: defaultPersonality,
      temperature: 0.7,
    },
  };
}

function getInitialPreferences(): UserPreferences {
  const defaults = getDefaultPreferences();
  const stored = getPreferences();
  if (!stored) return defaults;
  // Deep-merge stored prefs over defaults so newly-added fields are always present
  return {
    ...defaults,
    ...stored,
    visualEffects: { ...defaults.visualEffects, ...stored.visualEffects },
    music: { ...defaults.music, ...stored.music },
    audio: { ...defaults.audio, ...stored.audio },
    ai: { ...defaults.ai, ...stored.ai },
  };
}

interface PreferencesContextValue {
  preferences: UserPreferences;
  setTheme: (theme: Theme) => void;
  setMusic: (music: MusicSettings) => void;
  setVisualEffects: (effects: VisualEffects) => void;
  setInterfaceMode: (mode: InterfaceMode) => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  setAudio: (audio: AudioSettings) => void;
  setAI: (ai: AISettings) => void;
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

  const setAudio = useCallback((audio: AudioSettings) => {
    setPreferences((prev) => ({ ...prev, audio }));
  }, []);

  const setAI = useCallback((ai: AISettings) => {
    setPreferences((prev) => ({ ...prev, ai }));
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
        setAudio,
        setAI,
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
