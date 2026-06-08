import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from '../components/Magnetic';
import { premiumEase } from '../components/Section';
import { WebGLBackground } from '../components/WebGLBackground';
import { useTranslation } from '../i18n/index';
import { useSettings } from '../contexts/SettingsContext';

// Animated counter hook
const useCounter = (target: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
  const { t } = useTranslation();
  const { effects } = useSettings();

  const shouldAnimate = effects.animations && !effects.motionReduction;

  const years = useCounter(2, 1800, 2200);
  const organization = useCounter(15, 2000, 2400);
  const projects = useCounter(7, 2300, 2600);
  const counters = [years, organization, projects];

  const stats = [
    { suffix: '+', label: t('hero.stats.yearsExp') },
    { suffix: '+', label: t('hero.stats.organizations') },
    { suffix: '+', label: t('hero.stats.projects') },
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
      {effects.particles && <WebGLBackground />}
      <div className="noise-overlay z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sage/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 pt-28 pb-40 max-w-6xl mx-auto w-full">

        {/* Kicker */}
        {shouldAnimate ? (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: premiumEase }}
            className="text-[10px] md:text-xs font-hud text-terracotta tracking-[0.4em] uppercase mb-6 block"
          >
            {t('hero.kicker')}
          </motion.span>
        ) : (
          <span className="text-[10px] md:text-xs font-hud text-terracotta tracking-[0.4em] uppercase mb-6 block">
            {t('hero.kicker')}
          </span>
        )}

        {/* Giant Headline */}
        <h1 className="flex flex-col items-center" style={{ perspective: 1000 }}>
          {shouldAnimate ? (
            <>
              <motion.span
                initial={{ opacity: 0, y: 60, rotateX: -20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, delay: 1.0, ease: premiumEase }}
                className="text-fluid-hero-sm font-display italic text-charcoal-light tracking-tight block transform-style-3d"
              >
                {t('hero.headlineWhere')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 80, rotateX: -25, filter: 'blur(15px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, delay: 1.15, ease: premiumEase }}
                className="text-fluid-hero font-display font-medium text-charcoal tracking-tighter block leading-none transform-style-3d"
              >
                {t('hero.headlineCreativity')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 80, rotateX: -25, filter: 'blur(15px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, delay: 1.3, ease: premiumEase }}
                className="text-fluid-hero font-display font-medium text-charcoal tracking-tighter block leading-none transform-style-3d"
              >
                {t('hero.headlineMeetsTechnology')}
              </motion.span>
            </>
          ) : (
            <>
              <span className="text-fluid-hero-sm font-display italic text-charcoal-light tracking-tight block">
                {t('hero.headlineWhere')}
              </span>
              <span className="text-fluid-hero font-display font-medium text-charcoal tracking-tighter block leading-none">
                {t('hero.headlineCreativity')}
              </span>
              <span className="text-fluid-hero font-display font-medium text-charcoal tracking-tighter block leading-none">
                {t('hero.headlineMeetsTechnology')}
              </span>
            </>
          )}
        </h1>

        {/* Description */}
        {shouldAnimate ? (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.5, ease: premiumEase }}
            className="text-sm md:text-base lg:text-lg text-charcoal-light max-w-2xl font-sans leading-relaxed mt-8 md:mt-10"
          >
            {t('hero.description')}
          </motion.p>
        ) : (
          <p className="text-sm md:text-base lg:text-lg text-charcoal-light max-w-2xl font-sans leading-relaxed mt-8 md:mt-10">
            {t('hero.description')}
          </p>
        )}

        {/* CTAs */}
        {shouldAnimate ? (
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
                <span className="relative z-10">{t('hero.ctaProjects')}</span>
              </button>
            </Magnetic>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative font-hud text-xs text-charcoal-light hover:text-terracotta transition-all duration-300 tracking-widest uppercase bg-transparent border-none cursor-none group"
              data-cursor="magnetic"
            >
              <span>{t('hero.ctaContact')}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-terracotta group-hover:w-full transition-all duration-300" />
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <Magnetic range={0.15}>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative cursor-none bg-charcoal text-sand font-hud text-xs tracking-widest px-10 py-4.5 rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-terracotta"
                data-cursor="grow"
              >
                <span className="relative z-10">{t('hero.ctaProjects')}</span>
              </button>
            </Magnetic>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative font-hud text-xs text-charcoal-light hover:text-terracotta transition-all duration-300 tracking-widest uppercase bg-transparent border-none cursor-none group"
              data-cursor="magnetic"
            >
              <span>{t('hero.ctaContact')}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-terracotta group-hover:w-full transition-all duration-300" />
            </button>
          </div>
        )}
      </div>

      {/* Stats strip */}
      {shouldAnimate ? (
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
      ) : (
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-charcoal/5">
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
        </div>
      )}

      {/* Scroll indicator */}
      {shouldAnimate ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="absolute bottom-22 md:bottom-27 z-10 flex flex-col items-center space-y-2 cursor-none select-none"
          onClick={handleScrollDown}
          data-cursor="magnetic"
          role="button"
          aria-label={t('accessibility.scrollDown')}
        >
          <div className="w-5 h-8 border border-charcoal/20 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-0.5 h-1.5 bg-terracotta/60 rounded-full"
            />
          </div>
        </motion.div>
      ) : (
        <div
          className="absolute bottom-22 md:bottom-27 z-10 flex flex-col items-center space-y-2 cursor-none select-none"
          onClick={handleScrollDown}
          data-cursor="magnetic"
          role="button"
          aria-label={t('accessibility.scrollDown')}
        >
          <div className="w-5 h-8 border border-charcoal/20 rounded-full flex justify-center p-1">
            <div className="w-0.5 h-1.5 bg-terracotta/60 rounded-full" />
          </div>
        </div>
      )}
    </section>
  );
};
