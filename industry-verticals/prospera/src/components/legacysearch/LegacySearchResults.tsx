'use client';

import { JSX, Suspense } from 'react';
import { ComponentProps } from 'lib/component-props';
import { useSearchParams } from 'next/navigation';
import SearchResultsWidget from './SearchResultsComponent';
import QuestionsAnswers from './QuestionsAnswers';
import { SEARCH_WIDGET_ID } from '../../_data/customizations';

export type LegacySearchResultsProps = ComponentProps & {
  params: { [key: string]: string };
};

const LegacySearchResultsInner = (props: LegacySearchResultsProps): JSX.Element => {
  const sxaStyles = `${props.params?.styles || ''}`;
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  return (
    <div key={query} className={`${sxaStyles}`}>
      <QuestionsAnswers
        key={`${query}-questions`}
        rfkId="rfkid_qa"
        defaultKeyphrase={query}
        defaultRelatedQuestions={3}
      />
      <SearchResultsWidget rfkId={SEARCH_WIDGET_ID} defaultKeyphrase={query} />
    </div>
  );
};

export const LegacySearchResults = (props: LegacySearchResultsProps): JSX.Element => {
  return (
    <Suspense fallback={null}>
      <LegacySearchResultsInner {...props} />
    </Suspense>
  );
};

export const Default = LegacySearchResults;