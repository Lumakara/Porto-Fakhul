import { useDeviceCapability } from '../lib/deviceCapability';
import { usePreferences } from '../contexts/PreferencesContext';

const StaticGradient = () => (
  <div
    className="absolute inset-0 z-0 pointer-events-none opacity-20"
    style={{
      background:
        'radial-gradient(ellipse at 30% 30%, rgba(234,221,215,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(189,107,88,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,181,161,0.3) 0%, transparent 50%)',
    }}
  />
);

const AnimatedGradient = () => (
  <div
    className="absolute inset-0 z-0 pointer-events-none opacity-20 animated-bg"
    style={{
      background:
        'radial-gradient(ellipse at 30% 30%, rgba(234,221,215,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(189,107,88,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,181,161,0.3) 0%, transparent 50%)',
    }}
  />
);

export const LazyWebGL = () => {
  const capability = useDeviceCapability();
  const { preferences } = usePreferences();

  // Respect user performance preferences
  const isReduced =
    preferences.performanceMode === 'reduced' ||
    preferences.performanceMode === 'low-gpu' ||
    preferences.performanceMode === 'battery-saver';

  if (isReduced || capability === 'low') {
    return null;
  }

  if (capability === 'medium') {
    return <StaticGradient />;
  }

  // High capability - animated CSS gradient
  return <AnimatedGradient />;
};
