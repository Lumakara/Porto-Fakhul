import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Layers, Award, Eye, Accessibility, Database, GitBranch } from 'lucide-react';
import { Section, premiumEase, springEase, Parallax } from '../components/Section';

interface Skill {
  id: string;
  name: string;
  level: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'sakura' | 'cyber';
  primary?: boolean;
}

const skillsData: Skill[] = [
  {
    id: 'react',
    name: 'React / Next.js',
    level: 95,
    description: 'High-fidelity component architecture, hooks, state management, SSR & bundle optimization.',
    icon: Code,
    color: 'sakura',
    primary: true,
  },
  {
    id: 'motion',
    name: 'Motion Design',
    level: 92,
    description: 'Framer Motion, GSAP timelines, scroll-triggered choreography & spring physics.',
    icon: Award,
    color: 'cyber',
    primary: true,
  },
  {
    id: 'css',
    name: 'CSS / Tailwind',
    level: 95,
    description: 'Advanced layouts, fluid typography, design systems, responsive architecture.',
    icon: Layers,
    color: 'sakura',
    primary: true,
  },
  {
    id: 'ts',
    name: 'TypeScript',
    level: 90,
    description: 'Strict typing, generics, utility types, modular architectures.',
    icon: Cpu,
    color: 'cyber',
  },
  {
    id: 'webgl',
    name: 'Three.js / WebGL',
    level: 80,
    description: 'Interactive 3D, shaders, canvas rendering.',
    icon: Eye,
    color: 'sakura',
  },
  {
    id: 'a11y',
    name: 'Accessibility',
    level: 88,
    description: 'WCAG 2.1, ARIA, keyboard nav, screen readers.',
    icon: Accessibility,
    color: 'cyber',
  },
  {
    id: 'backend',
    name: 'Node.js / APIs',
    level: 85,
    description: 'REST APIs, WebSockets, Docker, serverless.',
    icon: Database,
    color: 'sakura',
  },
  {
    id: 'git',
    name: 'Git / CI-CD',
    level: 90,
    description: 'GitHub Actions, PR workflows, automated testing.',
    icon: GitBranch,
    color: 'cyber',
  },
];

const primarySkills = skillsData.filter(s => s.primary);
const secondarySkills = skillsData.filter(s => !s.primary);

export const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <Section id="skills" className="relative px-4 md:px-12">
      {/* Background */}
      <Parallax offset={60} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-purple opacity-25" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-7xl mx-auto z-10 relative">
        
        {/* Section Header — minimal left-aligned */}
        <div className="text-left mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="text-[10px] font-hud text-cyber tracking-[0.3em] uppercase block mb-4"
          >
            Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.1, ease: premiumEase }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-tight"
          >
            Technical
            <br />
            <span className="text-gradient-sakura">Matrix</span>
          </motion.h2>
        </div>

        {/* Primary Skills — Large cards, 3-column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {primarySkills.map((skill, idx) => {
            const Icon = skill.icon;
            const isHovered = hoveredSkill === skill.id;
            const accentColor = skill.color === 'sakura' ? 'sakura' : 'cyber';

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 40, rotateX: 10, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: idx * 0.15, ease: premiumEase }}
                style={{ perspective: 1000 }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className={`group relative bg-white/[0.02] border rounded-2xl p-7 md:p-8 text-left overflow-hidden transition-all duration-400 cursor-none min-h-[260px] flex flex-col justify-between ${
                  isHovered 
                    ? `border-${accentColor}/30 shadow-[0_0_30px_rgba(${skill.color === 'sakura' ? '255,117,151' : '0,240,255'},0.08)]` 
                    : 'border-white/5 hover:border-white/10'
                }`}
                data-cursor="magnetic"
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                  skill.color === 'sakura' ? 'via-sakura/40' : 'via-cyber/40'
                } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div>
                  {/* Icon + level */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${
                      isHovered
                        ? skill.color === 'sakura' ? 'bg-sakura/10 border-sakura/20' : 'bg-cyber/10 border-cyber/20'
                        : 'bg-white/[0.03] border-white/5'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${
                        isHovered 
                          ? skill.color === 'sakura' ? 'text-sakura' : 'text-cyber' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`text-3xl font-display font-black transition-colors duration-300 ${
                      isHovered 
                        ? skill.color === 'sakura' ? 'text-sakura/40' : 'text-cyber/40' 
                        : 'text-white/5'
                    }`}>
                      {skill.level}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg md:text-xl font-display font-bold text-white tracking-wide mb-2">
                    {skill.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 font-sans leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div 
                    className="w-full h-1 bg-white/5 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={skill.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} proficiency level`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.4, ease: springEase }}
                      className={`h-full rounded-full ${
                        skill.color === 'sakura' ? 'bg-sakura' : 'bg-cyber'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Skills — Compact horizontal strip */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8"
        >
          <span className="text-[10px] font-hud text-gray-500 tracking-widest uppercase block mb-5">
            Also proficient in
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {secondarySkills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.id}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 cursor-none"
                  data-cursor="magnetic"
                >
                  <Icon className={`w-4 h-4 text-gray-500 group-hover:${
                    skill.color === 'sakura' ? 'text-sakura' : 'text-cyber'
                  } transition-colors duration-300`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-display font-medium text-white">{skill.name}</span>
                    <span className="text-[10px] text-gray-500 font-hud">{skill.level}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
export default Skills;
