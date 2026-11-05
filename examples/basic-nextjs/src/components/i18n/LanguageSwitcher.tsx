'use client';

import { JSX, useId } from 'react';
import { Globe } from 'lucide-react';
import type { Page } from '@sitecore-content-sdk/nextjs';
import { routing } from '@/i18n/routing';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, localizedPath } from '@/i18n/locale-preference';
import { navigateTo } from '@/lib/search-ui/navigate';
import { cn } from '@/lib/utils';

/** The language's own name ("日本語", "Deutsch", "العربية"), capitalised. */
export const nativeLanguageName = (locale: string): string => {
  const language = locale.split('-')[0];
  try {
    const name = new Intl.DisplayNames([locale], { type: 'language' }).of(language) ?? locale;
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return locale;
  }
};

/**
 * Header language picker: the same page in another site language. Remembers the choice in
 * the locale cookie so unprefixed Sitecore links stay in that language (src/proxy.ts).
 * Hidden when the site has one language and while editing in Pages.
 */
export const LanguageSwitcher = ({
  page,
  className,
}: {
  page?: Pick<Page, 'locale' | 'mode'>;
  className?: string;
}): JSX.Element | null => {
  const id = useId();
  if (routing.locales.length < 2 || page?.mode?.isEditing) return null;

  const current =
    routing.locales.find((l) => l.toLowerCase() === page?.locale?.toLowerCase()) ??
    routing.defaultLocale;

  const onChange = (locale: string) => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    const { pathname, search, hash } = window.location;
    navigateTo(`${localizedPath(pathname, locale, routing)}${search}${hash}`);
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <label htmlFor={id} className="sr-only">
        Language
      </label>
      <Globe aria-hidden className="pointer-events-none absolute left-2 h-4 w-4" />
      <select
        id={id}
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-md border border-current/30 bg-transparent py-1 pl-7 pr-2 text-sm font-medium"
        style={{ color: 'inherit' }}
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale} lang={locale} style={{ color: '#111', backgroundColor: '#fff' }}>
            {nativeLanguageName(locale)}
          </option>
        ))}
      </select>
    </div>
  );
};
