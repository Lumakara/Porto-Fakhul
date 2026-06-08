import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useDeviceCapability } from '../lib/deviceCapability';

// Premium Easing Curves
export const premiumEase = [0.16, 1, 0.3, 1] as const;
export const springEase = [0.22, 1, 0.36, 1] as const;

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export const Section = ({ children, className = '', id = '', delay = 0 }: SectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const capability = useDeviceCapability();
  // Trigger when 15% of the element is visible
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const variants: Variants = capability === 'low'
    ? {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: premiumEase, delay },
        },
      }
    : capability === 'medium'
    ? {
        hidden: { opacity: 0, y: 40, scale: 0.99 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.8, ease: premiumEase, delay },
        },
      }
    : {
        hidden: { opacity: 0, y: 60, scale: 0.98, filter: 'blur(12px)' },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 1.2, ease: premiumEase, delay },
        },
      };

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`relative py-24 md:py-32 outline-none ${className}`}
    >
      {children}
    </motion.section>
  );
};

interface TextRevealProps {
  text: string;
  className?: string;
  glow?: boolean;
  glowColor?: 'sakura' | 'cyber';
  delay?: number;
}

export const TextReveal = ({
  text,
  className = '',
  glow = false,
  glowColor = 'sakura',
  delay = 0
}: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const capability = useDeviceCapability();

  // Split text into characters, keeping spaces as &nbsp;
  const chars = text.split('');

  const glowClass = glow 
    ? (glowColor === 'sakura' ? 'text-glow-sakura text-sakura' : 'text-glow-cyber text-cyber') 
    : 'text-white';

  // Low devices: simple fade-in, no per-character animation
  if (capability === 'low') {
    const simpleFade: Variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, delay } },
    };

    return (
      <motion.div
        ref={containerRef}
        variants={simpleFade}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`inline-block overflow-hidden py-1 ${className}`}
      >
        <span className={glowClass}>{text}</span>
      </motion.div>
    );
  }

  // Medium devices: reduced stagger, no blur filter
  const staggerTime = capability === 'medium' ? 0.015 : 0.025;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = capability === 'medium'
    ? {
        hidden: { opacity: 0, y: '100%' },
        visible: {
          opacity: 1,
          y: '0%',
          transition: { duration: 0.6, ease: premiumEase },
        },
      }
    : {
        hidden: { opacity: 0, y: '100%', rotateX: -45, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          y: '0%',
          rotateX: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.8, ease: premiumEase },
        },
      };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`inline-block overflow-hidden py-1 ${className}`}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          className={`inline-block char-animation ${glowClass}`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const Parallax = ({ children, offset = 50, className = '' }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start end", "end start"] 
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};
