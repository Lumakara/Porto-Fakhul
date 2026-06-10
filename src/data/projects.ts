export type ProjectStatus = 'live' | 'in-progress' | 'archived' | 'concept';

// Real, active destinations. Swap the `live`/`demo` URLs below for per-project
// deployment URLs once each project is published.
const GITHUB_PROFILE = 'https://github.com/lumakara';
const PORTFOLIO_REPO = 'https://github.com/Lumakara/Porto-Fakhul';

export interface ProjectLink {
  label: string;
  href: string;
  type: 'live' | 'repo' | 'case-study' | 'demo';
}

export interface ProjectMetric {
  label: string;
  value: string;
}

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
  /** Bullet-point highlights of what the project delivers. */
  features: string[];
  /** Quantified outcomes shown as stat chips. */
  metrics: ProjectMetric[];
  /** External / internal links rendered as action buttons. */
  links: ProjectLink[];
  status: ProjectStatus;
  /** Year the project was built / shipped. */
  year: string;
  /** Role held on the project. */
  role: string;
  /** Short list of "screenshot" captions used to label preview frames. */
  screens: string[];
  color: string;
  gradient: string;
  /** Accent color (hex) used for badges, glows and tilt highlights. */
  accent: string;
  cyberId: string;
}

export const projectsData: Project[] = [
  {
    id: 'neo-tokyo',
    title: 'NEO-TOKYO FLUIDS',
    category: 'creative',
    categoryLabel: 'CREATIVE CORE',
    tagline: 'WebGL fluid-distortion simulation of neon rain ripples.',
    description:
      'A high-performance WebGL fluid canvas simulation replicating dark rain-slicked Tokyo streets reacting to mouse coordinates. Built as an interactive landing experience that turns cursor movement into living neon ripples.',
    tech: ['React Three Fiber', 'Three.js', 'GLSL Shaders', 'GSAP'],
    challenge:
      'Achieving stable 60fps on mobile touch interfaces while rendering complex vector fluid math in real-time.',
    solution:
      'Optimized fragment shaders by utilizing downscaled physics framebuffers and custom linear interpolation matrices, maintaining high-fidelity particle trails at low processing costs.',
    features: [
      'Real-time fluid simulation reacting to pointer velocity',
      'Adaptive resolution that scales with device GPU tier',
      'Bloom + chromatic aberration post-processing pass',
      'Touch and multi-pointer support for mobile',
    ],
    metrics: [
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Bundle', value: '142 KB' },
      { label: 'Lighthouse', value: '98' },
    ],
    links: [
      { label: 'Live Demo', href: GITHUB_PROFILE, type: 'live' },
      { label: 'Source', href: GITHUB_PROFILE, type: 'repo' },
    ],
    status: 'live',
    year: '2025',
    role: 'Creative Developer',
    screens: ['Landing ripple', 'Neon palette', 'Mobile view'],
    color: 'from-[#A3B19B] to-[#C68A7C]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #A3B19B 100%)',
    accent: '#C68A7C',
    cyberId: 'PRJ_NODE_09X',
  },
  {
    id: 'sakura-erp',
    title: 'SAKURA_CORE ERP',
    category: 'systems',
    categoryLabel: 'SYSTEM ARCHITECTURE',
    tagline: 'Accessible high-end enterprise resource command dashboard.',
    description:
      'A deeply optimized enterprise console incorporating accessible screen-reading attributes, keyboard controls, and real-time canvas charting. Designed to make dense operational data calm, legible and fully WCAG-compliant.',
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Recharts', 'ARIA'],
    challenge:
      'Satisfying extreme Web Accessibility (WCAG 2.1 AA) criteria while delivering deep sensory motion styling and complex dark aesthetics.',
    solution:
      'Engineered custom semantic ARIA focus-traps and styled fully customizable glowing borders using standard utility tokens that respect user high-contrast system requests.',
    features: [
      'Fully keyboard-navigable data tables and dialogs',
      'Live charts with reduced-motion fallbacks',
      'Role-based access control and audit trail',
      'Dark / high-contrast theming out of the box',
    ],
    metrics: [
      { label: 'WCAG', value: '2.1 AA' },
      { label: 'Widgets', value: '40+' },
      { label: 'Test Cov.', value: '92%' },
    ],
    links: [
      { label: 'Case Study', href: GITHUB_PROFILE, type: 'case-study' },
      { label: 'Source', href: GITHUB_PROFILE, type: 'repo' },
    ],
    status: 'in-progress',
    year: '2025',
    role: 'Frontend Architect',
    screens: ['Dashboard', 'Data tables', 'Settings'],
    color: 'from-[#C68A7C] to-[#D4AF37]',
    gradient: 'linear-gradient(135deg, #F5F2EB 0%, #C68A7C 100%)',
    accent: '#D4AF37',
    cyberId: 'PRJ_NODE_404',
  },
  {
    id: 'komorebi-os',
    title: 'KOMOREBI INTERFACE',
    category: 'creative',
    categoryLabel: 'CREATIVE CORE',
    tagline: 'Canvas-based operating system exploring organic natural physics.',
    description:
      'An interactive web portfolio layout inspired by forest light filtering through branches, utilizing physical particle colliders. A study in how nature-driven motion can make a UI feel alive without overwhelming the content.',
    tech: ['React', 'HTML5 Canvas', 'Framer Motion', 'Lenis Scroll'],
    challenge:
      'Simulating natural light particle scatter that sways organically in 2.5D space while responding to multi-scroll coordinates.',
    solution:
      'Crafted a customized vector gravity loop calculating shadow intersections on canvas layers synced smoothly with Lenis scroll positions.',
    features: [
      'Komorebi light-scatter particle field',
      'Scroll-linked parallax depth layers',
      'Custom spring cursor + magnetic hover',
      'Battery-aware particle throttling',
    ],
    metrics: [
      { label: 'Particles', value: '1.2k' },
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'CLS', value: '0.00' },
    ],
    links: [
      { label: 'Live Demo', href: GITHUB_PROFILE, type: 'live' },
      { label: 'Source', href: PORTFOLIO_REPO, type: 'repo' },
    ],
    status: 'live',
    year: '2024',
    role: 'Creative Developer',
    screens: ['Hero scatter', 'Scroll depth', 'Cursor'],
    color: 'from-[#A3B19B] to-[#F5F2EB]',
    gradient: 'linear-gradient(135deg, #FDFBF7 0%, #A3B19B 100%)',
    accent: '#A3B19B',
    cyberId: 'PRJ_NODE_77K',
  },
  {
    id: 'antigravity-cli',
    title: 'ANTIGRAVITY CONSOLE',
    category: 'lab',
    categoryLabel: 'RESEARCH LAB',
    tagline: 'Futuristic developer CLI automation suite and sandbox.',
    description:
      'An agentic console terminal helper designed to compile, debug, and manage code files in isolated local environments. A research playground for what a developer command center could feel like in the browser.',
    tech: ['React', 'Node.js', 'Xterm.js', 'TailwindCSS', 'WebSockets'],
    challenge:
      'Creating a highly secure, sandboxed terminal dashboard delivering real-time logs and process controls in active windows.',
    solution:
      'Established secure, authenticated WebSocket pipelines paired with lightweight Docker containers, providing instantaneous feedback loops.',
    features: [
      'In-browser terminal with command history',
      'Real-time log streaming over WebSockets',
      'Sandboxed container execution',
      'Command palette + keyboard-first UX',
    ],
    metrics: [
      { label: 'Latency', value: '<40ms' },
      { label: 'Commands', value: '60+' },
      { label: 'Uptime', value: '99.9%' },
    ],
    links: [
      { label: 'Demo', href: GITHUB_PROFILE, type: 'demo' },
      { label: 'Source', href: GITHUB_PROFILE, type: 'repo' },
    ],
    status: 'concept',
    year: '2026',
    role: 'Full-stack Tinkerer',
    screens: ['Terminal', 'Logs', 'Palette'],
    color: 'from-[#E5E2DA] to-[#2A2A2A]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #C68A7C 100%)',
    accent: '#4A4A4A',
    cyberId: 'PRJ_NODE_11B',
  },
];

const STATUS_META: Record<ProjectStatus, { label: string; color: string }> = {
  live: { label: 'Live', color: '#A3B19B' },
  'in-progress': { label: 'In Progress', color: '#D4AF37' },
  archived: { label: 'Archived', color: '#4A4A4A' },
  concept: { label: 'Concept', color: '#C68A7C' },
};

export function getStatusMeta(status: ProjectStatus) {
  return STATUS_META[status];
}