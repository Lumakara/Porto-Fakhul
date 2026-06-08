import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Cpu, History, MapPin, Briefcase, Zap } from 'lucide-react';
import { Section, premiumEase, springEase, Parallax } from '../components/Section';
import { useTranslation } from '../i18n/index';

type TabType = 'story' | 'experience' | 'approach';

export const About = () => {
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const { t, tArray } = useTranslation();

  const tabs = [
    { id: 'story', label: t('about.tabs.story'), icon: Compass },
    { id: 'experience', label: t('about.tabs.experience'), icon: History },
    { id: 'approach', label: t('about.tabs.approach'), icon: Zap },
  ];

  const storyParagraphs = tArray('about.story.paragraphs');

  return (
    <Section id="about" className="relative px-4 md:px-12">
      {/* Background */}
      <Parallax offset={80} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-purple opacity-30" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-7xl mx-auto z-10 relative">
        {/* Two-part header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-24">
          {/* Left: Large name & title */}
          <div className="lg:col-span-5 text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase block mb-4"
            >
              {t('about.sectionLabel')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.1, ease: premiumEase }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-charcoal tracking-tight leading-[0.95]"
            >
              {t('about.name')}
              <br/>
              <span className="italic font-light text-charcoal-light">{t('about.nameSuffix')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1.2, ease: premiumEase }}
              className="text-sm text-charcoal-light font-hud tracking-wider uppercase mt-4"
            >
              {t('about.role')}
            </motion.p>
          </div>

          {/* Right: Bio paragraph */}
          <div className="lg:col-span-7 flex flex-col justify-end text-left">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1.2, ease: premiumEase }}
              className="text-base md:text-lg text-charcoal-light font-sans leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t('about.bio') }}
            />

            {/* Quick info pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.2, ease: springEase }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <div className="flex items-center space-x-2 bg-white border border-charcoal/5 px-3.5 py-2 rounded-full shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('about.pills.location')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-charcoal/5 px-3.5 py-2 rounded-full shadow-sm">
                <Briefcase className="w-3.5 h-3.5 text-sage" />
                <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('about.pills.experience')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-charcoal/5 px-3.5 py-2 rounded-full shadow-sm">
                <Cpu className="w-3.5 h-3.5 text-charcoal-light" />
                <span className="text-[10px] font-hud text-charcoal-light tracking-wider">{t('about.pills.trait')}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tab section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Tab selector */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-3 px-5 py-3.5 rounded-xl text-left cursor-none transition-all duration-300 font-hud text-sm border w-full ${
                    isActive 
                      ? 'bg-white border-charcoal/10 text-charcoal shadow-sm' 
                      : 'bg-transparent border-transparent text-charcoal-light hover:text-charcoal hover:bg-white/50'
                  }`}
                  data-cursor="magnetic"
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-charcoal-light'}`} />
                  <span className="font-medium tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="lg:col-span-9">
            <div className="bg-white/50 border border-charcoal/5 rounded-2xl p-6 md:p-10 min-h-[320px] relative overflow-hidden shadow-sm">
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
                      {t('about.story.title')}
                    </h3>
                    <div className="text-sm md:text-base text-charcoal-light font-sans space-y-4 leading-relaxed">
                      {storyParagraphs.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
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
                    <div className="relative space-y-8">
                      {[0, 1].map((idx) => {
                        const borderColor = idx === 0 ? 'border-terracotta/20' : 'border-sage/30';
                        const dotColor = idx === 0 ? 'bg-terracotta' : 'bg-sage';
                        const roleColor = idx === 0 ? 'text-terracotta' : 'text-sage';
                        const periodColor = idx === 0 ? 'text-terracotta' : 'text-charcoal-light';

                        return (
                          <div key={idx} className={`relative pl-8 border-l ${borderColor}`}>
                            <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 ${dotColor} rounded-full shadow-sm`} />
                            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                              <h4 className="text-base font-display font-medium text-charcoal">
                                {t(`about.experience.entries.${idx}.company`)}
                              </h4>
                              <span className={`text-[10px] font-hud ${periodColor} tracking-wider`}>
                                {t(`about.experience.entries.${idx}.period`)}
                              </span>
                            </div>
                            <span className={`text-sm ${roleColor} font-medium font-hud`}>
                              {t(`about.experience.entries.${idx}.role`)}
                            </span>
                            <p className="text-sm text-charcoal-light font-sans leading-relaxed mt-2">
                              {t(`about.experience.entries.${idx}.description`)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'approach' && (
                  <motion.div
                    key="approach"
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.6, ease: premiumEase }}
                    className="text-left space-y-6"
                  >
                    <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">
                      {t('about.approach.title')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {[0, 1, 2].map((idx) => (
                        <div key={idx} className="group">
                          <span className="text-3xl font-display font-bold text-charcoal/5 group-hover:text-terracotta/20 transition-colors duration-300 block mb-3">
                            {t(`about.approach.items.${idx}.num`)}
                          </span>
                          <h4 className="text-sm font-display font-semibold text-charcoal mb-2 tracking-wide">
                            {t(`about.approach.items.${idx}.title`)}
                          </h4>
                          <p className="text-xs text-charcoal-light font-sans leading-relaxed">
                            {t(`about.approach.items.${idx}.desc`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
export default About;
