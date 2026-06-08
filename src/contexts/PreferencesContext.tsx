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
import { detectDeviceTier } from '../lib/device';

function getDefaultPreferences(): UserPreferences {
  let prefersReducedMotion = false;
  let prefersDark = false;

  try {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    // matchMedia unavailable
  }

  // Adaptive defaults: drive heavy-effect defaults from detected device tier so
  // mid-/low-end devices don't pay for full effects on first visit. This only
  // runs when there are no stored preferences (see getInitialPreferences), so an
  // explicit user choice is never overridden.
  const tier = detectDeviceTier();

  let performanceMode: PerformanceMode = 'full';
  let particles = true;
  let animations = true;
  let blur = true;
  let cursorEffects = true;

  if (tier === 'low') {
    performanceMode = 'battery-saver';
    particles = false;
    animations = false;
    blur = false;
    cursorEffects = false;
  } else if (tier === 'mid') {
    performanceMode = 'reduced';
    particles = false;
    blur = false;
    // keep animations on, but no cursor effects on mid-tier
    cursorEffects = false;
  }
  // tier === 'high' keeps the full experience (all effects on).

  // prefers-reduced-motion always wins: force motion reduction regardless of tier.
  if (prefersReducedMotion) {
    animations = false;
    particles = false;
    cursorEffects = false;
  }

  return {
    theme: prefersDark ? 'dark' : 'light',
    language: 'en',
    interfaceMode: 'comfortable',
    performanceMode,
    visualEffects: {
      particles,
      animations,
      blur,
      motionReduction: prefersReducedMotion,
      cursorEffects,
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
