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
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-transparent border-b border-ink/15 py-3 text-base text-ink placeholder:text-ink/35 focus:outline-none transition-colors duration-300 focus:border-ink',
            error && 'border-terracotta-500 focus:border-terracotta-500',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
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
        <textarea
          id={textareaId}
          ref={ref}
          rows={4}
          className={cn(
            'w-full resize-none bg-transparent border-b border-ink/15 py-3 text-base text-ink placeholder:text-ink/35 focus:outline-none transition-colors duration-300 focus:border-ink',
            error && 'border-terracotta-500 focus:border-terracotta-500',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-terracotta-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
