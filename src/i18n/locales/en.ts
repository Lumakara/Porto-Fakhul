export interface LocaleMessages {
  nav: {
    home: string;
    about: string;
    projects: string;
    skills: string;
    contact: string;
    status: string;
    mobileLocation: string;
    mobileRole: string;
    portfolio: string;
    tableOfContents: string;
  };
  hero: {
    kicker: string;
    headlineWhere: string;
    headlineCreativity: string;
    headlineMeetsTechnology: string;
    description: string;
    ctaProjects: string;
    ctaContact: string;
    stats: {
      yearsExp: string;
      organizations: string;
      projects: string;
    };
  };
  marquee: {
    roles: string[];
    skills: string[];
  };
  about: {
    sectionLabel: string;
    name: string;
    nameSuffix: string;
    role: string;
    bio: string;
    pills: {
      location: string;
      experience: string;
      trait: string;
    };
    tabs: {
      story: string;
      experience: string;
      approach: string;
    };
    story: {
      title: string;
      paragraphs: string[];
    };
    experience: {
      entries: Array<{
        company: string;
        period: string;
        role: string;
        description: string;
      }>;
    };
    approach: {
      title: string;
      items: Array<{
        num: string;
        title: string;
        desc: string;
      }>;
    };
  };
  projects: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    modal: {
      overview: string;
      challenge: string;
      solution: string;
      tech: string;
      footer: string;
      launch: string;
      closeLabel: string;
      viewLabel: string;
    };
    items: Array<{
      title: string;
      categoryLabel: string;
      tagline: string;
      description: string;
      challenge: string;
      solution: string;
    }>;
  };
  skills: {
    sectionLabel: string;
    title: string;
    titleSuffix: string;
    alsoProficient: string;
    items: Array<{
      name: string;
      description: string;
    }>;
  };
  contact: {
    sectionLabel: string;
    title: string;
    titleSuffix: string;
    description: string;
    location: {
      label: string;
      value: string;
    };
    email: {
      label: string;
    };
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
    };
    sending: {
      title: string;
      processing: string;
    };
    consoleLogs: string[];
    success: {
      title: string;
      description: string;
      sendAnother: string;
    };
    error: {
      transmissionFailed: string;
    };
    consoleDone: string;
    consoleInit: string;
  };
  footer: {
    readyLabel: string;
    title: string;
    titleSuffix: string;
    cta: string;
    copyright: string;
    backToTop: string;
    techStack: string;
    live: string;
  };
  preloader: {
    logo: string;
    logoSub: string;
    init: string;
    messages: string[];
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  settings: {
    title: string;
    theme: {
      label: string;
      light: string;
      dark: string;
      system: string;
    };
    language: {
      label: string;
      en: string;
      id: string;
      zh: string;
    };
    music: {
      label: string;
      enabled: string;
      disabled: string;
      volume: string;
    };
    effects: {
      label: string;
      particles: string;
      animations: string;
      blur: string;
      motionReduction: string;
      cursorEffects: string;
    };
    interface: {
      label: string;
      compact: string;
      comfortable: string;
      large: string;
    };
    performance: {
      label: string;
      full: string;
      batterySaver: string;
      lowGpu: string;
      reduced: string;
    };
  };
  accessibility: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    scrollDown: string;
    loading: string;
    initializing: string;
  };
  errors: {
    notFound: string;
    generic: string;
  };
  loading: {
    initializing: string;
  };
}

