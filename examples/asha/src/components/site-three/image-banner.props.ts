import type { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';

export interface ImageBannerFields {
  Title: Field<string>;
  Body: RichTextField;
  Image1: ImageField;
  Image2: ImageField;
  Image3: ImageField;
}

export type ImageBannerProps = {
  params: { [key: string]: string };
  fields: ImageBannerFields;
};