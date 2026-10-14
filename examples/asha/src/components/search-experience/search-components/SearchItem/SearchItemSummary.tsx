'use client';
import { HTMLAttributes } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/utils';
import { SearchItemFields } from './index';

type SearchItemSummaryProps = {
  summary: SearchItemFields['summary'];
} & HTMLAttributes<HTMLParagraphElement>;

export const SearchItemSummary = ({ className, summary, ...props }: SearchItemSummaryProps) => {
  return (
    summary && (
      <p className={cn('text-gray-600 mb-4', className)} {...props}>
        <Text field={summary} />
      </p>
    )
  );
};
