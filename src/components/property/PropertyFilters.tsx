'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { WipeReveal } from '@/components/motion/Reveal';
import type { PlainProperty } from '@/lib/utils/serialize';

interface Props {
  properties: PlainProperty[];
}

export function PropertyFilters({ properties }: Props) {
  const t = useTranslations('filters');
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [sort, setSort] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');

  const types = useMemo(
    () => Array.from(new Set(properties.map((p) => p.type))),
    [properties]
  );
  const countries = useMemo(
    () =>
      Array.from(
        new Map(
          properties.map((p) => [p.address.countryCode, p.address.country])
        ).entries()
      ),
    [properties]
  );

  const filtered = useMemo(() => {
    let out = properties.filter((p) => {
      if (type && p.type !== type) return false;
      if (country && p.address.countryCode !== country) return false;
      if (guests && p.maxGuests < Number(guests)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.address.city.toLowerCase().includes(q) ||
          p.address.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
    out = out.slice();
    if (sort === 'priceAsc') out.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === 'priceDesc') out.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === 'rating') out.sort((a, b) => b.rating - a.rating);
    else out.sort((a, b) => Number(b.featured) - Number(a.featured));
    return out;
  }, [properties, search, type, country, guests, sort]);

  const hasFilters = search || type || country || guests;

  return (
    <div>
      {/* Header — editorial asymmetric layout */}
      <div className="mb-14 grid grid-cols-12 gap-6 sm:mb-20">
        <div className="col-span-12 md:col-span-8">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="h-px flex-none w-12"
              style={{ background: 'var(--line-strong)' }}
            />
            <p className="eyebrow text-[10px]">◌ Housely Register · Issue 04</p>
          </div>
          <h1 className="mt-6 display-lg text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.02em]" style={{ color: 'var(--foreground)' }}>
            <WipeReveal delay={0.1} duration={1.2}>{t('title')}</WipeReveal>
          </h1>
          <p className="mt-6 max-w-md text-base sm:text-lg" style={{ color: 'var(--foreground-muted)' }}>
            {t('subtitle', { count: filtered.length })}
          </p>
        </div>

        {/* Right column — running header / live status */}
        <div className="col-span-12 mt-2 flex items-end md:col-span-4 md:mt-0 md:justify-end">
          <div className="flex flex-col gap-3 text-right">
            <span className="inline-flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--foreground-muted)' }}>
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              </span>
              Live · Updated weekly
            </span>
            <p className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-none tabular-nums tracking-tight" style={{ color: 'var(--foreground)' }}>
              {filtered.length.toString().padStart(2, '0')}
              <span className="ml-2 align-baseline font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--foreground-muted)' }}>
                in rotation
              </span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--foreground-muted)' }}>
              Vol. 04 · Spring/Summer
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar — clean editorial frame */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14 rounded-2xl px-6 py-7 sm:px-8 sm:py-8"
        style={{
          background: 'var(--surface-2)',
          boxShadow: 'inset 0 0 0 1px var(--line)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-4">
            <div className="relative">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full bg-transparent border-b border-ink/15 pl-7 py-3 text-base text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="eyebrow text-[10px] block mb-2">{t('type')}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none bg-transparent border-b border-ink/15 py-2 text-sm text-ink focus:outline-none focus:border-ink"
            >
              <option value="">{t('anyType')}</option>
              {types.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="eyebrow text-[10px] block mb-2">{t('country')}</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none bg-transparent border-b border-ink/15 py-2 text-sm text-ink focus:outline-none focus:border-ink"
            >
              <option value="">{t('anyCountry')}</option>
              {countries.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="eyebrow text-[10px] block mb-2">{t('guests')}</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full appearance-none bg-transparent border-b border-ink/15 py-2 text-sm text-ink focus:outline-none focus:border-ink"
            >
              <option value="">{t('any')}</option>
              {[2, 4, 6, 8, 10].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="eyebrow text-[10px] block mb-2">{t('sort')}</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full appearance-none bg-transparent border-b border-ink/15 py-2 text-sm text-ink focus:outline-none focus:border-ink"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="priceAsc">{t('sortPriceAsc')}</option>
              <option value="priceDesc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="mt-5 pt-5 border-t border-ink/10 flex justify-end">
            <button
              onClick={() => {
                setSearch('');
                setType('');
                setCountry('');
                setGuests('');
              }}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink/60 hover:text-terracotta-500 transition-colors"
            >
              <X size={12} />
              {t('clear')}
            </button>
          </div>
        )}
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32"
        >
          {/* Compass glyph — quiet editorial accent */}
          <div
            aria-hidden
            className="relative flex h-20 w-20 items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full border border-ink/15" />
            <span className="absolute inset-2 rounded-full border border-dashed border-ink/15" />
            <Search size={20} strokeWidth={1.25} className="text-ink/45" />
          </div>

          <p className="eyebrow text-[10px] text-ink/55">
            ◌ Housely Register
          </p>
          <p className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-light leading-[1.15] tracking-tight text-ink">
            {t('empty')}
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch('');
                setType('');
                setCountry('');
                setGuests('');
              }}
              className="group mt-2 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-cream-50 px-6 py-3 text-sm font-medium text-ink transition-all duration-500 hover:border-ink hover:bg-ink hover:text-cream-50"
            >
              <X size={14} className="transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
              {t('clear')}
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
