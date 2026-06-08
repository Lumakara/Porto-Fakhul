# Architecture Documentation

This document describes the architecture of the Porto-Fakhul portfolio application, covering state management, theming, internationalization, and component design.

---

## Table of Contents

- [Overview](#overview)
- [Component Hierarchy](#component-hierarchy)
- [State Flow](#state-flow)
- [Settings System](#settings-system)
- [Theme System](#theme-system)
- [Internationalization (i18n)](#internationalization-i18n)
- [Accessibility Architecture](#accessibility-architecture)
- [Performance Strategy](#performance-strategy)
- [How to Add a New Language](#how-to-add-a-new-language)
- [How to Add a New Setting](#how-to-add-a-new-setting)

---

## Overview

The application is built with:

- **React 19** — UI library with hooks and lazy loading
- **TypeScript 6** — Strict type safety across all modules
- **Vite 8** — Build tool with HMR and optimized bundling
- **Tailwind CSS 4** — Utility-first styling with CSS custom properties
- **Framer Motion 12** — Declarative animations and layout transitions
- **React Context API** — Lightweight state management (no Redux)

### Design Principles

1. **Context-driven state** — Global state lives in React Contexts, not prop drilling
2. **CSS-variable theming** — Runtime theme changes without React re-renders
3. **Custom lightweight i18n** — No heavy library; typed locale objects with dot-notation access
4. **Progressive enhancement** — Core content works without JS animations; effects are layered on top
5. **Accessibility by default** — ARIA, focus management, and reduced motion baked into every component

---

## Component Hierarchy

```
index.html
└── main.tsx
    └── <StrictMode>
        └── <SettingsProvider>          ← Global preferences (localStorage)
            └── <ThemeProvider>         ← Theme resolution (CSS vars)
                └── <App>
                    ├── <Preloader>     ← Boot animation
                    ├── <CustomCursor>  ← Conditional on settings
                    ├── <Navbar>
                    │   ├── Mobile Menu (ARIA dialog)
                    │   ├── <TableOfContents>
                    │   └── <SettingsPanel>
                    │       ├── <RadioGroup>
                    │       ├── <Toggle>
                    │       └── <Slider>
                    └── <main>
                        ├── <Hero>
                        ├── <Marquee>
                        ├── <About>
                        ├── <Suspense>
                        │   ├── <Projects>   (lazy)
                        │   ├── <Skills>     (lazy)
                        │   └── <Contact>    (lazy)
                        └── <Footer>
```

---

## State Flow

```
┌─────────────────────────────────────────────────────┐
│                  SettingsProvider                     │
│                                                     │
│  UserPreferences {                                  │
│    theme: ThemeMode                                 │
│    language: SupportedLanguage                      │
│    music: MusicSettings                             │
│    effects: VisualEffects                           │
│    interfaceMode: InterfaceMode                     │
│    performanceMode: PerformanceMode                 │
│  }                                                  │
│                                                     │
│  ┌──────────┐    ┌──────────────┐                  │
│  │ setState │───>│ localStorage │  (persist)        │
│  └──────────┘    └──────────────┘                  │
│       │                                             │
│       ▼                                             │
│  ┌──────────────────────────┐                      │
│  │      ThemeProvider       │                      │
│  │  resolves system theme   │                      │
│  │  sets [data-theme] attr  │                      │
│  └──────────────────────────┘                      │
│       │                                             │
│       ▼                                             │
│  Components read via:                               │
│    useSettings()  → preferences + setters           │
│    useTheme()     → resolved theme + isDark         │
│    useTranslation() → t(), tArray(), language       │
└─────────────────────────────────────────────────────┘
```

---

## Settings System

### File: `src/contexts/SettingsContext.tsx`

### Interface

```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'id' | 'zh';
  music: { enabled: boolean; volume: number };
  effects: {
    particles: boolean;
    animations: boolean;
    blur: boolean;
    motionReduction: boolean;
    cursorEffects: boolean;
  };
  interfaceMode: 'compact' | 'comfortable' | 'large';
  performanceMode: 'full' | 'battery-saver' | 'low-gpu' | 'reduced';
}
```

### Persistence

- **Storage key:** `portfolio-settings`
- **Format:** JSON stringified `UserPreferences` object
- **Load:** On mount, reads from localStorage with fallback to defaults
- **Save:** `useEffect` persists entire object on any change
- **Error handling:** Silently falls back to defaults on parse errors or quota exceeded

### Default Detection

- **Language:** Detected from `navigator.language`, mapped to supported codes
- **Theme:** Defaults to `'light'` (not system, for predictable first paint)
- **Effects:** All enabled by default for the full premium experience

### Context API

```typescript
// Usage in any component
const { theme, language, effects, setTheme, setLanguage, ... } = useSettings();
```

---

## Theme System

### Files

- `src/contexts/ThemeContext.tsx` — Resolution logic
- `src/index.css` — CSS variable definitions under `[data-theme]`

### Resolution Pipeline

```
User selects theme
       │
       ▼
SettingsContext stores preference
       │
       ▼
ThemeContext resolves:
  'light' → 'light'
  'dark'  → 'dark'
  'system' → matchMedia('prefers-color-scheme: dark')
       │
       ▼
Apply to DOM:
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.classList.toggle('dark', isDark)
       │
       ▼
CSS variables activate:
  [data-theme='dark'] { --color-sand: #1a1a1f; ... }
```

### CSS Variables (subset)

| Variable | Light | Dark |
|----------|-------|------|
| `--color-sand` | `#faf8f5` | `#1a1a1f` |
| `--color-charcoal` | `#1a1a1a` | `#f0ede8` |
| `--color-terracotta` | `#c75b3b` | `#e8734f` |

### System Mode Listener

When theme is `'system'`, a `MediaQueryList` change listener updates the DOM attribute in real-time without requiring a page refresh.

---

## Internationalization (i18n)

### Files

- `src/i18n/index.ts` — Hook and locale registry
- `src/i18n/locales/en.ts` — English (canonical, defines `Locale` type)
- `src/i18n/locales/id.ts` — Indonesian
- `src/i18n/locales/zh.ts` — Chinese Simplified

### Architecture

```
useTranslation() hook
       │
       ├── t('key.path')      → returns string
       ├── tArray('key.path') → returns string[]
       └── language            → current locale code
              │
              ▼
        Lookup chain:
          1. locales[currentLanguage][key]
          2. locales['en'][key]  (fallback)
          3. Return key string   (last resort, + dev warning)
```

### Key Features

- **Dot-notation access:** `t('nav.home')` traverses nested objects
- **Array support:** `tArray('marquee.roles')` returns `string[]` for list rendering
- **Type safety:** All locales implement `Locale` interface from `en.ts`
- **Dev warnings:** Missing keys log to console in development mode only
- **No raw keys shown:** Fallback chain ensures users never see `nav.home` on screen

### Browser Detection

```typescript
function detectBrowserLanguage(): SupportedLanguage {
  const browserLang = navigator.language;  // e.g., 'id-ID', 'zh-CN'
  const code = browserLang.split('-')[0];  // e.g., 'id', 'zh'
  return supported.includes(code) ? code : 'en';
}
```

### Dynamic HTML Lang

```typescript
// In App.tsx
useEffect(() => {
  document.documentElement.lang = language;
}, [language]);
```

---

## Accessibility Architecture

### Skip Navigation

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only ...">
  {t('accessibility.skipToContent')}
</a>
```

### Focus Management

- **Hamburger menu:** Focus trap cycles through menu items only
- **Settings panel:** Focus contained within panel when open
- **Escape key:** Closes any open overlay (menu, settings, modals)

### ARIA Patterns

| Component | Pattern |
|-----------|---------|
| Mobile menu | `role="dialog"`, `aria-modal="true"`, `aria-label` |
| Menu items | Arrow key navigation, `role="menuitem"` |
| Toggle | `role="switch"`, `aria-checked` |
| Slider | `role="slider"`, `aria-valuemin/max/now` |
| RadioGroup | `role="radiogroup"`, `aria-checked` per option |

### Reduced Motion

- Respects `effects.motionReduction` setting in SettingsContext
- Lenis smooth scroll duration set to 0 when motion reduction active
- Framer Motion variants can check settings before animating

### Touch Targets

All interactive elements maintain minimum 44x44px touch targets on mobile, meeting WCAG 2.1 AA requirements.

---

## Performance Strategy

### Code Splitting

```typescript
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Contact = lazy(() => import('./sections/Contact'));
```

### Performance Modes

| Mode | Behavior |
|------|----------|
| `full` | All effects, particles, animations enabled |
| `battery-saver` | Reduces animation frequency, disables particles |
| `low-gpu` | Disables blur effects and WebGL |
| `reduced` | Minimal animations, no particles, no blur, no cursor effects |

### Rendering Optimizations

- `useCallback` for all setter functions in contexts
- `useMemo` for derived values (resolved theme)
- CSS-driven animations (Marquee) avoid main thread
- Conditional rendering for expensive components (CustomCursor, particles)

---

## How to Add a New Language

### Step 1: Create Locale File

```bash
cp src/i18n/locales/en.ts src/i18n/locales/fr.ts
```

Edit `fr.ts` — translate all values while keeping the same object structure:

```typescript
import type { Locale } from './en';

const fr: Locale = {
  nav: { home: '// ACCUEIL', ... },
  // ... translate all sections
};

export default fr;
```

### Step 2: Register in i18n Index

In `src/i18n/index.ts`:

```typescript
import fr from './locales/fr';

export type SupportedLanguage = 'en' | 'id' | 'zh' | 'fr';

const locales: Record<SupportedLanguage, Locale> = { en, id, zh, fr };
```

### Step 3: Update Browser Detection

In `src/contexts/SettingsContext.tsx`:

```typescript
const supported: SupportedLanguage[] = ['en', 'id', 'zh', 'fr'];
```

### Step 4: Add Settings UI Label

In each locale file's `settings.language` section, add:

```typescript
fr: 'Fran\u00e7ais',
```

### Step 5: Update Settings Panel

In `SettingsPanel.tsx`, add the new language option to the RadioGroup.

---

## How to Add a New Setting

### Step 1: Define the Type

In `src/contexts/SettingsContext.tsx`, add to `UserPreferences`:

```typescript
export interface UserPreferences {
  // ...existing
  newSetting: 'option-a' | 'option-b';
}
```

### Step 2: Set Default

In `getDefaultPreferences()`:

```typescript
return {
  // ...existing
  newSetting: 'option-a',
};
```

### Step 3: Add Setter

```typescript
const setNewSetting = useCallback((newSetting: ...) => {
  setPreferences((prev) => ({ ...prev, newSetting }));
}, []);
```

Add to the context value and `SettingsContextValue` interface.

### Step 4: Handle in Load

In `loadPersistedSettings()`, add fallback:

```typescript
newSetting: parsed.newSetting ?? defaults.newSetting,
```

### Step 5: Add UI Control

In `SettingsPanel.tsx`, add appropriate UI (RadioGroup, Toggle, or Slider) in the settings panel JSX.

### Step 6: Add Translation Keys

Add labels to all locale files under `settings.newSetting`.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Custom i18n over i18next | ~80 lines vs 40KB+ bundle; full type safety |
| CSS variables over CSS-in-JS | Zero runtime cost for theme switches |
| Context API over Zustand/Redux | Minimal state, no need for middleware |
| Single localStorage key | Atomic reads/writes, simpler migration |
| English as canonical type | TypeScript catches missing translations at build time |
| Browser detection over GeoIP | Privacy-first, no external API calls |
| Framer Motion for UI, GSAP for scroll | Best tool for each job |
