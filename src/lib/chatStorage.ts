import type { ChatMessage } from '../types';

const CHAT_STORAGE_KEY = 'porto-ai-chat-history';
const MAX_STORED_MESSAGES = 100;

/** Load persisted chat history from localStorage. Returns [] on any failure. */
export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        m !== null &&
        typeof m === 'object' &&
        typeof (m as ChatMessage).id === 'string' &&
        typeof (m as ChatMessage).content === 'string' &&
        ['user', 'assistant', 'system'].includes((m as ChatMessage).role)
    );
  } catch {
    return [];
  }
}

/** Persist chat history (capped to the most recent messages) to localStorage. */
export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    const capped = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // Storage full or unavailable - silently fail
  }
}

/** Clear persisted chat history. */
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // Storage unavailable - silently fail
  }
}
