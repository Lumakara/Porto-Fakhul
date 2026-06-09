import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Lightbulb, Code2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { premiumEase } from '../components/Section';
import type { Project } from '../data/projects';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

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
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: premiumEase, delay },
  }),
};

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[100]"
    >
      {/* Back button - fixed, highest z-index */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: premiumEase }}
        onClick={onBack}
        className="fixed top-6 left-6 z-[110] flex items-center space-x-2 px-4 py-2.5 rounded-full bg-surface border border-charcoal/10 text-charcoal text-xs font-hud uppercase tracking-widest shadow-sm hover:shadow-md hover:border-charcoal/20 transition-all duration-300 cursor-none"
        aria-label={t('sections.projects.detail.back')}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('sections.projects.detail.back')}</span>
      </motion.button>

      {/* Overlay container */}
      <div className="absolute inset-0 bg-sand">
        {/* Scrollable content wrapper */}
        <div className="h-full overflow-y-auto">
          {/* Hero banner */}
          <div
            className="relative w-full h-64 md:h-80 flex items-center justify-center"
            style={{ background: project.gradient }}
          >
            {/* Noise overlay */}
            <div className="absolute inset-0 bg-charcoal/5 mix-blend-overlay" />

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-display font-medium text-charcoal opacity-[0.06] text-[4rem] md:text-[8rem] leading-none whitespace-nowrap">
                {project.title}
              </span>
            </div>
          </div>

          {/* Content section */}
          <div className="relative w-full max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-16">
            {/* Category pill */}
            <motion.div
              custom={0.2}
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-surface border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-widest">
                {project.categoryLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              custom={0.25}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-5 text-3xl md:text-5xl font-display font-medium text-charcoal tracking-tight"
            >
              {project.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              custom={0.3}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-3 text-base md:text-lg text-charcoal-light font-sans"
            >
              {project.tagline}
            </motion.p>

            {/* Divider */}
            <motion.div
              custom={0.35}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-8 border-t border-charcoal/10"
            />

            {/* About / Description */}
            <motion.div
              custom={0.4}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-8"
            >
              <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest mb-4">
                {t('sections.projects.detail.overview')}
              </h2>
              <p className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            {/* Challenge */}
            <motion.div
              custom={0.5}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-10"
            >
              <div className="p-6 rounded-xl bg-terracotta/5 border border-terracotta/10">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-4 h-4 text-terracotta" />
                  <span className="text-xs font-hud text-terracotta uppercase tracking-widest">
                    {t('sections.projects.detail.challenge')}
                  </span>
                </div>
                <p className="text-sm text-charcoal font-sans leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              custom={0.6}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-6"
            >
              <div className="p-6 rounded-xl bg-sage/5 border border-sage/10">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-sage" />
                  <span className="text-xs font-hud text-sage uppercase tracking-widest">
                    {t('sections.projects.detail.solution')}
                  </span>
                </div>
                <p className="text-sm text-charcoal font-sans leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              custom={0.7}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-10"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="w-4 h-4 text-charcoal-light" />
                <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest">
                  {t('sections.projects.detail.tech')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((techItem) => (
                  <span
                    key={techItem}
                    className="px-3 py-1.5 rounded-full bg-surface border border-charcoal/10 text-xs font-hud text-charcoal uppercase tracking-wider"
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Project ID */}
            <motion.div
              custom={0.8}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-12 pt-6 border-t border-charcoal/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-hud text-charcoal-light/60 uppercase tracking-widest">
                  {t('sections.projects.detail.id')}
                </span>
                <span className="text-xs font-hud text-charcoal-light/60 tracking-wider">
                  {project.cyberId}
                </span>
              </div>
            </motion.div>

            {/* Bottom spacer for scroll */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
