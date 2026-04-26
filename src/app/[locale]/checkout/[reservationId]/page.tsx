import { setRequestLocale } from 'next-intl/server';
import { CheckoutClient } from './CheckoutClient';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string; reservationId: string }>;
}) {
  const { locale, reservationId } = await params;
  setRequestLocale(locale);
  return <CheckoutClient reservationId={reservationId} />;
}
