import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';

export function Footer() {
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');

  return (
    <footer className="relative mt-32 border-t border-ink/10 bg-cream-50">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-20">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="display-lg text-[clamp(2.5rem,5vw,4.5rem)] text-ink">
              {tBrand('name')}.
            </h3>
            <p className="mt-2 max-w-sm text-base text-ink/70 italic">
              {t('tag')}
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">{t('explore')}</h4>
            <ul className="space-y-2">
              <li><Link href="/listings" className="text-sm text-ink/80 hover:text-ink transition-colors">Residences</Link></li>
              <li><Link href="/#destinations" className="text-sm text-ink/80 hover:text-ink transition-colors">Destinations</Link></li>
              <li><Link href="/#journal" className="text-sm text-ink/80 hover:text-ink transition-colors">{t('journal')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#about" className="text-sm text-ink/80 hover:text-ink transition-colors">{t('about')}</Link></li>
              <li><Link href="/#press" className="text-sm text-ink/80 hover:text-ink transition-colors">{t('press')}</Link></li>
              <li><Link href="/auth/register?role=owner" className="text-sm text-ink/80 hover:text-ink transition-colors">Become a host</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow mb-4">{t('legal')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#terms" className="text-sm text-ink/80 hover:text-ink transition-colors">{t('terms')}</Link></li>
              <li><Link href="/#privacy" className="text-sm text-ink/80 hover:text-ink transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-ink/50 font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} {tBrand('name')} — {t('rights')}
          </p>
          <p className="text-xs text-ink/50 font-mono tracking-widest uppercase">
            ◌ Crafted with intention
          </p>
        </div>
      </div>

      {/* Decorative oversized wordmark */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden"
      >
        <div className="display-xl text-center text-[clamp(8rem,28vw,28rem)] leading-none text-ink/[0.06]">
          {tBrand('name')}
        </div>
      </div>
    </footer>
  );
}
