import { LinkField, Field, ImageField } from '@sitecore-content-sdk/nextjs';

export type GqlField<T> = {
  jsonValue: T;
};

/**
 * WARNING Link languages are not correct GraphQL links. Use "languageLinksUtils"
 */
export type GqlLink = GqlField<LinkField>;

export type GqlFieldString = GqlField<Field<string>>;
export type GqlFieldBoolean = GqlField<Field<boolean>>;
export type GqlFieldNumber = GqlField<Field<number>>;

export type GqlImage = GqlField<ImageField>;
