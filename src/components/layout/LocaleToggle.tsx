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
        className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs tracking-[0.14em] uppercase text-ink/80 hover:text-ink transition-colors"
        aria-expanded={open}
        aria-label="Change language"
      >
        <Globe size={14} className="opacity-70 group-hover:rotate-12 transition-transform duration-500" />
        <span className="font-mono">{locale.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 min-w-[180px] origin-top-right overflow-hidden rounded-lg border border-ink/10 bg-cream-50 shadow-[0_20px_60px_-20px_rgba(31,22,17,0.35)]"
          >
            {locales.map((l, i) => (
              <motion.button
                key={l}
                onClick={() => change(l)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors',
                  l === locale
                    ? 'bg-ink text-cream-100'
                    : 'text-ink hover:bg-ink/5'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{localeLabels[l].flag}</span>
                  <span>{localeLabels[l].native}</span>
                </span>
                <span className="font-mono text-[10px] opacity-60">
                  {l.toUpperCase()}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
