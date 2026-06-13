import type { ChatMessage, AISettings } from '../types';
import { NEOXR_BASE_URL, NEOXR_API_KEY, NEOXR_ENDPOINTS } from '../config/ai';

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

/** Shape of a successful Neoxr chat response. */
interface NeoxrResponse {
  status?: boolean;
  data?: { message?: string };
  msg?: string;
}

function ts(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

/** How many recent turns of context to send to the single-shot Neoxr endpoint. */
const MAX_CONTEXT_TURNS = 8;

/**
 * Neoxr's chat endpoints are single-shot (one `q` string), so we flatten the
 * system persona + the most recent conversation turns into one prompt. The
 * model is asked to answer the final user message directly.
 */
function buildPrompt(history: ChatMessage[], settings: AISettings): string {
  const persona =
    settings.personality?.trim() || 'You are a helpful, concise and friendly assistant.';

  const turns = history.filter((m) => m.role === 'user' || m.role === 'assistant');
  const recent = turns.slice(-MAX_CONTEXT_TURNS);

  const transcript = recent
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return [
    persona,
    '',
    'Conversation so far:',
    transcript,
    '',
    'Reply to the last user message directly, in the same language as the user.',
    'Keep it short and friendly. Do not prefix your reply with "Assistant:".',
  ].join('\n');
}

/** Build the full Neoxr request URL for a given endpoint + prompt. */
function buildUrl(endpoint: string, prompt: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const params = new URLSearchParams({ q: prompt, apikey: NEOXR_API_KEY });
  return `${NEOXR_BASE_URL}${path}?${params.toString()}`;
}

/** Remove a leading "Assistant:" the model sometimes adds despite instructions. */
function cleanReply(text: string): string {
  return text.replace(/^\s*assistant\s*:\s*/i, '').trim();
}

/**
 * Stream `text` to `onToken` word-by-word so the chat UI keeps its typewriter
 * feel even though Neoxr returns the full answer at once.
 */
async function simulateStream(
  text: string,
  onToken: ((fullText: string) => void) | undefined,
  signal: AbortSignal | undefined
): Promise<void> {
  if (!onToken) return;
  const tokens = text.split(/(\s+)/); // keep whitespace as its own chunks
  let acc = '';
  for (const tok of tokens) {
    if (signal?.aborted) break;
    acc += tok;
    onToken(acc);
    // Small delay for the typing effect; skip for very long answers.
    if (tokens.length < 200) await new Promise((r) => setTimeout(r, 18));
  }
}

/** Call a single Neoxr endpoint. Returns ok + message, or an error to fall back on. */
async function tryEndpoint(
  endpoint: string,
  prompt: string,
  logs: string[],
  signal: AbortSignal | undefined
): Promise<{ ok: boolean; content: string; error?: string; aborted?: boolean }> {
  const url = buildUrl(endpoint, prompt);
  logs.push(`[${ts()}] → Neoxr ${endpoint}…`);

  let res: Response;
  try {
    res = await fetch(url, { method: 'GET', signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, content: '', error: 'Request cancelled.', aborted: true };
    }
    const msg = err instanceof Error ? err.message : String(err);
    logs.push(`[${ts()}] ✗ ${endpoint} network error: ${msg}`);
    return { ok: false, content: '', error: `Network error reaching Neoxr (${endpoint}).` };
  }

  if (!res.ok) {
    logs.push(`[${ts()}] ✗ ${endpoint} failed: HTTP ${res.status}`);
    return { ok: false, content: '', error: `Neoxr ${endpoint} failed (HTTP ${res.status}).` };
  }

  // The API serves its website HTML for unknown/unavailable routes, so guard
  // against non-JSON responses before trusting the body.
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    logs.push(`[${ts()}] ✗ ${endpoint} returned non-JSON (likely unavailable). Falling back…`);
    return { ok: false, content: '', error: `Neoxr ${endpoint} is unavailable.` };
  }

  let data: NeoxrResponse;
  try {
    data = (await res.json()) as NeoxrResponse;
  } catch {
    logs.push(`[${ts()}] ✗ ${endpoint} returned invalid JSON. Falling back…`);
    return { ok: false, content: '', error: `Neoxr ${endpoint} returned invalid data.` };
  }

  const message = cleanReply(data?.data?.message ?? '');
  if (data?.status !== true || !message) {
    const detail = data?.msg ? ` (${data.msg})` : '';
    logs.push(`[${ts()}] ✗ ${endpoint} returned no message${detail}. Falling back…`);
    return { ok: false, content: '', error: `Neoxr ${endpoint} returned an empty response.` };
  }

  logs.push(`[${ts()}] ✓ ${endpoint} responded (${message.length} chars).`);
  return { ok: true, content: message };
}

/**
 * Send a conversation to the assistant via the Neoxr API.
 *
 * Order of attempts:
 *   1. Primary endpoint  (default /gpt4Mini)
 *   2. Fallback endpoint (default /llama)
 *
 * Every attempt is recorded in `logs` so the UI can show a detailed trace on
 * failure. The (single-shot) reply is streamed to `onToken` word-by-word.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  settings: AISettings,
  options: SendOptions = {}
): Promise<ChatRequestResult> {
  const { signal, onToken } = options;
  const logs: string[] = [];

  if (!NEOXR_API_KEY) {
    logs.push(`[${ts()}] ✗ No Neoxr API key configured.`);
    return {
      ok: false,
      content: '',
      error: 'No Neoxr API key configured. Set VITE_NEOXR_API_KEY in your environment.',
      logs,
    };
  }

  const prompt = buildPrompt(history, settings);
  logs.push(`[${ts()}] Initialising Neoxr transport…`);

  let lastError = 'All Neoxr endpoints failed.';
  for (let i = 0; i < NEOXR_ENDPOINTS.length; i++) {
    const endpoint = NEOXR_ENDPOINTS[i];
    const result = await tryEndpoint(endpoint, prompt, logs, signal);

    if (result.aborted) return { ok: false, content: '', error: result.error, logs };

    if (result.ok) {
      await simulateStream(result.content, onToken, signal);
      return { ok: true, content: result.content, logs };
    }

    lastError = result.error || lastError;
    if (i < NEOXR_ENDPOINTS.length - 1) {
      logs.push(`[${ts()}] · Trying fallback endpoint…`);
    }
  }

  logs.push(`[${ts()}] ✗ Exhausted all ${NEOXR_ENDPOINTS.length} endpoint(s).`);
  return { ok: false, content: '', error: lastError, logs };
}

/** Generate a reasonably-unique id for chat messages. */
export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
