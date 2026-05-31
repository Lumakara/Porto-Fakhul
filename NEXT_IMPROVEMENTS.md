# Next Improvements

## Performance Optimization (Lighthouse 90+ Goal)
- [ ] **Code Splitting:** Implement `React.lazy()` and `Suspense` for the `Projects` Modal and heavy UI sections that are not above the fold.
- [ ] **Asset Optimization:** Ensure any raster graphics are served in WebP or AVIF formats.
- [ ] **Font Loading:** Add `preload` tags for the `font-hud` (Space Grotesk) and `font-display` fonts to prevent layout shift and FOUT (Flash of Unstyled Text).
- [ ] **Scroll Performance:** Audit Lenis smooth scroll and Framer Motion `whileInView` listeners to ensure they aren't causing paint bottlenecks on low-end mobile devices.

## Features & Interactivity
- [ ] **Backend Contact Form:** Replace the simulated `setTimeout` in `Contact.tsx` with a real API call (e.g., Next.js API route, Resend, or Formspree).
- [ ] **WebGL / 3D Canvas:** Consider adding a lightweight Three.js/React Three Fiber background to the Hero section to solidify the "Creative Developer" branding.
- [ ] **Custom 404 Page:** Design a premium 'Not Found' page matching the site's aesthetic.

## SEO & Accessibility
- [ ] **Meta Tags:** Add a comprehensive `Helmet` or `next/head` equivalent to inject dynamic titles, descriptions, and OpenGraph/Twitter card images.
- [ ] **Semantic HTML Audit:** Verify all sections use correct `aria-labels` (specifically around the custom cursor and decorative animated elements).
- [ ] **Keyboard Navigation:** Ensure the custom Project modal is fully accessible via tab-targeting and supports the `Escape` key to close (currently partially implemented, needs rigorous testing).
