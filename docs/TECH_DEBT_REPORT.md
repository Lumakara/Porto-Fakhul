# Technical Debt & Code Quality Report

**Method:** `npm run lint` (real output) + static reading of all `src/` files.

---

## 1. Lint Results — 10 errors

```
Preloader.tsx  47:5   react-hooks/set-state-in-effect  (setState directly in effect)
Preloader.tsx  63,70,78  @typescript-eslint/no-explicit-any  (ease cast `as any`)
Section.tsx    6,7     react-refresh/only-export-components  (premiumEase/springEase consts)
WebGLBackground.tsx 6   @typescript-eslint/no-explicit-any  (FloatingShape props: any)
Contact.tsx    53:14   @typescript-eslint/no-unused-vars   ('error' caught but unused)
Projects.tsx   193:69  @typescript-eslint/no-explicit-any  (ease cast `as any`)
```

All are low-effort fixes. `noUnusedLocals`/`noUnusedParameters` are on in `tsconfig.app.json`, so keeping lint clean is realistic.

---

## 2. Dead Code & Unused Dependencies

| Item | Status | Evidence | Action |
|---|---|---|---|
| `src/components/SakuraBackground.tsx` | **Never imported** | `grep` finds no import | Delete (or wire intentionally) |
| `src/hooks/useMousePosition.ts` | **Never imported** | `grep` finds no import | Delete |
| `gsap` dependency | **Not used in `src/`** | `grep "gsap"` → none | Remove from `package.json` |
| `src/assets/hero.png` | Unused (Hero uses WebGL) | no import | Remove or use |
| `src/assets/react.svg`, `vite.svg` | Vite template leftovers | unused | Remove |
| Legacy CSS utilities (`*-cyber`, `text-gradient-sakura`, etc.) | Theme-mismatched dead styles | `index.css` | Purge |
| Root `untitled.txt` | Junk ("open repo / openrepo Yko") | repo root | Delete |
| `BUG_REPORT.md`, `NEXT_IMPROVEMENTS.md`, `PROJECT_STATUS.md` | Stale planning notes at root | repo root | Move to `/docs` or remove |

> Removing `gsap` + the Three.js stack (if `WebGLBackground` is replaced) is the largest single maintenance + bundle win.

---

## 3. Latent Bug (Dormant)

**`SakuraBackground.tsx` — Temporal Dead Zone.** Inside the effect, `animate()` is *invoked* before `let isPaused = false;` and `handleVisibilityChange` are declared (they sit **after** the cleanup `return`). On first `animate()` call, `isPaused` is in the TDZ → would throw `ReferenceError`. It never fires today only because the component is never mounted. If someone re-enables it, it breaks immediately. The effect's `return` cleanup also appears before the `addEventListener('visibilitychange', …)` that it tries to clean up.
**Action:** Delete the component, or rewrite the effect with declarations before use if it's revived.

---

## 4. Anti-Patterns & Architecture Smells

| ID | Smell | File | Recommendation |
|---|---|---|---|
| TD-1 | Routing via `window.location.pathname !== '/'` | `App.tsx` | Adopt a real router or framework routing |
| TD-2 | Content/data hardcoded inside components (`projectsData`, `skillsData`, stats, nav items, status strings) | `Projects.tsx`, `Skills.tsx`, `Hero.tsx`, `Navbar.tsx`, `Preloader.tsx` | Extract to `src/data/*.ts` with typed interfaces |
| TD-3 | No `src/types`, `src/lib`, `src/data` layering | whole project | Introduce light structure (see TDD) |
| TD-4 | `setState` inside effect body (cascading renders) | `Preloader.tsx` | Derive `statusIdx` during render or `useMemo` |
| TD-5 | RAF loop not cancelled | `App.tsx` (Lenis), `Hero.tsx` (counter) | Store id; `cancelAnimationFrame` in cleanup |
| TD-6 | Unthrottled scroll + layout reads | `Navbar.tsx` | `IntersectionObserver` + rAF throttle |
| TD-7 | `error` swallowed silently in catch | `Contact.tsx` | Surface user-facing error + log |
| TD-8 | Mixed default/named exports | several | Standardize on named exports |
| TD-9 | Magic numbers / bespoke spacing (`bottom-22`, `py-4.5`) | `Hero.tsx` | Use theme scale / named constants |
| TD-10 | No tests, no CI despite "Git/CI-CD" skill claim | repo | Add CI (lint+typecheck+build) + smoke tests |
| TD-11 | Bleeding-edge deps (Vite 8, TS 6, ESLint 10, React 19.2) | `package.json` | Pin & document; verify plugin compatibility |

---

## 5. Maintainability Score Breakdown

| Dimension | Rating | Notes |
|---|---|---|
| Modularity | ⚠️ Medium | Good component split, but data+UI+logic entangled |
| Reusability | ⚠️ Medium | `Section`/`Magnetic`/`TextReveal` reusable; sections monolithic |
| Scalability | ❌ Low | No router/data layer; one-pager assumptions baked in |
| Type safety | ⚠️ Medium | Strict flags on, but `any` casts leak through |
| Consistency | ⚠️ Medium | Export style, alignment, language all drift |
| Test coverage | ❌ None | No tests at all |

---

## 6. Prioritized Tech-Debt Backlog

| ID | Effort | Priority |
|---|---|---|
| Lint errors (all 10) | XS | High |
| Delete dead code + `gsap` + junk files | XS | High |
| TD-1 router / framework decision | L | High (ties to SEO) |
| TD-2/TD-3 data + types extraction | M | Medium |
| TD-4/TD-5/TD-6 effect & scroll fixes | S–M | Medium |
| TD-10 CI + smoke tests | M | Medium |
| TD-8/TD-9 consistency cleanup | S | Low |
| TD-11 dependency pinning | S | Low |
