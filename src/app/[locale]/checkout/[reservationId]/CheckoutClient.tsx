'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { CheckoutForm } from '@/components/forms/CheckoutForm';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { getReservationFromAnywhere } from '@/lib/firebase/reservations';
import { pickLocale } from '@/lib/utils/i18n-pick';
import type { PlainReservation } from '@/lib/utils/serialize';
import { useRouter } from '@/lib/i18n/routing';

export function CheckoutClient({ reservationId }: { reservationId: string }) {
  const [reservation, setReservation] = useState<PlainReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();

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
      setLoading(false);
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
          en: 'Fetching payment details...',
          es: 'Recuperando los detalles del pago...',
          fr: 'Récupération des détails du paiement...',
        })}
        reference={reservationId}
      />
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
      <CheckoutForm reservation={reservation} />
    </section>
  );
}
