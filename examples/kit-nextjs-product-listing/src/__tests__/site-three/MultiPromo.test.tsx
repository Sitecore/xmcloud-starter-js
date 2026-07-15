/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as MultiPromoDefault,
  Stacked as MultiPromoStacked,
  SingleColumn as MultiPromoSingleColumn,
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
});
