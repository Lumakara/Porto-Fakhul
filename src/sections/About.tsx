import { useState, useRef } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Compass, History, Target } from 'lucide-react';
import { Section, premiumEase, springEase } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';
import { Magnetic } from '../components/Magnetic';

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

  const socialLinks = [
    { icon: GithubIcon, href: '#', label: 'GitHub' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
  ];

  return (
    <Section id="about" className="relative px-4 md:px-12">
      <div className="w-full max-w-4xl mx-auto z-10 relative">
        {/* Dark Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="bg-charcoal rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* Cover Banner */}
          <div className="relative h-40 md:h-52 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #C68A7C 0%, #A3B19B 50%, #2A2A2A 100%)',
              }}
            />
            {/* Decorative elements on the cover */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-4 left-12 w-24 h-24 rounded-full bg-white/5 blur-xl" />
            </div>
            {/* Section label on cover */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
              className="absolute top-4 left-6 text-[10px] font-hud text-white/70 tracking-[0.3em] uppercase"
            >
              {t('sections.about.sectionLabel')}
            </motion.span>
          </div>

          {/* Profile Section */}
          <div className="relative px-6 md:px-10 pb-8">
            {/* Avatar overlapping cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: springEase }}
              className="-mt-16 md:-mt-20 mb-5 flex justify-center md:justify-start"
            >
              <div className="relative">
                <div
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-4 border-charcoal shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #C68A7C, #D4AF37)',
                  }}
                >
                  <span className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide">
                    FR
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-charcoal" />
              </div>
            </motion.div>

            {/* Name & Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: premiumEase }}
              className="text-center md:text-left mb-4"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-tight">
                {t('sections.about.firstName')}{' '}
                <span className="italic font-light text-stone">{t('sections.about.lastName')}</span>
              </h2>
              <p className="text-sm md:text-base text-white/60 font-hud tracking-wider uppercase mt-2">
                {t('sections.about.role')}
              </p>
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: premiumEase }}
              className="flex justify-center md:justify-start gap-3 mb-6"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Magnetic key={social.label} range={0.3}>
                    <motion.a
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/20 transition-colors duration-300 cursor-none"
                      data-cursor="magnetic"
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </motion.a>
                  </Magnetic>
                );
              })}
            </motion.div>

            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: premiumEase }}
              className="mb-8"
            >
              <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed text-center md:text-left">
                {t('sections.about.bioText')}
              </p>
            </motion.div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mb-6" />

            {/* Tab Navigation - Dark pill style */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: springEase }}
              className="flex flex-col gap-5"
            >
              <div className="flex w-full bg-white/5 border border-white/10 rounded-2xl p-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className="relative flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl cursor-none transition-colors duration-300 font-hud text-sm"
                      data-cursor="magnetic"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="aboutTabIndicator"
                          className="absolute inset-0 bg-terracotta/20 border border-terracotta/30 rounded-xl"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-white/50'}`} />
                        <span className={`font-medium tracking-wide text-xs md:text-sm ${isActive ? 'text-white' : 'text-white/50'}`}>
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
                      activeTab === tabId ? 'bg-terracotta w-4' : 'bg-white/20'
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
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[280px] relative overflow-hidden">
                    {/* Subtle glow */}
                    <div className="absolute -top-20 -right-20 w-[180px] h-[180px] bg-terracotta/5 rounded-full blur-[80px] pointer-events-none" />

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
                          <h3 className="text-xl md:text-2xl font-display font-medium text-white tracking-wide">
                            {t('sections.about.story.title')}
                          </h3>
                          <div className="text-sm md:text-base text-white/60 font-sans space-y-4 leading-relaxed">
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
                            <div className="relative pl-8 border-l border-terracotta/30">
                              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-terracotta rounded-full shadow-sm shadow-terracotta/50" />
                              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                                <h4 className="text-base font-display font-medium text-white">
                                  {t('sections.about.experienceTimeline.entry1.company')}
                                </h4>
                                <span className="text-[10px] font-hud text-terracotta tracking-wider">{t('sections.about.experienceTimeline.entry1.period')}</span>
                              </div>
                              <span className="text-sm text-terracotta font-medium font-hud">{t('sections.about.experienceTimeline.entry1.role')}</span>
                              <p className="text-sm text-white/60 font-sans leading-relaxed mt-2">
                                {t('sections.about.experienceTimeline.entry1.description')}
                              </p>
                            </div>

                            {/* Entry 2 */}
                            <div className="relative pl-8 border-l border-sage/30">
                              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-sage rounded-full shadow-sm shadow-sage/50" />
                              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                                <h4 className="text-base font-display font-medium text-white">
                                  {t('sections.about.experienceTimeline.entry2.company')}
                                </h4>
                                <span className="text-[10px] font-hud text-white/50 tracking-wider">{t('sections.about.experienceTimeline.entry2.period')}</span>
                              </div>
                              <span className="text-sm text-sage font-medium font-hud">{t('sections.about.experienceTimeline.entry2.role')}</span>
                              <p className="text-sm text-white/60 font-sans leading-relaxed mt-2">
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
                            <h3 className="text-lg md:text-xl font-display font-medium text-white tracking-wide">
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
                                  className="px-4 py-2 bg-terracotta/15 border border-terracotta/25 text-white/80 text-sm font-hud rounded-full cursor-none transition-colors duration-300 hover:bg-terracotta/25 hover:border-terracotta/40"
                                  data-cursor="magnetic"
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {/* Hard Skills */}
                          <div className="space-y-4">
                            <h3 className="text-lg md:text-xl font-display font-medium text-white tracking-wide">
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
                                  className="px-4 py-2 bg-sage/15 border border-sage/25 text-white/80 text-sm font-hud rounded-full cursor-none transition-colors duration-300 hover:bg-sage/25 hover:border-sage/40"
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
export default About;
