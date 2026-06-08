# Enhancement Roadmap

Five phases, ordered by risk and impact. Every phase **preserves the existing visual identity**. Each phase ends in a working, shippable state (incremental delivery).

Effort key: XS (<1h) · S (1–3h) · M (half-day) · L (1–2 days)

---

## Phase 1 — Critical Fixes & Content Integrity  *(highest impact / lowest risk)*

Goal: stop credibility bleed and unblock accessibility/SEO basics. No visual change.

| Task | Source | Effort |
|---|---|---|
| Fix email link → `mailto:fakhulrohman2@gmail.com` | A-6 / C4 | XS |
| Fix or hide dead project "LAUNCH_SITE" `href="#"` | A-7 / UX-5 | XS |
| Replace leftover persona ("SORA", "Sora Takahashi", "Tokyo, Japan", "Creative Developer") with real identity (Fakhul Rohman / Depok / real role) | UX-2 | S |
| Align/relabel fictional project data to real work or mark as concepts | UX-2 | S |
| Set `<html lang="id">`, remove conflicting `meta language` | SEO-3 / A-10 | XS |
| Create + reference real `og-preview.jpg` (1200×630); add `og:locale`, `og:site_name`, Twitter Card | SEO-2/3/4 | S |
| Fix all 10 lint errors; remove unused `error`, `any` casts | TECH_DEBT §1 | S |
| Delete dead code (`SakuraBackground`, `useMousePosition`), unused `gsap`, `untitled.txt`, template assets | TECH_DEBT §2 | XS |

**Exit:** lint clean, build green, links work, copy is consistent, share preview renders.

---

## Phase 2 — Performance

Goal: cut initial JS by ~60–70% and de-gate content.

| Task | Source | Effort |
|---|---|---|
| Lazy-load / idle-mount or replace `WebGLBackground` (Three.js out of critical path) | P-1/P-2 | M |
| Remove forced preloader gate; overlay + first-visit-only + reduced-motion skip | P-3 | M |
| Configure Vite `manualChunks` (vendor/three/motion split) + chunk budget | P-9 | S |
| Font loading cleanup (de-dupe preload/stylesheet, preload used weights) | P-10 | S |
| Cancel Lenis RAF on cleanup; rAF counter cleanup | P-7 | S |
| `IntersectionObserver` + throttle for Navbar active-section | P-4 | S |
| Add CI Lighthouse budget (perf ≥ 90 mobile) | — | M |

**Exit:** initial JS ≤ 150 KB gzip; Lighthouse Perf ≥ 90 mobile.

---

## Phase 3 — UI/UX & Accessibility Enhancement

Goal: reach WCAG AA and tighten consistency — visuals preserved.

| Task | Source | Effort |
|---|---|---|
| Add `prefers-reduced-motion` (CSS + `useReducedMotion`) across all motion | A-2 | M |
| Restore cursor fallback; scope `cursor:none` safely | A-1 | S |
| Introduce AA-safe text tokens for terracotta/sage; keep tints for decoration | A-3 | S |
| Modal: `role="dialog"`, `aria-modal`, focus trap + restore, background `inert` | A-4 | M |
| Mobile menu: `aria-expanded`/`aria-controls`/`aria-label`, focus trap | A-5 | M |
| Visible focus rings everywhere `outline-none`/`cursor-none` used | A-8 | S |
| Skip-to-content link | A-9 | XS |
| `aria-live` for form status/console + success | A-11/A-12 | S |
| Unify section-header alignment; plain nav labels; raise min font sizes | UI-1/UX-1/UI-2 | S |

**Exit:** axe/Lighthouse a11y ≥ 95; full keyboard traversal; AA contrast.

---

## Phase 4 — Advanced Features & SEO Rendering

Goal: make the site truly discoverable and richer.

| Task | Source | Effort |
|---|---|---|
| Prerender/SSG home + 404 (vite-plugin-prerender) **or** migrate to Astro/Next | SEO-1 | L |
| `Person` JSON-LD + `robots.txt` + `sitemap.xml` + canonical | SEO-5/6 | S |
| Extract content to `src/data/*` with typed models | TD-2/TD-3 | M |
| Real contact-form error UX (retry/feedback) | TD-7 | S |
| Smoke tests (render + key interactions) + typecheck in CI | TD-10 | M |

**Exit:** `view-source` shows real content; valid rich results; data-driven sections.

---

## Phase 5 — Future Scaling

Goal: room to grow beyond a one-pager.

| Task | Effort |
|---|---|
| Real router + per-route prerender (case-study pages, `/work/:slug`) | L |
| MDX/CMS-backed project case studies (replace inline data) | L |
| i18n (deliberate EN/ID bilingual toggle) | M |
| Analytics + privacy-friendly event tracking (CTA clicks, scroll depth) | S |
| Visual regression + Lighthouse CI gates on PRs | M |
| Component library extraction (`/ui`) if reused across pages | M |

---

## Sequencing Rationale
- Phase 1 is pure win: near-zero risk, fixes credibility + unblocks the rest.
- Phase 2 before 3/4 because bundle + render gate are the biggest measurable problems and affect every other metric.
- SEO rendering (Phase 4) is gated on the routing/framework decision (TDD §2) — deliberately later so it isn't rushed.
