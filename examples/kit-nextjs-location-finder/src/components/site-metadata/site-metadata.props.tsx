import type { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type SiteMetadataFields = {
  title?: Field<string>;
  metadataTitle?: Field<string>;
  metadataAuthor?: Field<string>;
  metadataKeywords?: Field<string>;
  metadataDescription?: Field<string>;
};

export type SiteMetadataProps = OptionalComponentProps & {
  fields: SiteMetadataFields;
};

