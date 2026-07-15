import type { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type RichTextBlockFields = {
  text: Field<string>;
};

export type RichTextBlockProps = OptionalComponentProps & {
  fields: RichTextBlockFields;
};

