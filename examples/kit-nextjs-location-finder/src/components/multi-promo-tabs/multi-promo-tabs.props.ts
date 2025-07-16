/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

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
}

export interface MultiPromoTabsProps extends ComponentProps {
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

export type MultiPromoItemProps = ComponentProps & MultiPromoTabsFields;
