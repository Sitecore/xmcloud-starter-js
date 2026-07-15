import type { CompatibleDatasource, CompatibleField, GraphQLDatasource } from '@/lib/component-props';
import type { ImageField, LinkField, Field } from '@sitecore-content-sdk/nextjs';

export interface FeatureItemFields {
  id: string;
  image: CompatibleField<ImageField>;
  heading: CompatibleField<Field<string>>;
}

export interface FeatureBannerFields {
  title: CompatibleField<Field<string>>;
  link: CompatibleField<LinkField>;
  children: {
    results: FeatureItemFields[];
  };
}

export type FeatureBannerDatasourceFields = GraphQLDatasource<FeatureBannerFields>;

export type FeatureBannerProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<FeatureBannerFields>;
};