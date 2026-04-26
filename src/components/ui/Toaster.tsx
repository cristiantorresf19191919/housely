'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      offset={88}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'group flex w-full items-start gap-3 rounded-2xl border border-ink/10 bg-cream-50 px-5 py-4 shadow-[0_24px_60px_-24px_rgba(31,22,17,0.35)] backdrop-blur-md',
          title: 'font-display text-[15px] leading-snug text-ink tracking-tight',
          description: 'mt-1 text-[13px] leading-relaxed text-ink/65',
          actionButton:
            'rounded-full bg-ink px-3.5 py-1.5 text-xs text-cream-100 hover:bg-terracotta-500 transition-colors',
          cancelButton:
            'rounded-full border border-ink/20 px-3.5 py-1.5 text-xs text-ink hover:bg-ink/5 transition-colors',
          icon: 'mt-0.5',
          success:
            '[&_[data-icon]]:text-sage-700 border-sage-500/30 bg-sage-500/[0.06]',
          error:
            '[&_[data-icon]]:text-terracotta-500 border-terracotta-500/30 bg-terracotta-500/[0.06]',
          info: '[&_[data-icon]]:text-ink/70',
          warning: '[&_[data-icon]]:text-gold-700 border-gold-500/30 bg-gold-500/[0.07]',
        },
      }}
    />
  );
}
