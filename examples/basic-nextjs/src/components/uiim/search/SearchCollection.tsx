'use client';
import { useEffect, useMemo, useState } from 'react';
import { hasText } from '@/lib/field-utils';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { useSearch } from '@sitecore-content-sdk/nextjs/search';
import { ComponentProps } from '@/lib/component-props';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_MAX_ITEMS } from '@/lib/search-ui/constants';
import { stripHtml, formatDate, extractImageUrl } from '@/lib/search-ui/text';
import { useSearchLabels } from '@/lib/search-ui/useSearchLabels';
import { useSearchEvents } from '@/lib/search-ui/useSearchEvents';
import { searchLocale } from '@/lib/search-ui/locale';
import { normalizeItemId } from '@/lib/search-ui/facets';

interface SearchCollectionFields {
  SearchIndex?: Field<string>;
  TitleMapping?: Field<string>;
  DescriptionMapping?: Field<string>;
  ImageMapping?: Field<string>;
  LinkMapping?: Field<string>;
  DateMapping?: Field<string>;
  SortBy?: Field<string>;
  SortOrder?: Field<string>;
  MaxItems?: Field<string>;
  Heading?: Field<string>;
  /** Checkbox: More Like This seeded by the current page instead of browse mode. */
  RelatedToCurrentPage?: Field<boolean | string>;
}

const isChecked = (value: unknown): boolean => value === true || value === '1' || value === 'true';

interface SearchCollectionProps extends ComponentProps {
  fields: SearchCollectionFields;
}

// Structurally matches the SDK's SearchDocument constraint (not re-exported by
// the nextjs submodule).
type SearchDoc = { [key: string]: string | number | boolean | (string | number | boolean)[] };

const docValue = (doc: SearchDoc, attribute: string | undefined): string => {
  if (!attribute) return '';
  const value = doc[attribute];
  return typeof value === 'string' ? value : '';
};

const CollectionImage = ({ src, alt }: { src: string; alt: string }) => {
  const [broken, setBroken] = useState(false);
  return (
    <div className="bg-muted relative h-44 w-full overflow-hidden rounded-t-lg">
      {!broken ? (
        <Image fill src={src} alt={alt} className="object-cover" onError={() => setBroken(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff className="size-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

const SkeletonCard = () => (
  <Card className="overflow-hidden" data-testid="search-skeleton">
    <div className="bg-muted h-44 w-full animate-pulse" />
    <CardContent className="space-y-3 p-5">
      <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
      <div className="bg-muted h-4 w-full animate-pulse rounded" />
      <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
    </CardContent>
  </Card>
);

const EmptyStateFallback = () => (
  <div className="component search-collection">
    <span className="is-empty-hint">SearchCollection</span>
  </div>
);

export const Default = (props: SearchCollectionProps) => {
  const { fields, params, page, rendering } = props;
  const label = useSearchLabels(page?.siteName);

  const isEditing = page?.mode?.isEditing ?? false;
  const isPreview = page?.mode?.isPreview ?? false;
  const live = !isEditing && !isPreview;

  const searchIndexId = fields?.SearchIndex?.value ?? '';
  const mapping = {
    title: fields?.TitleMapping?.value || undefined,
    description: fields?.DescriptionMapping?.value || undefined,
    image: fields?.ImageMapping?.value || undefined,
    link: fields?.LinkMapping?.value || undefined,
    date: fields?.DateMapping?.value || undefined,
  };

  const maxItems = Number(fields?.MaxItems?.value) || DEFAULT_MAX_ITEMS;

  // Related mode: More Like This seeded by the current route item. The API keys
  // documents by the dashed lowercase GUID (undashed returns nothing, braces 500).
  const related = isChecked(fields?.RelatedToCurrentPage?.value);
  const seedItemId = related ? normalizeItemId(page?.layout?.sitecore?.route?.itemId) : '';

  const sortBy = related ? '' : fields?.SortBy?.value || '';
  const sortOrder = fields?.SortOrder?.value === 'asc' ? 'asc' : 'desc';

  // Stable identity is load-bearing: useSearch re-runs when `sort` changes,
  // and an inline object literal changes every render (= infinite fetch loop).
  const sort = useMemo(
    () => (sortBy ? ({ name: sortBy, order: sortOrder } as const) : undefined),
    [sortBy, sortOrder],
  );

  // Browse mode: empty keyphrase returns the whole index, the sort makes it a
  // "latest N" strip. No input, no pagination — search as content
  // infrastructure.
  // Related mode asks for one extra item so excluding the current page (the API
  // already omits the seed; this is a safety net) still fills the strip.
  const { results: rawResults, total, isLoading, isSuccess } = useSearch<SearchDoc>({
    searchIndexId,
    page: 1,
    pageSize: related ? maxItems + 1 : maxItems,
    sort,
    locale: searchLocale(page),
    enabled: live && !!searchIndexId && (!related || !!seedItemId),
    ...(related ? { seedItemId: seedItemId || undefined } : { query: '' }),
  });
  const results = related
    ? rawResults
        .filter((doc) => normalizeItemId(docValue(doc, 'sc_item_id')) !== seedItemId)
        .slice(0, maxItems)
    : rawResults;

  const sendEvent = useSearchEvents({ query: '', uid: rendering?.uid, page });

  useEffect(() => {
    if (isSuccess && total > 0) sendEvent('viewed');
  }, [isSuccess, total, sendEvent]);

  if (!fields || !searchIndexId) {
    return isEditing ? <EmptyStateFallback /> : null;
  }

  const showSkeletons = isLoading || ((isEditing || isPreview) && results.length === 0);

  // A zero-input strip with nothing to show should disappear, not explain
  // itself — the empty state is silence (live only; authoring shows skeletons).
  // Related mode without a resolvable route item (e.g. a non-page context) has nothing to seed.
  if (live && related && !seedItemId) {
    return null;
  }

  if (live && !showSkeletons && results.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('component search-collection', params?.styles)}
      id={params?.RenderingIdentifier || undefined}
    >
      <div className="mx-auto max-w-7xl p-6">
        {(hasText(fields.Heading?.value) || isEditing) && (
          <Text
            field={fields.Heading}
            tag="h2"
            className="text-foreground mb-6 text-2xl font-bold"
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {showSkeletons &&
            Array.from({ length: maxItems }).map((_, i) => <SkeletonCard key={i} />)}

          {!isLoading &&
            results.map((doc) => {
              const title = docValue(doc, mapping.title);
              const description = docValue(doc, mapping.description);
              const image = extractImageUrl(mapping.image ? doc[mapping.image] : '');
              const link = docValue(doc, mapping.link);
              const date = formatDate(docValue(doc, mapping.date) || undefined, page?.locale || 'en');

              return (
                <Card key={docValue(doc, 'sc_item_id') || title} className="overflow-hidden">
                  {image && <CollectionImage src={image} alt={title} />}
                  <CardContent className="p-5">
                    {date && <p className="text-muted-foreground mb-2 text-sm">{date}</p>}
                    {title && (
                      <h3 className="text-foreground mb-2 line-clamp-2 text-lg font-semibold">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="text-muted-foreground mb-3 line-clamp-3">
                        {stripHtml(description)}
                      </p>
                    )}
                    {link && (
                      <a
                        href={link}
                        onClick={() => sendEvent('clicked')}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        {label('READ_MORE')}
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </section>
  );
};
