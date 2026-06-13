// ============================================================================
//  ERUDA — On-device debugging console (https://github.com/liriliri/eruda)
// ----------------------------------------------------------------------------
//  Eruda is a console for mobile browsers. It lets you inspect console logs,
//  network requests, the DOM, localStorage, and more directly on a phone —
//  perfect for debugging the AI chat bot and other features when you don't
//  have access to desktop DevTools.
//
//  To keep production fast and clean, Eruda is NOT loaded for normal visitors.
//  It only initialises when YOU explicitly enable it (see below), and it is
//  loaded lazily (dynamic import) so it stays out of the main bundle.
//
//  ── How to enable it ─────────────────────────────────────────────────────
//   1. During local development (`npm run dev`) it loads automatically.
//   2. On the live site, append `?eruda` (or `?debug`) to the URL, e.g.
//          https://porto-fakhul.vercel.app/?eruda
//      This also remembers the choice (localStorage) so it stays on while you
//      navigate around.
//   3. To turn it off again, visit with `?eruda=off`.
// ============================================================================

const STORAGE_KEY = 'eruda-enabled';

/** Guard so we never call eruda.init() more than once. */
let initialised = false;

/** Decide whether the Eruda console should be initialised for this visit. */
function shouldEnable(): boolean {
  // 1. Always available while developing locally.
  if (import.meta.env.DEV) return true;

  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  const flag = params.get('eruda') ?? params.get('debug');

  // 2. Explicit opt-out: `?eruda=off` (or `false`/`0`).
  if (flag !== null && /^(off|false|0)$/i.test(flag)) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }
    return false;
  }

  // 3. Explicit opt-in via query param: `?eruda` / `?debug`.
  if (flag !== null) {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore storage errors */
    }
    return true;
  }

  // 4. Previously enabled and remembered.
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Lazily load and start Eruda when enabled. Safe to call once at startup;
 * failures are swallowed so they can never break the app.
 */
export async function initEruda(): Promise<void> {
  if (initialised || !shouldEnable()) return;

  try {
    const eruda = (await import('eruda')).default;
    eruda.init();
    initialised = true;
    // Surface a hint so you know the console is active.
    console.info('[eruda] Debug console enabled. Add "?eruda=off" to disable.');
  } catch (err) {
    console.warn('[eruda] Failed to initialise debug console:', err);
  }
}
