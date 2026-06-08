# Portfolio Enhancement — Master Audit Report

**Project:** Porto-Fakhul (`web-porto`) — Personal portfolio of Fakhul Rohman
**Stack:** React 19 · Vite 8 · TypeScript 6 · Tailwind CSS 4 · Framer Motion · Three.js / R3F / Drei · Lenis
**Audit date:** 2026-06-08
**Auditor role:** Senior Staff Engineer / Principal UX / Performance / Accessibility / Architecture
**Scope:** Enhancement & optimization only — **the existing visual identity and branding are to be preserved.**

---

## 1. Executive Summary

The portfolio has a genuinely strong, cohesive visual concept: a warm, "natural & elegant" palette (sand / charcoal / terracotta / sage), refined Cormorant Garamond + DM Sans typography, a cinematic preloader, magnetic micro-interactions, a custom cursor, and tasteful scroll-reveal motion. The design language is the project's biggest asset and must be kept.

However, beneath the polish the project carries meaningful **engineering, performance, accessibility, SEO, and content-integrity debt**. The single JavaScript bundle ships at **1,321 KB (374.6 KB gzipped)** — Three.js is eagerly loaded for a decorative background — and Vite explicitly warns about it. The site is **client-rendered only**, so search crawlers and link-preview bots see an empty `<div id="root">`, and a forced 2–3 second preloader delays first paint of real content. Accessibility has regressions that block WCAG 2.1 AA: the system cursor is hidden on desktop, no `prefers-reduced-motion` support exists despite heavy animation, and several brand colors fail contrast at the small sizes used.

Most urgently, there are **content/branding inconsistencies and broken links** that undermine credibility: the preloader logo reads "SORA", the 404 page is signed "Sora Takahashi / Tokyo, Japan / Creative Developer" (a leftover template persona) while the real owner is **Fakhul Rohman from Depok, Jawa Barat**; the contact email link is missing its `mailto:` scheme; and the project case-study CTA points to `#`.

None of these require a redesign. They are surgical fixes and additive enhancements that preserve the look and feel while raising the project to a production-grade standard.

---

## 2. Overall Score

### **58 / 100** — "Strong design, sub-production engineering"

| Category | Weight | Score (/100) | Weighted | Grade |
|---|---|---|---|---|
| Visual / Brand Design | 15% | 84 | 12.6 | A− |
| Architecture & Maintainability | 15% | 52 | 7.8 | D+ |
| Performance | 20% | 42 | 8.4 | D |
| Accessibility (WCAG AA) | 15% | 40 | 6.0 | D |
| SEO & Discoverability | 10% | 40 | 4.0 | D |
| Responsive Design | 10% | 64 | 6.4 | C |
| Code Quality | 10% | 55 | 5.5 | C− |
| Content Integrity | 5% | 45 | 2.25 | D |
| **Total** | **100%** | — | **≈ 58** | **C−** |

> Scores are evidence-based: bundle size and lint counts are measured from an actual production build (see `PERFORMANCE_REPORT.md`).

---

## 3. SWOT Analysis

### Strengths

| # | Strength | Evidence |
|---|---|---|
| S1 | Cohesive, premium visual identity with a disciplined design-token system | `@theme` block in `index.css` defines a complete color/typography palette |
| S2 | Tasteful, high-craft motion design (magnetic buttons, text reveal, parallax) | `Magnetic.tsx`, `Section.tsx` (`TextReveal`, `Parallax`), shared `premiumEase` |
| S3 | Modern toolchain (React 19, Vite 8, TS strict-ish, Tailwind 4 CSS-first) | `package.json`, `tsconfig.app.json` (`noUnusedLocals`, `noUnusedParameters`) |
| S4 | Partial code-splitting already in place | `Projects`, `Skills`, `Contact` lazy-loaded via `React.lazy` in `App.tsx` |
| S5 | Real form backend wired | Formspree integration in `Contact.tsx` |
| S6 | Some a11y intent present | Project cards have `role/tabIndex/aria-label`; progressbar ARIA in `Skills.tsx`; Escape closes modal |

### Weaknesses

