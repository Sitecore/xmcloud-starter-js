import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

interface ProductListingParams {
  [key: string]: any; // eslint-disable-line
}

interface ProductListingFields {
  data: {
    datasource: {
      title: { jsonValue: Field<string> };
      viewAllLink: { jsonValue: LinkField };

      products?: {
        targetItems: ProductItemProps[];
      };
    };
  };
}

export type ProductItemProps = {
  productName: {
    jsonValue: Field<string>;
  };
  productThumbnail: {
    jsonValue: ImageField;
  };
  productBasePrice: {
    jsonValue: Field<string>;
  };
  productFeatureTitle: {
    jsonValue: Field<string>;
  };
  productFeatureText: {
    jsonValue: Field<string>;
  };
  productDrivingRange: {
    jsonValue: Field<string>;
  };
  url?: {
    url?: string;
    path?: string;
  };
};

export interface ProductListingProps extends ComponentProps {
  params: ProductListingParams;
  fields: ProductListingFields;
  isPageEditing: boolean;
}
export interface ProductCardProps {
  product: ProductItemProps;
  link: LinkField;
  prefersReducedMotion: boolean;
  isPageEditing: boolean;
}
