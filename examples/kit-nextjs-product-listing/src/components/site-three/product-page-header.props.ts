import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { Enum } from 'types/enum';

export interface ProductImage {
  id: string;
  url: string;
}

export interface ProductPageHeaderFields {
  ProductName: Field<string>;
  Description: Field<string>;
  Price: Field<string>;
  Images: ProductImage[];
  Colors: Enum[];
  WarrantyLink: LinkField;
  ShippingLink: LinkField;
}

export type ProductPageHeaderProps = {
  params: { [key: string]: string };
  fields: ProductPageHeaderFields;
};