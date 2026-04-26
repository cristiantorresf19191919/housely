'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/lib/i18n/routing';
import { LocaleToggle } from './LocaleToggle';
import { cn } from '@/lib/utils/cn';

const links = [
  { href: '/listings', key: 'explore' as const },
  { href: '/#destinations', key: 'destinations' as const },
  { href: '/#journal', key: 'journal' as const },
  { href: '/auth/register?role=owner', key: 'host' as const },
];

export function Header() {
  const t = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-cream-50/80 backdrop-blur-xl border-b border-ink/10'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link
          href="/"
          className="group flex items-baseline gap-2 transition-opacity"
        >
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="display-md text-2xl text-ink"
          >
            {tBrand('name')}
          </motion.span>
          <span className="hidden md:block eyebrow text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
            ◌ {tBrand('tagline')}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l, i) => (
            <motion.div
              key={l.key}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
            >
              <Link
                href={l.href}
                className="group/link relative text-sm tracking-wide text-ink/80 transition-colors hover:text-ink"
              >
                {t(l.key)}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-500 group-hover/link:w-full" />
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle />
          <Link
            href="/account"
            className="hidden md:inline-flex items-center text-sm text-ink/80 hover:text-ink transition-colors px-3"
          >
            {t('account')}
          </Link>
          <Link
            href="/auth/login"
            className="hidden md:inline-flex items-center rounded-full border border-ink/20 px-4 py-2 text-xs tracking-[0.14em] uppercase text-ink hover:bg-ink hover:text-cream-100 transition-all"
          >
            {t('signIn')}
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-ink/10 bg-cream-50/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col px-6 py-6 space-y-4">
              {links.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  className="text-2xl font-display tracking-tighter text-ink"
                >
                  {t(l.key)}
                </Link>
              ))}
              <div className="hairline my-3" />
              <Link href="/account" className="text-base text-ink/80">
                {t('account')}
              </Link>
              <Link href="/auth/login" className="text-base text-ink/80">
                {t('signIn')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
