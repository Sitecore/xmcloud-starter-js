import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

interface ImageCarouselParams {
  [key: string]: any; // eslint-disable-line
}

interface ImageCarouselFields {
  data: {
    datasource: {
      title: { jsonValue: Field<string> };
      imageItems: { results: imageCarouselItem[] };
    };
  };
}

export interface imageCarouselItem {
  image: { jsonValue: ImageField };
  backgroundText: { jsonValue: Field<string> };
  link: { jsonValue: LinkField };
}

export interface ImageCarouselProps extends ComponentProps {
  params: ImageCarouselParams;
  fields: ImageCarouselFields;
  isPageEditing: boolean;
}
