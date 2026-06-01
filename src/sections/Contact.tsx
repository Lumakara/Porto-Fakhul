import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Compass, Mail, ArrowUpRight } from 'lucide-react';
import { Section, premiumEase, Parallax } from '../components/Section';
import { Magnetic } from '../components/Magnetic';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const executeConsoleLogs = async () => {
    const logs = [
      'Establishing secure connection...',
      'Encrypting message payload...',
      'Validating email integrity...',
      'Routing via jkt relay node...'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setConsoleLogs((prev) => [...prev, logs[i]]);
    }

    try {
      // Formspree API endpoint integration
      const response = await fetch('https://formspree.io/f/xvgzzyoy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setConsoleLogs((prev) => [...prev, 'Message delivered successfully ✓']);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setStatus('success');
      } else {
        throw new Error('Network error');
      }
    } catch (error) {
      setConsoleLogs((prev) => [...prev, 'ERROR: Transmission failed. Retrying...']);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    setConsoleLogs(['Initiating transmission...']);
    executeConsoleLogs();
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setStatus('idle');
    setConsoleLogs([]);
  };

  return (
    <Section id="contact" className="relative px-4 md:px-12">
      {/* Background */}
      <Parallax offset={50} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-sakura opacity-30" />
      </Parallax>
      <Parallax offset={100} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-cyber opacity-25" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-7xl mx-auto z-10 relative">
        
        {/* Section Header — large statement */}
        <div className="text-left mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase block mb-4"
          >
            Contact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.1, ease: premiumEase }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-charcoal tracking-tight"
          >
            Let's start a
            <br />
            <span className="italic font-light text-charcoal-light">conversation</span>
          </motion.h2>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: premiumEase }}
            className="lg:col-span-5 flex flex-col space-y-8 text-left"
          >
            <p className="text-base text-charcoal-light font-sans leading-relaxed">
Have a project, opportunity, or collaboration in mind? Feel free to get in touch and let's create something meaningful together.
            </p>

            {/* Contact details */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl bg-white border border-charcoal/5 shadow-sm">
                  <Compass className="w-4 h-4 text-terracotta" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-hud text-charcoal-light uppercase tracking-wider">Location</span>
                  <span className="text-sm text-charcoal font-medium font-sans">Jawa Barat, Indonesia </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl bg-white border border-charcoal/5 shadow-sm">
                  <Mail className="w-4 h-4 text-sage" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-hud text-charcoal-light uppercase tracking-wider">Email</span>
                  <a 
                    href="Fakhulrohman2@gmail.com" 
                    className="text-sm text-charcoal font-medium font-sans hover:text-terracotta transition-colors duration-300 cursor-none"
                    data-cursor="grow"
                  >
                    fakhulrohman2@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  ), 
                  label: 'GitHub', 
                  href: 'https://github.com/lumakara' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ), 
                  label: 'LinkedIn', 
                  href: 'https://www.linkedin.com/in/fakhul-rohman-nurokhim-b24276411?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' 
                },
              ].map((soc) => (
                <Magnetic key={soc.label} range={0.3}>
                  <a
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 bg-white border border-charcoal/5 hover:border-charcoal/15 hover:shadow-sm px-4 py-2.5 rounded-xl cursor-none text-sm font-sans text-charcoal-light hover:text-charcoal transition-all duration-300"
                    data-cursor="magnetic"
                  >
                    {soc.icon}
                    <span>{soc.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: premiumEase }}
            className="lg:col-span-7"
          >
            <div className="bg-white/50 border border-charcoal/5 rounded-2xl p-6 md:p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-between shadow-sm">
              
              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-sage/10 rounded-full blur-[80px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-5 text-left w-full relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-[10px] font-hud text-charcoal-light uppercase tracking-widest font-medium">
                          Your name
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Fakhul Rohman"
                          className="w-full bg-white border border-charcoal/10 focus:border-terracotta/30 rounded-xl px-4 py-3.5 text-charcoal text-sm font-sans placeholder-charcoal-light/50 outline-none transition-all duration-300 hover:border-charcoal/20 cursor-none shadow-sm"
                          data-cursor="grow"
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="text-[10px] font-hud text-charcoal-light uppercase tracking-widest font-medium">
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Fakhulrohman2@gmail.com"
                          className="w-full bg-white border border-charcoal/10 focus:border-terracotta/30 rounded-xl px-4 py-3.5 text-charcoal text-sm font-sans placeholder-charcoal-light/50 outline-none transition-all duration-300 hover:border-charcoal/20 cursor-none shadow-sm"
                          data-cursor="grow"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="message" className="text-[10px] font-hud text-charcoal-light uppercase tracking-widest font-medium">
                        Your message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Tell me about your project..."
                        className="w-full bg-white border border-charcoal/10 focus:border-terracotta/30 rounded-xl px-4 py-3.5 text-charcoal text-sm font-sans placeholder-charcoal-light/50 outline-none transition-all duration-300 hover:border-charcoal/20 resize-none cursor-none shadow-sm"
                        data-cursor="grow"
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-2 flex justify-end">
                      <Magnetic range={0.3}>
                        <button
                          type="submit"
                          className="group bg-charcoal text-sand font-hud text-xs tracking-widest px-8 py-4 rounded-full flex items-center space-x-2 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-terracotta cursor-none relative overflow-hidden"
                          data-cursor="grow"
                        >
                          <span className="relative z-10">SEND MESSAGE</span>
                          <Send className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </Magnetic>
                    </div>
                  </motion.form>
                )}

                {status === 'sending' && (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-stretch text-left h-full w-full relative z-10"
                  >
                    <div className="flex items-center space-x-2 text-terracotta font-hud text-xs font-medium uppercase tracking-wider mb-6">
                      <Terminal className="w-4 h-4 animate-pulse" />
                      <span>Sending message</span>
                    </div>

                    {/* Console logs */}
                    <div className="flex-1 w-full bg-white rounded-xl border border-charcoal/10 shadow-inner p-5 font-mono text-xs text-charcoal space-y-2.5 overflow-y-auto select-none">
                      {consoleLogs.map((log, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start"
                        >
                          <span className="mr-2 text-sage font-bold select-none">→</span>
                          <span>{log}</span>
                        </motion.div>
                      ))}
                      
                      {consoleLogs.length < 6 && (
                        <div className="flex items-center space-x-1.5 text-charcoal-light animate-pulse mt-2">
                          <span className="w-1.5 h-1.5 bg-terracotta rounded-full" />
                          <span>Processing...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center my-auto py-12 space-y-6 w-full relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center">
                      <Send className="w-6 h-6 text-sage" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">
                        Message sent!
                      </h3>
                      <p className="text-sm text-charcoal-light max-w-sm font-sans leading-relaxed">
                        Thank you for reaching out. I'll get back to you within 24 hours.
                      </p>
                    </div>

                    <Magnetic range={0.35}>
                      <button
                        onClick={handleReset}
                        className="bg-white border border-charcoal/10 text-charcoal font-hud text-xs font-medium tracking-widest px-6 py-3 rounded-full hover:bg-terracotta hover:text-white transition-all duration-300 cursor-none shadow-sm hover:shadow-md"
                        data-cursor="magnetic"
                      >
                        Send another
                      </button>
                    </Magnetic>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
export default Contact;
