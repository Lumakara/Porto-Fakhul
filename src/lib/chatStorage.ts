const API_KEY_STORAGE = 'porto-chat-api-key';
const SYSTEM_PROMPT_STORAGE = 'porto-chat-system-prompt';
const CHAT_HISTORY_STORAGE = 'porto-chat-history';

/** Maximum number of messages to retain in localStorage to prevent hitting the ~5MB quota. */
const MAX_CHAT_HISTORY = 50;

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant for this portfolio website. Answer questions about the developer, their projects, skills, and availability.';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function getApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setApiKey(key: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE, key);
  } catch {
    // Storage unavailable
  }
}

export function getSystemPrompt(): string {
  try {
    return localStorage.getItem(SYSTEM_PROMPT_STORAGE) || DEFAULT_SYSTEM_PROMPT;
  } catch {
    return DEFAULT_SYSTEM_PROMPT;
  }
}

export function setSystemPrompt(prompt: string): void {
  try {
    localStorage.setItem(SYSTEM_PROMPT_STORAGE, prompt);
  } catch {
    // Storage unavailable
  }
}

export function getChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Apply rolling window on read to keep history bounded
      return (parsed as ChatMessage[]).slice(-MAX_CHAT_HISTORY);
    }
    return [];
  } catch {
    // localStorage may be unavailable or data may be corrupted
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    // Keep only the last MAX_CHAT_HISTORY messages to avoid hitting localStorage quota
    const trimmed = messages.slice(-MAX_CHAT_HISTORY);
    localStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(trimmed));
  } catch {
    // Storage unavailable or quota exceeded - silently drop
  }
}
