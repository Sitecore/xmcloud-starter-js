'use client';
import { HTMLAttributes, useMemo } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ItemCardFrame, ItemListFrame, SearchItemVariant } from '../SearchItemCommon';
import { SearchDocument, SearchFieldsMapping } from '../models';
import { SearchItemTitle } from './SearchItemTitle';
import { SearchItemSummary } from './SearchItemSummary';
import { SearchItemLink } from './SearchItemLink';
import { SearchItemCategory } from './SearchItemCategory';
import { SearchItemTags } from './SearchItemTags';
import { SearchItemImage } from './SearchItemImage';

export type SearchItemFields = {
  summary?: Field<string>;
  subTitle?: Field<string>;
  category?: Field<string>;
  title?: Field<string>;
  tags?: Field<string[] | string>;
  link?: Field<string>;
  image?: Field<string>;
};

type SearchItemProps = {
  data: SearchDocument;
  mapping: SearchFieldsMapping;
  variant?: SearchItemVariant;
  onClick: () => void;
} & HTMLAttributes<HTMLDivElement>;

const getField = (
  fields: { [key: string]: string },
  key: keyof SearchDocument
): { value: string | string[] } | undefined => {
  if (!key) return undefined;
  const k = String(key);
  if (typeof fields?.[k] !== 'string') {
    return { value: fields[k] } as { value: string[] };
  }
  return { value: fields[k] } as { value: string };
};

export const SearchItem = ({ data, mapping, variant = 'card', onClick }: SearchItemProps) => {
  const isCard = variant === 'card';

  const fields = useMemo((): SearchItemFields => {
    const title = mapping.title ? (getField(data, mapping.title) as { value: string }) : undefined;
    return {
      title,
      image: mapping.images ? (getField(data, mapping.images) as { value: string }) : undefined,
      tags: mapping.tags
        ? (getField(data, mapping.tags) as { value: string | string[] })
        : undefined,
      summary: mapping.description
        ? (getField(data, mapping.description) as { value: string })
        : undefined,
      category: mapping.type ? (getField(data, mapping.type) as { value: string }) : undefined,
      link: mapping.link ? (getField(data, mapping.link) as { value: string }) : undefined,
    };
  }, [data, mapping]);

  const image = fields.image ? (
    <SearchItemImage image={fields.image} variant={variant} />
  ) : undefined;
  const components = (
    <>
      {fields.category && (
        <SearchItemCategory category={fields.category} className="line-clamp-2" />
      )}
      {fields.title && <SearchItemTitle text={fields.title} className="line-clamp-2" />}
      {fields.tags && <SearchItemTags tags={fields.tags} className="line-clamp-2" />}
      {fields.summary && <SearchItemSummary summary={fields.summary} className="line-clamp-3" />}
      {fields.link && <SearchItemLink link={fields.link} onClick={onClick} />}
    </>
  );

  return isCard ? (
    <ItemCardFrame image={image}>{components}</ItemCardFrame>
  ) : (
    <ItemListFrame image={image}>{components}</ItemListFrame>
  );
};
