import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as TestimonialCarousel } from '@/components/testimonial-carousel/TestimonialCarousel';
import {
  defaultProps,
  propsWithSingleTestimonial,
  propsWithTwoTestimonials,
  propsWithTestimonialWithoutAttribution,
  propsWithEmptyTestimonials,
  propsWithoutChildren,
  propsWithoutFields,
  propsWithUndefinedFields,
} from './TestimonialCarousel.mockProps';

// Type definitions for mock functions
interface DebounceConfig {
  delay: number;
}

type DebouncedFunction<T extends (...args: unknown[]) => unknown> = T & {
  cancel: () => void;
};

// Mock radash debounce
jest.mock('radash', () => ({
  debounce: <T extends (...args: unknown[]) => unknown>(
    config: DebounceConfig,
    fn: T
  ): DebouncedFunction<T> => {
    const debouncedFn = ((...args: Parameters<T>) => fn(...args)) as DebouncedFunction<T>;
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  },
}));

// Type definitions for cn utility
type CnArgs = Array<string | boolean | Record<string, boolean> | undefined>;

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: CnArgs) => {
    return args
      .flat(2)
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          return Object.entries(arg)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  },
}));

// Type definitions for Carousel components
import type { CarouselApi } from '@/components/ui/carousel';

interface MockCarouselProps {
  children?: React.ReactNode;
  setApi?: (api: CarouselApi | undefined) => void;
  className?: string;
}

interface MockCarouselContentProps {
  children?: React.ReactNode;
  className?: string;
}

interface MockCarouselItemProps {
  children?: React.ReactNode;
  className?: string;
}

interface MockCarouselButtonProps {
  variant?: string;
  className?: string;
  disabled?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

// Mock Carousel components
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, setApi, className }: MockCarouselProps) => {
    React.useEffect(() => {
      const api = {
        on: jest.fn(),
        scrollNext: jest.fn(),
        scrollPrev: jest.fn(),
        selectedScrollSnap: jest.fn(() => 0),
        canScrollPrev: jest.fn(() => true),
        canScrollNext: jest.fn(() => true),
        rootNode: jest.fn(() => ({
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })) as unknown as () => HTMLElement,
      } as unknown as CarouselApi;
      setApi?.(api);
    }, [setApi]);
    return (
      <div className={className} data-testid="carousel">
        {children}
      </div>
    );
  },
  CarouselContent: ({ children, className }: MockCarouselContentProps) => (
    <div className={className} data-testid="carousel-content">
      {children}
    </div>
  ),
  CarouselItem: ({ children, className }: MockCarouselItemProps) => (
    <div className={className} data-testid="carousel-item">
      {children}
    </div>
  ),
  CarouselNext: ({ variant, className, disabled, onFocus, onBlur }: MockCarouselButtonProps) => (
    <button
      className={className}
      disabled={disabled}
      data-testid="carousel-next"
      data-variant={variant}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      Next
    </button>
  ),
  CarouselPrevious: ({ variant, className, disabled, onFocus, onBlur }: MockCarouselButtonProps) => (
    <button
      className={className}
      disabled={disabled}
      data-testid="carousel-previous"
      data-variant={variant}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      Previous
    </button>
  ),
}));

// Type definitions for TestimonialCarouselItem
interface MockTestimonialCarouselItemProps {
  testimonialQuote?: {
    jsonValue?: {
      value?: string;
    };
  };
  testimonialAttribution?: {
    jsonValue?: {
      value?: string;
    };
  };
}

// Mock TestimonialCarouselItem
jest.mock('@/components/testimonial-carousel/TestimonialCarouselItem', () => ({
  Default: ({ testimonialQuote, testimonialAttribution }: MockTestimonialCarouselItemProps) => (
    <div data-testid="testimonial-item">
      <p data-testid="testimonial-quote">{testimonialQuote?.jsonValue?.value}</p>
      {testimonialAttribution && (
        <p data-testid="testimonial-attribution">{testimonialAttribution?.jsonValue?.value}</p>
      )}
    </div>
  ),
}));

