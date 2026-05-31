import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Laptop, Terminal, X } from 'lucide-react';
import { Section, TextReveal, premiumEase } from '../components/Section';
import { Magnetic } from '../components/Magnetic';

interface Project {
  id: string;
  title: string;
  category: 'creative' | 'systems' | 'lab';
  categoryLabel: string;
  tagline: string;
  description: string;
  tech: string[];
  challenge: string;
  solution: string;
  color: string;
  gradient: string;
  cyberId: string;
}

const projectsData: Project[] = [
  {
    id: 'neo-tokyo',
    title: 'NEO-TOKYO FLUIDS',
    category: 'creative',
    categoryLabel: 'CREATIVE CORE',
    tagline: 'WebGL fluid-distortion simulation of neon rain ripples.',
    description: 'A high-performance WebGL fluid canvas simulation replicating dark rain-slicked Tokyo streets reacting to mouse coordinates.',
    tech: ['React Three Fiber', 'Three.js', 'GLSL Shaders', 'GSAP'],
    challenge: 'Achieving stable 60fps on mobile touch interfaces while rendering complex vector fluid math in real-time.',
    solution: 'Optimized fragment shaders by utilizing downscaled physics framebuffers and custom linear interpolation matrices, maintaining high-fidelity particle trails at low processing costs.',
    color: 'from-[#ff7597] to-[#8b5cf6]',
    gradient: 'linear-gradient(135deg, #ff7597 0%, #8b5cf6 50%, #4c1d95 100%)',
    cyberId: 'PRJ_NODE_09X',
  },
  {
    id: 'sakura-erp',
    title: 'SAKURA_CORE ERP',
    category: 'systems',
    categoryLabel: 'SYSTEM ARCHITECTURE',
    tagline: 'Accessible high-end enterprise resource command dashboard.',
    description: 'A deeply optimized enterprise console incorporating accessible screen-reading attributes, keyboard controls, and real-time canvas charting.',
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Recharts', 'Aria-Specs'],
    challenge: 'Satisfying extreme Web Accessibility (WCAG 2.1 AA) criteria while delivering deep sensory motion styling and complex dark aesthetics.',
    solution: 'Engineered custom semantic ARIA focus-traps and styled fully customizable glowing borders using standard utility tokens that respect user high-contrast system requests.',
    color: 'from-[#8b5cf6] to-[#00f0ff]',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #00f0ff 50%, #0e7490 100%)',
    cyberId: 'PRJ_NODE_404',
  },
  {
    id: 'komorebi-os',
    title: 'KOMOREBI INTERFACE',
    category: 'creative',
    categoryLabel: 'CREATIVE CORE',
    tagline: 'Canvas-based operating system exploring organic natural physics.',
    description: 'An interactive web portfolio layout inspired by forest light filtering through branches, utilizing physical particle colliders.',
    tech: ['React', 'HTML5 Canvas', 'Framer Motion', 'Lenis Scroll'],
    challenge: 'Simulating natural light particle scatter that sways organically in 2.5D space while responding to multi-scroll coordinates.',
    solution: 'Crafted a customized vector gravity loop calculating shadow intersections on canvas layers synced smoothly with Lenis scroll positions.',
    color: 'from-[#00f0ff] to-[#10b981]',
    gradient: 'linear-gradient(135deg, #00f0ff 0%, #10b981 50%, #065f46 100%)',
    cyberId: 'PRJ_NODE_77K',
  },
  {
    id: 'antigravity-cli',
    title: 'ANTIGRAVITY CONSOLE',
    category: 'lab',
    categoryLabel: 'RESEARCH LAB',
    tagline: 'Futuristic developer CLI automation suite and sandbox.',
    description: 'An agentic console terminal helper designed to compile, debug, and manage code files in isolated local environments.',
    tech: ['React', 'NodeJS', 'Xterm.js', 'TailwindCSS', 'WebSockets'],
    challenge: 'Creating a highly secure, sandboxed terminal dashboard delivering real-time logs and process controls in active windows.',
    solution: 'Established secure, authenticated WebSocket pipelines paired with lightweight Docker containers, providing instantaneous feedback loops.',
    color: 'from-[#ff7597] to-[#00f0ff]',
    gradient: 'linear-gradient(135deg, #ff7597 0%, #00f0ff 50%, #0e7490 100%)',
    cyberId: 'PRJ_NODE_11B',
  },
];

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

  /* Layout-aware class maps */
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-sakura/10 hover:border-cyber/30 transition-all duration-500 cursor-none ${wrapperClasses[layout]}`}
      style={{ background: 'rgba(18, 15, 28, 0.45)' }}
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
      <div className={`flex flex-col ${innerLayout[layout]} h-full`}>
        {/* ── Visual Preview Area ── */}
        <div
          className={`relative overflow-hidden ${visualSize[layout]}`}
          style={{ background: project.gradient }}
        >
          {/* Dark overlay so watermark shows subtly */}
          <div className="absolute inset-0 bg-space-black/40" />

          {/* Ghosted watermark title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className={`font-display font-black text-white opacity-[0.08] leading-none whitespace-nowrap ${watermarkSize[layout]}`}
            >
              {project.title}
            </span>
          </div>

          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-space-black/10 mix-blend-overlay" />

          {/* Hover scale animation on gradient area */}
          <motion.div
            className="absolute inset-0"
            style={{ background: project.gradient }}
            initial={false}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] as any }}
          />

          {/* Category pill – top-left */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-2.5 py-1 rounded-full bg-space-black/60 border border-white/10 text-[9px] font-hud text-white/80 uppercase tracking-widest backdrop-blur-sm">
              {project.categoryLabel}
            </span>
          </div>

          {/* Arrow icon – top-right, appears on hover */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
            <div className="w-9 h-9 rounded-full bg-space-black/60 border border-cyber/40 flex items-center justify-center backdrop-blur-sm">
              <ArrowUpRight className="w-4 h-4 text-cyber" />
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className={`flex flex-col justify-between p-5 md:p-6 ${contentSize[layout]} ${isFeatured ? 'md:py-8 md:px-8' : ''}`}>
          <div className="flex flex-col space-y-3">
            {/* Cyber ID */}
            <div className="flex items-center space-x-2 font-hud text-[9px] text-cyber/60 tracking-widest">
              <Terminal className="w-3 h-3" />
              <span>{project.cyberId}</span>
            </div>

            {/* Title */}
            <h3 className={`font-display font-black text-white tracking-wide leading-tight group-hover:text-cyber transition-colors duration-300 ${titleSize[layout]}`}>
              {project.title}
            </h3>

            {/* Tagline */}
            <p className="font-sans text-gray-400 text-sm leading-relaxed line-clamp-2">
              {project.tagline}
            </p>

            {/* Extended description for featured card */}
            {isFeatured && (
              <p className="font-sans text-gray-500 text-xs leading-relaxed line-clamp-3 mt-1">
                {project.description}
              </p>
            )}
          </div>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5 mt-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-space-black/60 border border-white/5 text-[9px] font-hud text-gray-500 uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom hover glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber/0 to-transparent group-hover:via-cyber/40 transition-all duration-700" />
    </motion.div>
  );
};

/* ─── Main Section ─── */
export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Keyboard accessibility: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <Section id="projects" className="min-h-screen relative px-4 md:px-12 bg-space-black">
      {/* Aurora glow overlays */}
      <div className="absolute inset-0 bg-aurora-sakura opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-aurora-cyber opacity-30 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="w-full max-w-7xl flex flex-col space-y-12 md:space-y-16 z-10">

        {/* ── Section Header – Centered ── */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="font-hud text-cyber text-xs tracking-[0.3em] uppercase">
            SELECTED WORKS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white">
            <TextReveal text="PROJECT ARCHIVE" />
          </h2>
          <p className="text-gray-400 font-sans text-sm max-w-md">
            Curated selection of creative and technical projects
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 1 – Featured full-width */}
          <ProjectCard
            project={projectsData[0]}
            index={0}
            layout="featured"
            onClick={() => setSelectedProject(projectsData[0])}
          />

          {/* Projects 2 & 3 – Two equal columns */}
          <ProjectCard
            project={projectsData[1]}
            index={1}
            layout="standard"
            onClick={() => setSelectedProject(projectsData[1])}
          />
          <ProjectCard
            project={projectsData[2]}
            index={2}
            layout="standard"
            onClick={() => setSelectedProject(projectsData[2])}
          />

          {/* Project 4 – Full-width horizontal */}
          <ProjectCard
            project={projectsData[3]}
            index={3}
            layout="horizontal"
            onClick={() => setSelectedProject(projectsData[3])}
          />
        </div>
      </div>

      {/* ── Holographic Details Panel Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-space-black/85 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40, rotateX: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: -20, rotateX: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: premiumEase }}
              style={{ perspective: 1000 }}
              className="w-full max-w-2xl bg-space-deep/90 border border-cyber/30 rounded-2xl p-6 md:p-8 text-left z-10 glassmorphism-cyber relative overflow-hidden font-sans max-h-[90vh] overflow-y-auto transform-style-3d"
            >
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-cyber/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Close */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-space-black/60 border border-cyber/35 flex items-center justify-center text-white cursor-none hover:border-sakura hover:text-sakura transition-colors duration-300"
                data-cursor="magnetic"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Telemetry */}
              <div className="font-hud text-[9px] text-cyber/80 flex items-center space-x-2 mb-6">
                <Laptop className="w-4 h-4 text-cyber" />
                <span className="tracking-widest uppercase">{selectedProject.categoryLabel} // {selectedProject.cyberId}</span>
              </div>

              {/* Title & Tagline */}
              <div className="flex flex-col space-y-1 mb-6">
                <h3 className="text-2xl md:text-3xl font-black font-display text-white tracking-wide uppercase">
                  {selectedProject.title}
                </h3>
                <p className="text-xs font-hud text-sakura text-glow-sakura uppercase tracking-widest">
                  {selectedProject.tagline}
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-6 text-sm">
                <div className="flex flex-col space-y-2">
                  <span className="font-hud text-[10px] text-gray-500 uppercase tracking-widest border-b border-sakura/10 pb-1 w-fit">
                    01 // PROJECT OVERVIEW
                  </span>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <span className="font-hud text-[10px] text-gray-500 uppercase tracking-widest border-b border-sakura/10 pb-1 w-fit">
                      02 // TECHNICAL CHALLENGE
                    </span>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      {selectedProject.challenge}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <span className="font-hud text-[10px] text-gray-500 uppercase tracking-widest border-b border-sakura/10 pb-1 w-fit">
                      03 // ENGINEERING SOLUTION
                    </span>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Tech specs */}
                <div className="flex flex-col space-y-3">
                  <span className="font-hud text-[10px] text-gray-500 uppercase tracking-widest border-b border-sakura/10 pb-1 w-fit">
                    04 // INTEGRATED CORE ARCHITECTURE
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-md bg-space-black border border-glass-border text-[10px] font-hud text-white uppercase tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="mt-8 pt-6 border-t border-sakura/15 flex justify-between items-center text-xs font-hud">
                <span className="text-[8px] text-gray-500 select-none uppercase">
                  ACTIVE_LINK_SECURE // GEMINI_SYS
                </span>

                <Magnetic range={0.3}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center space-x-2 bg-sakura/20 text-sakura border border-sakura/35 px-4 py-2 rounded-full font-bold text-glow-sakura cursor-none hover:bg-sakura/30 hover:border-sakura transition-all duration-300"
                    data-cursor="magnetic"
                  >
                    <span>LAUNCH_SITE</span>
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
