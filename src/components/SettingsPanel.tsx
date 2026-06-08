import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../i18n/index';
import { Toggle } from './ui/Toggle';
import { Slider } from './ui/Slider';
import { RadioGroup } from './ui/RadioGroup';
import type { VisualEffects } from '../contexts/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    music,
    setMusic,
    effects,
    setEffects,
    interfaceMode,
    setInterfaceMode,
    performanceMode,
    setPerformanceMode,
  } = useSettings();
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape key handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the close button when panel opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Focus trap: keep Tab/Shift+Tab within the panel
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll(focusableSelector);
      const firstFocusable = focusableElements[0] as HTMLElement | undefined;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;

      if (!firstFocusable || !lastFocusable) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const updateEffect = (key: keyof VisualEffects, value: boolean) => {
    setEffects({ ...effects, [key]: value });
  };

  const themeOptions = [
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
    { value: 'system', label: t('settings.theme.system') },
  ];

  const interfaceOptions = [
    { value: 'compact', label: t('settings.interface.compact') },
    { value: 'comfortable', label: t('settings.interface.comfortable') },
    { value: 'large', label: t('settings.interface.large') },
  ];

  const performanceOptions = [
    { value: 'full', label: t('settings.performance.full') },
    { value: 'battery-saver', label: t('settings.performance.batterySaver') },
    { value: 'low-gpu', label: t('settings.performance.lowGpu') },
    { value: 'reduced', label: t('settings.performance.reduced') },
  ];

  const languageOptions = [
    { value: 'en', label: t('settings.language.en') },
    { value: 'id', label: t('settings.language.id') },
    { value: 'zh', label: t('settings.language.zh') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-charcoal/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('settings.title')}
            className="fixed top-0 right-0 z-[61] h-full w-full max-w-sm bg-sand/95 backdrop-blur-xl border-l border-stone shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone/50 sticky top-0 bg-sand/95 backdrop-blur-xl z-10">
              <h2 className="text-lg font-display font-bold text-charcoal tracking-wide">
                {t('settings.title')}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label={t('accessibility.closeMenu')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone/50 transition-colors text-charcoal-light hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 flex flex-col gap-8">
              {/* Theme */}
              <section>
                <h3 className="text-xs font-hud font-semibold text-charcoal uppercase tracking-wider mb-3">
                  {t('settings.theme.label')}
                </h3>
                <RadioGroup
                  options={themeOptions}
                  value={theme}
                  onChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
                  name="theme"
                />
              </section>

              {/* Music */}
              <section>
                <h3 className="text-xs font-hud font-semibold text-charcoal uppercase tracking-wider mb-3">
                  {t('settings.music.label')}
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-hud text-charcoal-light">
                      {music.enabled ? t('settings.music.enabled') : t('settings.music.disabled')}
                    </span>
                    <Toggle
                      checked={music.enabled}
                      onChange={(enabled) => setMusic({ ...music, enabled })}
                      label={t('settings.music.label')}
                    />
                  </div>
                  {music.enabled && (
                    <Slider
                      value={music.volume}
                      onChange={(volume) => setMusic({ ...music, volume })}
                      min={0}
                      max={1}
                      label={t('settings.music.volume')}
                    />
                  )}
                </div>
              </section>

              {/* Visual Effects */}
              <section>
                <h3 className="text-xs font-hud font-semibold text-charcoal uppercase tracking-wider mb-3">
                  {t('settings.effects.label')}
                </h3>
                <div className="flex flex-col gap-3">
                  {([
                    ['particles', t('settings.effects.particles')],
                    ['animations', t('settings.effects.animations')],
                    ['blur', t('settings.effects.blur')],
                    ['motionReduction', t('settings.effects.motionReduction')],
                    ['cursorEffects', t('settings.effects.cursorEffects')],
                  ] as const).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-hud text-charcoal-light">{label}</span>
                      <Toggle
                        checked={effects[key]}
                        onChange={(v) => updateEffect(key, v)}
                        label={label}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Interface Mode */}
              <section>
                <h3 className="text-xs font-hud font-semibold text-charcoal uppercase tracking-wider mb-3">
                  {t('settings.interface.label')}
                </h3>
                <RadioGroup
                  options={interfaceOptions}
                  value={interfaceMode}
                  onChange={(v) => setInterfaceMode(v as 'compact' | 'comfortable' | 'large')}
                  name="interface"
                />
              </section>

              {/* Performance Mode */}
              <section>
                <h3 className="text-xs font-hud font-semibold text-charcoal uppercase tracking-wider mb-3">
                  {t('settings.performance.label')}
                </h3>
                <RadioGroup
                  options={performanceOptions}
                  value={performanceMode}
                  onChange={(v) => setPerformanceMode(v as 'full' | 'battery-saver' | 'low-gpu' | 'reduced')}
                  name="performance"
                />
              </section>

              {/* Language */}
              <section>
                <h3 className="text-xs font-hud font-semibold text-charcoal uppercase tracking-wider mb-3">
                  {t('settings.language.label')}
                </h3>
                <RadioGroup
                  options={languageOptions}
                  value={language}
                  onChange={(v) => setLanguage(v as 'en' | 'id' | 'zh')}
                  name="language"
                />
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
