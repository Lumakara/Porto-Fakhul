import { useEffect } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { configureAudio, playSound } from '../lib/audioFeedback';

const INTERACTIVE_SELECTOR =
  '[data-cursor], button, a, [role="button"], input, select, textarea, [data-sound]';

/**
 * Global, render-less manager that plays subtle mechanical UI sounds when the
 * pointer hovers or clicks interactive elements. Gated entirely behind the
 * `audio.uiSounds` preference so it is silent (and listener-free) by default.
 */
export function AudioFeedbackManager() {
  const { preferences } = usePreferences();
  const { uiSounds, volume } = preferences.audio;

  useEffect(() => {
    configureAudio({ enabled: uiSounds, volume });
  }, [uiSounds, volume]);

  useEffect(() => {
    if (!uiSounds) return;
    // Avoid attaching on touch-only devices where "hover" is meaningless.
    const isTouch = window.matchMedia('(hover: none)').matches;

    let lastTarget: Element | null = null;

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(INTERACTIVE_SELECTOR);
      if (el && el !== lastTarget) {
        lastTarget = el;
        playSound('hover');
      } else if (!el) {
        lastTarget = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(INTERACTIVE_SELECTOR);
      if (!el) return;
      const role = el.getAttribute('role');
      if (el.getAttribute('data-sound') === 'toggle' || role === 'switch') {
        playSound('toggle');
      } else {
        playSound('click');
      }
    };

    if (!isTouch) {
      document.addEventListener('pointerover', handlePointerOver, { passive: true });
    }
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('click', handleClick);
    };
  }, [uiSounds]);

  return null;
}
