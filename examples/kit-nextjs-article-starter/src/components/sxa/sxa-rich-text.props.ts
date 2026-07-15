import { Field } from '@sitecore-content-sdk/nextjs';

export interface RichTextFields {
  Text?: Field<string>;
}

export type RichTextProps = {
  params: { [key: string]: string };
  fields?: RichTextFields;
};
