# Porto-Fakhul

A premium, cinematic portfolio website built with React, TypeScript, and Vite. Features a futuristic design aesthetic with internationalization, theming, comprehensive accessibility, and smooth motion design.

## Features

- **Multi-language Support** — English, Bahasa Indonesia, Chinese Simplified with auto-detection
- **Theme System** — Light, Dark, and System-follow modes with smooth CSS transitions
- **Settings Panel** — Complete user preferences for theme, language, effects, performance, and interface density
- **Accessibility First** — WCAG-friendly with skip navigation, focus traps, ARIA labels, keyboard navigation, reduced motion support
- **Premium Motion Design** — Framer Motion animations, spring physics, parallax effects, scroll-triggered reveals
- **Performance Optimized** — Lazy loading, code splitting, pure CSS animations, performance modes for low-end devices
- **Responsive** — Fully responsive from 320px to 1920px+ with mobile-first hamburger menu
- **Persistent Preferences** — All user settings saved to localStorage across sessions

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12, GSAP 3 |
| 3D | Three.js, React Three Fiber |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Lumakara/Porto-Fakhul.git
cd Porto-Fakhul

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── App.tsx                    # Root app component with layout
├── main.tsx                   # Entry point with provider hierarchy
├── index.css                  # Global styles, CSS variables, themes
│
├── components/
│   ├── Navbar.tsx             # Navigation with ultra hamburger menu
│   ├── TableOfContents.tsx    # Expandable TOC with scroll tracking
│   ├── SettingsPanel.tsx      # Slide-in settings UI
│   ├── CustomCursor.tsx       # Spring-physics custom cursor
│   ├── Preloader.tsx          # Cinematic boot preloader
│   ├── Marquee.tsx            # Pure CSS infinite scroll marquee
│   ├── SakuraBackground.tsx   # Particle background effect
│   ├── WebGLBackground.tsx    # Three.js hero background
│   ├── Magnetic.tsx           # Magnetic hover effect wrapper
│   ├── Section.tsx            # Parallax, TextReveal utilities
│   └── ui/
│       ├── Toggle.tsx         # Animated toggle switch
│       ├── Slider.tsx         # Range slider with fill
│       ├── RadioGroup.tsx     # Option group selector
│       └── Ripple.tsx         # Material ripple effect
│
├── contexts/
│   ├── SettingsContext.tsx     # User preferences + localStorage
│   └── ThemeContext.tsx        # Theme resolution + CSS variables
│
├── i18n/
│   ├── index.ts               # useTranslation hook + locale loader
│   └── locales/
│       ├── en.ts              # English translations (canonical type)
│       ├── id.ts              # Indonesian translations
│       └── zh.ts              # Chinese Simplified translations
│
├── sections/
│   ├── Hero.tsx               # Full-width typographic hero
│   ├── About.tsx              # Bio, experience, approach tabs
│   ├── Projects.tsx           # Bento grid project showcase
│   ├── Skills.tsx             # Technical skills matrix
│   ├── Contact.tsx            # Contact form with console animation
│   └── NotFound.tsx           # Custom 404 page
│
└── hooks/
    └── useMousePosition.ts    # Mouse tracking hook
```

## Adding New Translations

### 1. Create a new locale file

Create `src/i18n/locales/{code}.ts` implementing the `Locale` interface:

```typescript
import type { Locale } from './en';

const fr: Locale = {
  nav: {
    home: '// ACCUEIL',
    about: '// PROFIL',
    // ... all keys from en.ts
  },
  // ... complete all sections
};

export default fr;
```

### 2. Register the locale

In `src/i18n/index.ts`:

```typescript
import fr from './locales/fr';

export type SupportedLanguage = 'en' | 'id' | 'zh' | 'fr';

const locales: Record<SupportedLanguage, Locale> = { en, id, zh, fr };
```

### 3. Update SettingsContext

In `src/contexts/SettingsContext.tsx`, add the new language code to the `detectBrowserLanguage()` supported array.

### 4. Add UI label

In each locale's `settings.language` section, add a label for the new language:

```typescript
language: {
  label: 'Language',
  en: 'English',
  id: 'Bahasa Indonesia',
  zh: 'Chinese Simplified',
  fr: 'French',  // new
}
```

## Extending Themes

### CSS Custom Properties

Themes are driven by CSS custom properties in `src/index.css`. The light theme defines base values, and `[data-theme='dark']` overrides them:

```css
/* Light (default) */
:root {
  --color-sand: #faf8f5;
  --color-charcoal: #1a1a1a;
  --color-terracotta: #c75b3b;
  /* ... */
}

/* Dark override */
[data-theme='dark'] {
  --color-sand: #1a1a1f;
  --color-charcoal: #f0ede8;
  --color-terracotta: #e8734f;
  /* ... */
}
```

### Adding a New Theme

1. Add the theme name to `ThemeMode` type in `SettingsContext.tsx`
2. Add a new `[data-theme='your-theme']` block in `index.css`
3. Update the theme resolution logic in `ThemeContext.tsx`
4. Add UI option in the Settings panel's RadioGroup

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for comprehensive system documentation including:
- Context-based state management
- i18n fallback chain
- Theme resolution pipeline
- Component hierarchy
- Performance optimization strategies

## License

This project is proprietary. All rights reserved by Fakhul Rohman.
