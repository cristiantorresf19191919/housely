'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: '0% 50%',
        background:
          'linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--gold) 70%, transparent 100%)',
      }}
      className="fixed inset-x-0 top-0 z-[60] h-px"
    />
  );
}
