import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type VerticalImageAccordionParams = {
  [key: string]: unknown;
};

export type VerticalImageAccordionItem = {
  title: { jsonValue: Field<string> };
  description: { jsonValue: Field<string> };
  image: ImageField;
  cta?: { jsonValue: LinkField };
};

export type VerticalImageAccordionFields = {
  data: {
    datasource: {
      title?: { jsonValue: Field<string> };
      items?: {
        results: VerticalImageAccordionItem[];
      };
    };
  };
};

export type VerticalImageAccordionProps = OptionalComponentProps & {
  params: VerticalImageAccordionParams;
  fields: VerticalImageAccordionFields;
};

