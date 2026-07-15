import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as TestimonialsDefault,
  Testimonials1,
  Testimonials2,
  Testimonials3,
  Testimonials4,
  Testimonials5,
  Testimonials6,
  Testimonials7,
  Testimonials8,
  Testimonials9,
} from '@/components/component-library/Testimonials';
import type { Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

// Mock dependencies
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="testimonials-text">{field?.jsonValue?.value}</span>,
  RichText: ({ field }: any) => (
    <div data-testid="testimonials-richtext">{field?.jsonValue?.value}</div>
  ),
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="testimonials-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="testimonials-image" alt="" />
  ),
  useSitecore: () => ({
    sitecoreContext: {
      pageEditing: false,
    },
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

jest.mock('shadcd/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button data-testid="testimonials-button" {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('shadcn/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: any) => (
    <div data-testid="testimonials-carousel" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="testimonials-carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="testimonials-carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: () => <button data-testid="testimonials-carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="testimonials-carousel-prev">Previous</button>,
}));

jest.mock('shadcd/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => (
    <div data-testid="testimonials-tabs" {...props}>
      {children}
    </div>
  ),
  TabsList: ({ children, ...props }: any) => (
    <div data-testid="testimonials-tabs-list" {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, ...props }: any) => (
    <button data-testid="testimonials-tabs-trigger" {...props}>
      {children}
    </button>
  ),
  TabsContent: ({ children, ...props }: any) => (
    <div data-testid="testimonials-tabs-content" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: () => <div data-testid="no-data-fallback">No data</div>,
}));

const defaultProps = {
  rendering: {
    componentName: 'Testimonials',
    params: {},
  },
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        title: { jsonValue: { value: 'Testimonials' } },
        tagLine: { jsonValue: { value: 'What Our Customers Say' } },
        children: {
          results: [
            {
              id: '1',
              caseStudyLink: { jsonValue: { value: { href: '/case-study-1' } } },
              customerName: { jsonValue: { value: 'Alice Johnson' } },
              customerCompany: { jsonValue: { value: 'Tech Corp' } },
              customerIcon: { jsonValue: { value: { src: '/customer1.jpg', alt: 'Customer 1' } } },
              testimonialBody: { jsonValue: { value: 'Great service!' } },
              testimonialIcon: {
                jsonValue: { value: { src: '/testimonial1.jpg', alt: 'Testimonial 1' } },
              },
              testimonialRating: { jsonValue: { value: '5' } },
            },
            {
              id: '2',
              caseStudyLink: { jsonValue: { value: { href: '/case-study-2' } } },
              customerName: { jsonValue: { value: 'Bob Smith' } },
              customerCompany: { jsonValue: { value: 'Innovation Inc' } },
              customerIcon: { jsonValue: { value: { src: '/customer2.jpg', alt: 'Customer 2' } } },
              testimonialBody: { jsonValue: { value: 'Highly recommended!' } },
              testimonialIcon: {
                jsonValue: { value: { src: '/testimonial2.jpg', alt: 'Testimonial 2' } },
              },
              testimonialRating: { jsonValue: { value: '4' } },
            },
          ],
        },
      },
    },
  },
  page: mockPageNormal,
};

describe('TestimonialsDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<TestimonialsDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders testimonial images', () => {
    render(<TestimonialsDefault {...defaultProps} />);
    const images = screen.getAllByTestId('testimonials-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders testimonial text', () => {
    render(<TestimonialsDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('testimonials-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders testimonial richtext', () => {
    render(<TestimonialsDefault {...defaultProps} />);
    const richtextElements = screen.getAllByTestId('testimonials-richtext');
    expect(richtextElements.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-testimonials-style' },
    };
    const { container } = render(<TestimonialsDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-testimonials-style');
  });

  it('handles empty testimonials list', () => {
    const propsWithEmpty = {
      ...defaultProps,
      fields: {
        data: {
          datasource: {
            ...defaultProps.fields.data.datasource,
            children: {
              results: [],
            },
          },
        },
      },
    };
    const { container } = render(<TestimonialsDefault {...propsWithEmpty} />);
    // Just verify it renders without crashing
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// Test all 9 variants to achieve 75%+ function coverage
describe('Testimonials Variants', () => {
  const variants = [
    { component: Testimonials1, name: 'Testimonials1' },
    { component: Testimonials2, name: 'Testimonials2' },
    { component: Testimonials3, name: 'Testimonials3' },
    { component: Testimonials4, name: 'Testimonials4' },
    { component: Testimonials5, name: 'Testimonials5' },
    { component: Testimonials6, name: 'Testimonials6' },
    { component: Testimonials7, name: 'Testimonials7' },
    { component: Testimonials8, name: 'Testimonials8' },
    { component: Testimonials9, name: 'Testimonials9' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      it('renders testimonial text', () => {
        render(<Component {...defaultProps} />);
        const textElements = screen.getAllByTestId('testimonials-text');
        expect(textElements.length).toBeGreaterThan(0);
      });

      it('applies custom styles', () => {
        const styledProps = {
          ...defaultProps,
          params: { styles: `custom-${name}` },
        };
        const { container } = render(<Component {...styledProps} />);
        expect(container.querySelector('section')).toHaveClass(`custom-${name}`);
      });
    });
  });
});
