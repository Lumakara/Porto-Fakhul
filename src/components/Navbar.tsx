import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Radio } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../lib/motion';
import { FocusTrap } from './menu/FocusTrap';
import { TableOfContents } from './menu/TableOfContents';
import { SettingsPanel } from './menu/SettingsPanel';
import { RippleEffect } from './menu/RippleEffect';
import type { Language } from '../types';

type MenuTab = 'navigation' | 'settings';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MenuTab>('navigation');

  const { t, language, setLanguage } = useLanguage();
  const reducedMotion = useReducedMotion();

  const navItems = [
    { id: 'home', label: '// HOME' },
    { id: 'about', label: '// BLUEPRINT' },
    { id: 'projects', label: '// ARCHIVE' },
    { id: 'skills', label: '// MATRIX' },
    { id: 'contact', label: '// UPLINK' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Track active section on scroll
      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleMenuNavigate = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    // Close menu after slight delay for scroll to begin
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300);
  }, []);

  const languagePills: { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'id', label: 'ID' },
    { value: 'zh', label: 'ZH' },
  ];

  const panelVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: reducedMotion
        ? { duration: 0 }
        : { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: {
      x: '100%',
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-4 md:px-12 flex justify-center`}
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
              <span className="text-xs font-black text-terracotta group-hover:text-sage transition-colors duration-300 font-hud">FR</span>
              <div className="absolute inset-0 rounded-full border border-terracotta/10 animate-ping group-hover:border-sage/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-charcoal tracking-widest font-display">FR</span>
              <span className="text-[8px] font-hud tracking-[0.2em] text-charcoal-light group-hover:text-terracotta transition-colors duration-300">PORTFOLIO</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-2 font-hud text-xs">
            {navItems.map((item) => (
              <Magnetic key={item.id} range={0.25}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-full cursor-none transition-all duration-300 relative ${
                    activeSection === item.id 
                      ? 'text-terracotta font-bold' 
                      : 'text-charcoal-light hover:text-charcoal'
                  }`}
                  data-cursor="magnetic"
                >
                  {/* Glowing background indicator */}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-terracotta/10 rounded-full border border-terracotta/20 -z-10 shadow-[0_0_15px_rgba(198,138,124,0.1)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              </Magnetic>
            ))}
          </nav>

          {/* System status node */}
          <div className="hidden lg:flex items-center space-x-3 text-[10px] text-charcoal-light font-hud">
            <div className="flex items-center space-x-1.5 glassmorphism-cyber px-3 py-1.5 rounded-full border border-sage/20">
              <Radio className="w-3 h-3 text-sage animate-pulse" />
              <span className="text-sage font-medium tracking-wider">UPLINK_ON</span>
            </div>
          </div>

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
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[60] lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel */}
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
              className="fixed right-0 top-0 bottom-0 w-full md:max-w-[400px] bg-sand/98 backdrop-blur-xl z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              {/* Noise overlay */}
              <div className="noise-overlay rounded-l-2xl" />

              <FocusTrap active={isMobileMenuOpen} onEscape={closeMenu}>
                <div className="relative flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone/30">
                    <span className="font-hud text-xs font-medium text-charcoal-light tracking-widest uppercase">
                      {t('accessibility.mainNavigation')}
                    </span>
                    <RippleEffect className="rounded-full">
                      <button
                        onClick={closeMenu}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-stone text-charcoal cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 hover:bg-stone/30 transition-colors duration-200"
                        aria-label={t('menu.close')}
                        data-cursor="magnetic"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </RippleEffect>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex px-6 pt-4 pb-2 space-x-1" role="tablist">
                    {([
                      { id: 'navigation' as const, label: t('menu.tableOfContents') },
                      { id: 'settings' as const, label: t('menu.settings') },
                    ]).map((tab) => (
                      <button
                        key={tab.id}
                        id={`menu-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 px-4 py-2 font-hud text-xs tracking-wide rounded-lg min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'text-terracotta font-medium'
                            : 'text-charcoal-light hover:text-charcoal'
                        }`}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`menu-tabpanel-${tab.id}`}
                      >
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="menu-tab-indicator"
                            className="absolute inset-0 bg-terracotta/10 border border-terracotta/20 rounded-lg"
                            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Content area */}
                  <div
                    className="flex-1 overflow-y-auto px-6 py-4"
                    role="tabpanel"
                    id={`menu-tabpanel-${activeTab}`}
                    aria-labelledby={`menu-tab-${activeTab}`}
                  >
                    <AnimatePresence mode="wait">
                      {activeTab === 'navigation' ? (
                        <motion.div
                          key="nav-content"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                        >
                          <TableOfContents
                            activeSection={activeSection}
                            onNavigate={handleMenuNavigate}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="settings-content"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                        >
                          <SettingsPanel />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer: Quick language switcher */}
                  <div className="px-6 py-4 border-t border-stone/30">
                    <div className="flex items-center justify-center space-x-2">
                      {languagePills.map((pill) => (
                        <RippleEffect key={pill.value} className="rounded-full">
                          <button
                            onClick={() => setLanguage(pill.value)}
                            className={`px-4 py-2 rounded-full font-hud text-xs tracking-wide min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-colors duration-200 ${
                              language === pill.value
                                ? 'bg-terracotta text-white font-medium'
                                : 'bg-stone/30 text-charcoal-light hover:text-charcoal hover:bg-stone/50'
                            }`}
                            aria-label={`${t('accessibility.languageSelector')}: ${pill.label}`}
                            aria-pressed={language === pill.value}
                          >
                            {pill.label}
                          </button>
                        </RippleEffect>
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
