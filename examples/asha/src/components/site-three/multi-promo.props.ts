import type { CompatibleDatasource, CompatibleField, GraphQLDatasource } from '@/lib/component-props';
import type { ImageField, LinkField, Field } from '@sitecore-content-sdk/nextjs';

export interface SimplePromoFields {
  id: string;
  heading: CompatibleField<Field<string>>;
  description: CompatibleField<Field<string>>;
  image: CompatibleField<ImageField>;
  link: CompatibleField<LinkField>;
}

export interface MultiPromoFields {
  title?: CompatibleField<Field<string>>;
  description?: CompatibleField<Field<string>>;
  children: {
    results: SimplePromoFields[];
  };
}

export type MultiPromoDatasourceFields = GraphQLDatasource<MultiPromoFields>;

export type MultiPromoProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<MultiPromoFields>;
};

export type PromoItemProps = SimplePromoFields & {
  isHorizontal?: boolean;
};