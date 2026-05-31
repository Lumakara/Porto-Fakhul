import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [hoveredType, setHoveredType] = useState<'none' | 'grow' | 'magnetic' | 'text'>('none');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for smooth cursor tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics configuration
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports hover (is not mobile)
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Setup mouse hovers listener dynamically
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Closest interactive element with data-cursor attributes
      const interactiveEl = target.closest('[data-cursor]');
      
      if (interactiveEl) {
        const cursorType = interactiveEl.getAttribute('data-cursor');
        const text = interactiveEl.getAttribute('data-cursor-text') || '';
        
        if (cursorType === 'grow') {
          setHoveredType('grow');
        } else if (cursorType === 'magnetic') {
          setHoveredType('magnetic');
        } else if (cursorType === 'text') {
          setHoveredType('text');
          setCursorText(text);
        }
      } else {
        // Fallback for standard buttons/links
        const standardInteractive = target.closest('a, button, [role="button"], input[type="submit"]');
        if (standardInteractive) {
          setHoveredType('grow');
        } else {
          setHoveredType('none');
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile || !isVisible) return null;

  // Variants for different hover modes
  const ringVariants = {
    none: {
      width: 40,
      height: 40,
      borderColor: 'rgba(0, 240, 255, 0.4)',
      backgroundColor: 'rgba(0, 240, 255, 0)',
    },
    grow: {
      width: 60,
      height: 60,
      borderColor: 'rgba(255, 117, 151, 0.8)',
      backgroundColor: 'rgba(255, 117, 151, 0.15)',
    },
    magnetic: {
      width: 50,
      height: 50,
      borderColor: 'rgba(255, 117, 151, 1)',
      backgroundColor: 'rgba(255, 117, 151, 0.05)',
      boxShadow: '0 0 15px rgba(255, 117, 151, 0.4)',
    },
    text: {
      width: 80,
      height: 80,
      borderColor: 'rgba(0, 240, 255, 0.8)',
      backgroundColor: 'rgba(12, 10, 18, 0.85)',
      boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
    },
  };

  const dotVariants = {
    none: { scale: 1, backgroundColor: '#ff7597' },
    grow: { scale: 0, backgroundColor: '#ff7597' },
    magnetic: { scale: 1.5, backgroundColor: '#00f0ff' },
    text: { scale: 0, backgroundColor: '#00f0ff' },
  };

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden="true"
        className="custom-cursor-ring"
        style={{
          left: springX,
          top: springY,
        }}
        animate={hoveredType}
        variants={ringVariants}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      >
        {hoveredType === 'text' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-hud uppercase tracking-wider text-cyber select-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden="true"
        className="custom-cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        animate={hoveredType}
        variants={dotVariants}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};
