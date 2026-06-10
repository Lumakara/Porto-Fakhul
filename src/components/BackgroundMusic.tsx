import { useEffect, useRef } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { getTrackSrc } from '../data/music';

/**
 * Headless background-music player.
 *
 * Plays local audio files (served from /public/music) based on the user's
 * music settings. Renders nothing. Browsers block autoplay until the user
 * interacts with the page, so playback starts the moment the user toggles
 * music on (a gesture) or after their first interaction.
 */
export function BackgroundMusic() {
  const { preferences } = usePreferences();
  const { enabled, volume, playlist } = preferences.music;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create a single looping <audio> element for the lifetime of the app.
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Keep volume in sync.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.min(1, Math.max(0, volume));
  }, [volume]);

  // Drive source + play/pause from settings.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const src = getTrackSrc(playlist);
    const shouldPlay = enabled && !!src;

    if (!shouldPlay) {
      audio.pause();
      return;
    }

    // Only reset the source when it actually changes (avoids restarting).
    const resolved = new URL(src as string, window.location.href).href;
    if (audio.src !== resolved) {
      audio.src = src as string;
    }
    audio.volume = Math.min(1, Math.max(0, volume));

    // Try immediately; if autoplay is blocked, retry on first interaction.
    const tryPlay = () => audio.play().catch(() => undefined);
    void tryPlay();

    const onInteract = () => {
      void tryPlay();
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
    window.addEventListener('pointerdown', onInteract);
    window.addEventListener('keydown', onInteract);

    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, [enabled, playlist, volume]);

  return null;
}
