'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  /**
   * Optional surface override. Defaults to inheriting the parent's
   * --surface so the bridge blends seamlessly in either theme.
   */
  surface?: 'inherit' | 'soft' | 'elevated';
  marker?: string;
  /** Issue or volume tag rendered on the right (decorative). */
  stamp?: string;
}

const surfaceMap = {
  inherit: 'var(--surface)',
  soft: 'var(--surface-2)',
  elevated: 'var(--surface-elevated)',
} as const;

export function SectionBridge({
  surface = 'inherit',
  marker = '◌ Continued',
  stamp,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative isolate"
      style={{ background: surfaceMap[surface] }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-6 sm:gap-6 sm:px-6 sm:py-10 lg:px-12">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.4, ease }}
          style={{ transformOrigin: 'left', background: 'var(--line)' }}
          className="h-px flex-1"
        />
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="font-mono text-[10px] uppercase tracking-[0.28em] whitespace-nowrap"
          style={{ color: 'var(--foreground-muted)' }}
        >
          {marker}
        </motion.span>
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.4, ease, delay: 0.1 }}
          style={{ transformOrigin: 'right', background: 'var(--line)' }}
          className="h-px flex-1"
        />
        {stamp && (
          <motion.span
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden font-mono text-[10px] uppercase tracking-[0.28em] whitespace-nowrap sm:inline"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {stamp}
          </motion.span>
        )}
      </div>
    </div>
  );
}
