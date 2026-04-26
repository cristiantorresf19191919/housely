'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowRight, LogOut } from 'lucide-react';
import { Link, useRouter } from '@/lib/i18n/routing';
import { db } from '@/lib/firebase/client';
import { signOut } from '@/lib/firebase/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { formatCurrency } from '@/lib/utils/format';
import { pickLocale } from '@/lib/utils/i18n-pick';
import type { Reservation } from '@/types';

export default function AccountPage() {
  const t = useTranslations('account');
  const tStatus = useTranslations('account.status');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingRes, setLoadingRes] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const q = query(
          collection(db, 'reservations'),
          where('guestUid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Reservation[];
        if (mounted) setReservations(items);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoadingRes(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <LuxuryLoader
        visible
        title={pickLocale(locale, {
          en: 'Opening your account',
          es: 'Abriendo tu cuenta',
          fr: 'Ouverture de votre compte',
        })}
        subtitle={pickLocale(locale, {
          en: 'Fetching your reservations...',
          es: 'Recuperando tus reservas...',
          fr: 'Récupération de vos réservations...',
        })}
      />
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
      <Reveal>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">◌ {user.email}</p>
            <h1 className="display-lg text-[clamp(2.5rem,7vw,5rem)] text-ink">
              {t('title')}
            </h1>
          </div>
          <button
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-ink hover:bg-ink hover:text-cream-100 transition-colors"
          >
            <LogOut size={12} />
            {tNav('signOut')}
          </button>
        </div>
      </Reveal>

      <p className="eyebrow mb-6">◌ {t('reservations')}</p>

      {loadingRes ? (
        <p className="text-sm text-ink/50">...</p>
      ) : reservations.length === 0 ? (
        <Reveal>
          <div className="card-frame px-8 py-16 text-center">
            <p className="font-display text-2xl text-ink/60 italic max-w-md mx-auto">
              {t('noReservations')}
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm text-cream-100 hover:bg-terracotta-500 transition-colors"
            >
              {tNav('explore')}
              <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      ) : (
        <Stagger className="space-y-3" stagger={0.06}>
          {reservations.map((r) => {
            const ci = r.dates.checkIn.toDate();
            const co = r.dates.checkOut.toDate();
            return (
              <StaggerItem key={r.id}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-12 gap-6 card-frame px-6 py-5"
                >
                  <div className="col-span-12 md:col-span-2">
                    <div className="aspect-[4/3] overflow-hidden bg-cream-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.propertySnapshot.coverImage}
                        alt={r.propertySnapshot.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-5">
                    <p className="font-mono text-[10px] tracking-[0.16em] text-ink/45 uppercase">
                      {r.id}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-ink">
                      {r.propertySnapshot.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink/55">
                      {r.propertySnapshot.city}, {r.propertySnapshot.country}
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <p className="eyebrow text-[10px]">
                      {pickLocale(locale, { en: 'Stay', es: 'Estancia', fr: 'Séjour' })}
                    </p>
                    <p className="mt-1 text-sm text-ink/85">
                      {ci.toISOString().slice(0,10)} →{' '}
                      {co.toISOString().slice(0,10)}
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <p className="eyebrow text-[10px]">
                      {pickLocale(locale, { en: 'Status', es: 'Estado', fr: 'Statut' })}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink">
                      <span
                        className={
                          r.status === 'reserved' || r.status === 'completed'
                            ? 'h-1.5 w-1.5 rounded-full bg-sage-500'
                            : r.status === 'pending_commission'
                            ? 'h-1.5 w-1.5 rounded-full bg-gold-500 animate-soft-pulse'
                            : 'h-1.5 w-1.5 rounded-full bg-ink/40'
                        }
                      />
                      {tStatus(r.status)}
                    </p>
                    <p className="mt-1 font-mono tabular-nums text-sm text-ink/85">
                      {formatCurrency(
                        r.payment.subtotal,
                        r.payment.currency,
                        locale
                      )}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-1 flex md:items-center md:justify-end">
                    <Link
                      href={`/reservations/${r.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-cream-100 transition-colors"
                      aria-label="View"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </section>
  );
}
