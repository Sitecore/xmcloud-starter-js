import { ComponentProps } from '@/lib/component-props';
import { Field } from '@sitecore-content-sdk/nextjs';

/**
 * Model used for Sitecore Component integration
 */

export type TestimonialCarouselItemProps = {
  testimonialAttribution?: {
    jsonValue: Field<string>;
  };
  testimonialQuote: {
    jsonValue: Field<string>;
  };
};

type TestimonialCarouselFields = {
  fields: {
    data: {
      datasource: {
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
