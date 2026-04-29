'use client';

const items = [
  'Puglia',
  '◌',
  'Provence',
  '◌',
  'Kyoto',
  '◌',
  'Patagonia',
  '◌',
  'Lisbon',
  '◌',
  'Iceland',
  '◌',
  'Marrakech',
  '◌',
  'Mallorca',
  '◌',
  'Tulum',
  '◌',
];

export function Marquee() {
  const doubled = [...items, ...items];
  return (
    <section
      id="destinations"
      aria-hidden
      className="relative overflow-hidden border-y border-ink/10 bg-cream-100 py-10"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {doubled.map((s, i) => (
          <span
            key={i}
            className="font-display text-[clamp(2rem,5vw,4.5rem)] font-light tracking-tight text-ink/85"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
