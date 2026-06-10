import { lazy, Suspense, useEffect, useState } from 'react';
import { useDeviceCapability } from '../lib/deviceCapability';
import { usePreferences } from '../contexts/PreferencesContext';

const WebGLBackground = lazy(() => import('./WebGLBackground'));

const CSSGradientFallback = () => (
  <div
    className="absolute inset-0 z-0 pointer-events-none opacity-20"
    style={{
      background:
        'radial-gradient(ellipse at 30% 30%, rgba(234,221,215,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(189,107,88,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,181,161,0.3) 0%, transparent 50%)',
    }}
  />
);

/**
 * Decides whether (and when) to mount the heavy Three.js background.
 *
 * - low tier / reduced perf modes: render nothing (cheapest).
 * - medium tier: render the lightweight CSS aurora fallback only.
 * - high tier: show the CSS aurora immediately, then idle-mount the WebGL
 *   scene after first paint via requestIdleCallback so Three.js stays out of
 *   the critical render path.
 */
export const LazyWebGL = () => {
  const capability = useDeviceCapability();
  const { preferences } = usePreferences();
  const [idleReady, setIdleReady] = useState(false);

  const isReduced =
    preferences.performanceMode === 'reduced' ||
    preferences.performanceMode === 'low-gpu' ||
    preferences.performanceMode === 'battery-saver';

  const shouldUseWebGL = capability === 'high' && !isReduced;

  useEffect(() => {
    if (!shouldUseWebGL) return;

    type RIC = (cb: () => void, opts?: { timeout?: number }) => number;
    const ric: RIC =
      (window as unknown as { requestIdleCallback?: RIC }).requestIdleCallback ??
      ((cb) => window.setTimeout(cb, 300));
    const cancel =
      (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback ??
      ((id: number) => window.clearTimeout(id));

    const id = ric(() => setIdleReady(true), { timeout: 2500 });
    return () => cancel(id);
  }, [shouldUseWebGL]);

  if (isReduced || capability === 'low') {
    return null;
  }

  if (capability === 'medium') {
    return <CSSGradientFallback />;
  }

  // High capability: CSS aurora first, swap in WebGL once the browser is idle.
  if (!idleReady) {
    return <CSSGradientFallback />;
  }

  return (
    <Suspense fallback={<CSSGradientFallback />}>
      <WebGLBackground />
    </Suspense>
  );
};
