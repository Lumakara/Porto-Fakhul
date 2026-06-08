import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Terminal } from 'lucide-react';
import { Section, TextReveal, premiumEase } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';
import { projectsData, type Project } from '../data/projects';

type FilterCategory = 'all' | 'creative' | 'systems' | 'lab';

/* ─── Card sub-component ─── */
interface ProjectCardProps {
  project: Project;
  index: number;
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
      delay: i * 0.1,
    },
  }),
};

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-charcoal/5 hover:border-charcoal/20 hover:shadow-lg transition-all duration-500 cursor-none bg-surface/70"
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
      {/* Screenshot Preview */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={project.screenshots[0]}
          alt={`${project.title} preview`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-surface/90 border border-charcoal/10 text-[9px] font-hud text-charcoal font-medium uppercase tracking-widest backdrop-blur-sm shadow-sm">
            {project.categoryLabel}
          </span>
        </div>

        {/* Arrow icon on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
          <div className="w-8 h-8 rounded-full bg-surface border border-charcoal/10 flex items-center justify-center backdrop-blur-sm shadow-sm">
            <ArrowUpRight className="w-4 h-4 text-charcoal" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        <div className="flex flex-col space-y-2 flex-1">
          {/* Cyber ID */}
          <div className="flex items-center space-x-2 font-hud text-[9px] text-sage tracking-widest">
            <Terminal className="w-3 h-3" />
            <span>{project.cyberId}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-display font-medium text-charcoal tracking-wide leading-tight group-hover:text-terracotta transition-colors duration-300">
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="font-sans text-charcoal-light text-sm leading-relaxed line-clamp-2">
            {project.tagline}
          </p>
        </div>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.slice(0, 4).map((techItem) => (
            <span
              key={techItem}
              className="px-2 py-0.5 rounded bg-surface border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-wider"
            >
              {techItem}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 rounded bg-surface border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-wider">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom hover glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/0 to-transparent group-hover:via-terracotta/40 transition-all duration-700" />
    </motion.div>
  );
};

/* ─── Main Section ─── */
interface ProjectsProps {
  onSelectProject?: (projectId: string) => void;
}

export const Projects = ({ onSelectProject }: ProjectsProps) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filters: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: t('sections.projects.filterAll') as string },
    { id: 'creative', label: t('sections.projects.filterCreative') as string },
    { id: 'systems', label: t('sections.projects.filterSystems') as string },
    { id: 'lab', label: t('sections.projects.filterLab') as string },
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projectsData;
    return projectsData.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

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

      <div className="w-full max-w-7xl flex flex-col space-y-10 md:space-y-14 z-10 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="font-hud text-terracotta text-xs tracking-[0.3em] uppercase">
            {t('sections.projects.selectedWorks')}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium text-charcoal">
            <TextReveal text={t('sections.projects.projectArchive') as string} />
          </h2>
          <p className="text-charcoal-light font-sans text-sm max-w-md">
            {t('sections.projects.subtitleDesc')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-1.5 bg-surface/60 border border-charcoal/5 rounded-full shadow-sm">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-hud uppercase tracking-widest transition-all duration-300 cursor-none ${
                  activeFilter === filter.id
                    ? 'bg-charcoal text-sand shadow-md'
                    : 'text-charcoal-light hover:text-charcoal hover:bg-surface'
                }`}
                data-cursor="magnetic"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Projects;
