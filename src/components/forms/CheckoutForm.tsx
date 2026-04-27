'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Lock, ShieldCheck, KeyRound, Calendar } from 'lucide-react';
import { useRouter } from '@/lib/i18n/routing';
import { Input } from '@/components/ui/Input';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { recordCommissionPayment } from '@/lib/firebase/reservations';
import { formatCurrency } from '@/lib/utils/format';
import { pickLocale } from '@/lib/utils/i18n-pick';
import { useAuth } from '@/lib/hooks/useAuth';
import type { PlainReservation } from '@/lib/utils/serialize';

interface Props {
  reservation: PlainReservation;
}

export function CheckoutForm({ reservation }: Props) {
  const t = useTranslations('checkout');
  const tBook = useTranslations('book');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [, startTransition] = useTransition();

  const { payment, propertySnapshot } = reservation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Demo: simulate provider processing time, then record payment.
    await new Promise((r) => setTimeout(r, 1800));
    try {
      await recordCommissionPayment({
        reservationId: reservation.id,
        amount: payment.commissionAmount,
        currency: payment.currency,
        guestUid: user?.uid,
      });
      toast.success(
        pickLocale(locale, {
          en: 'Reservation confirmed',
          es: 'Reserva confirmada',
          fr: 'Réservation confirmée',
        }),
        {
          description: pickLocale(locale, {
            en: "Taking you to your host's details.",
            es: 'Te llevamos a los detalles del anfitrión.',
            fr: "Direction les coordonnées de l'hôte.",
          }),
        }
      );
      startTransition(() => {
        router.push(`/reservations/${reservation.id}`);
      });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Payment could not be recorded.';
      toast.error(
        pickLocale(locale, {
          en: "Payment couldn't be recorded",
          es: 'No se pudo procesar el pago',
          fr: "Impossible d'enregistrer le paiement",
        }),
        { description: message }
      );
      setProcessing(false);
    }
  };

  return (
    <>
    <LuxuryLoader
      visible={processing}
      reference={reservation.id}
      title={pickLocale(locale, {
        en: 'Processing your reservation',
        es: 'Procesando tu pago',
        fr: 'Traitement de votre réservation',
      })}
      subtitle={pickLocale(locale, {
        en: "Locking your dates and unlocking your host's details...",
        es: 'Aseguramos las fechas y revelamos los datos del anfitrión...',
        fr: "Verrouillage de vos dates et révélation des coordonnées de l'hôte...",
      })}
    />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12">
      <div className="lg:col-span-7 xl:col-span-8">
        <p className="eyebrow mb-3">◌ Step 02 — Reservation fee</p>
        <h1 className="display-lg text-[clamp(2.25rem,5vw,4rem)] text-ink max-w-[18ch]">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/65">{t('subtitle')}</p>

        {/* Payment split visual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="relative overflow-hidden rounded-2xl bg-ink p-7 text-cream-100">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-100/60">
              {t('amountNow')}
            </p>
            <p className="mt-3 font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none tabular-nums">
              {formatCurrency(payment.commissionAmount, payment.currency, locale)}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-cream-100/70">
              <ShieldCheck size={12} />
              {pickLocale(locale, {
                en: 'Secures your dates instantly',
                es: 'Asegura tus fechas al instante',
                fr: 'Sécurise vos dates instantanément',
              })}
            </p>
            <div
              aria-hidden
              className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-terracotta-500/20 blur-3xl"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-ink/30 p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
              {t('amountAtProperty')}
            </p>
            <p className="mt-3 font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none tabular-nums text-ink">
              {formatCurrency(payment.remainingAtProperty, payment.currency, locale)}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink/65">
              <KeyRound size={12} />
              {t('deadline')}
            </p>
          </div>
        </motion.div>

        {/* Card details (demo) */}
        <form onSubmit={handleSubmit} className="mt-14">
          <p className="eyebrow mb-6">◌ {t('card')}</p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
            <div className="md:col-span-12">
              <Input
                label={t('cardNumber')}
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                defaultValue="4242 4242 4242 4242"
                required
              />
            </div>
            <div className="md:col-span-3">
              <Input label={t('expiry')} placeholder="MM/YY" defaultValue="12/29" required />
            </div>
            <div className="md:col-span-3">
              <Input label={t('cvc')} placeholder="123" defaultValue="123" required />
            </div>
            <div className="md:col-span-6">
              <Input label={t('nameOnCard')} defaultValue={reservation.guestInfo.fullName} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="group mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-ink px-9 py-4 text-sm font-medium text-cream-100 transition-all hover:bg-terracotta-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Lock size={14} />
            {processing
              ? t('processing')
              : t('pay', {
                  amount: formatCurrency(
                    payment.commissionAmount,
                    payment.currency,
                    locale
                  ),
                })}
          </button>

          <p className="mt-4 text-[11px] text-ink/45 italic">{t('demoNote')}</p>
        </form>
      </div>

      {/* Order summary */}
      <aside className="lg:col-span-5 xl:col-span-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="sticky top-24 card-frame px-7 py-8"
        >
          <p className="eyebrow mb-4">◌ {tBook('summary')}</p>

          {propertySnapshot.coverImage && (
            <div className="aspect-[4/3] overflow-hidden bg-cream-200 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={propertySnapshot.coverImage}
                alt={propertySnapshot.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <h3 className="font-display text-2xl font-light leading-tight text-ink">
            {propertySnapshot.title}
          </h3>
          <p className="mt-1 text-sm text-ink/55">
            {propertySnapshot.city}, {propertySnapshot.country}
          </p>

          <div className="hairline my-5" />

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>
                <Calendar size={11} className="inline mr-1.5" />
                {reservation.dates.checkIn.slice(0, 10)}
              </span>
              <span>{reservation.dates.checkOut.slice(0, 10)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>{tBook('subtotal')}</span>
              <span className="tabular-nums">
                {formatCurrency(payment.nightlyTotal, payment.currency, locale)}
              </span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>{tBook('cleaningFee')}</span>
              <span className="tabular-nums">
                {formatCurrency(payment.cleaningFee, payment.currency, locale)}
              </span>
            </div>
          </div>

          <div className="hairline my-5" />

          <AnimatePresence>
            {processing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-sage-500/15 px-4 py-3 text-xs text-sage-700"
              >
                {pickLocale(locale, {
                  en: 'Securing your dates...',
                  es: 'Asegurando tus fechas...',
                  fr: 'Sécurisation de vos dates...',
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </aside>
    </div>
    </>
  );
}
