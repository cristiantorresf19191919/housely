'use client';

import { useLocale } from 'next-intl';
import { useTransition, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { locales, localeLabels, type AppLocale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

export function LocaleToggle() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const change = (next: AppLocale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
    setOpen(false);
    const description =
      next === 'es'
        ? 'Idioma cambiado.'
        : next === 'fr'
        ? 'Langue mise à jour.'
        : 'Language updated.';
    toast.success(localeLabels[next].native, {
      description,
      duration: 2200,
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11px] uppercase tracking-[0.16em] transition-colors"
        style={{
          borderColor: open ? 'var(--foreground)' : 'var(--line-strong)',
          color: 'color-mix(in srgb, var(--foreground) 85%, transparent)',
          background: open
            ? 'color-mix(in srgb, var(--foreground) 6%, transparent)'
            : 'transparent',
        }}
        aria-expanded={open}
        aria-label="Change language"
      >
        <Globe
          size={13}
          strokeWidth={1.6}
          className="opacity-70 transition-transform duration-500 group-hover:rotate-12"
        />
        <span className="font-mono leading-none">{locale.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 min-w-[200px] origin-top-right overflow-hidden rounded-2xl border"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--line)',
              boxShadow: 'var(--shadow-deep)',
            }}
          >
            {locales.map((l, i) => {
              const active = l === locale;
              return (
                <motion.button
                  key={l}
                  onClick={() => change(l)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={cn(
                    'group/item relative flex w-full items-center justify-between px-4 py-3 text-sm transition-colors'
                  )}
                  style={{
                    color: active ? 'var(--surface)' : 'var(--foreground)',
                    background: active ? 'var(--accent)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background =
                        'color-mix(in srgb, var(--foreground) 6%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{localeLabels[l].flag}</span>
                    <span>{localeLabels[l].native}</span>
                  </span>
                  <span className="font-mono text-[10px] opacity-60">
                    {l.toUpperCase()}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
