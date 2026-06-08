import { useState, useCallback } from 'react';
import type { MouseEvent, TouchEvent, ReactNode } from 'react';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleProps {
  children: ReactNode;
  className?: string;
}

export const Ripple = ({ children, className = '' }: RippleProps) => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const createRipple = useCallback((clientX: number, clientY: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    createRipple(e.clientX, e.clientY, e.currentTarget);
  }, [createRipple]);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    createRipple(touch.clientX, touch.clientY, e.currentTarget);
  }, [createRipple]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-terracotta/20 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </div>
  );
};

export default Ripple;
