import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Marquee } from './components/Marquee';
import { Magnetic } from './components/Magnetic';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TextReveal, premiumEase } from './components/Section';
import { useSettings } from './contexts/SettingsContext';
import { useTranslation } from './i18n/index';

import { NotFound } from './sections/NotFound';

// Lazy loaded components for performance
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Contact = lazy(() => import('./sections/Contact'));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { effects } = useSettings();
  const { t, tArray, language } = useTranslation();

  // Set document language attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // Basic client-side routing check
    if (window.location.pathname !== '/') {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    if (isLoading) return;

    // Initialize Lenis smooth scroll (respect reduced motion)
    const lenis = new Lenis({
      duration: effects.motionReduction ? 0 : 1.2,
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
  }, [isLoading, effects.motionReduction]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isNotFound) {
    return <NotFound />;
  }

  const marqueeRoles = tArray('marquee.roles');
  const marqueeSkills = tArray('marquee.skills');

  return (
    <>
      {/* Cinematic Boot preloader */}
      <Preloader onComplete={() => setIsLoading(false)} />

      {/* Mount application only after preloader finishes */}
      {!isLoading && (
        <div className="relative text-charcoal min-h-screen bg-sand selection:bg-terracotta/20 selection:text-charcoal">
          {/* Custom spring cursors - conditional */}
          {effects.cursorEffects && <CustomCursor />}

          {/* Skip to content link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-sand focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
          >
            {t('accessibility.skipToContent')}
          </a>

          {/* Floating navigation pill */}
          <Navbar />

          {/* Main sections container */}
          <main id="main-content" className="relative z-10 w-full overflow-hidden">
            <Hero />
            
            {/* Marquee divider: Hero → About */}
            <div className="py-6 md:py-8">
              <Marquee 
                items={marqueeRoles}
                speed={35}
              />
            </div>

            <About />

            {/* Gradient divider */}
            <div className="section-divider mx-auto w-full max-w-5xl" />

            <Suspense fallback={<div className="h-[40vh] w-full flex items-center justify-center text-charcoal-light font-hud text-[10px] tracking-widest uppercase animate-pulse">{t('accessibility.initializing')}</div>}>
              <Projects />

              {/* Marquee divider: Projects → Skills */}
              <div className="py-6 md:py-8">
                <Marquee 
                  items={marqueeSkills}
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

          {/* Premium Footer */}
          <footer className="relative z-10 bg-sand-alt overflow-hidden">
            <div className="noise-overlay" />
            <div className="section-divider w-full" />
            
            {/* Large closing CTA area */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[100px] pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: premiumEase }}
                className="relative z-10 flex flex-col items-center"
              >
                <span className="text-xs font-hud text-terracotta tracking-[0.3em] uppercase mb-6">
                  {t('footer.readyLabel')}
                </span>
                
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-medium text-charcoal tracking-tight leading-tight mb-8">
                  <TextReveal text={t('footer.title')} className="block" />
                  <span className="italic text-charcoal-light">
                    <TextReveal text={t('footer.titleSuffix')} delay={0.2} />
                  </span>
                </h2>

                <Magnetic range={0.35}>
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group bg-charcoal text-sand font-hud text-xs tracking-widest px-12 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-terracotta cursor-none relative overflow-hidden"
                    data-cursor="grow"
                  >
                    <span className="relative z-10">{t('footer.cta')}</span>
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

export default App;
