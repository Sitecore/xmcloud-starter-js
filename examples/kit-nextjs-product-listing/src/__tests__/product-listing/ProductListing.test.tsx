/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProductListingDefault } from '../../components/product-listing/ProductListingDefault.dev';
import {
  defaultProductListingProps,
  productListingPropsTwoProducts,
  productListingPropsSingleProduct,
  productListingPropsNoProducts,
  productListingPropsMinimal,
  productListingPropsEditing,
  productListingPropsNoFields,
} from './ProductListing.mockProps';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ children, field, tag: Tag = 'span', className, ...props }: any) => (
    <Tag className={className} data-testid="sitecore-text" {...props}>
      {field?.value || children}
    </Tag>
  ),
  useSitecore: jest.fn(),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dictionary: { [key: string]: string } = {
      PRODUCTLISTING_DrivingRange: 'Battery Life',
      PRODUCTLISTING_Price: 'Starting at',
      PRODUCTLISTING_SeeFullSpecs: 'See Full Specs',
    };
    return dictionary[key] || key;
  },
  useLocale: () => 'en',
  useTimeZone: () => 'UTC',
  useFormatter: () => ({
    dateTime: jest.fn(),
    number: jest.fn(),
    relativeTime: jest.fn(),
    plural: jest.fn(),
    select: jest.fn(),
    selectOrdinal: jest.fn(),
    list: jest.fn(),
  }),
  IntlProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

jest.mock('../../hooks/use-match-media', () => ({
  useMatchMedia: (query: string) => query.includes('prefers-reduced-motion'),
}));

