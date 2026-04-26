import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 text-center bg-cream-100">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/55 mb-4">
          ◌ 404
        </p>
        <h1 className="font-display text-7xl text-ink">Off the register.</h1>
        <Link
          href="/en/listings"
          className="mt-8 inline-flex rounded-full bg-ink px-7 py-3 text-sm text-cream-100 hover:bg-terracotta-500 transition-colors"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
