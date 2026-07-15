import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type PromoBlockParams = {
  orientation?: string;
  variation?: string;
  [key: string]: unknown;
};

export type PromoBlockFields = {
  heading: Field<string>;
  description: Field<string>;
  image: ImageField;
  link?: LinkField;
};

export type PromoBlockProps = OptionalComponentProps & {
  params: PromoBlockParams;
  fields: PromoBlockFields;
};

export type PromoBlockVariationClassesProps = {
  container: string;
  image: string;
  copy: string;
  row: {
    initial: string;
  };
};

