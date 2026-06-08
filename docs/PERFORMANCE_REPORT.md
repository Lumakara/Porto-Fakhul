# Performance Report

**Method:** Production build (`npm run build`) executed in-sandbox on 2026-06-08. Figures below are real output, not estimates.

---

## 1. Measured Build Output

```
dist/index.html                    2.14 kB │ gzip:   0.83 kB
dist/assets/index-*.css           56.09 kB │ gzip:   9.45 kB
dist/assets/terminal-*.js          0.26 kB │ gzip:   0.19 kB
dist/assets/Skills-*.js            7.52 kB │ gzip:   2.73 kB
dist/assets/Contact-*.js          11.87 kB │ gzip:   3.65 kB
dist/assets/Projects-*.js         13.53 kB │ gzip:   4.44 kB
dist/assets/index-*.js         1,321.17 kB │ gzip: 374.60 kB   ← main bundle
```

> Vite emitted: *"Some chunks are larger than 500 kB after minification."*

### Interpretation
- The **main chunk is ~1.32 MB raw / ~375 KB gzip** — roughly an order of magnitude above a healthy budget (~150–170 KB gzip JS) for a portfolio.
- Lazy chunks (`Projects`, `Skills`, `Contact`) are small and correctly split — good.
- The bloat lives in the **eager** main chunk: React + React-DOM + **Framer Motion + Three.js + @react-three/fiber + @react-three/drei** + Lenis. Three.js and the R3F/Drei stack alone typically account for **600 KB+ raw**.

### Root cause
`WebGLBackground.tsx` (Three.js + R3F + Drei `Environment preset="sunset"`, which also fetches an HDR cubemap over the network) is imported **eagerly** by `Hero.tsx`, which is imported eagerly by `App.tsx`. So the heaviest dependency in the project is in the critical path for **a purely decorative, 20%-opacity, `pointer-events-none` background**.

---

## 2. Other Performance Issues (from code)

| ID | Issue | File | Effect |
|---|---|---|---|
| P-1 | Three.js/R3F/Drei in initial bundle | `Hero.tsx` → `WebGLBackground.tsx` | +600 KB+ raw, blocks TTI/LCP |
| P-2 | Drei `Environment preset="sunset"` fetches remote HDR | `WebGLBackground.tsx` | Extra network round-trip, runtime cost |
| P-3 | Forced preloader (~2–3s) before mounting app | `Preloader.tsx` (120ms ticks + 700ms + 800ms) | Delays real LCP, inflates perceived load |
| P-4 | Unthrottled scroll handler doing layout reads | `Navbar.tsx` (`offsetTop`/`offsetHeight` per scroll) | Layout thrashing / jank on scroll |
| P-5 | Global `mouseover` listener on window | `CustomCursor.tsx` | Fires per element hover; main-thread work |
| P-6 | `filter: blur()` in reveal animations everywhere | `Section.tsx`, sections | Expensive repaints on low-end GPUs |
| P-7 | Lenis RAF loop never cancelled on cleanup | `App.tsx` `useEffect` (recursive `requestAnimationFrame`) | Orphaned loop on unmount/StrictMode |
| P-8 | Dead deps shipped/installed (`gsap`) + dead components (`SakuraBackground`, `useMousePosition`) | `package.json`, `src/` | Maintenance + risk of accidental import |
| P-9 | No `manualChunks` / vendor splitting; no chunk budget | `vite.config.ts` | One giant chunk; no caching granularity |
| P-10 | Render-blocking Google Fonts (`<link rel=stylesheet>` + duplicate preload) | `index.html` | Blocks first paint; FOUT/FOIT risk |
| P-11 | Unused raster `src/assets/hero.png` + template `react.svg`/`vite.svg` | `src/assets/` | Repo weight (not bundled if unused, but clutter) |

---

## 3. Prioritized Backlog

### 🔴 Critical
- **P-1 / P-2 — Tame Three.js.** Choose one:
  - (a) `React.lazy` + `Suspense` the `WebGLBackground` and mount it only after first paint / on idle (`requestIdleCallback`), behind `prefers-reduced-motion: no-preference` and a desktop/`!isMobile` check; **or**
  - (b) Replace the decorative blobs with a CSS/SVG gradient (the existing `bg-aurora-*` utilities already do something similar) and drop `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` entirely.
  - Expected: **−60–70% initial JS gzip** (target ≤ ~130 KB gzip).
- **P-3 — De-gate content.** Render the app immediately; run the preloader as an overlay that does not block mount; first-visit-only via `sessionStorage`; skip entirely under reduced-motion.

### 🟠 High
- **P-9 — Configure Vite chunking** (`build.rollupOptions.output.manualChunks`) to split `three`, `framer-motion`, and React vendor, and set a `chunkSizeWarningLimit` budget.
- **P-10 — Font strategy.** Remove the duplicate preload/stylesheet pair; self-host or use `&display=swap` with a single non-duplicated link; preload only the actually-used weights; add `font-display: swap` (already in URL).
- **P-4 — Throttle/rAF the Navbar scroll handler** and use `IntersectionObserver` for active-section tracking instead of per-scroll `offsetTop` reads.

### 🟡 Medium
- **P-7 — Cancel the Lenis RAF** (store the id, `cancelAnimationFrame` in cleanup).
- **P-5 — Optimize cursor tracking** (delegate via `pointerover` with passive listeners; bail early on touch).
- **P-6 — Reduce blur in reveals** (animate `opacity`/`transform` only on mobile; reserve blur for desktop), and respect reduced-motion.

### 🟢 Low
- **P-8 / P-11 — Remove dead code, unused deps, and template assets.**

---

## 4. Suggested Performance Budget

| Metric | Target |
|---|---|
| Initial JS (gzip) | ≤ 150 KB |
| CSS (gzip) | ≤ 12 KB (after dead-utility purge) |
| LCP (mobile, 4G) | ≤ 2.5 s |
| TBT | ≤ 200 ms |
| CLS | ≤ 0.1 |
| Lighthouse Performance (mobile) | ≥ 90 |

Add a CI Lighthouse budget (see `ROADMAP.md` Phase 2) so regressions are caught automatically.
