import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import { CompatibleDatasource, CompatibleField, ComponentProps } from '@/lib/component-props';

interface VerticalImageAccordionParams {
  [key: string]: any; // eslint-disable-line
}

export interface AccordionItem {
  title: CompatibleField<Field<string>>;
  description: CompatibleField<Field<string>>;
  image: CompatibleField<ImageField>;
  cta?: CompatibleField<LinkField>;
}

interface VerticalImageAccordionDatasource {
  title?: CompatibleField<Field<string>>;
  items?: {
    results: AccordionItem[];
  };
}

interface VerticalImageAccordionFields {
  data: {
    datasource: VerticalImageAccordionDatasource;
  };
}

export interface VerticalImageAccordionProps extends ComponentProps {
  params: VerticalImageAccordionParams;
  fields: VerticalImageAccordionFields;
}
