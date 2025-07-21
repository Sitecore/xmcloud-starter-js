'use client';

import { Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from 'next-localization';

const DICTIONARY_KEYS = {
  SEARCH_GO_LABEL: 'Go',
  SEARCH_LABEL: 'Search',
  SEARCH_INPUT_PLACEHOLDER: 'Search_Input_Placeholder',
};

export const SearchBox = ({ searchLink }: { searchLink: LinkField }) => {
  const { t } = useI18n();
  const { isVisible, setIsVisible, ref } = useToggleWithClickOutside<HTMLDivElement>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const buildSearchUrl = () => {
    if (!searchLink?.value?.href) return '#';
    try {
      const url = new URL(searchLink.value.href, window.location.origin);
      if (searchTerm.trim()) {
        url.searchParams.set('q', searchTerm.trim());
      } else {
        url.searchParams.delete('q');
      }
      return url.toString();
    } catch {
      return `${searchLink.value.href}?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <div ref={ref}>
      <ContentSdkLink
        field={searchLink}
        prefetch={false}
        className="block p-4 font-(family-name:--font-accent) font-medium"
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
      />

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
          <h5 className="mb-4 uppercase">{t(DICTIONARY_KEYS.SEARCH_LABEL) || 'Search'}</h5>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t(DICTIONARY_KEYS.SEARCH_INPUT_PLACEHOLDER) || 'Type to search...'}
              className="w-full border-b border-border focus-visible:outline-0 focus:border-black px-3 py-2"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  window.location.href = buildSearchUrl();
                }
              }}
            />
            <Link href={buildSearchUrl()} className="btn btn-primary btn-sharp">
              {t(DICTIONARY_KEYS.SEARCH_GO_LABEL) || 'Go'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
