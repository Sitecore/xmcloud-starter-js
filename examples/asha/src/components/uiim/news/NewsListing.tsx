'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { getFieldValue } from '@/lib/component-props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import type { NewsListingArticle, NewsListingDatasource, NewsListingProps } from './news-listing.props';

const TITLE_COLOR = '#00778B';
const ACCENT_COLOR = '#991E66';

const fieldText = (field?: { jsonValue?: { value?: unknown }; value?: unknown }): string => {
  const value = getFieldValue(field)?.value ?? field?.value;
  return typeof value === 'string' ? value.trim() : '';
};

const isAccent = (article: NewsListingArticle): boolean => {
  const value = getFieldValue(article.titleAccent)?.value ?? article.titleAccent?.jsonValue?.value;
  return value === true || value === '1';
};

const isArticle = (article?: NewsListingArticle): article is NewsListingArticle =>
  Boolean(fieldText(article?.pageTitle) || fieldText(article?.pageHeaderTitle));

const articleTitle = (article: NewsListingArticle): string =>
  fieldText(article.pageTitle) || fieldText(article.pageHeaderTitle) || article.name || '';

const articleHref = (article: NewsListingArticle): string => {
  const link = getFieldValue(article.sourceLink)?.value;
  if (typeof link?.href === 'string' && link.href) return link.href;
  return article.url?.path || '#';
};

const articleImage = (article: NewsListingArticle): { src: string; alt: string } => {
  const image = getFieldValue(article.pageThumbnail)?.value;
  return {
    src: typeof image?.src === 'string' ? image.src : '',
    alt: typeof image?.alt === 'string' ? image.alt : articleTitle(article),
  };
};

const resolveArticles = (datasource: NewsListingDatasource): NewsListingArticle[] => {
  const selected = datasource.articles?.targetItems?.filter(isArticle) ?? [];
  if (selected.length > 0) return selected;

  const children = datasource.children?.results?.filter(isArticle) ?? [];
  if (children.length > 0) return children;

  return isArticle(datasource) ? [datasource] : [];
};

const NewsCard = ({ article }: { article: NewsListingArticle }): JSX.Element => {
  const titleField = getFieldValue(article.pageTitle) || getFieldValue(article.pageHeaderTitle);
  const image = articleImage(article);
  const accent = isAccent(article);

  return (
    <a
      href={articleHref(article)}
      className="flex h-full flex-col border border-[#e6e6e6] bg-white p-3 no-underline shadow-sm"
      data-testid="news-listing-card"
    >
      {image.src ? (
        // Homepage cards use the public ASHA image URLs stored on pageThumbnail.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} className="aspect-[350/200] w-full object-cover" />
      ) : null}
      <h3
        className="mt-2.5 text-left text-base font-medium leading-snug"
        style={{ color: accent ? ACCENT_COLOR : TITLE_COLOR }}
      >
        <Text field={titleField} />
      </h3>
    </a>
  );
};

export const Default = (props: NewsListingProps): JSX.Element => {
  const datasource = props.fields?.data?.datasource;

  if (!datasource) {
    return <NoDataFallback componentName="NewsListing" />;
  }

  const selected = datasource.articles?.targetItems?.filter(isArticle) ?? [];
  const articles = resolveArticles(datasource);
  const heading = selected.length > 0 ? fieldText(datasource.title) || 'NEWS' : 'NEWS';
  const titleField = selected.length > 0 ? getFieldValue(datasource.title) : undefined;

  return (
    <section
      className={cn('@container px-4 py-8 sm:px-8', props.params?.styles)}
      id={props.params?.RenderingIdentifier}
      data-testid="news-listing"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-5 w-fit border-b-[3px] border-[#991E66] pb-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#6d645b]">
          {titleField?.value ? <Text field={titleField} /> : heading}
        </h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 @md:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id || articleHref(article)} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6d645b]">Select articles from Publications.</p>
        )}
      </div>
    </section>
  );
};
