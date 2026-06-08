import { useState, useEffect } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';

// Premium Easing Curves (also exported from Section.tsx for backward compatibility)
export const premiumEase = [0.16, 1, 0.3, 1] as const;
export const springEase = [0.22, 1, 0.36, 1] as const;

export function useReducedMotion(): boolean {
  const [browserPrefersReduced, setBrowserPrefersReduced] = useState(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch {
      return;
    }

    const handler = (e: MediaQueryListEvent) => {
      setBrowserPrefersReduced(e.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const { preferences } = usePreferences();
  const userPrefersReduced = preferences.visualEffects.motionReduction;

  return browserPrefersReduced || userPrefersReduced;
}

/**
 * Returns true when heavy reveal/parallax effects should be skipped: either the
 * effective performance mode is one of the lighter tiers (battery-saver /
 * reduced / low-gpu) OR reduced motion is active. Components use this to drop
 * expensive blur/3D transforms on mid-/low-end devices.
 */
export function useLowPerf(): boolean {
  const reducedMotion = useReducedMotion();
  const { preferences } = usePreferences();
  const mode = preferences.performanceMode;
  const lowPerfMode =
    mode === 'battery-saver' || mode === 'reduced' || mode === 'low-gpu';
  return reducedMotion || lowPerfMode;
}
