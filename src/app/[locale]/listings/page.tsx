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
    <section
      className="relative isolate overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* Atmospheric grain — layered into the dark register surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-noise"
        style={{
          opacity: 'var(--grain-opacity, 0.06)',
          mixBlendMode: 'var(--grain-blend, multiply)' as unknown as 'multiply',
        }}
      />

      {/* Decorative soft glows — appear only on dark theme via accent colors */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-[8%] h-[420px] w-[420px] rounded-full opacity-40 blur-[140px]"
        style={{ background: 'color-mix(in srgb, var(--accent) 22%, transparent)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-[40%] h-[360px] w-[360px] rounded-full opacity-30 blur-[120px]"
        style={{ background: 'color-mix(in srgb, var(--gold) 18%, transparent)' }}
      />

      {/* Side editorial rule with vertical text — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-32 hidden flex-col items-center gap-6 lg:flex"
      >
        <span
          className="h-24 w-px"
          style={{ background: 'var(--line)' }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.32em] [writing-mode:vertical-rl]"
          style={{ color: 'var(--foreground-muted)' }}
        >
          Filed under residences · Live register
        </span>
        <span
          className="h-24 w-px"
          style={{ background: 'var(--line)' }}
        />
      </div>

      {/* Decorative oversized 04 numeral as soft watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-8 select-none font-display text-[clamp(12rem,28vw,28rem)] leading-none tracking-tighter italic opacity-[0.07] sm:-right-10"
        style={{ color: 'var(--foreground)' }}
      >
        04
      </span>

      <div className="relative mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28">
        <PropertyFilters properties={properties} />
      </div>
    </section>
  );
}
