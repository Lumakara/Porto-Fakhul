import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { useReducedMotion } from '../lib/motion';
import { FocusTrap } from './menu/FocusTrap';
import { SettingsPanel } from './menu/SettingsPanel';
import { ChatPanel } from './ai/ChatPanel';

type FabTab = 'chat' | 'settings';

/**
 * Floating Action Button that expands into a control surface containing the
 * AI assistant and the full site-settings panel. Anchored bottom-right on
 * desktop; behaves as a bottom sheet on small screens.
 */
export function Fab() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FabTab>('chat');
  const reducedMotion = useReducedMotion();

  // Close on Escape handled by FocusTrap; also lock scroll on mobile sheet.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(max-width: 640px)');
    if (mq.matches) document.body.classList.add('scroll-locked');
    return () => document.body.classList.remove('scroll-locked');
  }, [open]);

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
        onClick={() => setOpen((v) => !v)}
        data-sound="click"
        className="fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full bg-charcoal text-sand shadow-xl flex items-center justify-center cursor-none border border-white/10 group"
        data-cursor="grow"
        aria-label={open ? 'Close assistant & settings' : 'Open assistant & settings'}
        aria-expanded={open}
      >
        {/* Pulsing halo */}
        {!open && !reducedMotion && (
          <span className="absolute inset-0 rounded-full bg-terracotta/40 animate-ping opacity-60" />
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
              className="fixed inset-0 z-[78] bg-charcoal/20 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
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
                         bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh] h-[85vh]
                         sm:bottom-24 sm:right-5 sm:left-auto sm:w-[380px] sm:h-[560px] sm:max-h-[78vh] sm:rounded-3xl"
            >
              <FocusTrap active={open} onEscape={() => setOpen(false)}>
                <div className="flex flex-col h-full min-h-0">
                  {/* Tab header */}
                  <div className="flex items-center justify-between gap-2 p-3 border-b border-charcoal/10">
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
                            className="relative px-3.5 py-1.5 rounded-full text-xs font-hud tracking-wide cursor-none flex items-center gap-1.5"
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
                        <ChatPanel onOpenSettings={() => setTab('settings')} />
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
