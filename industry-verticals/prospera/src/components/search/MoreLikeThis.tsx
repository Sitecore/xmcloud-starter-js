'use client';

import { useEffect, useMemo, useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '@sitecore-content-sdk/nextjs/search';
import type { SearchDocument } from '@sitecore-content-sdk/search';
import { ComponentProps } from 'lib/component-props';
import { DEFAULT_IMG_URL } from '../../_data/customizations';

const RESULTS_LIMIT = 3;

type MoreLikeThisProps = ComponentProps & {
  params: ComponentProps['params'] & {
    SearchIndexId?: string;
  };
};

type MappedResult = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  ctaLabel: string;
};

const getStringField = (doc: SearchDocument, keys: Array<string | undefined>): string => {
  for (const key of keys) {
    if (!key) continue;
    const value = doc[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const mapResult = (doc: SearchDocument, index: number): MappedResult => {
  const title = getStringField(doc, ['title', 'name', 'Title', 'Name', 'ProductName']);
  const description = getStringField(doc, [
    'short_description',
    'shortDescription',
    'ShortDescription',
    'description',
    'summary',
    'excerpt',
    'Description',
    'Summary',
  ]);
  const imageUrl =
    getStringField(doc, ['image_url', 'image', 'Image', 'imageUrl', 'thumbnail', 'Thumbnail']) ||
    DEFAULT_IMG_URL;
  const url = getStringField(doc, ['url', 'link', 'Link', 'sc_url', 'path']);
  const ctaLabel =
    getStringField(doc, ['cta', 'cta_text', 'link_text', 'button_text', 'LinkText', 'Cta']) ||
    'Learn more';
  const id =
    getStringField(doc, ['id', 'sc_id', 'sc_item_id', 'item_id']) || `${title || 'result'}-${index}`;

  return { id, title, description, imageUrl, url, ctaLabel };
};

const EmptyState = ({ message }: { message: string }): JSX.Element => (
  <div className="component more-like-this akamai-brand px-6 py-8 text-sm text-neutral-600">
    {message}
  </div>
);

export const Default = (props: MoreLikeThisProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`.trimEnd();
  const pathname = usePathname();
  const [seedItemUrl, setSeedItemUrl] = useState('');

  const searchIndexId =
    props.params?.SearchIndexId?.trim() ||
    process.env.NEXT_PUBLIC_SEARCH_INDEX_ID?.trim() ||
    '';

  // Site-crawl MLT requires the absolute URL of the current page as the seed.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSeedItemUrl(window.location.href);
  }, [pathname]);

  const { results, isLoading, isSuccess, isError, error } = useSearch<SearchDocument>({
    searchIndexId,
    ...(seedItemUrl ? { seedItemUrl } : {}),
    pageSize: RESULTS_LIMIT,
    enabled: Boolean(searchIndexId && seedItemUrl),
  });

  const cards = useMemo(
    () => (results || []).slice(0, RESULTS_LIMIT).map((doc, index) => mapResult(doc, index)),
    [results]
  );

  if (!searchIndexId) {
    return (
      <EmptyState message="More Like This: set the Search Index ID in component parameters." />
    );
  }

  if (!seedItemUrl || isLoading) {
    return (
      <div
        className={`component more-like-this akamai-brand bg-[var(--brand-bg)] pb-14 ${sxaStyles}`}
        id={id || undefined}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: RESULTS_LIMIT }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse overflow-hidden rounded-[var(--akamai-card-radius)] bg-white/60 shadow-[var(--akamai-card-shadow)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        message={`More Like This: search failed${error?.message ? ` — ${error.message}` : '.'}`}
      />
    );
  }

  if (isSuccess && cards.length === 0) {
    return <EmptyState message="More Like This: no similar results found." />;
  }

  return (
    <div
      className={`component more-like-this akamai-brand bg-[var(--brand-bg)] pb-14 ${sxaStyles}`}
      id={id || undefined}
      style={{ fontFamily: 'var(--brand-heading-font)' }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col overflow-hidden rounded-[var(--akamai-card-radius)] bg-[var(--akamai-card-background)] shadow-[var(--akamai-card-shadow)]"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={card.imageUrl || DEFAULT_IMG_URL}
                  alt={card.title || 'Related content'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="m-0 text-xl font-bold leading-snug text-black">{card.title}</h3>
                {card.description ? (
                  <p className="mb-0 mt-3 flex-1 text-sm leading-relaxed text-black">
                    {card.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                {card.url ? (
                  <Link href={card.url} className="akamai-button-primary mt-5 inline-flex w-fit">
                    {card.ctaLabel}
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
