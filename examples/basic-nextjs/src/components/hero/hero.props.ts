import { Field, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface HeroParams {
  [key: string]: any; // eslint-disable-line
}

export interface HeroFields {
  title: Field<string>;
  image: ImageField;
  description?: Field<string>;
  bannerText?: Field<string>;
  bannerCTA?: LinkField;
  searchLink?: LinkField;
  dictionary: {
    SubmitCTALabel?: string;
    ZipPlaceholder?: string;
  };
}

export interface HeroProps extends ComponentProps {
  params: HeroParams;
  fields: HeroFields;
  isPageEditing?: boolean;
}
