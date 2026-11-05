import { defineRouting } from 'next-intl/routing';
import sitecoreConfig from 'sitecore.config';

/**
 * The site languages served under a /<locale> prefix. They must equal the Sitecore language
 * names that have page versions published to Edge (get_all_languages). The default language
 * comes first and is served without a prefix.
 */
const SITE_LANGUAGES = ['en', 'ja-JP', 'de-DE', 'ar-AE', 'es-ES'];

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    sitecoreConfig.defaultLanguage,
    ...SITE_LANGUAGES.filter((language) => language !== sitecoreConfig.defaultLanguage),
  ],

  // Used when no locale matches
  defaultLocale: sitecoreConfig.defaultLanguage,

  // No prefix is added for the default locale ("as-needed").
  // For other configuration options, refer to the next-intl documentation:
  // https://next-intl.dev/docs/routing/configuration
  localePrefix: 'as-needed',
});
