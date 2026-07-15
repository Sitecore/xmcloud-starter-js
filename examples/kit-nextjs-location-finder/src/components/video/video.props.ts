import type { OptionalComponentProps } from '@/lib/component-props';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export interface VideoParams {
  darkPlayIcon?: string;
  useModal?: string;
  displayIcon?: string;
}

export interface VideoFields {
  video?: LinkField;
  image?: ImageField;
  title?: TextField;
  caption?: TextField;
}

export type VideoComponentProps = OptionalComponentProps & {
  params?: VideoParams;
  fields?: VideoFields;
};

