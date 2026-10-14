import {
  TestimonialCarouselProps,
  TestimonialCarouselItemProps,
} from '../../components/testimonial-carousel/testimonial-carousel.props';
import { Field } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

const createMockTestimonialItem = (
  quote: string,
  attribution: string
): TestimonialCarouselItemProps => ({
  testimonialQuote: {
    jsonValue: createMockField(quote),
  },
  testimonialAttribution: {
    jsonValue: createMockField(attribution),
  },
});

export const defaultTestimonialCarouselProps: TestimonialCarouselProps = {
  rendering: { componentName: 'TestimonialCarousel' },
  params: {
    styles: 'testimonial-carousel-custom-styles',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            createMockTestimonialItem(
              'SYNC Audio has completely transformed my music production workflow. The clarity and precision of their headphones is unmatched.',
              'Sarah Johnson, Music Producer'
            ),
            createMockTestimonialItem(
              'As a professional sound engineer, I rely on SYNC equipment for critical listening. Their monitors deliver the accuracy I need.',
              'Michael Chen, Sound Engineer'
            ),
            createMockTestimonialItem(
              'The build quality and attention to detail in SYNC products is exceptional. These are tools that will last a lifetime.',
              'Elena Rodriguez, Audio Specialist'
            ),
          ],
        },
      },
    },
  },
  name: 'TestimonialCarousel',
  Testimonials: [],
};

export const testimonialCarouselPropsSingleItem: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            createMockTestimonialItem(
              'Outstanding audio quality that exceeds all expectations.',
              'John Smith, Audiophile'
            ),
          ],
        },
      },
    },
  },
};

export const testimonialCarouselPropsLongTestimonials: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            createMockTestimonialItem(
              'SYNC Audio has revolutionized my entire approach to music creation and sound design. Their headphones provide an incredibly detailed and accurate representation of the audio spectrum, allowing me to make precise mix decisions that translate perfectly across different playback systems. The comfort during long studio sessions is remarkable, and the build quality ensures these will be my go-to headphones for years to come. I cannot recommend SYNC Audio products highly enough for anyone serious about audio production.',
              'Alexandra Thompson, Grammy-winning Producer and Sound Designer'
            ),
            createMockTestimonialItem(
              'After spending over two decades in professional audio engineering, I can confidently say that SYNC Audio equipment represents the pinnacle of acoustic engineering. Their studio monitors have become an essential part of my reference setup, providing the flat response and imaging accuracy that is crucial for mastering work. Every detail in the frequency spectrum is rendered with surgical precision, enabling me to deliver mixes that sound exceptional on any playback system.',
              'David Martinez, Mastering Engineer at Sterling Sound Studios'
            ),
          ],
        },
      },
    },
  },
};

export const testimonialCarouselPropsSpecialChars: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            createMockTestimonialItem(
              "L'équipement SYNC Audio™ offre une qualité sonore exceptionnelle & des détails incroyables!",
              'François Dubois, Ingénieur du Son'
            ),
            createMockTestimonialItem(
              'SYNC Àudio ïs thë bëst chöice för prôfessïonal stüdio wörk. Ünmatched clarity & precision!',
              'Åse Møller, Lydtekniker'
            ),
          ],
        },
      },
    },
  },
};

export const testimonialCarouselPropsEmptyTestimonials: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [],
        },
      },
    },
  },
};

export const testimonialCarouselPropsNoQuoteOnly: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              testimonialQuote: {
                jsonValue: createMockField('Great sound quality and excellent build.'),
              },
              // No attribution
            },
          ],
        },
      },
    },
  },
};

export const testimonialCarouselPropsNoAttributionOnly: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              testimonialAttribution: {
                jsonValue: createMockField('Jane Doe, Customer'),
              },
              // No quote - this should still render
              testimonialQuote: {
                jsonValue: createMockField(''),
              },
            },
          ],
        },
      },
    },
  },
};

export const testimonialCarouselPropsEmptyFields: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: [createMockTestimonialItem('', ''), createMockTestimonialItem('', '')],
        },
      },
    },
  },
};

export const testimonialCarouselPropsNoFields: TestimonialCarouselProps = {
  rendering: { componentName: 'TestimonialCarousel' },
  params: {},
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: null as any,
  name: 'TestimonialCarousel',
  Testimonials: [],
};

export const testimonialCarouselPropsNoChildren: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: null as any,
      },
    },
  },
};

export const testimonialCarouselPropsNoDatasource: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      datasource: null as any,
    },
  },
};

export const testimonialCarouselPropsNoData: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null as any,
  },
};

export const testimonialCarouselPropsManyItems: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  fields: {
    data: {
      datasource: {
        children: {
          results: Array.from({ length: 8 }).map((_, i) =>
            createMockTestimonialItem(
              `This is testimonial quote number ${i + 1}. SYNC Audio provides excellent quality and performance.`,
              `Customer ${i + 1}, Professional User`
            )
          ),
        },
      },
    },
  },
};

export const testimonialCarouselPropsCustomStyles: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  params: {
    styles: 'custom-testimonial-carousel bg-dark text-light premium-styling',
  },
};

export const testimonialCarouselPropsNoStyles: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  params: {},
};

export const testimonialCarouselPropsUndefinedParams: TestimonialCarouselProps = {
  ...defaultTestimonialCarouselProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: undefined as any,
};

// Mock useSitecore contexts for testing
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
