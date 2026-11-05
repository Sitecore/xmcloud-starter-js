/**
 * Sticky visitor language (pure helpers shared by src/proxy.ts and the language switcher).
 *
 * Sitecore link URLs carry no language prefix (Language Embedding is off), so an internal
 * link on /ja-JP/Articles points at /Articles. The proxy remembers the language the visitor
 * last chose (a prefixed URL or the switcher) in LOCALE_COOKIE and redirects unprefixed
 * paths to that language. Visitors without the cookie, and crawlers, get the default language.
 */

export const LOCALE_COOKIE = 'NEXT_LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type LocaleRouting = { locales: readonly string[]; defaultLocale: string };

/** The configured locale in the first path segment (case-insensitive), in its configured casing. */
export const localeFromPath = (pathname: string, locales: readonly string[]): string | undefined => {
  const first = pathname.split('/')[1]?.toLowerCase();
  return first ? locales.find((locale) => locale.toLowerCase() === first) : undefined;
};

/** The path without a leading locale segment; always starts with "/". */
export const stripLocale = (pathname: string, locales: readonly string[]): string => {
  const locale = localeFromPath(pathname, locales);
  if (!locale) return pathname || '/';
  const rest = pathname.slice(locale.length + 1);
  return rest.startsWith('/') ? rest : `/${rest}`;
};

/** The path of `pathname` in `locale` ("as-needed": no prefix for the default locale). */
export const localizedPath = (pathname: string, locale: string, routing: LocaleRouting): string => {
  const rest = stripLocale(pathname, routing.locales);
  if (locale === routing.defaultLocale) return rest;
  return rest === '/' ? `/${locale}` : `/${locale}${rest}`;
};

/**
 * Where to redirect an unprefixed page request for a visitor whose remembered language is
 * not the default, or null to serve the request as is.
 */
export const preferredLocaleRedirect = (
  pathname: string,
  preferred: string | undefined,
  routing: LocaleRouting
): string | null => {
  if (!preferred) return null;
  const locale = routing.locales.find((l) => l.toLowerCase() === preferred.toLowerCase());
  if (!locale || locale === routing.defaultLocale) return null;
  if (localeFromPath(pathname, routing.locales)) return null;
  // Files served from /public (e.g. /brand/logo.svg) have no language.
  if (/\.[a-z0-9]+$/i.test(pathname)) return null;
  return localizedPath(pathname, locale, routing);
};

const RTL_LANGUAGES = new Set(['ar', 'fa', 'he', 'ur']);

/** Text direction for a locale. */
export const directionFor = (locale: string): 'rtl' | 'ltr' =>
  RTL_LANGUAGES.has(locale.split('-')[0].toLowerCase()) ? 'rtl' : 'ltr';
