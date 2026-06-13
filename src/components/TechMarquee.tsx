import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { getTechIconUrl } from '../data/techIcons';
import { useReducedMotion } from '../lib/motion';

interface TechMarqueeProps {
  /** Technology labels to display (from project.tech). */
  items: string[];
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
}

/** Single tech pill: brand icon (Simple Icons CDN) + label, with chip fallback. */
function TechChip({ label }: { label: string }) {
  const iconUrl = getTechIconUrl(label);
  const [iconFailed, setIconFailed] = useState(false);
  const showIcon = iconUrl && !iconFailed;

  return (
    <span className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-charcoal/10 shadow-sm whitespace-nowrap">
      {showIcon ? (
        <img
          src={iconUrl}
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          loading="lazy"
          decoding="async"
          onError={() => setIconFailed(true)}
          className="w-[18px] h-[18px] object-contain"
        />
      ) : (
        <Code2 className="w-[18px] h-[18px] text-terracotta" />
      )}
      <span className="font-hud text-xs text-charcoal uppercase tracking-wider">{label}</span>
    </span>
  );
}

/**
 * Horizontal, infinitely looping tech-stack strip that scrolls right → left.
 * The list is duplicated so the animation wraps seamlessly. Respects reduced
 * motion (falls back to a static wrapped row).
 */
export function TechMarquee({ items, speed = 22 }: TechMarqueeProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion || items.length === 0) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {items.map((tech) => (
          <TechChip key={tech} label={tech} />
        ))}
      </div>
    );
  }

  // Duplicate the items so translating by -50% produces a seamless loop.
  const loop = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <motion.div
        className="flex items-center gap-2.5 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((tech, i) => (
          <TechChip key={`${tech}-${i}`} label={tech} />
        ))}
      </motion.div>
    </div>
  );
}

export default TechMarquee;
