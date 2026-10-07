'use client';

import { useState } from 'react';
import { GridIcon, ListBulletIcon } from '@radix-ui/react-icons';
import type { SearchResultsInitialState, SearchResultsStoreState } from '@sitecore-search/react';
import { WidgetDataType, useSearchResults, widget } from '@sitecore-search/react';
import React from 'react';
import { HIGHLIGHTED_ARTICLES_RFKID, SEARCH_WIDGET_ID } from '../../_data/customizations';
import HomeHighlighted from './HomeHighlighted';
import Spinner from './Spinner';
import ArticleItemCard from './ArticleCard';
import SortOrder from './SortOrder';
import ArticleHorizontalItemCard from './ArticleHorizontalCard';
import SearchPagination from './SearchPagination';
import SearchFacets from './SearchFacets';
import ResultsPerPage from './ResultsPerPage';
import QueryResultsSummary from './QueryResultsSummary';
import CardViewSwitcher from './CardViewSwitcher';
import { useSearchTracking, type Events } from '../../hooks/useSearchTracking';

const SEARCH_CONFIG = {
  source: process.env.NEXT_PUBLIC_SEARCH_SOURCE as string,
};

export type ArticleModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  url: string;
  description?: string;
  content_text?: string;
  image_url?: string;
  source_id?: string;
};

type ArticleSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
};

type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType'>;

export const SearchResultsComponent = ({
  defaultSortType = 'featured_desc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 10,
}: ArticleSearchResultsProps) => {
  const {
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults<ArticleModel, InitialState>({
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
    },
    query: (query): any => {
      if (SEARCH_CONFIG.source !== '') {
        const sources = SEARCH_CONFIG.source.split('|');
        sources.forEach((source) => {
          query.getRequest().addSource(source.trim());
        });
      }
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const defaultCardView = 'list';
  const [dir, setDir] = useState(defaultCardView);
  const onToggle = (value = defaultCardView) => setDir(value);

  console.log (`Source: ${SEARCH_CONFIG.source}`);
  console.log (`Keyphrase: ${defaultKeyphrase}`);

  // ✅ Call the hook at the top level of the component
  const { handleSearch } = useSearchTracking();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner loading />
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex max-w-full px-4">
        {isFetching && (
          <div className="fixed top-0 right-0 bottom-0 left-0 z-30 h-full w-full bg-white opacity-50 dark:bg-gray-800">
            <div className="absolute top-[50%] left-[50%] z-40 flex -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center">
              <Spinner loading />
            </div>
          </div>
        )}

        {totalItems > 0 && (
          <React.Fragment key="1">
            <section className="relative mt-4 mr-8 flex w-[25%] flex-none flex-col">
              <SearchFacets facets={facets} />
            </section>

            <section className="mt-4 flex flex-[4_1_0%] flex-col">
              {/* Sort / Controls */}
              <section className="bg-background-accent flex justify-between">
                <div className="container flex flex-col justify-between gap-5 py-5 sm:flex-row sm:items-center">
                  {totalItems > 0 && (
                    <QueryResultsSummary
                      currentPage={page}
                      itemsPerPage={itemsPerPage}
                      totalItems={totalItems}
                      totalItemsReturned={articles.length}
                    />
                  )}
                  <div className="gap flex items-center gap-x-7">
                    <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <CardViewSwitcher
                      onToggle={onToggle}
                      defaultCardView={defaultCardView}
                      GridIcon={GridIcon}
                      ListIcon={ListBulletIcon}
                    />
                    <SortOrder options={sortChoices} selected={sortType} />
                  </div>
                </div>
              </section>

              {/* Results */}
              {dir === 'grid' ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:gap-x-6 xl:gap-y-4">
                  {articles.map((a, index) => (
                    <ArticleItemCard
                      key={a.id}
                      article={a}
                      index={index}
                      onItemClick={(e) =>
                        handleSearch(e, {
                          url: a.url,
                          widgetId: SEARCH_WIDGET_ID,
                          entityType: 'content',
                          events: ['EntityPageView', 'SearchClickEvent'] as Events[],
                          entityId: a.id,
                          itemIndex: index,
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full">
                  {articles.map((a, index) => (
                    <ArticleHorizontalItemCard
                      key={a.id}
                      article={a as ArticleModel}
                      index={index}
                      onItemClick={(e) =>
                        handleSearch(e, {
                          url: a.url,
                          widgetId: SEARCH_WIDGET_ID,
                          entityType: 'content',
                          events: ['EntityPageView', 'SearchClickEvent'] as Events[],
                          entityId: a.id,
                          itemIndex: index,
                        })
                      }
                      displayText={true}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col md:flex-row md:justify-between">
                <SearchPagination currentPage={page} totalPages={totalPages} />
              </div>
            </section>
          </React.Fragment>
        )}

        {totalItems <= 0 && !isFetching && <HomeHighlighted rfkId={HIGHLIGHTED_ARTICLES_RFKID} widget={HIGHLIGHTED_ARTICLES_RFKID} source={SEARCH_CONFIG.source} type={"Article"} />}
      </div>
    </div>
  );
};

const SearchResultsWidget = widget(
  SearchResultsComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);
export default SearchResultsWidget;
