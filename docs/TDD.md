# Technical Design Document — Portfolio Enhancement

**Version:** 1.0 · 2026-06-08
**Companion to:** `PRD.md`, `ROADMAP.md`

---

## 1. Current Architecture

```
index.html  (empty #root, CSR, render-blocking Google Fonts, broken og:image)
  └─ main.tsx → <StrictMode><App/></StrictMode>
       └─ App.tsx
            • isLoading gate (content hidden until Preloader done ~2–3s)
            • pathname !== '/' → <NotFound/>   (ad-hoc routing)
            • Lenis smooth scroll (RAF not cancelled)
            • Layout: Preloader, CustomCursor, Navbar, <main>, Footer
            ├─ EAGER: Hero (→ WebGLBackground = Three.js/R3F/Drei), About, Marquee, Magnetic, Section
            └─ LAZY:  Projects, Skills, Contact
Components: CustomCursor, Magnetic, Marquee, Navbar, Preloader, Section(+TextReveal,Parallax),
            WebGLBackground, SakuraBackground(DEAD), useMousePosition(DEAD)
Data:       inline inside section components (projectsData, skillsData, stats, navItems…)
Styling:    Tailwind 4 CSS-first @theme tokens in index.css (+ legacy dead utilities)
Build:      Vite 8 (no manualChunks) → single 1.32 MB chunk + 3 small lazy chunks
Hosting:    Vercel SPA rewrite (all routes → index.html)
```

**Key weaknesses:** Three.js eager; CSR-only + preloader gate; no data/types layer; ad-hoc routing; no reduced-motion; contrast tokens unsafe for text.

---

## 2. Proposed Architecture

```
index.html  (lang="id", valid OG/Twitter, JSON-LD, single font link)
  └─ (build) Prerender/SSG home + 404 → HTML contains real content
  └─ main.tsx → <App/>
       └─ App.tsx
            • content mounts immediately; Preloader = non-blocking overlay (first-visit + motion-aware)
            • routing via real router (or framework routes) when multi-page lands
            • MotionConfig + reduced-motion context
            ├─ above-the-fold: Hero (WebGL deferred/idle or CSS-equivalent), Navbar
            └─ lazy: Projects, Skills, Contact (unchanged, good)
src/
  data/        projects.ts, skills.ts, profile.ts, nav.ts   (typed content)
  types/       index.ts (Project, Skill, NavItem, Profile)
  lib/         seo.ts (meta + JSON-LD helpers), motion.ts (variants), a11y.ts (focus trap)
  components/  (+ FocusTrap/Dialog primitive; CursorProvider with fallback)
  sections/    (consume data/*)
  styles/      index.css (legacy utilities purged; AA text tokens added)
Build: Vite manualChunks {react, three(if kept), motion, vendor} + chunkSizeWarningLimit
CI:    lint + tsc --noEmit + build + Lighthouse budget
```

---

## 3. Component Strategy

| Concern | Strategy |
|---|---|
| WebGL background | Wrap `WebGLBackground` in `React.lazy` + `Suspense`; mount via `requestIdleCallback` after first paint, only when `!isMobile` and `prefers-reduced-motion: no-preference`. Fallback = existing `bg-aurora-*` CSS gradient (visual parity). If perf budget still missed, drop `three`/R3F/Drei and keep CSS version. |
| Preloader | Convert from mount-gate to overlay rendered above content; content renders underneath immediately. Show only when `!sessionStorage.getItem('visited')`; skip under reduced-motion. |
| Modal (Projects) | Extract a reusable `Dialog` primitive: portal, `role="dialog"`, `aria-modal`, focus trap, focus restore, background `inert`, Escape (already present). |
| Cursor | `CustomCursor` keeps its visual design but is gated behind a `CursorProvider` that (a) never removes the native cursor globally, (b) disables under reduced-motion/touch. |
| Data-driven sections | Move `projectsData`/`skillsData`/stats/nav/preloader strings to `src/data/*` with `src/types`. Sections become pure renderers. |
| Shared motion | `Section`'s `premiumEase`/`springEase` move to `src/lib/motion.ts` (fixes react-refresh lint, enables reuse). |

---

## 4. Performance Strategy

