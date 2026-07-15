'use client';
import { HTMLAttributes } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/utils';
import { SearchItemFields } from './index';

type SearchItemTitleProps = {
  text: SearchItemFields['title'];
} & HTMLAttributes<HTMLHeadingElement>;

export const SearchItemTitle = ({ className, text, ...props }: SearchItemTitleProps) => {
  return (
    text && (
      <h3
        className={cn('text-xl font-semibold text-gray-900 mb-3 line-clamp-2', className)}
        {...props}
      >
        <Text field={text} />
      </h3>
    )
  );
};
