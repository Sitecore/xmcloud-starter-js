'use client';

import { Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const DICTIONARY_KEYS = {
  SEARCH_GO_LABEL: 'Go',
  SEARCH_GO_DESCRIPTIVE: 'Go_To_Search_Results',
  SEARCH_LABEL: 'Search',
  SEARCH_INPUT_PLACEHOLDER: 'Search_Input_Placeholder',
};

const SEARCH_GO_ARIA_LABEL = 'Go to search results';

/** Returns true if href is a valid URL (not a placeholder like # or http://#). */
function hasValidHref(href: string | undefined): boolean {
  if (!href || href === '#' || href.startsWith('http://#')) return false;
  return true;
}

export const SearchBox = ({ searchLink }: { searchLink: LinkField }) => {
  const t = useTranslations();
  const { isVisible, setIsVisible, ref } = useToggleWithClickOutside<HTMLDivElement>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchBaseHref = searchLink?.value?.href;
  const hasValidSearchLink = hasValidHref(searchBaseHref);

  const buildSearchUrl = (): string | null => {
    if (!hasValidSearchLink) return null;

    // Keep href relative so server and client render identical markup.
    const [pathWithQuery = '', hash = ''] = (searchBaseHref ?? '').split('#');
    const [pathname = '', initialQuery = ''] = pathWithQuery.split('?');
    const params = new URLSearchParams(initialQuery);

    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }

    const query = params.toString();
    const hashPart = hash ? `#${hash}` : '';
    return `${pathname}${query ? `?${query}` : ''}${hashPart}`;
  };

  const searchUrl = buildSearchUrl();

  return (
    <div ref={ref}>
      {hasValidSearchLink ? (
        <ContentSdkLink
          field={searchLink}
          prefetch={false}
          className="block p-4 font-[family-name:var(--font-accent)] font-medium"
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(!isVisible);
          }}
        />
      ) : (
        <button
          type="button"
          className="block p-4 font-[family-name:var(--font-accent)] font-medium w-full text-left"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={t(DICTIONARY_KEYS.SEARCH_LABEL) || 'Search'}
        >
          {searchLink?.value?.text || (t(DICTIONARY_KEYS.SEARCH_LABEL) || 'Search')}
        </button>
      )}

      <div
        className={`fixed lg:absolute top-14 left-0 right-0 lg:top-full lg:left-0 lg:right-0
          h-[calc(100vh-3.5rem)] lg:h-auto overflow-auto
          ${
            isVisible
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 lg:translate-y-2 pointer-events-none'
          }
          bg-background transition-all duration-300 ease-in-out
        `}
      >
        <div className="pt-18 p-8 lg:pt-8">
          <h2 className="mb-4 uppercase">{t(DICTIONARY_KEYS.SEARCH_LABEL) || 'Search'}</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t(DICTIONARY_KEYS.SEARCH_INPUT_PLACEHOLDER) || 'Type to search...'}
              className="w-full border-b border-border focus-visible:outline-0 focus:border-black px-3 py-2"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchUrl) {
                  window.location.href = searchUrl;
                }
              }}
            />
            {searchUrl ? (
              <Link
                href={searchUrl}
                prefetch={false}
                className="btn btn-primary btn-sharp"
                aria-label={t(DICTIONARY_KEYS.SEARCH_GO_DESCRIPTIVE) || SEARCH_GO_ARIA_LABEL}
              >
                {t(DICTIONARY_KEYS.SEARCH_GO_DESCRIPTIVE) || t(DICTIONARY_KEYS.SEARCH_GO_LABEL) || SEARCH_GO_ARIA_LABEL}
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sharp"
                aria-label={t(DICTIONARY_KEYS.SEARCH_GO_DESCRIPTIVE) || SEARCH_GO_ARIA_LABEL}
                onClick={() => {
                  if (searchTerm.trim() && searchBaseHref) {
                    try {
                      const url = new URL(searchBaseHref, window.location.origin);
                      url.searchParams.set('q', searchTerm.trim());
                      window.location.href = url.toString();
                    } catch {
                      // no-op if URL invalid
                    }
                  }
                }}
              >
                {t(DICTIONARY_KEYS.SEARCH_GO_DESCRIPTIVE) || t(DICTIONARY_KEYS.SEARCH_GO_LABEL) || SEARCH_GO_ARIA_LABEL}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
