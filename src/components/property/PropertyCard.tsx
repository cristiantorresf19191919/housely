'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { formatCurrency } from '@/lib/utils/format';
import type { PlainProperty } from '@/lib/utils/serialize';
import { cn } from '@/lib/utils/cn';

interface Props {
  property: PlainProperty;
  index?: number;
  variant?: 'standard' | 'editorial';
}

export function PropertyCard({ property, index = 0, variant = 'standard' }: Props) {
  const t = useTranslations('property');
  const locale = useLocale();
  const cover = property.images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group relative flex flex-col',
        variant === 'editorial' && 'md:gap-6'
      )}
    >
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-200">
          {cover && (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              loading={index < 2 ? 'eager' : 'lazy'}
              priority={index === 0}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {property.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-cream-50/95 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-ink">
              ◌{' '}
              {locale === 'es'
                ? 'Destacada'
                : locale === 'fr'
                ? 'À la une'
                : 'Featured'}
            </span>
          )}

          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/85 backdrop-blur px-2.5 py-1 text-[11px] text-cream-100">
            <Star size={11} className="fill-gold-500 text-gold-500" />
            <span className="font-mono tabular-nums">{property.rating.toFixed(1)}</span>
          </span>

          <div className="pointer-events-none absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-ink translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-[10px]">
            {property.address.city} · {property.address.country}
          </p>
          <h3 className="mt-1.5 truncate font-display text-[1.4rem] font-light leading-tight tracking-tight text-ink">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-ink/60 line-clamp-1">
            {property.tagline}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-[1.4rem] leading-none tracking-tight text-ink tabular-nums">
            {formatCurrency(property.pricePerNight, property.currency, locale)}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink/50">
            {t('perNight')}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
