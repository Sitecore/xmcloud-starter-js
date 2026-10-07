'use client';

import type { ChangeEvent, SyntheticEvent } from 'react';
import { useCallback } from 'react';
import type { PreviewSearchInitialState } from '@sitecore-search/react';
import { WidgetDataType, usePreviewSearch, widget } from '@sitecore-search/react';
import { ArticleCard, PreviewSearch } from '@sitecore-search/ui';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import SuggestionBlock from './SuggestionBlock';
import { PREVIEW_WIDGET_ID } from '../../_data/customizations';
import { useSearchTracking, type Events } from '../../hooks/useSearchTracking';

const SEARCH_CONFIG = {
  source: process.env.NEXT_PUBLIC_SEARCH_SOURCE as string,
};

type ArticleModel = {
  id: string;
  title: string;
  image_url: string;
  url: string;
  source_id?: string;
  name: string;
};

type LegacyPreviewSearchComponentProps = {
  defaultItemsPerPage?: number;
  isOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type InitialState = PreviewSearchInitialState<'itemsPerPage' | 'suggestionsList'>;

export const LegacyPreviewSearchComponent = ({
  defaultItemsPerPage = 6,
  isOpen,
  setIsSearchOpen,
}: LegacyPreviewSearchComponentProps) => {
  const router = useRouter();
  const { handleSearch } = useSearchTracking();

  const {
    actions: { onKeyphraseChange },
    queryResult,
    queryResult: {
      isFetching,
      isLoading,
      data: { suggestion: { title_context_aware: articleSuggestions = [] } = {} } = {},
    },
  } = usePreviewSearch<ArticleModel, InitialState>({
    state: {
      suggestionsList: [{ suggestion: 'title_context_aware', max: 6 }],
      itemsPerPage: defaultItemsPerPage,
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

  const loading = isLoading || isFetching;

  const keyphraseHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      onKeyphraseChange({ keyphrase: target.value });
    },
    [onKeyphraseChange]
  );

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (isOpen) setIsSearchOpen(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const target = e.target.query as HTMLInputElement;
    router.push(`/search?q=${target.value}`);
    target.value = '';
  };

  return (
    <PreviewSearch.Root>
      <form onSubmit={handleSubmit} className="flex-1">
        <PreviewSearch.Input
          name="query"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={keyphraseHandler}
          autoComplete="off"
          placeholder="Ask me anything"
        />
      </form>

      <PreviewSearch.Content className="z-50 flex h-[400px] w-[var(--radix-popover-trigger-width)] justify-center bg-gray-100 pt-0 shadow-[2px_5px_5px_5px_rgba(0,0,0,0.3)] transition-opacity dark:bg-gray-800">
        <Spinner loading={loading} />

        {!loading && (
          <React.Fragment key="1">
            {articleSuggestions.length > 0 && (
              <PreviewSearch.Suggestions className="box-border block w-[16rem] list-none text-sm">
                <SuggestionBlock
                  blockId={'title_context_aware'}
                  items={articleSuggestions}
                  title={'Suggestions'}
                />
              </PreviewSearch.Suggestions>
            )}

            <PreviewSearch.Results defaultQueryResult={queryResult}>
              {({ isFetching: isResultsFetching, data: { content: articles = [] } = {} }) => (
                <PreviewSearch.Items
                  data-loading={isResultsFetching}
                  className="flex flex-[3] overflow-y-auto bg-white data-[loading=false]:m-0 data-[loading=false]:grid data-[loading=false]:list-none data-[loading=false]:grid-cols-3 data-[loading=false]:gap-3 data-[loading=false]:p-2 dark:bg-gray-700"
                >
                  <Spinner loading={isResultsFetching} />

                  {!isResultsFetching &&
                    articles.map((article, index) => (
                      <PreviewSearch.Item key={article.id} asChild>
                        <PreviewSearch.ItemLink
                          onClick={(e) =>
                            handleSearch(e, {
                              url: article.url,
                              widgetId: PREVIEW_WIDGET_ID,
                              entityType: 'content',
                              events: ['EntityPageView', 'PreviewSearchClickEvent'] as Events[],
                              entityId: article.id,
                              itemIndex: index,
                            })
                          }
                          href={article.url}
                          className="box-border flex w-full text-black no-underline focus:shadow-md"
                        >
                          <ArticleCard.Root className="block w-full cursor-pointer rounded-md border border-solid border-transparent p-2 text-center shadow-[2px_2px_4px_rgba(0,0,0,0.3)] focus-within:shadow-[2px_2px_4px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.8)] dark:text-white">
                            <div className="relative m-auto mb-[10px] flex h-[6em] items-center justify-center overflow-hidden">
                              <Image
                                src={article.image_url}
                                className="block h-auto max-h-full w-auto max-w-full"
                                alt="alt"
                                width={200}
                                height={100}
                                unoptimized
                              />
                            </div>
                            <ArticleCard.Title className="m-0 mb-2 max-h-[2rem] overflow-hidden text-xs">
                              {article.name}
                            </ArticleCard.Title>
                          </ArticleCard.Root>
                        </PreviewSearch.ItemLink>
                      </PreviewSearch.Item>
                    ))}
                </PreviewSearch.Items>
              )}
            </PreviewSearch.Results>
          </React.Fragment>
        )}
      </PreviewSearch.Content>
    </PreviewSearch.Root>
  );
};

const PreviewSearchWidget = widget(
  LegacyPreviewSearchComponent,
  WidgetDataType.PREVIEW_SEARCH,
  'content'
);
export default PreviewSearchWidget;
