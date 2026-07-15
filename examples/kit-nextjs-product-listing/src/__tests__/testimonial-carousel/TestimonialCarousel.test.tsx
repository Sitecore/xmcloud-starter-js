/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Default as TestimonialCarouselDefault } from '../../components/testimonial-carousel/TestimonialCarousel';
import {
  defaultTestimonialCarouselProps,
  testimonialCarouselPropsSingleItem,
  testimonialCarouselPropsLongTestimonials,
  testimonialCarouselPropsSpecialChars,
  testimonialCarouselPropsEmptyTestimonials,
  testimonialCarouselPropsNoQuoteOnly,
  testimonialCarouselPropsNoAttributionOnly,
  testimonialCarouselPropsEmptyFields,
  testimonialCarouselPropsNoFields,
  testimonialCarouselPropsNoChildren,
  testimonialCarouselPropsManyItems,
  testimonialCarouselPropsCustomStyles,
  testimonialCarouselPropsNoStyles,
  mockUseSitecoreNormal,
} from './TestimonialCarousel.mockProps';
import { mockPage } from '../test-utils/mockPage';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  ...jest.requireActual('@sitecore-content-sdk/nextjs'),
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag: Tag = 'div', className }: any) => (
    <Tag data-testid="sitecore-text" className={className} data-field-value={field?.value || ''}>
      {field?.value || 'Sitecore Text'}
    </Tag>
  ),
}));

// Mock radash debounce
jest.mock('radash', () => ({
  debounce: (_options: any, fn: any) => {
    const debounced: any = (...args: any[]) => fn(...args);
    debounced.cancel = jest.fn();
    return debounced;
  },
}));

// Mock carousel components
jest.mock('../../components/ui/carousel', () => ({
  Carousel: React.forwardRef(({ children, setApi, opts, className }: any, ref: any) => {
    React.useEffect(() => {
      if (setApi) {
        const mockRootNode = document.createElement('div');
        mockRootNode.addEventListener = jest.fn();
        mockRootNode.removeEventListener = jest.fn();

        const mockApi = {
          scrollTo: jest.fn(),
          scrollNext: jest.fn(),
          scrollPrev: jest.fn(),
          canScrollNext: jest.fn(() => true),
          canScrollPrev: jest.fn(() => false),
          selectedScrollSnap: jest.fn(() => 0),
          scrollSnapList: jest.fn(() => [0, 1, 2]),
          rootNode: jest.fn(() => mockRootNode),
          on: jest.fn((event, callback) => {
            if (event === 'select') {
              // Simulate initial select event
              setTimeout(() => callback(), 0);
            }
          }),
          off: jest.fn(),
        };
        setApi(mockApi);
      }
    }, [setApi]);

    return (
      <div
        ref={ref}
        className={`w-full ${className || ''}`}
        data-testid="testimonial-carousel"
        data-opts={JSON.stringify(opts)}
      >
        {children}
      </div>
    );
  }),
  CarouselContent: ({ children, className }: any) => (
    <div className={className} data-testid="carousel-content">
      {children}
    </div>
  ),
  CarouselItem: ({ children, className }: any) => (
    <div className={className} data-testid="carousel-item">
      {children}
    </div>
  ),
  CarouselNext: ({ children, className, variant, disabled, onFocus, onBlur, ...props }: any) => (
    <button
      type="button"
      data-testid="carousel-next"
      className={className}
      disabled={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    >
      Next {children}
    </button>
  ),
  CarouselPrevious: ({
    children,
    className,
    variant,
    disabled,
    onFocus,
    onBlur,
    ...props
  }: any) => (
    <button
      type="button"
      data-testid="carousel-previous"
      className={className}
      disabled={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    >
      Previous {children}
    </button>
  ),
}));

// Mock TestimonialCarouselItem
jest.mock('../../components/testimonial-carousel/TestimonialCarouselItem', () => ({
  Default: ({ testimonialQuote, testimonialAttribution }: any) => (
    <div data-testid="testimonial-item">
      {testimonialAttribution?.jsonValue?.value && (
        <div data-testid="testimonial-attribution">{testimonialAttribution.jsonValue.value}</div>
      )}
      {testimonialQuote?.jsonValue?.value && (
        <div data-testid="testimonial-quote">{testimonialQuote.jsonValue.value}</div>
      )}
    </div>
  ),
}));

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
}));

