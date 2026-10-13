'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getFieldValue } from '@/lib/component-props';
import { hasFacetConfig, matchFacets, parseFacetConfig } from './blog-listing.facets';
import type { BlogListingArticle, BlogListingProps } from './blog-listing.props';

const fieldText = (field?: { jsonValue?: { value?: string }; value?: string }): string => {
  const value = getFieldValue(field)?.value ?? field?.value;
  return typeof value === 'string' ? value : '';
};

const isChecked = (field?: { jsonValue?: { value?: boolean | string }; value?: boolean | string }): boolean => {
  const value = getFieldValue(field)?.value ?? field?.value;
  return value === true || value === '1';
};

const formatDisplayDate = (raw?: string): string => {
  if (!raw) return '';
  const iso = raw.includes('T') ? raw.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z') : raw;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return raw;
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsed);
};

const dateSortValue = (raw?: string): number => {
  if (!raw) return 0;
  const iso = raw.includes('T') ? raw.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z') : raw;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const getArticles = (fields?: BlogListingProps['fields']): BlogListingArticle[] => {
  const fromRoot = fields?.data?.datasource?.blogsRoot?.targetItem?.children?.results;
  const fromContext = fields?.data?.contextItem?.children?.results;
  return (fromRoot?.length ? fromRoot : fromContext) ?? [];
};

const BlogListingEmpty = (): JSX.Element => (
  <div className="component blog-listing">
    <div className="component-content">
      <span className="is-empty-hint">Blog Listing has no datasource. Select a BlogListing item.</span>
    </div>
  </div>
);

const BlogCard = ({
  article,
  layout,
}: {
  article: BlogListingArticle;
  layout: 'row' | 'card';
}): JSX.Element => {
  const title = fieldText(article.pageHeaderTitle) || fieldText(article.pageTitle) || article.name || 'Untitled';
  const summary = fieldText(article.pageSummary);
  const shortTitle = fieldText(article.pageShortTitle);
  const date = formatDisplayDate(fieldText(article.pageDisplayDate));
  const readTime = fieldText(article.pageReadTime);
  const href = article.url?.path || '#';
  const imageField = getFieldValue(article.pageThumbnail) ?? article.pageThumbnail?.jsonValue;
  const hasImage = Boolean(imageField?.value?.src);

  return (
    <Card
      className={cn(
        'border-border bg-background overflow-hidden shadow-none',
        layout === 'row' && '@md:flex-row'
      )}
      data-testid="blog-listing-card"
    >
      <Link href={href} className={cn('flex h-full', layout === 'row' ? 'flex-col @md:flex-row' : 'flex-col')}>
        {hasImage && (
          <div
            className={cn(
              'bg-muted relative overflow-hidden',
              layout === 'row' ? 'aspect-[16/9] @md:w-72 @md:shrink-0 @md:aspect-auto' : 'aspect-[16/9]'
            )}
          >
            <ContentSdkImage field={imageField} className="h-full w-full object-cover" />
          </div>
        )}
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          {shortTitle && (
            <Badge variant="secondary" className="font-body w-fit text-xs tracking-wide uppercase">
              {shortTitle}
            </Badge>
          )}
          <h3 className="font-heading text-foreground text-pretty text-xl font-normal tracking-tight @md:text-2xl">
            {title}
          </h3>
          {(date || readTime) && (
            <p className="text-muted-foreground text-sm">
              {[date, readTime].filter(Boolean).join(' · ')}
            </p>
          )}
          {summary && <p className="text-muted-foreground line-clamp-3 text-base">{summary}</p>}
        </CardContent>
      </Link>
    </Card>
  );
};

