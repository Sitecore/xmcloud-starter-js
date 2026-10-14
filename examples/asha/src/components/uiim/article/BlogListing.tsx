'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { RichText as ContentSdkRichText, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getFieldValue } from '@/lib/component-props';
import { hasFacetConfig, matchFacets, parseFacetConfig } from './blog-listing.facets';
import type { BlogListingArticle, BlogListingProps } from './blog-listing.props';
import {
  DEFAULT_FILTER_FACETS,
  articleNeedsDetails,
  getPlaceholderImage,
  getLayoutArticles,
  mergeArticles,
  resolveBlogsRoot,
  toPublicHref,
} from './blog-listing.util';

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

export { isArticlePage } from './blog-listing.util';

const BlogListingEmpty = (): JSX.Element => (
  <div className="component blog-listing">
    <div className="component-content">
      <span className="is-empty-hint">Blog Listing has no datasource. Select a BlogListing item.</span>
    </div>
  </div>
);

const BlogCard = ({
  article,
}: {
  article: BlogListingArticle;
}): JSX.Element => {
  const title = fieldText(article.pageHeaderTitle) || fieldText(article.pageTitle) || article.name || 'Untitled';
  const summary = fieldText(article.pageSummary);
  const shortTitle = fieldText(article.pageShortTitle);
  const date = formatDisplayDate(fieldText(article.pageDisplayDate));
  const readTime = fieldText(article.pageReadTime);
  const href = toPublicHref(article.url?.path, article.name);
  const image = getPlaceholderImage(article);

  return (
    <article
      className="border-border @md:grid @md:grid-cols-2 @md:items-center @md:gap-10"
      data-testid="blog-listing-card"
    >
      <Link href={href} className="bg-muted relative block aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-col gap-4 py-6 @md:py-0">
        {shortTitle && (
          <Badge variant="secondary" className="font-body w-fit text-xs tracking-wide uppercase">
            {shortTitle}
          </Badge>
        )}
        <h3 className="font-heading text-foreground text-pretty text-2xl font-normal tracking-tight @md:text-4xl">
          <Link href={href}>{title}</Link>
        </h3>
        {(date || readTime) && (
          <p className="text-muted-foreground text-sm">
            {[date, readTime].filter(Boolean).join(' · ')}
          </p>
        )}
        {summary && (
          <p className="text-muted-foreground line-clamp-3 text-base @md:text-lg" data-testid="blog-listing-summary">
            {summary}
          </p>
        )}
        <div>
          <Link href={href} className="btn btn-primary" data-testid="blog-listing-read-more">
            READ MORE
          </Link>
        </div>
      </div>
    </article>
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
  const hasAssignedDatasource = Boolean(datasource || props.rendering?.dataSource);

  const [query, setQuery] = useState('');
  const [activeFacet, setActiveFacet] = useState('all');
  const [fetchedArticles, setFetchedArticles] = useState<BlogListingArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const layoutArticles = useMemo(() => getLayoutArticles(props.fields), [props.fields]);
  const articles = useMemo(
    () => mergeArticles(layoutArticles, fetchedArticles),
    [fetchedArticles, layoutArticles]
  );
  const needsDetails = layoutArticles.length === 0 || layoutArticles.some(articleNeedsDetails);
  const authoredFacets = fieldText(datasource?.filterFacets);
  const facetConfig = parseFacetConfig(authoredFacets || DEFAULT_FILTER_FACETS);
  const configuredFacets = hasFacetConfig(authoredFacets || DEFAULT_FILTER_FACETS);
  const showFilters = isChecked(datasource?.showFilters) || isEditing || configuredFacets;
  const blogsRoot = resolveBlogsRoot(props, page);
  const language = page?.locale || 'en';

  useEffect(() => {
    if (!needsDetails) return undefined;

    let cancelled = false;
    setIsLoadingArticles(true);

    const ids = layoutArticles
      .map((article) => article.id)
      .filter((id): id is string => Boolean(id))
      .join(',');
    const params = new URLSearchParams({ root: blogsRoot, language });
    if (ids) params.set('ids', ids);

    fetch(`/api/blog-listing?${params.toString()}`)
      .then((response) => (response.ok ? response.json() : { articles: [] }))
      .then((data: { articles?: BlogListingArticle[] }) => {
        if (!cancelled) setFetchedArticles(data.articles ?? []);
      })
      .catch(() => {
        if (!cancelled) setFetchedArticles([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingArticles(false);
      });

    return () => {
      cancelled = true;
    };
  }, [blogsRoot, language, layoutArticles, needsDetails]);

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

  const visibleFacets = facetConfig;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return taggedArticles.filter((item) => {
      const matchesQuery = !needle || item.haystack.toLowerCase().includes(needle);
      const matchesFacet = activeFacet === 'all' || item.tags.includes(activeFacet);
      return matchesQuery && matchesFacet;
    });
  }, [activeFacet, query, taggedArticles]);

  if (!hasAssignedDatasource && !isEditing) {
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
          <div className="mt-8 grid gap-4 @md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">{searchPlaceholder}</span>
              <Input
                id="blog-listing-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
              />
            </label>
            {configuredFacets && (
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">{facetLabel}</span>
                <select
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={activeFacet}
                  onChange={(event) => setActiveFacet(event.target.value)}
                  aria-label={facetLabel}
                  data-testid="blog-listing-topic-filter"
                >
                  <option value="all">All topics</option>
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

        {isLoadingArticles && articles.length === 0 ? (
          <p className="text-muted-foreground mt-10" data-testid="blog-listing-loading">
            Loading articles...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground mt-10" data-testid="blog-listing-empty">
            {emptyText}
          </p>
        ) : (
          <div className="mt-10 flex flex-col gap-12 @md:gap-16">
            {filtered.map((item) => (
              <BlogCard key={item.article.id || item.title} article={item.article} />
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
  <BlogListingView props={props} layout="row" />
);
