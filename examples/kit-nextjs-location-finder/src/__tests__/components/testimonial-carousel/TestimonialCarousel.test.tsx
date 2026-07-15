import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as TestimonialCarousel } from '@/components/testimonial-carousel/TestimonialCarousel';
import {
  mockTestimonialCarouselProps,
  mockTestimonialCarouselPropsEmpty,
} from './testimonial-carousel.mock.props';

// Mock UI carousel components
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({
    children,
    setApi,
    className,
  }: {
    children: React.ReactNode;
    setApi?: (api: {
      selectedScrollSnap: () => number;
      canScrollPrev: () => boolean;
      canScrollNext: () => boolean;
      on: (event: string, callback: () => void) => void;
      rootNode: () => { addEventListener: () => void; removeEventListener: () => void };
      scrollNext: () => void;
      scrollPrev: () => void;
    }) => void;
    className?: string;
    opts?: { align?: string; loop?: boolean };
  }) => {
    React.useEffect(() => {
      if (setApi) {
        setApi({
          selectedScrollSnap: () => 0,
          canScrollPrev: () => true,
          canScrollNext: () => true,
          on: jest.fn(),
          rootNode: () => ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          }),
          scrollNext: jest.fn(),
          scrollPrev: jest.fn(),
        });
      }
    }, [setApi]);
    return (
      <div data-testid="carousel" className={className}>
        {children}
      </div>
    );
  },
  CarouselContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="carousel-content" className={className}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="carousel-item" className={className}>
      {children}
    </div>
  ),
  CarouselPrevious: ({
    className,
    disabled,
  }: {
    className?: string;
    disabled?: boolean;
    variant?: string;
    onFocus?: () => void;
    onBlur?: () => void;
  }) => (
    <button data-testid="carousel-previous" className={className} disabled={disabled}>
      Previous
    </button>
  ),
  CarouselNext: ({
    className,
    disabled,
  }: {
    className?: string;
    disabled?: boolean;
    variant?: string;
    onFocus?: () => void;
    onBlur?: () => void;
  }) => (
    <button data-testid="carousel-next" className={className} disabled={disabled}>
      Next
    </button>
  ),
}));

// Mock TestimonialCarouselItem
jest.mock('@/components/testimonial-carousel/TestimonialCarouselItem', () => ({
  Default: ({ testimonialQuote }: { testimonialQuote: { jsonValue: { value: string } } }) => (
    <div data-testid="testimonial-item">{testimonialQuote?.jsonValue?.value}</div>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">No data for {componentName}</div>
  ),
}));

// Mock radash debounce
jest.mock('radash', () => ({
  debounce: (_options: { delay: number }, fn: (...args: unknown[]) => void) => {
    const debouncedFn = (...args: unknown[]) => fn(...args);
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  },
}));

describe('TestimonialCarousel', () => {
  it('renders testimonial carousel with items', () => {
    render(<TestimonialCarousel {...mockTestimonialCarouselProps} />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-content')).toBeInTheDocument();

    const items = screen.getAllByTestId('carousel-item');
    expect(items).toHaveLength(3);

    const testimonialItems = screen.getAllByTestId('testimonial-item');
    expect(testimonialItems[0]).toHaveTextContent(
      'The Alaris Type I Ambulance has revolutionized our emergency response capabilities'
    );
  });

  it('renders carousel navigation buttons', () => {
    render(<TestimonialCarousel {...mockTestimonialCarouselProps} />);

    expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
  });

  it('renders NoDataFallback when no fields are provided', () => {
    const propsWithoutFields = {
      ...mockTestimonialCarouselPropsEmpty,
      fields: null,
    };

    // @ts-expect-error Testing no fields scenario
    render(<TestimonialCarousel {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Testimonial Carousel')).toBeInTheDocument();
  });
});
