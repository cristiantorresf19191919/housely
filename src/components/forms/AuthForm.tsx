'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { useRouter, Link } from '@/lib/i18n/routing';
import { Input } from '@/components/ui/Input';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { register as fbRegister, signIn } from '@/lib/firebase/auth';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { pickLocale } from '@/lib/utils/i18n-pick';
import type { Locale } from '@/types';

interface Props {
  mode: 'signin' | 'register';
}

interface FormValues {
  email: string;
  password: string;
  fullName?: string;
}

export function AuthForm({ mode }: Props) {
  const t = useTranslations('auth');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'register') {
        await fbRegister({
          email: values.email,
          password: values.password,
          fullName: values.fullName ?? '',
          preferredLanguage: locale,
        });
        toast.success(
          pickLocale(locale, {
            en: 'Account opened',
            es: 'Cuenta creada',
            fr: 'Compte ouvert',
          }),
          {
            description: pickLocale(locale, {
              en: 'Welcome to Housely.',
              es: 'Bienvenido a Housely.',
              fr: 'Bienvenue chez Housely.',
            }),
          }
        );
      } else {
        await signIn(values.email, values.password);
        toast.success(
          pickLocale(locale, {
            en: 'Signed in',
            es: 'Sesión iniciada',
            fr: 'Connexion réussie',
          }),
          {
            description: pickLocale(locale, {
              en: 'Taking you to your account.',
              es: 'Te llevamos a tu cuenta.',
              fr: 'Direction votre compte.',
            }),
          }
        );
      }
      router.push('/account');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.';
      setError(msg);
      toast.error(
        mode === 'register'
          ? pickLocale(locale, {
              en: "Couldn't open the account",
              es: 'No pudimos crear la cuenta',
              fr: "Impossible d'ouvrir le compte",
            })
          : pickLocale(locale, {
              en: "Couldn't sign you in",
              es: 'No pudimos iniciar sesión',
              fr: 'Connexion impossible',
            }),
        { description: msg }
      );
      setSubmitting(false);
    }
  });

  return (
    <>
    <LuxuryLoader
      visible={submitting}
      title={
        mode === 'register'
          ? pickLocale(locale, {
              en: 'Opening your account',
              es: 'Abriendo tu cuenta',
              fr: 'Ouverture de votre compte',
            })
          : pickLocale(locale, {
              en: 'Signing you in',
              es: 'Iniciando sesión',
              fr: 'Connexion en cours',
            })
      }
      subtitle={pickLocale(locale, {
        en: 'Connecting to the Housely register...',
        es: 'Conectando con el registro de Housely...',
        fr: 'Connexion au registre Housely...',
      })}
    />
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-72px)]"
    >
      {/* Left: visual */}
      <div className="relative hidden lg:block bg-ink overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-soft-light"
        />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-terracotta-500/30 blur-3xl"
        />
        <div className="relative h-full flex flex-col justify-between px-12 py-16 text-cream-100">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-100/60">
            ◌ Housely ·{' '}
            {mode === 'signin'
              ? pickLocale(locale, {
                  en: 'Welcome back',
                  es: 'Bienvenido de nuevo',
                  fr: 'Bon retour',
                })
              : pickLocale(locale, {
                  en: 'New account',
                  es: 'Cuenta nueva',
                  fr: 'Nouveau compte',
                })}
          </span>
          <h2 className="display-lg text-[clamp(3rem,5vw,5rem)] text-cream-100 leading-[0.95]">
            {mode === 'signin'
              ? pickLocale(locale, {
                  en: 'A quiet place to keep your reservations.',
                  es: 'Un lugar tranquilo para guardar tus reservas.',
                  fr: 'Un endroit tranquille pour vos réservations.',
                })
              : pickLocale(locale, {
                  en: 'Begin your register of slow stays.',
                  es: 'Comienza tu registro de estadías pausadas.',
                  fr: 'Commencez votre registre de séjours lents.',
                })}
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-100/40">
            {pickLocale(locale, {
              en: 'Plate 12 — by invitation',
              es: 'Lámina 12 — por invitación',
              fr: 'Planche 12 — sur invitation',
            })}
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-6 py-20 lg:px-20">
        <div className="w-full max-w-md">
          <p className="eyebrow mb-3">
            ◌{' '}
            {mode === 'signin'
              ? pickLocale(locale, { en: 'Sign in', es: 'Iniciar sesión', fr: 'Connexion' })
              : pickLocale(locale, { en: 'Register', es: 'Registro', fr: 'Inscription' })}
          </p>
          <h1 className="display-lg text-[clamp(2.25rem,5vw,3.75rem)] text-ink">
            {mode === 'signin' ? t('signInTitle') : t('registerTitle')}
          </h1>
          <p className="mt-3 text-base text-ink/65">
            {mode === 'signin' ? t('signInSubtitle') : t('registerSubtitle')}
          </p>

          <form onSubmit={onSubmit} className="mt-12">
            <Stagger className="space-y-7" stagger={0.07}>
              {mode === 'register' && (
                <StaggerItem>
                  <Input
                    label={t('fullName')}
                    {...register('fullName', { required: 'Required' })}
                    error={errors.fullName?.message}
                  />
                </StaggerItem>
              )}
              <StaggerItem>
                <Input
                  type="email"
                  label={t('email')}
                  {...register('email', { required: 'Required' })}
                  error={errors.email?.message}
                />
              </StaggerItem>
              <StaggerItem>
                <Input
                  type="password"
                  label={t('password')}
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  error={errors.password?.message}
                />
              </StaggerItem>
            </Stagger>

            {error && (
              <p className="mt-4 text-xs text-terracotta-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-cream-100 transition-all hover:bg-terracotta-500 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting
                ? '...'
                : mode === 'signin'
                ? t('submitSignIn')
                : t('submitRegister')}
              <ArrowRight
                size={14}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </button>

            <p className="mt-6 text-sm text-ink/65">
              {mode === 'signin' ? t('noAccount') : t('haveAccount')}{' '}
              <Link
                href={mode === 'signin' ? '/auth/register' : '/auth/login'}
                className="text-ink underline underline-offset-4 hover:text-terracotta-500 transition-colors"
              >
                {mode === 'signin' ? t('register') : t('signIn')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </motion.div>
    </>
  );
}