| # | Weakness | Evidence | Severity |
|---|---|---|---|
| W1 | 1.32 MB JS bundle (374 KB gzip); Three.js eagerly loaded for a decorative blob | `npm run build` output; `WebGLBackground` imported in `Hero` | Critical |
| W2 | CSR-only; empty DOM for crawlers; preloader gates content ~2–3s | `index.html`, `App.tsx` `isLoading` gate, `Preloader.tsx` timing | Critical |
| W3 | System cursor hidden on desktop; no reduced-motion support | `index.css` `cursor: none !important`; no `prefers-reduced-motion` in repo | Critical |
| W4 | Broken email link + dead project CTA | `Contact.tsx` `href="Fakhulrohman2@gmail.com"`; `Projects.tsx` `href="#"` | High |
| W5 | Identity/branding inconsistency ("SORA"/"Tokyo"/"Sora Takahashi") | `Preloader.tsx`, `NotFound.tsx` vs real bio in `About.tsx` | High |
| W6 | Broken OG image; lang/locale mismatch; no robots/sitemap/JSON-LD | `index.html`; `public/` has no `og-preview.jpg`/`robots.txt`/`sitemap.xml` | High |
| W7 | Color-contrast failures at small text sizes | terracotta `#C68A7C` & sage `#A3B19B` on sand `#FDFBF7` | High |
| W8 | Dead code & unused deps inflate maintenance and bundle | `SakuraBackground`, `useMousePosition`, `gsap` all unused | Medium |
| W9 | 10 lint errors; `any` types; routing hack; inline data | `npm run lint`; `App.tsx` `window.location.pathname` check | Medium |

### Opportunities

| # | Opportunity | Expected Impact |
|---|---|---|
| O1 | Lazy-load / gate Three.js (or replace with CSS) | −60–70% initial JS; faster LCP/TBT |
| O2 | Add static prerender / SSG (`vite-plugin-prerender` or migrate to Next/Astro) | Real SEO + social previews + faster FCP |
| O3 | Add `prefers-reduced-motion` + cursor fallback | Unlocks WCAG AA and a much wider audience |
| O4 | Extract content into `/data` + types | Easier updates, testability, reuse |
| O5 | Add `react-helmet`-style meta + JSON-LD Person schema | Rich results, accurate sharing cards |
| O6 | Introduce CI (lint + typecheck + build + Lighthouse budget) | Prevents regressions; matches claimed "Git/CI-CD" skill |

### Threats

| # | Threat | Risk |
|---|---|---|
| T1 | Poor mobile/low-end performance from 374 KB JS + WebGL + canvas | Bounce on the exact devices most recruiters use |
| T2 | Invisible to search & broken social previews | Portfolio fails its primary job: being found & shared |
| T3 | Accessibility gaps = legal/ethical exposure & lost users | Excludes keyboard/AT users; bad signal for a "frontend" role |
| T4 | Fictional/templated project data contradicts real résumé | Credibility damage with recruiters who read closely |
| T5 | Bleeding-edge dep versions (Vite 8, TS 6, ESLint 10) | Ecosystem/plugin breakage; harder onboarding |

---

## 4. Critical Findings (Fix First)

1. **C1 — Bundle bloat / eager Three.js** → defer or replace `WebGLBackground`. (`PERFORMANCE_REPORT.md`)
2. **C2 — No SEO-renderable HTML + preloader gate** → prerender + remove forced delay. (`SEO_REPORT.md`)
3. **C3 — `cursor: none` + no reduced-motion** → restore cursor fallback, honor motion prefs. (`ACCESSIBILITY_REPORT.md`)
4. **C4 — Broken `mailto:` & dead project link** → trivial fixes, high credibility impact. (`TECH_DEBT_REPORT.md`)
5. **C5 — "SORA"/"Tokyo"/"Sora Takahashi" leftover persona** → align all copy to Fakhul Rohman / Depok. (`UI_UX_REVIEW.md`)
6. **C6 — Missing OG image + lang mismatch** → add asset, set `lang="id"`/locale. (`SEO_REPORT.md`)

---

## 5. Document Index

| Document | Purpose |
|---|---|
| `AUDIT_REPORT.md` | This file — executive summary, score, SWOT |
| `UI_UX_REVIEW.md` | UI consistency + UX flow + responsive findings |
| `PERFORMANCE_REPORT.md` | Measured bundle, prioritized perf backlog |
| `ACCESSIBILITY_REPORT.md` | WCAG 2.1 AA audit |
| `SEO_REPORT.md` | Metadata, OG, structured data, rendering |
| `TECH_DEBT_REPORT.md` | Code quality, dead code, anti-patterns |
| `ROADMAP.md` | 5-phase delivery plan |
| `PRD.md` | Product requirements (enhancement-focused) |
| `TDD.md` | Technical design document |
