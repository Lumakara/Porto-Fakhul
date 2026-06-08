import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Sparkles } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';
import { premiumEase } from '../components/Section';
import { LazyWebGL } from '../components/LazyWebGL';
import { useLanguage } from '../contexts/LanguageContext';

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

export const Hero = () => {
  const { t } = useLanguage();
  const years = useCounter(2, 1800, 2200);
  const organization = useCounter(15, 2000, 2400);
  const projects = useCounter(7, 2300, 2600);
  const counters = [years, organization, projects];

  const stats = [
    { suffix: '+', label: t('sections.hero.yearsExp') },
    { suffix: '+', label: t('sections.hero.organizations') },
    { suffix: '+', label: t('sections.hero.projects') },
  ];

  const handleScrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background layers */}
      <LazyWebGL />
      <div className="noise-overlay z-0" />
      {/* Center radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sage/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Decorative floating icons */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
        <Code2 className="absolute top-[15%] left-[8%] w-5 h-5 text-terracotta/20 animate-float-gentle" />
        <Palette className="absolute top-[25%] right-[10%] w-6 h-6 text-sage/20 animate-float-gentle-delayed" />
        <Sparkles className="absolute bottom-[30%] left-[12%] w-4 h-4 text-gold/25 animate-float-gentle-slow" />
        <Code2 className="absolute bottom-[35%] right-[8%] w-4 h-4 text-charcoal/10 animate-float-gentle" />
        <Sparkles className="absolute top-[40%] right-[20%] w-3 h-3 text-terracotta/15 animate-float-gentle-delayed" />
        <Palette className="absolute top-[60%] left-[5%] w-5 h-5 text-sage/15 animate-float-gentle-slow" />
      </div>

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 pt-28 pb-40 max-w-6xl mx-auto w-full">

        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5, ease: premiumEase }}
          className="mb-6"
        >
          <img
            src="https://i.pravatar.cc/300?img=68"
            alt="Fakhul Rohman - Professional headshot"
            loading="lazy"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-surface shadow-lg"
          />
        </motion.div>

        {/* Kicker */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: premiumEase }}
          className="text-[10px] md:text-xs font-hud text-terracotta tracking-[0.4em] uppercase mb-6 block"
        >
{t('sections.hero.kicker')}
        </motion.span>

        {/* Giant Headline */}
        <h1 className="flex flex-col items-center" style={{ perspective: 1000 }}>
          <motion.span
            initial={{ opacity: 0, y: 60, rotateX: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, delay: 1.0, ease: premiumEase }}
            className="text-fluid-hero-sm font-display italic text-charcoal-light tracking-tight block transform-style-3d"
          >
            {t('sections.hero.where')}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 80, rotateX: -25, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 1.15, ease: premiumEase }}
            className="text-fluid-hero font-display font-medium text-charcoal tracking-tighter block leading-none transform-style-3d"
          >
            {t('sections.hero.creativity')}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 80, rotateX: -25, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 1.3, ease: premiumEase }}
            className="text-fluid-hero font-display font-medium text-charcoal tracking-tighter block leading-none transform-style-3d"
          >
            {t('sections.hero.meetsTechnology')}
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: premiumEase }}
          className="text-sm md:text-base lg:text-lg text-charcoal-light max-w-2xl font-sans leading-relaxed mt-8 md:mt-10"
        >
{t('sections.hero.description')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.7, ease: premiumEase }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10"
        >
          <Magnetic range={0.15}>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative cursor-none bg-charcoal text-sand font-hud text-xs tracking-widest px-10 py-4.5 rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-terracotta"
              data-cursor="grow"
            >
              <span className="relative z-10">{t('sections.hero.viewProjects')}</span>
            </button>
          </Magnetic>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative font-hud text-xs text-charcoal-light hover:text-terracotta transition-all duration-300 tracking-widest uppercase bg-transparent border-none cursor-none group"
            data-cursor="magnetic"
          >
            <span>{t('sections.hero.getInTouch')}</span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-terracotta group-hover:w-full transition-all duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Stats strip — bottom of viewport */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 2.1, ease: premiumEase }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-charcoal/5"
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-3 divide-x divide-charcoal/5">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 md:py-8 px-4"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-charcoal tabular-nums">
                {counters[idx]}{stat.suffix}
              </span>
              <span className="text-[9px] md:text-[10px] font-hud text-charcoal-light tracking-widest uppercase mt-1.5">
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
        className="absolute bottom-22 md:bottom-27 z-10 flex flex-col items-center space-y-2 cursor-none select-none"
        onClick={handleScrollDown}
        data-cursor="magnetic"
      >
        <div className="w-5 h-8 border border-charcoal/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-0.5 h-1.5 bg-terracotta/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
