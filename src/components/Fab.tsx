import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageCircle, SlidersHorizontal, Volume2 } from 'lucide-react';
import { useReducedMotion } from '../lib/motion';
import { usePreferences } from '../contexts/PreferencesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusTrap } from './menu/FocusTrap';
import { SettingsPanel } from './menu/SettingsPanel';
import { ChatPanel } from './ai/ChatPanel';

type FabTab = 'chat' | 'settings';

const FAB_SEEN_KEY = 'porto-fab-seen';
const AUDIO_TIP_KEY = 'porto-audio-tip-seen';

/**
 * Floating Action Button that expands into a control surface containing the
 * AI assistant and the full site-settings panel. Anchored bottom-right on
 * desktop; behaves as a bottom sheet on small screens.
 */
export function Fab() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FabTab>('chat');
  const [hasSeen, setHasSeen] = useState(() => {
    try {
      return localStorage.getItem(FAB_SEEN_KEY) === '1';
    } catch {
      return true;
    }
  });
  const [showAudioTip, setShowAudioTip] = useState(false);
  const reducedMotion = useReducedMotion();
  const { preferences } = usePreferences();
  const { t } = useLanguage();

  const dismissAudioTip = useCallback(() => {
    setShowAudioTip(false);
    try {
      localStorage.setItem(AUDIO_TIP_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const markSeen = useCallback(() => {
    setHasSeen(true);
    setShowAudioTip(false);
    try {
      localStorage.setItem(FAB_SEEN_KEY, '1');
      localStorage.setItem(AUDIO_TIP_KEY, '1');
    } catch {
      // ignore storage failures
    }
  }, []);

  const openFab = useCallback(
    (nextTab?: FabTab) => {
      setOpen(true);
      if (nextTab) setTab(nextTab);
      markSeen();
    },
    [markSeen]
  );

  // Close on Escape handled by FocusTrap; also lock scroll on mobile sheet.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(max-width: 640px)');
    if (mq.matches) document.body.classList.add('scroll-locked');
    return () => document.body.classList.remove('scroll-locked');
  }, [open]);

  // Allow other parts of the app (e.g. the Contact bridge) to open the FAB.
  useEffect(() => {
    const onOpenEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { tab?: FabTab } | undefined;
      openFab(detail?.tab ?? 'chat');
    };
    window.addEventListener('open-fab', onOpenEvent as EventListener);
    return () => window.removeEventListener('open-fab', onOpenEvent as EventListener);
  }, [openFab]);

  // Keyboard shortcut: "g" or "?" toggles the panel (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      const typing =
        !!el &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (typing) return;
      if (e.key === '?' || e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (next) markSeen();
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [markSeen]);

  // First-run hint: let users know subtle UI sounds exist (only when they're off).
  useEffect(() => {
    let seen: boolean;
    try {
      seen = localStorage.getItem(AUDIO_TIP_KEY) === '1';
    } catch {
      seen = true;
    }
    if (seen || preferences.audio.uiSounds) return;
    const showTimer = window.setTimeout(() => setShowAudioTip(true), 3000);
    const hideTimer = window.setTimeout(() => dismissAudioTip(), 12000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [preferences.audio.uiSounds, dismissAudioTip]);

  const panelTransition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 30 };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          setOpen((v) => !v);
          markSeen();
        }}
        data-sound="click"
        className="fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full bg-charcoal text-sand shadow-xl flex items-center justify-center cursor-none border border-white/10 group"
        style={{
          bottom: 'max(env(safe-area-inset-bottom, 0px) + 0.5rem, 1.25rem)',
          right: 'max(env(safe-area-inset-right, 0px) + 0.5rem, 1.25rem)',
        }}
        data-cursor="grow"
        aria-label={open ? 'Close assistant & settings' : 'Open assistant & settings'}
        aria-expanded={open}
        aria-keyshortcuts="g"
        title="Assistant & settings (press G)"
      >
        {/* Pulsing halo */}
        {!open && !reducedMotion && (
          <span className="absolute inset-0 rounded-full bg-terracotta/40 animate-ping opacity-60" />
        )}
        {/* First-visit "new" indicator */}
        {!open && !hasSeen && (
          <span className="absolute -top-0.5 -right-0.5 z-20 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75 animate-ping" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-terracotta border-2 border-charcoal" />
          </span>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="spark"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Sparkles className="w-6 h-6 text-terracotta" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* First-run audio hint */}
      <AnimatePresence>
        {showAudioTip && !open && (
          <motion.div
            key="audio-tip"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-[5.5rem] right-5 z-[79] max-w-[250px]"
            role="status"
          >
            <div className="relative flex items-start gap-2 rounded-2xl bg-charcoal text-sand border border-white/10 shadow-xl pl-3.5 pr-2 py-3">
              <button
                onClick={() => {
                  dismissAudioTip();
                  openFab('settings');
                }}
                data-sound="click"
                className="flex items-start gap-2.5 text-left cursor-none"
                data-cursor="magnetic"
              >
                <Volume2 className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-[11px] font-hud leading-snug tracking-wide">
                  {t('tooltips.audioHint')}
                </span>
              </button>
              <button
                onClick={dismissAudioTip}
                aria-label={t('tooltips.dismiss')}
                className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-sand/50 hover:text-sand transition-colors cursor-none"
                data-cursor="magnetic"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {/* Pointer arrow */}
              <span className="absolute -bottom-1.5 right-7 w-3 h-3 rotate-45 bg-charcoal border-r border-b border-white/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile only emphasis, click closes everywhere) */}
            <motion.div
              key="fab-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[78] bg-black/30 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="fab-panel"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={panelTransition}
              role="dialog"
              aria-modal="true"
              aria-label="Assistant and settings"
              className="fixed z-[81] bg-sand/95 backdrop-blur-xl border border-charcoal/10 shadow-2xl flex flex-col
                         inset-x-0 bottom-0 rounded-t-3xl h-[88dvh] max-h-[88dvh]
                         sm:inset-x-auto sm:bottom-24 sm:right-5 sm:left-auto sm:w-[min(384px,calc(100vw-2.5rem))] sm:h-[560px] sm:max-h-[calc(100dvh-8rem)] sm:rounded-3xl
                         lg:w-[408px] lg:h-[620px] lg:max-h-[calc(100dvh-9rem)]"
              style={{
                paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
              }}
            >
              <FocusTrap active={open} onEscape={() => setOpen(false)}>
                <div className="flex flex-col h-full min-h-0">
                  {/* Mobile grab handle (bottom-sheet affordance) */}
                  <div className="flex justify-center pt-2.5 pb-0.5 sm:hidden" aria-hidden="true">
                    <span className="w-10 h-1 rounded-full bg-charcoal/15" />
                  </div>
                  {/* Tab header */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:p-3 border-b border-charcoal/10">
                    <div className="flex items-center gap-1 bg-charcoal/5 rounded-full p-1">
                      {([
                        { id: 'chat', label: 'Assistant', icon: MessageCircle },
                        { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
                      ] as const).map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            data-sound="click"
                            className="relative px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-hud tracking-wide cursor-none flex items-center gap-1.5"
                            data-cursor="magnetic"
                            aria-pressed={active}
                          >
                            {active && (
                              <motion.span
                                layoutId="fabTabBg"
                                className="absolute inset-0 bg-surface rounded-full shadow-sm border border-charcoal/5"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                            <Icon className={`relative z-10 w-3.5 h-3.5 ${active ? 'text-terracotta' : 'text-charcoal-light'}`} />
                            <span className={`relative z-10 ${active ? 'text-charcoal font-medium' : 'text-charcoal-light'}`}>
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      data-sound="click"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-light hover:text-charcoal hover:bg-charcoal/5 transition-colors cursor-none"
                      data-cursor="magnetic"
                      aria-label="Close"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-h-0 overflow-hidden">
                    {tab === 'chat' ? (
                      <div className="h-full px-3 pb-3">
                        <ChatPanel />
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto">
                        <SettingsPanel />
                      </div>
                    )}
                  </div>
                </div>
              </FocusTrap>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
