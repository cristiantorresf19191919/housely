import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TrustBand } from '@/components/home/TrustBand';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Marquee />
      <Suspense fallback={<div className="h-[60vh]" />}>
        <FeaturedProperties />
      </Suspense>
      <HowItWorks />
      <TrustBand />
    </>
  );
}
