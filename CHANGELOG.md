# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-31

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
