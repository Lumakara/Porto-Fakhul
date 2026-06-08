import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useDeviceCapability } from '../lib/deviceCapability';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const { t, language } = useLanguage();
  const capability = useDeviceCapability();
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const isLow = capability === 'low';

  const statusReadouts = useMemo(() => [
    t('preloader.status1'),
    t('preloader.status2'),
    t('preloader.status3'),
    t('preloader.status4'),
    t('preloader.status5'),
    t('preloader.status6'),
    t('preloader.status7'),
  ], [language]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Fast progression for all devices - complete in under 1 second
    const intervalMs = 40;
    const minIncrement = 10;
    const maxIncrement = 20;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        const increment = Math.floor(Math.random() * maxIncrement) + minIncrement;
        return Math.min(prev + increment, 100);
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Sync status readouts with progress thresholds
    const index = Math.min(
      Math.floor((progress / 100) * statusReadouts.length),
      statusReadouts.length - 1
    );
    setStatusIdx(index);

    if (progress === 100) {
      const doneDelay = 200;
      const completeDelay = 300;
      const timeout = setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, completeDelay);
      }, doneDelay);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete, statusReadouts.length]);

  // Framer motion variants for split screen slide
  const upperCurtainVariants = {
    exit: {
      y: '-100%',
      transition: isLow ? { duration: 0.3 } : { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }
    }
  };

  const lowerCurtainVariants = {
    exit: {
      y: '100%',
      transition: isLow ? { duration: 0.3 } : { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }
    }
  };

  const contentVariants = {
    exit: {
      opacity: 0,
      scale: isLow ? 1 : 0.95,
      transition: isLow ? { duration: 0.2 } : { duration: 0.4, ease: 'easeInOut' as any }
    }
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <div className="fixed inset-0 z-[99999] overflow-hidden flex flex-col justify-between font-hud">
          {/* Upper Curtain */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[50.5%] bg-sand border-b border-charcoal/5 flex flex-col justify-end items-center pb-8"
            variants={upperCurtainVariants}
            exit="exit"
          />

          {/* Lower Curtain */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[50.5%] bg-sand border-t border-charcoal/5 flex flex-col justify-start items-center pt-8"
            variants={lowerCurtainVariants}
            exit="exit"
          />

          {/* Floating auroras */}
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-terracotta/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-sage/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Foreground content - needs absolute positioning in the screen center */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-[100000] pointer-events-none"
            variants={contentVariants}
            exit="exit"
          >
            {/* Logo */}
            <div className="mb-8 relative">
              <span className="text-4xl md:text-5xl font-display font-medium text-charcoal tracking-[0.25em] pl-[0.25em] uppercase select-none">
                {t('preloader.logo')}
              </span>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.5em] text-charcoal-light font-medium select-none uppercase opacity-80">
                {t('preloader.logoSub')}
              </span>
            </div>

            {/* Main Counter */}
            <div className="relative mb-6">
              <span className="text-8xl md:text-9xl font-display font-semibold text-charcoal tracking-tighter select-none tabular-nums">
                {progress.toString().padStart(3, '0')}
              </span>
              <span className="absolute -top-1 -right-4 text-xs font-hud text-terracotta uppercase tracking-widest">
                {t('preloader.init')}
              </span>
            </div>

            {/* Status readouts with indicator */}
            <div className="max-w-[400px] w-full flex flex-col items-center">
              <div className="w-full bg-charcoal/5 border border-charcoal/5 h-[4px] rounded-full overflow-hidden mb-4 p-[1px]">
                <motion.div 
                  className="bg-charcoal h-full rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center space-x-2 text-[10px] text-charcoal-light select-none tracking-widest uppercase font-medium h-[15px] font-hud">
                <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-ping" />
                <span>{statusReadouts[statusIdx]}</span>
              </div>
            </div>
          </motion.div>

          {/* Top/Bottom borders */}
          <div className="absolute top-4 left-4 right-4 flex justify-between text-[9px] tracking-wider text-charcoal-light z-[100001] select-none pointer-events-none">
            <span>{t('preloader.topLeft')}</span>
            <span>{t('preloader.topRight')}</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[9px] tracking-wider text-charcoal-light z-[100001] select-none pointer-events-none">
            <span>{t('preloader.bottomLeft')}</span>
            <span>{t('preloader.bottomRight')}</span>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
