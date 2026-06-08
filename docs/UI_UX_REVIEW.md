# UI / UX / Responsive Review

**Scope:** Preserve the existing "natural & elegant" identity. Findings below are consistency, usability, and responsive issues — not redesign proposals.

---

## 1. UI Audit

### 1.1 Visual Hierarchy — Good, with caveats
- Hero uses a strong fluid headline (`text-fluid-hero` = `clamp(3rem,10vw,9rem)`) — effective focal point.
- **Issue (UI-1):** Section header alignment is inconsistent. `Projects` is **center-aligned**, while `About`, `Skills`, and `Contact` are **left-aligned**. This breaks rhythm as the user scrolls. Pick one convention (recommend left-aligned for editorial feel) or make the difference intentional and consistent.
- **Issue (UI-2):** Extremely small text is used pervasively — `text-[8px]`, `text-[9px]`, `text-[10px]` for labels, footer specs, nav sub-label ("PORTFOLIO"), and pills. Below ~11px, legibility and tap-target context suffer, especially on high-DPI phones.

### 1.2 Typography — Strong
- Two-family system (Cormorant Garamond display + DM Sans UI) is consistent and on-brand.
- **Issue (UI-3):** `TextReveal` default `glowClass` falls back to `text-white` when `glow` is false (`Section.tsx`). On the light `sand` background this would render invisible text. It currently works only because every usage sits inside an explicitly colored parent. This is a latent rendering trap — default should be `currentColor`/`inherit`.

### 1.3 Color Consistency — Mostly consistent, legacy debt
- Palette is centralized in `@theme` (good).
- **Issue (UI-4):** `index.css` still ships **dead/legacy "cyber/sakura" utilities** that conflict with the current natural theme: `.cyber-grid-cyber`, `.bg-glow-cyber`, `.text-glow-cyber`, `.bg-aurora-*`, and `.text-gradient-sakura` (redefined to flat charcoal). They inflate CSS (56 KB) and confuse future maintenance.

### 1.4 Component Consistency
- **Issue (UI-5):** Mixed export style — some components export both named and default (`Magnetic`, `About`, `Skills`, `Projects`, `Contact`, `WebGLBackground`), others only named (`Navbar`, `Marquee`, `CustomCursor`). Standardize.
- **Issue (UI-6):** Spacing scale is mostly consistent (`py-24 md:py-32` via `Section`) but Hero opts out (`pt-28 pb-40`) and uses bespoke offsets (`bottom-22`, `bottom-27`, `py-4.5`) — non-standard Tailwind steps that are easy to drift.

---

## 2. UX Audit

### 2.1 Navigation labels — High cognitive load (UX-1)
The navbar uses cyber-jargon that no longer matches the elegant rebrand and forces users to decode the menu:

| Label shown | Actual destination |
|---|---|
| `// HOME` | Hero |
| `// BLUEPRINT` | About |
| `// ARCHIVE` | Projects |
| `// MATRIX` | Skills |
| `// UPLINK` | Contact |

Recruiters scanning quickly may not map `UPLINK → Contact`. Recommend plain labels (Home, About, Work, Skills, Contact) or keep the styling but show real words.

### 2.2 Identity / content integrity — Credibility risk (UX-2) **[Critical]**
- `Preloader.tsx` logo: **"SORA"**, subtitle "Portfolio 2026".
- `NotFound.tsx` footer: **"Sora Takahashi"**, **"Tokyo, Japan"**, **"Creative Developer"**.
- Real owner (`About.tsx`, footer in `App.tsx`): **Fakhul Rohman**, **Depok, Jawa Barat**.
- Project case studies (`Projects.tsx`) are fictional/templated (NEO-TOKYO FLUIDS, SAKURA_CORE ERP claiming WCAG/WebGL work) and contradict the honest bio (SMK Akuntansi → network/CCTV technician → kitchen staff). This mismatch is jarring to anyone reading carefully.

