'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ImagePlus, Sparkles } from 'lucide-react';
import { Link, useRouter } from '@/lib/i18n/routing';
import { useAuth } from '@/lib/hooks/useAuth';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { pickLocale } from '@/lib/utils/i18n-pick';
import { cn } from '@/lib/utils/cn';
import {
  AMENITIES_CATALOG,
  PROPERTY_TYPES,
  newPropertySchema,
  type NewPropertyInput,
} from '@/lib/schemas/property';
import { createOwnerProperty } from '@/lib/firebase/owner';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'COP', 'BRL', 'MXN', 'ARS'];

export function NewListingClient() {
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewPropertyInput>({
    resolver: zodResolver(newPropertySchema),
    defaultValues: {
      title: '',
      tagline: '',
      description: '',
      type: 'villa',
      city: '',
      region: '',
      country: '',
      countryCode: '',
      pricePerNight: 250,
      currency: 'EUR',
      cleaningFee: 80,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: [],
      coverImageUrl: '',
      coverImageAlt: '',
    },
  });

  const amenities = watch('amenities');
  const coverUrl = watch('coverImageUrl');
  useEffect(() => {
    setCoverPreview(coverUrl || '');
  }, [coverUrl]);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/auth/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <LuxuryLoader
        visible
        title={pickLocale(locale, {
          en: 'Preparing your atelier',
          es: 'Preparando tu atelier',
          fr: 'Préparation de votre atelier',
        })}
      />
    );
  }

  const toggleAmenity = (key: string) => {
    const next = amenities.includes(key)
      ? amenities.filter((a) => a !== key)
      : [...amenities, key];
    setValue('amenities', next, { shouldValidate: false });
  };

  const onValid = async (values: NewPropertyInput) => {
    setSubmitting(true);
    try {
      const { id } = await createOwnerProperty({
        ownerId: user.uid,
        ownerEmail: user.email ?? '',
        ownerName: user.displayName ?? values.city,
        title: values.title,
        tagline: values.tagline,
        description: values.description,
        type: values.type,
        city: values.city,
        region: values.region,
        country: values.country,
        countryCode: values.countryCode,
        pricePerNight: Number(values.pricePerNight),
        currency: values.currency,
        cleaningFee: Number(values.cleaningFee),
        maxGuests: Number(values.maxGuests),
        bedrooms: Number(values.bedrooms),
        beds: Number(values.beds),
        bathrooms: Number(values.bathrooms),
        amenities: values.amenities.map((k) => {
          const def = AMENITIES_CATALOG.find((a) => a.key === k);
          return { key: k, label: def?.label ?? k };
        }),
        coverImageUrl: values.coverImageUrl,
        coverImageAlt: values.coverImageAlt ?? values.title,
      });
      toast.success(
        pickLocale(locale, {
          en: 'Residence published',
          es: 'Residencia publicada',
          fr: 'Résidence publiée',
        }),
        {
          description: pickLocale(locale, {
            en: 'Your listing is live in the register.',
            es: 'Tu publicación ya está en el registro.',
            fr: 'Votre annonce est en ligne dans le registre.',
          }),
        }
      );
      router.push(`/properties/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(
        pickLocale(locale, {
          en: "Couldn't publish",
          es: 'No pudimos publicar',
          fr: 'Publication impossible',
        }),
        {
          description:
            err instanceof Error ? err.message : 'An unexpected error occurred.',
        }
      );
      setSubmitting(false);
    }
  };

  const onInvalid = () => {
    toast.error(
      pickLocale(locale, {
        en: 'A few details are missing',
        es: 'Faltan algunos datos',
        fr: 'Quelques informations manquent',
      }),
      {
        description: pickLocale(locale, {
          en: 'Please review the highlighted fields.',
          es: 'Revisa los campos resaltados.',
          fr: 'Vérifiez les champs en surbrillance.',
        }),
      }
    );
  };

  return (
    <>
      <LuxuryLoader
        visible={submitting}
        title={pickLocale(locale, {
          en: 'Publishing your residence',
          es: 'Publicando tu residencia',
          fr: 'Publication de votre résidence',
        })}
        subtitle={pickLocale(locale, {
          en: 'Adding it to the register...',
          es: 'Agregándola al registro...',
          fr: 'Ajout au registre...',
        })}
      />
      <div className="relative">
        {/* Atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 30% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)',
          }}
        />

        <section className="relative mx-auto max-w-[1280px] px-6 lg:px-12 py-12 lg:py-20">
          <Reveal>
            <Link
              href="/owner"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] mb-8 transition-opacity hover:opacity-100 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              {pickLocale(locale, {
                en: 'Back to atelier',
                es: 'Volver al atelier',
                fr: "Retour à l'atelier",
              })}
            </Link>
            <p className="eyebrow mb-3">◌ {pickLocale(locale, {
              en: 'New residence',
              es: 'Nueva residencia',
              fr: 'Nouvelle résidence',
            })}</p>
            <h1
              className="display-lg text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] max-w-[18ch]"
              style={{ color: 'var(--foreground)' }}
            >
              {pickLocale(locale, {
                en: 'A quiet place, well-framed.',
                es: 'Un lugar tranquilo, bien presentado.',
                fr: 'Un lieu paisible, bien mis en valeur.',
              })}
            </h1>
          </Reveal>

          <form
            onSubmit={handleSubmit(onValid, onInvalid)}
            className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-16"
          >
            {/* ─── Section 01: Essence ─────────────── */}
            <FormSection
              number="01"
              title={pickLocale(locale, {
                en: 'The essence',
                es: 'La esencia',
                fr: "L'essence",
              })}
              hint={pickLocale(locale, {
                en: 'Name it, frame it, describe it.',
                es: 'Nómbrala, enmárcala, descríbela.',
                fr: 'Nommer, cadrer, décrire.',
              })}
            >
              <Stagger eager className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <StaggerItem className="md:col-span-2">
                  <Field label={pickLocale(locale, {
                    en: 'Title',
                    es: 'Título',
                    fr: 'Titre',
                  })} error={errors.title?.message}>
                    <input
                      type="text"
                      placeholder="e.g. Casa di Tramonto"
                      {...register('title')}
                      className="field-input"
                    />
                  </Field>
                </StaggerItem>
                <StaggerItem className="md:col-span-2">
                  <Field label={pickLocale(locale, {
                    en: 'Tagline',
                    es: 'Lema',
                    fr: 'Accroche',
                  })} error={errors.tagline?.message}>
                    <input
                      type="text"
                      placeholder="A whitewashed trullo above an olive grove."
                      {...register('tagline')}
                      className="field-input"
                    />
                  </Field>
                </StaggerItem>
                <StaggerItem className="md:col-span-2">
                  <Field label={pickLocale(locale, {
                    en: 'Description',
                    es: 'Descripción',
                    fr: 'Description',
                  })} error={errors.description?.message}>
                    <textarea
                      rows={5}
                      placeholder="Six conical roofs, two private terraces, and the kind of silence you only find in the heel of Italy..."
                      {...register('description')}
                      className="field-input resize-none"
                    />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label={pickLocale(locale, {
                    en: 'Type',
                    es: 'Tipo',
                    fr: 'Type',
                  })} error={errors.type?.message}>
                    <select
                      {...register('type')}
                      className="field-input pr-8 appearance-none"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </Field>
                </StaggerItem>
              </Stagger>
            </FormSection>

            {/* ─── Section 02: Location ─────────────── */}
            <FormSection
              number="02"
              title={pickLocale(locale, {
                en: 'Where it stands',
                es: 'Dónde se encuentra',
                fr: 'Où elle se trouve',
              })}
              hint={pickLocale(locale, {
                en: 'City, region, country.',
                es: 'Ciudad, región, país.',
                fr: 'Ville, région, pays.',
              })}
            >
              <Stagger eager className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <StaggerItem>
                  <Field label="City" error={errors.city?.message}>
                    <input type="text" placeholder="Ostuni" {...register('city')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Region / state" error={errors.region?.message}>
                    <input type="text" placeholder="Puglia" {...register('region')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Country" error={errors.country?.message}>
                    <input type="text" placeholder="Italy" {...register('country')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Country code (ISO)" error={errors.countryCode?.message}>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="IT"
                      {...register('countryCode')}
                      className="field-input uppercase tracking-[0.2em]"
                    />
                  </Field>
                </StaggerItem>
              </Stagger>
            </FormSection>

            {/* ─── Section 03: Capacity ─────────────── */}
            <FormSection
              number="03"
              title={pickLocale(locale, {
                en: 'Who fits inside',
                es: 'Quién cabe',
                fr: 'Qui peut y séjourner',
              })}
              hint={pickLocale(locale, {
                en: 'Beds, bedrooms, bathrooms, max guests.',
                es: 'Camas, habitaciones, baños, capacidad.',
                fr: 'Lits, chambres, salles de bain, capacité.',
              })}
            >
              <Stagger eager className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
                <StaggerItem>
                  <Field label="Max guests" error={errors.maxGuests?.message}>
                    <input type="number" min={1} max={20} {...register('maxGuests')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Bedrooms" error={errors.bedrooms?.message}>
                    <input type="number" min={0} max={20} {...register('bedrooms')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Beds" error={errors.beds?.message}>
                    <input type="number" min={1} max={40} {...register('beds')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Bathrooms" error={errors.bathrooms?.message}>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step="0.5"
                      {...register('bathrooms')}
                      className="field-input"
                    />
                  </Field>
                </StaggerItem>
              </Stagger>
            </FormSection>

            {/* ─── Section 04: Pricing ─────────────── */}
            <FormSection
              number="04"
              title={pickLocale(locale, {
                en: 'The pricing',
                es: 'El precio',
                fr: 'Le tarif',
              })}
              hint={pickLocale(locale, {
                en: 'Base nightly rate, cleaning fee, currency.',
                es: 'Tarifa por noche, limpieza, moneda.',
                fr: 'Tarif par nuit, ménage, devise.',
              })}
            >
              <Stagger eager className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                <StaggerItem>
                  <Field label="Price per night" error={errors.pricePerNight?.message}>
                    <input type="number" min={1} {...register('pricePerNight')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Cleaning fee" error={errors.cleaningFee?.message}>
                    <input type="number" min={0} {...register('cleaningFee')} className="field-input" />
                  </Field>
                </StaggerItem>
                <StaggerItem>
                  <Field label="Currency" error={errors.currency?.message}>
                    <select
                      {...register('currency')}
                      className="field-input pr-8 appearance-none"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                </StaggerItem>
              </Stagger>
            </FormSection>

            {/* ─── Section 05: Amenities ─────────────── */}
            <FormSection
              number="05"
              title={pickLocale(locale, {
                en: 'What it offers',
                es: 'Qué ofrece',
                fr: 'Ce qu’elle propose',
              })}
              hint={pickLocale(locale, {
                en: 'Tap each amenity that applies.',
                es: 'Marca lo que aplique.',
                fr: "Sélectionnez ce qui s'applique.",
              })}
            >
              <div className="flex flex-wrap gap-2">
                {AMENITIES_CATALOG.map((a) => {
                  const active = amenities.includes(a.key);
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => toggleAmenity(a.key)}
                      className={cn(
                        'rounded-full px-4 py-2 text-xs tracking-wide transition-all border'
                      )}
                      style={{
                        background: active ? 'var(--foreground)' : 'transparent',
                        color: active ? 'var(--surface)' : 'var(--foreground)',
                        borderColor: active
                          ? 'var(--foreground)'
                          : 'var(--line-strong)',
                      }}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </FormSection>

            {/* ─── Section 06: Photos ─────────────── */}
            <FormSection
              number="06"
              title={pickLocale(locale, {
                en: 'A cover image',
                es: 'Una foto de portada',
                fr: 'Une image de couverture',
              })}
              hint={pickLocale(locale, {
                en: 'Paste a high-resolution URL. Storage upload coming next.',
                es: 'Pega una URL en alta resolución. Próximamente subida directa.',
                fr: 'Collez une URL haute résolution. Téléversement direct à venir.',
              })}
            >
              <Stagger eager className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <StaggerItem>
                  <Field label="Cover image URL" error={errors.coverImageUrl?.message}>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      {...register('coverImageUrl')}
                      className="field-input"
                    />
                  </Field>
                  <div className="mt-4">
                    <Field label="Alt text (optional)">
                      <input
                        type="text"
                        placeholder="Sunset over the trullo"
                        {...register('coverImageAlt')}
                        className="field-input"
                      />
                    </Field>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
                    style={{
                      background: 'var(--surface-3)',
                      border: '1px dashed var(--line-strong)',
                    }}
                  >
                    {coverPreview ? (
                      <motion.img
                        key={coverPreview}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={coverPreview}
                        alt="cover preview"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-8">
                        <ImagePlus size={22} strokeWidth={1.5} style={{ color: 'var(--foreground-muted)' }} />
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--foreground-muted)' }}>
                          {pickLocale(locale, {
                            en: 'Cover preview',
                            es: 'Vista previa',
                            fr: 'Aperçu',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              </Stagger>
            </FormSection>

            {/* Submit row */}
            <div className="lg:col-span-12 flex items-center justify-between flex-wrap gap-6 pt-4">
              <p className="text-[12px] max-w-md" style={{ color: 'color-mix(in srgb, var(--foreground) 65%, transparent)' }}>
                <Sparkles size={12} strokeWidth={1.5} className="inline -mt-0.5 mr-1.5" style={{ color: 'var(--accent)' }} />
                {pickLocale(locale, {
                  en: 'Your residence will be live the moment you publish — review the details first.',
                  es: 'Tu residencia se publicará al instante. Revisa los detalles antes.',
                  fr: 'Votre résidence sera en ligne dès la publication — vérifiez les détails.',
                })}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                style={{
                  background: 'var(--foreground)',
                  color: 'var(--surface)',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                {pickLocale(locale, {
                  en: 'Publish residence',
                  es: 'Publicar residencia',
                  fr: 'Publier la résidence',
                })}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </button>
            </div>
          </form>
        </section>
      </div>
      <style jsx>{`
        :global(.field-input) {
          width: 100%;
          background: transparent;
          color: var(--foreground);
          border: none;
          border-bottom: 1px solid var(--line);
          padding: 12px 0;
          font-size: 1rem;
          line-height: 1.4;
          transition: border-color 0.3s ease;
        }
        :global(.field-input::placeholder) {
          color: color-mix(in srgb, var(--foreground) 35%, transparent);
        }
        :global(.field-input:focus) {
          outline: none;
          border-bottom-color: var(--foreground);
        }
        :global(.field-input[aria-invalid="true"]) {
          border-bottom-color: var(--accent);
        }
      `}</style>
    </>
  );
}

/* ────────── Helpers ────────── */
function FormSection({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3"
          style={{ color: 'color-mix(in srgb, var(--foreground) 50%, transparent)' }}
        >
          ◌ Step {number}
        </p>
        <h2
          className="display-md text-[clamp(1.5rem,3vw,2.25rem)] leading-tight"
          style={{ color: 'var(--foreground)' }}
        >
          {title}
        </h2>
        <p
          className="mt-3 text-[13px] max-w-xs"
          style={{ color: 'color-mix(in srgb, var(--foreground) 60%, transparent)' }}
        >
          {hint}
        </p>
      </div>
      <div className="lg:col-span-8">{children}</div>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2"
        style={{ color: 'color-mix(in srgb, var(--foreground) 55%, transparent)' }}
      >
        {label}
      </p>
      {children}
      {error && (
        <p
          className="mt-1.5 text-[11px]"
          style={{ color: 'var(--accent)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
