import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps, GraphQLField } from '@/lib/component-props';

export type NewsListingArticle = {
  id?: string;
  name?: string;
  url?: { path?: string };
  pageTitle?: GraphQLField<Field<string>>;
  pageHeaderTitle?: GraphQLField<Field<string>>;
  pageThumbnail?: GraphQLField<ImageField>;
  sourceLink?: GraphQLField<LinkField>;
  titleAccent?: GraphQLField<Field<boolean | string>>;
};

export type NewsListingDatasource = NewsListingArticle & {
  title?: GraphQLField<Field<string>>;
  articles?: {
    targetItems?: NewsListingArticle[];
  };
  children?: {
    results?: NewsListingArticle[];
  };
};

export type NewsListingFields = {
  data?: {
    datasource?: NewsListingDatasource;
  };
};

export type NewsListingProps = ComponentProps & {
  fields?: NewsListingFields;
};
