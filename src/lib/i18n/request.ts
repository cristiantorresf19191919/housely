import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type AppLocale } from './config';

function isLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: AppLocale = isLocale(requested) ? requested : defaultLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return { locale, messages };
});
