import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Lightbulb,
  Target,
  ExternalLink,
  GitBranch,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { premiumEase } from '../components/Section';
import { Magnetic } from '../components/Magnetic';
import { projectsData, type Project } from '../data/projects';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNavigate?: (projectId: string) => void;
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

export const ProjectDetail = ({ project, onBack, onNavigate }: ProjectDetailProps) => {
  const { t } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentIndex = projectsData.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
  const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;

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

  // Scroll carousel to current slide
  useEffect(() => {
    if (carouselRef.current) {
      const scrollLeft = currentSlide * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentSlide]);

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollPos = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      setCurrentSlide(Math.round(scrollPos / width));
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
      {/* Back Button - sticky */}
      <div className="sticky top-0 z-20 p-4 md:p-6">
        <Magnetic range={0.3}>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-surface/90 border border-charcoal/10 text-charcoal text-xs font-hud uppercase tracking-widest backdrop-blur-sm hover:bg-surface hover:shadow-md transition-all duration-300 cursor-none"
            data-cursor="magnetic"
            aria-label={t('sections.projects.detail.back') as string}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('sections.projects.detail.back')}</span>
          </button>
        </Magnetic>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full max-w-5xl mx-auto px-4 md:px-12 -mt-4">
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl"
          style={{ scrollbarWidth: 'none' }}
        >
          {project.screenshots.map((src, i) => (
            <div key={i} className="flex-shrink-0 w-full snap-center">
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="w-full aspect-[16/10] object-cover rounded-2xl bg-stone"
              />
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        {project.screenshots.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 border border-charcoal/10 flex items-center justify-center backdrop-blur-sm hover:bg-surface hover:shadow-md transition-all duration-300 cursor-none disabled:opacity-30"
              disabled={currentSlide === 0}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-charcoal" />
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min(project.screenshots.length - 1, currentSlide + 1))}
              className="absolute right-6 md:right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 border border-charcoal/10 flex items-center justify-center backdrop-blur-sm hover:bg-surface hover:shadow-md transition-all duration-300 cursor-none disabled:opacity-30"
              disabled={currentSlide === project.screenshots.length - 1}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-charcoal" />
            </button>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {project.screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-none ${
                    i === currentSlide ? 'bg-terracotta w-5' : 'bg-charcoal/20'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-5xl mx-auto px-4 md:px-12 py-10 md:py-14">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 mb-3 rounded-full bg-surface border border-charcoal/10 text-[9px] font-hud text-charcoal uppercase tracking-widest">
            {project.categoryLabel}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-medium text-charcoal tracking-tight mb-3">
            {project.title}
          </h1>
          <p className="text-lg text-charcoal-light font-sans">{project.tagline}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center space-x-2 text-sm text-charcoal-light font-hud">
              <User className="w-4 h-4 text-sage" />
              <span>{project.role}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-charcoal-light font-hud">
              <Clock className="w-4 h-4 text-sage" />
              <span>{project.duration}</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-5">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-charcoal text-sand text-xs font-hud uppercase tracking-widest hover:bg-terracotta transition-colors duration-300 cursor-none"
                data-cursor="magnetic"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('sections.projects.detail.liveDemo')}</span>
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-surface border border-charcoal/10 text-charcoal text-xs font-hud uppercase tracking-widest hover:border-charcoal/30 hover:shadow-sm transition-all duration-300 cursor-none"
                data-cursor="magnetic"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{t('sections.projects.detail.sourceCode')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <div className="text-charcoal-light font-sans text-base leading-relaxed whitespace-pre-line">
            {project.description}
          </div>
        </div>

        {/* Features & Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Features */}
          <div className="p-6 rounded-2xl bg-surface/80 border border-charcoal/5">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-terracotta" />
              <span className="text-xs font-hud text-terracotta uppercase tracking-widest">
                {t('sections.projects.detail.features')}
              </span>
            </div>
            <ul className="space-y-3">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-terracotta/60 flex-shrink-0" />
                  <span className="text-sm text-charcoal font-sans">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div className="p-6 rounded-2xl bg-surface/80 border border-charcoal/5">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-sage" />
              <span className="text-xs font-hud text-sage uppercase tracking-widest">
                {t('sections.projects.detail.results')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.results.map((result, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-sand/80 border border-charcoal/5 text-center"
                >
                  <span className="text-sm font-hud font-medium text-charcoal">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-terracotta/5 border border-terracotta/10">
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

          <div className="p-6 rounded-2xl bg-sage/5 border border-sage/10">
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
        </div>

        {/* Tech Stack */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-4">
            <Code2 className="w-5 h-5 text-charcoal-light" />
            <span className="text-xs font-hud text-charcoal-light uppercase tracking-widest">
              {t('sections.projects.detail.tech')}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((techItem) => (
              <span
                key={techItem}
                className="px-4 py-2.5 rounded-xl bg-surface border border-charcoal/10 text-xs font-hud text-charcoal uppercase tracking-wider shadow-sm hover:shadow-md hover:border-terracotta/20 transition-all duration-300 cursor-none"
                data-cursor="magnetic"
              >
                {techItem}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation between projects */}
        <div className="flex items-center justify-between pt-8 border-t border-charcoal/10">
          {prevProject ? (
            <button
              onClick={() => onNavigate?.(prevProject.id)}
              className="flex items-center space-x-3 group cursor-none"
              data-cursor="magnetic"
            >
              <ArrowLeft className="w-4 h-4 text-charcoal-light group-hover:text-terracotta transition-colors" />
              <div className="text-left">
                <span className="text-[9px] font-hud text-charcoal-light uppercase tracking-widest block">
                  {t('sections.projects.detail.prevProject')}
                </span>
                <span className="text-sm font-display font-medium text-charcoal group-hover:text-terracotta transition-colors">
                  {prevProject.title}
                </span>
              </div>
            </button>
          ) : (
            <div />
          )}
          {nextProject ? (
            <button
              onClick={() => onNavigate?.(nextProject.id)}
              className="flex items-center space-x-3 group cursor-none"
              data-cursor="magnetic"
            >
              <div className="text-right">
                <span className="text-[9px] font-hud text-charcoal-light uppercase tracking-widest block">
                  {t('sections.projects.detail.nextProject')}
                </span>
                <span className="text-sm font-display font-medium text-charcoal group-hover:text-terracotta transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-charcoal-light group-hover:text-terracotta transition-colors" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
