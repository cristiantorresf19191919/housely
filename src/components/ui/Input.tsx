'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <div className="group flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="eyebrow text-[10px] tracking-[0.18em]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'peer w-full bg-transparent border-b border-ink/15 py-3 text-base text-ink placeholder:text-ink/35 focus:outline-none transition-colors duration-300',
              error && 'border-terracotta-500',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {/* Focus underline — draws from left on focus */}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute -bottom-px left-0 right-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100',
              error ? 'bg-terracotta-500' : 'bg-ink',
            )}
          />
        </div>
        {error ? (
          <p className="text-xs text-terracotta-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink/50">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const auto = useId();
    const textareaId = id ?? auto;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="eyebrow text-[10px] tracking-[0.18em]">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={4}
            className={cn(
              'peer w-full resize-none bg-transparent border-b border-ink/15 py-3 text-base text-ink placeholder:text-ink/35 focus:outline-none transition-colors duration-300',
              error && 'border-terracotta-500',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute -bottom-px left-0 right-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100',
              error ? 'bg-terracotta-500' : 'bg-ink',
            )}
          />
        </div>
        {error && <p className="text-xs text-terracotta-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
