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
  features: string[];
  results: string[];
  role: string;
  duration: string;
  links: { live?: string; github?: string };
  screenshots: string[];
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
    description:
      'A high-performance WebGL fluid canvas simulation replicating dark rain-slicked Tokyo streets reacting to mouse coordinates. The project pushes the boundaries of real-time GPU rendering on the web, combining fluid dynamics math with artistic direction inspired by cyberpunk aesthetics.\n\nBuilt as an interactive art piece, it demonstrates how modern fragment shaders can create photorealistic water simulations entirely in the browser, targeting 60fps even on mid-range mobile devices.',
    tech: ['React Three Fiber', 'Three.js', 'GLSL Shaders', 'GSAP', 'WebGL 2.0'],
    challenge:
      'Achieving stable 60fps on mobile touch interfaces while rendering complex vector fluid math in real-time. The physics simulation required thousands of particles interacting with each other and the environment simultaneously, causing severe frame drops on anything below flagship hardware.',
    solution:
      'Optimized fragment shaders by utilizing downscaled physics framebuffers and custom linear interpolation matrices, maintaining high-fidelity particle trails at low processing costs. Implemented adaptive quality scaling that detects device capability and adjusts simulation complexity in real-time.',
    features: [
      'Real-time fluid dynamics with mouse/touch interaction',
      'Adaptive quality scaling based on device capability',
      'Custom GLSL shaders for neon light refraction',
      'Physics-based particle system with collision detection',
      'Responsive design from mobile to 4K displays',
      'GPU-accelerated rendering pipeline',
    ],
    results: [
      '60fps on iPhone 13+',
      '95 Lighthouse performance score',
      '< 2s initial load time',
      '50K+ monthly visitors',
    ],
    role: 'Lead Developer & Creative Director',
    duration: '3 months (2024)',
    links: { live: 'https://neo-tokyo-fluids.example.com', github: 'https://github.com/example/neo-tokyo' },
    screenshots: [
      'https://picsum.photos/seed/neo-tokyo-1/800/500',
      'https://picsum.photos/seed/neo-tokyo-2/800/500',
      'https://picsum.photos/seed/neo-tokyo-3/800/500',
    ],
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
    description:
      'A deeply optimized enterprise console incorporating accessible screen-reading attributes, keyboard controls, and real-time canvas charting. Designed to handle complex data visualization workflows for teams managing thousands of records daily.\n\nThe system architecture prioritizes both performance and accessibility, proving that enterprise software does not have to sacrifice aesthetics for compliance. Every interaction is keyboard-navigable and screen-reader compatible.',
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Recharts', 'Aria-Specs', 'Zustand'],
    challenge:
      'Satisfying extreme Web Accessibility (WCAG 2.1 AA) criteria while delivering deep sensory motion styling and complex dark aesthetics. The dashboard needed to render 10,000+ data points in charts without blocking the main thread.',
    solution:
      'Engineered custom semantic ARIA focus-traps and styled fully customizable glowing borders using standard utility tokens that respect user high-contrast system requests. Implemented virtualized rendering for large data sets and Web Workers for heavy data processing.',
    features: [
      'Full WCAG 2.1 AA accessibility compliance',
      'Real-time data visualization with 10K+ data points',
      'Custom keyboard navigation system',
      'Dark/light theme with high-contrast mode',
      'Virtualized tables handling 50K+ rows',
    ],
    results: [
      '100% WCAG 2.1 AA compliance',
      '< 100ms interaction latency',
      '40% reduction in task completion time',
      '98% user satisfaction score',
    ],
    role: 'Frontend Architect',
    duration: '5 months (2024)',
    links: { live: 'https://sakura-erp.example.com' },
    screenshots: [
      'https://picsum.photos/seed/sakura-erp-1/800/500',
      'https://picsum.photos/seed/sakura-erp-2/800/500',
      'https://picsum.photos/seed/sakura-erp-3/800/500',
    ],
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
    description:
      'An interactive web portfolio layout inspired by forest light filtering through branches, utilizing physical particle colliders. The project explores the intersection of nature-inspired design and digital interaction.\n\nEvery element responds to user presence with organic animations that mimic sunlight dappling through leaves, creating a meditative browsing experience that stands apart from conventional portfolio designs.',
    tech: ['React', 'HTML5 Canvas', 'Framer Motion', 'Lenis Scroll', 'Web Audio API'],
    challenge:
      'Simulating natural light particle scatter that sways organically in 2.5D space while responding to multi-scroll coordinates. The challenge was achieving the organic feel without pre-baked animations, requiring real-time physics calculations.',
    solution:
      'Crafted a customized vector gravity loop calculating shadow intersections on canvas layers synced smoothly with Lenis scroll positions. Used requestAnimationFrame batching to prevent jank during complex particle interactions.',
    features: [
      'Physics-based particle light simulation',
      'Scroll-synchronized parallax depth layers',
      'Ambient sound design reactive to interactions',
      'Organic easing curves mimicking natural movement',
      'Progressive enhancement for low-end devices',
    ],
    results: [
      '60fps smooth scrolling',
      'Featured on Awwwards SOTD',
      '3.2s avg session duration increase',
      '92 Lighthouse score',
    ],
    role: 'Creative Developer',
    duration: '2 months (2024)',
    links: { live: 'https://komorebi.example.com', github: 'https://github.com/example/komorebi' },
    screenshots: [
      'https://picsum.photos/seed/komorebi-1/800/500',
      'https://picsum.photos/seed/komorebi-2/800/500',
      'https://picsum.photos/seed/komorebi-3/800/500',
    ],
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
    description:
      'An agentic console terminal helper designed to compile, debug, and manage code files in isolated local environments. Built for developers who want a next-generation terminal experience with intelligent code analysis.\n\nThe system provides real-time syntax highlighting, intelligent autocompletion, and sandboxed execution environments that prevent accidental system modifications while maintaining full development capability.',
    tech: ['React', 'NodeJS', 'Xterm.js', 'TailwindCSS', 'WebSockets', 'Docker API'],
    challenge:
      'Creating a highly secure, sandboxed terminal dashboard delivering real-time logs and process controls in active windows. Each user session needed complete isolation while maintaining sub-50ms response times.',
    solution:
      'Established secure, authenticated WebSocket pipelines paired with lightweight Docker containers, providing instantaneous feedback loops. Implemented connection pooling and session persistence for seamless reconnections.',
    features: [
      'Sandboxed code execution environments',
      'Real-time syntax highlighting and linting',
      'Multi-session terminal management',
      'Intelligent command autocompletion',
      'Git integration with visual diff viewer',
      'Plugin system for custom extensions',
    ],
    results: [
      '< 50ms command response time',
      '99.9% uptime over 6 months',
      '2000+ active daily users',
      'Zero security breaches',
    ],
    role: 'Full-Stack Developer',
    duration: '4 months (2024)',
    links: { github: 'https://github.com/example/antigravity-cli' },
    screenshots: [
      'https://picsum.photos/seed/antigravity-1/800/500',
      'https://picsum.photos/seed/antigravity-2/800/500',
      'https://picsum.photos/seed/antigravity-3/800/500',
    ],
    color: 'from-[#E5E2DA] to-[#2A2A2A]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #C68A7C 100%)',
    cyberId: 'PRJ_NODE_11B',
  },
  {
    id: 'zen-analytics',
    title: 'ZEN ANALYTICS',
    category: 'systems',
    categoryLabel: 'SYSTEM ARCHITECTURE',
    tagline: 'Minimalist real-time analytics dashboard with predictive insights.',
    description:
      'A clean, distraction-free analytics platform that transforms complex data streams into actionable insights. Designed for teams drowning in dashboard noise, Zen Analytics strips away unnecessary complexity while retaining depth.\n\nThe platform processes millions of events per day, presenting them through carefully designed visualizations that surface anomalies and trends without overwhelming the user. Machine learning models provide predictive forecasting directly in the UI.',
    tech: ['Next.js', 'TypeScript', 'D3.js', 'TensorFlow.js', 'PostgreSQL', 'Redis'],
    challenge:
      'Processing and visualizing millions of real-time events without UI lag. Traditional charting libraries could not handle the data volume at the required update frequency of 1 second intervals.',
    solution:
      'Built a custom streaming data pipeline using WebSocket connections with intelligent data aggregation on the server. Implemented canvas-based rendering for charts instead of SVG, achieving 10x better performance with large datasets.',
    features: [
      'Real-time event processing at 1M+ events/day',
      'ML-powered anomaly detection and forecasting',
      'Custom canvas-based chart rendering engine',
      'Collaborative dashboards with live cursors',
      'Export to PDF/CSV with scheduled reports',
    ],
    results: [
      '10x faster than previous solution',
      '1M+ events processed daily',
      '< 200ms end-to-end latency',
      '35% faster decision-making',
    ],
    role: 'Lead Frontend Engineer',
    duration: '6 months (2023-2024)',
    links: { live: 'https://zen-analytics.example.com' },
    screenshots: [
      'https://picsum.photos/seed/zen-analytics-1/800/500',
      'https://picsum.photos/seed/zen-analytics-2/800/500',
      'https://picsum.photos/seed/zen-analytics-3/800/500',
    ],
    color: 'from-[#D4AF37] to-[#A3B19B]',
    gradient: 'linear-gradient(135deg, #F5F2EB 0%, #D4AF37 80%)',
    cyberId: 'PRJ_NODE_55Z',
  },
  {
    id: 'pulse-motion',
    title: 'PULSE MOTION LAB',
    category: 'lab',
    categoryLabel: 'RESEARCH LAB',
    tagline: 'Experimental motion design toolkit for web animations.',
    description:
      'A research project exploring the boundaries of web animation performance. Pulse Motion Lab provides a toolkit of reusable animation primitives that achieve buttery-smooth 60fps transitions while maintaining tiny bundle sizes.\n\nThe library challenges the assumption that rich animations require heavy JavaScript frameworks. By leveraging CSS Houdini, Web Animations API, and intelligent fallbacks, it delivers premium motion experiences with near-zero runtime cost.',
    tech: ['TypeScript', 'CSS Houdini', 'Web Animations API', 'Vite', 'Storybook'],
    challenge:
      'Creating a motion library that rivals Framer Motion in capability while being 10x smaller in bundle size. The challenge was maintaining developer ergonomics and an intuitive API while pushing performance boundaries.',
    solution:
      'Leveraged CSS Houdini for custom properties and paint worklets, falling back to Web Animations API where Houdini is not supported. The architecture uses code-splitting so developers only pay for the animations they actually use.',
    features: [
      'Tree-shakeable animation primitives',
      'CSS Houdini paint worklets for custom effects',
      'Spring physics with configurable parameters',
      'Gesture recognition (drag, pinch, swipe)',
      'Accessibility-first with prefers-reduced-motion',
      'Storybook documentation with live examples',
    ],
    results: [
      '< 3KB gzipped core bundle',
      '60fps on low-end Android devices',
      '500+ GitHub stars in first month',
      '0 runtime dependencies',
    ],
    role: 'Creator & Maintainer',
    duration: '3 months (2024)',
    links: { live: 'https://pulse-motion.example.com', github: 'https://github.com/example/pulse-motion' },
    screenshots: [
      'https://picsum.photos/seed/pulse-motion-1/800/500',
      'https://picsum.photos/seed/pulse-motion-2/800/500',
      'https://picsum.photos/seed/pulse-motion-3/800/500',
    ],
    color: 'from-[#C68A7C] to-[#A3B19B]',
    gradient: 'linear-gradient(135deg, #FDFBF7 0%, #C68A7C 80%)',
    cyberId: 'PRJ_NODE_88P',
  },
];
