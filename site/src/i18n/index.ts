import { zh, type StringKey } from './zh';
import { en } from './en';

export type Locale = 'zh' | 'en';

/** Look up a localized string. Falls back to zh, then to the raw key. */
export function t(locale: Locale, key: string): string {
  if (locale === 'en') {
    const v = en[key as StringKey];
    if (v) return v;
  }
  const z = zh[key as StringKey];
  return z ?? key;
}

/** Derive the active locale from an Astro URL pathname. */
export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'zh';
}
