/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ProductPageHeaderDefault } from '@/components/site-three/ProductPageHeader';

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

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
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

describe('ProductPageHeader', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      ProductName: {
        value: 'Premium Skateboard',
      },
      Description: {
        value: 'High-quality skateboard for professionals',
      },
      Price: {
        value: '$199.99',
      },
      Images: [
        {
          id: 'img-1',
          name: 'Image 1',
          displayName: 'Product Image 1',
          url: '/images/skateboard.jpg',
          fields: {
            Image: {
              value: {
                src: '/images/skateboard.jpg',
                alt: 'Skateboard',
              },
            },
          },
        },
        {
          id: 'img-2',
          name: 'Image 2',
          displayName: 'Product Image 2',
          url: '/images/skateboard2.jpg',
          fields: {
            Image: {
              value: {
                src: '/images/skateboard2.jpg',
                alt: 'Skateboard 2',
              },
            },
          },
        },
      ],
      Colors: [
        {
          id: 'color-red',
          name: 'Red',
          displayName: 'Red',
          fields: {
            Value: {
              value: '#FF0000',
            },
          },
        },
        {
          id: 'color-blue',
          name: 'Blue',
          displayName: 'Blue',
          fields: {
            Value: {
              value: '#0000FF',
            },
          },
        },
      ],
      WarrantyLink: {
        value: {
          href: '/warranty',
          text: 'Warranty Info',
        },
      },
      ShippingLink: {
        value: {
          href: '/shipping',
          text: 'Shipping Info',
        },
      },
    },
  };

  it('renders product name', () => {
    render(<ProductPageHeaderDefault {...mockProps} />);
    expect(screen.getByText('Premium Skateboard')).toBeInTheDocument();
  });

  it('renders product description', () => {
    render(<ProductPageHeaderDefault {...mockProps} />);
    expect(screen.getByText('High-quality skateboard for professionals')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductPageHeaderDefault {...mockProps} />);
    expect(screen.getByText('$199.99')).toBeInTheDocument();
  });

  it('renders carousel with images', () => {
    render(<ProductPageHeaderDefault {...mockProps} />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders warranty and shipping links', () => {
    render(<ProductPageHeaderDefault {...mockProps} />);
    expect(screen.getByText('Warranty Info')).toBeInTheDocument();
    expect(screen.getByText('Shipping Info')).toBeInTheDocument();
  });
});
