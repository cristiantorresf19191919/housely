'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/lib/i18n/routing';
import { LocaleToggle } from './LocaleToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils/cn';

const links = [
  { href: '/listings', key: 'explore' as const },
  { href: '/#destinations', key: 'destinations' as const },
  { href: '/#journal', key: 'journal' as const },
  { href: '/owner', key: 'host' as const },
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
          ? 'backdrop-blur-xl border-b'
          : 'border-b border-transparent'
      )}
      style={{
        background: scrolled
          ? 'color-mix(in srgb, var(--surface) 80%, transparent)'
          : 'transparent',
        borderBottomColor: scrolled ? 'var(--line)' : 'transparent',
      }}
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
            className="display-md text-2xl"
            style={{ color: 'var(--foreground)' }}
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
                className="group/link relative text-sm tracking-wide transition-colors"
                style={{ color: 'color-mix(in srgb, var(--foreground) 80%, transparent)' }}
              >
                <span className="transition-colors group-hover/link:[color:var(--foreground)]">
                  {t(l.key)}
                </span>
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 group-hover/link:w-full"
                  style={{ background: 'var(--foreground)' }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleToggle />
          <Link
            href="/account"
            className="hidden md:inline-flex items-center text-sm transition-colors px-3"
            style={{ color: 'color-mix(in srgb, var(--foreground) 80%, transparent)' }}
          >
            {t('account')}
          </Link>
          <Link
            href="/auth/login"
            className="hidden md:inline-flex items-center rounded-full px-4 py-2 text-xs tracking-[0.14em] uppercase transition-all border"
            style={{
              borderColor: 'var(--line-strong)',
              color: 'var(--foreground)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--foreground)';
              e.currentTarget.style.color = 'var(--surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
          >
            {t('signIn')}
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Menu"
            style={{ color: 'var(--foreground)' }}
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
            className="lg:hidden border-t backdrop-blur-xl"
            style={{
              background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
              borderTopColor: 'var(--line)',
            }}
          >
            <nav className="flex flex-col px-6 py-6 space-y-4">
              {links.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  className="text-2xl font-display tracking-tighter"
                  style={{ color: 'var(--foreground)' }}
                >
                  {t(l.key)}
                </Link>
              ))}
              <div className="hairline my-3" />
              <Link
                href="/account"
                className="text-base"
                style={{ color: 'color-mix(in srgb, var(--foreground) 80%, transparent)' }}
              >
                {t('account')}
              </Link>
              <Link
                href="/auth/login"
                className="text-base"
                style={{ color: 'color-mix(in srgb, var(--foreground) 80%, transparent)' }}
              >
                {t('signIn')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
