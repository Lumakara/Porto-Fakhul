# Accessibility Report — WCAG 2.1 AA Target

**Method:** Static audit of markup, CSS, and interaction code. Contrast ratios computed from the project's own `@theme` tokens.

---

## 1. Critical Blockers

### A-1 — System cursor hidden on desktop  *(WCAG 2.4.7 / usability)* **[Critical]**
`index.css`:
```css
@media (min-width: 1024px) {
  body, a, button, select, input, textarea { cursor: none !important; }
}
```
The native cursor is removed for **all** desktop users and replaced by a JS spring cursor. If JS fails, is slow, or the user has motion/pointer sensitivities, they have **no pointer at all**. This is a hard usability and accessibility failure.
**Fix:** Only hide the cursor when the custom cursor is actually active **and** `prefers-reduced-motion: no-preference`; always keep a visible fallback. Never use `!important` to remove the cursor globally.

### A-2 — No `prefers-reduced-motion` support  *(WCAG 2.3.3 Animation from Interactions)* **[Critical]**
No occurrence of `prefers-reduced-motion` or `useReducedMotion` exists anywhere in the repo, yet the site has: infinite marquees, infinite `animate-ping` dots, an infinite bouncing scroll indicator, full-screen curtain transitions, blur/scale/rotateX reveals on every section, the canvas/WebGL motion, and the magnetic cursor.
**Fix:** Gate non-essential motion behind `prefers-reduced-motion: no-preference`. Framer Motion's `useReducedMotion()` + a CSS `@media (prefers-reduced-motion: reduce)` block that neutralizes `animate-marquee`, `animate-ping`, and reveal transforms.

### A-3 — Color contrast failures  *(WCAG 1.4.3)* **[Critical]**
Computed against backgrounds in use:

| Foreground | Background | Ratio | AA (normal/large) |
|---|---|---|---|
| terracotta `#C68A7C` | sand `#FDFBF7` | ~2.3:1 | ❌ fails both |
| sage `#A3B19B` | sand `#FDFBF7` | ~1.9:1 | ❌ fails both |
| charcoal-light `#4A4A4A` | sand `#FDFBF7` | ~8.9:1 | ✅ passes |
| charcoal `#2A2A2A` | sand `#FDFBF7` | ~13.6:1 | ✅ passes |

Terracotta and sage are used for **small** text repeatedly: kicker labels (`text-[10px]`), active nav item, "Live"/"UPLINK_ON" status, cyber IDs, links on hover. As small text they require ≥4.5:1 and fail badly.
**Fix:** Darken terracotta/sage for text usage (e.g. a `--color-terracotta-text` / `--color-sage-text` token around `#A45B49` / `#5E6E55`) while keeping the lighter tints for decoration/borders/fills. Preserves the palette visually but passes AA.

---

## 2. High-Priority Issues

| ID | Issue | File | WCAG |
|---|---|---|---|
| A-4 | Project modal lacks `role="dialog"`, `aria-modal`, focus trap, focus restore, and background `inert`. Only Escape is handled. | `Projects.tsx` | 2.4.3, 4.1.2 |
| A-5 | Mobile menu button has no `aria-expanded`, `aria-controls`, or `aria-label`; drawer has no focus trap; focus not moved/returned. | `Navbar.tsx` | 4.1.2, 2.4.3 |
| A-6 | Broken email link (`href="Fakhulrohman2@gmail.com"`, no `mailto:`) — keyboard/AT users cannot action the primary contact. | `Contact.tsx` | 2.1.1 |
| A-7 | Dead link `href="#"` ("LAUNCH_SITE") announced as a link but does nothing. | `Projects.tsx` | 2.4.4, 4.1.2 |
| A-8 | Pervasive `outline-none` / `cursor-none` on buttons/inputs without a replacement visible focus indicator. | many | 2.4.7 |
| A-9 | No skip-to-content link. | `App.tsx` | 2.4.1 |
| A-10 | `<html lang="en">` but primary content is Indonesian → screen readers use wrong pronunciation. | `index.html` | 3.1.1 |

---

## 3. Medium / Minor

| ID | Issue | Note |
|---|---|---|
| A-11 | Console-log "sending" region in contact form is not an `aria-live` region | Status updates inaudible to AT (`Contact.tsx`) |
| A-12 | Success state change not announced | Add `aria-live="polite"` / move focus to heading |
| A-13 | Tiny 8–10px text throughout | Hard for low-vision users; raise minimums |
| A-14 | Card uses `role="button"` on a `<div>` | Acceptable (keyboard handlers present) but a real `<button>`/`<a>` wrapper is more robust |
| A-15 | Form lacks inline error messaging / `aria-invalid` | Only native `required` validation |

---

## 4. What's Already Good

- `<main>`, `<header>`, `<nav>`, `<footer>` landmarks present (`App.tsx`).
- Custom cursor elements correctly marked `aria-hidden="true"` (`CustomCursor.tsx`).
- Decorative marquee duplicate and `✦` glyph marked `aria-hidden` (`Marquee.tsx`).
- Skill bars expose `role="progressbar"` with `aria-valuenow/min/max` + label (`Skills.tsx`).
- Form inputs have associated `<label htmlFor>` (`Contact.tsx`).
- Project cards: `role`, `tabIndex`, `aria-label`, Enter/Space handlers; modal close has `aria-label` (`Projects.tsx`).
- Single `<h1>` per rendered page (Hero on home, NotFound on 404).

---

## 5. Prioritized A11y Backlog

| ID | Effort | Priority |
|---|---|---|
| A-1 cursor fallback | S | Critical |
| A-2 reduced-motion | M | Critical |
| A-3 contrast tokens | S | Critical |
| A-6 / A-7 link fixes | XS | High |
| A-4 modal dialog semantics + focus trap | M | High |
| A-5 mobile menu ARIA + focus trap | M | High |
| A-8 visible focus rings | S | High |
| A-9 skip link | XS | Medium |
| A-10 lang attribute | XS | Medium |
| A-11/A-12 aria-live | S | Medium |

**Acceptance:** axe-core / Lighthouse a11y ≥ 95, zero critical violations, full keyboard traversal of nav + modal + form, AA contrast on all text.
