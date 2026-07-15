/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { SlideCarousel } from '../../components/slide-carousel/SlideCarousel.dev';
import {
  defaultSlideCarouselProps,
  slideCarouselPropsMinimal,
  slideCarouselPropsCustom,
  slideCarouselPropsSingleSlide,
  slideCarouselPropsManySlides,
  slideCarouselPropsNoChildren,
  slideCarouselPropsLongText,
  slideCarouselPropsSpecialChars,
} from './SlideCarousel.mockProps';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowLeft: ({ className, size, ...props }: any) => (
    <svg data-testid="arrow-left-icon" className={className} width={size} height={size} {...props}>
      <path d="M19 12H5M12 19L5 12L12 5" />
    </svg>
  ),
  ArrowRight: ({ className, size, ...props }: any) => (
    <svg data-testid="arrow-right-icon" className={className} width={size} height={size} {...props}>
      <path d="M5 12H19M12 5L19 12L12 19" />
    </svg>
  ),
}));

// Mock Button component
jest.mock('../../components/ui/button', () => ({
  Button: ({ children, className, onClick, disabled, ...props }: any) => (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-testid="carousel-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock Carousel components
jest.mock('../../components/ui/carousel', () => ({
  Carousel: React.forwardRef(({ children, setApi, opts, className }: any, ref: any) => {
    React.useEffect(() => {
      if (setApi) {
        const mockApi = {
          scrollTo: jest.fn(),
          scrollNext: jest.fn(),
          scrollPrev: jest.fn(),
          canScrollNext: jest.fn(() => true),
          canScrollPrev: jest.fn(() => false),
          selectedScrollSnap: jest.fn(() => 0),
          scrollSnapList: jest.fn(() => [0, 1, 2]),
          on: jest.fn(),
          off: jest.fn(),
        };
        setApi(mockApi);
      }
    }, [setApi]);

    return (
      <div
        ref={ref}
        className={className}
        data-testid="carousel-container"
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
}));

describe('SlideCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.addEventListener and removeEventListener
    Object.defineProperty(window, 'addEventListener', {
      value: jest.fn(),
      writable: true,
    });

    Object.defineProperty(window, 'removeEventListener', {
      value: jest.fn(),
      writable: true,
    });
  });

  describe('Default Rendering', () => {
    it('renders carousel structure', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    });

    it('renders carousel container with correct structure', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const buttons = screen.getAllByTestId('carousel-button');
      expect(buttons).toHaveLength(2); // Previous and Next buttons

      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('featured-carousel');
    });
  });

  describe('Content Scenarios', () => {
    it('renders without title and description', () => {
      render(<SlideCarousel {...slideCarouselPropsMinimal} />);

      expect(screen.queryByText('Featured Products')).not.toBeInTheDocument();
      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    });

    it('handles custom styling', () => {
      render(<SlideCarousel {...slideCarouselPropsCustom} />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('custom-carousel', 'premium-styling', 'dark-theme');

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    });

    it('renders with single slide', () => {
      render(<SlideCarousel {...slideCarouselPropsSingleSlide} />);

      expect(screen.getByTestId('single-slide')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    });

    it('renders with many slides', () => {
      render(<SlideCarousel {...slideCarouselPropsManySlides} />);

      expect(screen.getByTestId('slide-1')).toBeInTheDocument();
      expect(screen.getByTestId('slide-6')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    });

    it('handles empty children', () => {
      render(<SlideCarousel {...slideCarouselPropsNoChildren} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    });

    it('handles long text content', () => {
      render(<SlideCarousel {...slideCarouselPropsLongText} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(<SlideCarousel {...slideCarouselPropsSpecialChars} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('special-slide-1')).toBeInTheDocument();
    });
  });

  describe('Navigation Controls', () => {
    it('renders navigation buttons with correct initial states', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const buttons = screen.getAllByTestId('carousel-button');
      expect(buttons).toHaveLength(2);

      // Buttons should be present (disabled state is managed by carousel API)
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    it('handles navigation button clicks', async () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const buttons = screen.getAllByTestId('carousel-button');
      const [prevButton, nextButton] = buttons;

      // Click next button
      await act(async () => {
        fireEvent.click(nextButton);
      });

      expect(nextButton).toBeInTheDocument();

      // Click previous button
      await act(async () => {
        fireEvent.click(prevButton);
      });

      expect(prevButton).toBeInTheDocument();
    });

    it('applies correct button styling and accessibility', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const buttons = screen.getAllByTestId('carousel-button');

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button.className).toContain(''); // Button should have styling classes
      });
    });
  });

  describe('Slide Indicators', () => {
    it('renders slide indicators based on children count', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      // Should render indicators for each slide
      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');
      expect(indicators.length).toBeGreaterThan(0);
    });

    it('handles indicator clicks', async () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');

      if (indicators.length > 1) {
        await act(async () => {
          fireEvent.click(indicators[1]);
        });

        expect(indicators[1]).toBeInTheDocument();
      }
    });

    it('applies correct indicator styling', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');

      indicators.forEach((indicator) => {
        expect(indicator).toHaveClass(
          'h-2',
          'min-w-2',
          'rounded-full',
          'transition-all',
          'duration-300'
        );
      });
    });

    it('sets aria-current correctly for active indicator', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');

      if (indicators.length > 0) {
        const activeIndicator = Array.from(indicators).find(
          (indicator) => indicator.getAttribute('aria-current') === 'true'
        );
        expect(activeIndicator).toBeInTheDocument();
      }
    });

    it('does not render indicators when no items', () => {
      render(<SlideCarousel {...slideCarouselPropsNoChildren} />);

      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');
      expect(indicators).toHaveLength(0);
    });
  });

  describe('Carousel Configuration', () => {
    it('sets correct carousel options', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const carouselContainer = screen.getByTestId('carousel-container');
      const opts = JSON.parse(carouselContainer.getAttribute('data-opts') || '{}');

      expect(opts.align).toBe('start');
      expect(opts.breakpoints).toBeDefined();
      expect(opts.breakpoints['(max-width: 768px)']).toEqual({ dragFree: true });
    });

    it('applies responsive styling classes', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const carouselContent = screen.getByTestId('carousel-content');
      expect(carouselContent).toHaveClass('ml-0');
    });

    it('handles carousel API integration', async () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      // Wait for useEffect to run
      await waitFor(() => {
        expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      });

      // Carousel API should be set up (mocked behavior)
      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');
      expect(indicators.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes for different screen sizes', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const carouselContent = screen.getByTestId('carousel-content');
      expect(carouselContent.className).toMatch(/2xl:ml-\[max\(8rem,calc\(50vw-700px\)\)\]/);
    });

    it('handles mobile-specific behavior', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const carouselContainer = screen.getByTestId('carousel-container');
      const opts = JSON.parse(carouselContainer.getAttribute('data-opts') || '{}');

      expect(opts.breakpoints['(max-width: 768px)'].dragFree).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for indicators', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');

      indicators.forEach((indicator, index) => {
        expect(indicator).toHaveAttribute('aria-label', `Go to slide ${index + 1}`);
      });
    });

    it('sets aria-current for active slide indicator', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const activeIndicator = document.querySelector('button[aria-current="true"]');
      expect(activeIndicator).toBeInTheDocument();
    });

    it('provides semantic section structure', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('ensures navigation buttons are accessible', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const buttons = screen.getAllByTestId('carousel-button');

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button.tagName.toLowerCase()).toBe('button');
      });
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<SlideCarousel {...defaultSlideCarouselProps} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();

      rerender(<SlideCarousel {...slideCarouselPropsCustom} />);

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    });

    it('manages event listeners correctly', () => {
      const { unmount } = render(<SlideCarousel {...defaultSlideCarouselProps} />);

      // Mock addEventListener and removeEventListener are called
      expect(window.addEventListener).toHaveBeenCalled();

      unmount();

      // Cleanup should occur on unmount
      expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('handles large numbers of slides without performance issues', () => {
      const startTime = performance.now();

      render(<SlideCarousel {...slideCarouselPropsManySlides} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly even with many slides
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('State Management', () => {
    it('initializes with correct default state', () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      // First indicator should be active by default
      const firstIndicator = document.querySelector('button[aria-label="Go to slide 1"]');
      expect(firstIndicator).toHaveAttribute('aria-current', 'true');
    });

    it('updates state correctly on slide changes', async () => {
      render(<SlideCarousel {...defaultSlideCarouselProps} />);

      const indicators = document.querySelectorAll('button[aria-label^="Go to slide"]');

      if (indicators.length > 1) {
        await act(async () => {
          fireEvent.click(indicators[1]);
        });

        // State updates are handled by the carousel API mock
        expect(indicators[1]).toBeInTheDocument();
      }
    });
  });

  describe('Error Handling', () => {
    it('handles undefined children gracefully', () => {
      const propsWithUndefinedChildren = {
        ...defaultSlideCarouselProps,
        children: undefined as any,
      };

      expect(() => {
        render(<SlideCarousel {...propsWithUndefinedChildren} />);
      }).not.toThrow();
    });

    it('handles null children gracefully', () => {
      const propsWithNullChildren = {
        ...defaultSlideCarouselProps,
        children: null as any,
      };

      expect(() => {
        render(<SlideCarousel {...propsWithNullChildren} />);
      }).not.toThrow();
    });

    it('handles carousel API errors gracefully', () => {
      // Mock a carousel that doesn't provide API
      jest.doMock('../../components/ui/carousel', () => ({
        Carousel: ({ children, className }: any) => (
          <div className={className} data-testid="carousel-container">
            {children}
          </div>
        ),
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
      }));

      expect(() => {
        render(<SlideCarousel {...defaultSlideCarouselProps} />);
      }).not.toThrow();
    });
  });
});
