import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export interface RichTextFields {
  Text?: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields?: RichTextFields;
};
