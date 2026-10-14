'use client';
import { HTMLAttributes } from 'react';
import { cn } from 'lib/utils';
import { ItemCardFrame, ItemListFrame, SearchItemVariant } from './SearchItemCommon';
import { SearchFieldsMapping } from './models';

type SearchSkeletonItemProps = {
  mapping: SearchFieldsMapping;
  variant?: SearchItemVariant;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Renders a skeleton item in Editing
 */
export const SearchSkeletonItem = ({ mapping, variant = 'card' }: SearchSkeletonItemProps) => {
  const isCard = variant === 'card';

  const fields = (
    <>
      {mapping.type && <SearchItemCategorySkeleton />}
      {mapping.title && <SearchItemTitleSkeleton />}
      {mapping.description && <SearchItemSummarySkeleton />}
      {mapping.link && <SearchItemLinkSkeleton />}
    </>
  );

  return isCard ? <ItemCardFrame>{fields}</ItemCardFrame> : <ItemListFrame>{fields}</ItemListFrame>;
};

const SearchItemTitleSkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse', className)} {...props} />
  );
};

const SearchItemSummarySkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('space-y-2 mb-4', className)} {...props}>
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
    </div>
  );
};

const SearchItemLinkSkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('h-5 w-24 bg-gray-200 rounded animate-pulse', className)} {...props} />;
};

const SearchItemCategorySkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('h-6 w-1/4 bg-gray-200 rounded mb-3 animate-pulse', className)} {...props} />
  );
};
