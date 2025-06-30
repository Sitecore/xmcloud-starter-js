import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type RichTextBlockProps = ComponentProps & RichTextFields;

export interface RichTextFields {
  fields: {
    text: Field<string>;
  };
}
