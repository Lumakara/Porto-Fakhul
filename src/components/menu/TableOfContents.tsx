import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, User, FolderOpen, Cpu, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useReducedMotion } from '../../lib/motion';
import { RippleEffect } from './RippleEffect';

interface TableOfContentsProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

const sections = [
  { id: 'home', icon: Home, labelKey: 'nav.home' },
  { id: 'about', icon: User, labelKey: 'nav.about' },
  { id: 'projects', icon: FolderOpen, labelKey: 'nav.projects' },
  { id: 'skills', icon: Cpu, labelKey: 'nav.skills' },
  { id: 'contact', icon: Mail, labelKey: 'nav.contact' },
];

export function TableOfContents({ activeSection, onNavigate }: TableOfContentsProps) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(scrollTop / docHeight, 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: reducedMotion
        ? { duration: 0 }
        : { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <div className="flex flex-col">
      {/* Scroll progress bar */}
      <div className="relative h-0.5 w-full bg-stone/50 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-terracotta rounded-full"
          style={{ width: `${scrollProgress * 100}%` }}
          aria-label={t('accessibility.scrollProgress')}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Section items */}
      <nav aria-label={t('menu.tableOfContents')}>
        <ul className="flex flex-col space-y-1">
          {sections.map((section, i) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <motion.li
                key={section.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <RippleEffect className="rounded-lg">
                  <button
                    onClick={() => onNavigate(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                      isActive
                        ? 'bg-terracotta/10 border-l-2 border-terracotta text-terracotta font-medium'
                        : 'text-charcoal-light hover:text-charcoal hover:bg-stone/30 hover:translate-x-1 border-l-2 border-transparent'
                    }`}
                    data-cursor="magnetic"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-hud text-sm tracking-wide">{t(section.labelKey)}</span>
                  </button>
                </RippleEffect>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
