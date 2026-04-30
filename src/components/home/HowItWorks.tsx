'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { KeyRound, MessageSquare, Wallet } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, WipeReveal } from '@/components/motion/Reveal';

const ease = [0.22, 1, 0.36, 1] as const;

export function HowItWorks() {
  const t = useTranslations('home');
  const steps = [
    { key: 'how1', icon: Wallet, title: t('howStep1Title'), body: t('howStep1Body'), label: '01' },
    { key: 'how2', icon: MessageSquare, title: t('howStep2Title'), body: t('howStep2Body'), label: '02' },
    { key: 'how3', icon: KeyRound, title: t('howStep3Title'), body: t('howStep3Body'), label: '03' },
  ];

  return (
    <section
      id="how"
      className="relative isolate overflow-hidden py-24 md:py-32 lg:py-44"
      style={{ background: 'var(--surface)' }}
    >
      {/* Atmospheric grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-noise"
        style={{
          opacity: 'var(--grain-opacity, 0.06)',
          mixBlendMode: 'var(--grain-blend, multiply)' as unknown as 'multiply',
        }}
      />

      {/* Decorative oversized "II" — section roman numeral as watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 top-12 select-none font-display text-[clamp(10rem,24vw,22rem)] leading-none italic opacity-[0.06] sm:-right-4"
        style={{ color: 'var(--foreground)' }}
      >
        II
      </span>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-12">
        {/* Header — asymmetric, editorial */}
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12" style={{ background: 'var(--line-strong)' }} />
              <p className="eyebrow text-[10px]">◌ {t('eyebrow')}</p>
            </div>
            <h2
              className="mt-6 display-lg text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.02em] max-w-[14ch]"
              style={{ color: 'var(--foreground)' }}
            >
              <WipeReveal delay={0.1} duration={1.2}>{t('howItWorksTitle')}</WipeReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:flex md:items-end md:justify-end">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] md:text-right"
              style={{ color: 'var(--foreground-muted)' }}
            >
              Vol. 04 · Section II
              <br />
              The mechanics
            </p>
          </div>
        </div>

        {/* Steps — magazine grid, no horizontal-rule "table" feel */}
        <Stagger
          className="grid grid-cols-1 gap-y-16 md:gap-y-24"
          stagger={0.16}
          delay={0.1}
        >
          {steps.map((step, i) => (
            <StaggerItem key={step.key} className="group">
              <div className="grid grid-cols-12 gap-x-4 gap-y-6 sm:gap-x-6">
                {/* Display number — left rail */}
                <div className="col-span-3 md:col-span-2 lg:col-span-1">
                  <p
                    className="font-display text-[clamp(2rem,5vw,4rem)] leading-none italic tabular-nums transition-colors duration-700 group-hover:[color:var(--accent)]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Icon scene — middle rail */}
                <div className="col-span-9 md:col-span-3 lg:col-span-3 flex items-start">
                  <motion.span
                    whileHover={{ rotate: -6, scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
                    style={{
                      background: 'var(--surface-2)',
                      boxShadow: 'inset 0 0 0 1px var(--line)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {/* Concentric ring that draws on viewport entry */}
                    <motion.span
                      aria-hidden
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.15 + i * 0.08, ease }}
                      className="absolute inset-[-10px] rounded-full"
                      style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
                    />
                    <step.icon size={26} strokeWidth={1.4} />
                  </motion.span>
                </div>

                {/* Copy — right rail */}
                <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6 max-w-2xl">
                  <h3
                    className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-light leading-[1.1] tracking-tight"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-4 max-w-xl text-[15px] leading-relaxed sm:text-base"
                    style={{ color: 'var(--foreground-muted)' }}
                  >
                    {step.body}
                  </p>

                  {/* Hairline that draws on hover */}
                  <span
                    aria-hidden
                    className="mt-8 block h-px w-full origin-left scale-x-[0.18] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    style={{ background: 'var(--accent)' }}
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Closing editorial signature */}
        <Reveal delay={0.3}>
          <div className="mt-20 flex flex-wrap items-center gap-4 sm:mt-28">
            <span aria-hidden className="h-px flex-1" style={{ background: 'var(--line)' }} />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.28em]"
              style={{ color: 'var(--foreground-muted)' }}
            >
              ◌ End of Section II
            </span>
            <span aria-hidden className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
