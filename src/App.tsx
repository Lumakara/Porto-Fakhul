import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { SakuraBackground } from './components/SakuraBackground';
import { Navbar } from './components/Navbar';
import { Marquee } from './components/Marquee';
import { Magnetic } from './components/Magnetic';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TextReveal, premiumEase } from './components/Section';

// Lazy loaded components for performance
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Contact = lazy(() => import('./sections/Contact'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
      {/* Cinematic Boot preloader */}
      <Preloader onComplete={() => setIsLoading(false)} />

      {/* Mount application only after preloader finishes */}
      {!isLoading && (
        <div className="relative text-white min-h-screen bg-space-black selection:bg-sakura/30 selection:text-white">
          {/* Custom spring cursors */}
          <CustomCursor />

          {/* Interactive falling sakura background */}
          <SakuraBackground />

          {/* Floating navigation pill */}
          <Navbar />

          {/* Main sections container */}
          <main className="relative z-10 w-full overflow-hidden">
            <Hero />
            
            {/* Marquee divider: Hero → About */}
            <div className="py-6 md:py-8">
              <Marquee 
                items={['CREATIVE DEVELOPER', 'MOTION DESIGNER', 'FRONTEND ARCHITECT', 'UI ENGINEER', 'TOKYO BASED', 'AVAILABLE 2026']}
                speed={35}
              />
            </div>

            <About />

            {/* Gradient divider */}
            <div className="section-divider mx-auto w-full max-w-5xl" />

            <Suspense fallback={<div className="h-[40vh] w-full flex items-center justify-center text-cyber font-hud text-[10px] tracking-widest uppercase animate-pulse">Initializing Data Core...</div>}>
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
          <footer className="relative z-10 bg-space-deep/90 overflow-hidden">
            {/* Noise overlay */}
            <div className="noise-overlay" />
            
            {/* Top gradient line */}
            <div className="section-divider w-full" />
            
            {/* Large closing CTA area */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
              {/* Aurora glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sakura/5 rounded-full blur-[150px] pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: premiumEase }}
                className="relative z-10 flex flex-col items-center"
              >
                <span className="text-xs font-hud text-cyber tracking-[0.3em] uppercase mb-6">
                  Ready to collaborate?
                </span>
                
                <h2 className="text-3xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-tight mb-8">
                  <TextReveal text="Let's create" className="block" />
                  <TextReveal text="something" className="block" delay={0.2} />
                  <span className="text-gradient-sakura">
                    <TextReveal text="extraordinary." delay={0.4} />
                  </span>
                </h2>

                <Magnetic range={0.35}>
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group bg-gradient-to-r from-sakura to-violet text-white font-hud text-xs font-bold tracking-widest px-12 py-5 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,117,151,0.2)] hover:shadow-[0_0_50px_rgba(255,117,151,0.5)] cursor-none relative overflow-hidden"
                    data-cursor="grow"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <span className="relative z-10">START A PROJECT</span>
                  </button>
                </Magnetic>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 py-8 px-6 md:px-12">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                  <span className="text-white font-bold tracking-wider text-sm font-display">桜未来</span>
                  <span className="text-gray-500 text-[10px] tracking-widest uppercase font-hud">
                    © 2026 — Designed with precision
                  </span>
                </div>

                {/* Back to top */}
                <Magnetic range={0.3}>
                  <button
                    onClick={scrollToTop}
                    className="text-[10px] font-hud text-gray-500 hover:text-sakura tracking-widest uppercase transition-colors duration-300 cursor-none flex items-center space-x-2"
                    data-cursor="magnetic"
                  >
                    <span>Back to top</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                </Magnetic>

                {/* System Specs */}
                <div className="flex items-center space-x-4 text-[10px] text-gray-500 uppercase tracking-widest font-hud">
                  <span>React + Vite + Lenis</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sakura opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sakura" />
                    </span>
                    <span className="text-sakura font-medium">Live</span>
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
