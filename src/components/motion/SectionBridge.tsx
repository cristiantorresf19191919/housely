'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

type Variant = 'cream-to-dark' | 'dark-to-cream' | 'cream-to-cream' | 'soft-to-cream';

const palette: Record<
  Variant,
  { from: string; to: string; markerColor: string; lineColor: string }
> = {
  // cream-100 -> ink
  'cream-to-dark': {
    from: '#F5EFE6',
    to: '#1F1611',
    markerColor: 'rgba(31,22,17,0.55)',
    lineColor: 'rgba(31,22,17,0.18)',
  },
  // ink -> cream-50
  'dark-to-cream': {
    from: '#1F1611',
    to: '#FBF8F3',
    markerColor: 'rgba(245,239,230,0.7)',
    lineColor: 'rgba(245,239,230,0.22)',
  },
  // cream-100 -> cream-50
  'cream-to-cream': {
    from: '#F5EFE6',
    to: '#FBF8F3',
    markerColor: 'rgba(31,22,17,0.5)',
    lineColor: 'rgba(31,22,17,0.12)',
  },
  // cream-50 -> cream-100
  'soft-to-cream': {
    from: '#FBF8F3',
    to: '#F5EFE6',
    markerColor: 'rgba(31,22,17,0.5)',
    lineColor: 'rgba(31,22,17,0.12)',
  },
};

interface Props {
  variant?: Variant;
  marker?: string;
  /** Issue or volume tag rendered on the right (decorative). */
  stamp?: string;
}

export function SectionBridge({
  variant = 'cream-to-cream',
  marker = '◌ Continued',
  stamp,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reduceMotion = useReducedMotion();
  const c = palette[variant];

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative isolate"
      style={{
        background: `linear-gradient(180deg, ${c.from} 0%, ${c.to} 100%)`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-10 sm:gap-6 sm:px-6 sm:py-14 lg:px-12">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.4, ease }}
          style={{ transformOrigin: 'left', background: c.lineColor }}
          className="h-px flex-1"
        />
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="font-mono text-[10px] uppercase tracking-[0.28em] whitespace-nowrap"
          style={{ color: c.markerColor }}
        >
          {marker}
        </motion.span>
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.4, ease, delay: 0.1 }}
          style={{ transformOrigin: 'right', background: c.lineColor }}
          className="h-px flex-1"
        />
        {stamp && (
          <motion.span
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden font-mono text-[10px] uppercase tracking-[0.28em] whitespace-nowrap sm:inline"
            style={{ color: c.markerColor }}
          >
            {stamp}
          </motion.span>
        )}
      </div>
    </div>
  );
}
