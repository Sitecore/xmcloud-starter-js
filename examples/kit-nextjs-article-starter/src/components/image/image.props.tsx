import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type ImageProps = ComponentProps & ImageFields;

export type ImageFields = {
  fields: {
    image: ImageField; // Sitecore editable image field
    caption?: Field<string>;
  };
};
