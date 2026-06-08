import { useRef, useState, useEffect } from 'react';

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export const Marquee = ({
  items,
  speed = 30,
  direction = 'left',
  className = '',
}: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationDirection = direction === 'left' ? 'normal' : 'reverse';
  const duration = `${speed}s`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderItems = () =>
    items.map((item, i) => (
      <span key={`${item}-${i}`} className="shrink-0 flex items-center">
        <span className="font-hud uppercase tracking-widest text-charcoal/15 text-sm md:text-base">
          {item}
        </span>
        <span className="text-terracotta/30 text-xs mx-4 md:mx-6 select-none" aria-hidden="true">
          &#10022;
        </span>
      </span>
    ));

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden ${className}`}
    >
      {/* Left fade gradient */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 md:w-24 bg-gradient-to-r from-sand to-transparent" />

      {/* Right fade gradient */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 md:w-24 bg-gradient-to-l from-sand to-transparent" />

      {/* Scrolling strip */}
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          animation: `marquee-scroll ${duration} linear infinite`,
          animationDirection,
          animationPlayState: isVisible ? 'running' : 'paused',
          willChange: isVisible ? 'transform' : 'auto',
        }}
      >
        {/* First copy */}
        <div className="flex shrink-0 items-center">
          {renderItems()}
        </div>

        {/* Second copy (duplicate for seamless loop) */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {renderItems()}
        </div>
      </div>
    </div>
  );
};
