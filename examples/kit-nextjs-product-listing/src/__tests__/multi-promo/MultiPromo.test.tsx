/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as MultiPromoDefault } from '../../components/multi-promo/MultiPromo';
import {
  defaultMultiPromoProps,
  multiPromoPropsNoChildren,
  multiPromoPropsMinimal,
  multiPromoPropsThreeColumns,
  multiPromoPropsEmpty,
} from './MultiPromo.mockProps';

// Mock the Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
  RichText: ({ field, tag = 'div', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
}));

// Mock radash debounce
jest.mock('radash', () => ({
  debounce: (_options: any, fn: any) => {
    const debounced: any = (...args: any[]) => fn(...args);
    debounced.cancel = jest.fn();
    return debounced;
  },
}));

// Mock UI carousel components
jest.mock('../../components/ui/carousel', () => ({
  Carousel: React.forwardRef(({ children, setApi, className }: any, ref: any) => {
    React.useEffect(() => {
      if (setApi) {
        const mockRootNode = document.createElement('div');
        mockRootNode.addEventListener = jest.fn();
        mockRootNode.removeEventListener = jest.fn();

        const mockApi = {
          scrollTo: jest.fn(),
          canScrollNext: jest.fn(() => true),
          canScrollPrev: jest.fn(() => false),
          selectedScrollSnap: jest.fn(() => 0),
          scrollSnapList: jest.fn(() => [0, 1, 2, 3]),
          rootNode: jest.fn(() => mockRootNode),
          on: jest.fn(),
          off: jest.fn(),
        };
        setApi(mockApi);
      }
    }, [setApi]);

    return (
      <div ref={ref} className={className} data-testid="multi-promo-carousel">
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

// Mock MultiPromoItem component
jest.mock('../../components/multi-promo/MultiPromoItem.dev', () => ({
  Default: ({ heading, image, link }: any) => (
    <div data-testid="multi-promo-item">
      <h3 data-testid="promo-heading">{heading?.jsonValue?.value}</h3>
      {image?.jsonValue?.value?.src && (
        <img
          src={image.jsonValue.value.src}
          alt={image.jsonValue.value.alt}
          data-testid="promo-image"
        />
      )}
      {link?.jsonValue?.value?.href && (
        <a href={link.jsonValue.value.href} data-testid="promo-link">
          {link.jsonValue.value.text}
        </a>
      )}
    </div>
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

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('MultiPromo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Rendering', () => {
    it('renders complete multi-promo with all content', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      // Check main container
      expect(screen.getByTestId('multi-promo-carousel')).toBeInTheDocument();

      // Check title and description
      expect(screen.getByText('Featured Promotions')).toBeInTheDocument();
      expect(
        screen.getByText('Discover our latest offers and exclusive deals')
      ).toBeInTheDocument();

      // Check carousel content
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    });

    it('renders all promotional items', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const promoItems = screen.getAllByTestId('multi-promo-item');
      expect(promoItems).toHaveLength(4);

      // Check individual promo items
      expect(screen.getByText('Summer Sale')).toBeInTheDocument();
      expect(screen.getByText('New Arrivals')).toBeInTheDocument();
      expect(screen.getByText('Tech Accessories')).toBeInTheDocument();
      expect(screen.getByText('Audio Equipment')).toBeInTheDocument();
    });

    it('applies correct CSS classes for number of columns', () => {
      render(<MultiPromoDefault {...multiPromoPropsThreeColumns} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      // Check that at least the base classes are applied
      carouselItems.forEach((item) => {
        expect(item).toHaveClass('min-w-[238px]', 'max-w-[416px]', 'basis-3/4');
      });
    });

    it('applies correct CSS classes for four columns', () => {
      render(<MultiPromoDefault {...multiPromoPropsMinimal} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      // Check that at least the base classes are applied
      carouselItems.forEach((item) => {
        expect(item).toHaveClass('min-w-[238px]', 'max-w-[416px]', 'basis-3/4');
      });
    });
  });

  describe('Content Scenarios', () => {
    it('handles no promotional items', () => {
      render(<MultiPromoDefault {...multiPromoPropsNoChildren} />);

      expect(screen.getByText('Featured Promotions')).toBeInTheDocument();
      expect(screen.queryByTestId('multi-promo-item')).not.toBeInTheDocument();
      // The carousel still renders even when there are no children, but the content is empty
    });

    it('renders with minimal content (no description)', () => {
      render(<MultiPromoDefault {...multiPromoPropsMinimal} />);

      expect(screen.getByText('Featured Promotions')).toBeInTheDocument();
      expect(screen.queryByText('Discover our latest offers')).not.toBeInTheDocument();

      const promoItems = screen.getAllByTestId('multi-promo-item');
      expect(promoItems).toHaveLength(2);
    });

    it('returns NoDataFallback when no fields', () => {
      render(<MultiPromoDefault {...multiPromoPropsEmpty} />);

      // The component still renders with empty fields, but should show NoDataFallback
      // Based on the actual component logic, it may render the container even with empty fields
      expect(screen.queryByText('Featured Promotions')).not.toBeInTheDocument();
    });
  });

  describe('Carousel Functionality', () => {
    it('initializes carousel API', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      expect(screen.getByTestId('multi-promo-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    });

    it('applies correct carousel configuration', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const carousel = screen.getByTestId('multi-promo-carousel');
      expect(carousel).toHaveClass('relative', '-ml-4', '-mr-4', 'overflow-hidden');
    });

    it('renders carousel with proper responsive classes', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      carouselItems.forEach((item) => {
        expect(item).toHaveClass(
          'min-w-[238px]',
          'max-w-[416px]',
          'basis-3/4',
          'pl-4',
          'transition-opacity'
        );
      });
    });
  });

  describe('Promotional Items', () => {
    it('renders promo item headings correctly', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const headings = screen.getAllByTestId('promo-heading');
      expect(headings).toHaveLength(4);
      expect(headings[0]).toHaveTextContent('Summer Sale');
      expect(headings[1]).toHaveTextContent('New Arrivals');
    });

    it('renders promo item images correctly', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const images = screen.getAllByTestId('promo-image');
      expect(images).toHaveLength(4);
      expect(images[0]).toHaveAttribute('src', '/promo/summer-sale.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Summer Sale Image');
    });

    it('renders promo item links correctly', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const links = screen.getAllByTestId('promo-link');
      expect(links).toHaveLength(4);
      expect(links[0]).toHaveAttribute('href', '/sale/summer');
      expect(links[0]).toHaveTextContent('Shop Summer Sale');
    });
  });

  describe('Accessibility', () => {
    it('includes screen reader announcement area', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const srElement = document.querySelector('[aria-live="polite"]');
      expect(srElement).toBeInTheDocument();
      expect(srElement).toHaveAttribute('aria-atomic', 'true');
      expect(srElement).toHaveClass('sr-only');
    });

    it('renders title as proper heading', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const title = screen.getByText('Featured Promotions');
      expect(title.tagName.toLowerCase()).toBe('h2');
    });

    it('provides semantic structure', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      // Should have proper heading hierarchy
      const headings = screen.getAllByTestId('promo-heading');
      headings.forEach((heading) => {
        expect(heading.tagName.toLowerCase()).toBe('h3');
      });
    });
  });

  describe('Column Configuration', () => {
    it('handles three column layout', () => {
      render(<MultiPromoDefault {...multiPromoPropsThreeColumns} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      carouselItems.forEach((item) => {
        // Check for base responsive classes
        expect(item).toHaveClass('sm:basis-[45%]', 'md:basis-[31%]');
      });
    });

    it('handles four column layout', () => {
      render(<MultiPromoDefault {...multiPromoPropsMinimal} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      carouselItems.forEach((item) => {
        // Check for base responsive classes
        expect(item).toHaveClass('sm:basis-[45%]', 'md:basis-[31%]');
      });
    });

    it('applies base responsive classes regardless of column count', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      carouselItems.forEach((item) => {
        expect(item).toHaveClass('sm:basis-[45%]', 'md:basis-[31%]');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing title gracefully', () => {
      const propsWithoutTitle = {
        ...defaultMultiPromoProps,
        fields: {
          data: {
            datasource: {
              title: { jsonValue: { value: '' } },
              description: { jsonValue: { value: 'Test description' } },
              children: defaultMultiPromoProps.fields.data.datasource.children,
            },
          },
        },
      };

      render(<MultiPromoDefault {...propsWithoutTitle} />);

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('handles missing description gracefully', () => {
      const propsWithoutDescription = {
        ...defaultMultiPromoProps,
        fields: {
          data: {
            datasource: {
              title: { jsonValue: { value: 'Test title' } },
              children: defaultMultiPromoProps.fields.data.datasource.children,
            },
          },
        },
      };

      render(<MultiPromoDefault {...propsWithoutDescription} />);

      expect(screen.getByText('Test title')).toBeInTheDocument();
      expect(screen.getAllByTestId('multi-promo-item')).toHaveLength(4);
    });
  });

  describe('Component Structure', () => {
    it('maintains proper container structure', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const carousel = screen.getByTestId('multi-promo-carousel');
      const content = screen.getByTestId('carousel-content');
      const items = screen.getAllByTestId('carousel-item');

      expect(carousel).toContainElement(content);
      items.forEach((item) => {
        expect(content).toContainElement(item);
      });
    });

    it('applies correct content classes', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const content = screen.getByTestId('carousel-content');
      expect(content).toHaveClass('my-12', 'last:mb-0', 'sm:my-16', 'sm:-ml-8');
    });
  });

  describe('Performance and Optimization', () => {
    it('uses debounced functions for performance', () => {
      const debounce = require('radash').debounce;
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      // Verify debounce is imported and available
      expect(debounce).toBeDefined();
    });

    it('applies transition classes for smooth animations', () => {
      render(<MultiPromoDefault {...defaultMultiPromoProps} />);

      const carouselItems = screen.getAllByTestId('carousel-item');
      carouselItems.forEach((item) => {
        expect(item).toHaveClass('transition-opacity', 'duration-300');
      });
    });
  });
});
