import type { ChatMessage, AISettings } from '../types';
import { AI_API_KEY } from '../config/ai';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const PROXY_ENDPOINT = '/api/chat';

export interface ChatRequestResult {
  ok: boolean;
  content: string;
  error?: string;
}

export interface SendOptions {
  signal?: AbortSignal;
  /** Called with the full accumulated text every time new tokens arrive. */
  onToken?: (fullText: string) => void;
}

interface OpenAIErrorBody {
  error?: { message?: string };
}

function buildMessages(history: ChatMessage[], settings: AISettings) {
  const system = {
    role: 'system' as const,
    content: settings.personality?.trim() || 'You are a helpful assistant.',
  };
  const turns = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }));
  return [system, ...turns];
}

function friendlyError(status: number, apiMessage?: string): string {
  if (status === 401) return 'Invalid API key. Please check the key in src/config/ai.ts.';
  if (status === 429) return 'Rate limit or quota exceeded. Try again shortly.';
  return apiMessage || `Request failed (HTTP ${status}).`;
}

/**
 * Read an OpenAI-style SSE stream, accumulating `delta.content` tokens.
 * Calls `onToken` with the running text so the UI can render incrementally.
 */
async function readStream(res: Response, onToken?: (text: string) => void): Promise<string> {
  if (!res.body) {
    // Non-streaming fallback: parse a normal completion payload.
    const data = await res.json().catch(() => ({}));
    const content =
      (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message?.content ||
      '';
    if (content && onToken) onToken(content);
    return content;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return full;
      try {
        const json = JSON.parse(data);
        const token = json?.choices?.[0]?.delta?.content || '';
        if (token) {
          full += token;
          onToken?.(full);
        }
      } catch {
        // Ignore keep-alive / non-JSON lines
      }
    }
  }
  return full;
}

/** True when a response looks like a streaming/JSON API response (not SPA HTML). */
function isApiResponse(res: Response): boolean {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('text/event-stream') || ct.includes('application/json');
}

/**
 * Send a conversation to the assistant.
 *
 * Primary path: the serverless proxy (`/api/chat`) which holds the OpenAI key
 * server-side. Fallback path: a direct, bring-your-own-key call to OpenAI when
 * the proxy is unavailable (e.g. static hosting / local dev) and the user has
 * supplied their own key in Settings. Both paths stream tokens via `onToken`.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  settings: AISettings,
  options: SendOptions = {}
): Promise<ChatRequestResult> {
  const { signal, onToken } = options;
  const messages = buildMessages(history, settings);
  // The key comes from src/config/ai.ts (env var or manual constant). A key
  // typed into settings still takes precedence if one is ever set.
  const effectiveKey = settings.apiKey.trim() || AI_API_KEY;
  const hasByoKey = effectiveKey.length > 0;

  // ── 1. Primary: serverless proxy ──────────────────────────────────────────
  try {
    const res = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: settings.model || 'gpt-4o-mini',
        temperature: settings.temperature ?? 0.7,
        // Pass BYO key so the proxy can use it if it has no server key.
        apiKey: effectiveKey || undefined,
      }),
      signal,
    });

    // 404/501 or an SPA HTML response => proxy not deployed; fall through to BYO.
    const proxyAvailable = res.status !== 404 && res.status !== 501 && isApiResponse(res);
    if (proxyAvailable) {
      if (res.ok) {
        const content = await readStream(res, onToken);
        if (!content.trim()) {
          return { ok: false, content: '', error: 'The assistant returned an empty response.' };
        }
        return { ok: true, content };
      }
      // Proxy reachable but errored. If the user has their own key, fall back;
      // otherwise surface the proxy's error.
      if (!hasByoKey) {
        const data: OpenAIErrorBody = await res.json().catch(() => ({}));
        return { ok: false, content: '', error: friendlyError(res.status, data?.error?.message) };
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, content: '', error: 'Request cancelled.' };
    }
    // Network error reaching the proxy: fall through to BYO if possible.
  }

  // ── 2. Fallback: direct BYO-key call to OpenAI ──────────────────────────────
  if (!hasByoKey) {
    return {
      ok: false,
      content: '',
      error:
        'The AI assistant has no API key configured. Add it in src/config/ai.ts (VITE_AI_API_KEY or MANUAL_API_KEY), or deploy the serverless proxy.',
    };
  }

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveKey}`,
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        messages,
        temperature: settings.temperature ?? 0.7,
        max_tokens: 600,
        stream: true,
      }),
      signal,
    });

    if (!res.ok) {
      const data: OpenAIErrorBody = await res.json().catch(() => ({}));
      return { ok: false, content: '', error: friendlyError(res.status, data?.error?.message) };
    }

    const content = await readStream(res, onToken);
    if (!content.trim()) {
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
