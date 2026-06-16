import { motion } from 'framer-motion';
import { Wrench, ArrowLeft } from 'lucide-react';
import { premiumEase } from '../components/Section';
import { CustomCursor } from '../components/CustomCursor';
import { Magnetic } from '../components/Magnetic';
import { useLanguage } from '../contexts/LanguageContext';

export const Maintenance = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-sand text-charcoal flex flex-col items-center justify-center overflow-hidden selection:bg-terracotta/20 selection:text-charcoal px-4">
      <CustomCursor />
      
      {/* Noise overlay */}
      <div className="noise-overlay z-0" />
      
      {/* Floating auroras */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-terracotta/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: premiumEase }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <div className="mb-8 w-16 h-16 rounded-full bg-surface border border-charcoal/10 flex items-center justify-center shadow-sm">
          <Wrench className="w-6 h-6 text-terracotta animate-pulse" />
        </div>

        <span className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase block mb-6">
          {t('errorPages.maintenance.badge')}
        </span>

        <h1 className="text-5xl md:text-7xl font-display font-medium text-charcoal tracking-tight mb-6 leading-none">
          {t('errorPages.maintenance.title')}
          <br />
          <span className="italic font-light text-charcoal-light">{t('errorPages.maintenance.titleItalic')}</span>
        </h1>

        <p className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed mb-6 max-w-md">
          {t('errorPages.maintenance.subtitle')}
        </p>

        <p className="text-xs md:text-sm text-charcoal-light/80 font-sans leading-relaxed mb-12 max-w-lg border border-charcoal/5 bg-surface/30 p-4 rounded-lg backdrop-blur-sm">
          {t('errorPages.maintenance.description')}
        </p>

        <Magnetic range={0.35}>
          <a
            href="/"
            className="group flex items-center space-x-3 bg-charcoal text-sand font-hud text-xs font-medium tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:bg-terracotta cursor-none"
            data-cursor="magnetic"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('errorPages.maintenance.button')}</span>
          </a>
        </Magnetic>
      </motion.div>

      {/* Decorative borders */}
      <div className="absolute top-8 left-8 right-8 flex justify-between text-[9px] tracking-wider text-charcoal-light z-[100001] select-none pointer-events-none font-hud uppercase">
        <span>Depok, Indonesia</span>
        <span>Portfolio 2026</span>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[9px] tracking-wider text-charcoal-light z-[100001] select-none pointer-events-none font-hud uppercase">
        <span>Fakhul Rohman</span>
        <span>Creative Developer</span>
      </div>
    </div>
  );
};

export default Maintenance;
