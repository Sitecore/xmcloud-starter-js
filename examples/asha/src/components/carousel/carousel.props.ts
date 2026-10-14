import type { CompatibleDatasource, CompatibleField } from '@/lib/component-props';
import type { ImageField, LinkField, Field } from '@sitecore-content-sdk/nextjs';

export interface CarouselFields {
  id: string;
  callToAction: CompatibleField<LinkField>;
  title: CompatibleField<Field<string>>;
  bodyText: CompatibleField<Field<string>>;
  slideImage: CompatibleField<ImageField>;
}

export interface CarouselChildren {
  results?: Array<CarouselFields | null | undefined>;
  nodes?: Array<CarouselFields | null | undefined>;
}

export interface CarouselDatasourceFields {
  children?: CarouselChildren | CarouselFields[];
  title: CompatibleField<Field<string>>;
  tagLine: CompatibleField<Field<string>>;
}

export type CarouselsProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<CarouselDatasourceFields>;
};
