import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import {
  Compass,
  History,
  Target,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  MessagesSquare,
  Users,
  Shuffle,
  Lightbulb,
  Flag,
  BadgeCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Download,
  FileText,
  FileBadge,
  Palette,
  ChevronDown,
  Code2,
  Server,
  Database,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section, premiumEase, springEase } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';
import { Magnetic } from '../components/Magnetic';
import { BrandPhoto } from '../components/BrandPhoto';
import { LocalImage } from '../components/LocalImage';
import { getTechIconUrl } from '../data/techIcons';
import { brandPhotos } from '../data/brandPhotos';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

type TabType = 'story' | 'experience' | 'skills';
const tabOrder: TabType[] = ['story', 'experience', 'skills'];

const softSkills = [
  { label: 'Communication', icon: MessagesSquare },
  { label: 'Teamwork', icon: Users },
  { label: 'Adaptability', icon: Shuffle },
  { label: 'Problem Solving', icon: Lightbulb },
  { label: 'Time Management', icon: Clock },
  { label: 'Leadership', icon: Flag },
];

const hardSkillGroups: { category: string; icon: LucideIcon; items: string[] }[] = [
  { category: 'Frontend', icon: Code2, items: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'] },
  { category: 'Backend', icon: Server, items: ['Node.js', 'Express.js', 'REST API'] },
  { category: 'Database', icon: Database, items: ['MongoDB'] },
  { category: 'Tools', icon: Wrench, items: ['Git', 'GitHub', 'Vercel'] },
];

// Downloadable CV variants — drop the PDFs in /public/cv (see public/cv/README.md).
const cvFiles: { key: string; file: string; icon: LucideIcon }[] = [
  { key: 'atsWebDev', file: '/cv/cv-ats-web-dev.pdf', icon: FileBadge },
  { key: 'atsGeneral', file: '/cv/cv-ats-umum.pdf', icon: FileText },
  { key: 'designGeneral', file: '/cv/cv-design-umum.pdf', icon: Palette },
];

/**
 * A single hard-skill tool rendered as a text-only chip with its brand icon.
 * The icon has a soft, GPU-cheap hover animation (lift + gentle tilt) to feel
 * interactive without the cost of an always-running loop.
 */
function HardSkillChip({ label, index }: { label: string; index: number }) {
  const iconUrl = getTechIconUrl(label);
  const [iconFailed, setIconFailed] = useState(false);
  const showIcon = iconUrl && !iconFailed;

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: premiumEase }}
      whileHover={{ y: -2 }}
      className="group/skill inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal/5 border border-charcoal/10 text-charcoal text-xs font-hud transition-colors duration-300 hover:border-terracotta/40 hover:bg-terracotta/10"
    >
      <motion.span
        className="inline-flex"
        whileHover={{ scale: 1.2, rotate: -8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 14 }}
      >
        {showIcon ? (
          <img
            src={iconUrl}
            alt=""
            aria-hidden="true"
            width={15}
            height={15}
            loading="lazy"
            decoding="async"
            onError={() => setIconFailed(true)}
            className="w-[15px] h-[15px] object-contain"
          />
        ) : (
          <Code2 className="w-[15px] h-[15px] text-terracotta" />
        )}
      </motion.span>
      {label}
    </motion.span>
  );
}

