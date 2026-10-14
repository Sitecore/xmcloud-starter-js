import { ComponentProps } from '@/lib/component-props';
import { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';

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

interface VideoComponentFields {
  params?: VideoParams;
  fields?: VideoFields;
}

export type VideoComponentProps = ComponentProps & VideoComponentFields;
