import { Waves, Disc3, Radio, VolumeX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MusicTrack {
  /** Stable id stored in preferences.music.playlist */
  id: string;
  /** i18n key for the human label */
  labelKey: string;
  /** Local file served from /public. `null` = silence ("none"). */
  src: string | null;
  /** Icon shown in the settings playlist cards */
  icon: LucideIcon;
  /** Tailwind text-color class for the icon */
  iconClass: string;
  /** Tailwind bg-color class for the animated equalizer bars */
  barClass: string;
}

/**
 * Background-music tracks. Drop your own audio files into `public/music/`
 * using the exact filenames below (or edit the `src` paths here). Files in
 * `public/` are served from the site root, so the path is `/music/...`
 * (NOT `/public/music/...`).
 *   public/music/ambient.mp3      ->  /music/ambient.mp3
 *   public/music/lofi.mp3         ->  /music/lofi.mp3
 *   public/music/electronic.mp3   ->  /music/electronic.mp3
 */
export const musicTracks: MusicTrack[] = [
  {
    id: 'ambient',
    labelKey: 'settings.music.playlistOptions.ambient',
    src: '/music/ambient.mp3',
    icon: Waves,
    iconClass: 'text-terracotta',
    barClass: 'bg-terracotta',
  },
  {
    id: 'lofi',
    labelKey: 'settings.music.playlistOptions.lofi',
    src: '/music/lofi.mp3',
    icon: Disc3,
    iconClass: 'text-sage',
    barClass: 'bg-sage',
  },
  {
    id: 'electronic',
    labelKey: 'settings.music.playlistOptions.electronic',
    src: '/music/electronic.mp3',
    icon: Radio,
    iconClass: 'text-gold',
    barClass: 'bg-gold',
  },
  {
    id: 'none',
    labelKey: 'settings.music.playlistOptions.none',
    src: null,
    icon: VolumeX,
    iconClass: 'text-charcoal-light',
    barClass: 'bg-charcoal/30',
  },
];

/** Resolve a playlist id to its local audio source (or null for silence). */
export function getTrackSrc(id: string): string | null {
  return musicTracks.find((track) => track.id === id)?.src ?? null;
}
