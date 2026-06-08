import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import type { ThemeMode } from './SettingsContext';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useSettings();

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  // Listen for OS preference changes
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      setTheme,
    }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
