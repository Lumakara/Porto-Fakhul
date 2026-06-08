import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Marquee } from './components/Marquee';
import { Magnetic } from './components/Magnetic';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TextReveal, premiumEase } from './components/Section';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';
import { projectsData } from './data/projects';

import { NotFound } from './sections/NotFound';

// Lazy loaded components for performance
const Projects = lazy(() => import('./sections/Projects'));
const Contact = lazy(() => import('./sections/Contact'));
const ProjectDetail = lazy(() => import('./sections/ProjectDetail'));

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { t } = useLanguage();

  const selectedProject = selectedProjectId
    ? projectsData.find((p) => p.id === selectedProjectId) || null
    : null;

  // Lock body scroll when project detail overlay is open
  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProjectId]);

  useEffect(() => {
    if (isLoading) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isLoading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ThemeApplicator />
      {/* Cinematic Boot preloader */}
      <Preloader onComplete={() => setIsLoading(false)} />

      {/* Project Detail Full-Page View */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-sand flex items-center justify-center text-charcoal-light font-hud text-[10px] tracking-widest uppercase animate-pulse">{t('common.loading')}</div>}>
            <ProjectDetail
              project={selectedProject}
              onBack={() => setSelectedProjectId(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Mount application only after preloader finishes */}
      {!isLoading && (
        <div className="relative text-charcoal min-h-screen bg-sand selection:bg-terracotta/20 selection:text-charcoal">
          {/* Custom spring cursors */}
          <CustomCursor />

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
              <Projects onSelectProject={(id) => setSelectedProjectId(id)} />

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
