import { useState, useCallback } from 'react';
import type { ReactNode, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
}

let rippleId = 0;

export function RippleEffect({ children, className = '' }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = useCallback((x: number, y: number) => {
    const id = rippleId++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }, []);

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    createRipple(e.clientX - rect.left, e.clientY - rect.top);
  }, [createRipple]);

  const handleTouch = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch) {
      createRipple(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  }, [createRipple]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              backgroundColor: 'rgba(198,138,124,0.3)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
