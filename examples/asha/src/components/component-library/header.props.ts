import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { GraphQLDatasource } from '@/lib/component-props';

export interface HeaderFields {
  Tagline: Field<string>;
  Heading: Field<string>;
  Body: Field<string>;
  Link1: LinkField;
  Link2: LinkField;
  Image: ImageField;
  FormDisclaimer: Field<string>;
}

export type HeaderProps = {
  params: { [key: string]: string };
  fields: HeaderFields | GraphQLDatasource<HeaderFields>;
};

export type HeaderTemplateProps = HeaderProps & {
  centered?: boolean;
  withColumns?: boolean;
  withBackgroundImage?: boolean;
  withForm?: boolean;
};
