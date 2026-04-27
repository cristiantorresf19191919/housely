import { setRequestLocale } from 'next-intl/server';
import { OwnerDashboardClient } from './OwnerDashboardClient';

export default async function OwnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OwnerDashboardClient />;
}
