import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Marquee } from './components/Marquee';
import { Magnetic } from './components/Magnetic';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TextReveal, premiumEase } from './components/Section';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';
import { useReducedMotion } from './lib/motion';

import { NotFound } from './sections/NotFound';

// Lazy loaded components for performance
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Contact = lazy(() => import('./sections/Contact'));
const LazyCustomCursor = lazy(() => import('./components/CustomCursor').then(m => ({ default: m.CustomCursor })));

function ThemeApplicator() {
  const { preferences } = usePreferences();

  useEffect(() => {
    const applyTheme = (dark: boolean) => {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    };

    if (preferences.theme === 'dark') {
      applyTheme(true);
    } else if (preferences.theme === 'light') {
      applyTheme(false);
    } else {
      // System preference
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mql.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [preferences.theme]);

  return null;
}

function AppContent() {
  const shouldSkipPreloader = (): boolean => {
    try {
      if (sessionStorage.getItem('porto_visited') === 'true') return true;
    } catch {}
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    } catch {}
    return false;
  };

  const [isLoading, setIsLoading] = useState(() => !shouldSkipPreloader());
  const { preferences } = usePreferences();
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isLoading) return;

    // Skip smooth scroll for reduced motion or battery-saver/reduced modes
    const skipSmooth = reducedMotion ||
      preferences.performanceMode === 'battery-saver' ||
      preferences.performanceMode === 'reduced';
    if (skipSmooth) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isLoading, reducedMotion, preferences.performanceMode]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ThemeApplicator />
      {/* Cinematic Boot preloader */}
      {isLoading && (
        <Preloader onComplete={() => {
          setIsLoading(false);
          try { sessionStorage.setItem('porto_visited', 'true'); } catch {}
        }} />
      )}

      {/* Mount application only after preloader finishes */}
      {!isLoading && (
        <div className="relative text-charcoal min-h-screen bg-sand selection:bg-terracotta/20 selection:text-charcoal">
          {/* Custom spring cursors */}
          {preferences.visualEffects.cursorEffects && preferences.performanceMode !== 'battery-saver' && preferences.performanceMode !== 'reduced' && (
            <Suspense fallback={null}><LazyCustomCursor /></Suspense>
          )}

          {/* Floating navigation pill */}
          <Navbar />

          {/* Main sections container */}
          <main className="relative z-10 w-full overflow-hidden">
            <Hero />
            
            {/* Marquee divider: Hero → About */}
            <div className="py-6 md:py-8">
              <Marquee 
                items={['CREATIVE DEVELOPER', 'MOTION DESIGNER', 'FRONTEND ARCHITECT', 'UI ENGINEER', 'DEPOK BASED', 'AVAILABLE 2026']}
                speed={35}
              />
            </div>

            <About />

            {/* Gradient divider */}
            <div className="section-divider mx-auto w-full max-w-5xl" />

            <Suspense fallback={<div className="h-[40vh] w-full flex items-center justify-center text-charcoal-light font-hud text-[10px] tracking-widest uppercase animate-pulse">{t('common.loading')}</div>}>
              <Projects />

              {/* Marquee divider: Projects → Skills */}
              <div className="py-6 md:py-8">
                <Marquee 
                  items={['REACT', 'TYPESCRIPT', 'NEXT.JS', 'FRAMER MOTION', 'GSAP', 'TAILWIND CSS', 'THREE.JS', 'NODE.JS', 'FIGMA']}
                  speed={25}
                  direction="right"
                />
              </div>

              <Skills />

              {/* Gradient divider */}
              <div className="section-divider mx-auto w-full max-w-5xl" />

              <Contact />
            </Suspense>
          </main>

          {/* Premium Footer — Large CTA + Credits */}
          <footer className="relative z-10 bg-sand-alt overflow-hidden">
            {/* Noise overlay */}
            <div className="noise-overlay" />
            
            {/* Top gradient line */}
            <div className="section-divider w-full" />
            
            {/* Large closing CTA area */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
              {/* Soft glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[100px] pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: premiumEase }}
                className="relative z-10 flex flex-col items-center"
              >
                <span className="text-xs font-hud text-terracotta tracking-[0.3em] uppercase mb-6">
                  {t('footer.readyToCollaborate')}
                </span>
                
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-medium text-charcoal tracking-tight leading-tight mb-8">
                  <TextReveal text={t('footer.letsCreate')} className="block" />
                  <span className="italic text-charcoal-light">
                    <TextReveal text={t('footer.somethingExtraordinary')} delay={0.2} />
                  </span>
                </h2>

                <Magnetic range={0.35}>
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group bg-charcoal text-sand font-hud text-xs tracking-widest px-12 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-terracotta cursor-none relative overflow-hidden"
                    data-cursor="grow"
                  >
                    <span className="relative z-10">{t('footer.startProject')}</span>
                  </button>
                </Magnetic>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-charcoal/5 py-8 px-6 md:px-12">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                  <span className="text-charcoal font-medium tracking-wider text-sm font-display">Fakhul Rohman</span>
                  <span className="text-charcoal-light text-[10px] tracking-widest uppercase font-hud">
                    {t('footer.copyright')}
                  </span>
                </div>

                {/* Back to top */}
                <Magnetic range={0.3}>
                  <button
                    onClick={scrollToTop}
                    className="text-[10px] font-hud text-charcoal-light hover:text-terracotta tracking-widest uppercase transition-colors duration-300 cursor-none flex items-center space-x-2"
                    data-cursor="magnetic"
                  >
                    <span>{t('footer.backToTop')}</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                </Magnetic>

                {/* System Specs */}
                <div className="flex items-center space-x-4 text-[10px] text-charcoal-light uppercase tracking-widest font-hud">
                  <span>{t('footer.techStack')}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sage" />
                    </span>
                    <span className="text-sage font-medium">{t('footer.live')}</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

function AppRouter() {
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    // Basic client-side routing check
    if (window.location.pathname !== '/') {
      setIsNotFound(true);
    }
  }, []);

  if (isNotFound) {
    return <NotFound />;
  }

  return <AppContent />;
}

function App() {
  return (
    <LanguageProvider>
      <PreferencesProvider>
        <AppRouter />
      </PreferencesProvider>
    </LanguageProvider>
  );
}

export default App;
