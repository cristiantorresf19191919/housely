'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Clock,
  KeyRound,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/i18n/routing';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { getReservationFromAnywhere } from '@/lib/firebase/reservations';
import { getProperty } from '@/lib/firebase/properties';
import { getFallbackProperty } from '@/lib/data/fallback';
import { formatCurrency } from '@/lib/utils/format';
import { pickLocale } from '@/lib/utils/i18n-pick';
import { toPlainProperty, type PlainProperty, type PlainReservation } from '@/lib/utils/serialize';

export function ConfirmationClient({ reservationId }: { reservationId: string }) {
  const t = useTranslations('confirmation');
  const tStatus = useTranslations('account.status');
  const locale = useLocale();
  const router = useRouter();
  const [reservation, setReservation] = useState<PlainReservation | null>(null);
  const [property, setProperty] = useState<PlainProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await getReservationFromAnywhere(reservationId);
      if (!mounted) return;
      if (!r) {
        router.replace('/listings');
        return;
      }
      setReservation(r);
      let p = null;
      try {
        const fbProp = await getProperty(r.propertyId);
        if (fbProp) p = toPlainProperty(fbProp);
      } catch {
        // ignore
      }
      if (!p) {
        const fallback = getFallbackProperty(r.propertyId);
        if (fallback) p = toPlainProperty(fallback);
      }
      if (mounted) {
        setProperty(p);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [reservationId, router]);

  if (loading || !reservation) {
    return (
      <LuxuryLoader
        visible
        title={pickLocale(locale, {
          en: 'Loading your reservation',
          es: 'Cargando tu reserva',
          fr: 'Chargement de votre réservation',
        })}
        subtitle={pickLocale(locale, {
          en: 'Unlocking host details...',
          es: 'Revelando los detalles del anfitrión...',
          fr: "Révélation des coordonnées de l'hôte...",
        })}
        reference={reservationId}
      />
    );
  }

  const owner = property?.ownerContact;
  const revealed = reservation.ownerContactRevealed;
  const ci = new Date(reservation.dates.checkIn);
  const co = new Date(reservation.dates.checkOut);

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
      <Reveal>
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-500/15 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-sage-700">
            <Sparkles size={12} />
            {tStatus('reserved')}
          </span>
          <h1 className="display-lg mt-6 text-[clamp(2.5rem,7vw,5.5rem)] text-ink max-w-[18ch]">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/65">{t('subtitle')}</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12">
        <div className="lg:col-span-7 xl:col-span-8 space-y-12">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-3" stagger={0.08}>
            <StaggerItem className="card-frame px-5 py-5">
              <p className="eyebrow text-[10px] mb-2">◌ {t('ref')}</p>
              <p className="font-mono text-lg tracking-[0.16em] text-ink">{reservation.id}</p>
            </StaggerItem>
            <StaggerItem className="card-frame px-5 py-5">
              <p className="eyebrow text-[10px] mb-2">◌ {t('stay')}</p>
              <p className="text-sm text-ink">
                {ci.toISOString().slice(0, 10)} → {co.toISOString().slice(0, 10)}
              </p>
              <p className="mt-1 text-xs text-ink/55 font-mono">
                {reservation.dates.nights} nights
              </p>
            </StaggerItem>
            <StaggerItem className="card-frame px-5 py-5">
              <p className="eyebrow text-[10px] mb-2">
                ◌{' '}
                {pickLocale(locale, {
                  en: 'Guests',
                  es: 'Huéspedes',
                  fr: 'Voyageurs',
                })}
              </p>
              <p className="text-sm text-ink">
                {reservation.guestInfo.guestCount} · {reservation.guestInfo.country}
              </p>
            </StaggerItem>
          </Stagger>

          <Reveal delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl bg-ink text-cream-100 px-8 py-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-terracotta-500/30 blur-3xl"
              />
              <div className="relative">
                <p className="eyebrow text-cream-100/60 mb-3">◌ {t('host')}</p>
                {revealed && owner ? (
                  <>
                    <h3 className="font-display text-[clamp(2rem,4vw,3rem)] text-cream-100 leading-tight">
                      {owner.fullName}
                    </h3>
                    <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-sm">
                      <li className="flex items-center gap-3">
                        <Mail size={14} className="opacity-70" />
                        <a className="hover:text-terracotta-100 transition-colors break-all" href={`mailto:${owner.email}`}>
                          {owner.email}
                        </a>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone size={14} className="opacity-70" />
                        <a className="hover:text-terracotta-100 transition-colors" href={`tel:${owner.phone}`}>
                          {owner.phone}
                        </a>
                      </li>
                      {owner.whatsapp && (
                        <li className="flex items-center gap-3">
                          <MessageCircle size={14} className="opacity-70" />
                          <span>{owner.whatsapp}</span>
                        </li>
                      )}
                      <li className="flex items-center gap-3">
                        <Clock size={14} className="opacity-70" />
                        <span>{owner.contactHours}</span>
                      </li>
                    </ul>
                    <p className="mt-8 text-xs text-cream-100/50 max-w-md leading-relaxed">
                      ◌{' '}
                      {pickLocale(locale, {
                        en: 'Host details revealed because the reservation fee was paid. Please reach out before your check-in date to coordinate arrival.',
                        es: 'Datos del anfitrión revelados porque la tarifa de reserva fue pagada. Contáctalo antes de tu fecha de entrada para coordinar la llegada.',
                        fr: "Coordonnées de l'hôte révélées car les frais de réservation ont été réglés. Contactez-le avant votre date d'arrivée pour organiser votre venue.",
                      })}
                    </p>
                  </>
                ) : (
                  <p className="text-base text-cream-100/70">
                    {pickLocale(locale, {
                      en: 'Host details will appear here once the reservation fee is confirmed.',
                      es: 'Los datos del anfitrión aparecerán aquí una vez confirmada la tarifa de reserva.',
                      fr: "Les coordonnées de l'hôte apparaîtront ici dès la confirmation des frais de réservation.",
                    })}
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="border border-dashed border-ink/25 rounded-3xl px-8 py-8 bg-cream-50">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-500/15 text-terracotta-500">
                  <KeyRound size={16} />
                </span>
                <div className="flex-1">
                  <p className="eyebrow mb-2">◌ {t('balance')}</p>
                  <p className="font-display text-[clamp(2rem,4vw,3rem)] text-ink leading-none tabular-nums">
                    {formatCurrency(
                      reservation.payment.remainingAtProperty,
                      reservation.payment.currency,
                      locale
                    )}
                  </p>
                  <p className="mt-3 max-w-xl text-sm text-ink/65 leading-relaxed">
                    {t('balanceNote')}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div>
              <p className="eyebrow mb-5">◌ {t('guestInfo')}</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
                {[
                  [pickLocale(locale, { en: 'Full name', es: 'Nombre completo', fr: 'Nom complet' }), reservation.guestInfo.fullName],
                  [pickLocale(locale, { en: 'Email', es: 'Email', fr: 'Email' }), reservation.guestInfo.email],
                  [pickLocale(locale, { en: 'Phone', es: 'Teléfono', fr: 'Téléphone' }), reservation.guestInfo.phone],
                  [pickLocale(locale, { en: 'Country', es: 'País', fr: 'Pays' }), reservation.guestInfo.country],
                  [pickLocale(locale, { en: 'Preferred language', es: 'Idioma preferido', fr: 'Langue préférée' }), reservation.guestInfo.preferredLanguage.toUpperCase()],
                  [pickLocale(locale, { en: 'Travel dates', es: 'Fechas de viaje', fr: 'Dates de voyage' }), `${ci.toISOString().slice(0, 10)} → ${co.toISOString().slice(0, 10)}`],
                  [pickLocale(locale, { en: 'Number of guests', es: 'Número de huéspedes', fr: 'Nombre de voyageurs' }), String(reservation.guestInfo.guestCount)],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-ink/10 pb-3">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-ink/45 font-mono">
                      {k}
                    </dt>
                    <dd className="mt-1 text-sm text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm tracking-wide text-ink/70 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            {t('back')}
          </Link>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4">
          <Reveal delay={0.2}>
            <div className="card-frame px-7 py-8 sticky top-24">
              {reservation.propertySnapshot.coverImage && (
                <div className="aspect-[4/3] overflow-hidden bg-cream-200 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reservation.propertySnapshot.coverImage}
                    alt={reservation.propertySnapshot.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="font-display text-2xl font-light text-ink">
                {reservation.propertySnapshot.title}
              </h3>
              <p className="mt-1 text-sm text-ink/55">
                {reservation.propertySnapshot.city}, {reservation.propertySnapshot.country}
              </p>

              <div className="hairline my-5" />

              <ul className="space-y-2.5 text-sm">
                <li className="flex justify-between text-ink/70">
                  <span>
                    {pickLocale(locale, {
                      en: 'Reservation fee paid',
                      es: 'Tarifa de reserva pagada',
                      fr: 'Frais de réservation payés',
                    })}
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(
                      reservation.payment.commissionAmount,
                      reservation.payment.currency,
                      locale
                    )}
                  </span>
                </li>
                <li className="flex justify-between text-ink/70">
                  <span>
                    {pickLocale(locale, {
                      en: 'Balance due at property',
                      es: 'Saldo a pagar en la propiedad',
                      fr: 'Solde dû à la propriété',
                    })}
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(
                      reservation.payment.remainingAtProperty,
                      reservation.payment.currency,
                      locale
                    )}
                  </span>
                </li>
                <li className="flex justify-between border-t border-ink/10 pt-3 mt-3 text-ink">
                  <span className="font-medium">
                    {pickLocale(locale, {
                      en: 'Total stay',
                      es: 'Total de la estancia',
                      fr: 'Total du séjour',
                    })}
                  </span>
                  <span className="font-display text-xl tabular-nums">
                    {formatCurrency(
                      reservation.payment.subtotal,
                      reservation.payment.currency,
                      locale
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
