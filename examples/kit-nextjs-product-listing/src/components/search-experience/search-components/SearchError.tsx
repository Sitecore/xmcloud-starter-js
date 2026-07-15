'use client';
import { useTranslations } from 'next-intl';
import { DICTIONARY_KEYS } from './constants';

export const SearchError = ({ onTryAgain, error }: { onTryAgain: () => void; error: Error }) => {
  const t = useTranslations();

  return (
    <div className="mb-8">
      <div className="bg-white border border-red-200 rounded-lg p-12 text-center">
        <svg
          className="mx-auto h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.15L13.93 4.85a2 2 0 00-3.86 0L3 17.15A2 2 0 005.07 19z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {t(DICTIONARY_KEYS.SOMETHING_WENT_WRONG) || 'Something went wrong'}
        </h3>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <div className="mt-6">
          <button
            onClick={onTryAgain}
            className="px-4 py-2 rounded-md bg-red-600 text-white cursor-pointer"
          >
            {t(DICTIONARY_KEYS.TRY_AGAIN) || 'Try again'}
          </button>
        </div>
      </div>
    </div>
  );
};
