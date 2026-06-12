import { motion } from 'framer-motion';
import { ArrowUpRight, Terminal, Sparkles } from 'lucide-react';
import { Section, TextReveal, premiumEase } from '../components/Section';
import { Tilt } from '../components/Tilt';
import { useLanguage } from '../contexts/LanguageContext';
import { projectsData, getStatusMeta, type Project } from '../data/projects';

/* ─── Card sub-component ─── */
interface ProjectCardProps {
  project: Project;
  index: number;
  layout: 'featured' | 'standard' | 'horizontal';
  onClick: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: premiumEase,
      delay: i * 0.15,
    },
  }),
};

const ProjectCard = ({ project, index, layout, onClick }: ProjectCardProps) => {
  const isFeatured = layout === 'featured';

  /* Layout-aware class maps (desktop only - mobile overrides below) */
  const wrapperClasses: Record<string, string> = {
    featured: 'md:col-span-2 md:min-h-[500px]',
    standard: 'md:col-span-1 min-h-[380px]',
    horizontal: 'md:col-span-2 min-h-[280px]',
  };

  const innerLayout: Record<string, string> = {
    featured: 'md:flex-row',
    standard: 'flex-col',
    horizontal: 'md:flex-row',
  };

  const visualSize: Record<string, string> = {
    featured: 'md:w-[60%] min-h-[220px] md:min-h-full',
    standard: 'w-full min-h-[180px]',
    horizontal: 'md:w-[45%] min-h-[180px] md:min-h-full',
  };

  const contentSize: Record<string, string> = {
    featured: 'md:w-[40%]',
    standard: 'w-full',
    horizontal: 'md:w-[55%]',
  };

  const titleSize: Record<string, string> = {
    featured: 'text-2xl md:text-3xl',
    standard: 'text-xl md:text-2xl',
    horizontal: 'text-xl md:text-2xl',
  };

  const watermarkSize: Record<string, string> = {
    featured: 'text-[6rem] md:text-[10rem]',
    standard: 'text-[4rem] md:text-[6rem]',
    horizontal: 'text-[4rem] md:text-[7rem]',
  };

  return (
    <Tilt
      className={`${wrapperClasses[layout]} max-md:!col-span-1 max-md:!min-h-0`}
      max={8}
      lift={10}
    >
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-charcoal/5 hover:border-charcoal/20 hover:shadow-lg transition-all duration-500 cursor-none bg-surface/70 h-full w-full min-h-[inherit]`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${project.title}`}
      data-cursor="text"
      data-cursor-text="VIEW"
    >
      {/* Inner flex container */}
      <div className={`flex flex-col ${innerLayout[layout]} h-full max-md:!flex-col`}>
        {/* ── Visual Preview Area ── */}
        <div
          className={`relative overflow-hidden ${visualSize[layout]} max-md:!w-full max-md:!min-h-[120px]`}
          style={{ background: project.gradient }}
        >
          {/* Dark overlay so watermark shows subtly */}
          <div className="absolute inset-0 bg-sand/30" />

          {/* Ghosted watermark title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className={`font-display font-medium text-charcoal opacity-[0.08] leading-none whitespace-nowrap ${watermarkSize[layout]} max-md:!text-[3rem]`}
            >
              {project.title}
            </span>
          </div>

          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-charcoal/5 mix-blend-overlay" />

          {/* Hover scale animation on gradient area */}
          <motion.div
            className="absolute inset-0"
            style={{ background: project.gradient }}
            initial={false}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
          />

          {/* Category pill - top-left */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex items-center gap-2" style={{ transform: 'translateZ(30px)' }}>
            <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-surface/80 border border-charcoal/10 text-[8px] md:text-[9px] font-hud text-charcoal font-medium uppercase tracking-widest backdrop-blur-sm shadow-sm">
              {project.categoryLabel}
            </span>
          </div>

          {/* Status badge - bottom-left */}
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10" style={{ transform: 'translateZ(24px)' }}>
            <span
              className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-surface/85 border border-charcoal/10 text-[8px] md:text-[9px] font-hud font-medium uppercase tracking-widest backdrop-blur-sm shadow-sm"
              style={{ color: getStatusMeta(project.status).color }}
            >
              <span
                className="relative flex h-1.5 w-1.5"
              >
                {project.status === 'live' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: getStatusMeta(project.status).color }} />
                )}
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: getStatusMeta(project.status).color }} />
              </span>
              {getStatusMeta(project.status).label}
            </span>
          </div>

          {/* Arrow icon - top-right, appears on hover */}
          <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" style={{ transform: 'translateZ(40px)' }}>
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-surface border border-charcoal/10 flex items-center justify-center backdrop-blur-sm shadow-sm">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-charcoal" />
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className={`flex flex-col justify-between p-3 md:p-5 lg:p-6 ${contentSize[layout]} max-md:!w-full ${isFeatured ? 'md:py-8 md:px-8' : ''}`}>
          <div className="flex flex-col space-y-1.5 md:space-y-3">
            {/* Cyber ID - hidden on mobile for compact view */}
            <div className="hidden md:flex items-center justify-between font-hud text-[9px] text-sage tracking-widest">
              <span className="flex items-center space-x-2">
                <Terminal className="w-3 h-3" />
                <span>{project.cyberId}</span>
              </span>
              <span className="text-charcoal-light/60">{project.year}</span>
            </div>

            {/* Title */}
            <h3 className={`font-display font-medium text-charcoal tracking-wide leading-tight group-hover:text-terracotta transition-colors duration-300 ${titleSize[layout]} max-md:!text-sm`}>
              {project.title}
            </h3>

            {/* Tagline - hidden on mobile for compact cards */}
            <p className="hidden md:block font-sans text-charcoal-light text-sm leading-relaxed line-clamp-2">
              {project.tagline}
            </p>

            {/* Extended description for featured card - desktop only */}
            {isFeatured && (
              <p className="hidden md:block font-sans text-charcoal-light/80 text-xs leading-relaxed line-clamp-3 mt-1">
                {project.description}
              </p>
            )}
          </div>

          {/* Tech pills - hidden on mobile for compact view */}
          <div className="hidden md:flex flex-wrap gap-1.5 mt-5">
            {project.tech.map((techItem) => (
              <span
                key={techItem}
                className="px-2 py-0.5 rounded bg-surface border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-wider"
              >
                {techItem}
              </span>
            ))}
          </div>

          {/* Metrics strip - featured card only */}
          {isFeatured && (
            <div className="hidden md:flex items-stretch gap-3 mt-5 pt-4 border-t border-charcoal/5">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col">
                  <span className="font-display text-lg font-semibold text-charcoal leading-none">{metric.value}</span>
                  <span className="font-hud text-[9px] text-charcoal-light/70 uppercase tracking-widest mt-1">{metric.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom hover glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/0 to-transparent group-hover:via-terracotta/40 transition-all duration-700" />
    </motion.div>
    </Tilt>
  );
};

/* ─── Main Section ─── */
interface ProjectsProps {
  onSelectProject?: (projectId: string) => void;
}

export const Projects = ({ onSelectProject }: ProjectsProps) => {
  const { t } = useLanguage();

  const handleProjectClick = (project: Project) => {
    if (onSelectProject) {
      onSelectProject(project.id);
    }
  };

  return (
    <Section id="projects" className="min-h-screen relative px-4 md:px-12 bg-sand">
      {/* Aurora glow overlays */}
      <div className="absolute inset-0 bg-aurora-sakura opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-aurora-cyber opacity-30 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="w-full max-w-7xl flex flex-col space-y-12 md:space-y-16 z-10 mx-auto">

        {/* ── Section Header - Centered ── */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="font-hud text-terracotta text-xs tracking-[0.3em] uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {t('sections.projects.selectedWorks')}
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium text-charcoal">
            <TextReveal text={t('sections.projects.projectArchive')} />
          </h2>
          <p className="text-charcoal-light font-sans text-sm max-w-md">
            {t('sections.projects.subtitleDesc')}
          </p>
        </div>

        {/* ── Bento Grid - 2 cols on mobile, bento on desktop ── */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {/* Project 1 - Featured full-width on desktop */}
          <ProjectCard
            project={projectsData[0]}
            index={0}
            layout="featured"
            onClick={() => handleProjectClick(projectsData[0])}
          />

          {/* Projects 2 & 3 - Two equal columns */}
          <ProjectCard
            project={projectsData[1]}
            index={1}
            layout="standard"
            onClick={() => handleProjectClick(projectsData[1])}
          />
          <ProjectCard
            project={projectsData[2]}
            index={2}
            layout="standard"
            onClick={() => handleProjectClick(projectsData[2])}
          />

          {/* Project 4 - Full-width horizontal on desktop */}
          <ProjectCard
            project={projectsData[3]}
            index={3}
            layout="horizontal"
            onClick={() => handleProjectClick(projectsData[3])}
          />

          {/* Project 5 - Full-width horizontal on desktop */}
          <ProjectCard
            project={projectsData[4]}
            index={4}
            layout="horizontal"
            onClick={() => handleProjectClick(projectsData[4])}
          />
        </div>
      </div>
    </Section>
  );
};

export default Projects;
