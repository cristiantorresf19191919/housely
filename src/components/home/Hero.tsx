'use client';

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { SplitDisplay } from '@/components/motion/Reveal';

const VIDEO_SRC = '/videos/cartagena-medellin.mp4';
const ease = [0.22, 1, 0.36, 1] as const;

const PLACES = [
  'Cartagena',
  'Medellín',
  'Tulum',
  'Oaxaca',
  'Lisbon',
  'Porto',
  'Marrakech',
  'Mykonos',
  'Comporta',
  'Cape Town',
  'Salta',
  'Kyoto',
  'Sayulita',
  'Rovinj',
];

const STATS: Array<{ value: number; suffix?: string; label: string }> = [
  { value: 216, label: 'Residences' },
  { value: 24, label: 'Cities' },
  { value: 9, label: 'Countries' },
];

// ─── helpers ────────────────────────────────────────────────────────

function MagneticWrap({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  to,
  duration = 1.6,
  delay = 0,
}: {
  to: number;
  duration?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setVal(Math.round(n)),
    });
    return () => controls.stop();
  }, [to, duration, delay, reduceMotion]);

  return <>{val}</>;
}

function DestinationClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Bogota',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        // env without ICU — clock is decorative
      }
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full bg-terracotta-400"
      />
      <span>BOG · {time}</span>
    </span>
  );
}

function CornerBracket({
  position,
  delay = 0,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  delay?: number;
}) {
  const map = {
    tl: { className: 'top-4 left-4 md:top-8 md:left-8', rotate: 0 },
    tr: { className: 'top-4 right-4 md:top-8 md:right-8', rotate: 90 },
    bl: { className: 'bottom-4 left-4 md:bottom-8 md:left-8', rotate: -90 },
    br: { className: 'bottom-4 right-4 md:bottom-8 md:right-8', rotate: 180 },
  } as const;
  const conf = map[position];

  return (
    <motion.svg
      aria-hidden
      width="38"
      height="38"
      viewBox="0 0 38 38"
      style={{ transform: `rotate(${conf.rotate}deg)` }}
      className={`pointer-events-none absolute z-20 ${conf.className} text-cream-50/45`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.path
        d="M 0 26 L 0 0 L 26 0"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay, ease }}
      />
      <motion.circle
        cx="0"
        cy="0"
        r="2"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 1 }}
      />
    </motion.svg>
  );
}

// ─── main component ─────────────────────────────────────────────────

