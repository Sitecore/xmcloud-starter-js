'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteSearch } from '@sitecore-content-sdk/nextjs/search';
import type { FacetRequest, SearchDocument } from '@sitecore-content-sdk/search';
import { DEFAULT_IMG_URL } from '../../_data/customizations';

const PAGE_SIZE = 10;

type FieldsMapping = {
  title?: string;
  description?: string;
  images?: string;
  link?: string;
};

type SearchFieldConfig = {
  searchIndex?: string;
  fieldsMapping?: FieldsMapping;
};

export type SearchResultsProps = {
  params?: { [key: string]: string };
  fields?: {
    search?: {
      value?: string;
    };
  };
  /** Search index ID. Falls back to fields.search JSON or NEXT_PUBLIC_SEARCH_INDEX_ID. */
  searchIndexId?: string;
};

type MappedResult = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
};

type SelectedFacetValues = Record<string, string[]>;

const EMPTY_SEARCH_FIELD: SearchFieldConfig = {
  searchIndex: '',
  fieldsMapping: {},
};

const parseSearchField = (value?: string | null): SearchFieldConfig => {
  const normalized = value?.trim();
  if (!normalized) {
    return EMPTY_SEARCH_FIELD;
  }

  try {
    return JSON.parse(normalized) as SearchFieldConfig;
  } catch (error) {
    console.warn('SearchResults: invalid search field JSON. Using defaults.', error);
    return EMPTY_SEARCH_FIELD;
  }
};

