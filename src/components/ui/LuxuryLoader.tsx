'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Compass, KeyRound, Leaf, MapPin, Sparkles, Wind } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';

const TIPS_BY_LOCALE = {
  en: [
    {
      icon: KeyRound,
      tip: 'You only pay the platform reservation fee online — the rest is settled with the host before the keys are handed over.',
      source: 'Housely policy',
    },
    {
      icon: Sparkles,
      tip: 'Every residence in the register is photographed twice: once for the listing and once for arrival. We compare both to keep things honest.',
      source: 'Editorial standards',
    },
    {
      icon: MapPin,
      tip: 'The shortest distance from a Housely residence to a swimmable coastline is 12 metres — Maison du Cassis, Provence.',
      source: 'Register · No. 027',
    },
    {
      icon: Wind,
      tip: 'Slow travel: a 4-night minimum stay reduces your cleaning footprint by 60% per night compared to weekend trips.',
      source: 'Atmos Index, 2025',
    },
    {
      icon: Leaf,
      tip: 'Thirty-eight residences are now fully off-grid. Solar, well-water, and a wood stove for the truly quiet weeks.',
      source: 'Housely register',
    },
    {
      icon: Compass,
      tip: 'Your host\'s preferred contact hours are revealed alongside their phone number — call within their window for the warmest welcome.',
      source: 'Concierge note',
    },
    {
      icon: Sparkles,
      tip: 'The most-loved residence this season has been booked four weekends in a row, by four different couples, all returning guests.',
      source: 'Reservations data',
    },
    {
      icon: KeyRound,
      tip: 'Cash, transfer, or card — the balance at the property is always the host\'s call, not the platform\'s.',
      source: 'Payment policy',
    },
  ],
  es: [
    {
      icon: KeyRound,
      tip: 'Solo pagas la tarifa de reserva en línea — el resto se liquida con el anfitrión antes de la entrega de llaves.',
      source: 'Política Housely',
    },
    {
      icon: Sparkles,
      tip: 'Cada residencia se fotografía dos veces: una para el listado y otra a la llegada. Comparamos ambas para mantenernos honestos.',
      source: 'Estándares editoriales',
    },
    {
      icon: MapPin,
      tip: 'La distancia más corta desde una residencia Housely al mar es de 12 metros — Maison du Cassis, Provenza.',
      source: 'Registro · N.º 027',
    },
    {
      icon: Wind,
      tip: 'Viaje pausado: una estancia mínima de 4 noches reduce un 60% la huella de limpieza por noche frente a un fin de semana.',
      source: 'Atmos Index, 2025',
    },
    {
      icon: Leaf,
      tip: 'Treinta y ocho residencias son completamente off-grid. Solar, agua de pozo y estufa de leña para las semanas más silenciosas.',
      source: 'Registro Housely',
    },
    {
      icon: Compass,
      tip: 'Las horas de contacto preferidas del anfitrión se revelan junto a su teléfono — llama dentro de su ventana para una bienvenida cálida.',
      source: 'Nota de concierge',
    },
    {
      icon: Sparkles,
      tip: 'La residencia más amada de la temporada se ha reservado cuatro fines de semana seguidos, por cuatro parejas distintas — todas habituales.',
      source: 'Datos de reservas',
    },
    {
      icon: KeyRound,
      tip: 'Efectivo, transferencia o tarjeta — el saldo en la propiedad siempre lo decide el anfitrión, no la plataforma.',
      source: 'Política de pago',
    },
  ],
  fr: [
    {
      icon: KeyRound,
      tip: 'Vous ne payez que les frais de réservation en ligne — le reste se règle avec l\'hôte avant la remise des clés.',
      source: 'Politique Housely',
    },
    {
      icon: Sparkles,
      tip: 'Chaque résidence est photographiée deux fois : une fois pour l\'annonce, une fois à l\'arrivée. Nous comparons les deux pour rester honnêtes.',
      source: 'Standards éditoriaux',
    },
    {
      icon: MapPin,
      tip: 'La plus courte distance entre une résidence Housely et la mer est de 12 mètres — Maison du Cassis, Provence.',
      source: 'Registre · N° 027',
    },
    {
      icon: Wind,
      tip: 'Voyage lent : un séjour minimum de 4 nuits réduit de 60 % l\'empreinte du ménage par nuit, par rapport à un week-end.',
      source: 'Atmos Index, 2025',
    },
    {
      icon: Leaf,
      tip: 'Trente-huit résidences sont entièrement hors-réseau. Solaire, eau de puits et poêle à bois pour les semaines les plus silencieuses.',
      source: 'Registre Housely',
    },
    {
      icon: Compass,
      tip: 'Les meilleures heures de contact de l\'hôte sont révélées avec son numéro — appelez dans cette fenêtre pour un accueil chaleureux.',
      source: 'Note du concierge',
    },
    {
      icon: Sparkles,
      tip: 'La résidence la plus aimée de la saison a été réservée quatre week-ends d\'affilée, par quatre couples différents — tous fidèles.',
      source: 'Données de réservation',
    },
    {
      icon: KeyRound,
      tip: 'Espèces, virement ou carte — le solde sur place est toujours à la discrétion de l\'hôte, pas de la plateforme.',
      source: 'Politique de paiement',
    },
  ],
} as const;

