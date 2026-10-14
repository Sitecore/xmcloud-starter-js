/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as MultiPromoDefault,
  Stacked as MultiPromoStacked,
  SingleColumn as MultiPromoSingleColumn,
  FlexColumn as MultiPromoFlexColumn,
} from '@/components/site-three/MultiPromo';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Link: ({ field, children, className }: any) => (
    <a href={field?.value?.href || '#'} className={className}>
      {children || field?.value?.text || ''}
    </a>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: () => <div data-testid="no-data-fallback">No data available</div>,
}));

describe('MultiPromo', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      data: {
        datasource: {
          title: {
            jsonValue: {
              value: 'Featured Products',
            },
          },
          description: {
            jsonValue: {
              value: 'Explore our selection',
            },
          },
          children: {
            results: [
              {
                id: 'promo-1',
                heading: {
                  jsonValue: {
                    value: 'Product 1',
                  },
                },
                description: {
                  jsonValue: {
                    value: 'Description 1',
                  },
                },
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/product1.jpg',
                      alt: 'Product 1',
                    },
                  },
                },
                link: {
                  jsonValue: {
                    value: {
                      href: '/product1',
                      text: 'View Product 1',
                    },
                  },
                },
              },
              {
                id: 'promo-2',
                heading: {
                  jsonValue: {
                    value: 'Product 2',
                  },
                },
                description: {
                  jsonValue: {
                    value: 'Description 2',
                  },
                },
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/product2.jpg',
                      alt: 'Product 2',
                    },
                  },
                },
                link: {
                  jsonValue: {
                    value: {
                      href: '/product2',
                      text: 'View Product 2',
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

  describe('Default variant', () => {
    it('renders multi promo with title', () => {
      render(<MultiPromoDefault {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<MultiPromoDefault {...mockProps} />);
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo items', () => {
      render(<MultiPromoDefault {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('renders promo images', () => {
      render(<MultiPromoDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
    });

    it('renders promo links', () => {
      render(<MultiPromoDefault {...mockProps} />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/product1');
      expect(links[1]).toHaveAttribute('href', '/product2');
    });

    it('keeps the title and description centered by default', () => {
      render(<MultiPromoDefault {...mockProps} />);
      const header = screen.getByTestId('multipromo-header');
      expect(header).toHaveClass('multipromo-header');
      expect(header).toHaveClass('text-center');
    });

    it('applies Text Justified layout from the TextAlignment rendering parameter', () => {
      const justifiedProps = {
        ...mockProps,
        params: { styles: 'test-styles', TextAlignment: 'Text Justified' },
      };
      const { container } = render(<MultiPromoDefault {...justifiedProps} />);
      expect(container.querySelector('section')).toHaveClass('text-justified');
      const header = screen.getByTestId('multipromo-header');
      expect(header).toHaveClass('text-left');
      expect(header).not.toHaveClass('text-center');
    });

    it('applies Text Justified layout when styles include text-justified', () => {
      const justifiedProps = {
        ...mockProps,
        params: { styles: 'text-justified' },
      };
      const { container } = render(<MultiPromoDefault {...justifiedProps} />);
      expect(container.querySelector('section')).toHaveClass('text-justified');
      expect(screen.getByTestId('multipromo-header')).toHaveClass('text-left');
    });

    it('applies custom styles from params', () => {
      const { container } = render(<MultiPromoDefault {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('renders without items when children array is empty', () => {
      const emptyProps = {
        params: {},
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
      const { container } = render(<MultiPromoDefault {...emptyProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoDefault {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('Stacked variant', () => {
    it('renders stacked layout with title and description', () => {
      render(<MultiPromoStacked {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo items in stacked format', () => {
      render(<MultiPromoStacked {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('applies stacked-specific styling classes', () => {
      const { container } = render(<MultiPromoStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('overflow-hidden');
      const blurElement = container.querySelector('.blur-\\[400px\\]');
      expect(blurElement).toBeInTheDocument();
    });

    it('renders promo images and links', () => {
      render(<MultiPromoStacked {...mockProps} />);
      const images = screen.getAllByRole('img');
      const links = screen.getAllByRole('link');
      expect(images).toHaveLength(2);
      expect(links).toHaveLength(2);
    });

    it('handles missing fields gracefully', () => {
      const minimalProps = {
        params: { styles: 'stacked-styles' },
        fields: {
          data: {
            datasource: {
              children: {
                results: [
                  {
                    id: 'minimal-promo',
                    heading: { jsonValue: { value: 'Minimal Product' } },
                    description: { jsonValue: { value: 'Minimal Description' } },
                    image: { jsonValue: { value: { src: '/minimal.jpg', alt: 'Minimal' } } },
                    link: { jsonValue: { value: { href: '/minimal', text: 'View Minimal' } } },
                  },
                ],
              },
            },
          },
        },
      };
      render(<MultiPromoStacked {...minimalProps} />);
      expect(screen.getByText('Minimal Product')).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoStacked {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('SingleColumn variant', () => {
    it('renders single column layout with title and description', () => {
      render(<MultiPromoSingleColumn {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo items in single column format', () => {
      render(<MultiPromoSingleColumn {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('renders promo images and links in horizontal layout', () => {
      render(<MultiPromoSingleColumn {...mockProps} />);
      const images = screen.getAllByRole('img');
      const links = screen.getAllByRole('link');
      expect(images).toHaveLength(2);
      expect(links).toHaveLength(2);
    });

    it('applies single column specific styling', () => {
      const { container } = render(<MultiPromoSingleColumn {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      // Check for grid layout classes that indicate single column layout
      const gridContainer = container.querySelector('.grid.gap-14');
      expect(gridContainer).toBeInTheDocument();
    });

    it('handles empty children array', () => {
      const emptyChildrenProps = {
        params: { styles: 'single-column-styles' },
        fields: {
          data: {
            datasource: {
              title: { jsonValue: { value: 'Empty Title' } },
              description: { jsonValue: { value: 'Empty Description' } },
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<MultiPromoSingleColumn {...emptyChildrenProps} />);
      expect(screen.getByText('Empty Title')).toBeInTheDocument();
      expect(screen.getByText('Empty Description')).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoSingleColumn {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('FlexColumn variant', () => {
    it('renders centered title, underline, and description', () => {
      render(<MultiPromoFlexColumn {...mockProps} />);
      expect(screen.getByTestId('multipromo-flexcolumn')).toBeInTheDocument();
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
      expect(screen.getByTestId('multipromo-flexcolumn-underline')).toBeInTheDocument();
      const header = screen.getByTestId('multipromo-header');
      expect(header).toHaveClass('text-center');
    });

    it('keeps the header centered when Text Centered is selected', () => {
      const centeredProps = {
        ...mockProps,
        params: { styles: 'test-styles', TextAlignment: 'Text Centered' },
      };
      render(<MultiPromoFlexColumn {...centeredProps} />);
      expect(screen.getByTestId('multipromo-header')).toHaveClass('text-center');
    });

    it('applies Text Justified layout from the TextAlignment rendering parameter', () => {
      const justifiedProps = {
        ...mockProps,
        params: { styles: 'test-styles', TextAlignment: 'Text Justified' },
      };
      const { container } = render(<MultiPromoFlexColumn {...justifiedProps} />);
      expect(container.querySelector('section')).toHaveClass('text-justified');
      expect(screen.getByTestId('multipromo-header')).toHaveClass('text-left');
      expect(screen.getByTestId('multipromo-flexcolumn-underline')).toHaveClass('ml-0');
    });

    it('applies Text Justified layout when styles include text-justified', () => {
      const justifiedProps = {
        ...mockProps,
        params: { styles: 'text-justified' },
      };
      const { container } = render(<MultiPromoFlexColumn {...justifiedProps} />);
      expect(container.querySelector('section')).toHaveClass('text-justified');
      expect(screen.getByTestId('multipromo-header')).toHaveClass('text-left');
      expect(screen.getByTestId('multipromo-flexcolumn-underline')).toHaveClass(
        'multipromo-header-underline'
      );
    });

    it('renders all promo cards with images, titles, and links', () => {
      render(<MultiPromoFlexColumn {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/product1');
    });

    it('keeps promo descriptions and links in the hover overlay', () => {
      render(<MultiPromoFlexColumn {...mockProps} />);
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      const cards = screen.getAllByTestId('multipromo-flexcolumn-card');
      expect(cards[0]).toHaveClass('group');
      const fadedImage = screen.getAllByRole('img')[0];
      expect(fadedImage).toHaveClass('group-hover:opacity-30');
    });

    it('makes the card row keyboard-focusable for overflow scrolling', () => {
      render(<MultiPromoFlexColumn {...mockProps} />);
      const scroller = screen.getByTestId('multipromo-flexcolumn-scroller');
      expect(scroller).toHaveAttribute('tabindex', '0');
      expect(scroller).toHaveClass('overflow-x-auto');
    });

    it('applies custom styles from params', () => {
      const { container } = render(<MultiPromoFlexColumn {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('renders without items when children array is empty', () => {
      const emptyProps = {
        params: {},
        fields: {
          data: {
            datasource: {
              title: { jsonValue: { value: 'Empty Title' } },
              description: { jsonValue: { value: 'Empty Description' } },
              children: { results: [] },
            },
          },
        },
      };
      render(<MultiPromoFlexColumn {...emptyProps} />);
      expect(screen.getByText('Empty Title')).toBeInTheDocument();
      expect(screen.getByTestId('multipromo-flexcolumn-scroller')).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoFlexColumn {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });
});
