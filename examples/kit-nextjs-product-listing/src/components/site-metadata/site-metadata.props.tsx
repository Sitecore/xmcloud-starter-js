import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps, GraphQLDatasource } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type SiteMetadataProps = ComponentProps & SiteMetadataFields;

export type SiteMetadataFields = {
  fields: GraphQLDatasource<SiteMetadataFieldValues> | SiteMetadataFieldValues;
};

export type SiteMetadataFieldValues = {
  title?: Field<string>;
  metadataTitle?: Field<string>;
  metadataAuthor?: Field<string>;
  metadataKeywords?: Field<string>;
  metadataDescription?: Field<string>;
};
