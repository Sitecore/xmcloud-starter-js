/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as MegaMenuItemDefault } from '@/components/site-three/MegaMenuItem';
import { mockPage } from '../test-utils/mockPage';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
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

// Mock useToggleWithClickOutside hook - allow control of state for testing
const mockToggle = jest.fn();
const mockSetIsVisible = jest.fn();
let mockIsVisible = false;

jest.mock('@/hooks/useToggleWithClickOutside', () => ({
  useToggleWithClickOutside: () => ({
    ref: { current: null },
    isVisible: mockIsVisible,
    setIsVisible: mockSetIsVisible,
    toggle: mockToggle,
  }),
}));

// Mock component-map to avoid circular dependency
jest.mock('.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  Link: ({ field, children, className }: any) => (
    <a href={field?.value?.href || '#'} className={className}>
      {children || field?.value?.text || ''}
    </a>
  ),
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Placeholder: ({ name }: any) => <div data-testid={`placeholder-${name}`} />,
  AppPlaceholder: ({ name }: any) => <div data-testid={`app-placeholder-${name}`} />,
  Field: ({ field }: any) => <span>{field?.value || ''}</span>,
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

describe('MegaMenuItem', () => {
  const mockProps = {
    rendering: { componentName: 'MegaMenuItem' },
    params: {
      styles: 'test-styles',
    },
    page: mockPage,
    fields: {
      Title: {
        value: 'Products',
      },
      Link: {
        value: {
          href: '/products',
          text: 'View All Products',
        },
      },
      FeaturedProduct: {
        id: 'featured-1',
        url: '/products/featured',
        fields: {
          ProductName: {
            value: 'Featured Product',
          },
          FeaturedImage: {
            value: {
              src: '/images/featured.jpg',
              alt: 'Featured',
            },
          },
        },
      },
      data: {
        datasource: {
          children: {
            results: [
              {
                id: 'child-1',
                title: {
                  jsonValue: {
                    value: 'Category 1',
                  },
                },
                link: {
                  jsonValue: {
                    value: {
                      href: '/products/category1',
                      text: 'Category 1',
                    },
                  },
                },
              },
              {
                id: 'child-2',
                title: {
                  jsonValue: {
                    value: 'Category 2',
                  },
                },
                link: {
                  jsonValue: {
                    value: {
                      href: '/products/category2',
                      text: 'Category 2',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    mockSetIsVisible.mockClear();
    mockToggle.mockClear();
    mockIsVisible = false;
  });

  describe('Default menu item behavior', () => {
    it('renders menu item title', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('renders featured product', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
      expect(screen.getByText(/Explore.*Featured Product/i)).toBeInTheDocument();
    });

    it('renders placeholder components', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      expect(
        screen.getByTestId('app-placeholder-mega-menu-item-primary-links-undefined')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('app-placeholder-mega-menu-item-secondary-links-undefined')
      ).toBeInTheDocument();
    });

    it('renders with custom styles', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      const menuItem = screen.getByText('Products').closest('li');
      expect(menuItem?.className).toContain('test-styles');
    });

    it('handles submenu toggle click', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      const titleSpan = screen.getByText('Products');

      fireEvent.click(titleSpan);

      expect(mockSetIsVisible).toHaveBeenCalledWith(true);
    });

    it('handles back button click', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      const backButton = screen.getByTestId('arrow-left-icon').parentElement;

      if (backButton) {
        fireEvent.click(backButton);
        expect(mockSetIsVisible).toHaveBeenCalledWith(false);
      }
    });

    it('renders back button with translated text', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('renders explore button with product name', () => {
      render(<MegaMenuItemDefault {...mockProps} />);
      const exploreButton = screen.getByText(/Explore.*Featured Product/i);
      expect(exploreButton).toBeInTheDocument();
      expect(exploreButton.closest('a')).toHaveAttribute('href', '/products/featured');
    });
  });

  describe('Simple link mode', () => {
    it('renders as simple link when isSimpleLink param is true', () => {
      const simpleLinkProps = {
        ...mockProps,
        params: {
          ...mockProps.params,
          isSimpleLink: 'true',
        },
      };

      render(<MegaMenuItemDefault {...simpleLinkProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/products');
      expect(link).toHaveTextContent('View All Products');
    });

    it('does not render submenu when in simple link mode', () => {
      const simpleLinkProps = {
        ...mockProps,
        params: {
          ...mockProps.params,
          isSimpleLink: 'true',
        },
      };

      render(<MegaMenuItemDefault {...simpleLinkProps} />);

      // Should not have the submenu div
      expect(screen.queryByTestId('arrow-left-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Back')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases and missing data', () => {
    it('handles missing featured product', () => {
      const propsWithoutFeatured: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          FeaturedProduct: undefined,
        },
      };

      render(<MegaMenuItemDefault {...propsWithoutFeatured} />);
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.queryByText('Featured Product')).not.toBeInTheDocument();
    });

    it('handles missing featured product image', () => {
      const propsWithoutImage: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          FeaturedProduct: {
            ...mockProps.fields.FeaturedProduct,
            fields: {
              ...mockProps.fields.FeaturedProduct.fields,
              FeaturedImage: undefined,
            },
          },
        },
      };

      render(<MegaMenuItemDefault {...propsWithoutImage} />);
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('handles missing title field', () => {
      const propsWithoutTitle: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Title: undefined,
        },
      };

      render(<MegaMenuItemDefault {...propsWithoutTitle} />);
      // Component should still render without errors
      const menuItem = screen.getByRole('listitem');
      expect(menuItem).toBeInTheDocument();
    });

    it('renders placeholder with dynamic ID', () => {
      const propsWithDynamicId = {
        ...mockProps,
        params: {
          ...mockProps.params,
          DynamicPlaceholderId: 'test-123',
        },
      };

      render(<MegaMenuItemDefault {...propsWithDynamicId} />);
      expect(
        screen.getByTestId('app-placeholder-mega-menu-item-primary-links-test-123')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('app-placeholder-mega-menu-item-secondary-links-test-123')
      ).toBeInTheDocument();
    });
  });
});
