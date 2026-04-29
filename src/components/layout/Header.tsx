'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, User, X } from 'lucide-react';
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

const ease = [0.22, 1, 0.36, 1] as const;

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
        'fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500',
        scrolled
          ? 'backdrop-blur-xl border-b'
          : 'border-b border-transparent'
      )}
      style={{
        background: scrolled
          ? 'color-mix(in srgb, var(--surface) 78%, transparent)'
          : 'transparent',
        borderBottomColor: scrolled ? 'var(--line)' : 'transparent',
      }}
    >
      {/* Hairline accent — emerges with the scroll-pinned state */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 top-0 h-px transition-opacity duration-500',
          scrolled ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 55%, transparent) 30%, color-mix(in srgb, var(--accent) 55%, transparent) 70%, transparent)',
        }}
      />

      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-12">
        {/* ─── Brand ─────────────────────────────── */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity"
        >
          <motion.span
            initial={{ scale: 0, rotate: -120, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] leading-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180"
            style={{ background: 'var(--foreground)', color: 'var(--surface)' }}
          >
            ◌
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="display-md text-2xl tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            {tBrand('name')}
          </motion.span>
          <span
            aria-hidden
            className="ml-2 hidden h-4 w-px opacity-25 md:inline-block"
            style={{ background: 'var(--foreground)' }}
          />
          <span
            className="eyebrow hidden text-[10px] opacity-60 transition-opacity group-hover:opacity-100 md:inline-block"
          >
            {tBrand('tagline')}
          </span>
        </Link>

        {/* ─── Primary nav ───────────────────────── */}
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l, i) => (
            <motion.div
              key={l.key}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease }}
            >
              <Link
                href={l.href}
                className="group/link relative text-sm tracking-wide transition-colors"
                style={{
                  color:
                    'color-mix(in srgb, var(--foreground) 78%, transparent)',
                }}
              >
                <span className="transition-colors group-hover/link:[color:var(--foreground)]">
                  {t(l.key)}
                </span>
                <span
                  className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 group-hover/link:w-full"
                  style={{ background: 'var(--accent)' }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* ─── Right cluster ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
          className="flex items-center gap-1.5 sm:gap-2"
        >
          <ThemeToggle />
          <LocaleToggle />

          {/* Hairline separator between utility + CTA group */}
          <span
            aria-hidden
            className="mx-1 hidden h-5 w-px opacity-25 md:inline-block"
            style={{ background: 'var(--foreground)' }}
          />

          <Link
            href="/account"
            className="group/account hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors md:inline-flex"
            style={{
              color:
                'color-mix(in srgb, var(--foreground) 78%, transparent)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                'color-mix(in srgb, var(--foreground) 78%, transparent)';
            }}
          >
            <User
              size={14}
              strokeWidth={1.5}
              className="opacity-70 transition-opacity duration-500 group-hover/account:opacity-100"
            />
            <span>{t('account')}</span>
          </Link>

          {/* Sign-in CTA — filled, with the same animated arrow used in the hero */}
          <Link
            href="/auth/login"
            className="group/cta hidden items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-500 md:inline-flex"
            style={{
              background: 'var(--foreground)',
              color: 'var(--surface)',
              boxShadow:
                '0 1px 0 color-mix(in srgb, var(--foreground) 16%, transparent), 0 10px 28px -12px color-mix(in srgb, var(--foreground) 38%, transparent)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--foreground)';
            }}
          >
            <span className="font-medium">{t('signIn')}</span>
            <span className="relative inline-block h-3.5 w-3.5 overflow-hidden">
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:-translate-y-4 group-hover/cta:translate-x-4"
              />
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                className="absolute inset-0 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-0 group-hover/cta:translate-y-0"
              />
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="-mr-2 p-2 lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            style={{ color: 'var(--foreground)' }}
          >
            <motion.span
              key={mobileOpen ? 'x' : 'm'}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="inline-flex"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </button>
        </motion.div>
      </div>

      {/* ─── Mobile menu ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="border-t backdrop-blur-xl lg:hidden"
            style={{
              background:
                'color-mix(in srgb, var(--surface) 95%, transparent)',
              borderTopColor: 'var(--line)',
            }}
          >
            <nav className="flex flex-col gap-4 px-6 py-7">
              {links.map((l, i) => (
                <motion.div
                  key={l.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease }}
                >
                  <Link
                    href={l.href}
                    className="font-display text-2xl tracking-tight"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {t(l.key)}
                  </Link>
                </motion.div>
              ))}
              <div
                className="my-3 h-px w-full"
                style={{ background: 'var(--line)' }}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm"
                  style={{
                    borderColor: 'var(--line-strong)',
                    color: 'var(--foreground)',
                  }}
                >
                  <User size={14} strokeWidth={1.5} />
                  {t('account')}
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
                  style={{
                    background: 'var(--foreground)',
                    color: 'var(--surface)',
                  }}
                >
                  {t('signIn')} <ArrowUpRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
