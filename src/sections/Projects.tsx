import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Laptop, Terminal, X } from 'lucide-react';
import { Section, TextReveal, premiumEase } from '../components/Section';
import { Magnetic } from '../components/Magnetic';
import { useTranslation } from '../i18n/index';

const projectsMeta = [
  {
    id: 'neo-tokyo',
    category: 'creative' as const,
    tech: ['React Three Fiber', 'Three.js', 'GLSL Shaders', 'GSAP'],
    color: 'from-[#A3B19B] to-[#C68A7C]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #A3B19B 100%)',
    cyberId: 'PRJ_NODE_09X',
  },
  {
    id: 'sakura-erp',
    category: 'systems' as const,
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Recharts', 'Aria-Specs'],
    color: 'from-[#C68A7C] to-[#D4AF37]',
    gradient: 'linear-gradient(135deg, #F5F2EB 0%, #C68A7C 100%)',
    cyberId: 'PRJ_NODE_404',
  },
  {
    id: 'komorebi-os',
    category: 'creative' as const,
    tech: ['React', 'HTML5 Canvas', 'Framer Motion', 'Lenis Scroll'],
    color: 'from-[#A3B19B] to-[#F5F2EB]',
    gradient: 'linear-gradient(135deg, #FDFBF7 0%, #A3B19B 100%)',
    cyberId: 'PRJ_NODE_77K',
  },
  {
    id: 'antigravity-cli',
    category: 'lab' as const,
    tech: ['React', 'NodeJS', 'Xterm.js', 'TailwindCSS', 'WebSockets'],
    color: 'from-[#E5E2DA] to-[#2A2A2A]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #C68A7C 100%)',
    cyberId: 'PRJ_NODE_11B',
  },
];

