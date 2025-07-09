import { TestimonialCarouselItemProps } from './testimonial-carousel.props';
import type React from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';

export const Default: React.FC<TestimonialCarouselItemProps> = (props) => {
  const { testimonialAttribution, testimonialQuote } = props;
  return (
    <div className="px-4">
      {testimonialAttribution?.jsonValue && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-[24px]">
            <svg
              width="35"
              height="25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-accent inline-block h-8 w-8"
              aria-hidden="true"
            >
              <path
                d="M26 25c-5 0-7-2-7-6v-1c0-6 4-13 9-18h7c-4 4-6 7-7 12 2 1 4 3 4 6v1c0 4-2 6-6 6ZM6 25c-4 0-6-2-6-6v-1C0 12 3 5 9 0h7c-4 4-7 7-8 12 3 1 4 3 4 6v1c0 4-2 6-6 6Z"
                fill="currentColor"
              />
            </svg>
            <Text
              tag="p"
              className="text-primary text-sm font-semibold uppercase tracking-wide"
              field={testimonialAttribution.jsonValue}
            />
          </div>
        </div>
      )}
      <div className="space-y-4">
        {testimonialQuote?.jsonValue && (
          <Text
            tag="p"
            className="text-primary @md:text-4xl  @lg:text-5xl font-heading text-3xl font-normal tracking-tight"
            field={testimonialQuote.jsonValue}
          />
        )}
      </div>
    </div>
  );
};
