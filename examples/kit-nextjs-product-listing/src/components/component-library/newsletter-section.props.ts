import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import type { GraphQLDatasource } from '@/lib/component-props';

export interface NewsletterSectionFields {
  Tagline: Field<string>;
  Heading: Field<string>;
  Body: Field<string>;
  Image: ImageField;
  FormDisclaimer: Field<string>;
}

export type NewsletterSectionProps = {
  params: { [key: string]: string };
  fields: NewsletterSectionFields | GraphQLDatasource<NewsletterSectionFields>;
};

export type NewsletterSectionTemplateProps = NewsletterSectionProps & {
  centered?: boolean;
  withColumns?: boolean;
  withBackgroundImage?: boolean;
  bordered?: boolean;
};
