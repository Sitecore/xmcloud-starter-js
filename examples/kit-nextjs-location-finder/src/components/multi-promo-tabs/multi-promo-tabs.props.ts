/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ImageField, LinkField, Page } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

interface MultiPromoTabsParams {
  [key: string]: any;
}

export interface MultiPromoTabsFields {
  isEditMode?: boolean;
  title?: { jsonValue: Field<string> };
  image1?: { jsonValue: ImageField };
  link1?: { jsonValue: LinkField };
  image2?: { jsonValue: ImageField };
  link2?: { jsonValue: LinkField };
  page?: Page; // Optional page prop for ImageWrapper
}

export interface MultiPromoTabsProps extends OptionalComponentProps {
  params: MultiPromoTabsParams;
  fields: {
    data: {
      datasource: {
        title?: { jsonValue: Field<string> };
        droplistLabel?: { jsonValue: Field<string> };
        children?: {
          results: MultiPromoTabsFields[];
        };
      };
    };
  };
}

export type MultiPromoItemProps = OptionalComponentProps & MultiPromoTabsFields;


