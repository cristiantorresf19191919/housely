import { setRequestLocale } from 'next-intl/server';
import { ConfirmationClient } from './ConfirmationClient';

export const dynamic = 'force-dynamic';

export default async function ReservationConfirmation({
  params,
}: {
  params: Promise<{ locale: string; reservationId: string }>;
}) {
  const { locale, reservationId } = await params;
  setRequestLocale(locale);
  return <ConfirmationClient reservationId={reservationId} />;
}
