import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export interface FeaturedProductFields {
  ProductName: Field<string>;
  FeaturedImage: ImageField;
}

export interface FeaturedProduct {
  id: string;
  url: string;
  fields: FeaturedProductFields;
}

export interface MegaMenuItemFields {
  Title: Field<string>;
  Link: LinkField;
  FeaturedProduct: FeaturedProduct;
}

export type MegaMenuItemProps = ComponentProps & {
  params: { [key: string]: string };
  fields: MegaMenuItemFields;
};