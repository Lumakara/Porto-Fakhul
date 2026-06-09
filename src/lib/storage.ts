import type { UserPreferences } from '../types';

const STORAGE_KEY = 'porto-user-preferences';
const SCHEMA_VERSION = 2;

interface StoredPreferences {
  version: number;
  data: UserPreferences;
}

function isValidPreferences(obj: unknown): obj is UserPreferences {
  if (obj === null || typeof obj !== 'object') return false;
  const p = obj as Record<string, unknown>;

  // Validate top-level fields
  if (!['light', 'dark', 'system'].includes(p.theme as string)) return false;
  if (!['en', 'id', 'zh'].includes(p.language as string)) return false;
  if (!['compact', 'comfortable', 'large-text'].includes(p.interfaceMode as string)) return false;
  if (!['full', 'battery-saver', 'low-gpu', 'reduced'].includes(p.performanceMode as string)) return false;

  // Validate visualEffects
  if (p.visualEffects === null || typeof p.visualEffects !== 'object') return false;
  const ve = p.visualEffects as Record<string, unknown>;
  if (typeof ve.particles !== 'boolean') return false;
  if (typeof ve.animations !== 'boolean') return false;
  if (typeof ve.blur !== 'boolean') return false;
  if (typeof ve.motionReduction !== 'boolean') return false;
  if (typeof ve.cursorEffects !== 'boolean') return false;

  // Validate music
  if (p.music === null || typeof p.music !== 'object') return false;
  const m = p.music as Record<string, unknown>;
  if (typeof m.enabled !== 'boolean') return false;
  if (typeof m.volume !== 'number') return false;
  if (typeof m.playlist !== 'string') return false;

  return true;
}

export function getPreferences(): UserPreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    // Handle versioned format
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'version' in (parsed as object) &&
      'data' in (parsed as object)
    ) {
      const stored = parsed as StoredPreferences;
      if (stored.version !== SCHEMA_VERSION) return null;
      if (!isValidPreferences(stored.data)) return null;
      return stored.data;
    }

    // Handle legacy unversioned format (migration path)
    if (isValidPreferences(parsed)) {
      // Re-save in versioned format
      savePreferences(parsed);
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function savePreferences(preferences: UserPreferences): void {
  try {
    const stored: StoredPreferences = {
      version: SCHEMA_VERSION,
      data: preferences,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage full or unavailable - silently fail
  }
}

export function clearPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable - silently fail
  }
}
