'use client';
import { useTranslations } from 'next-intl';
import { DICTIONARY_KEYS } from './constants';

export const SearchEmptyResults = ({
  query,
  onClearSearch,
}: {
  query: string;
  onClearSearch: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <svg
          className="mx-auto h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {t(DICTIONARY_KEYS.NO_RESULTS_FOUND) || 'No results found'}
        </h3>
        <p className="mt-2 text-gray-600">
          {t(DICTIONARY_KEYS.TRY_ADJUSTING_YOUR_SEARCH) || 'Try adjusting your search or clear it.'}
        </p>
        <div className="mt-6">
          <button
            onClick={onClearSearch}
            disabled={!query}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            {t(DICTIONARY_KEYS.CLEAR_SEARCH) || 'Clear search'}
          </button>
        </div>
      </div>
    </div>
  );
};
