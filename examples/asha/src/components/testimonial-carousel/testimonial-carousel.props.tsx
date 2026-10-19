import { ComponentProps } from '@/lib/component-props';
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

/**
 * Model used for Sitecore Component integration
 */

export type TestimonialCarouselItemProps = {
  id?: string;
  testimonialAttribution?: {
    jsonValue: Field<string>;
  };
  testimonialQuote: {
    jsonValue: Field<string>;
  };
  image?: {
    value?: string;
    jsonValue?: ImageField;
  };
  videoLink?: {
    jsonValue?: LinkField;
  };
};

type TestimonialCarouselFields = {
  fields: {
    data: {
      datasource: {
        title?: { jsonValue?: Field<string> };
        children: { results: TestimonialCarouselItemProps[] };
      };
    };
  };
};

export type TestimonialCarouselProps = ComponentProps &
  TestimonialCarouselFields & {
    name: string;
    Testimonials: React.Component[];
  };