> **Recommendation:** Preserve the *visual* treatment but align all copy to the real person. Replace fictional projects with real ones (even small ones) or relabel them clearly as concept/design explorations.

### 2.3 Friction points
- **UX-3:** Forced preloader (~2–3s) before any content. For returning visitors this is pure friction. Gate it behind first-visit only (sessionStorage) and shorten; respect reduced-motion by skipping.
- **UX-4:** Mixed-language copy (English UI + Indonesian bio/preloader strings) creates an inconsistent voice. Decide on a primary language or do it deliberately bilingual.
- **UX-5:** Project modal "LAUNCH_SITE" link does nothing (`href="#"` + `preventDefault`). A visible CTA that does nothing erodes trust. Hide it or wire real URLs.
- **UX-6:** Hero stats labels ("ORGANIZATIONS 15+") are unverifiable and inconsistent with a 2-year, 2-role résumé. Align numbers with reality.
- **UX-7:** Email is not clickable/copyable correctly (see TECH_DEBT C4). Primary contact path is broken.

### 2.4 Information Architecture & CTA — Generally sound
- Single-page flow Hero → About → Projects → Skills → Contact is logical.
- CTAs ("VIEW PROJECTS", "START A PROJECT", "SEND MESSAGE") are visible and well-placed. Good. Just make them all functional.

---

## 3. Responsive Audit

Tested against the requested breakpoints by reading layout classes (no live device lab in sandbox; flagged by static analysis of Tailwind breakpoints + fixed sizes).

| Width | Risk | Finding |
|---|---|---|
| **320px** | High | Hero: `pt-28 pb-40` + giant `clamp` headline + absolutely-positioned stats strip (`absolute bottom-0`) + scroll indicator (`bottom-22`) inside `min-h-[100dvh]` → vertical crowding/overlap likely. Validate the stats strip doesn't collide with the scroll cue. |
| **375px** | Medium | Same as 320 but more headroom; tiny `text-[9px]` labels hard to read. |
| **425px** | Low | Generally OK. |
| **768px** | Medium | Desktop nav links are hidden until `lg` (1024). At 768–1023 only the hamburger shows and the status node is hidden — acceptable, but the nav capsule looks sparse. |
| **1024px** | Medium | `cursor: none !important` kicks in here (a11y issue, see ACCESSIBILITY_REPORT). Desktop nav appears. |
| **1440px** | Low | `max-w-7xl` containers center nicely. |
| **1920px** | Low | Content caps at `max-w-7xl`; large side gutters are intentional/elegant. |

Additional responsive notes:
- **R-1:** Hero stats use `grid md:grid-cols-3 divide-x` — on mobile they stack to one column where `divide-x` produces no separators (fine) but the `border-t` strip pinned to `absolute bottom-0` can overlap CTAs on short viewports.
- **R-2:** `min-h-screen` is used on `Projects` section; Hero correctly uses `min-h-[100dvh]`. Keep migrating full-bleed areas to `dvh` (mobile Safari address-bar jump — already noted in `BUG_REPORT.md`).
- **R-3:** Modal is `max-w-2xl` with `max-h-[90vh] overflow-y-auto` — good on mobile.

---

## 4. Prioritized UI/UX Fix List

| ID | Fix | Effort | Priority |
|---|---|---|---|
| UX-2 | Replace "SORA"/"Sora Takahashi"/"Tokyo" with real identity | S | Critical |
| UX-5 / UX-7 | Fix/hide dead project link; fix `mailto:` | XS | Critical |
| UX-3 | First-visit-only + shortened preloader, reduced-motion skip | S | High |
| UI-1 | Unify section-header alignment | S | High |
| UX-1 | Plain-language nav labels | XS | High |
| UI-4 | Remove dead legacy CSS utilities | S | Medium |
| UI-3 | Fix `TextReveal` default color | XS | Medium |
| UI-2 | Raise minimum font sizes toward ≥11–12px | S | Medium |
| UX-4 / UX-6 | Language consistency; honest stats | S | Medium |
