import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { DispatchSignup, DestinationTicker } from './FooterDispatch';

export function Footer() {
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');

  return (
    <footer className="relative bg-cream-50">
      {/* Tonal bridge from preceding dark section into the cream footer */}
      <div
        aria-hidden
        className="h-24 w-full"
        style={{
          background:
            'linear-gradient(180deg, #1F1611 0%, rgba(31,22,17,0.55) 35%, rgba(31,22,17,0.18) 70%, #FBF8F3 100%)',
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-20">
        {/* Dispatch + ticker — sits above the column grid as a quiet farewell */}
        <div className="mb-20 grid gap-12 border-b border-ink/10 pb-16 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <DispatchSignup
              label={t('dispatchEyebrow')}
              placeholder={t('dispatchPlaceholder')}
              cta={t('dispatchCta')}
              success={t('dispatchSuccess')}
            />
          </div>
          <div className="md:col-span-6">
            <p className="eyebrow text-[10px] mb-4">◌ {t('tickerEyebrow')}</p>
            <DestinationTicker />
          </div>
        </div>

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
              <li><Link href="/listings" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">Residences<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
              <li><Link href="/#destinations" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">Destinations<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
              <li><Link href="/#journal" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">{t('journal')}<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#about" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">{t('about')}<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
              <li><Link href="/#press" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">{t('press')}<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
              <li><Link href="/auth/register?role=owner" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">Become a host<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow mb-4">{t('legal')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#terms" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">{t('terms')}<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
              <li><Link href="/#privacy" className="group/link relative inline-block text-sm text-ink/80 transition-colors hover:text-ink">{t('privacy')}<span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover/link:scale-x-100" /></Link></li>
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
