# UI/UX Review — Portfolio Overhaul (2026)

This document reviews the overhaul shipped in this branch and lists concrete,
prioritized suggestions for what to improve or add next — both functionally and
visually.

## What shipped in this pass

| Area | Change |
|---|---|
| **Profile card (About)** | Rebuilt into a responsive 2-column identity card: avatar + verified badge, name, role, metadata pills (location / experience / response time), social links, a 4-up personal-branding photo strip, quick-stats grid, and tabbed Story / Experience / Skills. Skills now render correctly (soft-skill chips with icons + hard-skill proficiency bars) — previously empty because `t()` only returns strings. |
| **Project detail** | New hero with status + category, year/role/status meta bar, action links (Live / Source / Case study / Demo), metrics, a gallery of faux-browser screenshot frames, key-features grid, challenge/solution, tech stack, and a "Next project" CTA. |
| **Project data** | Enriched with `features`, `metrics`, `links`, `status`, `year`, `role`, `screens`, and `accent`, plus a `getStatusMeta()` helper. |
| **Bento grid** | 3D tilt on hover (Framer Motion, no external dep) with depth + glare; live status badges; metrics strip on the featured card. |
| **Hamburger menu** | Replaced the full-height drawer with a compact rounded **bottom sheet**: grab handle, 2-column 56px touch tiles, and a single compact theme + language row — far more thumb-friendly. |
| **Floating Action Button** | New bottom-right FAB expanding into a tabbed surface: **AI Assistant** + full **Settings**. Bottom sheet on mobile, popover on desktop, focus-trapped. |
| **AI chatbot** | OpenAI Chat Completions integration. API key, model, personality (system prompt) and creativity are all configurable in Settings and stored locally. Chat history persists in `localStorage` across navigation/refresh. |
| **Audio feedback** | Web-Audio-synthesized mechanical tick/click sounds on hover/click of interactive elements, off by default, with an enable toggle + volume in Settings. |
| **Adaptive canvas** | The WebGL background samples FPS each second and lowers `dpr` (resolution) when sustained below 50 FPS, recovering when headroom returns. Mobile starts lower and uses fewer sphere segments. |
| **Decorative icons / photos** | Added accents across About, Projects, Contact, and detail; `BrandPhoto` renders `.webp` photos from `/public/brand/` with graceful gradient placeholders until real photos are added. |

## Known limitations / honest notes

- **Branding photos are placeholders.** Real photographic `.webp` assets cannot be
  generated here. The `BrandPhoto` component + `/public/brand/README.md` make
  adding them a drop-in, zero-code change (`portrait-1..5.webp`).
- **AI key is client-side.** Bringing your own key in the browser is convenient
  but the key lives in `localStorage` and calls OpenAI directly from the client.
  For a public site, proxy requests through a tiny serverless function so the key
  never ships to the browser (see suggestion P1 below).
- **Three.js is still ~257 KB gzip** and remains the dominant bundle cost (this
  matches the existing `PERFORMANCE_REPORT.md` finding).
- **id/zh locales** fall back to English for the new Settings (audio/AI) and
  project-detail strings.

## Suggested next improvements

### Priority 1 — functional / correctness
1. **Proxy the AI requests.** Add a serverless endpoint (Vercel function) that
   holds the key server-side; the client calls your endpoint instead of OpenAI.
   Keeps the BYO-key option as a fallback.
2. **Streaming responses.** Stream tokens (SSE) for a snappier assistant instead
   of waiting for the full completion.
3. **Translate new strings** into `id.json` and `zh.json` (settings.audio,
   settings.ai, project-detail features/gallery/etc.).
4. **Real project links.** Replace the placeholder `#` hrefs in `projects.ts`
   with live URLs / repos.

### Priority 2 — UX polish
5. **Contact → assistant bridge.** A "Prefer to chat?" button in Contact that
   opens the FAB assistant would tie the two together.
6. **Toast confirmations** for actions like "email copied" and "settings reset"
   (currently inline only).
7. **Gallery lightbox.** Make project gallery frames open a larger preview; wire
   real screenshots when available.
8. **Keyboard hint** for the FAB (e.g. `?` or `g` to open) and an unread/“new”
   indicator the first time.

### Priority 3 — visual / performance
9. **Reduce Three.js cost** — idle-mount only after first paint, or replace the
   decorative spheres with the existing CSS aurora on low/medium devices.
10. **Dark-mode pass on new surfaces** — verify the FAB panel, chat bubbles, and
    bottom-sheet contrast in dark theme.
11. **Respect `audio.uiSounds` + reduced-motion together** — already gated, but
    add a first-run tooltip so users know sounds exist.
12. **Image of `og-preview.jpg`** is still referenced but missing (pre-existing
    SEO gap) — add a 1200×630 share image.

## Accessibility checklist (carried forward)
- FAB and bottom sheet are `role="dialog"`, focus-trapped, Escape-closable. ✅
- Touch targets in the new mobile menu are ≥ 44px. ✅
- Tilt, particles, and animations all respect `prefers-reduced-motion` and the
  user's visual-effects toggles. ✅
- Status colors pair an icon/label with color (not color-only). ✅
- Remaining: re-audit color contrast of terracotta/sage on small text (pre-existing W7).
