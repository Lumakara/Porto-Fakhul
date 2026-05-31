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
  const animationDirection = direction === 'left' ? 'normal' : 'reverse';
  const duration = `${speed}s`;

  const renderItems = () =>
    items.map((item, i) => (
      <span key={`${item}-${i}`} className="shrink-0 flex items-center">
        <span className="font-hud uppercase tracking-widest text-white/15 text-sm md:text-base">
          {item}
        </span>
        <span className="text-sakura/20 text-xs mx-4 md:mx-6 select-none" aria-hidden="true">
          ✦
        </span>
      </span>
    ));

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
    >
      {/* Left fade gradient */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 md:w-24 bg-gradient-to-r from-space-black to-transparent" />

      {/* Right fade gradient */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 md:w-24 bg-gradient-to-l from-space-black to-transparent" />

      {/* Scrolling strip */}
      <div
        className="flex items-center whitespace-nowrap will-change-transform"
        style={{
          animation: `marquee-scroll ${duration} linear infinite`,
          animationDirection,
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
