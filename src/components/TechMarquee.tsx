import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { getTechIconUrl } from '../data/techIcons';
import { useReducedMotion, premiumEase } from '../lib/motion';

interface TechMarqueeProps {
  /** Technology labels to display (from project.tech). */
  items: string[];
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
 * Tech-stack list. Renders a wrapped row of chips that softly fade/rise in once
 * when scrolled into view. There is no continuous/looping animation, so it stays
 * smooth on low-end devices. Respects reduced motion (renders statically).
 */
export function TechMarquee({ items }: TechMarqueeProps) {
  const reducedMotion = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((tech, i) => (
        <motion.div
          key={tech}
          initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: premiumEase }}
          whileHover={reducedMotion ? undefined : { y: -3 }}
        >
          <TechChip label={tech} />
        </motion.div>
      ))}
    </div>
  );
}

export default TechMarquee;
