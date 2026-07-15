import type { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type RichTextFields = {
  Text?: Field<string>;
};

export type RichTextProps = OptionalComponentProps & {
  fields?: RichTextFields;
};

