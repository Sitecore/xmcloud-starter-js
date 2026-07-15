import type { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type ContentBlockFields = {
  heading?: Field<string>;
  content?: Field<string>;
};

export type ContentBlockProps = OptionalComponentProps & {
  fields?: ContentBlockFields;
};

