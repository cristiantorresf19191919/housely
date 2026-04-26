'use client';

import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const auto = useId();
    const selectId = id ?? auto;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="eyebrow text-[10px] tracking-[0.18em]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-transparent border-b border-ink/15 py-3 pr-8 text-base text-ink focus:outline-none transition-colors duration-300 focus:border-ink',
              error && 'border-terracotta-500',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ink/50"
          />
        </div>
        {error && <p className="text-xs text-terracotta-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
