export interface Project {
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

export const projectsData: Project[] = [
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
    color: 'from-[#A3B19B] to-[#C68A7C]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #A3B19B 100%)',
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
    color: 'from-[#C68A7C] to-[#D4AF37]',
    gradient: 'linear-gradient(135deg, #F5F2EB 0%, #C68A7C 100%)',
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
    color: 'from-[#A3B19B] to-[#F5F2EB]',
    gradient: 'linear-gradient(135deg, #FDFBF7 0%, #A3B19B 100%)',
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
    color: 'from-[#E5E2DA] to-[#2A2A2A]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #C68A7C 100%)',
    cyberId: 'PRJ_NODE_11B',
  },
];
