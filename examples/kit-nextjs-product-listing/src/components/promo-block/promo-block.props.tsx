import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type PromoBlockProps = ComponentProps & PromoBlockParams & PromoBlockFields;

// Component Rendering Parameter fields
export type PromoBlockParams = {
  params: {
    orientation?: string;
  };
};

export type PromoBlockFields = {
  fields: {
    heading: Field<string>;
    description: Field<string>;
    image: ImageField;
    link?: LinkField;
  };
};

export type PromoBlockVariationClassesProps = {
  container: string;
  image: string;
  copy: string;
  row: {
    initial: string;
  };
};
