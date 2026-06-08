import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n/index';

interface TableOfContentsProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const sections = ['home', 'about', 'projects', 'skills', 'contact'] as const;

export const TableOfContents = ({ activeSection, onNavigate }: TableOfContentsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionKeys: Record<string, string> = {
    home: 'nav.home',
    about: 'nav.about',
    projects: 'nav.projects',
    skills: 'nav.skills',
    contact: 'nav.contact',
  };

  return (
    <div className="w-full">
      {/* Scroll progress bar */}
      <div className="w-full h-0.5 bg-stone/50 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-terracotta rounded-full"
          style={{ width: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-stone/30 transition-colors text-sm font-hud text-charcoal tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
      >
        <span className="font-semibold">{t('nav.tableOfContents')}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-charcoal-light" />
        </motion.div>
      </button>

      {/* Section list */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
            aria-label="Table of contents"
          >
            <ul className="flex flex-col gap-1 pt-2 pl-1">
              {sections.map((section, idx) => (
                <motion.li
                  key={section}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                >
                  <button
                    onClick={() => onNavigate(section)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 ${
                      activeSection === section
                        ? 'bg-terracotta/10 text-terracotta border-l-2 border-terracotta'
                        : 'text-charcoal-light hover:text-charcoal hover:bg-stone/30'
                    }`}
                  >
                    <span className="text-[10px] font-hud opacity-50">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-hud tracking-wide">
                      {t(sectionKeys[section])}
                    </span>
                    {activeSection === section && (
                      <motion.div
                        layoutId="toc-active"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-terracotta"
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      />
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableOfContents;
