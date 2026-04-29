'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'section' | 'article';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const MotionTag = motion[Tag] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  eager = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  /** When true, animate immediately on mount instead of waiting for viewport. */
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldShow = eager || inView;

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={shouldShow ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerItem({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div variants={variants ?? itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Clip-path wipe — a quieter cousin of SplitDisplay.
 * Use for non-headline display headings where a per-word lift would feel busy.
 */
export function WipeReveal({
  children,
  delay = 0,
  duration = 1.1,
  direction = 'left',
  className,
  as: Tag = 'span',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'up';
  className?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const MotionTag = motion[Tag] as typeof motion.div;

  const initialClip =
    direction === 'left'
      ? 'inset(0 100% 0 0)'
      : 'inset(100% 0 0 0)';

  return (
    <MotionTag
      ref={ref}
      initial={{ clipPath: initialClip }}
      animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: initialClip }}
      transition={{ duration, ease, delay }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {children}
    </MotionTag>
  );
}

export function SplitDisplay({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : { y: '110%' }}
            transition={{
              duration: 1,
              ease,
              delay: delay + wi * 0.07,
            }}
          >
            {word}
            {wi < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
