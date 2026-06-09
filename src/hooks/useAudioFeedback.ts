import { useEffect } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { configureAudio, playSound } from '../lib/audioFeedback';

/**
 * Syncs the audio engine with user preferences and returns the `play` function
 * for firing UI sounds imperatively. `playSound` is a stable module-level
 * function, so it is safe to return directly.
 */
export function useAudioFeedback() {
  const { preferences } = usePreferences();
  const { uiSounds, volume } = preferences.audio;

  useEffect(() => {
    configureAudio({ enabled: uiSounds, volume });
  }, [uiSounds, volume]);

  return { play: playSound, enabled: uiSounds };
}
