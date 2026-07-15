import { Field, LinkField } from '@sitecore-content-sdk/nextjs';

export interface FooterNavigationCalloutFields {
  title?: Field<string>;
  description?: Field<string>;
  linkOptional?: LinkField;
}

export interface FooterNavigationCalloutProps {
  fields?: FooterNavigationCalloutFields;
}
