'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { KeyRound, MessageSquare, Wallet } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

const ease = [0.22, 1, 0.36, 1] as const;

export function HowItWorks() {
  const t = useTranslations('home');
  const steps = [
    {
      key: 'how1',
      icon: Wallet,
      title: t('howStep1Title'),
      body: t('howStep1Body'),
      label: '01',
    },
    {
      key: 'how2',
      icon: MessageSquare,
      title: t('howStep2Title'),
      body: t('howStep2Body'),
      label: '02',
    },
    {
      key: 'how3',
      icon: KeyRound,
      title: t('howStep3Title'),
      body: t('howStep3Body'),
      label: '03',
    },
  ];

  return (
    <section id="how" className="relative bg-cream-100 py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-6">◌ {t('eyebrow')}</p>
          <h2 className="display-lg text-[clamp(2.5rem,7vw,6.5rem)] text-ink max-w-[14ch]">
            {t('howItWorksTitle')}
          </h2>
        </Reveal>

        <Stagger
          className="mt-20 grid gap-px bg-ink/10 border-t border-b border-ink/10"
          stagger={0.12}
          delay={0.2}
        >
          {steps.map((step, i) => (
            <StaggerItem
              key={step.key}
              className="bg-cream-100 group relative overflow-hidden"
            >
              <motion.div
                whileHover={{ backgroundColor: 'rgba(184, 84, 63, 0.04)' }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-12 gap-6 px-6 py-12 lg:px-12 lg:py-16"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-xs tracking-[0.18em] text-ink/40">
                    {step.label}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-3 flex items-start">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-700 group-hover:bg-ink group-hover:text-cream-100 group-hover:rotate-[-8deg]">
                    <step.icon size={18} strokeWidth={1.5} />
                  </span>
                </div>
                <div className="col-span-12 md:col-span-7 max-w-2xl">
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ink/70 max-w-xl">
                    {step.body}
                  </p>
                </div>
              </motion.div>

              {/* Edge slide-in line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease }}
                style={{ transformOrigin: 'left' }}
                className="absolute bottom-0 left-0 h-px w-full bg-terracotta-500/40"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
