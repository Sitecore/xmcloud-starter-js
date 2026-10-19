import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MediaCarousel } from '../../components/testimonial-carousel/TestimonialCarousel';
import type { TestimonialCarouselProps } from '../../components/testimonial-carousel/testimonial-carousel.props';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      mode: { isEditing: false, isPreview: false },
      layout: { sitecore: { route: { name: 'Home', itemLanguage: 'en' } } },
    },
  }),
  Text: ({ field }: { field?: { value?: string } }) => <span>{field?.value}</span>,
}));

const mockEvent = jest.fn().mockReturnValue(Promise.resolve());
jest.mock('@sitecore-content-sdk/events', () => ({
  event: (payload: unknown) => mockEvent(payload),
}));

const mediaProps = {
  params: {},
  fields: {
    data: {
      datasource: {
        title: { jsonValue: { value: 'See What Our Customers Have to Say' } },
        children: {
          results: [
            {
              id: 'shelby',
              testimonialAttribution: {
                jsonValue: { value: 'Shelby Ford | Customer Since 2010' },
              },
              testimonialQuote: {
                jsonValue: {
                  value:
                    'Another thing I love about Melaleuca is that they choose to use safer ingredients.',
                },
              },
              image: {
                jsonValue: {
                  value: {
                    src: 'https://cdnsc1.melaleuca.com/na/images/product-store/testimonials/vid-thumb-ford.jpg',
                    alt: 'Shelby Ford',
                  },
                },
              },
              videoLink: {
                jsonValue: {
                  value: {
                    href: 'https://video-us.melaleuca.com/shelby.mp4',
                    text: '1:15',
                  },
                },
              },
            },
            {
              id: 'heather',
              testimonialAttribution: {
                jsonValue: { value: 'Heather & Alan Guzzino | Customers Since 2016' },
              },
              testimonialQuote: {
                jsonValue: { value: 'Melaleuca products are trusted.' },
              },
              image: { jsonValue: { value: { src: 'https://example.com/heather.jpg', alt: 'Heather' } } },
              videoLink: { jsonValue: { value: { href: 'https://example.com/heather.mp4', text: '1:01' } } },
            },
          ],
        },
      },
    },
  },
} as unknown as TestimonialCarouselProps;

describe('TestimonialCarousel MediaCarousel', () => {
  beforeEach(() => {
    mockEvent.mockClear();
  });

  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  it('renders the homepage heading, poster, and customer copy', () => {
    render(<MediaCarousel {...mediaProps} />);

    expect(screen.getByRole('heading', { name: 'See What Our Customers Have to Say' })).toBeInTheDocument();
    expect(screen.getByText('Our Customers').className).toContain('font-bold');
    expect(screen.getByRole('img', { name: 'Shelby Ford' })).toHaveAttribute(
      'src',
      'https://cdnsc1.melaleuca.com/na/images/product-store/testimonials/vid-thumb-ford.jpg'
    );
    expect(screen.getByText('Shelby Ford')).toBeInTheDocument();
    expect(screen.getByText('Customer Since 2010')).toBeInTheDocument();
    expect(screen.getByText(/safer ingredients/)).toBeInTheDocument();
    expect(screen.getByText('1:15')).toBeInTheDocument();
  });

  it('uses an external image path stored on the raw Image field', () => {
    const props = {
      ...mediaProps,
      fields: {
        data: {
          datasource: {
            title: { jsonValue: { value: 'See What Our Customers Have to Say' } },
            children: {
              results: [
                {
                  id: 'heather',
                  testimonialAttribution: {
                    jsonValue: { value: 'Heather & Alan Guzzino | Customers Since 2016' },
                  },
                  testimonialQuote: { jsonValue: { value: 'Melaleuca products are trusted.' } },
                  image: {
                    value:
                      '<image alt="Heather and Alan Guzzino" src="https://cdnsc1.melaleuca.com/na/images/product-store/testimonials/vid-thumb-guzzino.jpg" />',
                    jsonValue: { value: {} },
                  },
                  videoLink: { jsonValue: { value: { href: 'https://example.com/heather.mp4', text: '1:01' } } },
                },
              ],
            },
          },
        },
      },
    } as unknown as TestimonialCarouselProps;

    render(<MediaCarousel {...props} />);

    expect(screen.getByRole('img', { name: 'Heather and Alan Guzzino' })).toHaveAttribute(
      'src',
      'https://cdnsc1.melaleuca.com/na/images/product-store/testimonials/vid-thumb-guzzino.jpg'
    );
  });

  it('moves to the next customer and pauses the slideshow', () => {
    render(<MediaCarousel {...mediaProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(screen.getByText('Heather & Alan Guzzino')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stop automatic slide show' }));
    expect(screen.getByRole('button', { name: 'Start automatic slide show' })).toBeInTheDocument();
  });

  it('sends video-played with the video that started', () => {
    render(<MediaCarousel {...mediaProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play video, 1:15' }));

    expect(mockEvent).toHaveBeenCalledWith({
      type: 'video-played',
      channel: 'WEB',
      language: 'EN',
      page: 'Home',
      extensionData: {
        videoUrl: 'https://video-us.melaleuca.com/shelby.mp4',
        videoTitle: 'Shelby Ford',
        duration: '1:15',
      },
    });
  });
});