// Type definitions for NoDataFallback
interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('TestimonialCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render testimonial carousel with all testimonials', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      expect(screen.getByTestId('carousel')).toBeInTheDocument();
      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(3);
    });

    it('should render all testimonial quotes', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      expect(
        screen.getByText('This product has completely transformed the way we work. Highly recommended!')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Outstanding service and support. The team went above and beyond our expectations.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('A game-changer for our business. We saw immediate results and increased productivity.')
      ).toBeInTheDocument();
    });

    it('should render all testimonial attributions', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      expect(screen.getByText('John Doe, CEO at TechCorp')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith, Marketing Director')).toBeInTheDocument();
      expect(screen.getByText('Mike Johnson, CTO')).toBeInTheDocument();
    });

    it('should render carousel navigation buttons', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
    });

    it('should render carousel with correct structure', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      expect(screen.getByTestId('carousel')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
      const carouselItems = screen.getAllByTestId('carousel-item');
      expect(carouselItems).toHaveLength(3);
    });
  });

  describe('Component structure', () => {
    it('should apply custom styles when provided', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild;
      expect(carouselContainer).toHaveClass('custom-carousel-styles');
    });

    it('should apply correct container classes', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild;
      expect(carouselContainer).toHaveClass(
        '@container',
        'component',
        'testimonial-carousel',
        'text-secondary-foreground'
      );
    });

    it('should render with correct carousel content classes', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      const carouselContent = screen.getByTestId('carousel-content');
      expect(carouselContent).toHaveClass('@md:-ml-4', '-ml-2');
    });

    it('should render carousel items with correct classes', () => {
      render(<TestimonialCarousel {...defaultProps} />);

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
  });

  describe('Navigation buttons', () => {
    it('should render previous button with correct variant', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      const prevButton = screen.getByTestId('carousel-previous');
      expect(prevButton).toHaveAttribute('data-variant', 'default');
    });

    it('should render next button with correct variant', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      expect(nextButton).toHaveAttribute('data-variant', 'default');
    });

    it('should apply correct classes to previous button', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      const prevButton = screen.getByTestId('carousel-previous');
      expect(prevButton).toHaveClass(
        '@md:h-[58px]',
        '@md:w-[58px]',
        '@lg:h-[116px]',
        '@lg:w-[116px]',
        'absolute',
        'top-1/2'
      );
    });

    it('should apply correct classes to next button', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      const nextButton = screen.getByTestId('carousel-next');
      expect(nextButton).toHaveClass(
        '@md:h-[58px]',
        '@md:w-[58px]',
        '@lg:h-[116px]',
        '@lg:w-[116px]',
        'absolute',
        'top-1/2'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have tabindex on carousel container', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild as HTMLElement;
      expect(carouselContainer).toHaveAttribute('tabIndex', '0');
    });

    it('should render sr-only announcement area', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const srOnly = container.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveAttribute('aria-live', 'polite');
      expect(srOnly).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Carousel functionality', () => {
    it('should handle single testimonial', () => {
      render(<TestimonialCarousel {...propsWithSingleTestimonial} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(1);
    });

    it('should handle two testimonials', () => {
      render(<TestimonialCarousel {...propsWithTwoTestimonials} />);

      const testimonialItems = screen.getAllByTestId('testimonial-item');
      expect(testimonialItems).toHaveLength(2);
    });

    it('should render testimonial without attribution', () => {
      render(<TestimonialCarousel {...propsWithTestimonialWithoutAttribution} />);

      expect(screen.getByText('Great experience overall!')).toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-attribution')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should handle empty testimonials array', () => {
      render(<TestimonialCarousel {...propsWithEmptyTestimonials} />);

      expect(screen.getByTestId('carousel')).toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-item')).not.toBeInTheDocument();
    });

    it('should handle missing children', () => {
      render(<TestimonialCarousel {...propsWithoutChildren} />);

      expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });

    it('should show NoDataFallback when fields is null', () => {
      render(<TestimonialCarousel {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Testimonial Carousel')).toBeInTheDocument();
    });

    it('should show NoDataFallback when fields is undefined', () => {
      render(<TestimonialCarousel {...propsWithUndefinedFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Testimonial Carousel')).toBeInTheDocument();
    });
  });

  describe('Interactive behavior', () => {
    it('should handle mouse events on container', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild as HTMLElement;
      
      // Should not throw errors when firing mouse events
      expect(() => {
        fireEvent.mouseMove(carouselContainer, { clientX: 100 });
        fireEvent.mouseLeave(carouselContainer);
      }).not.toThrow();
    });

    it('should handle focus events on container', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild as HTMLElement;
      
      // Should not throw errors when firing focus events
      expect(() => {
        fireEvent.focus(carouselContainer);
        fireEvent.blur(carouselContainer);
      }).not.toThrow();
    });

    it('should handle focus on navigation buttons', () => {
      render(<TestimonialCarousel {...defaultProps} />);

      const prevButton = screen.getByTestId('carousel-previous');
      const nextButton = screen.getByTestId('carousel-next');

      expect(() => {
        fireEvent.focus(prevButton);
        fireEvent.blur(prevButton);
        fireEvent.focus(nextButton);
        fireEvent.blur(nextButton);
      }).not.toThrow();
    });
  });

  describe('Carousel layout', () => {
    it('should render with rounded corners', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild as HTMLElement;
      expect(carouselContainer).toHaveClass('rounded-[24px]');
    });

    it('should have overflow hidden', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild as HTMLElement;
      expect(carouselContainer).toHaveClass('overflow-hidden');
    });

    it('should apply responsive padding', () => {
      const { container } = render(<TestimonialCarousel {...defaultProps} />);

      const carouselContainer = container.firstChild as HTMLElement;
      expect(carouselContainer).toHaveClass('@md:px-6', '@lg:px-0');
    });
  });
});

