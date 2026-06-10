import type { ChatMessage, AISettings } from '../types';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface ChatRequestResult {
  ok: boolean;
  content: string;
  error?: string;
}

interface OpenAIChoice {
  message?: { content?: string };
}
interface OpenAIResponse {
  choices?: OpenAIChoice[];
  error?: { message?: string };
}

/**
 * Send a conversation to the OpenAI Chat Completions API.
 *
 * The API key, model, personality (system prompt) and temperature all come
 * from user preferences so the assistant can be tailored to this portfolio.
 * Returns a normalized result instead of throwing, so the UI can render
 * friendly error states.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  settings: AISettings,
  signal?: AbortSignal
): Promise<ChatRequestResult> {
  if (!settings.apiKey.trim()) {
    return {
      ok: false,
      content: '',
      error: 'No API key configured. Add your OpenAI API key in Settings to start chatting.',
    };
  }

  const messages = [
    { role: 'system' as const, content: settings.personality },
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        messages,
        temperature: settings.temperature ?? 0.7,
        max_tokens: 600,
      }),
      signal,
    });

    const data: OpenAIResponse = await res.json().catch(() => ({}));

    if (!res.ok) {
      const apiMsg = data?.error?.message;
      let friendly = apiMsg || `Request failed (HTTP ${res.status}).`;
      if (res.status === 401) friendly = 'Invalid API key. Please check your key in Settings.';
      if (res.status === 429) friendly = 'Rate limit or quota exceeded. Try again shortly.';
      return { ok: false, content: '', error: friendly };
    }

    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { ok: false, content: '', error: 'The assistant returned an empty response.' };
    }

    return { ok: true, content };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, content: '', error: 'Request cancelled.' };
    }
    return {
      ok: false,
      content: '',
      error: 'Network error reaching OpenAI. Check your connection and try again.',
    };
  }
}

/** Generate a reasonably-unique id for chat messages. */
export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
