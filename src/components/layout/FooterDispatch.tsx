'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const CITIES: Array<{ name: string; tz: string }> = [
  { name: 'Cartagena', tz: 'America/Bogota' },
  { name: 'Lisbon', tz: 'Europe/Lisbon' },
  { name: 'Kyoto', tz: 'Asia/Tokyo' },
  { name: 'Marrakech', tz: 'Africa/Casablanca' },
  { name: 'Tulum', tz: 'America/Cancun' },
  { name: 'Mykonos', tz: 'Europe/Athens' },
];

function useCityClock(tz: string) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        // ICU absent — clock is decorative
      }
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [tz]);

  return time;
}

function CityClock({ name, tz }: { name: string; tz: string }) {
  const time = useCityClock(tz);
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-terracotta-500/70" />
      <span className="text-ink/55">{name}</span>
      {time && <span className="tabular-nums text-ink/40">{time}</span>}
    </span>
  );
}

export function DestinationTicker() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div className="flex w-max animate-marquee gap-12 py-2 font-mono text-[10px] uppercase tracking-[0.22em]">
        {[...CITIES, ...CITIES].map((c, i) => (
          <CityClock key={`${c.name}-${i}`} name={c.name} tz={c.tz} />
        ))}
      </div>
    </div>
  );
}

interface DispatchSignupProps {
  label: string;
  placeholder: string;
  cta: string;
  success: string;
}

export function DispatchSignup({ label, placeholder, cta, success }: DispatchSignupProps) {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // Decorative — wired up to a real endpoint later.
  };

  return (
    <div>
      <p className="eyebrow text-[10px] mb-3">{label}</p>
      <form onSubmit={onSubmit} className="relative max-w-sm">
        <div className="group relative flex items-end gap-3 border-b border-ink/15 transition-colors duration-300 focus-within:border-ink">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={submitted}
            aria-label={label}
            className="peer flex-1 bg-transparent py-3 text-base text-ink placeholder:text-ink/35 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitted || !email}
            aria-label={cta}
            className="group/btn relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream-50 transition-all duration-500 hover:bg-terracotta-500 disabled:opacity-50 disabled:hover:bg-ink"
          >
            {submitted ? (
              <motion.span
                initial={reduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease }}
              >
                <Check size={14} strokeWidth={2} />
              </motion.span>
            ) : (
              <ArrowRight
                size={14}
                strokeWidth={1.75}
                className="transition-transform duration-500 group-hover/btn:translate-x-0.5"
              />
            )}
          </button>
          {/* Animated underline that draws on focus */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -bottom-px left-0 right-0 h-px origin-left bg-ink"
            initial={false}
            animate={{ scaleX: submitted ? 1 : 0 }}
            transition={{ duration: 0.7, ease }}
          />
        </div>
      </form>
      <motion.p
        aria-live="polite"
        initial={false}
        animate={{
          opacity: submitted ? 1 : 0,
          y: submitted ? 0 : -4,
        }}
        transition={{ duration: 0.4, ease }}
        className="mt-3 text-xs text-sage-700"
      >
        ◌ {success}
      </motion.p>
    </div>
  );
}
