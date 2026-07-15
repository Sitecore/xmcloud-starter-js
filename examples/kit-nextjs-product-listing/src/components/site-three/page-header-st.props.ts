import type { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';

export interface PageHeaderSTFields {
  Title: Field<string>;
  Body: RichTextField;
  Image: ImageField;
}

export type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: PageHeaderSTFields;
};