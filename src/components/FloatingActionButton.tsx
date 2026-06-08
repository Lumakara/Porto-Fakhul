import { useState, useCallback, lazy, Suspense } from 'react';
import { Sun, Moon, Globe, Zap, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePreferences } from '../contexts/PreferencesContext';
import type { Language, PerformanceMode } from '../types';

const AIChatbot = lazy(() => import('./AIChatbot'));

const performanceModes: PerformanceMode[] = ['full', 'battery-saver', 'low-gpu', 'reduced'];
const languages: Language[] = ['en', 'id', 'zh'];

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { preferences, setTheme, setPerformanceMode } = usePreferences();

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const next = preferences.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [preferences.theme, setTheme]);

  const handleLanguageCycle = useCallback(() => {
    const idx = languages.indexOf(language);
    const next = languages[(idx + 1) % languages.length];
    setLanguage(next);
  }, [language, setLanguage]);

  const handlePerformanceCycle = useCallback(() => {
    const idx = performanceModes.indexOf(preferences.performanceMode);
    const next = performanceModes[(idx + 1) % performanceModes.length];
    setPerformanceMode(next);
  }, [preferences.performanceMode, setPerformanceMode]);

  const handleChatOpen = useCallback(() => {
    setIsChatOpen(true);
    setIsOpen(false);
  }, []);

  const handleChatClose = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <>
      {/* Chat panel (lazy loaded) */}
      {isChatOpen && (
        <Suspense fallback={null}>
          <AIChatbot onClose={handleChatClose} />
        </Suspense>
      )}

      {/* FAB sub-buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-center gap-3">
        {/* Main FAB button */}
        <button
          onClick={toggleMenu}
          className="w-12 h-12 rounded-full bg-terracotta text-white shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
          aria-label={isOpen ? t('common.close') : t('common.open')}
          aria-expanded={isOpen}
        >
          <span
            className="transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </span>
        </button>

        {/* Sub-buttons (fan out above) */}
        <div
          className="flex flex-col items-center gap-2 transition-all duration-200 origin-bottom"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(8px)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {/* Chat */}
          <button
            onClick={handleChatOpen}
            className="group relative w-10 h-10 rounded-full bg-sand border border-charcoal/10 shadow-md flex items-center justify-center text-charcoal-light hover:text-terracotta hover:border-terracotta/30 transition-colors duration-200"
            aria-label={t('fab.chat')}
            title={t('fab.chat')}
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Performance */}
          <button
            onClick={handlePerformanceCycle}
            className="group relative w-10 h-10 rounded-full bg-sand border border-charcoal/10 shadow-md flex items-center justify-center text-charcoal-light hover:text-terracotta hover:border-terracotta/30 transition-colors duration-200"
            aria-label={t('fab.performance')}
            title={t('fab.performance')}
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Language */}
          <button
            onClick={handleLanguageCycle}
            className="group relative w-10 h-10 rounded-full bg-sand border border-charcoal/10 shadow-md flex items-center justify-center text-charcoal-light hover:text-terracotta hover:border-terracotta/30 transition-colors duration-200"
            aria-label={t('fab.language')}
            title={t('fab.language')}
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Theme */}
          <button
            onClick={handleThemeToggle}
            className="group relative w-10 h-10 rounded-full bg-sand border border-charcoal/10 shadow-md flex items-center justify-center text-charcoal-light hover:text-terracotta hover:border-terracotta/30 transition-colors duration-200"
            aria-label={t('fab.theme')}
            title={t('fab.theme')}
          >
            {preferences.theme === 'dark' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