export const About = () => {
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const { t } = useLanguage();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Photo-strip lightbox (click a portrait to enlarge, navigate with prev/next).
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const closePhoto = () => setPhotoIndex(null);
  const prevPhoto = () =>
    setPhotoIndex((i) => (i === null ? i : (i - 1 + brandPhotos.length) % brandPhotos.length));
  const nextPhoto = () =>
    setPhotoIndex((i) => (i === null ? i : (i + 1) % brandPhotos.length));

  useEffect(() => {
    if (photoIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhotoIndex(null);
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [photoIndex]);

  // CV download dropdown (3 variants — PDFs served from /public/cv).
  const [cvOpen, setCvOpen] = useState(false);
  const cvMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!cvOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (cvMenuRef.current && !cvMenuRef.current.contains(e.target as Node)) {
        setCvOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCvOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [cvOpen]);

  const tabs = [
    { id: 'story', label: t('sections.about.tabs.story'), icon: Compass },
    { id: 'experience', label: t('sections.about.tabs.experience'), icon: History },
    { id: 'skills', label: t('sections.about.tabs.skills'), icon: Target },
  ];

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const currentIndex = tabOrder.indexOf(activeTab);
    if (info.offset.x < -swipeThreshold && currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const socialLinks = [
    { icon: GithubIcon, href: 'https://github.com/lumakara', label: 'GitHub' },
    { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/fakhul-rohman-nurokhim-b24276411', label: 'LinkedIn' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
  ];

  const metaPills = [
    { icon: MapPin, label: t('sections.about.location'), accent: 'text-terracotta' },
    { icon: Briefcase, label: t('sections.about.experience'), accent: 'text-sage' },
    { icon: Clock, label: '~24h response', accent: 'text-gold' },
  ];

  const quickStats = [
    { value: '2+', label: 'Years' },
    { value: '7+', label: 'Projects' },
    { value: '15+', label: 'Tools' },
    { value: '3', label: 'Languages' },
  ];

  return (
    <Section id="about" className="relative px-4 md:px-12">
      <div className="w-full max-w-5xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="rounded-3xl overflow-hidden shadow-2xl relative bg-surface border border-charcoal/5"
        >
          {/* Cover Banner — local image (drop /public/brand/cover.webp) */}
          <div className="relative h-36 md:h-44 overflow-hidden">
            <LocalImage
              src="/brand/cover.webp"
              alt="Fakhul Rohman — cover banner"
              priority
              className="absolute inset-0 w-full h-full"
            />
            {/* Solid scrim so the white text/badges stay legible over any photo */}
            <div className="absolute inset-0 bg-charcoal/45" />
            {/* Decorative icons on cover */}
            <Sparkles className="absolute top-6 right-1/3 w-4 h-4 text-white/40" />
            <Zap className="absolute bottom-8 right-16 w-3.5 h-3.5 text-white/30" />
            <div className="absolute inset-0 cyber-grid opacity-[0.07]" />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
              className="absolute top-4 left-6 text-[10px] font-hud text-white/70 tracking-[0.3em] uppercase flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              {t('sections.about.sectionLabel')}
            </motion.span>
            {/* Availability badge on cover */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: springEase }}
              className="absolute top-4 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-[9px] font-hud text-white tracking-widest uppercase"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-300" />
              </span>
              Available 2026
            </motion.span>
          </div>

          {/* Body — responsive 2-column on large screens */}
          <div className="relative px-5 md:px-8 lg:px-10 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              {/* ── Left: Identity ── */}
              <div className="lg:col-span-5">
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: springEase }}
                  className="-mt-14 md:-mt-16 mb-4 flex justify-center lg:justify-start"
                >
                  <div className="relative">
                    <LocalImage
                      src="/brand/avatar.webp"
                      alt="Fakhul Rohman — avatar"
                      fallbackText="FR"
                      priority
                      className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-surface shadow-xl"
                      imgClassName="rounded-xl"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-surface flex items-center justify-center shadow">
                      <BadgeCheck className="w-5 h-5 text-terracotta" />
                    </div>
                  </div>
                </motion.div>

                {/* Name & role */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: premiumEase }}
                  className="text-center lg:text-left mb-4"
                >
                  <h2 className="text-3xl md:text-4xl font-display font-medium text-charcoal tracking-tight leading-tight">
                    {t('sections.about.firstName')}{' '}
                    <span className="italic font-light text-charcoal-light">{t('sections.about.lastName')}</span>
                  </h2>
                  <p className="text-xs md:text-sm text-charcoal-light font-hud tracking-wider uppercase mt-1.5">
                    {t('sections.about.role')}
                  </p>
                </motion.div>

                {/* Meta pills */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: premiumEase }}
                  className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5"
                >
                  {metaPills.map((pill) => {
                    const Icon = pill.icon;
                    return (
                      <span
                        key={pill.label}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/5 border border-charcoal/10 text-[11px] font-hud text-charcoal-light"
                      >
                        <Icon className={`w-3.5 h-3.5 ${pill.accent}`} />
                        {pill.label}
                      </span>
                    );
                  })}
                </motion.div>

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.45, ease: premiumEase }}
                  className="flex justify-center lg:justify-start gap-2.5 mb-5"
                >
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Magnetic key={social.label} range={0.3}>
                        <motion.a
                          href={social.href}
                          target={social.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          onClick={(e: React.MouseEvent) => { if (social.href === '#') e.preventDefault(); }}
                          aria-label={social.label}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-full bg-charcoal/5 border border-charcoal/10 flex items-center justify-center text-charcoal-light hover:text-terracotta hover:bg-charcoal/10 hover:border-charcoal/20 transition-colors duration-300 cursor-none"
                          data-cursor="magnetic"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      </Magnetic>
                    );
                  })}
                </motion.div>

                {/* CV download — choose one of three resume variants (PDFs in /public/cv) */}
                <div ref={cvMenuRef} className="relative flex justify-center lg:justify-start mb-5">
                  <motion.button
                    type="button"
                    onClick={() => setCvOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={cvOpen}
                    data-sound="click"
                    data-cursor="grow"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-charcoal text-sand text-xs font-hud uppercase tracking-widest shadow-sm transition-colors duration-300 hover:bg-terracotta cursor-none"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t('sections.about.cv.button')}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${cvOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {cvOpen && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: premiumEase }}
                        className="absolute top-full left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 mt-2 w-60 z-30 origin-top rounded-2xl bg-surface border border-charcoal/10 shadow-xl p-1.5"
                      >
                        {cvFiles.map((cv) => {
                          const Icon = cv.icon;
                          return (
                            <a
                              key={cv.key}
                              href={cv.file}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setCvOpen(false)}
                              role="menuitem"
                              data-sound="click"
                              data-cursor="magnetic"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-charcoal hover:bg-terracotta/10 transition-colors duration-200 cursor-none"
                            >
                              <span className="w-8 h-8 shrink-0 rounded-lg bg-charcoal/5 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-terracotta" />
                              </span>
                              <span className="flex flex-col">
                                <span className="text-xs font-hud font-medium tracking-wide">{t(`sections.about.cv.${cv.key}`)}</span>
                                <span className="text-[9px] font-hud text-charcoal-light/70 uppercase tracking-widest">PDF</span>
                              </span>
                            </a>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Photo strip — personal branding (click to enlarge) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.5, ease: premiumEase }}
                  className="grid grid-cols-4 gap-2 mb-5"
                >
                  {brandPhotos.slice(0, 4).map((photo, i) => (
                    <motion.button
                      key={photo.src}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      data-sound="click"
                      data-cursor="grow"
                      whileHover={{ y: -3, scale: 1.03 }}
                      transition={{ duration: 0.25 }}
                      className="group/photo relative cursor-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded-xl"
                      aria-label={`${photo.alt} — enlarge`}
                    >
                      <BrandPhoto
                        src={photo.src}
                        alt={photo.alt}
                        variant={i}
                        showCaption={false}
                        className="aspect-square rounded-xl border border-charcoal/10"
                      />
                      {/* Enlarge affordance */}
                      <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-charcoal/30 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                        <span className="w-7 h-7 rounded-full bg-white/85 flex items-center justify-center">
                          <Maximize2 className="w-3.5 h-3.5 text-charcoal" />
                        </span>
                      </span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Quick stats */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.55, ease: premiumEase }}
                  className="grid grid-cols-4 gap-2"
                >
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-charcoal/5 border border-charcoal/10">
                      <span className="font-display text-xl font-semibold text-charcoal leading-none">{stat.value}</span>
                      <span className="font-hud text-[8px] text-charcoal-light uppercase tracking-widest mt-1">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── Right: Bio + Tabs ── */}
              <div className="lg:col-span-7 flex flex-col">
                {/* Bio */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5, ease: premiumEase }}
                  className="text-sm md:text-base text-charcoal-light font-sans leading-relaxed text-center lg:text-left mb-5 mt-2 lg:mt-6"
                >
                  {t('sections.about.bioText')}
                </motion.p>

                <div className="w-full h-px bg-charcoal/10 mb-5" />

                {/* Tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: springEase }}
                  className="flex flex-col gap-4 flex-1"
                >
                  <div className="flex w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl p-1.5">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as TabType)}
                          data-sound="click"
                          className="relative flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl cursor-none transition-colors duration-300 font-hud"
                          data-cursor="magnetic"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="aboutTabIndicator"
                              className="absolute inset-0 bg-terracotta/15 border border-terracotta/30 rounded-xl"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-charcoal-light'}`} />
                            <span className={`font-medium tracking-wide text-[11px] md:text-xs ${isActive ? 'text-charcoal' : 'text-charcoal-light'}`}>
                              {tab.label}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab content — height grows with content (no vertical clipping on mobile) */}
                  <div ref={constraintsRef} className="overflow-x-clip">
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={handleDragEnd}
                      className="touch-pan-y"
                    >
                      <div className="bg-charcoal/[0.04] border border-charcoal/10 rounded-2xl p-5 md:p-6 min-h-[300px] relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-[180px] h-[180px] bg-terracotta/5 rounded-full blur-[80px] pointer-events-none" />

                        <AnimatePresence mode="wait">
                          {activeTab === 'story' && (
                            <motion.div
                              key="story"
                              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                              transition={{ duration: 0.6, ease: premiumEase }}
                              className="text-left space-y-4"
                            >
                              <h3 className="text-lg md:text-xl font-display font-medium text-charcoal tracking-wide flex items-center gap-2">
                                <Compass className="w-5 h-5 text-terracotta" />
                                {t('sections.about.story.title')}
                              </h3>
                              <div className="text-sm text-charcoal-light font-sans space-y-3 leading-relaxed">
                                <p>{t('sections.about.story.p1')}</p>
                                <p>{t('sections.about.story.p2')}</p>
                                <p>{t('sections.about.story.p3')}</p>
                              </div>
                            </motion.div>
                          )}

                          {activeTab === 'experience' && (
                            <motion.div
                              key="experience"
                              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                              transition={{ duration: 0.6, ease: premiumEase }}
                              className="text-left"
                            >
                              <div className="relative space-y-7">
                                <div className="relative pl-7 border-l border-terracotta/30">
                                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-terracotta rounded-full shadow-sm shadow-terracotta/50" />
                                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                                    <h4 className="text-base font-display font-medium text-charcoal">{t('sections.about.experienceTimeline.entry1.company')}</h4>
                                    <span className="text-[10px] font-hud text-terracotta tracking-wider">{t('sections.about.experienceTimeline.entry1.period')}</span>
                                  </div>
                                  <span className="text-sm text-terracotta font-medium font-hud">{t('sections.about.experienceTimeline.entry1.role')}</span>
                                  <p className="text-sm text-charcoal-light font-sans leading-relaxed mt-1.5">{t('sections.about.experienceTimeline.entry1.description')}</p>
                                </div>
                                <div className="relative pl-7 border-l border-sage/30">
                                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-sage rounded-full shadow-sm shadow-sage/50" />
                                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                                    <h4 className="text-base font-display font-medium text-charcoal">{t('sections.about.experienceTimeline.entry2.company')}</h4>
                                    <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('sections.about.experienceTimeline.entry2.period')}</span>
                                  </div>
                                  <span className="text-sm text-sage font-medium font-hud">{t('sections.about.experienceTimeline.entry2.role')}</span>
                                  <p className="text-sm text-charcoal-light font-sans leading-relaxed mt-1.5">{t('sections.about.experienceTimeline.entry2.description')}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {activeTab === 'skills' && (
                            <motion.div
                              key="skills"
                              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                              transition={{ duration: 0.6, ease: premiumEase }}
                              className="text-left space-y-6"
                            >
                              {/* Soft skills — tidy 2-col grid on mobile, wraps to pills on larger screens */}
                              <div className="space-y-3">
                                <h3 className="text-sm font-hud font-medium text-charcoal tracking-widest uppercase">{t('sections.about.skills.softTitle')}</h3>
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                                  {softSkills.map((skill, index) => {
                                    const Icon = skill.icon;
                                    return (
                                      <motion.span
                                        key={skill.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.04, duration: 0.3, ease: premiumEase }}
                                        whileHover={{ y: -2 }}
                                        className="flex min-w-0 items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 bg-terracotta/15 border border-terracotta/25 text-charcoal text-[11px] sm:text-xs font-hud rounded-full text-center leading-tight transition-colors duration-300 hover:bg-terracotta/25"
                                      >
                                        <Icon className="w-3.5 h-3.5 text-terracotta shrink-0" />
                                        <span>{skill.label}</span>
                                      </motion.span>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Hard skills — text only, grouped by category, with soft animated brand icons */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-hud font-medium text-charcoal tracking-widest uppercase">{t('sections.about.skills.hardTitle')}</h3>
                                <div className="space-y-4">
                                  {hardSkillGroups.map((group) => {
                                    const GroupIcon = group.icon;
                                    return (
                                      <div key={group.category} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <GroupIcon className="w-3.5 h-3.5 text-sage" />
                                          <span className="text-[11px] font-hud text-charcoal-light uppercase tracking-widest">{group.category}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {group.items.map((item, i) => (
                                            <HardSkillChip key={item} label={item} index={i} />
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>

                  {/* Tab indicator dots */}
                  <div className="flex justify-center gap-2">
                    {tabOrder.map((tabId) => (
                      <button
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        aria-label={`Go to ${tabId} tab`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-none ${
                          activeTab === tabId ? 'bg-terracotta w-5' : 'bg-charcoal/20 w-1.5'
                        }`}
                        data-cursor="magnetic"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Verified footer strip */}
            <div className="mt-6 pt-5 border-t border-charcoal/10 flex flex-col md:flex-row items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[10px] font-hud text-charcoal-light tracking-widest uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                {t('sections.about.trait')}
              </span>
              <span className="text-[10px] font-hud text-charcoal-light/70 tracking-widest uppercase">PROFILE_ID // FR-2026</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Photo lightbox — enlarge brand photos with prev/next */}
      <AnimatePresence>
        {photoIndex !== null && (
          <motion.div
            key="about-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md"
            onClick={closePhoto}
            role="dialog"
            aria-modal="true"
            aria-label={brandPhotos[photoIndex].alt}
          >
            <button
              onClick={closePhoto}
              data-sound="click"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-none transition-colors"
              data-cursor="magnetic"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="absolute top-6 left-6 text-[11px] font-hud text-white/70 tracking-widest">
              {String(photoIndex + 1).padStart(2, '0')} / {String(brandPhotos.length).padStart(2, '0')}
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              data-sound="click"
              className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-none transition-colors"
              data-cursor="magnetic"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              data-sound="click"
              className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-none transition-colors"
              data-cursor="magnetic"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <motion.div
              key={photoIndex}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
            >
              <BrandPhoto
                src={brandPhotos[photoIndex].src}
                alt={brandPhotos[photoIndex].alt}
                variant={photoIndex}
                caption={brandPhotos[photoIndex].caption}
                showCaption
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default About;
