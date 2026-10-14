'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useSearch } from '@sitecore-content-sdk/nextjs/search';
import { cn } from 'lib/utils';
import { SearchDocument, SearchExperienceProps } from './search-components/models';
import { SearchEmptyResults } from './search-components/SearchEmptyResults';
import { SearchError } from './search-components/SearchError';
import { SearchItem } from './search-components/SearchItem';
import { SearchSkeletonItem } from './search-components/SearchSkeletonItem';
import { SearchPagination } from './search-components/SearchPagination';
import { SearchInput } from './search-components/SearchInput';
import { useEvent } from './search-components/useEvent';
import { useSearchField } from './search-components/useSearchField';
import { useParams } from './search-components/useParams';
import { DICTIONARY_KEYS, gridColsClass } from './search-components/constants';
import { useRouter } from './search-components/useRouter';

export const Default = (props: SearchExperienceProps) => {
  const { page } = useSitecore();
  const { params } = props;
  const t = useTranslations();

  const { searchIndex, fieldsMapping } = useSearchField(props.fields.search.value);

  const { styles, id, pageSize, columns } = useParams(params);
  const searchParams = useSearchParams();

  const { isEditing, isPreview } = page.mode;
  const [pageNumber, setPageNumber] = useState(1);
  const [inputValue, setInputValue] = useState<string>((searchParams.get('q') as string) || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false);

  const { total, totalPages, results, isLoading, isSuccess, isError, error } =
    useSearch<SearchDocument>({
      searchIndexId: searchIndex,
      page: pageNumber,
      pageSize,
      enabled: searchEnabled,
      query: searchQuery,
    });

  const { setRouterQuery } = useRouter();

  const sendEvent = useEvent({ query: searchQuery, uid: props.rendering.uid });

  useEffect(() => {
    if (isSuccess) {
      sendEvent('viewed');
    }
  }, [isSuccess, sendEvent]);

  useEffect(() => {
    const routerQuery = (searchParams.get('q') as string) || '';

    setSearchQuery(routerQuery);

    if (!routerQuery) {
      setPageNumber(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isEditing || isPreview) return;

    setSearchEnabled(true);
  }, [isEditing, isPreview]);

  const onSearchChange = useCallback(
    (value: string, debounced: boolean = true) => {
      setInputValue(value);

      if (isEditing || isPreview) return;

      setRouterQuery(value, debounced);
    },
    [setRouterQuery, isEditing, isPreview]
  );

  return (
    <div className={`component search-experience ${styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div
          className={cn('max-w-7xl mx-auto p-6', {
            'pt-24 lg:pt-32': !isEditing,
          })}
        >
          <div className="mb-8">
            <SearchInput value={inputValue} onChange={(value) => onSearchChange(value, true)} />

            <p className="text-gray-600 mb-6">
              {total} {t(DICTIONARY_KEYS.RESULTS_FOUND) || 'results found'}
            </p>
          </div>

          {isError && error && (
            <SearchError error={error} onTryAgain={() => onSearchChange('', false)} />
          )}

          {!isLoading && !isError && total === 0 && (
            <SearchEmptyResults
              query={searchQuery}
              onClearSearch={() => onSearchChange('', false)}
            />
          )}

          <div className={cn('grid gap-6 mb-8', gridColsClass(Number(columns)))}>
            {!isLoading &&
              results.map((result) => (
                <SearchItem
                  variant={Number(columns) === 1 ? 'list' : 'card'}
                  key={result.sc_item_id}
                  data={result}
                  mapping={fieldsMapping}
                  onClick={() => sendEvent('clicked')}
                />
              ))}

            {(((isEditing || isPreview) && total === 0) || isLoading) &&
              Array.from({ length: pageSize }).map((_, index) => (
                <SearchSkeletonItem
                  variant={Number(params.columns) === 1 ? 'list' : 'card'}
                  key={index}
                  mapping={fieldsMapping}
                />
              ))}
          </div>

          {!isLoading && !isError && results.length > 0 && (
            <SearchPagination
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={(page: number) => setPageNumber(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