const getStringField = (doc: SearchDocument, keys: Array<string | undefined>): string => {
  for (const key of keys) {
    if (!key) continue;
    const value = doc[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const mapResult = (doc: SearchDocument, mapping: FieldsMapping, index: number): MappedResult => {
  const title = getStringField(doc, [
    mapping.title,
    'title',
    'name',
    'Title',
    'Name',
    'ProductName',
  ]);
  const description = getStringField(doc, [
    mapping.description,
    'description',
    'summary',
    'excerpt',
    'Description',
    'Summary',
    'content_text',
  ]);
  const imageUrl =
    getStringField(doc, [mapping.images, 'image_url', 'image', 'Image', 'imageUrl', 'thumbnail']) ||
    DEFAULT_IMG_URL;
  const url = getStringField(doc, [mapping.link, 'url', 'link', 'Link', 'sc_url', 'path']);
  const id =
    getStringField(doc, ['id', 'sc_id', 'sc_item_id', 'item_id']) || `${title || 'result'}-${index}`;

  return { id, title, description, imageUrl, url };
};

const buildFacetRequest = (selected: SelectedFacetValues): FacetRequest => {
  const fields = Object.entries(selected)
    .filter(([, values]) => values.length > 0)
    .map(([name, values]) => ({
      name,
      filters: [
        {
          operator: 'eq' as const,
          value: values,
        },
      ],
    }));

  return {
    all: true,
    ...(fields.length > 0 ? { fields } : {}),
  };
};

const SearchResultsInner = (props: SearchResultsProps) => {
  const { params, fields, searchIndexId: searchIndexIdProp } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get('q')?.trim() || '';
  const [inputValue, setInputValue] = useState(searchQuery);
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacetValues>({});

  const { searchIndex: fieldSearchIndex, fieldsMapping = {} } = useMemo(
    () => parseSearchField(fields?.search?.value),
    [fields?.search?.value]
  );

  const searchIndexId =
    searchIndexIdProp?.trim() ||
    fieldSearchIndex?.trim() ||
    process.env.NEXT_PUBLIC_SEARCH_INDEX_ID?.trim() ||
    '';

  const pageSizeParam = params?.pageSize;
  const pageSize = Number(pageSizeParam) > 0 ? Number(pageSizeParam) : PAGE_SIZE;

  const facet = useMemo(() => buildFacetRequest(selectedFacets), [selectedFacets]);

  const {
    results,
    total,
    facets,
    loadMore,
    hasNextPage,
    isLoading,
    isLoadingMore,
    isError,
    isSuccess,
    error,
  } = useInfiniteSearch<SearchDocument>({
    searchIndexId,
    query: searchQuery,
    pageSize,
    enabled: Boolean(searchIndexId),
    facet,
  });

  const mappedResults = useMemo(
    () => results.map((doc, index) => mapResult(doc, fieldsMapping, index)),
    [results, fieldsMapping]
  );

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (isVisible && hasNextPage && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isLoading, isLoadingMore, loadMore, mappedResults.length]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const applySearch = useCallback(
    (value: string) => {
      const query = value.trim();

      const nextParams = new URLSearchParams(searchParams.toString());
      if (query) {
        nextParams.set('q', query);
      } else {
        nextParams.delete('q');
      }

      const queryString = nextParams.toString();
      router.replace(queryString ? `?${queryString}` : '?', { scroll: false });
    },
    [router, searchParams]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      applySearch(inputValue);
    },
    [applySearch, inputValue]
  );

  const toggleFacetValue = useCallback((facetName: string, value: string) => {
    setSelectedFacets((previous) => {
      const current = previous[facetName] ?? [];
      const isSelected = current.includes(value);
      const nextValues = isSelected
        ? current.filter((item) => item !== value)
        : [...current, value];

      const next = { ...previous };
      if (nextValues.length === 0) {
        delete next[facetName];
      } else {
        next[facetName] = nextValues;
      }
      return next;
    });
  }, []);

  const clearFacets = useCallback(() => {
    setSelectedFacets({});
  }, []);

  const id = params?.RenderingIdentifier;
  const sxaStyles = params?.styles?.trimEnd() ?? '';
  const keywordLabel = searchQuery || 'all content';
  const hasSelectedFacets = Object.keys(selectedFacets).length > 0;

  if (!searchIndexId) {
    return (
      <div className={`component search-results ${sxaStyles}`} id={id || undefined}>
        <p className="text-sm text-gray-600">
          Search results are not configured. Set a search index via the component datasource or{' '}
          <code>NEXT_PUBLIC_SEARCH_INDEX_ID</code>.
        </p>
      </div>
    );
  }

  return (
    <div className={`component search-results ${sxaStyles}`} id={id || undefined}>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <form onSubmit={handleSubmit} className="mb-6 w-full" role="search">
          <input
            name="query"
            type="search"
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Search"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-[#004bdf] focus:outline-none focus:ring-2 focus:ring-[#004bdf]"
          />
        </form>

        <p className="mb-6 text-base text-gray-700" aria-live="polite">
          {isLoading && mappedResults.length === 0
            ? 'Searching…'
            : `Found ${total} results for ${keywordLabel}`}
        </p>

        {isError && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error?.message || 'Something went wrong. Try again.'}
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64" aria-label="Search facets">
            <div className="rounded-md border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="m-0 text-sm font-semibold uppercase tracking-wide text-gray-800">
                  Filters
                </h2>
                {hasSelectedFacets && (
                  <button
                    type="button"
                    onClick={clearFacets}
                    className="text-xs font-medium text-[#004bdf] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {!facets?.length && (
                <p className="m-0 text-sm text-gray-500">
                  {isLoading ? 'Loading filters…' : 'No filters available.'}
                </p>
              )}

              <div className="flex flex-col gap-4">
                {facets?.map((facetGroup) => (
                  <div key={facetGroup.name}>
                    <h3 className="mb-2 mt-0 text-sm font-semibold text-gray-900">
                      {facetGroup.name}
                    </h3>
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {facetGroup.value.map((facetValue) => {
                        const valueKey = String(facetValue.text);
                        const isChecked =
                          selectedFacets[facetGroup.name]?.includes(valueKey) ?? false;

                        return (
                          <li key={`${facetGroup.name}-${valueKey}`} className="m-0">
                            <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleFacetValue(facetGroup.name, valueKey)}
                                className="mt-0.5"
                              />
                              <span>
                                {valueKey}{' '}
                                <span className="text-gray-400">({facetValue.count})</span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {!isLoading && isSuccess && mappedResults.length === 0 && (
              <p className="text-sm text-gray-600">No results found.</p>
            )}

            <ul className="m-0 list-none p-0">
              {mappedResults.map((result) => (
                <li key={result.id} className="m-0">
                  <article className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-[20%_80%]">
                    <div className="relative flex min-h-[6rem] items-center justify-center overflow-hidden">
                      <Image
                        src={result.imageUrl}
                        alt={result.title || 'Search result'}
                        width={240}
                        height={160}
                        className="h-auto max-h-40 w-full object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      {result.title && (
                        <h3 className="mb-2 mt-0 text-lg font-semibold text-gray-900">
                          {result.url ? (
                            <a
                              href={result.url}
                              className="text-gray-900 no-underline hover:text-[#004bdf] hover:underline"
                            >
                              {result.title}
                            </a>
                          ) : (
                            result.title
                          )}
                        </h3>
                      )}
                      {result.description && (
                        <p className="mb-2 mt-0 text-sm leading-relaxed text-gray-600">
                          {result.description}
                        </p>
                      )}
                      {result.url && (
                        <a
                          href={result.url}
                          className="break-all text-sm text-[#004bdf] hover:underline"
                        >
                          {result.url}
                        </a>
                      )}
                    </div>
                  </article>
                  <hr className="m-0 border-0 border-t border-gray-200" />
                </li>
              ))}
            </ul>

            {(isLoading || isLoadingMore) && (
              <p className="py-4 text-center text-sm text-gray-500">Loading more results…</p>
            )}

            <div ref={loadMoreSentinelRef} className="h-4 w-full" aria-hidden="true" />

            {!hasNextPage && mappedResults.length > 0 && !isLoading && (
              <p className="py-4 text-center text-sm text-gray-400">End of results</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResultsFromUrl = (props: SearchResultsProps) => {
  const searchParams = useSearchParams();
  const queryKey = searchParams.get('q')?.trim() || '';

  // Remount when the URL query changes so input/facets reset without syncing in an effect.
  return <SearchResultsInner key={queryKey} {...props} />;
};

export const Default = (props: SearchResultsProps) => (
  <Suspense fallback={null}>
    <SearchResultsFromUrl {...props} />
  </Suspense>
);

export default Default;
