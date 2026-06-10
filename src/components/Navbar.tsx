import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useLanguage } from '../contexts/LanguageContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { useReducedMotion } from '../lib/motion';
import { FocusTrap } from './menu/FocusTrap';
import type { Language, Theme } from '../types';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { t, language, setLanguage } = useLanguage();
  const { preferences, setTheme } = usePreferences();
  const reducedMotion = useReducedMotion();

  const navItems = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'about', labelKey: 'nav.about' },
    { id: 'projects', labelKey: 'nav.projects' },
    { id: 'contact', labelKey: 'nav.contact' },
  ];

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);

        const sections = ['home', 'about', 'projects', 'contact'];
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'id', label: 'ID' },
    { value: 'zh', label: 'ZH' },
  ];

  const themeOptions: { value: Theme; icon: typeof Sun }[] = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'system', icon: Monitor },
  ];

  // Dropdown that unfolds downward from just beneath the header capsule.
  const panelVariants = {
    hidden: { y: -16, opacity: 0, scale: 0.96 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: reducedMotion
        ? { duration: 0 }
        : { type: 'spring' as const, stiffness: 360, damping: 30 },
    },
    exit: {
      y: -12,
      opacity: 0,
      scale: 0.97,
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reducedMotion ? { duration: 0 } : { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: reducedMotion ? { duration: 0 } : { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-4 md:px-12 flex justify-center"
      >
        {/* Glass Nav capsule */}
        <div
          className={`w-full max-w-7xl flex items-center justify-between transition-all duration-500 px-6 py-3 rounded-full ${
            isScrolled
              ? 'glassmorphism border border-charcoal/5 bg-sand/80 shadow-lg backdrop-blur-md'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 text-left bg-transparent border-none outline-none group cursor-none"
            data-cursor="magnetic"
          >
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full border border-terracotta/30 group-hover:border-sage/50 transition-colors duration-300">
              <span className="text-xs font-black text-terracotta group-hover:text-sage transition-colors duration-300 font-hud">
                FR
              </span>
            </div>
            <span className="text-sm font-black text-charcoal tracking-widest font-display">
              FR
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-hud text-sm">
            {navItems.map((item) => (
              <Magnetic key={item.id} range={0.25}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-full cursor-none transition-all duration-300 relative ${
                    activeSection === item.id
                      ? 'text-terracotta font-medium'
                      : 'text-charcoal-light hover:text-charcoal'
                  }`}
                  data-cursor="magnetic"
                >
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-terracotta/10 rounded-full border border-terracotta/20 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{t(item.labelKey)}</span>
                </button>
              </Magnetic>
            ))}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glassmorphism border border-charcoal/10 text-charcoal cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            data-cursor="magnetic"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={t('accessibility.menuToggle')}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Screen reader live region for menu state announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isMobileMenuOpen ? t('menu.open') : ''}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - light scrim, keeps page visible behind the dropdown */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-charcoal/10 backdrop-blur-[2px] z-[60] lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel - dropdown that unfolds from beneath the header capsule */}
            <motion.div
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t('accessibility.mainNavigation')}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                transformOrigin: 'top right',
                top: 'calc(env(safe-area-inset-top, 0px) + 5.25rem)',
              }}
              className="fixed left-4 right-4 sm:left-auto z-[70] lg:hidden w-auto sm:w-[340px] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-7rem)] rounded-2xl bg-sand/98 backdrop-blur-xl shadow-2xl border border-charcoal/10 overflow-hidden flex flex-col"
            >
              {/* Up-pointing caret aimed at the hamburger toggle */}
              <span
                aria-hidden="true"
                className="absolute -top-1.5 right-6 w-3 h-3 rotate-45 bg-sand/98 border-l border-t border-charcoal/10"
              />

              <FocusTrap active={isMobileMenuOpen} onEscape={closeMenu}>
                <div className="relative flex flex-col min-h-0 overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    <span className="font-hud text-[10px] font-medium text-charcoal-light tracking-widest uppercase">
                      {t('accessibility.mainNavigation')}
                    </span>
                    <button
                      onClick={closeMenu}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-charcoal/10 text-charcoal cursor-none focus-visible:ring-2 focus-visible:ring-terracotta hover:bg-stone/30 transition-colors duration-200"
                      aria-label={t('menu.close')}
                      data-cursor="magnetic"
                      data-sound="click"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Navigation Links - stacked rows with active indicator */}
                  <nav className="px-3 pb-3" aria-label={t('accessibility.mainNavigation')}>
                    <ul className="flex flex-col gap-1">
                      {navItems.map((item, i) => {
                        const isActive = activeSection === item.id;
                        return (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={
                              reducedMotion
                                ? { duration: 0 }
                                : { delay: 0.04 + i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                            }
                          >
                            <button
                              onClick={() => handleNavClick(item.id)}
                              data-sound="click"
                              className={`group w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 min-h-[48px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                                isActive
                                  ? 'bg-terracotta/10 border border-terracotta/25 text-terracotta font-medium'
                                  : 'text-charcoal-light hover:text-charcoal border border-transparent hover:bg-stone/30'
                              }`}
                              data-cursor="magnetic"
                              aria-current={isActive ? 'true' : undefined}
                            >
                              <span
                                className={`flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                  isActive ? 'bg-terracotta scale-100' : 'bg-charcoal/20 scale-75 group-hover:bg-charcoal/40'
                                }`}
                              />
                              <span className="font-hud text-sm tracking-wide flex-1">{t(item.labelKey)}</span>
                              <span className="font-mono text-[10px] text-charcoal-light/40 tabular-nums">
                                0{i + 1}
                              </span>
                            </button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* Footer: Theme + Language in one compact row */}
                  <div className="px-4 pb-4 flex items-center justify-between gap-3 border-t border-stone/30 pt-3">
                    <div className="flex items-center gap-1">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            data-sound="click"
                            className={`flex items-center justify-center w-8 h-8 rounded-full cursor-none focus-visible:ring-2 focus-visible:ring-terracotta transition-colors duration-200 ${
                              preferences.theme === option.value
                                ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                                : 'text-charcoal-light hover:text-charcoal hover:bg-stone/30'
                            }`}
                            aria-label={`${t('settings.theme.title')}: ${t(`settings.theme.${option.value}`)}`}
                            aria-pressed={preferences.theme === option.value}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {languageOptions.map((pill) => (
                        <button
                          key={pill.value}
                          onClick={() => setLanguage(pill.value)}
                          data-sound="click"
                          className={`px-2.5 py-1.5 rounded-full font-hud text-xs tracking-wide cursor-none focus-visible:ring-2 focus-visible:ring-terracotta transition-colors duration-200 ${
                            language === pill.value
                              ? 'bg-terracotta text-white font-medium'
                              : 'bg-stone/30 text-charcoal-light hover:text-charcoal hover:bg-stone/50'
                          }`}
                          aria-label={`${t('accessibility.languageSelector')}: ${pill.label}`}
                          aria-pressed={language === pill.value}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FocusTrap>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
