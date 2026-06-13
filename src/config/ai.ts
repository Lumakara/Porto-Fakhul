// ============================================================================
//  AI ASSISTANT CONFIGURATION  ──  *** PUT YOUR API KEY(S) HERE ***
// ----------------------------------------------------------------------------
//  The floating chat assistant needs an OpenAI API key to work. You can supply
//  up to TWO keys — the assistant uses the 1st, and automatically falls back to
//  the 2nd if the 1st fails (e.g. quota exhausted / rate-limited / invalid).
//
//  ── Option A (recommended): environment variables ──────────────────────────
//   1. Create a file named `.env` in the project root (next to package.json).
//   2. Add (note the required VITE_ prefix):
//
//          VITE_AI_API_KEY=sk-your-primary-key
//          VITE_AI_API_KEY_2=sk-your-backup-key   (optional fallback)
//
//   3. Restart the dev server.
//
//  ── Option B (quick / local testing): paste the keys below ──────────────────
//          const MANUAL_API_KEY   = 'sk-your-primary-key';
//          const MANUAL_API_KEY_2 = 'sk-your-backup-key';
//
//  ⚠️  SECURITY NOTE: keys placed here (Option A or B) are bundled into the
//  browser build and are therefore visible to visitors. For a public/production
//  site, prefer the serverless proxy in `api/chat.ts` and set the key there as
//  the server-side `OPENAI_API_KEY` environment variable (never shipped to the
//  browser). The client keys below are only used as a fallback when that proxy
//  is not deployed or returns an error.
// ============================================================================

/** Option B: paste your keys directly here (leave '' if you use Option A). */
const MANUAL_API_KEY = '';
const MANUAL_API_KEY_2 = '';

const ENV_KEY_1 = ((import.meta.env.VITE_AI_API_KEY as string | undefined) ?? '').trim();
const ENV_KEY_2 = ((import.meta.env.VITE_AI_API_KEY_2 as string | undefined) ?? '').trim();

/** Primary resolved key (.env wins, otherwise the manual key above). */
export const AI_API_KEY: string = ENV_KEY_1 || MANUAL_API_KEY.trim();

/** Secondary/backup key used as automatic fallback. */
export const AI_API_KEY_2: string = ENV_KEY_2 || MANUAL_API_KEY_2.trim();

/**
 * Ordered list of usable client keys (de-duplicated, empty entries removed).
 * The assistant tries them in order, falling back from one to the next.
 */
export const AI_API_KEYS: string[] = Array.from(
  new Set([AI_API_KEY, AI_API_KEY_2].filter((k) => k.length > 0))
);

/** Default model used by the assistant. Change here if needed. */
export const AI_MODEL = 'gpt-4o-mini';

/** True when at least one usable key has been configured. */
export const hasAIKey = (): boolean => AI_API_KEYS.length > 0;
