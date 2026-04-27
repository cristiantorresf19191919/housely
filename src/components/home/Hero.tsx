'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { SplitDisplay } from '@/components/motion/Reveal';

const VIDEO_SRC = '/videos/cartagena-medellin.mp4';
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const [videoReady, setVideoReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Catch the case where the video already loaded before React attached
    // the onLoadedData handler (common with cached / fast networks).
    if (v.readyState >= 2) setVideoReady(true);
    if (reduceMotion) {
      v.pause();
      setPaused(true);
    }
  }, [reduceMotion]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* Video layer */}
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
          preload="metadata"
          aria-label="Aerial footage of Cartagena and Medellín, Colombia"
          onLoadedData={() => setVideoReady(true)}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        />
        {/* Smooth fade-in once metadata is ready so we don't flash a black frame */}
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: videoReady ? 0 : 1 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-0 bg-ink"
        />
      </motion.div>

      {/* Atmospheric overlays — kept light so the footage breathes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-transparent"
      />
      {/* Strategic darkening behind text only (upper-left) for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_45%,rgba(31,22,17,0.45),transparent_70%)]"
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

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cream-100/15 to-transparent" />
        <div className="absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cream-100/15 to-transparent" />
      </div>

      {/* Top meta bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-[88px] left-6 right-6 lg:left-12 lg:right-12 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-cream-100/70 z-10"
      >
        <span>◌ {t('eyebrow')}</span>
        <span className="hidden md:inline">No. 001 — Spring/Summer · Cartagena · Medellín</span>
      </motion.div>

      {/* Headline + lede */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 pt-[18vh] md:pt-[14vh] pb-32">
        <motion.div
          style={{ y: textY, opacity: fade }}
          className="grid grid-cols-12 gap-6"
        >
          <div className="col-span-12 md:col-span-11">
            <h1 className="display-xl text-[clamp(3.25rem,10vw,10rem)] text-cream-50 drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
              <span className="block overflow-hidden">
                <SplitDisplay text={t('h1Top')} delay={0.1} />
              </span>
              <span className="block pl-[8%] italic overflow-hidden text-terracotta-100">
                <SplitDisplay text={t('h1Mid')} delay={0.3} />
              </span>
              <span className="block overflow-hidden">
                <SplitDisplay text={t('h1Bottom')} delay={0.5} />
              </span>
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease }}
          className="mt-16 grid grid-cols-12 gap-6"
        >
          <div className="col-span-12 md:col-span-5 md:col-start-2">
            <p className="text-lg leading-relaxed text-cream-50/90 max-w-md backdrop-blur-[2px]">
              {t('lede')}
            </p>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-wrap items-end gap-3">
            <Link
              href="/listings"
              className="group inline-flex items-center gap-2 rounded-full bg-cream-50 px-7 py-4 text-sm font-medium text-ink transition-all hover:bg-terracotta-500 hover:text-cream-50 hover:-translate-y-0.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.45)]"
            >
              {t('ctaPrimary')}
              <ArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center gap-2 rounded-full border border-cream-50/40 bg-cream-50/[0.06] backdrop-blur-md px-7 py-4 text-sm font-medium text-cream-50 transition-all hover:bg-cream-50 hover:text-ink"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Plate caption (bottom-left) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.4 }}
        className="absolute bottom-44 left-6 lg:left-12 z-10 hidden md:flex flex-col gap-1 text-cream-50/80"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-50/55">
          ◌ Plate 01 — In motion
        </span>
        <span className="font-display italic text-base">Cartagena → Medellín</span>
      </motion.div>

      {/* Video controls (bottom-right) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.6 }}
        className="absolute bottom-44 right-6 lg:right-12 z-10 flex items-center gap-2"
      >
        <button
          onClick={togglePlay}
          aria-label={paused ? 'Play hero video' : 'Pause hero video'}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/30 bg-cream-50/[0.08] text-cream-50 backdrop-blur-md transition-all hover:bg-cream-50 hover:text-ink"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/30 bg-cream-50/[0.08] text-cream-50 backdrop-blur-md transition-all hover:bg-cream-50 hover:text-ink"
        >
          {muted ? (
            <VolumeX size={14} strokeWidth={1.5} />
          ) : (
            <Volume2 size={14} strokeWidth={1.5} />
          )}
        </button>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-44 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream-50/70 hidden lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
          {t('scrollHint')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
