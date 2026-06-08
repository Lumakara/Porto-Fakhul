import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useReducedMotion } from '../../lib/motion';
import type { Theme, InterfaceMode, PerformanceMode, Language } from '../../types';
import { RippleEffect } from './RippleEffect';

function ToggleSwitch({ enabled, onToggle, label }: { enabled: boolean; onToggle: (val: boolean) => void; label: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onToggle(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
        enabled ? 'bg-terracotta' : 'bg-stone'
      }`}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
        animate={{ left: enabled ? 22 : 2 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const reducedMotion = useReducedMotion();

  return (
    <div className="border-b border-stone/50 last:border-b-0">
      <RippleEffect className="rounded-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-left cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded-lg"
          aria-expanded={isOpen}
        >
          <span className="font-hud text-sm font-medium text-charcoal">{title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-charcoal-light" />
          </motion.div>
        </button>
      </RippleEffect>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SettingsPanel() {
  const { t, language, setLanguage } = useLanguage();
  const { preferences, setTheme, setMusic, setVisualEffects, setInterfaceMode, setPerformanceMode } = usePreferences();
  const reducedMotion = useReducedMotion();

  const themeOptions: { value: Theme; labelKey: string }[] = [
    { value: 'light', labelKey: 'settings.theme.light' },
    { value: 'dark', labelKey: 'settings.theme.dark' },
    { value: 'system', labelKey: 'settings.theme.system' },
  ];

  const interfaceOptions: { value: InterfaceMode; labelKey: string }[] = [
    { value: 'compact', labelKey: 'settings.interface.compact' },
    { value: 'comfortable', labelKey: 'settings.interface.comfortable' },
    { value: 'large-text', labelKey: 'settings.interface.largeText' },
  ];

  const performanceOptions: { value: PerformanceMode; labelKey: string }[] = [
    { value: 'full', labelKey: 'settings.performance.full' },
    { value: 'battery-saver', labelKey: 'settings.performance.batterySaver' },
    { value: 'low-gpu', labelKey: 'settings.performance.lowGpu' },
    { value: 'reduced', labelKey: 'settings.performance.reduced' },
  ];

  const languageOptions: { value: Language; flag: string; name: string }[] = [
    { value: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', name: 'English' },
    { value: 'id', flag: '\uD83C\uDDEE\uD83C\uDDE9', name: 'Bahasa Indonesia' },
    { value: 'zh', flag: '\uD83C\uDDE8\uD83C\uDDF3', name: '\u4E2D\u6587\u7B80\u4F53' },
  ];

  const playlistOptions = ['ambient', 'lofi', 'electronic', 'none'];

  return (
    <div className="flex flex-col" role="region" aria-label={t('accessibility.settingsPanel')}>
      {/* Theme */}
      <CollapsibleSection title={t('settings.theme.title')} defaultOpen>
        <div className="flex space-x-2">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`relative flex-1 px-3 py-2 rounded-lg font-hud text-xs tracking-wide min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-colors duration-200 ${
                preferences.theme === option.value
                  ? 'text-terracotta font-medium'
                  : 'text-charcoal-light hover:text-charcoal'
              }`}
              aria-pressed={preferences.theme === option.value}
            >
              {preferences.theme === option.value && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute inset-0 bg-terracotta/10 border border-terracotta/20 rounded-lg"
                  transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(option.labelKey)}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Music */}
      <CollapsibleSection title={t('settings.music.title')}>
        <div className="flex flex-col space-y-4">
          {/* Enable toggle */}
          <div className="flex items-center justify-between">
            <span className="font-hud text-xs text-charcoal-light">{t('settings.music.enabled')}</span>
            <ToggleSwitch
              enabled={preferences.music.enabled}
              onToggle={(val) => setMusic({ ...preferences.music, enabled: val })}
              label={t('accessibility.musicToggle')}
            />
          </div>

          {/* Volume slider */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-hud text-xs text-charcoal-light">{t('settings.music.volume')}</span>
              <span className="font-hud text-xs text-charcoal-light">{Math.round(preferences.music.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={preferences.music.volume}
              onChange={(e) => setMusic({ ...preferences.music, volume: parseFloat(e.target.value) })}
              aria-label={t('accessibility.volumeSlider')}
              className="w-full h-2 rounded-full appearance-none cursor-none bg-stone accent-terracotta focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              style={{
                background: `linear-gradient(to right, var(--color-terracotta) 0%, var(--color-terracotta) ${preferences.music.volume * 100}%, var(--color-stone) ${preferences.music.volume * 100}%, var(--color-stone) 100%)`,
              }}
            />
          </div>

          {/* Playlist */}
          <div className="flex flex-col space-y-2">
            <span className="font-hud text-xs text-charcoal-light">{t('settings.music.playlist')}</span>
            <select
              value={preferences.music.playlist}
              onChange={(e) => setMusic({ ...preferences.music, playlist: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-stone/30 border border-stone text-charcoal font-hud text-xs cursor-none min-h-[44px] focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            >
              {playlistOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {t(`settings.music.playlistOptions.${opt}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Visual Effects */}
      <CollapsibleSection title={t('settings.visualEffects.title')}>
        <div className="flex flex-col space-y-3">
          {([
            { key: 'particles', labelKey: 'settings.visualEffects.particles' },
            { key: 'animations', labelKey: 'settings.visualEffects.animations' },
            { key: 'blur', labelKey: 'settings.visualEffects.blur' },
            { key: 'motionReduction', labelKey: 'settings.visualEffects.motionReduction' },
            { key: 'cursorEffects', labelKey: 'settings.visualEffects.cursorEffects' },
          ] as const).map((effect) => (
            <div key={effect.key} className="flex items-center justify-between min-h-[44px]">
              <span className="font-hud text-xs text-charcoal-light">{t(effect.labelKey)}</span>
              <ToggleSwitch
                enabled={preferences.visualEffects[effect.key]}
                onToggle={(val) =>
                  setVisualEffects({ ...preferences.visualEffects, [effect.key]: val })
                }
                label={t(effect.labelKey)}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Interface */}
      <CollapsibleSection title={t('settings.interface.title')}>
        <div className="flex space-x-2">
          {interfaceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setInterfaceMode(option.value)}
              className={`relative flex-1 px-2 py-2 rounded-lg font-hud text-xs tracking-wide min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-colors duration-200 ${
                preferences.interfaceMode === option.value
                  ? 'text-terracotta font-medium'
                  : 'text-charcoal-light hover:text-charcoal'
              }`}
              aria-pressed={preferences.interfaceMode === option.value}
            >
              {preferences.interfaceMode === option.value && (
                <motion.div
                  layoutId="interface-indicator"
                  className="absolute inset-0 bg-terracotta/10 border border-terracotta/20 rounded-lg"
                  transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(option.labelKey)}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Performance */}
      <CollapsibleSection title={t('settings.performance.title')}>
        <div className="grid grid-cols-2 gap-2">
          {performanceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPerformanceMode(option.value)}
              className={`relative px-3 py-2 rounded-lg font-hud text-xs tracking-wide min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-colors duration-200 ${
                preferences.performanceMode === option.value
                  ? 'text-terracotta font-medium'
                  : 'text-charcoal-light hover:text-charcoal'
              }`}
              aria-pressed={preferences.performanceMode === option.value}
            >
              {preferences.performanceMode === option.value && (
                <motion.div
                  layoutId="performance-indicator"
                  className="absolute inset-0 bg-terracotta/10 border border-terracotta/20 rounded-lg"
                  transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(option.labelKey)}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Language */}
      <CollapsibleSection title={t('settings.language.title')}>
        <div className="flex flex-col space-y-2">
          {languageOptions.map((option) => (
            <RippleEffect key={option.value} className="rounded-lg">
              <button
                onClick={() => setLanguage(option.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg min-h-[44px] cursor-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 transition-colors duration-200 ${
                  language === option.value
                    ? 'bg-terracotta/10 text-terracotta font-medium'
                    : 'text-charcoal-light hover:text-charcoal hover:bg-stone/30'
                }`}
                aria-pressed={language === option.value}
              >
                <span className="text-base">{option.flag}</span>
                <span className="font-hud text-sm">{option.name}</span>
              </button>
            </RippleEffect>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
