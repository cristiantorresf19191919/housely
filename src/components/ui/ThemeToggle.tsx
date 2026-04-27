'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme/ThemeProvider';

const SUN_RAYS = Array.from({ length: 8 });

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark';

  return (
    <button
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={
        mounted
          ? isDark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      suppressHydrationWarning
      className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border focus-ring"
      style={{
        borderColor: 'var(--line-strong)',
        background: 'transparent',
      }}
    >
      {/* Hover halo — soft accent ring, theme-agnostic */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in srgb, var(--accent) 28%, transparent), transparent 65%)',
        }}
      />
      {/* Subtle inner highlight on hover so the icon "lights up" */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow:
            'inset 0 0 0 1px color-mix(in srgb, var(--accent) 50%, transparent)',
        }}
      />

      {/* Pre-mount placeholder: a neutral dot. Once mounted, the real icon
          fades in via AnimatePresence so SSR/CSR markup stays consistent. */}
      {!mounted ? (
        <span
          aria-hidden
          className="relative z-10 inline-block h-2 w-2 rounded-full"
          style={{ background: 'var(--foreground)', opacity: 0.4 }}
        />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
              style={{ color: 'var(--foreground)' }}
              initial={{ rotate: -45, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 45, scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
              <circle cx="17" cy="6" r="0.6" fill="currentColor" />
              <circle cx="20" cy="9" r="0.4" fill="currentColor" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
              style={{ color: 'var(--foreground)' }}
              initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle cx="12" cy="12" r="3.4" />
              {SUN_RAYS.map((_, i) => {
                const angle = (i / SUN_RAYS.length) * Math.PI * 2;
                const x1 = 12 + Math.cos(angle) * 6;
                const y1 = 12 + Math.sin(angle) * 6;
                const x2 = 12 + Math.cos(angle) * 8.4;
                const y2 = 12 + Math.sin(angle) * 8.4;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </motion.svg>
          )}
        </AnimatePresence>
      )}
    </button>
  );
}
