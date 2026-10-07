'use client';

import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo, useState, JSX } from 'react';

const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr-CA', label: 'Français' },
  { code: 'ja-JP', label: '日本語' },
] as const;

function getPathSuffix(path: string | string[] | undefined): string {
  if (path === undefined) {
    return '';
  }

  if (Array.isArray(path)) {
    return path.length > 0 ? `/${path.join('/')}` : '';
  }

  return path ? `/${path}` : '';
}

type LanguageSwitcherViewProps = {
  selectedLabel: string | undefined;
  showLanguageDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectLanguage: (langCode: string) => void;
};

function LanguageSwitcherView({
  selectedLabel,
  showLanguageDropdown,
  onToggleDropdown,
  onSelectLanguage,
}: LanguageSwitcherViewProps): JSX.Element {
  return (
    <div
      className={`language-switcher ${showLanguageDropdown ? 'expanded' : ''}`}
      onClick={onToggleDropdown}
    >
      <span className="selected-language">{selectedLabel}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="chevron-icon"
        viewBox="0 0 512 512"
        width={16}
        fill="currentColor"
      >
        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
      </svg>
      {showLanguageDropdown && (
        <div className="language-dropdown">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <span
              key={lang.code}
              onClick={(event) => {
                event.stopPropagation();
                onSelectLanguage(lang.code);
              }}
            >
              {lang.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LanguageSwitcherFallback(): JSX.Element {
  const { page } = useSitecore();
  const selectedLabel = AVAILABLE_LANGUAGES.find((lang) => lang.code === page.locale)?.label;

  return (
    <LanguageSwitcherView
      selectedLabel={selectedLabel}
      showLanguageDropdown={false}
      onToggleDropdown={() => {}}
      onSelectLanguage={() => {}}
    />
  );
}

function LanguageSwitcherInner(): JSX.Element {
  const { page } = useSitecore();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const selectedLabel = useMemo(
    () => AVAILABLE_LANGUAGES.find((lang) => lang.code === page.locale)?.label,
    [page.locale]
  );

  const changeLanguage = useCallback(
    (langCode: string) => {
      const site =
        (typeof params.site === 'string' ? params.site : undefined) ?? page.siteName;

      if (!site) {
        return;
      }

      const pathSuffix = getPathSuffix(params.path);
      const query = searchParams.toString();
      const href = `/${site}/${langCode}${pathSuffix}`;
      const url = query ? `${href}?${query}` : href;

      router.push(url);
      setShowLanguageDropdown(false);
    },
    [params.path, params.site, page.siteName, router, searchParams]
  );

  return (
    <LanguageSwitcherView
      selectedLabel={selectedLabel}
      showLanguageDropdown={showLanguageDropdown}
      onToggleDropdown={() => setShowLanguageDropdown(!showLanguageDropdown)}
      onSelectLanguage={changeLanguage}
    />
  );
}

export const Default = (): JSX.Element => (
  <Suspense fallback={<LanguageSwitcherFallback />}>
    <LanguageSwitcherInner />
  </Suspense>
);
