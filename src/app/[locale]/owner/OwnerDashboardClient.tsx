'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarCheck,
  KeyRound,
  Plus,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/i18n/routing';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  listOwnerProperties,
  listOwnerReservations,
  summarizeReservations,
} from '@/lib/firebase/owner';
import type { PlainProperty, PlainReservation } from '@/lib/utils/serialize';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { formatCurrency } from '@/lib/utils/format';
import { pickLocale } from '@/lib/utils/i18n-pick';

export function OwnerDashboardClient() {
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<PlainProperty[]>([]);
  const [reservations, setReservations] = useState<PlainReservation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const [props, res] = await Promise.all([
          listOwnerProperties(user.uid),
          listOwnerReservations(user.uid).catch(() => [] as PlainReservation[]),
        ]);
        if (!mounted) return;
        setProperties(props);
        setReservations(res);
      } finally {
        if (mounted) setDataLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, loading, router]);

  if (loading || !user || dataLoading) {
    return (
      <LuxuryLoader
        visible
        title={pickLocale(locale, {
          en: 'Opening your atelier',
          es: 'Abriendo tu atelier',
          fr: 'Ouverture de votre atelier',
        })}
        subtitle={pickLocale(locale, {
          en: 'Fetching your residences...',
          es: 'Cargando tus residencias...',
          fr: 'Chargement de vos résidences...',
        })}
      />
    );
  }

  const summary = summarizeReservations(reservations);
  const eyebrow = pickLocale(locale, {
    en: 'Owner atelier',
    es: 'Atelier del anfitrión',
    fr: 'Atelier du propriétaire',
  });
  const title = pickLocale(locale, {
    en: 'Your residences, refined.',
    es: 'Tus residencias, refinadas.',
    fr: 'Vos résidences, raffinées.',
  });
  const subtitle = pickLocale(locale, {
    en: "A quiet desk for keeping watch on your listings, leads and earnings.",
    es: 'Un escritorio sereno para gestionar tus residencias, prospectos y ganancias.',
    fr: "Un bureau discret pour suivre vos résidences, prospects et revenus.",
  });

  return (
    <div className="relative">
      {/* Atmospheric flourish */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 70% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)',
        }}
      />

      <section className="relative mx-auto max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
        <Reveal>
          <div className="flex items-start justify-between gap-8 flex-wrap mb-12">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">◌ {eyebrow} · {user.email}</p>
              <h1
                className="display-lg text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]"
                style={{ color: 'var(--foreground)' }}
              >
                {title}
              </h1>
              <p
                className="mt-5 max-w-xl text-base"
                style={{ color: 'color-mix(in srgb, var(--foreground) 70%, transparent)' }}
              >
                {subtitle}
              </p>
            </div>
            <Link
              href="/owner/listings/new"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5"
              style={{
                background: 'var(--foreground)',
                color: 'var(--surface)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <Plus size={16} strokeWidth={1.5} />
              {pickLocale(locale, {
                en: 'List a residence',
                es: 'Publicar una residencia',
                fr: 'Publier une résidence',
              })}
              <ArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        {/* Metrics row */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16" stagger={0.08}>
          <MetricCard
            icon={<Building2 size={16} strokeWidth={1.5} />}
            label={pickLocale(locale, {
              en: 'Listings',
              es: 'Publicaciones',
              fr: 'Annonces',
            })}
            value={properties.length.toString()}
            hint={pickLocale(locale, {
              en: properties.filter((p) => p.active).length === properties.length
                ? 'All active'
                : `${properties.filter((p) => p.active).length} active`,
              es: `${properties.filter((p) => p.active).length} activas`,
              fr: `${properties.filter((p) => p.active).length} actives`,
            })}
          />
          <MetricCard
            icon={<CalendarCheck size={16} strokeWidth={1.5} />}
            label={pickLocale(locale, {
              en: 'Active reservations',
              es: 'Reservas activas',
              fr: 'Réservations actives',
            })}
            value={summary.counts.reserved.toString()}
            hint={pickLocale(locale, {
              en: `${summary.counts.pending} pending`,
              es: `${summary.counts.pending} pendientes`,
              fr: `${summary.counts.pending} en attente`,
            })}
          />
          <MetricCard
            icon={<Wallet size={16} strokeWidth={1.5} />}
            label={pickLocale(locale, {
              en: 'Commission earned',
              es: 'Comisión ganada',
              fr: 'Commission perçue',
            })}
            value={formatCurrency(summary.totalCommission, summary.currency, locale)}
            hint={pickLocale(locale, {
              en: 'platform fees collected',
              es: 'comisiones recibidas',
              fr: 'commissions collectées',
            })}
            accent
          />
          <MetricCard
            icon={<KeyRound size={16} strokeWidth={1.5} />}
            label={pickLocale(locale, {
              en: 'To collect at door',
              es: 'A cobrar al llegar',
              fr: 'À encaisser sur place',
            })}
            value={formatCurrency(summary.totalRemaining, summary.currency, locale)}
            hint={pickLocale(locale, {
              en: 'across reserved stays',
              es: 'en estancias reservadas',
              fr: 'pour les séjours réservés',
            })}
          />
        </Stagger>

        {/* Listings table */}
        <div className="mb-16">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <p className="eyebrow mb-2">◌ {pickLocale(locale, {
                  en: 'The register',
                  es: 'El registro',
                  fr: 'Le registre',
                })}</p>
                <h2
                  className="display-md text-[clamp(1.75rem,4vw,2.75rem)] leading-tight"
                  style={{ color: 'var(--foreground)' }}
                >
                  {pickLocale(locale, {
                    en: 'Your residences',
                    es: 'Tus residencias',
                    fr: 'Vos résidences',
                  })}
                </h2>
              </div>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: 'color-mix(in srgb, var(--foreground) 55%, transparent)' }}
              >
                {properties.length}{' '}
                {pickLocale(locale, {
                  en: 'in rotation',
                  es: 'en rotación',
                  fr: 'en rotation',
                })}
              </span>
            </div>
          </Reveal>

          {properties.length === 0 ? (
            <EmptyListings locale={locale} />
          ) : (
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--line)',
              }}
            >
              <ul>
                {properties.map((p, i) => (
                  <ListingRow key={p.id} property={p} reservations={reservations} index={i} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recent leads */}
        {reservations.length > 0 && (
          <div>
            <Reveal>
              <div className="mb-8">
                <p className="eyebrow mb-2">◌ {pickLocale(locale, {
                  en: 'Recent leads',
                  es: 'Solicitudes recientes',
                  fr: 'Demandes récentes',
                })}</p>
                <h2
                  className="display-md text-[clamp(1.75rem,4vw,2.75rem)] leading-tight"
                  style={{ color: 'var(--foreground)' }}
                >
                  {pickLocale(locale, {
                    en: 'Who is asking after your places.',
                    es: 'Quién está preguntando por tus residencias.',
                    fr: 'Qui s’intéresse à vos résidences.',
                  })}
                </h2>
              </div>
            </Reveal>
            <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-4" stagger={0.06}>
              {reservations.slice(0, 6).map((r) => (
                <StaggerItem key={r.id}>
                  <LeadCard reservation={r} locale={locale} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Metric card                                     */
function MetricCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl p-6"
        style={{
          background: accent
            ? 'color-mix(in srgb, var(--accent) 10%, var(--surface-elevated))'
            : 'var(--surface-elevated)',
          border: `1px solid ${accent ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'var(--line)'}`,
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              background: 'color-mix(in srgb, var(--foreground) 8%, transparent)',
              color: accent ? 'var(--accent)' : 'var(--foreground)',
            }}
          >
            {icon}
          </span>
          {accent && (
            <Sparkles
              size={14}
              strokeWidth={1.5}
              style={{ color: 'var(--accent)' }}
            />
          )}
        </div>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2"
          style={{ color: 'color-mix(in srgb, var(--foreground) 55%, transparent)' }}
        >
          {label}
        </p>
        <p
          className="font-display text-3xl tabular-nums leading-none"
          style={{ color: 'var(--foreground)' }}
        >
          {value}
        </p>
        <p
          className="mt-3 text-[12px]"
          style={{ color: 'color-mix(in srgb, var(--foreground) 60%, transparent)' }}
        >
          {hint}
        </p>
      </motion.div>
    </StaggerItem>
  );
}

/* Listing row                                     */
function ListingRow({
  property,
  reservations,
  index,
}: {
  property: PlainProperty;
  reservations: PlainReservation[];
  index: number;
}) {
  const propRes = reservations.filter((r) => r.propertyId === property.id);
  const reservedCount = propRes.filter((r) => r.status === 'reserved').length;
  const cover = property.images[0];

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group/row"
      style={{
        borderTop: index === 0 ? 'none' : '1px solid var(--line)',
      }}
    >
      <Link
        href={`/properties/${property.id}`}
        className="grid grid-cols-12 items-center gap-4 px-6 py-5 transition-colors"
      >
        {/* Cover */}
        <div className="col-span-12 md:col-span-2">
          <div
            className="relative h-16 w-24 overflow-hidden rounded-lg"
            style={{ background: 'var(--surface-3)' }}
          >
            {cover && (
              <img
                src={cover.url}
                alt={cover.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/row:scale-105"
              />
            )}
          </div>
        </div>
        {/* Title + city */}
        <div className="col-span-12 md:col-span-4 min-w-0">
          <p
            className="font-display text-lg leading-tight tracking-tight truncate"
            style={{ color: 'var(--foreground)' }}
          >
            {property.title}
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: 'color-mix(in srgb, var(--foreground) 55%, transparent)' }}
          >
            {property.address.city} · {property.address.country}
          </p>
        </div>
        {/* Price */}
        <div className="col-span-6 md:col-span-2 text-right md:text-left">
          <p
            className="font-display text-base tabular-nums"
            style={{ color: 'var(--foreground)' }}
          >
            {formatCurrency(property.pricePerNight, property.currency, 'en')}
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'color-mix(in srgb, var(--foreground) 50%, transparent)' }}
          >
            per night
          </p>
        </div>
        {/* Reservations */}
        <div className="col-span-6 md:col-span-2 text-right md:text-left">
          <p
            className="font-mono text-sm tabular-nums"
            style={{ color: 'var(--foreground)' }}
          >
            {reservedCount}
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'color-mix(in srgb, var(--foreground) 50%, transparent)' }}
          >
            reserved
          </p>
        </div>
        {/* Status pill + arrow */}
        <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em]"
            style={{
              background: property.active
                ? 'color-mix(in srgb, var(--sage) 18%, transparent)'
                : 'color-mix(in srgb, var(--foreground) 8%, transparent)',
              color: property.active ? 'var(--sage)' : 'var(--foreground)',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: property.active ? 'var(--sage)' : 'var(--foreground-muted)',
              }}
            />
            {property.active ? 'Live' : 'Draft'}
          </span>
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 opacity-0 -translate-x-2 group-hover/row:opacity-100 group-hover/row:translate-x-0"
            style={{
              background: 'color-mix(in srgb, var(--foreground) 6%, transparent)',
              color: 'var(--foreground)',
            }}
          >
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

