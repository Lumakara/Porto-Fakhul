import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from '../components/Magnetic';
import { premiumEase, springEase, Parallax } from '../components/Section';

// Animated counter hook
const useCounter = (target: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
};

const stats = [
  { value: 6, suffix: '+', label: 'YEARS EXP' },
  { value: 40, suffix: '+', label: 'PROJECTS' },
  { value: 15, suffix: '+', label: 'CLIENTS' },
  { value: 99, suffix: '%', label: 'ON TIME' },
];

export const Hero = () => {
  const years = useCounter(6, 1800, 2200);
  const projects = useCounter(40, 2000, 2400);
  const clients = useCounter(15, 1800, 2600);
  const ontime = useCounter(99, 2200, 2800);
  const counters = [years, projects, clients, ontime];

  const handleScrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background layers */}
      <Parallax offset={60} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-sakura opacity-50" />
      </Parallax>
      <Parallax offset={120} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-cyber opacity-30" />
      </Parallax>
      <Parallax offset={180} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-8" />
      </Parallax>
      <div className="noise-overlay z-0" />
      {/* Center radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sakura/5 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 pt-28 pb-40 max-w-6xl mx-auto w-full">
        
        {/* Availability pill */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: springEase }}
          className="flex items-center space-x-2.5 bg-space-card/60 border border-sakura/20 px-5 py-2 rounded-full mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[10px] md:text-xs font-hud text-gray-300 font-medium tracking-widest uppercase">
            Available for work — 2026
          </span>
        </motion.div>

        {/* Kicker */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: premiumEase }}
          className="text-[10px] md:text-xs font-hud text-cyber tracking-[0.4em] uppercase mb-6 block"
        >
          [ Creative Developer & Motion Designer ]
        </motion.span>

        {/* Giant Headline */}
        <h1 className="flex flex-col items-center" style={{ perspective: 1000 }}>
          <motion.span
            initial={{ opacity: 0, y: 60, rotateX: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, delay: 1.0, ease: premiumEase }}
            className="text-fluid-hero-sm font-display font-light text-gray-500 tracking-tight block transform-style-3d"
          >
            I Build
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 80, rotateX: -25, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 1.15, ease: premiumEase }}
            className="text-fluid-hero font-display font-black text-white tracking-tighter block leading-none transform-style-3d"
          >
            Digital
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 80, rotateX: -25, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 1.3, ease: premiumEase }}
            className="text-fluid-hero font-display font-black text-gradient-sakura tracking-tighter block leading-none transform-style-3d"
          >
            Experiences
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: premiumEase }}
          className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl font-sans leading-relaxed mt-8 md:mt-10"
        >
          Crafting premium interfaces, creative motion systems & immersive web experiences from Tokyo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.7, ease: premiumEase }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10"
        >
          <Magnetic range={0.3}>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative cursor-none bg-gradient-to-r from-sakura to-violet text-white font-hud text-xs font-bold tracking-widest px-10 py-4.5 rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(255,117,151,0.25)] hover:shadow-[0_0_50px_rgba(255,117,151,0.5)]"
              data-cursor="grow"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <span className="relative z-10">VIEW PROJECTS</span>
            </button>
          </Magnetic>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative font-hud text-xs text-gray-400 hover:text-cyber transition-all duration-300 tracking-widest uppercase bg-transparent border-none cursor-none group"
            data-cursor="magnetic"
          >
            <span>Get in touch</span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyber group-hover:w-full transition-all duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Stats strip — bottom of viewport */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 2.1, ease: premiumEase }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 md:py-8 px-4"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-white tabular-nums">
                {counters[idx]}{stat.suffix}
              </span>
              <span className="text-[9px] md:text-[10px] font-hud text-gray-500 tracking-widest uppercase mt-1.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.8 }}
        className="absolute bottom-28 md:bottom-32 z-10 flex flex-col items-center space-y-2 cursor-none select-none"
        onClick={handleScrollDown}
        data-cursor="magnetic"
      >
        <div className="w-5 h-8 border border-gray-600/50 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-0.5 h-1.5 bg-sakura/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
