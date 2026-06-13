import type { ChatMessage, AISettings } from '../types';
import { AI_API_KEYS } from '../config/ai';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const PROXY_ENDPOINT = '/api/chat';

export interface ChatRequestResult {
  ok: boolean;
  content: string;
  error?: string;
  /** Detailed, human-readable diagnostic log lines (shown in the UI on error). */
  logs?: string[];
}

export interface SendOptions {
  signal?: AbortSignal;
  /** Called with the full accumulated text every time new tokens arrive. */
  onToken?: (fullText: string) => void;
}

interface OpenAIErrorBody {
  error?: { message?: string; code?: string; type?: string };
}

function ts(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
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
  if (status === 401) return 'Invalid API key (HTTP 401). The key was rejected by OpenAI.';
  if (status === 429) return 'Rate limit or quota exceeded (HTTP 429).';
  if (status === 404) return 'Model not found or not accessible for this key (HTTP 404).';
  if (status === 500 || status === 503) return `OpenAI is temporarily unavailable (HTTP ${status}).`;
  return apiMessage || `Request failed (HTTP ${status}).`;
}

/** Mask a key for safe display in logs: sk-abcd…WXYZ */
function maskKey(key: string): string {
  if (key.length <= 10) return 'sk-****';
  return `${key.slice(0, 5)}…${key.slice(-4)}`;
}

/**
 * Read an OpenAI-style SSE stream, accumulating `delta.content` tokens.
 * Calls `onToken` with the running text so the UI can render incrementally.
 */
async function readStream(res: Response, onToken?: (text: string) => void): Promise<string> {
  if (!res.body) {
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

/** Attempt a direct OpenAI call with a specific key. Returns ok + content or an error. */
async function tryDirectKey(
  key: string,
  label: string,
  messages: ReturnType<typeof buildMessages>,
  settings: AISettings,
  logs: string[],
  options: SendOptions
): Promise<ChatRequestResult> {
  const { signal, onToken } = options;
  const model = settings.model || 'gpt-4o-mini';
  logs.push(`[${ts()}] → OpenAI direct via ${label} (${maskKey(key)}), model=${model}`);

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages,
        temperature: settings.temperature ?? 0.7,
        max_tokens: 600,
        stream: true,
      }),
      signal,
    });

    if (!res.ok) {
      const data: OpenAIErrorBody = await res.json().catch(() => ({}));
      const detail = data?.error?.message || '';
      const code = data?.error?.code ? ` [code: ${data.error.code}]` : '';
      logs.push(`[${ts()}] ✗ ${label} failed: HTTP ${res.status}${code} ${detail}`.trim());
      return { ok: false, content: '', error: friendlyError(res.status, detail) };
    }

    logs.push(`[${ts()}] ✓ ${label} connected (HTTP 200), streaming…`);
    const content = await readStream(res, onToken);
    if (!content.trim()) {
      logs.push(`[${ts()}] ✗ ${label} returned an empty response.`);
      return { ok: false, content: '', error: 'The assistant returned an empty response.' };
    }
    return { ok: true, content };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, content: '', error: 'Request cancelled.' };
    }
    const msg = err instanceof Error ? err.message : String(err);
    logs.push(`[${ts()}] ✗ ${label} network error: ${msg}`);
    return { ok: false, content: '', error: `Network error reaching OpenAI (${label}).` };
  }
}

/**
 * Send a conversation to the assistant.
 *
 * Order of attempts:
 *   1. Serverless proxy (`/api/chat`) — holds the server-side OpenAI key.
 *   2. Direct OpenAI with the user's Settings key (if provided).
 *   3. Direct OpenAI with configured key #1, then key #2 (automatic fallback).
 *
 * Every attempt is recorded in `logs` so the UI can show a detailed trace on
 * failure. Streaming tokens are delivered via `onToken`.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  settings: AISettings,
  options: SendOptions = {}
): Promise<ChatRequestResult> {
  const { signal, onToken } = options;
  const messages = buildMessages(history, settings);
  const logs: string[] = [];

  // Ordered, de-duplicated list of candidate keys: Settings key first, then the
  // configured keys (primary, then backup).
  const settingsKey = settings.apiKey.trim();
  const candidateKeys: { key: string; label: string }[] = [];
  if (settingsKey) candidateKeys.push({ key: settingsKey, label: 'Settings key' });
  AI_API_KEYS.forEach((k, i) => {
    if (k !== settingsKey) candidateKeys.push({ key: k, label: `Config key #${i + 1}` });
  });
  const hasAnyKey = candidateKeys.length > 0;

  // ── 1. Primary: serverless proxy ──────────────────────────────────────────
  logs.push(`[${ts()}] → Trying serverless proxy ${PROXY_ENDPOINT}…`);
  try {
    const res = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: settings.model || 'gpt-4o-mini',
        temperature: settings.temperature ?? 0.7,
        apiKey: candidateKeys[0]?.key || undefined,
      }),
      signal,
    });

    const proxyAvailable = res.status !== 404 && res.status !== 501 && isApiResponse(res);
    if (!proxyAvailable) {
      logs.push(`[${ts()}] · Proxy not deployed (HTTP ${res.status}). Falling back to direct keys.`);
    } else if (res.ok) {
      logs.push(`[${ts()}] ✓ Proxy connected (HTTP 200), streaming…`);
      const content = await readStream(res, onToken);
      if (!content.trim()) {
        logs.push(`[${ts()}] ✗ Proxy returned an empty response.`);
        return { ok: false, content: '', error: 'The assistant returned an empty response.', logs };
      }
      return { ok: true, content, logs };
    } else {
      const data: OpenAIErrorBody = await res.json().catch(() => ({}));
      const detail = data?.error?.message || '';
      logs.push(`[${ts()}] ✗ Proxy error: HTTP ${res.status} ${detail}`.trim());
      if (!hasAnyKey) {
        return { ok: false, content: '', error: friendlyError(res.status, detail), logs };
      }
      logs.push(`[${ts()}] · Falling back to direct key(s)…`);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, content: '', error: 'Request cancelled.', logs };
    }
    const msg = err instanceof Error ? err.message : String(err);
    logs.push(`[${ts()}] · Proxy unreachable (${msg}). Falling back to direct keys.`);
  }

  // ── 2/3. Fallback: direct BYO-key calls, trying each key in order ───────────
  if (!hasAnyKey) {
    logs.push(`[${ts()}] ✗ No API key configured (proxy + client keys both empty).`);
    return {
      ok: false,
      content: '',
      error:
        'No API key configured. Add VITE_AI_API_KEY (and optional VITE_AI_API_KEY_2) in .env, paste a key in Settings, or deploy the serverless proxy with OPENAI_API_KEY.',
      logs,
    };
  }

  let lastError = 'All API keys failed.';
  for (const { key, label } of candidateKeys) {
    const result = await tryDirectKey(key, label, messages, settings, logs, options);
    if (result.ok) return { ...result, logs };
    if (result.error === 'Request cancelled.') return { ...result, logs };
    lastError = result.error || lastError;
    logs.push(`[${ts()}] · Trying next key…`);
  }

  logs.push(`[${ts()}] ✗ Exhausted all ${candidateKeys.length} key(s).`);
  return { ok: false, content: '', error: lastError, logs };
}

/** Generate a reasonably-unique id for chat messages. */
export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
