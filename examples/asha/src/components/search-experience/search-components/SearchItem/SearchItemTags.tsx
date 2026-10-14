'use client';
import { HTMLAttributes } from 'react';
import { Text, TextField } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/utils';
import { SearchItemFields } from './index';

type SearchItemTagsProps = {
  tags: SearchItemFields['tags'];
} & HTMLAttributes<HTMLDivElement>;

export const SearchItemTags = ({ className, tags, ...props }: SearchItemTagsProps) => {
  return (
    tags && (
      <div className={cn('flex flex-wrap gap-2 mb-4', className)} {...props}>
        {Array.isArray(tags.value) ? (
          tags.value.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {tag}
            </span>
          ))
        ) : (
          <Text
            field={tags as TextField}
            tag="span"
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
          />
        )}
      </div>
    )
  );
};
