'use client';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { SEARCH_LABELS, SearchLabelName } from './constants';

/**
 * Guarded dictionary lookup for search UI labels, in the page language.
 *
 * src/i18n/request.ts loads the Sitecore Dictionary under the site name
 * (`messages["main-website"].SearchExperience_SortBy`), so the key is looked up in
 * the site namespace first, then at the root. A missing entry renders the English
 * fallback — it never throws or logs MISSING_MESSAGE. (Plain `t(key) || fallback`
 * does NOT work with next-intl: a missing key errors instead of returning
 * something falsy.)
 */
export const useSearchLabels = (siteName?: string) => {
  const t = useTranslations();

  return useCallback(
    (name: SearchLabelName): string => {
      const { key, fallback } = SEARCH_LABELS[name];
      const siteKey = siteName ? `${siteName}.${key}` : '';
      if (siteKey && t.has(siteKey)) return t(siteKey);
      return t.has(key) ? t(key) : fallback;
    },
    [t, siteName]
  );
};
