import { setRequestLocale } from 'next-intl/server';
import { NewListingClient } from './NewListingClient';

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NewListingClient />;
}