/* Empty state                                     */
function EmptyListings({ locale }: { locale: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl px-10 py-16 text-center"
      style={{
        background: 'var(--surface-elevated)',
        border: '1px dashed var(--line-strong)',
      }}
    >
      <div
        className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
          color: 'var(--accent)',
        }}
      >
        <Building2 size={20} strokeWidth={1.5} />
      </div>
      <h3
        className="font-display text-2xl tracking-tight"
        style={{ color: 'var(--foreground)' }}
      >
        {pickLocale(locale, {
          en: 'No residence yet.',
          es: 'Aún no hay residencias.',
          fr: 'Aucune résidence pour le moment.',
        })}
      </h3>
      <p
        className="mx-auto mt-3 max-w-md text-sm"
        style={{ color: 'color-mix(in srgb, var(--foreground) 65%, transparent)' }}
      >
        {pickLocale(locale, {
          en: 'List your first place. We will help you frame it like a magazine spread.',
          es: 'Publica tu primera residencia. La presentaremos como una editorial.',
          fr: "Publiez votre première adresse. Nous l’habillerons comme une page de magazine.",
        })}
      </p>
      <Link
        href="/owner/listings/new"
        className="group mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all hover:-translate-y-0.5"
        style={{
          background: 'var(--foreground)',
          color: 'var(--surface)',
        }}
      >
        <Plus size={16} strokeWidth={1.5} />
        {pickLocale(locale, {
          en: 'Begin your first listing',
          es: 'Empezar mi primera publicación',
          fr: 'Commencer ma première annonce',
        })}
        <ArrowRight
          size={14}
          className="transition-transform duration-500 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* Lead card                                       */