1. **Critical-path reduction:** remove Three.js from eager graph (lazy/idle/replace). Target main chunk ≤ 150 KB gzip.
2. **Chunking:** `build.rollupOptions.output.manualChunks` to isolate vendors; `chunkSizeWarningLimit` as a guardrail.
3. **Render path:** kill the preloader mount-gate → real LCP is the hero text, not a spinner.
4. **Runtime:** cancel RAF loops (Lenis, counters); `IntersectionObserver` for nav active state; passive listeners; restrict `filter: blur()` reveals to desktop / no-reduced-motion.
5. **Fonts:** one non-duplicated stylesheet link, `display=swap`, preload only used weights (consider self-hosting via `@fontsource`).
6. **Budgets enforced in CI** (Lighthouse-CI assertions).

---

## 5. Accessibility Strategy

- **Motion:** global `MotionConfig reducedMotion="user"` + CSS `@media (prefers-reduced-motion: reduce)` neutralizing `animate-marquee`, `animate-ping`, bounce, and reveal transforms.
- **Cursor:** never `cursor:none !important`; keep native cursor as fallback; custom cursor is enhancement-only.
- **Contrast:** add `--color-terracotta-text` / `--color-sage-text` AA-compliant tokens; swap *text* usages while keeping existing tints for borders/fills/decoration.
- **Dialog & menu:** focus trap + restore (shared `lib/a11y.ts`); `aria-expanded`/`aria-controls`/`aria-label` on the hamburger.
- **Structure:** skip link; visible focus rings (`:focus-visible`) replacing blanket `outline-none`; `aria-live` regions for form status/success.
- **Lang:** `lang="id"`.
- **Verification:** axe-core in CI + manual keyboard pass.

---

## 6. SEO Strategy

- **Rendering:** default to `vite-plugin-prerender`/`vite-react-ssg` to emit static HTML for `/` and `/404`. If multi-page case studies are adopted, migrate to **Astro** (React islands) or **Next.js**.
- **Meta:** centralize in `lib/seo.ts`; add `og:locale`, `og:site_name`, full Twitter Card, canonical.
- **Structured data:** `Person` JSON-LD (name, jobTitle, address Depok, `sameAs` GitHub/LinkedIn, email).
- **Assets:** real `og-preview.jpg` (1200×630), `robots.txt` (+ Sitemap), `sitemap.xml`.
- **Crawl path:** preloader must not gate content (shared with Perf).

---

## 7. Responsive Strategy

- Keep Tailwind breakpoints; normalize bespoke spacing (`bottom-22`, `py-4.5`) to theme scale.
- Audit Hero on 320–375px: ensure absolutely-positioned stats strip + scroll indicator don't overlap the headline/CTAs on short viewports (use `min-h-[100dvh]` consistently, give the stats strip flow fallback on `xs`).
- Continue migrating full-bleed sections from `min-h-screen` → `min-h-[100dvh]`.
- Verify the 768–1023px band (hamburger-only) intentionally hides desktop nav/status.
- Test matrix: 320 / 375 / 425 / 768 / 1024 / 1440 / 1920 (manual + Lighthouse mobile/desktop).

---

## 8. Deployment Strategy

- **Hosting:** Vercel (unchanged). Ensure SSG/prerender output is static-compatible with the existing `vercel.json` rewrite (or replace rewrite with framework adapter if migrating).
- **Branching:** feature branches → PR → CI gate → review → merge to `main` → Vercel preview/prod.
- **CI (GitHub Actions):** `lint` → `tsc -b --noEmit` → `vite build` → Lighthouse-CI budget assertions (perf/a11y/SEO). Block merge on failure.
- **Rollback:** Vercel immutable deploys → instant revert; each roadmap phase is independently revertable (additive changes preferred).
- **Observability (Phase 5):** privacy-friendly analytics + optional Lighthouse-CI trend tracking.

---

## 9. Migration Notes / Sequencing

1. Phase 1 (content/links/lint) needs no architectural change — land first.
2. Phase 2 perf (lazy WebGL, de-gate preloader, chunking) — no API changes, low risk.
3. Phase 3 a11y — additive tokens/guards; brand visuals unchanged.
4. Phase 4 SEO rendering — the one architectural decision (prerender vs framework); time-boxed, default to prerender.
5. Phase 5 scaling — router/CMS/i18n when content demands it.
