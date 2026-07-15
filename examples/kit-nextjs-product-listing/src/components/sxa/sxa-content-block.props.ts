import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export type ContentBlockProps = ComponentProps & {
  fields?: {
    heading?: Field<string>;
    content?: Field<string>;
  };
};
