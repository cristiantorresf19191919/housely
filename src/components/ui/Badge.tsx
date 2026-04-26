import { cn } from '@/lib/utils/cn';

export function Badge({
  children,
  className,
  tone = 'ink',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'ink' | 'cream' | 'terracotta' | 'sage' | 'gold';
}) {
  const tones = {
    ink: 'bg-ink text-cream-100',
    cream: 'bg-cream-200 text-ink',
    terracotta: 'bg-terracotta-500 text-cream-100',
    sage: 'bg-sage-500 text-cream-100',
    gold: 'bg-gold-500 text-ink',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em]',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
