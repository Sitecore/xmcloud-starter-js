import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductListingThreeUp } from '@/components/product-listing/ProductListingThreeUp.dev';
import { mockProductListingProps } from './product-listing.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-component' }, field?.value);
  }),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data-fallback">No Data: {componentName}</div>
  )),
}));

jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

jest.mock('@/components/product-listing/ProductListingCard.dev', () => ({
  ProductListingCard: ({
    product,
  }: {
    product: { productName: { jsonValue: { value: string } } };
  }) => <div data-testid="product-card">{product.productName.jsonValue.value}</div>,
}));

jest.mock('@/hooks/use-match-media', () => ({
  useMatchMedia: jest.fn(() => false),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).flat().join(' ')),
}));

describe('ProductListingThreeUp', () => {
  it('renders three-up layout with title and products', () => {
    render(<ProductListingThreeUp {...mockProductListingProps} />);

    expect(screen.getByText('Explore Our Emergency Vehicle Fleet')).toBeInTheDocument();
    expect(screen.getByText('Alaris Type I Ambulance')).toBeInTheDocument();
    expect(screen.getByText('Alaris Type III Ambulance')).toBeInTheDocument();
    expect(screen.getByText('Alaris Fire Truck Pro')).toBeInTheDocument();
  });

  it('renders all three product cards in grid layout', () => {
    render(<ProductListingThreeUp {...mockProductListingProps} />);

    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(3);
  });

  it('renders NoDataFallback when fields are not provided', () => {
    const propsWithoutFields = { ...mockProductListingProps, fields: null as never };
    render(<ProductListingThreeUp {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No Data: ProductListing')).toBeInTheDocument();
  });
});
