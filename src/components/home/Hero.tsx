'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { SplitDisplay } from '@/components/motion/Reveal';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=80';
const SIDE_IMAGE =
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const t = useTranslations('home');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-cream-100 grain"
    >
      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-ink/[0.06] to-transparent" />
        <div className="absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-ink/[0.06] to-transparent" />
      </div>

      {/* Top meta bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-[88px] left-6 right-6 lg:left-12 lg:right-12 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-ink/60"
      >
        <span>◌ {t('eyebrow')}</span>
        <span className="hidden md:inline">No. 001 — Spring/Summer</span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 pt-[18vh] md:pt-[14vh] pb-24">
        <div className="grid grid-cols-12 gap-6">
          {/* Headline */}
          <motion.div
            style={{ y, opacity: fade }}
            className="col-span-12 md:col-span-9"
          >
            <h1 className="display-xl text-[clamp(3.5rem,11vw,11rem)] text-ink">
              <span className="block overflow-hidden">
                <SplitDisplay text={t('h1Top')} delay={0.1} />
              </span>
              <span className="block pl-[8%] italic overflow-hidden text-terracotta-700">
                <SplitDisplay text={t('h1Mid')} delay={0.3} />
              </span>
              <span className="block overflow-hidden">
                <SplitDisplay text={t('h1Bottom')} delay={0.5} />
              </span>
            </h1>
          </motion.div>

          {/* Right image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease }}
            className="col-span-12 md:col-span-3 md:col-start-10 -mt-12 md:mt-12 hidden md:block"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={SIDE_IMAGE}
                alt="A quiet stone residence at golden hour"
                fill
                priority
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
              Plate 04 — Casa di Tramonto, Puglia
            </p>
          </motion.div>
        </div>

        {/* Lede + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease }}
          className="mt-16 grid grid-cols-12 gap-6"
        >
          <div className="col-span-12 md:col-span-5 md:col-start-2">
            <p className="text-lg leading-relaxed text-ink/75 max-w-md">
              {t('lede')}
            </p>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-wrap items-end gap-3">
            <Link
              href="/listings"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-cream-100 transition-all hover:bg-terracotta-500 hover:-translate-y-0.5"
            >
              {t('ctaPrimary')}
              <ArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-sm font-medium text-ink transition-all hover:bg-ink hover:text-cream-100"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Background hero photograph (subtle) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="absolute inset-0 -z-0"
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          aria-hidden
          sizes="100vw"
          className="object-cover [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink/50"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
          {t('scrollHint')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
