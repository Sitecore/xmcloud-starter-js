import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export interface CallToActionFields {
  CTATitle: Field<string>;
  CTABody: Field<string>;
  CTALink1: LinkField;
  CTALink2: LinkField;
  CTAImage: ImageField;
}

export type CTAProps = ComponentProps & {
  params: { [key: string]: string };
  fields: CallToActionFields;
};
