'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn';

const button = cva(
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100',
  {
    variants: {
      variant: {
        primary:
          'bg-ink text-cream-100 hover:bg-terracotta-500 hover:-translate-y-0.5 shadow-[0_4px_20px_-8px_rgba(31,22,17,0.4)] hover:shadow-[0_10px_30px_-10px_rgba(184,84,63,0.5)]',
        ghost:
          'border border-ink/20 text-ink hover:bg-ink hover:text-cream-100 hover:border-ink',
        link: 'text-ink underline-offset-4 hover:underline',
        soft: 'bg-cream-200 text-ink hover:bg-ink hover:text-cream-100',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-12 px-7 text-sm',
        lg: 'h-14 px-9 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(button({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
