export type Theme = 'light' | 'dark' | 'system';

export type Language = 'en' | 'id' | 'zh';

export type InterfaceMode = 'compact' | 'comfortable' | 'large-text';

export type PerformanceMode = 'full' | 'battery-saver' | 'low-gpu' | 'reduced';

export interface VisualEffects {
  particles: boolean;
  animations: boolean;
  blur: boolean;
  motionReduction: boolean;
  cursorEffects: boolean;
}

export interface MusicSettings {
  enabled: boolean;
  volume: number;
  playlist: string;
}

export interface UserPreferences {
  theme: Theme;
  language: Language;
  interfaceMode: InterfaceMode;
  performanceMode: PerformanceMode;
  visualEffects: VisualEffects;
  music: MusicSettings;
}
