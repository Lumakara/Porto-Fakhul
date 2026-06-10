import { useState, useCallback, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Compass, Mail, ArrowUpRight, AlertCircle, RotateCcw, Copy, Check, MessageSquare, Sparkles, Clock } from 'lucide-react';
import { Section, premiumEase, Parallax } from '../components/Section';
import { Magnetic } from '../components/Magnetic';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const MAX_MESSAGE_LENGTH = 500;
const CONTACT_EMAIL = 'fakhulrohman2@gmail.com';

interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const GITHUB_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LINKEDIN_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sendingProgress, setSendingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const isSubmitting = useRef(false);
  const { t } = useLanguage();
  const { showToast } = useToast();

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      showToast(t('toasts.emailCopied'), 'success');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable - silently ignore
    }
  }, [showToast, t]);

  const validateField = useCallback((name: string, value: string): string | undefined => {
    if (!value.trim()) {
      return t('forms.validation.required');
    }
    if (name === 'email' && !validateEmail(value)) {
      return t('forms.validation.email');
    }
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return t('forms.validation.maxLength').replace('{max}', String(MAX_MESSAGE_LENGTH));
    }
    return undefined;
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      validateEmail(formData.email) &&
      formData.message.trim() !== '' &&
      formData.message.length <= MAX_MESSAGE_LENGTH
    );
  };

  const filledCount = [
    formData.name.trim() !== '',
    formData.email.trim() !== '' && validateEmail(formData.email),
    formData.message.trim() !== '',
  ].filter(Boolean).length;

  const executeConsoleLogs = async () => {
    const logs = [
      t('sections.contact.sending.establishing'),
      t('sections.contact.sending.encrypting'),
      t('sections.contact.sending.validating'),
      t('sections.contact.sending.routing'),
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setConsoleLogs((prev) => [...prev, logs[i]]);
      setSendingProgress(((i + 1) / (logs.length + 1)) * 80);
    }

    try {
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
        setSendingProgress(100);
        setConsoleLogs((prev) => [...prev, t('sections.contact.sending.success')]);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setStatus('success');
      } else {
        throw new Error('Network error');
      }
    } catch {
      setConsoleLogs((prev) => [...prev, t('sections.contact.sending.error')]);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('error');
    } finally {
      isSubmitting.current = false;
    }
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

  const socials = [
    {
      icon: GITHUB_ICON,
      label: t('sections.contact.github'),
      hoverText: t('sections.contact.githubHover'),
      href: 'https://github.com/lumakara',
    },
    {
      icon: LINKEDIN_ICON,
      label: t('sections.contact.linkedin'),
      hoverText: t('sections.contact.linkedinHover'),
      href: 'https://www.linkedin.com/in/fakhul-rohman-nurokhim-b24276411?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
  ];

  // Shared classes for the floating-label form fields.
  const fieldBase =
    'peer w-full bg-surface border rounded-xl px-4 pt-6 pb-2 text-charcoal text-sm font-sans outline-none transition-all duration-300 hover:border-charcoal/20 cursor-none shadow-sm';
  const labelBase =
    'absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light/50 text-sm font-sans pointer-events-none transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:font-hud peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-terracotta peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-hud peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-charcoal-light';

  return (
    <Section id="contact" className="relative px-4 sm:px-6 md:px-12">
      {/* Background */}
      <Parallax offset={50} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-sakura opacity-30" />
      </Parallax>
      <Parallax offset={100} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-cyber opacity-25" />
      </Parallax>
      <div className="noise-overlay z-0" />

      <div className="w-full max-w-7xl mx-auto z-10 relative">

        {/* Section Header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="text-[10px] font-hud text-terracotta tracking-[0.3em] uppercase flex items-center gap-2 mb-4"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t('sections.contact.sectionLabel')}
              <span className="ml-1 font-mono text-charcoal-light/40 normal-case tracking-normal">/ 04</span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.1, ease: premiumEase }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-charcoal tracking-tight leading-[1.05]"
            >
              {t('sections.contact.heading')}{' '}
              <span className="italic font-light text-charcoal-light">{t('sections.contact.headingItalic')}</span>
            </motion.h2>
          </div>

          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: premiumEase }}
            className="flex items-center gap-3 self-start md:self-auto rounded-full bg-surface border border-charcoal/5 pl-3 pr-4 py-2.5 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage" />
            </span>
            <span className="text-xs font-hud text-charcoal tracking-wide whitespace-nowrap">Available for work</span>
          </motion.div>
        </div>

        {/* Bento: form (left, prominent) + info rail (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: premiumEase }}
            className="order-2 lg:order-1 lg:col-span-7"
          >
            <div className="bg-surface/60 border border-charcoal/5 rounded-3xl relative overflow-hidden min-h-[460px] flex flex-col shadow-sm">

              {/* Terminal-style title bar */}
              <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-charcoal/5 bg-charcoal/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-terracotta/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-sage/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-charcoal/20" />
                </div>
                <span className="font-mono text-[10px] text-charcoal-light/60 tracking-wider truncate">
                  ~/new-message
                </span>
              </div>

              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-sage/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 md:p-8 relative">
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col space-y-5 text-left w-full relative z-10"
                    >
                      {/* Progress indicator */}
                      <div className="flex items-center gap-2 mb-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-charcoal/5">
                            <motion.div
                              className="h-full rounded-full bg-terracotta"
                              initial={{ width: '0%' }}
                              animate={{ width: filledCount > i ? '100%' : '0%' }}
                              transition={{ duration: 0.4, ease: premiumEase }}
                            />
                          </div>
                        ))}
                        <span className="text-[10px] font-hud text-charcoal-light ml-1 tabular-nums">{filledCount}/3</span>
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
                              className={`${fieldBase} ${
                                errors.name && touched.name
                                  ? 'border-red-400 focus:border-red-400'
                                  : 'border-charcoal/10 focus:border-terracotta/50'
                              }`}
                              data-cursor="grow"
                            />
                            <label htmlFor="name" className={labelBase}>
                              {t('sections.contact.form.nameLabel')}
                            </label>
                          </div>
                          <AnimatePresence>
                            {errors.name && touched.name && (
                              <motion.span
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="text-[11px] text-red-400 font-sans pl-1"
                              >
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
                              className={`${fieldBase} ${
                                errors.email && touched.email
                                  ? 'border-red-400 focus:border-red-400'
                                  : 'border-charcoal/10 focus:border-terracotta/50'
                              }`}
                              data-cursor="grow"
                            />
                            <label htmlFor="email" className={labelBase}>
                              {t('sections.contact.form.emailLabel')}
                            </label>
                          </div>
                          <AnimatePresence>
                            {errors.email && touched.email && (
                              <motion.span
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="text-[11px] text-red-400 font-sans pl-1"
                              >
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
                            className={`peer w-full bg-surface border rounded-xl px-4 pt-6 pb-2 text-charcoal text-sm font-sans outline-none transition-all duration-300 hover:border-charcoal/20 resize-none cursor-none shadow-sm ${
                              errors.message && touched.message
                                ? 'border-red-400 focus:border-red-400'
                                : 'border-charcoal/10 focus:border-terracotta/50'
                            }`}
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
                              <motion.span
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="text-[11px] text-red-400 font-sans"
                              >
                                {errors.message}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          <span className={`text-[11px] font-mono ml-auto ${
                            formData.message.length > MAX_MESSAGE_LENGTH * 0.9
                              ? 'text-red-400'
                              : 'text-charcoal-light/60'
                          }`}>
                            {formData.message.length}/{MAX_MESSAGE_LENGTH}
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-2 flex justify-end">
                        <Magnetic range={0.3}>
                          <motion.button
                            type="submit"
                            disabled={!isFormValid()}
                            className={`group font-hud text-xs tracking-widest px-8 py-4 rounded-full flex items-center space-x-2 transition-all duration-300 shadow-sm cursor-none relative overflow-hidden ${
                              isFormValid()
                                ? 'bg-charcoal text-sand hover:shadow-md hover:bg-terracotta'
                                : 'bg-charcoal/40 text-sand/60 cursor-not-allowed'
                            }`}
                            animate={
                              isFormValid()
                                ? { boxShadow: ['0 0 0 0 rgba(185,111,89,0)', '0 0 12px 2px rgba(185,111,89,0.2)', '0 0 0 0 rgba(185,111,89,0)'] }
                                : { boxShadow: '0 0 0 0 rgba(185,111,89,0)' }
                            }
                            transition={
                              isFormValid()
                                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                                : { duration: 0.3 }
                            }
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
                      <div className="flex items-center space-x-2 text-terracotta font-hud text-xs font-medium uppercase tracking-wider mb-4">
                        <Terminal className="w-4 h-4 animate-pulse" />
                        <span>{t('sections.contact.sending.title')}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1 bg-charcoal/5 rounded-full mb-5 overflow-hidden">
                        <motion.div
                          className="h-full bg-terracotta rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${sendingProgress}%` }}
                          transition={{ duration: 0.5, ease: premiumEase }}
                        />
                      </div>

                      {/* Console logs */}
                      <div className="flex-1 w-full bg-surface rounded-xl border border-charcoal/10 shadow-inner p-5 font-mono text-xs text-charcoal space-y-2.5 overflow-y-auto select-none">
                        {consoleLogs.map((log, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start"
                          >
                            <span className="mr-2 text-sage font-bold select-none">&rarr;</span>
                            <span>{log}</span>
                          </motion.div>
                        ))}

                        {sendingProgress < 100 && (
                          <div className="flex items-center space-x-1.5 text-charcoal-light animate-pulse mt-2">
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
                      className="flex flex-col items-center justify-center text-center my-auto py-12 space-y-6 w-full relative z-10"
                    >
                      {/* Celebration rings */}
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
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                          >
                            <Send className="w-6 h-6 text-sage" />
                          </motion.div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">
                          {t('sections.contact.success.title')}
                        </h3>
                        <p className="text-sm text-charcoal-light max-w-sm font-sans leading-relaxed">
                          {t('sections.contact.success.description')}
                        </p>
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
                      className="flex flex-col items-center justify-center text-center my-auto py-12 space-y-6 w-full relative z-10"
                    >
                      <div className="w-16 h-16 rounded-full bg-terracotta/5 border border-terracotta/20 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                        >
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        </motion.div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-display font-medium text-charcoal tracking-wide">
                          {t('sections.contact.error.title')}
                        </h3>
                        <p className="text-sm text-charcoal-light max-w-sm font-sans leading-relaxed">
                          {t('sections.contact.error.description')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
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

          {/* Info rail */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }}
            className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-4 text-left"
          >
            {/* Intro */}
            <p className="text-base text-charcoal-light font-sans leading-relaxed">
              {t('sections.contact.description')}
            </p>

            {/* Response-time chip */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-sage/10 border border-sage/20 px-3.5 py-2">
              <Clock className="w-3.5 h-3.5 text-sage" />
              <span className="text-[11px] font-hud text-charcoal tracking-wide">Replies within 24 hours</span>
            </div>

            {/* Email card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-surface border border-charcoal/5 p-4 shadow-sm"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-sage/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-charcoal/5 group-hover:bg-sage/10 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-sage" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-hud text-charcoal-light uppercase tracking-wider">{t('sections.contact.emailLabel')}</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-charcoal font-medium font-sans hover:text-terracotta transition-colors duration-300 cursor-none truncate"
                    data-cursor="grow"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  data-sound="click"
                  aria-label={copied ? 'Email copied' : 'Copy email address'}
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-surface border border-charcoal/5 flex items-center justify-center text-charcoal-light hover:text-terracotta hover:border-terracotta/30 transition-colors cursor-none"
                  data-cursor="magnetic"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                        <Check className="w-4 h-4 text-sage" />
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                        <Copy className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            {/* Location card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-surface border border-charcoal/5 p-4 shadow-sm"
            >
              <div className="relative flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-charcoal/5 group-hover:bg-terracotta/10 transition-colors duration-300">
                  <Compass className="w-4 h-4 text-terracotta" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-hud text-charcoal-light uppercase tracking-wider">{t('sections.contact.locationLabel')}</span>
                  <span className="text-sm text-charcoal font-medium font-sans">{t('sections.contact.locationValue')}</span>
                </div>
              </div>
            </motion.div>

            {/* Socials - 2-up grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socials.map((soc) => (
                <Magnetic key={soc.label} range={0.3}>
                  <motion.a
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-surface border border-charcoal/5 hover:border-charcoal/15 hover:shadow-md px-4 py-3.5 rounded-2xl cursor-none transition-all duration-300 h-full"
                    data-cursor="magnetic"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 rounded-lg bg-charcoal/5 group-hover:bg-terracotta/10 transition-colors duration-300 text-charcoal group-hover:text-terracotta">
                      {soc.icon}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium text-charcoal font-sans">{soc.label}</span>
                      <span className="text-[11px] text-charcoal-light font-sans truncate group-hover:text-terracotta transition-colors duration-300">
                        {soc.hoverText}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-charcoal-light opacity-0 group-hover:opacity-100 group-hover:text-terracotta transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                </Magnetic>
              ))}
            </div>

            {/* Assistant bridge */}
            <div className="pt-1">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-charcoal/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-[10px] font-hud text-charcoal-light uppercase tracking-widest bg-sand">
                    {t('sections.contact.or')}
                  </span>
                </div>
              </div>
              <Magnetic range={0.3}>
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
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
export default Contact;
