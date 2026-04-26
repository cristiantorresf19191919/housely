import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProperty } from '@/lib/firebase/properties';
import { getFallbackProperty } from '@/lib/data/fallback';
import { toPlainProperty } from '@/lib/utils/serialize';
import { BookingForm } from '@/components/forms/BookingForm';

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
}) {
  const { locale, id } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  let raw;
  try {
    raw = await getProperty(id);
  } catch {
    raw = null;
  }
  if (!raw) raw = getFallbackProperty(id);
  if (!raw) notFound();
  const property = toPlainProperty(raw);

  const checkIn = sp.checkIn ?? todayPlus(7);
  const checkOut = sp.checkOut ?? todayPlus(11);

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
      <BookingForm property={property} checkIn={checkIn} checkOut={checkOut} />
    </section>
  );
}
