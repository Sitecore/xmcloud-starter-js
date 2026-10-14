/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ProductComparisonDefault } from '@/components/site-three/ProductComparison';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>,
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

// Mock Carousel components
jest.mock('shadcn/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: any) => (
    <div data-testid="carousel" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: ({ ...props }: any) => (
    <button data-testid="carousel-next" {...props}>
      Next
    </button>
  ),
  CarouselPrevious: ({ ...props }: any) => (
    <button data-testid="carousel-previous" {...props}>
      Previous
    </button>
  ),
}));

// Mock Embla Carousel
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    (node: HTMLElement) => node,
    {
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      canScrollNext: () => true,
      canScrollPrev: () => true,
      on: jest.fn(),
      off: jest.fn(),
    },
  ],
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
}));

describe('ProductComparison', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Title: {
        value: 'Compare Products',
      },
      id: 'comparison-1',
      url: '/compare',
      Products: [
        {
          id: 'product-1',
          url: '/products/pro',
          fields: {
            ProductName: {
              value: 'Skateboard Pro',
            },
            Price: {
              value: '$199',
            },
            ProductImage: {
              value: {
                src: '/images/pro.jpg',
                alt: 'Pro',
              },
            },
            AmpPower: {
              value: '500W',
            },
            Specifications: [
              {
                id: 'spec-grade',
                name: 'Grade',
                displayName: 'Grade',
                fields: {
                  Value: {
                    value: 'Professional',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'product-2',
          url: '/products/basic',
          fields: {
            ProductName: {
              value: 'Skateboard Basic',
            },
            Price: {
              value: '$99',
            },
            ProductImage: {
              value: {
                src: '/images/basic.jpg',
                alt: 'Basic',
              },
            },
            AmpPower: {
              value: '250W',
            },
            Specifications: [
              {
                id: 'spec-grade-2',
                name: 'Grade',
                displayName: 'Grade',
                fields: {
                  Value: {
                    value: 'Entry Level',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  it('renders comparison heading', () => {
    render(<ProductComparisonDefault {...mockProps} />);
    expect(screen.getByText('Compare Products')).toBeInTheDocument();
  });

  it('renders all products', () => {
    render(<ProductComparisonDefault {...mockProps} />);
    expect(screen.getByText('Skateboard Pro')).toBeInTheDocument();
    expect(screen.getByText('Skateboard Basic')).toBeInTheDocument();
  });

  it('renders product prices', () => {
    render(<ProductComparisonDefault {...mockProps} />);
    expect(screen.getByText('$199')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('renders carousel component', () => {
    render(<ProductComparisonDefault {...mockProps} />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders product images', () => {
    render(<ProductComparisonDefault {...mockProps} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('handles empty products array', () => {
    const emptyProps = {
      params: {},
      fields: {
        Title: {
          value: 'Compare',
        },
        id: 'comp-empty',
        url: '/compare',
        Products: [],
      },
    };
    const { container } = render(<ProductComparisonDefault {...emptyProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
