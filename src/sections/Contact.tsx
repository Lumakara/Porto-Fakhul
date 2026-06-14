import { useState, useCallback, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Terminal,
  ArrowUpRight,
  AlertCircle,
  RotateCcw,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Section, premiumEase, Parallax } from '../components/Section';
import { Magnetic } from '../components/Magnetic';
import { useLanguage } from '../contexts/LanguageContext';
import { sendContactEmails } from '../lib/emailService';

const MAX_MESSAGE_LENGTH = 500;

interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Circular completion ring driven by how many fields are valid. */
function CompletionRing({ progress }: { progress: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex items-center justify-center w-11 h-11">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-charcoal/10" />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-terracotta"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - progress) }}
          transition={{ duration: 0.5, ease: premiumEase }}
        />
      </svg>
      <span className="absolute font-mono text-[10px] text-charcoal tabular-nums">{Math.round(progress * 3)}/3</span>
    </span>
  );
}

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [errorDetail, setErrorDetail] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sendingProgress, setSendingProgress] = useState(0);
  const isSubmitting = useRef(false);
  const { t } = useLanguage();

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      if (!value.trim()) return t('forms.validation.required');
      if (name === 'email' && !validateEmail(value)) return t('forms.validation.email');
      if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
        return t('forms.validation.maxLength').replace('{max}', String(MAX_MESSAGE_LENGTH));
      }
      return undefined;
    },
    [t]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid = (): boolean =>
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    validateEmail(formData.email) &&
    formData.message.trim() !== '' &&
    formData.message.length <= MAX_MESSAGE_LENGTH;

  const filledCount = [
    formData.name.trim() !== '',
    formData.email.trim() !== '' && validateEmail(formData.email),
    formData.message.trim() !== '',
  ].filter(Boolean).length;

  const executeConsoleLogs = async () => {
    // Brief "preparing" lines for texture, then the real EmailJS transport logs.
    const prepLogs = [
      t('sections.contact.sending.establishing'),
      t('sections.contact.sending.encrypting'),
    ];
    for (let i = 0; i < prepLogs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setConsoleLogs((prev) => [...prev, prepLogs[i]]);
      setSendingProgress(((i + 1) / 6) * 55);
    }

    // Real send: notification to owner's Gmail + automatic reply to the visitor.
    const result = await sendContactEmails({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    // Stream the detailed diagnostic logs into the on-screen console.
    for (let i = 0; i < result.logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 140));
      setConsoleLogs((prev) => [...prev, result.logs[i]]);
      setSendingProgress(55 + ((i + 1) / result.logs.length) * 45);
    }

    setSendingProgress(100);
    setErrorDetail(result.error ?? '');
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus(result.ok ? 'success' : 'error');
    isSubmitting.current = false;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    if (!isFormValid()) {
      setTouched({ name: true, email: true, message: true });
      setErrors({
        name: validateField('name', formData.name),
        email: validateField('email', formData.email),
        message: validateField('message', formData.message),
      });
      return;
    }
    isSubmitting.current = true;
    setStatus('sending');
    setSendingProgress(0);
    setConsoleLogs([t('sections.contact.sending.initiating')]);
    executeConsoleLogs();
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setStatus('idle');
    setConsoleLogs([]);
    setErrorDetail('');
    setErrors({});
    setTouched({});
    setSendingProgress(0);
    isSubmitting.current = false;
  };

  const handleRetry = () => {
    isSubmitting.current = true;
    setStatus('sending');
    setSendingProgress(0);
    setConsoleLogs([t('sections.contact.sending.initiating')]);
    executeConsoleLogs();
  };

  // Floating-label field styles.
  const fieldBase =
    'peer w-full bg-surface border rounded-xl px-4 pt-6 pb-2 text-charcoal text-sm font-sans outline-none transition-all duration-300 hover:border-charcoal/20 cursor-none shadow-sm';
  const labelBase =
    'absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light/50 text-sm font-sans pointer-events-none transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:font-hud peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-terracotta peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-hud peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-charcoal-light';

  return (
    <Section id="contact" className="relative px-4 sm:px-6 md:px-12">
      {/* Ambient background */}
      <Parallax offset={50} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-sakura opacity-40" />
      </Parallax>
      <Parallax offset={100} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-cyber opacity-30" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-6xl mx-auto z-10 relative">
        {/* ── Header ── */}
        <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: premiumEase }}
              className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase flex items-center gap-2 mb-4"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t('sections.contact.sectionLabel')}
              <span className="ml-1 font-mono text-charcoal-light/40 normal-case tracking-normal">/ 04</span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.1, ease: premiumEase }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-charcoal tracking-tight leading-[1.05]"
            >
              {t('sections.contact.heading')}{' '}
              <span className="italic font-light text-charcoal-light">{t('sections.contact.headingItalic')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: premiumEase }}
              className="mt-5 text-base text-charcoal-light font-sans leading-relaxed max-w-xl"
            >
              {t('sections.contact.description')}
            </motion.p>
          </div>
        </div>

        {/* ── Body grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left rail: AI assistant bridge */}
          <motion.div
            initial={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.2, ease: premiumEase }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {/* Assistant bridge */}
            <Magnetic range={0.25}>
              <motion.button
                onClick={() => window.dispatchEvent(new CustomEvent('open-fab', { detail: { tab: 'chat' } }))}
                data-sound="click"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-terracotta to-terracotta/80 text-white font-hud text-xs font-medium tracking-widest hover:shadow-lg hover:shadow-terracotta/25 transition-all duration-300 cursor-none"
                data-cursor="grow"
                aria-label={t('sections.contact.assistantBridge')}
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                {t('sections.contact.assistantBridge')}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </motion.button>
            </Magnetic>
          </motion.div>

          {/* Right: message console */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.3, ease: premiumEase }}
            className="lg:col-span-7"
          >
            <div className="bg-surface/60 border border-charcoal/5 rounded-3xl relative overflow-hidden min-h-[480px] flex flex-col shadow-sm">
              {/* Terminal title bar */}
              <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-charcoal/5 bg-charcoal/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-terracotta/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-sage/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-charcoal/20" />
                </div>
                <span className="font-mono text-[10px] text-charcoal-light/60 tracking-wider truncate">~/uplink/new-message</span>
              </div>

              <div className="absolute -top-20 -right-20 w-[220px] h-[220px] bg-sage/10 rounded-full blur-[90px] pointer-events-none" />

              <div className="flex-1 flex flex-col p-5 sm:p-6 md:p-8 relative">
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5 text-left w-full relative z-10"
                    >
                      {/* Completion header */}
                      <div className="flex items-center gap-3 pb-1">
                        <CompletionRing progress={filledCount / 3} />
                        <div className="flex flex-col">
                          <span className="font-hud text-xs text-charcoal font-medium tracking-wide">Compose message</span>
                          <span className="font-hud text-[11px] text-charcoal-light">
                            {filledCount === 3 ? 'Ready to transmit' : 'Fill the fields below'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div className="flex flex-col space-y-1">
                          <div className="relative">
                            <input
                              id="name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              placeholder=" "
                              className={`${fieldBase} ${errors.name && touched.name ? 'border-red-400 focus:border-red-400' : 'border-charcoal/10 focus:border-terracotta/50'}`}
                              data-cursor="grow"
                            />
                            <label htmlFor="name" className={labelBase}>
                              {t('sections.contact.form.nameLabel')}
                            </label>
                          </div>
                          <AnimatePresence>
                            {errors.name && touched.name && (
                              <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[11px] text-red-400 font-sans pl-1">
                                {errors.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col space-y-1">
                          <div className="relative">
                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              placeholder=" "
                              className={`${fieldBase} ${errors.email && touched.email ? 'border-red-400 focus:border-red-400' : 'border-charcoal/10 focus:border-terracotta/50'}`}
                              data-cursor="grow"
                            />
                            <label htmlFor="email" className={labelBase}>
                              {t('sections.contact.form.emailLabel')}
                            </label>
                          </div>
                          <AnimatePresence>
                            {errors.email && touched.email && (
                              <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[11px] text-red-400 font-sans pl-1">
                                {errors.email}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col space-y-1">
                        <div className="relative">
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            rows={5}
                            placeholder=" "
                            className={`peer w-full bg-surface border rounded-xl px-4 pt-6 pb-2 text-charcoal text-sm font-sans outline-none transition-all duration-300 hover:border-charcoal/20 resize-none cursor-none shadow-sm ${errors.message && touched.message ? 'border-red-400 focus:border-red-400' : 'border-charcoal/10 focus:border-terracotta/50'}`}
                            data-cursor="grow"
                          />
                          <label
                            htmlFor="message"
                            className="absolute left-4 top-5 text-charcoal-light/50 text-sm font-sans pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-hud peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-terracotta peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-hud peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-charcoal-light"
                          >
                            {t('sections.contact.form.messageLabel')}
                          </label>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <AnimatePresence>
                            {errors.message && touched.message && (
                              <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[11px] text-red-400 font-sans">
                                {errors.message}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          <span className={`text-[11px] font-mono ml-auto ${formData.message.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-red-400' : 'text-charcoal-light/60'}`}>
                            {formData.message.length}/{MAX_MESSAGE_LENGTH}
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-1 flex justify-end">
                        <Magnetic range={0.3}>
                          <motion.button
                            type="submit"
                            disabled={!isFormValid()}
                            className={`group font-hud text-xs tracking-widest px-8 py-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm cursor-none relative overflow-hidden ${
                              isFormValid() ? 'bg-charcoal text-sand hover:shadow-md hover:bg-terracotta' : 'bg-charcoal/40 text-sand/60 cursor-not-allowed'
                            }`}
                            animate={
                              isFormValid()
                                ? { boxShadow: ['0 0 0 0 rgba(198,138,124,0)', '0 0 14px 2px rgba(198,138,124,0.25)', '0 0 0 0 rgba(198,138,124,0)'] }
                                : { boxShadow: '0 0 0 0 rgba(198,138,124,0)' }
                            }
                            transition={isFormValid() ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                            data-cursor="grow"
                          >
                            <span className="relative z-10">{t('sections.contact.form.submit')}</span>
                            <Send className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </motion.button>
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
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-stretch text-left h-full w-full relative z-10"
                    >
                      <div className="flex items-center gap-2 text-terracotta font-hud text-xs font-medium uppercase tracking-wider mb-4">
                        <Terminal className="w-4 h-4 animate-pulse" />
                        <span>{t('sections.contact.sending.title')}</span>
                      </div>
                      <div className="w-full h-1 bg-charcoal/5 rounded-full mb-5 overflow-hidden">
                        <motion.div className="h-full bg-terracotta rounded-full" initial={{ width: '0%' }} animate={{ width: `${sendingProgress}%` }} transition={{ duration: 0.5, ease: premiumEase }} />
                      </div>
                      <div className="flex-1 w-full bg-surface rounded-xl border border-charcoal/10 shadow-inner p-5 font-mono text-xs text-charcoal space-y-2.5 overflow-y-auto select-none">
                        {consoleLogs.map((log, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-start">
                            <span className="mr-2 text-sage font-bold select-none">&rarr;</span>
                            <span>{log}</span>
                          </motion.div>
                        ))}
                        {sendingProgress < 100 && (
                          <div className="flex items-center gap-1.5 text-charcoal-light animate-pulse mt-2">
                            <span className="w-1.5 h-1.5 bg-terracotta rounded-full" />
                            <span>{t('sections.contact.sending.processing')}</span>
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
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center text-center my-auto py-12 gap-6 w-full relative z-10"
                    >
                      <div className="relative">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border border-sage/30"
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 2 }}
                          />
                        ))}
                        <div className="w-16 h-16 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center relative">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                            <Send className="w-6 h-6 text-sage" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">{t('sections.contact.success.title')}</h3>
                        <p className="text-sm text-charcoal-light max-w-sm font-sans leading-relaxed">{t('sections.contact.success.description')}</p>
                      </div>
                      <Magnetic range={0.35}>
                        <button
                          onClick={handleReset}
                          className="bg-surface border border-charcoal/10 text-charcoal font-hud text-xs font-medium tracking-widest px-6 py-3 rounded-full hover:bg-terracotta hover:text-white transition-all duration-300 cursor-none shadow-sm hover:shadow-md"
                          data-cursor="magnetic"
                        >
                          {t('sections.contact.success.sendAnother')}
                        </button>
                      </Magnetic>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-stretch text-left h-full w-full relative z-10"
                    >
                      <div className="flex flex-col items-center text-center gap-3 mb-5">
                        <div className="w-14 h-14 rounded-full bg-terracotta/5 border border-terracotta/20 flex items-center justify-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}>
                            <AlertCircle className="w-6 h-6 text-red-400" />
                          </motion.div>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">{t('sections.contact.error.title')}</h3>
                          <p className="text-sm text-charcoal-light max-w-sm font-sans leading-relaxed mx-auto">
                            {errorDetail || t('sections.contact.error.description')}
                          </p>
                        </div>
                      </div>

                      {/* Detailed diagnostic console — shows exactly where it failed */}
                      <div className="flex items-center gap-2 text-charcoal-light font-hud text-[10px] uppercase tracking-widest mb-2">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{t('sections.contact.error.logsTitle')}</span>
                      </div>
                      <div className="flex-1 w-full bg-charcoal rounded-xl border border-white/10 shadow-inner p-4 font-mono text-[11px] text-sand/90 space-y-1.5 overflow-y-auto select-text max-h-56">
                        {consoleLogs.map((log, idx) => {
                          const isFail = /✗|fail|error|missing/i.test(log);
                          const isWarn = /⚠/.test(log);
                          const isOk = /✓/.test(log);
                          return (
                            <div key={idx} className="flex items-start gap-2">
                              <span className={`select-none ${isFail ? 'text-red-400' : isWarn ? 'text-gold' : isOk ? 'text-sage' : 'text-sand/40'}`}>
                                {isFail ? '✗' : isWarn ? '⚠' : isOk ? '✓' : '›'}
                              </span>
                              <span className={`break-words ${isFail ? 'text-red-300' : isWarn ? 'text-gold/90' : 'text-sand/80'}`}>
                                {log.replace(/^\[[^\]]*\]\s*[✗⚠✓·→]?\s*/, '')}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-center gap-3 mt-5">
                        <Magnetic range={0.35}>
                          <button
                            onClick={handleRetry}
                            className="bg-charcoal text-sand font-hud text-xs font-medium tracking-widest px-6 py-3 rounded-full hover:bg-terracotta transition-all duration-300 cursor-none shadow-sm hover:shadow-md flex items-center gap-2"
                            data-cursor="magnetic"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {t('sections.contact.error.retry')}
                          </button>
                        </Magnetic>
                        <Magnetic range={0.35}>
                          <button
                            onClick={handleReset}
                            className="bg-surface border border-charcoal/10 text-charcoal font-hud text-xs font-medium tracking-widest px-6 py-3 rounded-full hover:border-charcoal/20 transition-all duration-300 cursor-none shadow-sm"
                            data-cursor="magnetic"
                          >
                            {t('sections.contact.error.backToForm')}
                          </button>
                        </Magnetic>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