export function Hero() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const [videoReady, setVideoReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // Cursor-driven micro-parallax on the headline (kept very subtle so it
  // reads as breathing, not as wobble).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const headlineX = useSpring(useTransform(mx, [-1, 1], [-10, 10]), {
    stiffness: 80,
    damping: 18,
  });
  const headlineY = useSpring(useTransform(my, [-1, 1], [-6, 6]), {
    stiffness: 80,
    damping: 18,
  });

  // Video autoplay — DOM events are the source of truth for paused state.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Keep these as explicit element properties so autoplay policies can
    // evaluate a consistently muted + inline playback context.
    v.autoplay = true;
    v.defaultMuted = true;
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');

    if (v.readyState >= 2) setVideoReady(true);

    if (reduceMotion) {
      v.pause();
      return;
    }

    let cancelled = false;
    const tryPlay = () => {
      if (cancelled || !v.paused) return;
      v.play().catch(() => {
        if (!cancelled) {
          window.setTimeout(() => {
            if (!cancelled && v.paused) v.play().catch(() => {});
          }, 250);
        }
      });
    };

    const onReady = () => {
      setVideoReady(true);
      tryPlay();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    tryPlay();
    v.addEventListener('loadedmetadata', onReady);
    v.addEventListener('canplay', onReady);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      v.removeEventListener('loadedmetadata', onReady);
      v.removeEventListener('canplay', onReady);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [reduceMotion]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 1.0 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const r = sectionRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* ─── Video layer ───────────────────────────────────────── */}
      <motion.div
        style={{ scale: reduceMotion ? 1 : videoScale }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disableRemotePlayback
          aria-label="Aerial footage of Cartagena and Medellín, Colombia"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => {
            const v = videoRef.current;
            if (v && v.paused && !reduceMotion) {
              void v.play().catch(() => {});
            }
          }}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onError={(e) => {
            const el = e.currentTarget;
            // eslint-disable-next-line no-console
            console.error('[Hero video]', el.error?.code, el.error?.message);
          }}
        />
        {/* First-paint mask — fades once the video is ready */}
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: videoReady ? 0 : 1 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-0 bg-ink"
        />
      </motion.div>

      {/* ─── Atmospheric overlays ──────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,4,0.65)_0%,rgba(8,6,4,0.25)_30%,rgba(8,6,4,0.20)_60%,rgba(8,6,4,0.55)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(8,6,4,0.55)_0%,rgba(8,6,4,0.35)_40%,rgba(8,6,4,0.10)_70%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_38%_42%,rgba(8,6,4,0.45),transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06] mix-blend-soft-light"
      />
      {/* Smooth section transition into the cream marquee below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-cream-100"
      />

      {/* ─── Editorial corner brackets ─────────────────────────── */}
      <CornerBracket position="tl" delay={0.15} />
      <CornerBracket position="tr" delay={0.25} />
      <CornerBracket position="bl" delay={0.35} />
      <CornerBracket position="br" delay={0.45} />

      {/* ─── Decorative grid columns ───────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cream-100/15 to-transparent" />
        <div className="absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cream-100/15 to-transparent" />
      </div>

      {/* ─── Top meta strip ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute left-5 right-5 top-[80px] z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-cream-100/70 sm:left-6 sm:right-6 sm:top-[88px] lg:left-12 lg:right-12"
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="text-cream-50/45">◌</span>
          {t('eyebrow')}
        </span>
        <span className="hidden items-center gap-3 md:inline-flex">
          <DestinationClock />
          <span aria-hidden className="text-cream-50/30">/</span>
          <span>No. 001 — Spring/Summer</span>
        </span>
      </motion.div>

      {/* ─── Main content ──────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-36 pt-[16vh] sm:px-6 sm:pb-32 md:pt-[14vh] lg:px-12">
        <motion.div
          ref={headlineRef}
          style={{
            y: textY,
            opacity: fade,
            x: reduceMotion ? 0 : headlineX,
          }}
          className="grid grid-cols-12 gap-4 sm:gap-6"
        >
          <div className="col-span-12 md:col-span-11">
            <motion.div style={{ y: reduceMotion ? 0 : headlineY }}>
              <h1 className="display-xl text-[clamp(2.75rem,11vw,10rem)] text-cream-50 [text-shadow:0_2px_24px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.45)]">
                <span className="block overflow-hidden">
                  <SplitDisplay text={t('h1Top')} delay={0.1} />
                </span>
                <span className="relative block overflow-hidden pl-[6%] text-terracotta-100 italic md:pl-[8%]">
                  <SplitDisplay text={t('h1Mid')} delay={0.3} />
                  {/* Hairline that draws under the italic word for editorial grip */}
                  <motion.span
                    aria-hidden
                    className="absolute bottom-[14%] left-[6%] right-0 hidden h-px origin-left bg-cream-50/35 md:block"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 0.42 }}
                    transition={{ duration: 1.2, delay: 1.1, ease }}
                  />
                </span>
                <span className="block overflow-hidden">
                  <SplitDisplay text={t('h1Bottom')} delay={0.5} />
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.div>

        {/* Lede + stats + CTAs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-12 gap-6 sm:mt-12 md:mt-16"
        >
          {/* Lede */}
          <motion.div
            variants={item}
            className="col-span-12 md:col-span-5 md:col-start-2"
          >
            <p className="max-w-md text-[15px] leading-relaxed text-cream-50/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] sm:text-base md:text-lg">
              {t('lede')}
            </p>

            {/* Stat strip — animated count-up */}
            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3 sm:mt-8 sm:gap-x-6"
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-baseline gap-2 border-l border-cream-50/20 pl-3 first:border-l-0 first:pl-0 sm:pl-4"
                  style={i === 0 ? {} : undefined}
                >
                  <span className="font-display text-[1.75rem] font-light leading-none text-cream-50 sm:text-3xl md:text-4xl">
                    <CountUp to={s.value} delay={1.2 + i * 0.1} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-50/65">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTAs — magnetic */}
          <motion.div
            variants={item}
            className="col-span-12 flex flex-wrap items-end gap-3 md:col-span-5 md:col-start-8"
          >
            <MagneticWrap strength={0.25} className="w-full sm:w-auto">
              <Link
                href="/listings"
                className="group inline-flex w-full items-center justify-between gap-2 rounded-full bg-cream-50 px-6 py-3.5 text-sm font-medium text-ink shadow-[0_10px_40px_-10px_rgba(0,0,0,0.45)] transition-all duration-500 hover:bg-terracotta-500 hover:text-cream-50 sm:w-auto sm:justify-center sm:px-7 sm:py-4"
              >
                <span>{t('ctaPrimary')}</span>
                <span className="relative inline-block h-4 w-4 overflow-hidden">
                  <ArrowUpRight
                    size={16}
                    className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-4 group-hover:translate-x-4"
                    strokeWidth={1.5}
                  />
                  <ArrowUpRight
                    size={16}
                    className="absolute inset-0 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
                    strokeWidth={1.5}
                  />
                </span>
              </Link>
            </MagneticWrap>
            <MagneticWrap strength={0.18} className="w-full sm:w-auto">
              <Link
                href="/#how"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream-50/40 bg-cream-50/[0.06] px-6 py-3.5 text-sm font-medium text-cream-50 backdrop-blur-md transition-all duration-500 hover:bg-cream-50 hover:text-ink sm:w-auto sm:px-7 sm:py-4"
              >
                {t('ctaSecondary')}
              </Link>
            </MagneticWrap>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Plate caption (bottom-left) ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.4 }}
        className="absolute bottom-[7rem] left-6 z-10 hidden flex-col gap-1 text-cream-50/85 md:flex md:bottom-[8.5rem] lg:left-12"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-50/55">
          ◌ Plate 01 — In motion
        </span>
        <span className="font-display text-base italic">
          Cartagena <span className="opacity-50">→</span> Medellín
        </span>
      </motion.div>

      {/* ─── Video controls (bottom-right) ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.6 }}
        className="absolute bottom-6 right-5 z-10 flex items-center gap-2 sm:right-6 md:bottom-[8.5rem] lg:right-12"
      >
        <button
          onClick={togglePlay}
          aria-label={paused ? 'Play hero video' : 'Pause hero video'}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/30 bg-cream-50/[0.08] text-cream-50 backdrop-blur-md transition-all duration-500 hover:bg-cream-50 hover:text-ink"
        >
          {paused ? (
            <Play size={14} strokeWidth={1.5} className="ml-0.5" />
          ) : (
            <Pause size={14} strokeWidth={1.5} />
          )}
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute hero video' : 'Mute hero video'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/30 bg-cream-50/[0.08] text-cream-50 backdrop-blur-md transition-all duration-500 hover:bg-cream-50 hover:text-ink"
        >
          {muted ? (
            <VolumeX size={14} strokeWidth={1.5} />
          ) : (
            <Volume2 size={14} strokeWidth={1.5} />
          )}
        </button>
      </motion.div>

      {/* ─── Scroll indicator (bottom-center) ──────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-[8.5rem] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-cream-50/70 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
          {t('scrollHint')}
        </span>
        <motion.svg
          width="1"
          height="34"
          viewBox="0 0 1 34"
          aria-hidden
        >
          <motion.line
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="34"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 2, ease }}
          />
        </motion.svg>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} strokeWidth={1.25} />
        </motion.div>
      </motion.div>

      {/* ─── Bottom marquee — infinite editorial place names ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-16 z-10 hidden overflow-hidden md:block"
        aria-hidden
      >
        <div className="flex w-max animate-marquee gap-12 px-12">
          {[...PLACES, ...PLACES, ...PLACES].map((place, i) => (
            <span
              key={`${place}-${i}`}
              className="flex items-center gap-12 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-50/40"
            >
              <span>{place}</span>
              <span aria-hidden className="text-cream-50/25">◌</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
