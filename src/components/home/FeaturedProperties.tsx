import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { listProperties } from '@/lib/firebase/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Reveal, WipeReveal } from '@/components/motion/Reveal';
import { fallbackProperties } from '@/lib/data/fallback';
import { toPlainProperties } from '@/lib/utils/serialize';

export async function FeaturedProperties() {
  const t = await getTranslations('home');
  let raw: Awaited<ReturnType<typeof listProperties>>;
  try {
    raw = await listProperties({ featured: true, max: 6 });
    if (raw.length === 0) raw = fallbackProperties.slice(0, 6);
  } catch {
    raw = fallbackProperties.slice(0, 6);
  }
  const properties = toPlainProperties(raw);

  const issueDate = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <section className="relative bg-cream-50 py-20 md:py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap sm:mb-14 md:mb-16">
          <Reveal>
            <p className="eyebrow mb-3 sm:mb-4">◌ {t('featuredEyebrow')}</p>
            <h2 className="display-lg text-[clamp(2.25rem,6vw,5.5rem)] text-ink max-w-[16ch]">
              <WipeReveal delay={0.1} duration={1.2}>{t('featuredTitle')}</WipeReveal>
            </h2>
            {/* Editorial issue stamp */}
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/45">
              Vol. 04 · {issueDate.toUpperCase()} · Spring/Summer
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/listings"
              className="group inline-flex items-center gap-2 text-sm tracking-wide text-ink hover:text-terracotta-500 transition-colors"
            >
              {t('viewAll')}
              <ArrowRight
                size={14}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        {/* Editorial cadence — middle card of each lg row offsets down */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:gap-y-14 md:grid-cols-2 md:gap-x-6 md:gap-y-16 lg:grid-cols-3 [&>*:nth-child(3n+2)]:lg:translate-y-12">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
