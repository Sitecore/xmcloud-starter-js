'use client';

import { ArticleCard } from '@sitecore-search/ui';
import Image from 'next/image';
import { DEFAULT_IMG_URL } from '../../_data/customizations';

type ArticleCardItemCardProps = {
  className?: string;
  displayText?: boolean;
  article: any;
  onItemClick: React.MouseEventHandler<HTMLAnchorElement>;
  index: number;
};

const ArticleHorizontalItemCard = ({ className = '', article }: ArticleCardItemCardProps) => {
  let validImageUrl = article.image_url?.trim() ? article.image_url : DEFAULT_IMG_URL;

  if (validImageUrl.includes('filters:no_upscale')) {
    validImageUrl = undefined;
  }

  return (
    <ArticleCard.Root
      key={article.id}
      className={`group relative my-4 flex max-h-52 w-full flex-row flex-nowrap rounded-md border border-gray-200 focus-within:transition-all focus-within:duration-300 focus-within:ease-linear hover:shadow-lg hover:transition-all hover:duration-300 hover:ease-linear focus-within:hover:shadow-lg dark:border-gray-600 ${className} rounded-lg border bg-white p-6 shadow-sm transition-shadow`}
    >
      {validImageUrl && (
        <div className="w-[25%] flex-none overflow-hidden rounded bg-gray-200">
          <Image
            src={validImageUrl}
            className="h-full w-full rounded object-cover object-center lg:h-full lg:w-full"
            alt="alt"
            width={500}
            height={115}
          />
        </div>
      )}
      <div className="grow flex-col pl-4">
        <a className="focus:outline-indigo-500" href={article.url}>
          <span aria-hidden="true" className="absolute inset-0"></span>
          <ArticleCard.Title className="mb-2 text-lg font-semibold text-gray-900">
            {article.name || article.title}
          </ArticleCard.Title>
        </a>
        <ArticleCard.Subtitle className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {article.description}
        </ArticleCard.Subtitle>
        <div className="text-primary-foreground absolute top-4 right-4 rounded-md border border-transparent bg-gray-300 px-2.5 py-0.5 text-xs font-semibold">
          {article.type}
        </div>
      </div>
    </ArticleCard.Root>
  );
};
export default ArticleHorizontalItemCard;