const BlogListingView = ({
  props,
  layout,
}: {
  props: BlogListingProps;
  layout: 'row' | 'card';
}): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = Boolean(props.isPageEditing || page?.mode?.isEditing);
  const { styles, RenderingIdentifier } = props.params || {};
  const datasource = props.fields?.data?.datasource;

  const [query, setQuery] = useState('');
  const [activeFacet, setActiveFacet] = useState('all');

  const articles = useMemo(() => getArticles(props.fields), [props.fields]);
  const facetConfig = parseFacetConfig(fieldText(datasource?.filterFacets));
  const configuredFacets = hasFacetConfig(fieldText(datasource?.filterFacets));
  const showFilters = isChecked(datasource?.showFilters) || isEditing;

  const taggedArticles = useMemo(
    () =>
      articles
        .map((article) => {
          const title = fieldText(article.pageHeaderTitle) || fieldText(article.pageTitle) || article.name || '';
          const haystack = [title, fieldText(article.pageSummary), fieldText(article.pageShortTitle), article.name]
            .filter(Boolean)
            .join(' ');
          return {
            article,
            title,
            haystack,
            tags: configuredFacets ? matchFacets(haystack, facetConfig) : [],
            dateValue: dateSortValue(fieldText(article.pageDisplayDate)),
          };
        })
        .sort((left, right) => right.dateValue - left.dateValue),
    [articles, configuredFacets, facetConfig]
  );

  const visibleFacets = useMemo(() => {
    const present = new Set(taggedArticles.flatMap((item) => item.tags));
    return facetConfig.filter((facet) => present.has(facet.label));
  }, [facetConfig, taggedArticles]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return taggedArticles.filter((item) => {
      const matchesQuery = !needle || item.haystack.toLowerCase().includes(needle);
      const matchesFacet = activeFacet === 'all' || item.tags.includes(activeFacet);
      return matchesQuery && matchesFacet;
    });
  }, [activeFacet, query, taggedArticles]);

  if (!datasource && !isEditing) {
    return <BlogListingEmpty />;
  }

  const emptyText = fieldText(datasource?.emptyResultsText) || 'No articles match your search.';
  const facetLabel = fieldText(datasource?.filterFacetLabel) || 'Topics';
  const searchPlaceholder = fieldText(datasource?.searchPlaceholder) || 'Search articles';

  return (
    <section
      className={cn('component blog-listing', styles)}
      id={RenderingIdentifier || undefined}
      data-testid="blog-listing"
    >
      <div className="component-content mx-auto max-w-6xl px-4 py-10 @md:px-6 @md:py-14">
        {(fieldText(datasource?.title) || isEditing) && (
          <Text
            tag="h1"
            field={datasource?.title?.jsonValue}
            className="font-heading text-foreground text-pretty text-3xl font-normal tracking-tight @md:text-5xl"
          />
        )}
        {(fieldText(datasource?.intro) || isEditing) && (
          <ContentSdkRichText
            field={datasource?.intro?.jsonValue}
            className="text-muted-foreground mt-4 max-w-3xl text-lg"
          />
        )}

        {showFilters && (
          <div className="mt-8 flex flex-col gap-4 @md:flex-row @md:items-center">
            <label className="sr-only" htmlFor="blog-listing-search">
              Search articles
            </label>
            <Input
              id="blog-listing-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="max-w-md"
            />
            {configuredFacets && visibleFacets.length > 0 && (
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">{facetLabel}</span>
                <select
                  className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                  value={activeFacet}
                  onChange={(event) => setActiveFacet(event.target.value)}
                  aria-label={facetLabel}
                >
                  <option value="all">All</option>
                  {visibleFacets.map((facet) => (
                    <option key={facet.label} value={facet.label}>
                      {facet.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {configuredFacets && visibleFacets.length > 0 && showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={cn(
                'rounded-full border px-3 py-1 text-xs tracking-wide uppercase',
                activeFacet === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'
              )}
              onClick={() => setActiveFacet('all')}
            >
              All
            </button>
            {visibleFacets.map((facet) => (
              <button
                key={facet.label}
                type="button"
                className={cn(
                  'rounded-full border px-3 py-1 text-xs tracking-wide uppercase',
                  activeFacet === facet.label
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border'
                )}
                onClick={() => setActiveFacet(facet.label)}
              >
                {facet.label}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-muted-foreground mt-10" data-testid="blog-listing-empty">
            {emptyText}
          </p>
        ) : (
          <div
            className={cn(
              'mt-10 grid gap-6',
              layout === 'card' ? '@md:grid-cols-2 @lg:grid-cols-3' : 'grid-cols-1'
            )}
          >
            {filtered.map((item) => (
              <BlogCard key={item.article.id || item.title} article={item.article} layout={layout} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const Default = (props: BlogListingProps): JSX.Element => (
  <BlogListingView props={props} layout="row" />
);

export const Cards = (props: BlogListingProps): JSX.Element => (
  <BlogListingView props={props} layout="card" />
);
