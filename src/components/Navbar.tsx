import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, BookOpen } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { TableOfContents } from './TableOfContents';
import { SettingsPanel } from './SettingsPanel';
import { useTranslation } from '../i18n/index';

export const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Focus trap refs
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const navItems = [
    { id: 'home', key: 'nav.home' },
    { id: 'about', key: 'nav.about' },
    { id: 'projects', key: 'nav.projects' },
    { id: 'skills', key: 'nav.skills' },
    { id: 'contact', key: 'nav.contact' },
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

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

  // Scroll lock when menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Focus trap
  useEffect(() => {
    if (!isMobileMenuOpen || !drawerRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !drawerRef.current) return;

      const focusableElements = drawerRef.current.querySelectorAll(focusableSelector);
      const firstFocusable = focusableElements[0] as HTMLElement | undefined;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;

      if (!firstFocusable || !lastFocusable) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isMobileMenuOpen]);

  // Escape key closes menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Arrow key navigation within drawer
  useEffect(() => {
    if (!isMobileMenuOpen || !drawerRef.current) return;

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      if (!drawerRef.current) return;

      const buttons = Array.from(
        drawerRef.current.querySelectorAll('[data-nav-item]')
      ) as HTMLElement[];
      if (buttons.length === 0) return;

      const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);
      let nextIndex: number;

      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
      }

      e.preventDefault();
      buttons[nextIndex].focus();
    };

    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    // Return focus to toggle button
    setTimeout(() => toggleButtonRef.current?.focus(), 100);
  }, []);

  const handleNavClick = useCallback((id: string) => {
    closeMobileMenu();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  }, [closeMobileMenu]);

  const openSettings = useCallback(() => {
    closeMobileMenu();
    setIsSettingsOpen(true);
  }, [closeMobileMenu]);

  // Staggered item animation variants
  const drawerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15 } },
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
              <span className="text-xs font-black text-terracotta group-hover:text-sage transition-colors duration-300 font-hud">FR</span>
              <div className="absolute inset-0 rounded-full border border-terracotta/10 animate-ping group-hover:border-sage/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-charcoal tracking-widest font-display">FR</span>
              <span className="text-[8px] font-hud tracking-[0.2em] text-charcoal-light group-hover:text-terracotta transition-colors duration-300">
                {t('nav.portfolio')}
              </span>
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
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-terracotta/10 rounded-full border border-terracotta/20 -z-10 shadow-[0_0_15px_rgba(198,138,124,0.1)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{t(item.key)}</span>
                </button>
              </Magnetic>
            ))}
          </nav>

          {/* Desktop system status node */}
          <div className="hidden lg:flex items-center space-x-3 text-[10px] text-charcoal-light font-hud">
            <div className="flex items-center space-x-1.5 glassmorphism-cyber px-3 py-1.5 rounded-full border border-sage/20">
              <BookOpen className="w-3 h-3 text-sage animate-pulse" />
              <span className="text-sage font-medium tracking-wider">{t('nav.status')}</span>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            ref={toggleButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full glassmorphism border border-charcoal/10 text-charcoal cursor-none min-w-[44px] min-h-[44px]"
            data-cursor="magnetic"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-charcoal/20 backdrop-blur-sm lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ opacity: 0, y: '-5%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-5%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label={t('accessibility.openMenu')}
              className="fixed inset-0 z-40 bg-sand/98 backdrop-blur-xl flex flex-col px-6 pt-24 pb-8 lg:hidden overflow-y-auto"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[15%] left-[10%] w-[250px] h-[250px] bg-terracotta/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] bg-sage/5 rounded-full blur-[80px]" />
              </div>

              {/* Drawer content */}
              <motion.div
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative flex flex-col gap-6 flex-1"
              >
                {/* Table of Contents */}
                <motion.div variants={itemVariants}>
                  <TableOfContents
                    activeSection={activeSection}
                    onNavigate={handleNavClick}
                  />
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="w-full h-px bg-stone/50" />

                {/* Navigation items */}
                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      data-nav-item
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-hud text-lg tracking-wider transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 ${
                        activeSection === item.id
                          ? 'text-terracotta font-bold bg-terracotta/5'
                          : 'text-charcoal-light hover:text-charcoal hover:bg-stone/20'
                      }`}
                    >
                      {t(item.key)}
                    </button>
                  ))}
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="w-full h-px bg-stone/50" />

                {/* Settings button */}
                <motion.div variants={itemVariants}>
                  <button
                    onClick={openSettings}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-hud text-sm tracking-wide text-charcoal-light hover:text-charcoal hover:bg-stone/20 transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t('settings.title')}</span>
                  </button>
                </motion.div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-[10px] text-charcoal-light font-hud tracking-widest uppercase"
                >
                  <span className="text-sage">{t('nav.mobileLocation')}</span>
                  <span className="mt-1">{t('nav.mobileRole')}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
