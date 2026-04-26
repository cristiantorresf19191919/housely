import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Star, Users, BedDouble, Bath, Maximize, Home } from 'lucide-react';
import { getProperty } from '@/lib/firebase/properties';
import { getFallbackProperty } from '@/lib/data/fallback';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { ReserveCard } from '@/components/property/ReserveCard';
import { Reveal } from '@/components/motion/Reveal';
import { toPlainProperty } from '@/lib/utils/serialize';

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'property' });

  let raw;
  try {
    raw = await getProperty(id);
  } catch {
    raw = null;
  }
  if (!raw) raw = getFallbackProperty(id);
  if (!raw) notFound();
  const property = toPlainProperty(raw);

  const meta = [
    { icon: Users, label: t('guests', { n: property.maxGuests }) },
    { icon: BedDouble, label: t('bedrooms', { n: property.bedrooms }) },
    { icon: Bath, label: t('bathrooms', { n: property.bathrooms }) },
    { icon: Maximize, label: t('beds', { n: property.beds }) },
  ];

  return (
    <article className="mx-auto max-w-[1440px] px-6 lg:px-12 py-12 lg:py-16">
      {/* Title strip */}
      <Reveal>
        <div className="mb-8">
          <p className="eyebrow mb-3 flex items-center gap-3">
            <Home size={11} />
            {property.address.city}, {property.address.region} ·{' '}
            {property.address.country}
          </p>
          <h1 className="display-lg text-[clamp(2.5rem,7vw,5.5rem)] text-ink max-w-[20ch]">
            {property.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink/65 italic font-display font-light">
            {property.tagline}
          </p>
          <div className="mt-5 flex items-center gap-4 text-sm text-ink/70">
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-gold-500 text-gold-500" />
              <span className="font-mono tabular-nums">
                {property.rating.toFixed(2)}
              </span>
              <span className="text-ink/50">· {property.reviewCount} notes</span>
            </span>
          </div>
        </div>
      </Reveal>

      {/* Gallery */}
      <PropertyGallery images={property.images} />

      {/* Body */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16">
        <div className="lg:col-span-7 xl:col-span-8 space-y-16">
          {/* Quick meta */}
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 border-y border-ink/10 py-6">
              {meta.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <m.icon size={18} strokeWidth={1.4} className="text-ink/60" />
                  <span className="text-sm text-ink/80">{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Description */}
          <Reveal>
            <div>
              <p className="eyebrow mb-4">◌ {t('description')}</p>
              <p className="font-display font-light text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.4] text-ink max-w-[60ch]">
                {property.description}
              </p>
            </div>
          </Reveal>

          {/* Amenities */}
          <Reveal>
            <div>
              <p className="eyebrow mb-6">◌ {t('amenities')}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {property.amenities.map((a, i) => (
                  <li
                    key={a.key}
                    className="flex items-center gap-3 border-b border-ink/10 pb-4"
                  >
                    <span className="font-mono text-[10px] text-ink/40 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base text-ink/85">{a.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Reserve sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <ReserveCard property={property} />
        </div>
      </div>
    </article>
  );
}
