import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TrustBand } from '@/components/home/TrustBand';
import { SectionBridge } from '@/components/motion/SectionBridge';

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
      <SectionBridge marker="◌ This week's residences" stamp="Vol. 04 · Spring/Summer" />
      <Suspense fallback={<div className="h-[60vh]" />}>
        <FeaturedProperties />
      </Suspense>
      <SectionBridge variant="soft-to-cream" marker="◌ How it works" stamp="The mechanics" />
      <HowItWorks />
      <SectionBridge variant="cream-to-dark" marker="◌ The promise" stamp="Trust band" />
      <TrustBand />
    </>
  );
}
