import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/Toaster';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { locales, type AppLocale } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function isLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        lang={locale}
        className="relative min-h-screen overflow-x-hidden"
        style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:px-5 focus:py-2.5 focus:text-sm"
          style={{ background: 'var(--foreground)', color: 'var(--surface)' }}
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Suspense>
          <Header />
        </Suspense>
        <main id="main" className="pt-[72px]">
          {children}
        </main>
        <Footer />
        <Toaster />
      </div>
    </NextIntlClientProvider>
  );
}
