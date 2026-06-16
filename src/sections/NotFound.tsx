import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';
import { premiumEase } from '../components/Section';
import { CustomCursor } from '../components/CustomCursor';
import { Magnetic } from '../components/Magnetic';
import { useLanguage } from '../contexts/LanguageContext';

export const NotFound = () => {
  const { t } = useLanguage();
  const [showLogs, setShowLogs] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    path: '',
    time: '',
    reason: '',
    userAgent: ''
  });

  useEffect(() => {
    // Get query params
    const searchParams = new URLSearchParams(window.location.search);
    const customReason = searchParams.get('reason') || '';
    
    setErrorDetails({
      path: window.location.pathname,
      time: new Date().toISOString(),
      reason: customReason,
      userAgent: navigator.userAgent
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-sand text-charcoal flex flex-col items-center justify-center overflow-hidden selection:bg-terracotta/20 selection:text-charcoal px-4 py-16">
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
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        <div className="mb-8 w-16 h-16 rounded-full bg-surface border border-charcoal/10 flex items-center justify-center shadow-sm">
          <Compass className="w-6 h-6 text-terracotta" />
        </div>

        <span className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase block mb-6">
          Error 404
        </span>

        <h1 className="text-5xl md:text-7xl font-display font-medium text-charcoal tracking-tight mb-6 leading-none">
          {t('errorPages.notFound.title')}{' '}
          <span className="italic font-light text-charcoal-light">{t('errorPages.notFound.titleItalic')}</span>
        </h1>

        <p className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed mb-8 max-w-md">
          {t('errorPages.notFound.subtitle')}
        </p>

        {/* Dynamic Diagnostics Panel */}
        <div className="w-full bg-surface/50 border border-charcoal/10 rounded-xl p-5 mb-8 text-left font-hud text-xs text-charcoal shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-4">
            <span className="font-semibold tracking-wider text-charcoal-light flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-terracotta" />
              {t('errorPages.notFound.detailsTitle')}
            </span>
            <span className="text-[10px] text-terracotta animate-pulse font-medium">SYSTEM_ALERT_ACTIVE</span>
          </div>
          
          <div className="space-y-2.5 font-hud">
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-charcoal/[0.03] pb-1.5">
              <span className="text-charcoal-light tracking-wide uppercase text-[10px]">{t('errorPages.notFound.requestPath')}:</span>
              <span className="font-mono text-terracotta break-all text-[11px] mt-0.5 sm:mt-0">{errorDetails.path || '/'}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-charcoal/[0.03] pb-1.5">
              <span className="text-charcoal-light tracking-wide uppercase text-[10px]">{t('errorPages.notFound.errorCode')}:</span>
              <span className="font-mono text-[11px] mt-0.5 sm:mt-0">ERR_ROUTE_NOT_FOUND_404</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-charcoal/[0.03] pb-1.5">
              <span className="text-charcoal-light tracking-wide uppercase text-[10px]">{t('errorPages.notFound.explanation')}:</span>
              <span className="text-charcoal font-sans text-xs mt-0.5 sm:mt-0 max-w-sm sm:text-right">
                {errorDetails.reason ? (
                  <span className="font-medium text-terracotta flex items-center sm:justify-end gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errorDetails.reason}
                  </span>
                ) : (
                  t('errorPages.notFound.explanationDetail')
                )}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-charcoal-light tracking-wide uppercase text-[10px]">Timestamp:</span>
              <span className="font-mono text-[11px] text-charcoal-light mt-0.5 sm:mt-0">{errorDetails.time}</span>
            </div>
          </div>

          {/* Toggle Log Details */}
          <div className="mt-4 pt-3 border-t border-charcoal/5">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-[10px] tracking-widest text-charcoal hover:text-terracotta font-semibold uppercase flex items-center gap-1.5 transition-colors cursor-none"
              data-cursor="magnetic"
            >
              <span>{t('errorPages.notFound.toggleLogs')}</span>
              <span className="text-terracotta font-mono font-normal">[{showLogs ? '-' : '+'}]</span>
            </button>
            
            <AnimatePresence>
              {showLogs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <pre className="mt-3 p-3 bg-charcoal text-sand rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto border border-charcoal/15 max-h-[150px] scrollbar-thin">
                    <code className="block whitespace-pre-wrap">
                      [INFO] {errorDetails.time} - Initializing client router...
                      <br />
                      [WARN] Route resolution failed for path: "{errorDetails.path}"
                      <br />
                      [ERROR] {t('errorPages.notFound.logMessage')}
                      <br />
                      [INFO] UA: {errorDetails.userAgent}
                      <br />
                      [INFO] Rendering 404 fallback page UI
                    </code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Magnetic range={0.35}>
          <a
            href="/"
            className="group flex items-center space-x-3 bg-charcoal text-sand font-hud text-xs font-medium tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:bg-terracotta cursor-none"
            data-cursor="magnetic"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('errorPages.notFound.button')}</span>
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

export default NotFound;
