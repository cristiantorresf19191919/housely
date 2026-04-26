import { Link } from '@/lib/i18n/routing';

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-32 text-center">
      <div>
        <p className="eyebrow mb-6">◌ 404 · Lost in transit</p>
        <h1 className="display-xl text-[clamp(4rem,12vw,10rem)] text-ink leading-none">
          Off the register.
        </h1>
        <p className="mt-6 max-w-md mx-auto text-base text-ink/65">
          The residence you were looking for has stepped away from the register.
        </p>
        <Link
          href="/listings"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm text-cream-100 hover:bg-terracotta-500 transition-colors"
        >
          Browse residences
        </Link>
      </div>
    </section>
  );
}