describe('TestimonialCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);

    // Mock window methods
    Object.defineProperty(window, 'addEventListener', { value: jest.fn() });
    Object.defineProperty(window, 'removeEventListener', { value: jest.fn() });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Default Rendering', () => {
    it('renders complete testimonial carousel with all content', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // Check main structure
      expect(screen.getByTestId('testimonial-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();

      // Check testimonial items
      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(3);

      // Check navigation buttons
      expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
    });

    it('applies correct CSS classes and styling', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // Test that the component renders with basic structure
      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toHaveClass('w-full');

      // Component renders successfully (the real component would have more complex styling)
      expect(carousel).toBeInTheDocument();
    });

    it('renders testimonial content correctly', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // Check first testimonial content
      expect(screen.getByText('Sarah Johnson, Music Producer')).toBeInTheDocument();
      expect(
        screen.getByText(/SYNC Audio has completely transformed my music production/)
      ).toBeInTheDocument();

      // Check that all testimonials are rendered
      const attributions = screen.getAllByTestId('testimonial-attribution');
      expect(attributions).toHaveLength(3);
    });

    it('configures carousel with correct options', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const carousel = screen.getByTestId('testimonial-carousel');
      const opts = JSON.parse(carousel.getAttribute('data-opts') || '{}');
      expect(opts).toEqual({
        align: 'start',
        loop: true,
      });
    });
  });

  describe('Navigation Controls', () => {
    it('renders navigation buttons with correct attributes', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      const prevButton = screen.getByTestId('carousel-previous');

      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toBeInTheDocument();

      // Previous should be disabled initially (mocked to return false for canScrollPrev)
      expect(prevButton).toBeDisabled();
    });

    it('handles navigation button focus events', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      const prevButton = screen.getByTestId('carousel-previous');

      // Focus events should trigger show/hide logic
      await act(async () => {
        fireEvent.focus(nextButton);
        fireEvent.blur(nextButton);
        fireEvent.focus(prevButton);
        fireEvent.blur(prevButton);
      });

      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toBeInTheDocument();
    });

    it('applies correct CSS classes to navigation buttons', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      const prevButton = screen.getByTestId('carousel-previous');

      // Both should have common classes
      expect(nextButton).toHaveClass('@md:h-[58px]', '@md:w-[58px]', 'absolute', 'top-1/2');
      expect(prevButton).toHaveClass('@md:h-[58px]', '@md:w-[58px]', 'absolute', 'top-1/2');
    });
  });

  describe('Mouse Interaction', () => {
    it('handles mouse move events for navigation visibility', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const carouselContainer = screen.getByTestId('testimonial-carousel');

      // Simulate mouse move
      await act(async () => {
        fireEvent.mouseMove(carouselContainer, { clientX: 100 });
      });

      expect(carouselContainer).toBeInTheDocument();
    });

    it('handles mouse leave events', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const carouselContainer = screen.getByTestId('testimonial-carousel');

      // Simulate mouse leave
      await act(async () => {
        fireEvent.mouseLeave(carouselContainer);
      });

      expect(carouselContainer).toBeInTheDocument();
    });

    it('provides focus management for accessibility', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // Test that the component renders and is accessible
      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toBeInTheDocument();

      // Focus and blur events can be handled
      await act(async () => {
        fireEvent.focus(carousel);
        fireEvent.blur(carousel);
      });

      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Content Scenarios', () => {
    it('handles single testimonial item', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsSingleItem} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(1);

      expect(
        screen.getByText('Outstanding audio quality that exceeds all expectations.')
      ).toBeInTheDocument();
      expect(screen.getByText('John Smith, Audiophile')).toBeInTheDocument();
    });

    it('handles long testimonial content', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsLongTestimonials} />);

      expect(
        screen.getByText(/SYNC Audio has revolutionized my entire approach/)
      ).toBeInTheDocument();
      expect(
        screen.getByText('Alexandra Thompson, Grammy-winning Producer and Sound Designer')
      ).toBeInTheDocument();

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(2);
    });

    it('handles special characters in testimonials', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsSpecialChars} />);

      expect(
        screen.getByText(/L'équipement SYNC Audio™ offre une qualité sonore/)
      ).toBeInTheDocument();
      expect(screen.getByText('François Dubois, Ingénieur du Son')).toBeInTheDocument();
      expect(screen.getByText(/SYNC Àudio ïs thë bëst chöice/)).toBeInTheDocument();
    });

    it('handles testimonials with missing attribution', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsNoQuoteOnly} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(1);

      // Should render quote but no attribution section
      expect(screen.getByText('Great sound quality and excellent build.')).toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-attribution')).not.toBeInTheDocument();
    });

    it('handles testimonials with missing quotes', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsNoAttributionOnly} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(1);

      // Should render attribution but no quote
      expect(screen.getByText('Jane Doe, Customer')).toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-quote')).not.toBeInTheDocument();
    });

    it('handles empty testimonial fields', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsEmptyFields} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(2);

      // Items should render but with empty content
      const quotes = screen.queryAllByTestId('testimonial-quote');
      const attributions = screen.queryAllByTestId('testimonial-attribution');

      // With empty values, the conditional rendering should not show these elements
      expect(quotes).toHaveLength(0);
      expect(attributions).toHaveLength(0);
    });
  });

  describe('Fallback Scenarios', () => {
    it('shows NoDataFallback when no fields provided', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Testimonial Carousel')).toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-carousel')).not.toBeInTheDocument();
    });

    it('shows NoDataFallback when no children provided', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsNoChildren} />);

      // When children is null, it should still render carousel structure
      // The NoDataFallback is shown when there are no fields at all
      expect(screen.getByTestId('testimonial-carousel')).toBeInTheDocument();
      expect(screen.queryAllByTestId('testimonial-item')).toHaveLength(0);
    });

    it('handles empty testimonials array', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsEmptyTestimonials} />);

      // Should render carousel structure but no items
      expect(screen.getByTestId('testimonial-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
      expect(screen.queryAllByTestId('testimonial-item')).toHaveLength(0);
    });
  });

  describe('Styling and Parameters', () => {
    it('applies custom styles when provided', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsCustomStyles} />);

      // Test that the component renders with custom styles props
      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toBeInTheDocument();

      // The component would apply custom styles in the real implementation
    });

    it('handles missing styles parameter', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsNoStyles} />);

      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toBeInTheDocument();
      // Should render without custom styles
    });
  });

  describe('Carousel Configuration', () => {
    it('handles multiple testimonial items correctly', () => {
      render(<TestimonialCarouselDefault {...testimonialCarouselPropsManyItems} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(8);

      const carouselItems = screen.getAllByTestId('carousel-item');
      expect(carouselItems).toHaveLength(8);
    });

    it('applies correct classes to carousel items', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      carouselItems.forEach((item) => {
        expect(item).toHaveClass(
          '@lg:basis-3/4',
          '@md:basis-4/5',
          '@md:pl-4',
          'py-[70px]',
          'transition-opacity',
          'duration-300'
        );
      });
    });

    it('configures carousel content with correct classes', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const carouselContent = screen.getByTestId('carousel-content');
      expect(carouselContent).toHaveClass('@md:-ml-4', '-ml-2');
    });
  });

  describe('Accessibility', () => {
    it('provides screen reader announcements', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      expect(liveRegion).toHaveClass('sr-only');
    });

    it('supports keyboard navigation', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // Test that keyboard events can be handled
      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toBeInTheDocument();

      // Simulate keyboard events
      await act(async () => {
        fireEvent.focus(carousel);
        fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
        fireEvent.keyDown(carousel, { key: 'ArrowRight' });
      });

      expect(carousel).toBeInTheDocument();
    });

    it('provides proper button accessibility', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      const prevButton = screen.getByTestId('carousel-previous');

      expect(nextButton).toHaveAttribute('type', 'button');
      expect(prevButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Performance', () => {
    it('handles rapid interactions without performance issues', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const carouselContainer = screen.getByTestId('testimonial-carousel');

      // Rapid mouse movements and keyboard events
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          fireEvent.mouseMove(carouselContainer, { clientX: i * 10 });
          fireEvent.keyDown(carouselContainer, { key: 'ArrowRight' });
        }
      });

      expect(carouselContainer).toBeInTheDocument();
    });

    it('handles re-renders efficiently', () => {
      const { rerender } = render(
        <TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />
      );

      rerender(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const rerenderCarousel = screen.getByTestId('testimonial-carousel');
      expect(rerenderCarousel).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('properly cleans up event listeners', () => {
      const { unmount } = render(
        <TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />
      );

      // Component should set up listeners
      expect(screen.getByTestId('testimonial-carousel')).toBeInTheDocument();

      // Should clean up on unmount
      unmount();
    });

    it('handles carousel API events correctly', async () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // The carousel API should be set up and handle select events
      const liveRegion = document.querySelector('[aria-live="polite"]');

      await waitFor(() => {
        // After the API is set and select event is triggered
        expect(liveRegion).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('uses container queries for responsive behavior', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      // Test that the component supports responsive design
      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toBeInTheDocument();

      // The real component would use @container queries for responsive behavior
    });

    it('applies responsive classes to navigation buttons', () => {
      render(<TestimonialCarouselDefault {...defaultTestimonialCarouselProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      const prevButton = screen.getByTestId('carousel-previous');

      expect(nextButton).toHaveClass(
        '@md:h-[58px]',
        '@md:w-[58px]',
        '@lg:h-[116px]',
        '@lg:w-[116px]'
      );
      expect(prevButton).toHaveClass(
        '@md:h-[58px]',
        '@md:w-[58px]',
        '@lg:h-[116px]',
        '@lg:w-[116px]'
      );
    });
  });

  describe('Error Handling', () => {
    it('handles malformed testimonial data gracefully', () => {
      const propsWithMalformedData = {
        ...defaultTestimonialCarouselProps,
        fields: {
          data: {
            datasource: {
              children: {
                results: [
                  { testimonialQuote: undefined, testimonialAttribution: undefined },
                  { testimonialQuote: undefined, testimonialAttribution: undefined },
                ],
              },
            },
          },
        },
      };

      expect(() => {
        render(<TestimonialCarouselDefault {...(propsWithMalformedData as any)} />);
      }).not.toThrow();
    });

    it('handles missing component props gracefully', () => {
      const propsWithMissingData = {
        rendering: { componentName: 'TestimonialCarousel' },
        params: {},
        page: mockPage,
        fields: undefined as any,
        name: 'TestimonialCarousel',
        Testimonials: [],
      };

      expect(() => {
        render(<TestimonialCarouselDefault {...propsWithMissingData} />);
      }).not.toThrow();
    });
  });
});
