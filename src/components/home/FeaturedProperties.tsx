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
    <section
      className="relative isolate overflow-hidden py-24 md:py-32 lg:py-44"
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Atmospheric grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-noise"
        style={{
          opacity: 'var(--grain-opacity, 0.06)',
          mixBlendMode: 'var(--grain-blend, multiply)' as unknown as 'multiply',
        }}
      />

      {/* Decorative oversized "04" — issue numeral as soft watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-2 select-none font-display text-[clamp(10rem,24vw,22rem)] leading-none italic opacity-[0.06] sm:-left-6"
        style={{ color: 'var(--foreground)' }}
      >
        04
      </span>

      {/* Side editorial rule — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-32 hidden flex-col items-center gap-6 lg:flex"
      >
        <span className="h-24 w-px" style={{ background: 'var(--line)' }} />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.32em] [writing-mode:vertical-rl]"
          style={{ color: 'var(--foreground-muted)' }}
        >
          The current register · Live
        </span>
        <span className="h-24 w-px" style={{ background: 'var(--line)' }} />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-12">
        {/* Header — asymmetric editorial */}
        <div className="mb-12 grid grid-cols-12 gap-6 sm:mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-8">
            <Reveal>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-12" style={{ background: 'var(--line-strong)' }} />
                <p className="eyebrow text-[10px]">◌ {t('featuredEyebrow')}</p>
              </div>
              <h2
                className="mt-6 display-lg text-[clamp(2.5rem,7.5vw,6rem)] leading-[0.95] tracking-[-0.02em] max-w-[16ch]"
                style={{ color: 'var(--foreground)' }}
              >
                <WipeReveal delay={0.1} duration={1.2}>{t('featuredTitle')}</WipeReveal>
              </h2>
              <p
                className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: 'var(--foreground-muted)' }}
              >
                Vol. 04 · {issueDate.toUpperCase()} · Spring/Summer
              </p>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-span-4 md:flex md:items-end md:justify-end">
            <Reveal delay={0.2}>
              <Link
                href="/listings"
                data-cursor="View"
                className="group inline-flex items-center gap-2 text-sm tracking-wide transition-colors hover:[color:var(--accent)]"
                style={{ color: 'var(--foreground)' }}
              >
                {t('viewAll')}
                <ArrowRight
                  size={14}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Editorial cadence — middle card of each lg row offsets down */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:gap-y-16 md:grid-cols-2 md:gap-x-6 md:gap-y-20 lg:grid-cols-3 [&>*:nth-child(3n+2)]:lg:translate-y-12">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>

        {/* Closing editorial signature */}
        <div className="mt-20 flex flex-wrap items-center gap-4 sm:mt-28">
          <span aria-hidden className="h-px flex-1" style={{ background: 'var(--line)' }} />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.28em]"
            style={{ color: 'var(--foreground-muted)' }}
          >
            ◌ End of current register
          </span>
          <span aria-hidden className="h-px flex-1" style={{ background: 'var(--line)' }} />
        </div>
      </div>
    </section>
  );
}
