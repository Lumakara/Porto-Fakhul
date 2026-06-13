// Vercel Edge Function: OpenAI chat proxy with SSE streaming.
//
// Deployed automatically by Vercel from the `/api` directory. The server-side
// OpenAI key is read from the `OPENAI_API_KEY` environment variable so it is
// never shipped to the browser. If a request includes a `apiKey` field (the
// visitor's own "bring-your-own" key) it is used as a fallback when no server
// key is configured.
//
// Configure on Vercel: Project Settings → Environment Variables → OPENAI_API_KEY

export const config = { runtime: 'edge' };

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

interface ChatRequestBody {
  messages?: { role: 'system' | 'user' | 'assistant'; content: string }[];
  model?: string;
  temperature?: number;
  apiKey?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, model = 'gpt-4o-mini', temperature = 0.7, apiKey: byoKey } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Abuse / cost guards ─────────────────────────────────────────────────
  // This endpoint is public, so cap the request size to limit how much a
  // single caller can spend against the server-side OpenAI key.
  const MAX_MESSAGES = 50;
  const MAX_TOTAL_CHARS = 24_000;
  const VALID_ROLES = new Set(['system', 'user', 'assistant']);

  if (messages.length > MAX_MESSAGES) {
    return new Response(
      JSON.stringify({ error: `Too many messages (max ${MAX_MESSAGES}).` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let totalChars = 0;
  for (const m of messages) {
    if (
      m === null ||
      typeof m !== 'object' ||
      !VALID_ROLES.has((m as { role?: string }).role ?? '') ||
      typeof (m as { content?: unknown }).content !== 'string'
    ) {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    totalChars += (m as { content: string }).content.length;
  }

  if (totalChars > MAX_TOTAL_CHARS) {
    return new Response(
      JSON.stringify({ error: `Conversation too long (max ${MAX_TOTAL_CHARS} characters).` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Clamp temperature to a sane range regardless of client input.
  const safeTemperature = Math.min(Math.max(Number(temperature) || 0.7, 0), 2);

  // Pin the model to a small allowlist of inexpensive models. The endpoint is
  // public, so we never let a caller pick a costly model (e.g. gpt-4o, o1).
  const ALLOWED_MODELS = new Set(['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-3.5-turbo']);
  const safeModel = ALLOWED_MODELS.has(model) ? model : 'gpt-4o-mini';

  // Prefer server-side keys; fall back to a visitor-provided key. Two server
  // keys are supported so the proxy can fail over automatically.
  const env = (typeof process !== 'undefined' && process.env) || ({} as Record<string, string | undefined>);
  const serverKey1 = (env.OPENAI_API_KEY || '').trim();
  const serverKey2 = (env.OPENAI_API_KEY_2 || '').trim();
  const trimmedByo = byoKey ? byoKey.trim() : '';
  const keys = Array.from(new Set([serverKey1, serverKey2, trimmedByo].filter(Boolean)));

  if (keys.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No server API key configured. Add OPENAI_API_KEY in Vercel env, or your own key in Settings.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Try each key in order; fail over to the next on error (e.g. quota/invalid).
  let lastStatus = 502;
  let lastMessage = 'Failed to reach OpenAI';

  for (let i = 0; i < keys.length; i++) {
    let upstream: Response;
    try {
      upstream = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keys[i]}`,
        },
        body: JSON.stringify({ model: safeModel, messages, temperature: safeTemperature, max_tokens: 600, stream: true }),
      });
    } catch {
      lastStatus = 502;
      lastMessage = `Failed to reach OpenAI (key #${i + 1})`;
      continue;
    }

    if (upstream.ok && upstream.body) {
      // Pass the OpenAI SSE stream straight through to the client.
      return new Response(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    const errData = await upstream.json().catch(() => ({}));
    lastStatus = upstream.status;
    lastMessage =
      (errData as { error?: { message?: string } })?.error?.message ||
      `OpenAI request failed (HTTP ${upstream.status}) on key #${i + 1}`;
    // Continue to the next key.
  }

  return new Response(JSON.stringify({ error: lastMessage }), {
    status: lastStatus,
    headers: { 'Content-Type': 'application/json' },
  });
}
