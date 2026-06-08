# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-06-08

### Added

- **Settings System (`src/contexts/SettingsContext.tsx`):** Full user preferences management with localStorage persistence. Supports theme mode (light/dark/system), language (en/id/zh), music (enable/volume), visual effects (particles, animations, blur, motion reduction, cursor effects), interface mode (compact/comfortable/large), and performance mode (full/battery-saver/low-gpu/reduced).
- **Theme System (`src/contexts/ThemeContext.tsx`):** Light/dark/system theme with CSS custom properties via `[data-theme]` attribute. Smooth theme transitions. System preference auto-detection with `prefers-color-scheme` media query listener.
- **Dark Mode (`src/index.css`):** Complete dark theme with deep charcoal backgrounds (`--color-sand`, `--color-charcoal` overrides), adjusted glassmorphism effects, contrast-safe accent colors, and proper color inversions for all UI elements.
- **Internationalization System (`src/i18n/`):** Full i18n with English, Indonesian (Bahasa), and Chinese Simplified. Custom `useTranslation()` hook providing `t()` for strings and `tArray()` for arrays. Browser language auto-detection on first visit. English fallback for missing keys with dev-mode console warnings.
- **Ultra Hamburger Menu (`src/components/Navbar.tsx`):** Focus trap implementation, scroll lock on open, Escape key dismissal, ARIA dialog role, backdrop blur overlay, spring-based open/close animations, arrow key navigation between menu items, touch-friendly 44px minimum targets.
- **Table of Contents (`src/components/TableOfContents.tsx`):** Expandable TOC sidebar with scroll progress bar, active section tracking via Intersection Observer, smooth scroll navigation to sections, expand/collapse animations.
- **Settings Panel (`src/components/SettingsPanel.tsx`):** Slide-in panel with full control suite including RadioGroup for theme/interface/performance/language, Toggle for visual effects, and Slider for volume control.
- **UI Component Library (`src/components/ui/`):**
  - `Toggle.tsx` — Animated toggle switch with Framer Motion, accessible labeling
  - `Slider.tsx` — Range slider with visual track fill, accessible value reporting
  - `RadioGroup.tsx` — Grouped radio options with selection animations
  - `Ripple.tsx` — Material-style ripple effect on interaction
- **Skip-to-Content Link:** Accessible skip navigation link visible on focus for keyboard users.
- **Dynamic `lang` Attribute:** Document `<html lang>` updates automatically when language changes.

### Changed

- **All sections internationalized:** Hero, About, Projects, Skills, Contact, Footer, and Preloader now use `t()` and `tArray()` from the i18n system instead of hardcoded strings.
- **Provider hierarchy (`src/main.tsx`):** App wrapped in `SettingsProvider > ThemeProvider` for global state access.
- **Navbar redesigned:** Completely rebuilt for mobile-first accessibility with ARIA-compliant dialog menu, keyboard navigation, and premium spring animations.
- **CSS architecture:** Added CSS custom properties for theming with `[data-theme='dark']` selector overrides, enabling runtime theme switching without class toggling.
- **Lenis smooth scroll:** Now respects `effects.motionReduction` setting, disabling smooth scroll when motion reduction is active.
- **Custom cursor:** Conditionally rendered based on `effects.cursorEffects` setting.

### Fixed

- **Accessibility compliance:** Added proper ARIA labels throughout all interactive elements, focus-visible indicators on all focusable elements, and reduced motion support via user settings.
- **Mobile navigation UX:** Fixed scroll bleed-through when mobile menu is open, added proper focus management, and ensured touch targets meet 44px minimum.
- **Theme persistence:** Settings including theme now correctly persist across page refreshes and browser sessions via localStorage.
- **Language detection:** Fixed edge case where unsupported browser languages would show raw translation keys instead of falling back to English.

---

## [1.0.0] - 2026-05-31

### Added

- **Motion Design Audit:** Introduced `Parallax` wrapper and globally consistent cubic-bezier easing variables (`premiumEase`, `springEase`) to `Section.tsx`.
- **Accessibility Enhancements:** Added `aria-label`, `role="button"`, and keyboard event handlers to Project cards and Modal close buttons. Added `aria-hidden` to custom cursor.
- **Formspree Integration:** Connected the `Contact.tsx` form to the Formspree API for live email delivery, replacing the simulated timeout.
- `Marquee.tsx` component utilizing pure CSS animations for seamless infinite scrolling between sections.
- Premium design tokens (`sakura`, `cyber`, `space-black`) and utility classes (`noise-overlay`, `.text-gradient-sakura`) to `index.css`.
- Dynamic gradient visual areas for Project cards to emulate high-end case study thumbnails.

### Changed

- **Performance Optimization:** Refactored `App.tsx` to use `React.lazy` and `Suspense` for heavy components (`Projects`, `Skills`, `Contact`), reducing the main bundle size.
- **Asset Optimization:** Moved Google Fonts loading from CSS `@import` to HTML `<link rel="preload">` to prevent render blocking and FOUT.
- **App Layout:** Refactored layout flow in `App.tsx` to include marquee dividers and upgraded the footer structure.
- **Hero Section:** Completely redesigned `Hero.tsx` from a split layout to a dramatic, centered typographic hero with Framer Motion entry delays and animated stat counters.
- **About Section:** Redesigned `About.tsx` to include a human-centric biographical view, location pills, and a 3-entry timeline.
- **Projects Section:** Rewrote `Projects.tsx` to use a sophisticated Bento grid (featured, standard, and horizontal card slots) instead of a uniform grid. Removed unused filter UI.
- **Skills Section:** Overhauled `Skills.tsx` to feature a strict visual hierarchy differentiating core tools (with animated progress bars) from secondary proficiencies.
- **Contact Section:** Refined `Contact.tsx` tone to be warmer and more professional while maintaining the futuristic simulated console logging effect on submit.

### Fixed

- Addressed TypeScript compilation errors regarding unused variables/imports (`TextReveal` in Hero, `isHorizontal` in Projects).
- Prevented potential animation jank by avoiding JS-based scroll loops where pure CSS was sufficient (Marquee).