const en: LocaleMessages = {
  nav: {
    home: '// HOME',
    about: '// BLUEPRINT',
    projects: '// ARCHIVE',
    skills: '// MATRIX',
    contact: '// UPLINK',
    status: 'UPLINK_ON',
    mobileLocation: 'DEPOK, JAWA BARAT',
    mobileRole: 'WEB_DEVELOPER // 2026',
    portfolio: 'PORTFOLIO',
    tableOfContents: 'Table of Contents',
  },
  hero: {
    kicker: '[ DESIGN \u2022 TECHNOLOGY \u2022 INNOVATION ]',
    headlineWhere: 'Where',
    headlineCreativity: 'Creativity',
    headlineMeetsTechnology: 'Meets Technology',
    description: 'Creating meaningful solutions and experiences with precision, innovation, and purpose.',
    ctaProjects: 'VIEW PROJECTS',
    ctaContact: 'Get in touch',
    stats: {
      yearsExp: 'YEARS EXP',
      organizations: 'ORGANIZATIONS',
      projects: 'PROJECTS',
    },
  },
  marquee: {
    roles: ['CREATIVE DEVELOPER', 'MOTION DESIGNER', 'FRONTEND ARCHITECT', 'UI ENGINEER', 'DEPOK BASED', 'AVAILABLE 2026'],
    skills: ['REACT', 'TYPESCRIPT', 'NEXT.JS', 'FRAMER MOTION', 'GSAP', 'TAILWIND CSS', 'THREE.JS', 'NODE.JS', 'FIGMA'],
  },
  about: {
    sectionLabel: 'About',
    name: 'Fakhul',
    nameSuffix: 'Rohman',
    role: 'Web Dev | Editing | Quality Controll',
    bio: 'Lulusan SMK Jurusan Akuntansi dengan pengalaman praktik kerja di bidang <em>Finishing & Teknologi</em>. Memiliki kemampuan dalam Teknologi, Design, dan perawatan dasar mesin. Terbiasa bekerja secara teliti, disiplin dan berorientasi pada hasil untuk memastikan semua sesuai dengan standar perusahaan.',
    pills: {
      location: 'Depok, Jawa Barat',
      experience: '2+ Years',
      trait: 'Adaptability & Flexibility',
    },
    tabs: {
      story: 'Story',
      experience: 'Experience',
      approach: 'Approach',
    },
    story: {
      title: 'From Accounting to Technology',
      paragraphs: [
        'My journey started from vocational school majoring in Accounting, but during my school years I discovered a strong interest in the world of technology and web development. The curiosity about how websites and applications work drove me to learn independently outside the curriculum.',
        'Work experience at ION Network as a network and CCTV technician taught me about technology infrastructure and problem-solving. Meanwhile at A&W Restaurant, I learned about discipline, teamwork, and the importance of quality control in every job. Both experiences shaped my attention to detail and quality standards.',
        'Now I focus on building meaningful web experiences, combining technical skills with creative vision. Based in Depok, West Java, I continue to develop skills in React, TypeScript, and other modern frontend technologies.',
      ],
    },
    experience: {
      entries: [
        {
          company: 'ION Network',
          period: '2025 - 2026 ( 7mo )',
          role: 'Technical Network & CCTV',
          description: 'Computer network and CCTV specialist with skills in installation, configuration, troubleshooting, maintenance, and system optimization to ensure network stability and security.',
        },
        {
          company: 'Restaurant A&W',
          period: '2025 ( 3mo )',
          role: 'Staff Kitchen',
          description: 'Skilled in kitchen operations, ingredient preparation, and food processing while prioritizing quality, cleanliness, workplace safety, and teamwork.',
        },
      ],
    },
    approach: {
      title: 'How I work',
      items: [
        {
          num: '01',
          title: 'Architecture First',
          desc: 'Every project starts with clean component architecture, typed interfaces, and a scalable design system before any visual work begins.',
        },
        {
          num: '02',
          title: 'Motion with Purpose',
          desc: "Animations aren't decoration - they guide attention, reveal content progressively, and create a sense of physical space in the interface.",
        },
        {
          num: '03',
          title: 'Obsessive Polish',
          desc: 'The difference between good and extraordinary lives in the details: micro-interactions, easing curves, responsive spacing, and pixel precision.',
        },
      ],
    },
  },
  projects: {
    sectionLabel: 'SELECTED WORKS',
    title: 'PROJECT ARCHIVE',
    subtitle: 'Curated selection of creative and technical projects',
    modal: {
      overview: '01 // PROJECT OVERVIEW',
      challenge: '02 // TECHNICAL CHALLENGE',
      solution: '03 // ENGINEERING SOLUTION',
      tech: '04 // INTEGRATED CORE ARCHITECTURE',
      footer: 'ACTIVE_LINK_SECURE // GEMINI_SYS',
      launch: 'LAUNCH_SITE',
      closeLabel: 'Close project details',
      viewLabel: 'View details for',
    },
    items: [
      {
        title: 'NEO-TOKYO FLUIDS',
        categoryLabel: 'CREATIVE CORE',
        tagline: 'WebGL fluid-distortion simulation of neon rain ripples.',
        description: 'A high-performance WebGL fluid canvas simulation replicating dark rain-slicked Tokyo streets reacting to mouse coordinates.',
        challenge: 'Achieving stable 60fps on mobile touch interfaces while rendering complex vector fluid math in real-time.',
        solution: 'Optimized fragment shaders by utilizing downscaled physics framebuffers and custom linear interpolation matrices, maintaining high-fidelity particle trails at low processing costs.',
      },
      {
        title: 'SAKURA_CORE ERP',
        categoryLabel: 'SYSTEM ARCHITECTURE',
        tagline: 'Accessible high-end enterprise resource command dashboard.',
        description: 'A deeply optimized enterprise console incorporating accessible screen-reading attributes, keyboard controls, and real-time canvas charting.',
        challenge: 'Satisfying extreme Web Accessibility (WCAG 2.1 AA) criteria while delivering deep sensory motion styling and complex dark aesthetics.',
        solution: 'Engineered custom semantic ARIA focus-traps and styled fully customizable glowing borders using standard utility tokens that respect user high-contrast system requests.',
      },
      {
        title: 'KOMOREBI INTERFACE',
        categoryLabel: 'CREATIVE CORE',
        tagline: 'Canvas-based operating system exploring organic natural physics.',
        description: 'An interactive web portfolio layout inspired by forest light filtering through branches, utilizing physical particle colliders.',
        challenge: 'Simulating natural light particle scatter that sways organically in 2.5D space while responding to multi-scroll coordinates.',
        solution: 'Crafted a customized vector gravity loop calculating shadow intersections on canvas layers synced smoothly with Lenis scroll positions.',
      },
      {
        title: 'ANTIGRAVITY CONSOLE',
        categoryLabel: 'RESEARCH LAB',
        tagline: 'Futuristic developer CLI automation suite and sandbox.',
        description: 'An agentic console terminal helper designed to compile, debug, and manage code files in isolated local environments.',
        challenge: 'Creating a highly secure, sandboxed terminal dashboard delivering real-time logs and process controls in active windows.',
        solution: 'Established secure, authenticated WebSocket pipelines paired with lightweight Docker containers, providing instantaneous feedback loops.',
      },
    ],
  },
  skills: {
    sectionLabel: 'Expertise',
    title: 'Technical',
    titleSuffix: 'Matrix',
    alsoProficient: 'Also proficient in',
    items: [
      { name: 'React / Next.js', description: 'High-fidelity component architecture, hooks, state management, SSR & bundle optimization.' },
      { name: 'Motion Design', description: 'Framer Motion, GSAP timelines, scroll-triggered choreography & spring physics.' },
      { name: 'CSS / Tailwind', description: 'Advanced layouts, fluid typography, design systems, responsive architecture.' },
      { name: 'TypeScript', description: 'Strict typing, generics, utility types, modular architectures.' },
      { name: 'Three.js / WebGL', description: 'Interactive 3D, shaders, canvas rendering.' },
      { name: 'Accessibility', description: 'WCAG 2.1, ARIA, keyboard nav, screen readers.' },
      { name: 'Node.js / APIs', description: 'REST APIs, WebSockets, Docker, serverless.' },
      { name: 'Git / CI-CD', description: 'GitHub Actions, PR workflows, automated testing.' },
    ],
  },
  contact: {
    sectionLabel: 'Contact',
    title: "Let's start a",
    titleSuffix: 'conversation',
    description: 'Have a project, opportunity, or collaboration in mind? Feel free to get in touch and let\'s create something meaningful together.',
    location: {
      label: 'Location',
      value: 'Jawa Barat, Indonesia',
    },
    email: {
      label: 'Email',
    },
    form: {
      nameLabel: 'Your name',
      namePlaceholder: 'Fakhul Rohman',
      emailLabel: 'Email address',
      emailPlaceholder: 'Fakhulrohman2@gmail.com',
      messageLabel: 'Your message',
      messagePlaceholder: 'Tell me about your project...',
      submit: 'SEND MESSAGE',
    },
    sending: {
      title: 'Sending message',
      processing: 'Processing...',
    },
    consoleLogs: [
      'Establishing secure connection...',
      'Encrypting message payload...',
      'Validating email integrity...',
      'Routing via jkt relay node...',
    ],
    success: {
      title: 'Message sent!',
      description: "Thank you for reaching out. I'll get back to you within 24 hours.",
      sendAnother: 'Send another',
    },
    error: {
      transmissionFailed: 'ERROR: Transmission failed. Retrying...',
    },
    consoleDone: 'Message delivered successfully \u2713',
    consoleInit: 'Initiating transmission...',
  },
  footer: {
    readyLabel: 'Ready to collaborate?',
    title: "Let's create",
    titleSuffix: 'something extraordinary.',
    cta: 'START A PROJECT',
    copyright: '\u00A9 2025 \u2014 Designed with precision',
    backToTop: 'Back to top',
    techStack: 'React + Vite + Lenis',
    live: 'Live',
  },
  preloader: {
    logo: 'SORA',
    logoSub: 'Portfolio 2026',
    init: 'INIT',
    messages: [
      'HI THERE...',
      "YES, YOU WHO'S WAITING...",
      'THANKS FOR STOPPING BY...',
      "I'M TIDYING THINGS UP...",
      'MAKING IT LOOK NEAT...',
      "DON'T GO ANYWHERE...",
      'ALL READY!',
    ],
    topLeft: 'Depok, Jawa Barat',
    topRight: 'My Profile',
    bottomLeft: 'Fakhul Rohman Nurokhim',
    bottomRight: 'Still loading...',
  },
  settings: {
    title: 'Settings',
    theme: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      label: 'Language',
      en: 'English',
      id: 'Bahasa Indonesia',
      zh: 'Chinese Simplified',
    },
    music: {
      label: 'Background Music',
      enabled: 'Enabled',
      disabled: 'Disabled',
      volume: 'Volume',
    },
    effects: {
      label: 'Visual Effects',
      particles: 'Particles',
      animations: 'Animations',
      blur: 'Blur Effects',
      motionReduction: 'Reduce Motion',
      cursorEffects: 'Cursor Effects',
    },
    interface: {
      label: 'Interface Mode',
      compact: 'Compact',
      comfortable: 'Comfortable',
      large: 'Large',
    },
    performance: {
      label: 'Performance Mode',
      full: 'Full Quality',
      batterySaver: 'Battery Saver',
      lowGpu: 'Low GPU',
      reduced: 'Reduced',
    },
  },
  accessibility: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    scrollDown: 'Scroll down',
    loading: 'Loading',
    initializing: 'Initializing...',
  },
  errors: {
    notFound: 'Page not found',
    generic: 'Something went wrong',
  },
  loading: {
    initializing: 'Initializing...',
  },
} as const;

export type Locale = LocaleMessages;
export default en;
