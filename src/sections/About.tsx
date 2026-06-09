import { useState, useRef } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Compass, Cpu, History, MapPin, Briefcase, Target, Zap, Layers, Mail } from 'lucide-react';
import { Section, premiumEase, springEase, Parallax } from '../components/Section';
import { Magnetic } from '../components/Magnetic';
import { useLanguage } from '../contexts/LanguageContext';

type TabType = 'story' | 'experience' | 'skills';

const tabOrder: TabType[] = ['story', 'experience', 'skills'];

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/fakhulrohman', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/fakhulrohman', label: 'LinkedIn' },
  { icon: InstagramIcon, href: 'https://instagram.com/fakhulrohman', label: 'Instagram' },
  { icon: Mail, href: 'mailto:Fakhulrohman2@gmail.com', label: 'Email' },
];

export const About = () => {
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const { t } = useLanguage();
  const constraintsRef = useRef<HTMLDivElement>(null);

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

  const rawSoft = t('sections.about.skills.soft') as unknown;
  const softSkills: string[] = Array.isArray(rawSoft) ? rawSoft : [];
  const rawHard = t('sections.about.skills.hard') as unknown;
  const hardSkills: string[] = Array.isArray(rawHard) ? rawHard : [];

  return (
    <Section id="about" className="relative px-4 md:px-12">
      {/* Background */}
      <Parallax offset={80} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-purple opacity-30" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-3xl mx-auto z-10 relative">
        {/* Social Profile Card Header */}
        <div className="flex flex-col items-center mb-16 md:mb-24">
          {/* Cover/Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="w-full relative"
          >
            <img
              src="https://picsum.photos/seed/about-cover/1200/400"
              alt="Cover banner"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-48 md:h-56 object-cover rounded-2xl shadow-md bg-sage/20"
            />
          </motion.div>

          {/* Circular Profile Photo - overlapping banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: springEase }}
            className="-mt-12 md:-mt-16 z-10"
          >
            <img
              src="https://i.pravatar.cc/300?img=68"
              alt="Fakhul Rohman - Profile"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-sand shadow-lg mx-auto bg-sage/20"
            />
          </motion.div>

          {/* Name + Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.3, ease: premiumEase }}
            className="text-center mt-4"
          >
            <h2 className="text-3xl md:text-4xl font-display font-medium text-charcoal tracking-tight">
              {t('sections.about.firstName')}{' '}
              <span className="italic font-light text-charcoal-light">{t('sections.about.lastName')}</span>
            </h2>
            <p className="text-sm text-charcoal-light font-hud tracking-wider uppercase mt-2">
              {t('sections.about.role')}
            </p>
          </motion.div>

          {/* Social Media Icons Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: premiumEase }}
            className="flex justify-center gap-4 mt-5"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Magnetic key={social.label} range={0.3}>
                  <motion.a
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.45 + index * 0.08, ease: premiumEase }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-surface border border-charcoal/10 flex items-center justify-center text-charcoal-light shadow-sm transition-colors duration-300 hover:bg-terracotta/10 hover:text-terracotta hover:border-terracotta/20 cursor-none"
                    data-cursor="magnetic"
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </motion.a>
                </Magnetic>
              );
            })}
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.5, ease: premiumEase }}
            className="text-center text-base md:text-lg text-charcoal-light font-sans leading-relaxed max-w-lg mx-auto mt-5"
          >
            {t('sections.about.tagline')}
          </motion.p>

          {/* Contact CTA Button */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.55, ease: premiumEase }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 px-8 py-3 bg-terracotta text-surface font-hud text-sm tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 cursor-none"
            data-cursor="magnetic"
          >
            {t('sections.about.contactCta')}
          </motion.a>

          {/* Quick Info Pills - centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1.0, ease: springEase }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            <div className="flex items-center space-x-2 bg-surface border border-charcoal/5 px-3.5 py-2 rounded-full shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('sections.about.location')}</span>
            </div>
            <div className="flex items-center space-x-2 bg-surface border border-charcoal/5 px-3.5 py-2 rounded-full shadow-sm">
              <Briefcase className="w-3.5 h-3.5 text-sage" />
              <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('sections.about.experience')}</span>
            </div>
            <div className="flex items-center space-x-2 bg-surface border border-charcoal/5 px-3.5 py-2 rounded-full shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-charcoal-light" />
              <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('sections.about.trait')}</span>
            </div>
          </motion.div>
        </div>

        {/* Tab section - horizontal layout */}
        <div className="flex flex-col gap-6">
          {/* Horizontal tab bar */}
          <div className="flex w-full bg-surface/50 border border-charcoal/5 rounded-xl p-1.5 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-none transition-colors duration-300 font-hud text-sm"
                  data-cursor="magnetic"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-surface border border-charcoal/10 rounded-lg shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-charcoal-light'}`} />
                    <span className={`font-medium tracking-wide ${isActive ? 'text-charcoal' : 'text-charcoal-light'}`}>
                      {tab.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab indicator dots */}
          <div className="flex justify-center gap-2">
            {tabOrder.map((tabId) => (
              <div
                key={tabId}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeTab === tabId ? 'bg-terracotta w-4' : 'bg-charcoal/20'
                }`}
              />
            ))}
          </div>

          {/* Tab content with swipe */}
          <div ref={constraintsRef} className="overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="touch-pan-y"
            >
              <div className="bg-surface/50 border border-charcoal/5 rounded-2xl p-6 md:p-10 min-h-[320px] relative overflow-hidden shadow-sm">
                {/* Subtle glow */}
                <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-sage/10 rounded-full blur-[80px] pointer-events-none" />

                <AnimatePresence mode="wait">
                  {activeTab === 'story' && (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.6, ease: premiumEase }}
                      className="text-left space-y-5"
                    >
                      <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">
                        {t('sections.about.story.title')}
                      </h3>
                      <div className="text-sm md:text-base text-charcoal-light font-sans space-y-4 leading-relaxed">
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
                      className="text-left space-y-8"
                    >
                      {/* Timeline */}
                      <div className="relative space-y-8">
                        {/* Entry 1 */}
                        <div className="relative pl-8 border-l border-terracotta/20">
                          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-terracotta rounded-full shadow-sm" />
                          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                            <h4 className="text-base font-display font-medium text-charcoal">
                              {t('sections.about.experienceTimeline.entry1.company')}
                            </h4>
                            <span className="text-[10px] font-hud text-terracotta tracking-wider">{t('sections.about.experienceTimeline.entry1.period')}</span>
                          </div>
                          <span className="text-sm text-terracotta font-medium font-hud">{t('sections.about.experienceTimeline.entry1.role')}</span>
                          <p className="text-sm text-charcoal-light font-sans leading-relaxed mt-2">
{t('sections.about.experienceTimeline.entry1.description')}
                          </p>
                        </div>

                        {/* Entry 2 */}
                        <div className="relative pl-8 border-l border-sage/30">
                          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-sage rounded-full shadow-sm" />
                          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                            <h4 className="text-base font-display font-medium text-charcoal">
                              {t('sections.about.experienceTimeline.entry2.company')}
                            </h4>
                            <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('sections.about.experienceTimeline.entry2.period')}</span>
                          </div>
                          <span className="text-sm text-sage font-medium font-hud">{t('sections.about.experienceTimeline.entry2.role')}</span>
                          <p className="text-sm text-charcoal-light font-sans leading-relaxed mt-2">
{t('sections.about.experienceTimeline.entry2.description')}
                          </p>
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
                      className="text-left space-y-8"
                    >
                      {/* Soft Skills */}
                      <div className="space-y-4">
                        <h3 className="text-lg md:text-xl font-display font-medium text-charcoal tracking-wide flex items-center gap-2">
                          <Zap className="w-4 h-4 text-terracotta" />
                          {t('sections.about.skills.softTitle')}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Array.isArray(softSkills) && softSkills.map((skill, index) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3, ease: premiumEase }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="px-4 py-2 bg-terracotta/10 border border-terracotta/20 text-charcoal text-sm font-hud rounded-full cursor-none transition-colors duration-300 hover:bg-terracotta/20 hover:border-terracotta/30"
                              data-cursor="magnetic"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Hard Skills */}
                      <div className="space-y-4">
                        <h3 className="text-lg md:text-xl font-display font-medium text-charcoal tracking-wide flex items-center gap-2">
                          <Layers className="w-4 h-4 text-sage" />
                          {t('sections.about.skills.hardTitle')}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Array.isArray(hardSkills) && hardSkills.map((skill, index) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3, ease: premiumEase }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="px-4 py-2 bg-sage/10 border border-sage/20 text-charcoal text-sm font-hud rounded-full cursor-none transition-colors duration-300 hover:bg-sage/20 hover:border-sage/30"
                              data-cursor="magnetic"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
};
export default About;
