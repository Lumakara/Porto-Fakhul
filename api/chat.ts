// Vercel Edge Function: Neoxr chat proxy.
//
// Deployed automatically by Vercel from the `/api` directory. The assistant
// normally calls the Neoxr API directly from the browser (it supports CORS),
// but this proxy provides a server-side option that keeps the Neoxr key out of
// the client bundle and centralises the primary/fallback endpoint logic.
//
//   • Primary  →  /gpt4Mini
//   • Fallback →  /llama
//
// Configure on Vercel (Project Settings → Environment Variables), all optional:
//   NEOXR_BASE_URL   (default https://api.neoxr.eu/api)
//   NEOXR_API_KEY    (default oggwWy)
//   NEOXR_PRIMARY    (default /gpt4Mini)
//   NEOXR_FALLBACK   (default /llama)

export const config = { runtime: 'edge' };

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages?: ChatMessage[];
  /** Optional explicit prompt; when omitted it is built from `messages`. */
  prompt?: string;
}

interface NeoxrResponse {
  status?: boolean;
  data?: { message?: string };
  msg?: string;
}

const MAX_MESSAGES = 50;
const MAX_TOTAL_CHARS = 24_000;
const MAX_CONTEXT_TURNS = 8;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Flatten the persona + recent turns into a single Neoxr prompt string. */
function buildPrompt(messages: ChatMessage[]): string {
  const system = messages.find((m) => m.role === 'system')?.content?.trim();
  const persona = system || 'You are a helpful, concise and friendly assistant.';

  const turns = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
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

function cleanReply(text: string): string {
  return text.replace(/^\s*assistant\s*:\s*/i, '').trim();
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!body.prompt && messages.length === 0) {
    return json({ error: 'No messages provided' }, 400);
  }

  // Basic abuse / cost guards (this endpoint is public).
  if (messages.length > MAX_MESSAGES) {
    return json({ error: `Too many messages (max ${MAX_MESSAGES}).` }, 400);
  }
  const totalChars = messages.reduce((sum, m) => sum + (m?.content?.length || 0), 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return json({ error: `Conversation too long (max ${MAX_TOTAL_CHARS} characters).` }, 400);
  }

  const env =
    (typeof process !== 'undefined' && process.env) || ({} as Record<string, string | undefined>);
  const baseUrl = (env.NEOXR_BASE_URL || 'https://api.neoxr.eu/api').replace(/\/+$/, '');
  const apiKey = (env.NEOXR_API_KEY || 'oggwWy').trim();
  const primary = env.NEOXR_PRIMARY || '/gpt4Mini';
  const fallback = env.NEOXR_FALLBACK || '/llama';
  const endpoints = Array.from(new Set([primary, fallback].filter(Boolean)));

  if (!apiKey) {
    return json({ error: 'No Neoxr API key configured (set NEOXR_API_KEY).' }, 400);
  }

  const prompt = body.prompt?.trim() || buildPrompt(messages);

  let lastError = 'All Neoxr endpoints failed.';
  for (const endpoint of endpoints) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const params = new URLSearchParams({ q: prompt, apikey: apiKey });
    const url = `${baseUrl}${path}?${params.toString()}`;

    let upstream: Response;
    try {
      upstream = await fetch(url, { method: 'GET' });
    } catch {
      lastError = `Failed to reach Neoxr (${endpoint}).`;
      continue;
    }

    if (!upstream.ok) {
      lastError = `Neoxr ${endpoint} failed (HTTP ${upstream.status}).`;
      continue;
    }

    // Unknown routes serve the website HTML — only trust JSON responses.
    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      lastError = `Neoxr ${endpoint} is unavailable.`;
      continue;
    }

    let data: NeoxrResponse;
    try {
      data = (await upstream.json()) as NeoxrResponse;
    } catch {
      lastError = `Neoxr ${endpoint} returned invalid data.`;
      continue;
    }

    const message = cleanReply(data?.data?.message ?? '');
    if (data?.status !== true || !message) {
      lastError = `Neoxr ${endpoint} returned an empty response.`;
      continue;
    }

    return json({ ok: true, content: message, endpoint }, 200);
  }

  return json({ error: lastError }, 502);
}
