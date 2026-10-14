import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export interface CLHeroFields {
  HeroTitle: Field<string>;
  HeroBody: Field<string>;
  HeroLink1: LinkField;
  HeroLink2: LinkField;
  HeroImage1: ImageField;
  HeroImage2: ImageField;
}

export type HeroProps = ComponentProps & {
  params: { [key: string]: string };
  fields: CLHeroFields;
};