/* ─── Card sub-component ─── */
interface ProjectCardProps {
  index: number;
  layout: 'featured' | 'standard' | 'horizontal';
  onClick: () => void;
  title: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  gradient: string;
  cyberId: string;
  tech: string[];
  viewLabel: string;
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

const ProjectCard = ({ index, layout, onClick, title, categoryLabel, tagline, description, gradient, cyberId, tech, viewLabel }: ProjectCardProps) => {
  const isFeatured = layout === 'featured';

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
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-charcoal/5 hover:border-charcoal/20 hover:shadow-lg transition-all duration-500 cursor-none bg-white/70 ${wrapperClasses[layout]}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${viewLabel} ${title}`}
      data-cursor="text"
      data-cursor-text="VIEW"
    >
      <div className={`flex flex-col ${innerLayout[layout]} h-full`}>
        {/* Visual Preview Area */}
        <div
          className={`relative overflow-hidden ${visualSize[layout]}`}
          style={{ background: gradient }}
        >
          <div className="absolute inset-0 bg-sand/30" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className={`font-display font-medium text-charcoal opacity-[0.08] leading-none whitespace-nowrap ${watermarkSize[layout]}`}>
              {title}
            </span>
          </div>
          <div className="absolute inset-0 bg-charcoal/5 mix-blend-overlay" />
          <motion.div
            className="absolute inset-0"
            style={{ background: gradient }}
            initial={false}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/80 border border-charcoal/10 text-[9px] font-hud text-charcoal font-medium uppercase tracking-widest backdrop-blur-sm shadow-sm">
              {categoryLabel}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
            <div className="w-9 h-9 rounded-full bg-white border border-charcoal/10 flex items-center justify-center backdrop-blur-sm shadow-sm">
              <ArrowUpRight className="w-4 h-4 text-charcoal" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex flex-col justify-between p-5 md:p-6 ${contentSize[layout]} ${isFeatured ? 'md:py-8 md:px-8' : ''}`}>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 font-hud text-[9px] text-sage tracking-widest">
              <Terminal className="w-3 h-3" />
              <span>{cyberId}</span>
            </div>
            <h3 className={`font-display font-medium text-charcoal tracking-wide leading-tight group-hover:text-terracotta transition-colors duration-300 ${titleSize[layout]}`}>
              {title}
            </h3>
            <p className="font-sans text-charcoal-light text-sm leading-relaxed line-clamp-2">
              {tagline}
            </p>
            {isFeatured && (
              <p className="font-sans text-charcoal-light/80 text-xs leading-relaxed line-clamp-3 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5">
            {tech.map((techItem) => (
              <span
                key={techItem}
                className="px-2 py-0.5 rounded bg-white border border-charcoal/10 text-[9px] font-hud text-charcoal-light uppercase tracking-wider"
              >
                {techItem}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/0 to-transparent group-hover:via-terracotta/40 transition-all duration-700" />
    </motion.div>
  );
};

/* ─── Main Section ─── */
export const Projects = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedIdx !== null) {
        setSelectedIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  const layouts: Array<'featured' | 'standard' | 'standard' | 'horizontal'> = ['featured', 'standard', 'standard', 'horizontal'];

  return (
    <Section id="projects" className="min-h-screen relative px-4 md:px-12 bg-sand">
      <div className="absolute inset-0 bg-aurora-sakura opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-aurora-cyber opacity-30 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="w-full max-w-7xl flex flex-col space-y-12 md:space-y-16 z-10 mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="font-hud text-terracotta text-xs tracking-[0.3em] uppercase">
            {t('projects.sectionLabel')}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium text-charcoal">
            <TextReveal text={t('projects.title')} />
          </h2>
          <p className="text-charcoal-light font-sans text-sm max-w-md">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsMeta.map((meta, idx) => (
            <ProjectCard
              key={meta.id}
              index={idx}
              layout={layouts[idx]}
              onClick={() => setSelectedIdx(idx)}
              title={t(`projects.items.${idx}.title`)}
              categoryLabel={t(`projects.items.${idx}.categoryLabel`)}
              tagline={t(`projects.items.${idx}.tagline`)}
              description={t(`projects.items.${idx}.description`)}
              gradient={meta.gradient}
              cyberId={meta.cyberId}
              tech={meta.tech}
              viewLabel={t('projects.modal.viewLabel')}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="absolute inset-0 bg-sand/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40, rotateX: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: -20, rotateX: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: premiumEase }}
              style={{ perspective: 1000 }}
              className="w-full max-w-2xl bg-white/95 border border-charcoal/10 rounded-2xl p-6 md:p-8 text-left z-10 glassmorphism-cyber relative overflow-hidden font-sans max-h-[90vh] overflow-y-auto transform-style-3d shadow-xl"
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-sage/10 rounded-full blur-[80px] pointer-events-none" />

              <button
                onClick={() => setSelectedIdx(null)}
                aria-label={t('projects.modal.closeLabel')}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sand border border-charcoal/10 flex items-center justify-center text-charcoal cursor-none hover:bg-terracotta hover:text-white transition-colors duration-300"
                data-cursor="magnetic"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="font-hud text-[9px] text-sage flex items-center space-x-2 mb-6">
                <Laptop className="w-4 h-4 text-sage" />
                <span className="tracking-widest uppercase">
                  {t(`projects.items.${selectedIdx}.categoryLabel`)} // {projectsMeta[selectedIdx].cyberId}
                </span>
              </div>

              <div className="flex flex-col space-y-1 mb-6">
                <h3 className="text-2xl md:text-3xl font-medium font-display text-charcoal tracking-wide uppercase">
                  {t(`projects.items.${selectedIdx}.title`)}
                </h3>
                <p className="text-xs font-hud text-terracotta uppercase tracking-widest">
                  {t(`projects.items.${selectedIdx}.tagline`)}
                </p>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex flex-col space-y-2">
                  <span className="font-hud text-[10px] text-charcoal-light uppercase tracking-widest border-b border-charcoal/10 pb-1 w-fit">
                    {t('projects.modal.overview')}
                  </span>
                  <p className="text-charcoal leading-relaxed font-sans">
                    {t(`projects.items.${selectedIdx}.description`)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <span className="font-hud text-[10px] text-charcoal-light uppercase tracking-widest border-b border-charcoal/10 pb-1 w-fit">
                      {t('projects.modal.challenge')}
                    </span>
                    <p className="text-charcoal-light text-xs leading-relaxed font-sans">
                      {t(`projects.items.${selectedIdx}.challenge`)}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-hud text-[10px] text-charcoal-light uppercase tracking-widest border-b border-charcoal/10 pb-1 w-fit">
                      {t('projects.modal.solution')}
                    </span>
                    <p className="text-charcoal-light text-xs leading-relaxed font-sans">
                      {t(`projects.items.${selectedIdx}.solution`)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <span className="font-hud text-[10px] text-charcoal-light uppercase tracking-widest border-b border-charcoal/10 pb-1 w-fit">
                    {t('projects.modal.tech')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {projectsMeta[selectedIdx].tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="px-3 py-1 rounded-md bg-white border border-charcoal/10 text-[10px] font-hud text-charcoal uppercase tracking-wider shadow-sm"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-charcoal/10 flex justify-between items-center text-xs font-hud">
                <span className="text-[8px] text-charcoal-light select-none uppercase">
                  {t('projects.modal.footer')}
                </span>
                <Magnetic range={0.3}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center space-x-2 bg-charcoal text-white px-4 py-2 rounded-full font-medium cursor-none hover:bg-terracotta hover:shadow-md transition-all duration-300"
                    data-cursor="magnetic"
                  >
                    <span>{t('projects.modal.launch')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Projects;
