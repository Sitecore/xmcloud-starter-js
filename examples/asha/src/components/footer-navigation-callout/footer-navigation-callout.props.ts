import { Field, LinkField } from '@sitecore-content-sdk/nextjs';

interface FooterNavigationCalloutFields {
  title?: Field<string>;
  description?: Field<string>;
  linkOptional?: LinkField;
}

export interface FooterNavigationCalloutProps {
  fields: FooterNavigationCalloutFields;
}
