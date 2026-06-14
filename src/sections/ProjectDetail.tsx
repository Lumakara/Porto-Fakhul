import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { premiumEase } from '../components/Section';
import { LocalImage } from '../components/LocalImage';
import { TechMarquee } from '../components/TechMarquee';
import { getStatusMeta, getProjectCover, type Project, type ProjectLink } from '../data/projects';

/** A "screen" entry is treated as a real image when it looks like a path/URL. */
function isImagePath(s: string): boolean {
  return /^(https?:\/\/|\/)/.test(s) && /\.(png|jpe?g|webp|gif|avif)$/i.test(s);
}

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

type DetailTab = 'overview' | 'insight' | 'gallery';

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

const tabPanelVariants = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
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
  const cover = getProjectCover(project);

  const [tab, setTab] = useState<DetailTab>('overview');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? i : (i - 1 + project.screens.length) % project.screens.length));
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % project.screens.length));

  // Reset to the first tab is handled by remounting via `key` in App.tsx.

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onBack();
        }
        return;
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBack, lightboxIndex, project.screens.length]);

  const tabs: { id: DetailTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t('sections.projects.detail.tabs.overview'), icon: Compass },
    { id: 'insight', label: t('sections.projects.detail.tabs.insight'), icon: Lightbulb },
    { id: 'gallery', label: t('sections.projects.detail.tabs.gallery'), icon: ImageIcon },
  ];

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
          {/* Hero — Layer 1: cover image only (no overlaid text → tidy on mobile) */}
          <div className="relative w-full h-44 sm:h-60 md:h-80 overflow-hidden">
            <LocalImage
              src={cover}
              alt={`${project.title} banner`}
              priority
              className="absolute inset-0 w-full h-full"
            />
            {/* Soft bottom fade so the image blends into the text layer below */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
            <Sparkles className="absolute top-5 right-6 w-5 h-5 text-white/40" />
          </div>

          {/* Hero — Layer 2: title + meta on a clean surface block */}
          <div className="relative w-full max-w-4xl mx-auto px-6 md:px-8 pt-6 md:pt-8">
            <motion.div custom={0.2} variants={contentVariants} initial="initial" animate="animate" className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal/5 border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-widest">
                {project.categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal/5 border border-charcoal/10 text-[9px] font-hud uppercase tracking-widest text-charcoal-light">
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
            <motion.p custom={0.3} variants={contentVariants} initial="initial" animate="animate" className="mt-2 text-base md:text-lg text-charcoal-light font-sans max-w-2xl">
              {project.tagline}
            </motion.p>
          </div>

          {/* Content */}
          <div className="relative w-full max-w-4xl mx-auto px-6 md:px-8 pt-6 md:pt-8 pb-8 md:pb-10">
            {/* Action links */}
            <motion.div custom={0.35} variants={contentVariants} initial="initial" animate="animate" className="flex flex-wrap gap-2.5 pb-6 border-b border-charcoal/10">
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
            </motion.div>

            {/* Tab bar */}
            <div className="sticky top-3 z-20 mt-6">
              <div className="flex w-full bg-surface/90 backdrop-blur border border-charcoal/10 rounded-2xl p-1.5 shadow-sm">
                {tabs.map((tabItem) => {
                  const Icon = tabItem.icon;
                  const isActive = tab === tabItem.id;
                  return (
                    <button
                      key={tabItem.id}
                      onClick={() => setTab(tabItem.id)}
                      data-sound="click"
                      data-cursor="magnetic"
                      className="relative flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl cursor-none transition-colors duration-300 font-hud"
                      aria-pressed={isActive}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="detailTabIndicator"
                          className="absolute inset-0 bg-terracotta/15 border border-terracotta/30 rounded-xl"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-charcoal-light'}`} />
                        <span className={`font-medium tracking-wide text-[11px] md:text-xs ${isActive ? 'text-charcoal' : 'text-charcoal-light'}`}>
                          {tabItem.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="mt-7 min-h-[360px]">
              <AnimatePresence mode="wait">
                {/* ── GAMBARAN / OVERVIEW ── */}
                {tab === 'overview' && (
                  <motion.div
                    key="overview"
                    variants={tabPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.45, ease: premiumEase }}
                    className="space-y-9"
                  >
                    {/* Meta strip */}
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

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      {project.metrics.map((metric) => (
                        <div key={metric.label} className="flex flex-col items-center text-center py-4 rounded-xl bg-surface border border-charcoal/5">
                          <span className="font-display text-2xl md:text-3xl font-semibold text-charcoal leading-none">{metric.value}</span>
                          <span className="font-hud text-[9px] text-charcoal-light uppercase tracking-widest mt-1.5">{metric.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Overview text */}
                    <div>
                      <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest mb-3">{t('sections.projects.detail.overview')}</h2>
                      <p className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed">{project.description}</p>
                    </div>

                    {/* Key features */}
                    <div>
                      <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-terracotta" />
                        {t('sections.projects.detail.features')}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-charcoal/5">
                            <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-charcoal font-sans leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech stack — looping icon marquee */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Code2 className="w-4 h-4 text-charcoal-light" />
                        <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest">{t('sections.projects.detail.tech')}</h2>
                      </div>
                      <TechMarquee items={project.tech} />
                    </div>
                  </motion.div>
                )}

                {/* ── INSIGHT (Tantangan & Solusi) ── */}
                {tab === 'insight' && (
                  <motion.div
                    key="insight"
                    variants={tabPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.45, ease: premiumEase }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl bg-terracotta/5 border border-terracotta/15">
                      <div className="flex items-center space-x-2 mb-3">
                        <Target className="w-4 h-4 text-terracotta" />
                        <span className="text-xs font-hud text-terracotta uppercase tracking-widest">{t('sections.projects.detail.challenge')}</span>
                      </div>
                      <p className="text-sm md:text-base text-charcoal font-sans leading-relaxed">{project.challenge}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-sage/5 border border-sage/15">
                      <div className="flex items-center space-x-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-sage" />
                        <span className="text-xs font-hud text-sage uppercase tracking-widest">{t('sections.projects.detail.solution')}</span>
                      </div>
                      <p className="text-sm md:text-base text-charcoal font-sans leading-relaxed">{project.solution}</p>
                    </div>
                  </motion.div>
                )}

                {/* ── GALERI / GALLERY ── */}
                {tab === 'gallery' && (
                  <motion.div
                    key="gallery"
                    variants={tabPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.45, ease: premiumEase }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xs font-hud text-charcoal uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-charcoal-light" />
                        {t('sections.projects.detail.gallery')}
                      </h2>
                      {/* Swipe hint — mobile only */}
                      <span className="sm:hidden flex items-center gap-1 text-[9px] font-hud text-charcoal-light/60 uppercase tracking-widest">
                        <ChevronLeft className="w-3 h-3" />
                        {t('sections.projects.detail.swipeHint')}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Mobile: horizontal snap-scroll carousel. Desktop: 3-col grid. */}
                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-1 px-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {project.screens.map((screen, i) => (
                        <button
                          key={screen}
                          type="button"
                          onClick={() => setLightboxIndex(i)}
                          data-sound="click"
                          data-cursor="grow"
                          className="group/frame snap-center shrink-0 w-[82%] sm:w-auto text-left rounded-xl overflow-hidden border border-charcoal/10 bg-surface shadow-sm cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-transform duration-300 hover:-translate-y-1"
                          aria-label={`${t('sections.projects.detail.gallery')} ${i + 1}`}
                        >
                          {/* Faux browser chrome */}
                          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-charcoal/5 bg-charcoal/[0.02]">
                            <span className="w-2 h-2 rounded-full bg-red-400/60" />
                            <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
                            <span className="w-2 h-2 rounded-full bg-green-400/60" />
                          </div>
                          <div className="relative aspect-[4/3] overflow-hidden">
                            {isImagePath(screen) ? (
                              <LocalImage src={screen} alt={`${project.title} screen ${i + 1}`} className="absolute inset-0 w-full h-full" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-stone">
                                <span className="font-display text-charcoal/30 text-3xl font-semibold">0{i + 1}</span>
                              </div>
                            )}
                            <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center opacity-0 group-hover/frame:opacity-100 transition-opacity duration-300">
                              <Maximize2 className="w-3.5 h-3.5 text-charcoal" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next project CTA */}
            {nextProject && onNavigate && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: premiumEase }}
                onClick={() => onNavigate(nextProject.id)}
                data-sound="click"
                className="group mt-12 w-full flex items-center justify-between gap-4 p-5 md:p-6 rounded-2xl border border-charcoal/10 hover:border-charcoal/25 bg-surface transition-all duration-300 cursor-none text-left overflow-hidden relative"
                data-cursor="grow"
              >
                <div className="relative flex items-center gap-4 min-w-0">
                  <LocalImage
                    src={getProjectCover(nextProject)}
                    alt={`${nextProject.title} thumbnail`}
                    className="w-14 h-14 rounded-xl flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-hud text-charcoal-light uppercase tracking-widest">{t('sections.projects.detail.nextProject')}</span>
                    <h3 className="text-lg md:text-2xl font-display font-medium text-charcoal mt-0.5 group-hover:text-terracotta transition-colors truncate">{nextProject.title}</h3>
                  </div>
                </div>
                <div className="relative w-11 h-11 rounded-full bg-charcoal text-sand flex items-center justify-center group-hover:bg-terracotta transition-colors flex-shrink-0">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            )}

            {/* Project ID */}
            <div className="mt-12 pt-6 border-t border-charcoal/10">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-hud text-charcoal-light/60 uppercase tracking-widest">{t('sections.projects.detail.id')}</span>
                <span className="text-xs font-hud text-charcoal-light/60 tracking-wider">{project.cyberId}</span>
              </div>
            </div>

            <div className="h-16" />
          </div>
        </div>
      </div>

      {/* Gallery lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — ${lightboxIndex + 1}`}
          >
            <button
              onClick={closeLightbox}
              data-sound="click"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-none transition-colors"
              data-cursor="magnetic"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="absolute top-6 left-6 text-[11px] font-hud text-white/70 tracking-widest">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(project.screens.length).padStart(2, '0')}
            </span>

            {project.screens.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  data-sound="click"
                  className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-none transition-colors"
                  data-cursor="magnetic"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  data-sound="click"
                  className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-none transition-colors"
                  data-cursor="magnetic"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
            >
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-charcoal border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 text-[10px] font-hud text-white/50 tracking-widest truncate">
                  {project.title} — {String(lightboxIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="relative aspect-[16/10] bg-stone">
                {isImagePath(project.screens[lightboxIndex]) ? (
                  <LocalImage
                    src={project.screens[lightboxIndex]}
                    alt={`${project.title} screen ${lightboxIndex + 1}`}
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-charcoal/30 text-6xl font-semibold">0{lightboxIndex + 1}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;
