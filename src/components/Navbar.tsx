import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Radio } from 'lucide-react';
import { Magnetic } from './Magnetic';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Use native scrollIntoView; Lenis will automatically intercept and smooth it out!
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
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

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glassmorphism border border-charcoal/10 text-charcoal cursor-none"
            data-cursor="magnetic"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-sand/98 z-40 flex flex-col justify-center items-center px-6 lg:hidden"
          >
            {/* Background overlay */}
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-terracotta/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col space-y-6 text-center font-hud">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-2xl font-bold tracking-wider relative cursor-none ${
                    activeSection === item.id 
                      ? 'text-terracotta' 
                      : 'text-charcoal-light hover:text-charcoal'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            
            {/* Drawer Footer details */}
            <div className="absolute bottom-8 flex flex-col items-center text-[10px] text-charcoal-light font-hud tracking-widest uppercase">
              <span className="text-sage">DEPOK, JAWA BARAT</span>
              <span className="mt-1">WEB_DEVELOPER // 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
