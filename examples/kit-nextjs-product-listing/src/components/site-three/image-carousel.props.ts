import type { IGQLImageField } from '@/lib/component-props';

export interface ImageCarouselItem {
  id: string;
  image: IGQLImageField;
}

export interface ImageCarouselDatasourceFields {
  data: {
    datasource: {
      imageItems: {
        results: ImageCarouselItem[];
      };
    };
  };
}

export type ImageCarouselProps = {
  params: { [key: string]: string };
  fields: ImageCarouselDatasourceFields;
};