// ============================================================================
//  AI ASSISTANT CONFIGURATION  ──  *** PUT YOUR API KEY HERE ***
// ----------------------------------------------------------------------------
//  The floating chat assistant needs an API key to work. You have two ways to
//  provide it. Pick ONE:
//
//  ── Option A (recommended): environment variable ───────────────────────────
//   1. Create a file named `.env` in the project root (next to package.json).
//   2. Add this line (note the required VITE_ prefix):
//
//          VITE_AI_API_KEY=your-secret-key-here
//
//   3. Restart the dev server. Done — nothing else to change.
//
//  ── Option B (quick / local testing): paste the key below ───────────────────
//   Replace the empty string in MANUAL_API_KEY with your key:
//
//          const MANUAL_API_KEY = 'your-secret-key-here';
//
//  ⚠️  SECURITY NOTE: keys placed here (Option A or B) are bundled into the
//  browser build and are therefore visible to visitors. For a public/production
//  site, prefer the serverless proxy in `api/chat.ts` and set the key there as
//  the server-side `OPENAI_API_KEY` environment variable (never shipped to the
//  browser). The client key below is only used as a fallback when that proxy
//  is not deployed.
// ============================================================================

/** Option B: paste your key directly here (leave '' if you use Option A). */
const MANUAL_API_KEY = '';

/** Resolved API key: the .env value wins, otherwise the manual key above. */
export const AI_API_KEY: string =
  ((import.meta.env.VITE_AI_API_KEY as string | undefined) ?? '').trim() ||
  MANUAL_API_KEY.trim();

/** Default model used by the assistant. Change here if needed. */
export const AI_MODEL = 'gpt-4o-mini';

/** True when a usable key has been configured by either method. */
export const hasAIKey = (): boolean => AI_API_KEY.length > 0;
