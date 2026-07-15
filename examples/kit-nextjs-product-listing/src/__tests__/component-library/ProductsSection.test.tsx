import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ProductsSection } from '@/components/component-library/ProductsSection';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="products-text">{field?.jsonValue?.value}</span>,
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="products-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="products-image" alt="" />
  ),
}));

jest.mock('shadcd/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: any) => (
    <div data-testid="products-carousel" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="products-carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="products-carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: () => <button data-testid="products-carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="products-carousel-prev">Previous</button>,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

const defaultProps = {
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        heading: { jsonValue: { value: 'Our Products' } },
        link: { jsonValue: { value: { href: '/products', text: 'View All' } } },
        children: {
          results: [
            {
              id: '1',
              productImage: { jsonValue: { value: { src: '/product1.jpg', alt: 'Product 1' } } },
              productTagLine: { jsonValue: { value: 'Product 1' } },
              productLink: { jsonValue: { value: { href: '/product1' } } },
              productDescription: { jsonValue: { value: 'Description 1' } },
              productPrice: { jsonValue: { value: '$99' } },
              productDiscountedPrice: { jsonValue: { value: '$79' } },
            },
            {
              id: '2',
              productImage: { jsonValue: { value: { src: '/product2.jpg', alt: 'Product 2' } } },
              productTagLine: { jsonValue: { value: 'Product 2' } },
              productLink: { jsonValue: { value: { href: '/product2' } } },
              productDescription: { jsonValue: { value: 'Description 2' } },
              productPrice: { jsonValue: { value: '$149' } },
              productDiscountedPrice: { jsonValue: { value: '$119' } },
            },
          ],
        },
      },
    },
  },
};

describe('ProductsSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProductsSection {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders carousel', () => {
    render(<ProductsSection {...defaultProps} />);
    const carousel = screen.getByTestId('products-carousel');
    expect(carousel).toBeInTheDocument();
  });

  it('renders product images', () => {
    render(<ProductsSection {...defaultProps} />);
    const images = screen.getAllByTestId('products-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders product text elements', () => {
    render(<ProductsSection {...defaultProps} />);
    const textElements = screen.getAllByTestId('products-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-products-style' },
    };
    const { container } = render(<ProductsSection {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-products-style');
  });

  it('handles empty products list', () => {
    const propsWithEmpty = {
      ...defaultProps,
      fields: {
        data: {
          datasource: {
            ...defaultProps.fields.data.datasource,
            children: {
              results: [],
            },
          },
        },
      },
    };
    const { container } = render(<ProductsSection {...propsWithEmpty} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
