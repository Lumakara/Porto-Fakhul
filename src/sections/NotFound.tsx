import { motion } from 'framer-motion';
import { Compass, ArrowLeft } from 'lucide-react';
import { premiumEase } from '../components/Section';
import { CustomCursor } from '../components/CustomCursor';
import { Magnetic } from '../components/Magnetic';

export const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-sand text-charcoal flex flex-col items-center justify-center overflow-hidden selection:bg-terracotta/20 selection:text-charcoal px-4">
      <CustomCursor />
      
      {/* Noise overlay */}
      <div className="noise-overlay z-0" />
      
      {/* Floating auroras */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-terracotta/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: premiumEase }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <div className="mb-8 w-16 h-16 rounded-full bg-surface border border-charcoal/10 flex items-center justify-center shadow-sm">
          <Compass className="w-6 h-6 text-terracotta" />
        </div>

        <span className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase block mb-6">
          Error 404
        </span>

        <h1 className="text-6xl md:text-8xl font-display font-medium text-charcoal tracking-tight mb-6 leading-none">
          Page not
          <br />
          <span className="italic font-light text-charcoal-light">found</span>
        </h1>

        <p className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed mb-12 max-w-md">
          The page you are looking for has been moved, deleted, or possibly never existed. Let's get you back on track.
        </p>

        <Magnetic range={0.35}>
          <a
            href="/"
            className="group flex items-center space-x-3 bg-charcoal text-white font-hud text-xs font-medium tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:bg-terracotta cursor-none"
            data-cursor="magnetic"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN HOME</span>
          </a>
        </Magnetic>
      </motion.div>

      {/* Decorative borders */}
      <div className="absolute top-8 left-8 right-8 flex justify-between text-[9px] tracking-wider text-charcoal-light z-[100001] select-none pointer-events-none font-hud uppercase">
        <span>Tokyo, Japan</span>
        <span>Portfolio 2026</span>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[9px] tracking-wider text-charcoal-light z-[100001] select-none pointer-events-none font-hud uppercase">
        <span>Sora Takahashi</span>
        <span>Creative Developer</span>
      </div>
    </div>
  );
};

export default NotFound;
