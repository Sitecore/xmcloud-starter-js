import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export interface SXAImageFields {
  Image?: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption?: Field<string>;
  TargetUrl?: LinkField;
}

export type SXAImageProps = {
  params: { [key: string]: string };
  fields?: SXAImageFields;
};