interface Props {
  visible: boolean;
  title?: string;
  subtitle?: string;
  reference?: string;
}

const STAGES = [
  { target: 18, delay: 200 },
  { target: 38, delay: 900 },
  { target: 58, delay: 1900 },
  { target: 75, delay: 3200 },
  { target: 88, delay: 5000 },
  { target: 95, delay: 7000 },
];

export function LuxuryLoader({
  visible,
  title,
  subtitle,
  reference,
}: Props) {
  const locale = useLocale() as AppLocale;
  const tips = TIPS_BY_LOCALE[locale] ?? TIPS_BY_LOCALE.en;

  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setTipIndex(0);
      setProgress(0);
      return;
    }
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 4200);
    return () => clearInterval(id);
  }, [visible, tips.length]);

  useEffect(() => {
    if (!visible) return;
    setProgress(6);
    const timers = STAGES.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  const tip = tips[tipIndex];

  const headingDefaults: Record<AppLocale, string> = {
    en: 'Securing your reservation',
    es: 'Asegurando tu reserva',
    fr: 'Sécurisation de votre réservation',
  };
  const subDefaults: Record<AppLocale, string> = {
    en: 'Confirming availability and notifying your host...',
    es: 'Confirmando disponibilidad y notificando al anfitrión...',
    fr: 'Confirmation de la disponibilité et notification de l\'hôte...',
  };
  const inProgressLabel: Record<AppLocale, string> = {
    en: 'In progress',
    es: 'En curso',
    fr: 'En cours',
  };
  const verifyingLabel: Record<AppLocale, string> = {
    en: '● Verifying',
    es: '● Verificando',
    fr: '● Vérification',
  };
  const whileYouWaitLabel: Record<AppLocale, string> = {
    en: '◌ While you wait',
    es: '◌ Mientras esperas',
    fr: '◌ Pendant que vous patientez',
  };
  const refLabel: Record<AppLocale, string> = {
    en: 'Ref.',
    es: 'Ref.',
    fr: 'Réf.',
  };

  const heading = title ?? headingDefaults[locale] ?? headingDefaults.en;
  const sub = subtitle ?? subDefaults[locale] ?? subDefaults.en;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="luxury-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ pointerEvents: 'all' }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[#100A05]/97 backdrop-blur-2xl"
          />

          {/* Atmospheric glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[10%] top-[12%] h-[420px] w-[420px] rounded-full bg-terracotta-500/20 blur-[140px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[8%] bottom-[14%] h-[360px] w-[360px] rounded-full bg-gold-500/12 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-noise opacity-[0.07] mix-blend-soft-light"
          />

          {/* Content */}
          <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-10 px-6">
            {/* Brand-glyph spinner */}
            <div className="relative h-32 w-32">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border border-cream-100/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-3 rounded-full border border-dashed border-cream-100/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-6 rounded-full border-2 border-terracotta-500/80 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full bg-terracotta-500/14"
                animate={{ scale: [1, 1.32, 1], opacity: [0.45, 0, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Tick marks at compass points */}
              {[0, 90, 180, 270].map((deg) => (
                <span
                  key={deg}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 origin-center bg-cream-100/35"
                  style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-60px)` }}
                />
              ))}
              {/* Center serif H */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="font-display text-[2.75rem] leading-none text-cream-100 italic">
                  H
                </span>
              </motion.div>
            </div>

            {/* Status copy */}
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream-100/40 mb-3">
                ◌ Housely · {inProgressLabel[locale] ?? inProgressLabel.en}
              </p>
              <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-tight text-cream-100">
                {heading}
              </h3>
              <p className="mt-3 max-w-md mx-auto text-sm text-cream-100/55 leading-relaxed">
                {sub}
              </p>
              {reference && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta-100/80">
                  ◌ {refLabel[locale] ?? refLabel.en} {reference}
                </p>
              )}
            </div>

            {/* Progress hairline */}
            <div className="w-full max-w-sm">
              <div className="relative h-px w-full bg-cream-100/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-terracotta-500 via-gold-500 to-cream-100"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-cream-100/35">
                <span>{verifyingLabel[locale] ?? verifyingLabel.en}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
            </div>

            {/* Rotating tip card */}
            <div className="w-full overflow-hidden rounded-2xl border border-cream-100/10 bg-cream-100/[0.035] px-6 py-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={11} className="text-gold-500" strokeWidth={1.6} />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500">
                  {whileYouWaitLabel[locale] ?? whileYouWaitLabel.en}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tipIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta-500/15 text-terracotta-100">
                    <tip.icon size={15} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[15px] font-light leading-relaxed text-cream-100/90 italic">
                      “{tip.tip}”
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-100/35">
                      — {tip.source}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tip pagination ticks */}
            <div className="flex items-center gap-1.5">
              {tips.map((_, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  animate={{
                    width: i === tipIndex ? 22 : 6,
                    backgroundColor:
                      i === tipIndex
                        ? 'rgba(245, 239, 230, 0.85)'
                        : 'rgba(245, 239, 230, 0.18)',
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
