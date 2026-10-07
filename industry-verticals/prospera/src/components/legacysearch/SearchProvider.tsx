'use client';

import React, { useEffect } from 'react';
import { PageController, WidgetsProvider } from '@sitecore-search/react';

const SEARCH_CONFIG = {
  env: process.env.NEXT_PUBLIC_SEARCH_ENV as any,
  customerKey: process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY!,
  apiKey: process.env.NEXT_PUBLIC_SEARCH_API_KEY!,
};

function setSearchLocale(locale: string) {
  const context = PageController.getContext();

  const normalized = locale.toLowerCase();
  const [language, countryFromLocale] = normalized.split('-');

  const countryByLanguage: Record<string, string> = {
    en: 'us',
    fr: 'ca',
    ja: 'jp',
  };

  const country = countryFromLocale || countryByLanguage[language];

  context.setLocaleLanguage(language);
  context.setLocaleCountry(country);
}

type SearchProviderProps = {
  children: React.ReactNode;
  locale: string;
};

export function SearchProvider({
  children,
  locale,
}: SearchProviderProps) {
  useEffect(() => {
    setSearchLocale(locale);
  }, [locale]);

  return (
    <WidgetsProvider
      env={SEARCH_CONFIG.env}
      customerKey={SEARCH_CONFIG.customerKey}
      apiKey={SEARCH_CONFIG.apiKey}
      publicSuffix
    >
      {children}
    </WidgetsProvider>
  );
}