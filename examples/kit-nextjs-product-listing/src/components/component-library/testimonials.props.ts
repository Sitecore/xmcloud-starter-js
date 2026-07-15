import type { ComponentProps, IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from '@/lib/component-props';

export interface TestimonialFields {
  id: string;
  caseStudyLink: IGQLLinkField;
  customerName: IGQLTextField;
  customerCompany: IGQLTextField;
  customerIcon: IGQLImageField;
  testimonialBody: IGQLRichTextField;
  testimonialIcon: IGQLImageField;
  testimonialRating: IGQLTextField;
}

export interface TestimonialsDatasourceFields {
  data: {
    datasource: {
      children: {
        results: TestimonialFields[];
      };
      title: IGQLTextField;
      tagLine: IGQLTextField;
    };
  };
}

export type TestimonialsProps = ComponentProps & {
  fields: TestimonialsDatasourceFields;
};

export type TestimonialCardProps = ComponentProps & {
  testimonial: TestimonialFields;
  type: 'simple' | 'centered' | 'boxed' | 'large';
  withRating?: boolean;
  withLogo?: boolean;
  className?: string;
};
