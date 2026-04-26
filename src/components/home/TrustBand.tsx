'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Reveal, SplitDisplay } from '@/components/motion/Reveal';

export function TrustBand() {
  const t = useTranslations('home');
  return (
    <section className="relative bg-ink text-cream-100 py-32 lg:py-40 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-soft-light pointer-events-none"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-cream-200/60 mb-6">◌ {t('trustEyebrow')}</p>
        </Reveal>

        <h2 className="display-lg text-[clamp(2.5rem,7vw,7rem)] text-cream-100 max-w-[18ch]">
          <SplitDisplay text={t('trustTitle')} delay={0.1} />
        </h2>

        <Reveal delay={0.5}>
          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-cream-100/70">
            {t('trustBody')}
          </p>
        </Reveal>

        {/* Decorative numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-12"
        >
          {[
            { n: '142', l: 'Residences in rotation' },
            { n: '38', l: 'Quiet destinations' },
            { n: '4.94', l: 'Average guest rating' },
            { n: '0', l: 'Hidden fees, ever' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.1 }}
            >
              <p className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none tabular-nums text-cream-100">
                {s.n}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-cream-100/60">
                {s.l}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
