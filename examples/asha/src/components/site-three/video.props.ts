import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export interface VideoParams {
  darkPlayIcon?: string;
  useModal?: string;
  displayIcon?: string;
}

export interface VideoFields {
  video?: LinkField;
  image?: ImageField;
  image2?: ImageField;
  title?: TextField;
  caption?: TextField;
}

export interface VideoComponentFields {
  params?: VideoParams;
  fields?: VideoFields;
}

export type VideoComponentProps = ComponentProps & VideoComponentFields;