# Product Requirements Document — Portfolio Enhancement

**Product:** Fakhul Rohman Personal Portfolio (`web-porto`)
**Document type:** Enhancement / Optimization PRD (not a redesign)
**Version:** 1.0 · 2026-06-08

---

## 1. Background & Problem Statement

The portfolio has a mature, distinctive visual identity but underperforms as a *product*: it is heavy (1.32 MB JS), invisible to crawlers (CSR + preloader gate), inaccessible in key ways (hidden cursor, no reduced-motion, failing contrast), and contains broken links and leftover template persona content that damage credibility. The goal is to elevate it to production grade **without altering the established branding**.

## 2. Goals

1. **Preserve** the existing visual identity, palette, typography, and signature motion.
2. **Performance:** initial JS ≤ 150 KB gzip; Lighthouse Perf ≥ 90 (mobile).
3. **Accessibility:** WCAG 2.1 AA; axe/Lighthouse a11y ≥ 95.
4. **SEO:** real HTML content for crawlers; Lighthouse SEO ≥ 95; valid social previews.
5. **Credibility:** 100% consistent identity; zero broken/dead links.
6. **Maintainability:** lint-clean, typed, data-driven content, basic CI.

## 3. Non-Goals

- No redesign, re-theming, or replacement of the brand palette/fonts.
- No new color system, no layout reinvention.
- No removal of the signature preloader/cursor/motion *concepts* (only their accessibility/perf behavior changes).
- No backend beyond the existing Formspree contact integration (Phase scope).

## 4. Guiding Principles (Design Preservation)

- **Additive over destructive:** prefer guards, lazy-loading, and tokens over rewrites.
- **Same look, better behavior:** e.g., the WebGL blob may be deferred/replaced visually-equivalently; the cursor keeps its look but gains a fallback.
- **Token-first:** color/contrast fixes happen via new text-variant tokens, not by recoloring the brand.

---

## 5. Functional Requirements

### FR-1 Identity Consistency *(Critical)*
- All visible copy reflects **Fakhul Rohman**, **Depok, Jawa Barat**.
- Remove "SORA", "Sora Takahashi", "Tokyo, Japan", "Creative Developer" persona artifacts from `Preloader.tsx` and `NotFound.tsx`.
- Project data is either real or explicitly labeled as concept/design explorations.
- **Acceptance:** No occurrence of the old persona strings in the codebase; preloader/404 reflect real identity.

### FR-2 Working Contact & Links *(Critical)*
- Email renders as `mailto:` and is keyboard-actionable.
- No `href="#"` no-op links presented as actionable; case-study CTAs link to real URLs or are hidden.
- **Acceptance:** All links navigate or are removed; manual keyboard test passes.

### FR-3 Performance Budget *(Critical)*
- Three.js removed from the critical path (lazy/idle/replaced).
- App content mounts without waiting for a multi-second preloader; preloader is first-visit-only and skipped under reduced-motion.
- **Acceptance:** `npm run build` main chunk gzip ≤ 150 KB; no Vite >500 KB warning; Lighthouse Perf ≥ 90 mobile.

### FR-4 Accessibility AA *(Critical)*
- `prefers-reduced-motion` honored for all non-essential motion.
- Visible cursor fallback; no global `cursor:none !important`.
- AA contrast for all text (new terracotta/sage text tokens).
- Modal = proper dialog (focus trap + restore + `aria-modal`); mobile menu exposes state and traps focus.
- Skip link; visible focus rings; `aria-live` form status.
- **Acceptance:** axe-core 0 critical; Lighthouse a11y ≥ 95; keyboard-only traversal of nav, modal, form.

### FR-5 SEO & Sharing *(High)*
- HTML delivered to crawlers contains real headings/text (prerender/SSG or framework migration).
- Valid `og:image` (1200×630), `og:locale=id_ID`, Twitter Card, `Person` JSON-LD, `robots.txt`, `sitemap.xml`, canonical.
- `<html lang="id">`.
- **Acceptance:** `view-source` shows content; Rich Results test valid; sharing debuggers show correct preview; Lighthouse SEO ≥ 95.

### FR-6 Maintainability *(High)*
- 0 lint errors; no `any` in app code; dead code & unused deps removed.
- Section content extracted to typed `src/data/*`.
- CI runs lint + typecheck + build (+ Lighthouse budget) on PRs.
- **Acceptance:** CI green; `npm run lint` clean; data files power sections.

---

## 6. Non-Functional Requirements

| Attribute | Requirement |
|---|---|
| Performance | LCP ≤ 2.5s (mobile 4G), TBT ≤ 200ms, CLS ≤ 0.1 |
| Accessibility | WCAG 2.1 AA |
| Browser support | Evergreen Chrome/Edge/Firefox/Safari (last 2), iOS/Android |
| SEO | Indexable, valid structured data, accurate social cards |
| Reliability | Contact form success/error states surfaced to user |
| Maintainability | Typed, lint-clean, data-driven, CI-gated |
| Privacy | No PII beyond owner's published contact info; no tracking without notice |

---

## 7. Success Metrics

| Metric | Baseline (measured) | Target |
|---|---|---|
| Main JS chunk (gzip) | 374.6 KB | ≤ 150 KB |
| Lighthouse Performance (mobile) | est. ~40–55 | ≥ 90 |
| Lighthouse Accessibility | est. ~70 | ≥ 95 |
| Lighthouse SEO | est. ~80 (no rendered content) | ≥ 95 |
| Lint errors | 10 | 0 |
| Broken/dead links | ≥ 2 | 0 |
| Persona inconsistencies | ≥ 4 strings | 0 |

---

## 8. Constraints & Assumptions

- Hosting on Vercel (`vercel.json` present). SSG/prerender must be Vercel-compatible.
- Owner-provided real content (project URLs, accurate stats) is required to fully satisfy FR-1.
- Bleeding-edge dependency versions are assumed intentional; pin and verify before upgrades.

## 9. Out of Scope / Future

- Multi-page case studies, CMS, i18n toggle, analytics — see `ROADMAP.md` Phase 5.

## 10. Risks

| Risk | Mitigation |
|---|---|
| Replacing WebGL changes the hero "feel" | Provide CSS/gradient equivalent reviewed against current look before merge |
| Prerender/framework migration scope creep | Time-box; default to `vite-plugin-prerender` before any framework change |
| Contrast token changes subtly shift brand | Keep light tints for decoration; only text switches to AA variant |
