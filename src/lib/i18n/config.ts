export const locales = ['en', 'es', 'fr'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';

export const localeLabels: Record<AppLocale, { native: string; flag: string }> = {
  en: { native: 'English', flag: '🇺🇸' },
  es: { native: 'Español', flag: '🇪🇸' },
  fr: { native: 'Français', flag: '🇫🇷' },
};
