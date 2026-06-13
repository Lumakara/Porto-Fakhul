// ============================================================================
//  AI ASSISTANT CONFIGURATION
// ----------------------------------------------------------------------------
//  The floating chat assistant is powered by the Neoxr API (https://neoxr.eu).
//  It uses a primary chat endpoint and automatically falls back to a secondary
//  endpoint if the primary one fails (e.g. returns an error or is unavailable).
//
//    • Primary  →  /gpt4Mini   (GPT-4o mini style model)
//    • Fallback →  /llama      (Llama model)
//
//  The Neoxr API is a simple GET API that accepts a `q` (question/prompt) and an
//  `apikey` query parameter, and returns JSON: { status, data: { message } }.
//  It supports browser CORS, so the assistant calls it directly from the client.
//
//  ── Configuration ───────────────────────────────────────────────────────────
//  You can override the defaults below with environment variables (note the
//  required VITE_ prefix), then restart the dev server / redeploy:
//
//        VITE_NEOXR_BASE_URL=https://api.neoxr.eu/api
//        VITE_NEOXR_API_KEY=your-neoxr-key
//        VITE_NEOXR_PRIMARY=/gpt4Mini
//        VITE_NEOXR_FALLBACK=/llama
//
//  ⚠️  SECURITY NOTE: the Neoxr key is a lightweight usage key designed to be
//  used from the client. Lock down usage / rate limits in your Neoxr dashboard.
// ============================================================================

function envStr(value: unknown, fallback: string): string {
  const v = typeof value === 'string' ? value.trim() : '';
  return v.length > 0 ? v : fallback;
}

/** Base URL of the Neoxr API (no trailing slash). */
export const NEOXR_BASE_URL = envStr(
  import.meta.env.VITE_NEOXR_BASE_URL,
  'https://api.neoxr.eu/api'
).replace(/\/+$/, '');

/** Neoxr usage key sent as the `apikey` query parameter. */
export const NEOXR_API_KEY = envStr(import.meta.env.VITE_NEOXR_API_KEY, 'oggwWy');

/** Primary chat endpoint path (tried first). */
export const NEOXR_PRIMARY_ENDPOINT = envStr(import.meta.env.VITE_NEOXR_PRIMARY, '/gpt4Mini');

/** Fallback chat endpoint path (used when the primary fails). */
export const NEOXR_FALLBACK_ENDPOINT = envStr(import.meta.env.VITE_NEOXR_FALLBACK, '/llama');

/** Ordered list of endpoints the assistant tries, primary first. */
export const NEOXR_ENDPOINTS: string[] = Array.from(
  new Set([NEOXR_PRIMARY_ENDPOINT, NEOXR_FALLBACK_ENDPOINT].filter((e) => e.length > 0))
);

/** True when the assistant has a usable Neoxr configuration. */
export const hasAIKey = (): boolean => NEOXR_API_KEY.length > 0 && NEOXR_ENDPOINTS.length > 0;
