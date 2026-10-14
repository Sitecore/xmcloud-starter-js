import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import type { Enum } from 'types/enum';

export interface ProductFields {
  id: string;
  url: string;
  fields: {
    ProductName: Field<string>;
    Price: Field<string>;
    ProductImage: ImageField;
    AmpPower: Field<string>;
    Specifications: Enum[];
  };
}

export interface ProductComparisonFields {
  Title: Field<string>;
  id: string;
  url: string;
  Products: ProductFields[];
}

export type ProductComparisonProps = {
  params: { [key: string]: string };
  fields: ProductComparisonFields;
};