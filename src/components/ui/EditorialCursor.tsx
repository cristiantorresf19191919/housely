'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Editorial cursor — a hairline ring that follows the pointer on desktop.
 * Over interactive surfaces tagged with [data-cursor], the ring expands and
 * reveals a label (e.g. "View", "Reserve", "Open").
 *
 * Disabled on touch and reduced-motion environments.
 */
export function EditorialCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<'default' | 'hover'>('default');
  const [label, setLabel] = useState<string>('');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduceMotion) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as Element | null;
      const interactive = target?.closest('[data-cursor], a, button, [role="button"]');
      if (interactive) {
        const cursorAttr = interactive.getAttribute('data-cursor');
        setVariant('hover');
        setLabel(cursorAttr || '');
      } else {
        setVariant('default');
        setLabel('');
      }
    };

    const handleLeave = () => {
      x.set(-100);
      y.set(-100);
      setVariant('default');
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isHover = variant === 'hover';
  const size = isHover && label ? 72 : isHover ? 44 : 22;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full border border-cream-50/85"
        animate={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          backgroundColor: isHover && label ? 'rgba(245,239,230,0.95)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.5 }}
      >
        {isHover && label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
