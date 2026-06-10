import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Target,
  Lightbulb,
  Code2,
  CheckCircle2,
  ExternalLink,
  FileText,
  PlayCircle,
  Calendar,
  UserCircle,
  Activity,
  ArrowRight,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { premiumEase } from '../components/Section';
import { getStatusMeta, type Project, type ProjectLink } from '../data/projects';

const GithubGlyph = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  nextProject?: Project | null;
  onNavigate?: (projectId: string) => void;
}

const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: premiumEase } },
  exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.5, ease: premiumEase } },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: premiumEase, delay },
  }),
};

const LINK_META: Record<ProjectLink['type'], { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  live: { icon: ExternalLink, label: 'viewLive' },
  repo: { icon: GithubGlyph, label: 'viewRepo' },
  'case-study': { icon: FileText, label: 'viewCase' },
  demo: { icon: PlayCircle, label: 'viewDemo' },
};

export const ProjectDetail = ({ project, onBack, nextProject, onNavigate }: ProjectDetailProps) => {
  const { t } = useLanguage();
  const status = getStatusMeta(project.status);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="fixed inset-0 z-[100]">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: premiumEase }}
        onClick={onBack}
        data-sound="click"
        className="fixed top-5 left-5 z-[110] flex items-center space-x-2 px-4 py-2.5 rounded-full bg-surface/90 backdrop-blur border border-charcoal/10 text-charcoal text-xs font-hud uppercase tracking-widest shadow-sm hover:shadow-md hover:border-charcoal/20 transition-all duration-300 cursor-none"
        aria-label={t('sections.projects.detail.back')}
        data-cursor="magnetic"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('sections.projects.detail.back')}</span>
      </motion.button>

      <div className="absolute inset-0 bg-sand">
        <div className="h-full overflow-y-auto">
          {/* Hero banner */}
          <div className="relative w-full h-72 md:h-96 flex items-end overflow-hidden" style={{ background: project.gradient }}>
            <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay" />
            <div className="absolute inset-0 cyber-grid opacity-10" />
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-display font-medium text-charcoal opacity-[0.06] text-[4rem] md:text-[9rem] leading-none whitespace-nowrap">
                {project.title}
              </span>
            </div>
            {/* Decorative icons */}
            <Sparkles className="absolute top-24 right-16 w-5 h-5 text-charcoal/20" />

            {/* Header content */}
            <div className="relative w-full max-w-4xl mx-auto px-6 md:px-8 pb-8 md:pb-10">
              <motion.div custom={0.2} variants={contentVariants} initial="initial" animate="animate" className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/85 backdrop-blur border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-widest">
                  {project.categoryLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/85 backdrop-blur border border-charcoal/10 text-[9px] font-hud uppercase tracking-widest" style={{ color: status.color }}>
                  <span className="relative flex h-1.5 w-1.5">
                    {project.status === 'live' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: status.color }} />}
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: status.color }} />
                  </span>
                  {status.label}
                </span>
              </motion.div>

              <motion.h1 custom={0.25} variants={contentVariants} initial="initial" animate="animate" className="text-3xl md:text-5xl font-display font-medium text-charcoal tracking-tight">
                {project.title}
              </motion.h1>
              <motion.p custom={0.3} variants={contentVariants} initial="initial" animate="animate" className="mt-2 text-base md:text-lg text-charcoal/70 font-sans max-w-2xl">
                {project.tagline}
              </motion.p>
            </div>
          </div>

          {/* Content */}
          <div className="relative w-full max-w-4xl mx-auto px-6 md:px-8 py-8 md:py-12">
            {/* Meta + action bar */}
            <motion.div custom={0.35} variants={contentVariants} initial="initial" animate="animate" className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-8 border-b border-charcoal/10">
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Calendar, label: t('sections.projects.detail.year'), value: project.year },
                  { icon: UserCircle, label: t('sections.projects.detail.role'), value: project.role },
                  { icon: Activity, label: t('sections.projects.detail.status'), value: status.label },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-surface border border-charcoal/5">
                        <Icon className="w-4 h-4 text-terracotta" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-hud text-charcoal-light uppercase tracking-widest">{m.label}</span>
                        <span className="text-sm text-charcoal font-medium font-sans">{m.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action links */}
              <div className="flex flex-wrap gap-2.5">
                {project.links.map((link, i) => {
                  const meta = LINK_META[link.type];
                  const Icon = meta.icon;
                  const primary = i === 0;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => { if (link.href === '#') e.preventDefault(); }}
                      data-sound="click"
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-hud uppercase tracking-widest transition-all duration-300 cursor-none ${
                        primary
                          ? 'bg-charcoal text-sand hover:bg-terracotta shadow-sm hover:shadow-md'
                          : 'bg-surface border border-charcoal/10 text-charcoal hover:border-charcoal/25'
                      }`}
                      data-cursor="grow"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(`sections.projects.detail.${meta.label}`)}
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Metrics */}
            <motion.div custom={0.4} variants={contentVariants} initial="initial" animate="animate" className="grid grid-cols-3 gap-3 mt-8">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col items-center text-center py-4 rounded-xl bg-surface border border-charcoal/5">
                  <span className="font-display text-2xl md:text-3xl font-semibold text-charcoal leading-none">{metric.value}</span>
                  <span className="font-hud text-[9px] text-charcoal-light uppercase tracking-widest mt-1.5">{metric.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Gallery */}
            <motion.div custom={0.45} variants={contentVariants} initial="initial" animate="animate" className="mt-10">
              <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-charcoal-light" />
                {t('sections.projects.detail.gallery')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.screens.map((screen, i) => (
                  <motion.div
                    key={screen}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden border border-charcoal/10 bg-surface shadow-sm"
                  >
                    {/* Faux browser chrome */}
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-charcoal/5 bg-charcoal/[0.02]">
                      <span className="w-2 h-2 rounded-full bg-red-400/60" />
                      <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
                      <span className="w-2 h-2 rounded-full bg-green-400/60" />
                    </div>
                    <div className="relative aspect-[4/3] flex items-center justify-center" style={{ background: project.gradient }}>
                      <div className="absolute inset-0 bg-charcoal/5 mix-blend-overlay" />
                      <div className="absolute inset-0 cyber-grid opacity-10" />
                      <span className="relative font-display text-charcoal/30 text-3xl font-semibold">0{i + 1}</span>
                      <span className="absolute bottom-2 left-2 text-[9px] font-hud text-charcoal/60 uppercase tracking-widest bg-surface/70 px-2 py-0.5 rounded-full">{screen}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Overview */}
            <motion.div custom={0.5} variants={contentVariants} initial="initial" animate="animate" className="mt-10">
              <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest mb-4">{t('sections.projects.detail.overview')}</h2>
              <p className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed">{project.description}</p>
            </motion.div>

            {/* Key Features */}
            <motion.div custom={0.55} variants={contentVariants} initial="initial" animate="animate" className="mt-10">
              <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta" />
                {t('sections.projects.detail.features')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: premiumEase }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-charcoal/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal font-sans leading-snug">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Challenge */}
            <motion.div custom={0.6} variants={contentVariants} initial="initial" animate="animate" className="mt-10">
              <div className="p-6 rounded-xl bg-terracotta/5 border border-terracotta/10">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-4 h-4 text-terracotta" />
                  <span className="text-xs font-hud text-terracotta uppercase tracking-widest">{t('sections.projects.detail.challenge')}</span>
                </div>
                <p className="text-sm text-charcoal font-sans leading-relaxed">{project.challenge}</p>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div custom={0.65} variants={contentVariants} initial="initial" animate="animate" className="mt-6">
              <div className="p-6 rounded-xl bg-sage/5 border border-sage/10">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-sage" />
                  <span className="text-xs font-hud text-sage uppercase tracking-widest">{t('sections.projects.detail.solution')}</span>
                </div>
                <p className="text-sm text-charcoal font-sans leading-relaxed">{project.solution}</p>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div custom={0.7} variants={contentVariants} initial="initial" animate="animate" className="mt-10">
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="w-4 h-4 text-charcoal-light" />
                <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest">{t('sections.projects.detail.tech')}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((techItem) => (
                  <span key={techItem} className="px-3 py-1.5 rounded-full bg-surface border border-charcoal/10 text-xs font-hud text-charcoal uppercase tracking-wider">
                    {techItem}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Next project CTA */}
            {nextProject && onNavigate && (
              <motion.button
                custom={0.75}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                onClick={() => onNavigate(nextProject.id)}
                data-sound="click"
                className="group mt-12 w-full flex items-center justify-between gap-4 p-6 rounded-2xl border border-charcoal/10 hover:border-charcoal/25 transition-all duration-300 cursor-none text-left overflow-hidden relative"
                style={{ background: nextProject.gradient }}
                data-cursor="grow"
              >
                <div className="absolute inset-0 bg-surface/80 group-hover:bg-surface/70 transition-colors duration-300" />
                <div className="relative">
                  <span className="text-[9px] font-hud text-charcoal-light uppercase tracking-widest">{t('sections.projects.detail.nextProject')}</span>
                  <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal mt-1 group-hover:text-terracotta transition-colors">{nextProject.title}</h3>
                </div>
                <div className="relative w-11 h-11 rounded-full bg-charcoal text-sand flex items-center justify-center group-hover:bg-terracotta transition-colors flex-shrink-0">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            )}

            {/* Project ID */}
            <motion.div custom={0.8} variants={contentVariants} initial="initial" animate="animate" className="mt-12 pt-6 border-t border-charcoal/10">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-hud text-charcoal-light/60 uppercase tracking-widest">{t('sections.projects.detail.id')}</span>
                <span className="text-xs font-hud text-charcoal-light/60 tracking-wider">{project.cyberId}</span>
              </div>
            </motion.div>

            <div className="h-16" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
