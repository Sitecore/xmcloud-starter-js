'use client';

import { useMemo } from 'react';
import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { MultiPromoItemProps, MultiPromoProps } from './multi-promo.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { Default as MultiPromoItem } from './MultiPromoItem.dev';

/**
 * Section heading plus a responsive grid of brand cards (one per child promo).
 */
export const Default: React.FC<MultiPromoProps> = (props) => {
  const { fields, params } = props;
  const datasource = useMemo(() => getDatasource(fields), [fields]);
  const { children, title, description } = datasource ?? {};
  const items = children?.results ?? [];

  if (!fields) {
    return <NoDataFallback componentName="Multi Promo" />;
  }

  return (
    <section
      data-component="MultiPromo"
      className={cn('component multi-promo w-full bg-white py-16 text-black md:py-20', {
        [params?.styles]: params?.styles,
      })}
    >
      <div className="mx-auto max-w-[1311px] px-6">
        {(title || description) && (
          <div className="mb-10 max-w-3xl">
            {title && (
              <Text
                tag="h2"
                field={getFieldValue(title)}
                className="mb-4 text-balance text-3xl font-medium leading-tight md:text-[2.25rem]"
              />
            )}
            {description && (
              <RichText
                className="text-pretty text-base font-light leading-relaxed"
                field={getFieldValue(description)}
              />
            )}
          </div>
        )}
        {items.length > 0 && (
          <ul
            className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', {
              'lg:grid-cols-3': items.length % 4 !== 0,
              'lg:grid-cols-4': items.length % 4 === 0,
            })}
          >
            {items.map((item: MultiPromoItemProps, index: number) => (
              <li key={index} className="flex">
                <MultiPromoItem {...item} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
