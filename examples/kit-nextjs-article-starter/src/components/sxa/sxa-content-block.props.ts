import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export type ContentBlockProps = ComponentProps & {
  fields?: {
    heading?: Field<string>;
    content?: Field<string>;
  };
};
