import type { IGQLImageField, IGQLLinkField, IGQLTextField } from '@/types/igql';
import type { OptionalComponentProps } from '@/lib/component-props';

export type CarouselItemFields = {
  id: string;
  callToAction: IGQLLinkField;
  title: IGQLTextField;
  bodyText: IGQLTextField;
  slideImage: IGQLImageField;
};

export type CarouselFields = {
  data: {
    datasource: {
      children: {
        results: CarouselItemFields[];
      };
      title: IGQLTextField;
      tagLine: IGQLTextField;
    };
  };
};

export type CarouselProps = OptionalComponentProps & {
  fields: CarouselFields;
};

