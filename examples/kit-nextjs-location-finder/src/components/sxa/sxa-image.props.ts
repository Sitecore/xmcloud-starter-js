import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type SxaImageFields = {
  Image?: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption?: Field<string>;
  TargetUrl?: LinkField;
};

export type SxaImageProps = OptionalComponentProps & {
  fields?: SxaImageFields;
};

