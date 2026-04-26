import type { AppLocale } from '@/lib/i18n/config';

/**
 * Pick a locale-specific string from a partial map. Falls back to English.
 * Use for tri-locale strings that aren't worth a JSON message round-trip
 * (toasts, ephemeral loader copy, etc.).
 */
export function pickLocale(
  locale: string,
  map: Partial<Record<AppLocale, string>> & { en: string }
): string {
  return map[locale as AppLocale] ?? map.en;
}
