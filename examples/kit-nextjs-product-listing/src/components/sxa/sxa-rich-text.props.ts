import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export interface RichTextFields {
  Text?: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields?: RichTextFields;
};
