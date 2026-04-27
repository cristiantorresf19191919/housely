'use client';

import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ArrowRight, Lock } from 'lucide-react';
import { useRouter } from '@/lib/i18n/routing';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { pickLocale } from '@/lib/utils/i18n-pick';
import { computePayment, formatCurrency, nightsBetween } from '@/lib/utils/format';
import { createReservation } from '@/lib/firebase/reservations';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  guestInfoSchema,
  type GuestInfoInput,
} from '@/lib/schemas/reservation';
import type { Locale } from '@/types';
import type { PlainProperty } from '@/lib/utils/serialize';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Spain', 'France',
  'Italy', 'Germany', 'Mexico', 'Argentina', 'Brazil', 'Portugal', 'Japan',
  'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Iceland', 'Greece', 'Turkey',
  'United Arab Emirates', 'Other',
];

interface Props {
  property: PlainProperty;
  checkIn: string;
  checkOut: string;
}

export function BookingForm({ property, checkIn, checkOut }: Props) {
  const t = useTranslations('book');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [, startTransition] = useTransition();

  const ci = useMemo(() => new Date(checkIn), [checkIn]);
  const co = useMemo(() => new Date(checkOut), [checkOut]);
  const nights = nightsBetween(ci, co);
  const calc = computePayment({
    pricePerNight: property.pricePerNight,
    nights,
    cleaningFee: property.cleaningFee,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoInput>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      preferredLanguage: locale,
      guestCount: 2,
      notes: '',
    },
  });

  const onValid = async (values: GuestInfoInput) => {
    setSubmitting(true);
    try {
      const { reservation, persisted } = await createReservation({
        property,
        guestInfo: values,
        checkIn: ci,
        checkOut: co,
        guestUid: user?.uid,
      });
      toast.success(
        pickLocale(locale, {
          en: 'Reservation drafted',
          es: 'Reserva creada',
          fr: 'Réservation préparée',
        }),
        {
          description:
            persisted === 'local'
              ? pickLocale(locale, {
                  en: 'Demo mode: saved locally. Continuing to the fee.',
                  es: 'Modo demo: guardada localmente. Continuemos al pago.',
                  fr: 'Mode démo : sauvegardée localement. Direction le paiement.',
                })
              : pickLocale(locale, {
                  en: 'Continuing to the reservation fee...',
                  es: 'Continuemos al pago de la tarifa.',
                  fr: 'Direction les frais de réservation...',
                }),
        }
      );
      startTransition(() => {
        router.push(`/checkout/${reservation.id}`);
      });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Could not create the reservation.';
      toast.error(
        pickLocale(locale, {
          en: "Couldn't draft the reservation",
          es: 'No pudimos guardar la reserva',
          fr: 'Impossible de préparer la réservation',
        }),
        { description: message }
      );
      setSubmitting(false);
    }
  };

  const onInvalid = () => {
    toast.error(
      pickLocale(locale, {
        en: 'A few details are missing',
        es: 'Faltan algunos datos',
        fr: 'Quelques informations manquent',
      }),
      {
        description: pickLocale(locale, {
          en: 'Please review the highlighted fields before continuing.',
          es: 'Revisa los campos resaltados antes de continuar.',
          fr: 'Vérifiez les champs en surbrillance avant de continuer.',
        }),
      }
    );
  };

  return (
    <>
    <LuxuryLoader
      visible={submitting}
      title={pickLocale(locale, {
        en: 'Securing your dates',
        es: 'Asegurando tus fechas',
        fr: 'Sécurisation de vos dates',
      })}
      subtitle={pickLocale(locale, {
        en: `Reserving ${property.title} for the selected dates...`,
        es: `Reservando ${property.title} para tus fechas seleccionadas...`,
        fr: `Réservation de ${property.title} pour les dates choisies...`,
      })}
    />
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12"
    >
      <div className="lg:col-span-7 xl:col-span-8">
        <p className="eyebrow mb-3">◌ Step 01 — Reservation details</p>
        <h1 className="display-lg text-[clamp(2.25rem,5vw,4rem)] text-ink max-w-[16ch]">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/65">{t('subtitle')}</p>

        <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8" stagger={0.06}>
          <StaggerItem className="md:col-span-2">
            <Input label={t('fullName')} {...register('fullName')} error={errors.fullName?.message} />
          </StaggerItem>
          <StaggerItem>
            <Input type="email" label={t('email')} {...register('email')} error={errors.email?.message} />
          </StaggerItem>
          <StaggerItem>
            <Input type="tel" label={t('phone')} {...register('phone')} error={errors.phone?.message} placeholder="+1 555 ..." />
          </StaggerItem>
          <StaggerItem>
            <Select label={t('country')} {...register('country')} error={errors.country?.message}>
              <option value="">—</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </StaggerItem>
          <StaggerItem>
            <Select label={t('preferredLanguage')} {...register('preferredLanguage')}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </Select>
          </StaggerItem>
          <StaggerItem>
            <Input label={t('checkIn')} value={checkIn} readOnly className="cursor-not-allowed text-ink/70" />
          </StaggerItem>
          <StaggerItem>
            <Input label={t('checkOut')} value={checkOut} readOnly className="cursor-not-allowed text-ink/70" />
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <Select label={t('guestCount')} {...register('guestCount')} error={errors.guestCount?.message}>
              {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <Textarea
              label={t('notes')}
              placeholder={t('notesPlaceholder')}
              {...register('notes')}
            />
          </StaggerItem>
        </Stagger>
      </div>

      {/* Sticky summary */}
      <aside className="lg:col-span-5 xl:col-span-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="sticky top-24 card-frame px-7 py-8"
        >
          <p className="eyebrow mb-4">◌ {t('summary')}</p>

          <div className="aspect-[4/3] overflow-hidden bg-cream-200 mb-5">
            {property.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={property.images[0].url}
                alt={property.images[0].alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>

          <h3 className="font-display text-2xl font-light leading-tight text-ink">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-ink/55">
            {property.address.city}, {property.address.country}
          </p>

          <div className="hairline my-5" />

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>{checkIn} → {checkOut}</span>
              <span className="font-mono text-xs">{nights} nights</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>{t('subtotal')}</span>
              <span className="tabular-nums">
                {formatCurrency(calc.nightlyTotal, property.currency, locale)}
              </span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>{t('cleaningFee')}</span>
              <span className="tabular-nums">
                {formatCurrency(calc.cleaningFee, property.currency, locale)}
              </span>
            </div>
          </div>

          <div className="hairline my-5" />

          <div className="rounded-2xl bg-cream-200/60 px-4 py-4">
            <p className="eyebrow text-[10px] mb-2">{t('commission')}</p>
            <p className="font-display text-2xl text-ink tabular-nums">
              {formatCurrency(calc.commissionAmount, property.currency, locale)}
            </p>
          </div>
          <div className="mt-3 rounded-2xl border border-dashed border-ink/20 px-4 py-4">
            <p className="eyebrow text-[10px] mb-2">{t('remaining')}</p>
            <p className="font-display text-2xl text-ink tabular-nums">
              {formatCurrency(calc.remainingAtProperty, property.currency, locale)}
            </p>
            <p className="mt-2 text-[11px] text-ink/55 leading-snug">
              {t('deadline')}
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-cream-100 transition-all hover:bg-terracotta-500 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {t('continue')}
            <ArrowRight
              size={14}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-ink/55">
            <Lock size={12} className="mt-0.5 shrink-0" />
            {t('agree')}
          </p>
        </motion.div>
      </aside>
    </form>
    </>
  );
}
