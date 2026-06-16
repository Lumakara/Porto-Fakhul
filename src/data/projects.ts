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
  /**
   * Optional dedicated cover image for the project card + detail banner.
   * Drop a file at /public/projects/{id}/cover.webp and set this to
   * "/projects/{id}/cover.webp". When omitted it falls back to the first
   * gallery screenshot, so cards work immediately with the screens you upload.
   */
  cover?: string;
  color: string;
  gradient: string;
  /** Accent color (hex) used for badges, glows and tilt highlights. */
  accent: string;
  cyberId: string;
}

export const projectsData: Project[] = [
  {
    id: 'bot-whatsapp-multifungsi',
    title: 'Bot WhatsApp Multi-Fungsi',
    category: 'systems',
    categoryLabel: 'BACKEND / AUTOMATION',
    tagline:
      'Bot WhatsApp berbasis Node.js & Baileys dengan AI Chat, sistem ekonomi, game interaktif, dan manajemen grup.',
    description:
      'Bot WhatsApp multi-fungsi berbasis Node.js dan Baileys yang menyediakan administrasi grup, AI Chat, game interaktif, sistem ekonomi, auto-respon, manajemen pengguna, hingga sistem sewa grup. Mendukung Multi Device dan dirancang untuk berjalan 24/7 di VPS bagi komunitas maupun toko digital.',
    tech: ['Node.js', 'Baileys', 'GPT-4 API', 'Axios', 'FFmpeg', 'node-cron'],
    challenge:
      'Mengelola puluhan sistem yang saling terhubung — AI otomatis, pembayaran, manajemen grup, dan game — dalam satu bot Multi Device yang tetap stabil dan responsif saat berjalan terus-menerus.',
    solution:
      'Membangun sistem command modular dengan penyimpanan database berbasis JSON, automasi via node-cron, integrasi GPT untuk Auto AI Chat, serta kontrol hak akses berjenjang (Owner, Premium, VIP, User) agar fitur tetap terkelola dan aman.',
    features: [
      'Auto AI Chat di grup dengan integrasi GPT-4',
      'Manajemen grup: welcome, anti-link, anti-spam, hidetag',
      'Sistem ekonomi: saldo digital, limit harian, transaksi',
      'Sistem produk & konfirmasi pembayaran otomatis',
      '15+ game interaktif (Family 100, Tebak Gambar, dll.)',
      'Fitur otomatis: auto-sholat reminder, broadcast, story',
    ],
    metrics: [
      { label: 'Fitur', value: '100+' },
      { label: 'Game', value: '15+' },
      { label: 'Hak Akses', value: '4 Tier' },
    ],
    links: [
      { label: 'Repository', href: GITHUB_PROFILE, type: 'repo' },
      { label: 'Demo', href: PORTFOLIO_REPO, type: 'demo' },
    ],
    status: 'live',
    year: '2025',
    role: 'Backend Developer',
    screens: [
      '/projects/bot-whatsapp-multifungsi/screen-1.webp',
      '/projects/bot-whatsapp-multifungsi/screen-2.webp',
      '/projects/bot-whatsapp-multifungsi/screen-3.webp',
    ],
    color: 'from-[#A3B19B] to-[#C68A7C]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #A3B19B 100%)',
    accent: '#C68A7C',
    cyberId: 'BOT_WA_MULTI',
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    category: 'systems',
    categoryLabel: 'FULL-STACK COMMERCE',
    tagline:
      'Platform e-commerce modern dengan integrasi pembayaran, sistem dukungan, dan notifikasi real-time.',
    description:
      'Platform e-commerce kaya fitur yang dibangun dengan React 19, TypeScript, dan Tailwind CSS. Menghadirkan pengalaman belanja mulus mulai dari katalog produk, keranjang, hingga pembayaran melalui Pakasir (QRIS, Virtual Account, e-wallet), dilengkapi sistem tiket dukungan serta notifikasi via Email dan Telegram.',
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Zustand'],
    challenge:
      'Menyatukan pengalaman belanja yang mulus dengan banyak metode pembayaran, sistem dukungan pelanggan, dan notifikasi real-time dalam satu antarmuka mobile-first yang ringan.',
    solution:
      'Mengintegrasikan payment gateway Pakasir untuk QRIS, VA, dan e-wallet, memakai Supabase sebagai backend, EmailJS dan Telegram Bot untuk notifikasi, serta Zustand untuk state management yang ringkas dan persisten.',
    features: [
      'Katalog produk dengan rating, ulasan, dan kategori',
      'Keranjang dengan pemilihan tier dan kuantitas',
      'Pembayaran Pakasir: QRIS, Virtual Account, e-wallet',
      'Sistem tiket dukungan dengan kategorisasi',
      'Dark mode dengan beberapa skema warna',
      'Desain responsif mobile-first + dukungan dwibahasa',
    ],
    metrics: [
      { label: 'Metode Bayar', value: '10+' },
      { label: 'Tema', value: '4' },
      { label: 'Bahasa', value: '2' },
    ],
links: [
      { label: 'Live', href: '/maintenance', type: 'live' },
      { label: 'Repository', href: '/maintenance', type: 'repo' },
    ],
    status: 'live',
    year: '2025',
    role: 'Full-Stack Developer',
    screens: [
      '/projects/ecommerce-platform/screen-1.webp',
      '/projects/ecommerce-platform/screen-2.webp',
      '/projects/ecommerce-platform/screen-3.webp',
    ],
    color: 'from-[#C68A7C] to-[#D4AF37]',
    gradient: 'linear-gradient(135deg, #F5F2EB 0%, #C68A7C 100%)',
    accent: '#D4AF37',
    cyberId: 'ECOM_PAKASIR',
  },
  {
    id: 'smart-inventory',
    title: 'Smart Inventory Management',
    category: 'systems',
    categoryLabel: 'WAREHOUSE SYSTEM',
    tagline:
      'Platform manajemen gudang & inventaris untuk stok, supplier, transaksi, dan laporan real-time.',
    description:
      'Smart Inventory Management System adalah platform berbasis web untuk mengelola stok barang, gudang, supplier, transaksi, dan laporan secara real-time. Dirancang untuk UMKM, distributor, dan retail dengan fitur multi-gudang, monitoring stok, stock opname, serta analitik inventaris.',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma', 'Socket.io'],
    challenge:
      'Mengelola inventaris multi-gudang dengan monitoring stok real-time, transfer antar gudang, audit, dan kontrol akses berbasis peran tanpa kehilangan akurasi data.',
    solution:
      'Membangun dashboard analitik dengan PostgreSQL + Prisma, pembaruan real-time via Socket.io, scanner barcode/QR, sistem alert stok, dan kontrol akses berjenjang (Super Admin, Manager, Staff, Owner).',
    features: [
      'Dashboard analitik & grafik stok real-time',
      'Manajemen produk dengan barcode & QR generator',
      'Multi-gudang dengan transfer stok antar lokasi',
      'Tracking barang masuk, keluar, dan stock opname',
      'Alert stok menipis, habis, dan kadaluarsa',
      'Laporan & export ke PDF, Excel, dan CSV',
    ],
    metrics: [
      { label: 'Modul Inti', value: '11' },
      { label: 'Role', value: '4' },
      { label: 'Database', value: 'PostgreSQL' },
    ],
    links: [
      { label: 'Live', href: '/maintenance', type: 'live' },
      { label: 'Repository', href: '/maintenance', type: 'repo' },
    ],
    status: 'live',
    year: '2026',
    role: 'Full-Stack Developer',
    screens: [
      '/projects/smart-inventory/screen-1.webp',
      '/projects/smart-inventory/screen-2.webp',
      '/projects/smart-inventory/screen-3.webp',
    ],
    color: 'from-[#A3B19B] to-[#F5F2EB]',
    gradient: 'linear-gradient(135deg, #FDFBF7 0%, #A3B19B 100%)',
    accent: '#A3B19B',
    cyberId: 'INV_SMART_01',
  },
  {
    id: 'management-platform',
    title: 'Multi-Purpose Management Platform',
    category: 'systems',
    categoryLabel: 'FULL-STACK DASHBOARD',
    tagline:
      'Platform terintegrasi untuk komunitas, pengguna, transaksi digital, AI, dan otomatisasi.',
    description:
      'Platform manajemen serbaguna yang dibangun dengan React, Node.js, Express, dan MongoDB untuk mengelola komunitas, pengguna, transaksi digital, sistem AI, dan otomatisasi dalam satu tempat. Menggunakan arsitektur full-stack modern dengan dashboard admin, panel pengguna, dan sistem keamanan yang scalable.',
    tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    challenge:
      'Menyatukan manajemen komunitas, pengguna, transaksi digital, AI, dan game ke dalam satu platform yang aman dan dapat diskalakan tanpa membuat sistem menjadi rumit.',
    solution:
      'Merancang arsitektur full-stack dengan dashboard admin dan pengguna, keamanan JWT + RBAC, dompet digital terintegrasi payment gateway, AI assistant multi-model, serta otomatisasi berbasis cron dan background jobs.',
    features: [
      'AI Assistant dengan integrasi GPT, Gemini, dan Claude',
      'Manajemen pengguna, role, dan membership premium/VIP',
      'Dompet digital & integrasi payment gateway',
      'Keamanan JWT, RBAC, anti-spam, dan audit log',
      'Game interaktif dengan leaderboard & reward',
      'Dashboard analitik dengan otomatisasi terjadwal',
    ],
    metrics: [
      { label: 'Role', value: '6' },
      { label: 'Model AI', value: '3' },
      { label: 'Stack', value: 'MERN' },
    ],
    links: [
      { label: 'Repository', href: '/maintenance', type: 'repo' },
      { label: 'Demo', href: '/maintenance', type: 'demo' },
    ],
    status: 'in-progress',
    year: '2026',
    role: 'Full-Stack Developer',
    screens: [
      '/projects/management-platform/screen-1.webp',
      '/projects/management-platform/screen-2.webp',
      '/projects/management-platform/screen-3.webp',
    ],
    color: 'from-[#E5E2DA] to-[#2A2A2A]',
    gradient: 'linear-gradient(135deg, #E5E2DA 0%, #C68A7C 100%)',
    accent: '#4A4A4A',
    cyberId: 'MGMT_PLATFORM',
  },
  {
    id: 'whatsapp-chat-clone',
    title: 'WhatsApp Chat Clone',
    category: 'lab',
    categoryLabel: 'REAL-TIME CHAT',
    tagline:
      'Aplikasi chat real-time terinspirasi WhatsApp Web dengan Socket.io dan arsitektur full-stack.',
    description:
      'Aplikasi chat real-time modern yang terinspirasi WhatsApp Web, dibangun dengan arsitektur full-stack (React, Node.js, Express, MongoDB) untuk pesan yang cepat, aman, dan responsif. Menghadirkan pesan instan one-to-one, indikator mengetik, status online, dan read receipts.',
    tech: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB', 'JWT'],
    challenge:
      'Menghadirkan pesan one-to-one yang instan dan aman lengkap dengan indikator mengetik, status online/offline, dan read receipts secara real-time.',
    solution:
      'Memakai Socket.io untuk komunikasi real-time, autentikasi JWT dengan enkripsi bcrypt, MongoDB + Mongoose untuk penyimpanan, serta Multer untuk upload media dan berbagi file.',
    features: [
      'Autentikasi JWT dengan enkripsi password bcrypt',
      'Pesan instan one-to-one secara real-time',
      'Indikator mengetik & status online/offline',
      'Read receipts dan timestamp pesan',
      'Upload gambar, file, dan foto profil (Multer)',
      'UI responsif ala WhatsApp dengan dark mode',
    ],
    metrics: [
      { label: 'Realtime', value: 'Socket.io' },
      { label: 'Auth', value: 'JWT' },
      { label: 'Database', value: 'MongoDB' },
    ],
    links: [
      { label: 'Live', href: '/maintenance', type: 'live' },
      { label: 'Repository', href: '/maintenance', type: 'repo' },
    ],
    status: 'live',
    year: '2024',
    role: 'Full-Stack Developer',
    screens: [
      '/projects/whatsapp-chat-clone/screen-1.webp',
      '/projects/whatsapp-chat-clone/screen-2.webp',
      '/projects/whatsapp-chat-clone/screen-3.webp',
    ],
    color: 'from-[#C68A7C] to-[#A3B19B]',
    gradient: 'linear-gradient(135deg, #F5F2EB 0%, #C68A7C 100%)',
    accent: '#C68A7C',
    cyberId: 'CHAT_RT_SIO',
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

/**
 * Resolve the image used for a project's card thumbnail and detail banner.
 * Prefers an explicit `cover`, otherwise reuses the first gallery screenshot.
 */
export function getProjectCover(project: Project): string {
  return project.cover || project.screens[0] || '';
}
