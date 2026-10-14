import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps, GraphQLDatasource } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type RichTextBlockProps = ComponentProps & RichTextFields;

export interface RichTextFields {
  fields:
    | GraphQLDatasource<{
        text: Field<string>;
      }>
    | {
    text: Field<string>;
      };
}
