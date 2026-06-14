/**
 * Maps a technology label (as used in projects.ts `tech[]`) to a Simple Icons
 * slug + brand color. Icons are loaded at runtime from the Simple Icons CDN
 * (https://cdn.simpleicons.org/<slug>/<hex>) — no build dependency. Anything
 * not in this map renders as a labelled chip fallback in <TechMarquee/>.
 *
 * Version suffixes ("React 19", "Next.js 15") are stripped before lookup.
 */
export interface TechIconMeta {
  slug: string;
  color: string;
}

const TECH_ICONS: Record<string, TechIconMeta> = {
  'node.js': { slug: 'nodedotjs', color: '5FA04E' },
  nodejs: { slug: 'nodedotjs', color: '5FA04E' },
  react: { slug: 'react', color: '61DAFB' },
  'next.js': { slug: 'nextdotjs', color: '000000' },
  nextjs: { slug: 'nextdotjs', color: '000000' },
  typescript: { slug: 'typescript', color: '3178C6' },
  javascript: { slug: 'javascript', color: 'F7DF1E' },
  vite: { slug: 'vite', color: '646CFF' },
  'tailwind css': { slug: 'tailwindcss', color: '06B6D4' },
  tailwindcss: { slug: 'tailwindcss', color: '06B6D4' },
  supabase: { slug: 'supabase', color: '3FCF8E' },
  postgresql: { slug: 'postgresql', color: '4169E1' },
  prisma: { slug: 'prisma', color: '2D3748' },
  'socket.io': { slug: 'socketdotio', color: '010101' },
  socketio: { slug: 'socketdotio', color: '010101' },
  express: { slug: 'express', color: '000000' },
  'express.js': { slug: 'express', color: '000000' },
  expressjs: { slug: 'express', color: '000000' },
  mongodb: { slug: 'mongodb', color: '47A248' },
  html: { slug: 'html5', color: 'E34F26' },
  html5: { slug: 'html5', color: 'E34F26' },
  css: { slug: 'css3', color: '1572B6' },
  css3: { slug: 'css3', color: '1572B6' },
  git: { slug: 'git', color: 'F05032' },
  github: { slug: 'github', color: '181717' },
  vercel: { slug: 'vercel', color: '000000' },
  axios: { slug: 'axios', color: '5A29E4' },
  ffmpeg: { slug: 'ffmpeg', color: '007808' },
  'gpt-4 api': { slug: 'openai', color: '412991' },
  openai: { slug: 'openai', color: '412991' },
  jwt: { slug: 'jsonwebtokens', color: '000000' },
  zustand: { slug: 'react', color: '61DAFB' },
  gsap: { slug: 'greensock', color: '88CE02' },
  'framer motion': { slug: 'framer', color: '0055FF' },
};

/** Normalise a tech label and strip trailing version numbers for lookup. */
function normaliseTech(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+\d+(\.\d+)*$/, '') // "React 19" -> "react", "Next.js 15" -> "next.js"
    .trim();
}

export function getTechIcon(label: string): TechIconMeta | null {
  return TECH_ICONS[normaliseTech(label)] ?? null;
}

/** Build the Simple Icons CDN URL for a given tech (or null when unmapped). */
export function getTechIconUrl(label: string): string | null {
  const meta = getTechIcon(label);
  if (!meta) return null;
  return `https://cdn.simpleicons.org/${meta.slug}/${meta.color}`;
}
