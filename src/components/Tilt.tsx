import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePreferences } from '../contexts/PreferencesContext';
import { useReducedMotion } from '../lib/motion';

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  /** Pixel distance the card lifts toward the viewer on hover. */
  lift?: number;
  /** Show a subtle moving glare highlight. */
  glare?: boolean;
}

/**
 * Mouse-driven 3D tilt wrapper built on Framer Motion (no external deps).
 * Disabled automatically when reduced-motion is requested or the user turns
 * off the `tilt` visual effect, and inert on touch/coarse-pointer devices.
 */
export function Tilt({ children, className = '', max = 12, lift = 14, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();
  const reducedMotion = useReducedMotion();

  const enabled = preferences.visualEffects.tilt && !reducedMotion;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 250, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const z = useSpring(0, spring);

  // Glare position follows the pointer.
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 25 });

  const handleMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleEnter = () => {
    if (!enabled) return;
    z.set(lift);
    glareOpacity.set(0.18);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
    z.set(0);
    glareOpacity.set(0);
  };

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        translateZ: z,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 overflow-hidden"
          style={{ opacity: glareOpacity }}
        >
          <motion.div
            className="absolute w-[60%] h-[60%] rounded-full"
            style={{
              left: glareX,
              top: glareY,
              x: '-50%',
              y: '-50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
              mixBlendMode: 'soft-light',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