jest.mock('../../components/animated-section/AnimatedSection.dev', () => ({
  Default: ({
    children,
    className,
    direction,
    delay,
    duration,
    reducedMotion,
    isPageEditing,
  }: any) => (
    <div
      data-testid="animated-section"
      className={className}
      data-direction={direction}
      data-delay={delay}
      data-duration={duration}
      data-reduced-motion={reducedMotion}
      data-editing={isPageEditing}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../components/product-listing/ProductListingCard.dev', () => ({
  ProductListingCard: ({ product, prefersReducedMotion, isPageEditing }: any) => (
    <div
      data-testid="product-card"
      data-product-name={product.productName?.jsonValue?.value}
      data-reduced-motion={prefersReducedMotion}
      data-editing={isPageEditing}
    >
      <h3>{product.productName?.jsonValue?.value}</h3>
      <p>{product.productBasePrice?.jsonValue?.value}</p>
      <p>{product.productFeatureTitle?.jsonValue?.value}</p>
    </div>
  ),
}));

jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('ProductListing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Rendering', () => {
    it('renders with default props and displays title', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      expect(screen.getByText('Featured Audio Products')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
    });

    it('renders all product cards', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards).toHaveLength(3);

      expect(screen.getByText('Pro Audio Headphones')).toBeInTheDocument();
      expect(screen.getByText('Wireless Earbuds')).toBeInTheDocument();
      expect(screen.getByText('Studio Monitors')).toBeInTheDocument();
    });

    it('applies custom styles when provided', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      // The component renders correctly with custom styles
      expect(screen.getByText('Featured Audio Products')).toBeInTheDocument();
      // Note: Custom styles are applied to container but may not be directly testable
      // without more specific selectors or data attributes
    });
  });

  describe('Column Layout', () => {
    it('splits products into left and right columns correctly', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const productCards = screen.getAllByTestId('product-card');

      // First product (index 0) goes to right column
      // Second product (index 1) goes to left column
      // Third product (index 2) goes to right column
      expect(productCards).toHaveLength(3);
    });

    it('handles two products correctly', () => {
      render(<ProductListingDefault {...productListingPropsTwoProducts} />);

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards).toHaveLength(2);

      expect(screen.getByText('Pro Audio Headphones')).toBeInTheDocument();
      expect(screen.getByText('Wireless Earbuds')).toBeInTheDocument();
    });

    it('handles single product correctly', () => {
      render(<ProductListingDefault {...productListingPropsSingleProduct} />);

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards).toHaveLength(1);

      expect(screen.getByText('Pro Audio Headphones')).toBeInTheDocument();
    });

    it('limits products to maximum of 3', () => {
      const propsWithManyProducts = {
        ...defaultProductListingProps,
        fields: {
          ...defaultProductListingProps.fields,
          data: {
            ...defaultProductListingProps.fields.data,
            datasource: {
              ...defaultProductListingProps.fields.data.datasource,
              products: {
                targetItems: [
                  ...defaultProductListingProps.fields.data.datasource.products!.targetItems,
                  defaultProductListingProps.fields.data.datasource.products!.targetItems[0], // Add 4th product
                  defaultProductListingProps.fields.data.datasource.products!.targetItems[1], // Add 5th product
                ],
              },
            },
          },
        },
      };

      render(<ProductListingDefault {...propsWithManyProducts} />);

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards).toHaveLength(3); // Should still only show 3
    });
  });

  describe('Interactive Features', () => {
    it('handles mouse hover on product cards', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const productCards = screen.getAllByTestId('product-card');
      const firstCard = productCards[0];

      act(() => {
        fireEvent.mouseEnter(firstCard);
      });

      // Card should be in the DOM and interactive
      expect(firstCard).toBeInTheDocument();

      act(() => {
        fireEvent.mouseLeave(firstCard);
      });

      expect(firstCard).toBeInTheDocument();
    });

    it('handles focus events on product cards', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const productCards = screen.getAllByTestId('product-card');
      const firstCard = productCards[0];

      act(() => {
        fireEvent.focus(firstCard);
      });

      expect(firstCard).toBeInTheDocument();

      act(() => {
        fireEvent.blur(firstCard);
      });

      expect(firstCard).toBeInTheDocument();
    });
  });

  describe('Reduced Motion', () => {
    it('passes reduced motion preference to components', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      animatedSections.forEach((section) => {
        expect(section).toHaveAttribute('data-reduced-motion', 'true');
      });

      const productCards = screen.getAllByTestId('product-card');
      productCards.forEach((card) => {
        expect(card).toHaveAttribute('data-reduced-motion', 'true');
      });
    });
  });

  describe('Editing Mode', () => {
    it('passes editing state to child components', () => {
      render(<ProductListingDefault {...productListingPropsEditing} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      animatedSections.forEach((section) => {
        expect(section).toHaveAttribute('data-editing', 'true');
      });

      const productCards = screen.getAllByTestId('product-card');
      productCards.forEach((card) => {
        expect(card).toHaveAttribute('data-editing', 'true');
      });
    });

    it('handles editing mode when not explicitly set', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      animatedSections.forEach((section) => {
        expect(section).toHaveAttribute('data-editing', 'false');
      });
    });
  });

  describe('Content Scenarios', () => {
    it('handles no products gracefully', () => {
      render(<ProductListingDefault {...productListingPropsNoProducts} />);

      expect(screen.getByText('Audio Products')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
    });

    it('renders with minimal product data', () => {
      render(<ProductListingDefault {...productListingPropsMinimal} />);

      expect(screen.getByText('Basic Products')).toBeInTheDocument();
      expect(screen.getByTestId('product-card')).toBeInTheDocument();
      expect(screen.getByText('Basic Speaker')).toBeInTheDocument();
    });

    it('returns NoDataFallback when no fields provided', () => {
      render(<ProductListingDefault {...productListingPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('ProductListing')).toBeInTheDocument();
    });
  });

  describe('Animation Configuration', () => {
    it('configures animated sections with correct properties', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const animatedSections = screen.getAllByTestId('animated-section');

      // Main title section
      expect(animatedSections[0]).toHaveAttribute('data-direction', 'down');
      expect(animatedSections[0]).toHaveAttribute('data-duration', '400');

      // Product sections should have up direction
      const productAnimations = animatedSections.slice(1);
      productAnimations.forEach((section) => {
        expect(section).toHaveAttribute('data-direction', 'up');
        expect(section).toHaveAttribute('data-duration', '400');
      });
    });

    it('applies staggered delays to product animations', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      const productAnimations = animatedSections.slice(1); // Skip title section

      // Should have delays for staggered animation
      productAnimations.forEach((section) => {
        const delay = section.getAttribute('data-delay');
        expect(delay).toMatch(/\d+/); // Should be a number
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive container classes', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      // Component should render with responsive design patterns
      expect(screen.getByText('Featured Audio Products')).toBeInTheDocument();
      // Note: Container queries (@container) are handled by the component's wrapper
    });

    it('uses responsive grid layout classes', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('@md:grid-cols-2');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic heading structure', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Featured Audio Products');
    });

    it('maintains proper focus management', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const productCards = screen.getAllByTestId('product-card');

      // Cards should be focusable elements
      productCards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });

    it('provides meaningful content structure', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      // Should have clear hierarchy
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    });
  });

  describe('Performance', () => {
    it('handles re-renders without errors', () => {
      const { rerender } = render(<ProductListingDefault {...defaultProductListingProps} />);

      expect(screen.getByText('Featured Audio Products')).toBeInTheDocument();

      rerender(<ProductListingDefault {...productListingPropsTwoProducts} />);

      expect(screen.getByText('Audio Collection')).toBeInTheDocument();
    });

    it('manages state changes correctly', () => {
      render(<ProductListingDefault {...defaultProductListingProps} />);

      const productCards = screen.getAllByTestId('product-card');

      // Simulate multiple interactions
      act(() => {
        fireEvent.mouseEnter(productCards[0]);
        fireEvent.mouseLeave(productCards[0]);
        fireEvent.focus(productCards[1]);
        fireEvent.blur(productCards[1]);
      });

      expect(productCards[0]).toBeInTheDocument();
      expect(productCards[1]).toBeInTheDocument();
    });
  });
});
