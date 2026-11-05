import type { Page } from '@sitecore-content-sdk/nextjs';
import config from 'sitecore.config';

/**
 * The search `locale` for the rendered page, or undefined to omit it.
 *
 * A source with locales stores one document per locale and returns only the
 * requested one. Its locale codes equal the Sitecore language names (en, ja-JP,
 * de-DE, ...), so the page's route locale is passed through unchanged.
 *
 * The default language is omitted: a multi-locale source then answers with its
 * default (English) documents, the same as an explicit `en` (verified 2026-11-05),
 * and English-only sources keep receiving exactly the request they did before.
 */
export const searchLocale = (
  page: Pick<Page, 'locale'> | undefined,
  defaultLanguage: string = config.defaultLanguage
): string | undefined => {
  const locale = page?.locale;
  if (!locale || locale.toLowerCase() === defaultLanguage.toLowerCase()) return undefined;
  return locale;
};
