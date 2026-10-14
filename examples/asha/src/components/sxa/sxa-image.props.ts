import type { CSSProperties } from 'react';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export interface SXAImageFields {
  Image?: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption?: Field<string>;
  TargetUrl?: LinkField;
}

export type ImageProps = ComponentProps & {
  params: { [key: string]: string };
  fields?: SXAImageFields;
};

export type BackgroundStyle = CSSProperties;
