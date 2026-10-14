'use client';
import { useTranslations } from 'next-intl';
import { DICTIONARY_KEYS } from './constants';

export const SearchPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const t = useTranslations();
  const maxVisiblePages = 3;

  // Determine the window of pages to display (max of 3)
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start when near the end to keep the window size consistent
  startPage = Math.max(1, Math.min(startPage, Math.max(1, endPage - maxVisiblePages + 1)));

  // Recalculate endPage based on (possibly) adjusted startPage
  endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  const pages: number[] = [];
  for (let p = startPage; p <= endPage; p++) {
    pages.push(p);
  }

  const showLeftEllipsis = startPage > 1;
  const showRightEllipsis = endPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-primary-hover hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t(DICTIONARY_KEYS.PREVIOUS_PAGE) || 'Previous'}
      </button>

      {showLeftEllipsis && (
        <span
          key="left-ellipsis"
          className="w-10 h-10 flex items-center justify-center text-gray-400 select-none"
          aria-hidden
        >
          …
        </span>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg cursor-pointer hover:bg-primary-hover hover:text-primary-foreground ${
            currentPage === page
              ? 'bg-primary text-primary-foreground'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {showRightEllipsis && (
        <span
          key="right-ellipsis"
          className="w-10 h-10 flex items-center justify-center text-gray-400 select-none"
          aria-hidden
        >
          …
        </span>
      )}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-primary-hover hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t(DICTIONARY_KEYS.NEXT_PAGE) || 'Next'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
