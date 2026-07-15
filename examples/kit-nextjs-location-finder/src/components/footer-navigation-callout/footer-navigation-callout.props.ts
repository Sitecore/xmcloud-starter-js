import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type FooterNavigationCalloutFields = {
  title?: Field<string>;
  description?: Field<string>;
  linkOptional?: LinkField;
};

export type FooterNavigationCalloutProps = Partial<OptionalComponentProps> & {
  fields: FooterNavigationCalloutFields;
};


