'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Lock, Calendar } from 'lucide-react';
import { useRouter } from '@/lib/i18n/routing';
import { computePayment, formatCurrency, nightsBetween } from '@/lib/utils/format';
import type { PlainProperty } from '@/lib/utils/serialize';

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function ReserveCard({ property }: { property: PlainProperty }) {
  const t = useTranslations('property');
  const tBook = useTranslations('book');
  const locale = useLocale();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(11));

  const { nights, payment } = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const n = end > start ? nightsBetween(start, end) : 1;
    const calc = computePayment({
      pricePerNight: property.pricePerNight,
      nights: n,
      cleaningFee: property.cleaningFee,
    });
    return { nights: n, payment: calc };
  }, [checkIn, checkOut, property]);

  const currency = property.currency;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="sticky top-24 card-frame px-7 py-8"
    >
      <div className="flex items-baseline justify-between">
        <p className="font-display text-3xl text-ink tabular-nums">
          {formatCurrency(property.pricePerNight, currency, locale)}
        </p>
        <span className="text-xs uppercase tracking-[0.16em] text-ink/50">
          {t('perNight')}
        </span>
      </div>

      <div className="hairline my-6" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="eyebrow text-[10px] block mb-1.5">
            <Calendar size={10} className="inline mr-1" />
            {t('checkIn')}
          </label>
          <input
            type="date"
            value={checkIn}
            min={todayPlus(0)}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent border-b border-ink/15 py-2 text-sm focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="eyebrow text-[10px] block mb-1.5">
            <Calendar size={10} className="inline mr-1" />
            {t('checkOut')}
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent border-b border-ink/15 py-2 text-sm focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="mt-7 space-y-2.5 text-sm">
        <div className="flex justify-between text-ink/70">
          <span>
            {formatCurrency(property.pricePerNight, currency, locale)} × {nights}
          </span>
          <span className="tabular-nums">
            {formatCurrency(payment.nightlyTotal, currency, locale)}
          </span>
        </div>
        <div className="flex justify-between text-ink/70">
          <span>{tBook('cleaningFee')}</span>
          <span className="tabular-nums">
            {formatCurrency(payment.cleaningFee, currency, locale)}
          </span>
        </div>
      </div>

      <div className="hairline my-5" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${nights}-${payment.commissionAmount}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="rounded-2xl bg-cream-200/60 px-4 py-4">
            <p className="eyebrow text-[10px] mb-2">{tBook('commission')}</p>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl text-ink tabular-nums">
                {formatCurrency(payment.commissionAmount, currency, locale)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
                {Math.round(payment.commissionRate * 100)}%
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-ink/20 px-4 py-4">
            <p className="eyebrow text-[10px] mb-2">{tBook('remaining')}</p>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl text-ink tabular-nums">
                {formatCurrency(payment.remainingAtProperty, currency, locale)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-terracotta-500">
                {locale === 'es'
                  ? '@ Propiedad'
                  : locale === 'fr'
                  ? '@ Propriété'
                  : '@ Property'}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-ink/55 leading-snug">
              {tBook('deadline')}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => {
          const search = new URLSearchParams({ checkIn, checkOut }).toString();
          router.push(`/properties/${property.id}/book?${search}`);
        }}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-cream-100 transition-all hover:bg-terracotta-500 hover:-translate-y-0.5"
      >
        {t('reserve')}
        <ArrowRight
          size={14}
          className="transition-transform duration-500 group-hover:translate-x-1"
        />
      </button>

      <div className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-ink/55">
        <Lock size={12} className="mt-0.5 shrink-0" />
        <p>{t('ownerHidden')}</p>
      </div>
    </motion.aside>
  );
}
