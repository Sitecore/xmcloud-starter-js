'use client';
import { HTMLAttributes } from 'react';
import { cn } from 'lib/utils';

export type SearchItemVariant = 'card' | 'list';

type ItemListFrameProps = HTMLAttributes<HTMLDivElement> & { image?: React.ReactNode };

export const ItemListFrame = ({ className, children, image, ...props }: ItemListFrameProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer md:h-57',
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row w-full h-full">
        {image}
        <div className="p-6 md:flex-1">{children}</div>
      </div>
    </div>
  );
};

type ItemCardFrameProps = HTMLAttributes<HTMLDivElement> & { image?: React.ReactNode };

export const ItemCardFrame = ({ className, children, image, ...props }: ItemCardFrameProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {image}
      <div className="p-6">{children}</div>
    </div>
  );
};
