import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code2, Lightbulb, Target, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { premiumEase } from '../components/Section';
import { Magnetic } from '../components/Magnetic';
import type { Project } from '../data/projects';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const tabs = ['overview', 'challenge', 'solution', 'tech'] as const;
type Tab = typeof tabs[number];

const tabIcons: Record<Tab, React.ReactNode> = {
  overview: <Layers className="w-4 h-4" />,
  challenge: <Target className="w-4 h-4" />,
  solution: <Lightbulb className="w-4 h-4" />,
  tech: <Code2 className="w-4 h-4" />,
};

const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: premiumEase },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    transition: { duration: 0.5, ease: premiumEase },
  },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: premiumEase },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: premiumEase },
  },
};

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { t } = useLanguage();

  // Dismiss overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            key="overview"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-display font-medium text-charcoal">
                {project.tagline}
              </h3>
              <p className="text-charcoal-light font-sans text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-surface/80 border border-charcoal/5">
                <span className="text-[9px] font-hud text-sage uppercase tracking-widest">
                  {t('sections.projects.detail.category')}
                </span>
                <p className="text-sm font-medium text-charcoal mt-1">
                  {project.categoryLabel}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface/80 border border-charcoal/5">
                <span className="text-[9px] font-hud text-sage uppercase tracking-widest">
                  {t('sections.projects.detail.id')}
                </span>
                <p className="text-sm font-medium text-charcoal mt-1 font-hud">
                  {project.cyberId}
                </p>
              </div>
            </div>
          </motion.div>
        );
      case 'challenge':
        return (
          <motion.div
            key="challenge"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-terracotta/5 border border-terracotta/10">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-terracotta" />
                <span className="text-xs font-hud text-terracotta uppercase tracking-widest">
                  {t('sections.projects.detail.challenge')}
                </span>
              </div>
              <p className="text-charcoal font-sans text-sm leading-relaxed">
                {project.challenge}
              </p>
            </div>
          </motion.div>
        );
      case 'solution':
        return (
          <motion.div
            key="solution"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-sage/5 border border-sage/10">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-sage" />
                <span className="text-xs font-hud text-sage uppercase tracking-widest">
                  {t('sections.projects.detail.solution')}
                </span>
              </div>
              <p className="text-charcoal font-sans text-sm leading-relaxed">
                {project.solution}
              </p>
            </div>
          </motion.div>
        );
      case 'tech':
        return (
          <motion.div
            key="tech"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-3">
              {project.tech.map((techItem, i) => (
                <motion.div
                  key={techItem}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { delay: i * 0.1, duration: 0.4, ease: premiumEase },
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-charcoal/10 text-xs font-hud text-charcoal uppercase tracking-wider shadow-sm hover:shadow-md hover:border-terracotta/20 transition-all duration-300 cursor-none"
                  data-cursor="magnetic"
                >
                  {techItem}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 overflow-y-auto bg-sand"
    >
      {/* Hero Section */}
      <div
        className="relative w-full min-h-[280px] md:min-h-[360px] flex items-end overflow-hidden"
        style={{ background: project.gradient }}
      >
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-charcoal/5 mix-blend-overlay" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display font-medium text-charcoal opacity-[0.06] text-[5rem] md:text-[10rem] leading-none whitespace-nowrap">
            {project.title}
          </span>
        </div>

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <Magnetic range={0.3}>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-surface/90 border border-charcoal/10 text-charcoal text-xs font-hud uppercase tracking-widest backdrop-blur-sm hover:bg-surface hover:shadow-md transition-all duration-300 cursor-none"
              data-cursor="magnetic"
              aria-label={t('sections.projects.detail.back')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('sections.projects.detail.back')}</span>
            </button>
          </Magnetic>
        </div>

        {/* Title area */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: premiumEase }}
            className="space-y-3"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-surface/80 border border-charcoal/10 text-[9px] font-hud text-charcoal uppercase tracking-widest backdrop-blur-sm">
              {project.categoryLabel}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-medium text-charcoal tracking-tight">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative w-full max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: premiumEase }}
          className="flex flex-wrap gap-2 mb-10 border-b border-charcoal/10 pb-4"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-hud uppercase tracking-widest transition-all duration-300 cursor-none ${
                activeTab === tab
                  ? 'bg-charcoal text-sand shadow-md'
                  : 'bg-surface/60 text-charcoal-light hover:bg-surface hover:text-charcoal border border-charcoal/5'
              }`}
              data-cursor="magnetic"
            >
              {tabIcons[tab]}
              <span>{t(`sections.projects.detail.${tab}`)}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
