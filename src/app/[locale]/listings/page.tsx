import { setRequestLocale } from 'next-intl/server';
import { listProperties } from '@/lib/firebase/properties';
import { fallbackProperties } from '@/lib/data/fallback';
import { toPlainProperties } from '@/lib/utils/serialize';
import { PropertyFilters } from '@/components/property/PropertyFilters';

export const dynamic = 'force-dynamic';

export default async function ListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let raw;
  try {
    raw = await listProperties();
    if (raw.length === 0) raw = fallbackProperties;
  } catch {
    raw = fallbackProperties;
  }
  const properties = toPlainProperties(raw);

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
      <PropertyFilters properties={properties} />
    </section>
  );
}
