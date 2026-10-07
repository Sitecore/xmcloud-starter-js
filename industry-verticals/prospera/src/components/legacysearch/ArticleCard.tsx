'use client';

import { ArticleCard } from '@sitecore-search/ui';
import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_IMG_URL, HOMEHIGHLIGHTED_WIDGET_ID } from '../../_data/customizations';
import { EntityModel } from '@sitecore-search/react';
import { useSearchTracking, type Events } from '../../hooks/useSearchTracking';

type ArticleItemCardProps = {
  className?: string;
  article: EntityModel;
  index: number;
  onItemClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const ArticleItemCard = ({ className = '', article }: ArticleItemCardProps) => {
  const validImageUrl = article.image_url?.trim() ? article.image_url : DEFAULT_IMG_URL;
  const { handleSearch } = useSearchTracking();

  return (
    <ArticleCard.Root
      key={article.id}
      className={`group relative rounded-md border border-gray-300 shadow-md focus-within:scale-102 focus-within:transition-all focus-within:duration-300 focus-within:ease-linear hover:scale-102 hover:shadow-lg hover:transition-all hover:duration-300 hover:ease-linear focus-within:hover:shadow-lg dark:border-gray-600 ${className}`}
    >
      <div className="aspect-h-1 aspect-w-1 sm:aspect-none h-32 w-full overflow-hidden rounded-t-md bg-gray-200">
        <Image
          src={validImageUrl}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          alt={article.name || article.title}
          width={500}
          height={115}
          loading="lazy"
        />
      </div>
      <div className="relative m-4 flex-col justify-between">
        <Link
          className="focus:outline-indigo-500"
          href={article.url}
          aria-label={`View details for ${article.name || article.title}`}
          onClick={(e) =>
            handleSearch(e, {
              url: article.url,
              widgetId: HOMEHIGHLIGHTED_WIDGET_ID,
              entityType: 'content',
              events: ['EntityPageView', 'SearchClickEvent'] as Events[],
              entityId: article.id,
              itemIndex: article.id,
            })
          }
        >
          <span aria-hidden="true" className="absolute inset-0"></span>
          <ArticleCard.Title className="mt-4 h-[100px] overflow-hidden text-base font-bold">
            {article.name || article.title}
          </ArticleCard.Title>
        </Link>
        <ArticleCard.Subtitle className="mt-3 flex text-sm text-gray-600 dark:text-gray-200">
          {/* {article.type} */}
          <div className="right-0 text-sm font-medium text-blue-600 hover:text-blue-800">
            Read More →
          </div>
        </ArticleCard.Subtitle>
      </div>
    </ArticleCard.Root>
  );
};

export default ArticleItemCard;
