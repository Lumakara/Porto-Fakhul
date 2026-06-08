import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePreferences } from '../contexts/PreferencesContext';
import { useReducedMotion } from '../lib/motion';

interface MagneticProps {
  children: React.ReactElement;
  range?: number; // Distance ratio (higher means more magnetic pull)
}

export const Magnetic = ({ children, range = 0.35 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { preferences } = usePreferences();
  const reducedMotion = useReducedMotion();

  // Detect touch / no-hover devices reactively.
  const [noHover, setNoHover] = useState(() => {
    try {
      return window.matchMedia('(hover: none)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia('(hover: none)');
    } catch {
      return;
    }
    const handler = (e: MediaQueryListEvent) => setNoHover(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const mode = preferences.performanceMode;
  const lowPerfMode =
    mode === 'battery-saver' || mode === 'reduced' || mode === 'low-gpu';

  // Only enable the spring/magnetic effect for full mode on hover-capable,
  // motion-friendly devices. Otherwise render children directly (passthrough)
  // with no motion wrapper and no mouse listeners — layout stays identical.
  const disabled = noHover || reducedMotion || lowPerfMode;

  if (disabled) {
    return <span className="inline-block">{children}</span>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Calculate center coordinates of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Distance from mouse to center
    const x = clientX - centerX;
    const y = clientY - centerY;

    // Magnetize! Pull towards the cursor by the range ratio
    setPosition({ x: x * range, y: y * range });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: 'spring', 
        stiffness: 150, 
        damping: 15, 
        mass: 0.1 
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};
export default Magnetic;