function LeadCard({
  reservation,
  locale,
}: {
  reservation: PlainReservation;
  locale: string;
}) {
  const { guestInfo, payment, dates, propertySnapshot, status } = reservation;
  const isReserved = status === 'reserved';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--line)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p
            className="font-display text-lg tracking-tight truncate"
            style={{ color: 'var(--foreground)' }}
          >
            {guestInfo.fullName}
          </p>
          <p
            className="mt-0.5 text-[12px] truncate"
            style={{ color: 'color-mix(in srgb, var(--foreground) 60%, transparent)' }}
          >
            {guestInfo.email} · {guestInfo.country}
          </p>
        </div>
        <span
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
          style={{
            background: isReserved
              ? 'color-mix(in srgb, var(--sage) 18%, transparent)'
              : 'color-mix(in srgb, var(--gold) 22%, transparent)',
            color: isReserved ? 'var(--sage)' : 'var(--gold)',
          }}
        >
          {isReserved
            ? pickLocale(locale, {
                en: 'Reserved',
                es: 'Reservada',
                fr: 'Réservée',
              })
            : pickLocale(locale, {
                en: 'Pending',
                es: 'Pendiente',
                fr: 'En attente',
              })}
        </span>
      </div>

      <div className="hairline my-4" />

      <div className="grid grid-cols-3 gap-3 text-[12px]">
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'color-mix(in srgb, var(--foreground) 50%, transparent)' }}
          >
            {pickLocale(locale, { en: 'Stay', es: 'Estancia', fr: 'Séjour' })}
          </p>
          <p
            className="mt-1 tabular-nums"
            style={{ color: 'var(--foreground)' }}
          >
            {dates.checkIn.slice(0, 10)}
          </p>
          <p
            className="tabular-nums"
            style={{ color: 'color-mix(in srgb, var(--foreground) 60%, transparent)' }}
          >
            → {dates.checkOut.slice(0, 10)}
          </p>
        </div>
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'color-mix(in srgb, var(--foreground) 50%, transparent)' }}
          >
            {pickLocale(locale, { en: 'Guests', es: 'Huéspedes', fr: 'Invités' })}
          </p>
          <p
            className="mt-1 tabular-nums"
            style={{ color: 'var(--foreground)' }}
          >
            {guestInfo.guestCount}
          </p>
        </div>
        <div className="text-right">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'color-mix(in srgb, var(--foreground) 50%, transparent)' }}
          >
            {pickLocale(locale, { en: 'At door', es: 'Al llegar', fr: 'Sur place' })}
          </p>
          <p
            className="mt-1 font-display text-base tabular-nums"
            style={{ color: 'var(--foreground)' }}
          >
            {formatCurrency(payment.remainingAtProperty, payment.currency, locale)}
          </p>
        </div>
      </div>

      <p
        className="mt-4 text-[11px]"
        style={{ color: 'color-mix(in srgb, var(--foreground) 55%, transparent)' }}
      >
        {propertySnapshot.title} · {propertySnapshot.city}
      </p>
    </motion.div>
  );
}
