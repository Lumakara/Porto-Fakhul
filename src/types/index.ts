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
  tilt: boolean;
}

export interface AudioSettings {
  uiSounds: boolean;
  volume: number;
}

export interface AISettings {
  apiKey: string;
  model: string;
  personality: string;
  temperature: number;
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
  audio: AudioSettings;
  ai: AISettings;
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  error?: boolean;
  /** Detailed diagnostic log lines shown under an error message. */
  logs?: string[];
}
