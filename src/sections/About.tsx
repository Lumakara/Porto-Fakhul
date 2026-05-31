import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Cpu, History, MapPin, Briefcase, Zap } from 'lucide-react';
import { Section, premiumEase, springEase, Parallax } from '../components/Section';

type TabType = 'story' | 'experience' | 'approach';

export const About = () => {
  const [activeTab, setActiveTab] = useState<TabType>('story');

  const tabs = [
    { id: 'story', label: 'Story', icon: Compass },
    { id: 'experience', label: 'Experience', icon: History },
    { id: 'approach', label: 'Approach', icon: Zap },
  ];

  return (
    <Section id="about" className="relative px-4 md:px-12">
      {/* Background */}
      <Parallax offset={80} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-purple opacity-30" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-7xl mx-auto z-10 relative">
        {/* Two-part header: large statement + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-24">
          {/* Left: Large name & title */}
          <div className="lg:col-span-5 text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="text-[10px] font-hud text-cyber tracking-[0.3em] uppercase block mb-4"
            >
              About
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.1, ease: premiumEase }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-[0.95]"
            >
              Sora
              <br />
              <span className="text-gradient-sakura">Takahashi</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1.2, ease: premiumEase }}
              className="text-sm text-gray-400 font-hud tracking-wider uppercase mt-4"
            >
              Creative Frontend Architect
            </motion.p>
          </div>

          {/* Right: Bio paragraph */}
          <div className="lg:col-span-7 flex flex-col justify-end text-left">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1.2, ease: premiumEase }}
              className="text-base md:text-lg text-gray-300 font-sans leading-relaxed"
            >
              I'm a creative developer based in Tokyo with 6+ years of experience 
              building award-worthy web experiences. I combine meticulous frontend 
              architecture with expressive motion design to create interfaces that 
              don't just function — they <em className="text-white not-italic font-medium">leave a lasting impression</em>.
            </motion.p>

            {/* Quick info pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.2, ease: springEase }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <div className="flex items-center space-x-2 bg-space-card/60 border border-white/5 px-3.5 py-2 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-sakura" />
                <span className="text-[10px] font-hud text-gray-300 tracking-wider">Tokyo, Japan</span>
              </div>
              <div className="flex items-center space-x-2 bg-space-card/60 border border-white/5 px-3.5 py-2 rounded-full">
                <Briefcase className="w-3.5 h-3.5 text-cyber" />
                <span className="text-[10px] font-hud text-gray-300 tracking-wider">6+ Years</span>
              </div>
              <div className="flex items-center space-x-2 bg-space-card/60 border border-white/5 px-3.5 py-2 rounded-full">
                <Cpu className="w-3.5 h-3.5 text-violet" />
                <span className="text-[10px] font-hud text-gray-300 tracking-wider">React · TypeScript · GSAP</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tab section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Tab selector — horizontal on desktop */}
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
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                  }`}
                  data-cursor="magnetic"
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sakura' : 'text-gray-600'}`} />
                  <span className="font-medium tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="lg:col-span-9">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-10 min-h-[320px] relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-sakura/5 rounded-full blur-[80px] pointer-events-none" />

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
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
                      From architecture to pixels
                    </h3>
                    <div className="text-sm md:text-base text-gray-400 font-sans space-y-4 leading-relaxed">
                      <p>
                        My journey began with traditional software engineering, 
                        but I quickly found myself drawn to the intersection of 
                        code and visual storytelling. The web wasn't just a platform 
                        to deliver logic — it was a canvas waiting for orchestration.
                      </p>
                      <p>
                        Inspired by the organic rhythm of Japanese design and the 
                        electric energy of Tokyo's neon districts, I developed an 
                        approach that treats every pixel with intention. Each interaction 
                        should feel like <em className="text-gray-300 not-italic">breathing</em> — 
                        natural, responsive, and alive.
                      </p>
                      <p>
                        Today, I focus on building creative web experiences for 
                        forward-thinking agencies, startups, and brands that refuse 
                        to look ordinary.
                      </p>
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
                      <div className="relative pl-8 border-l border-sakura/20">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-sakura rounded-full shadow-[0_0_10px_rgba(255,117,151,0.6)]" />
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                          <h4 className="text-base font-display font-bold text-white">
                            Senior Creative Engineer
                          </h4>
                          <span className="text-[10px] font-hud text-cyber tracking-wider">2024 — Present</span>
                        </div>
                        <span className="text-sm text-sakura font-medium font-hud">Tokyo Digital Craft Co.</span>
                        <p className="text-sm text-gray-400 font-sans leading-relaxed mt-2">
                          Leading frontend architecture for premium brand experiences. 
                          Built Awwwards-recognized creative websites using React, GSAP, 
                          and custom WebGL shaders. Mentoring junior developers on motion 
                          design principles.
                        </p>
                      </div>

                      {/* Entry 2 */}
                      <div className="relative pl-8 border-l border-violet/20">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-violet rounded-full shadow-[0_0_10px_rgba(139,92,246,0.4)]" />
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                          <h4 className="text-base font-display font-bold text-white">
                            Frontend System Architect
                          </h4>
                          <span className="text-[10px] font-hud text-gray-500 tracking-wider">2021 — 2024</span>
                        </div>
                        <span className="text-sm text-violet font-medium font-hud">Cyber Grid Agency</span>
                        <p className="text-sm text-gray-400 font-sans leading-relaxed mt-2">
                          Architected complex dashboard applications with strict accessibility 
                          standards (WCAG 2.1 AA). Optimized Lighthouse scores to 95+ across 
                          all metrics for enterprise clients.
                        </p>
                      </div>

                      {/* Entry 3 */}
                      <div className="relative pl-8 border-l border-gray-700/50">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-gray-600 rounded-full" />
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                          <h4 className="text-base font-display font-bold text-white">
                            Frontend Developer
                          </h4>
                          <span className="text-[10px] font-hud text-gray-500 tracking-wider">2020 — 2021</span>
                        </div>
                        <span className="text-sm text-gray-400 font-medium font-hud">Freelance / Open Source</span>
                        <p className="text-sm text-gray-400 font-sans leading-relaxed mt-2">
                          Built responsive web applications for startups and small businesses. 
                          Contributed to open-source React component libraries and animation toolkits.
                        </p>
                      </div>
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
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
                      How I work
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {[
                        {
                          num: '01',
                          title: 'Architecture First',
                          desc: 'Every project starts with clean component architecture, typed interfaces, and a scalable design system before any visual work begins.'
                        },
                        {
                          num: '02',
                          title: 'Motion with Purpose',
                          desc: 'Animations aren\'t decoration — they guide attention, reveal content progressively, and create a sense of physical space in the interface.'
                        },
                        {
                          num: '03',
                          title: 'Obsessive Polish',
                          desc: 'The difference between good and extraordinary lives in the details: micro-interactions, easing curves, responsive spacing, and pixel precision.'
                        }
                      ].map((item) => (
                        <div key={item.num} className="group">
                          <span className="text-3xl font-display font-black text-white/10 group-hover:text-sakura/30 transition-colors duration-300 block mb-3">
                            {item.num}
                          </span>
                          <h4 className="text-sm font-display font-bold text-white mb-2 tracking-wide">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-400 font-sans leading-relaxed">
                            {item.desc}
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
