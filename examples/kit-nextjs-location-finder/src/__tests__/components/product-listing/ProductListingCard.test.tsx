import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductListingCard } from '@/components/product-listing/ProductListingCard.dev';
import { mockProductItems, mockProductListingProps } from './product-listing.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-component' }, field?.value);
  }),
  Link: jest.fn(({ field, children }) => (
    <a href={field?.value?.href} data-testid="editable-link">
      {children || field?.value?.text}
    </a>
  )),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image }: { image: { value: { src: string; alt: string } } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="image-wrapper" src={image.value.src} alt={image.value.alt} />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button data-testid="button" className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/card-spotlight/card-spotlight.dev', () => ({
  CardSpotlight: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-spotlight">{children}</div>
  ),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

jest.mock('@/variables/dictionary', () => ({
  dictionaryKeys: {
    PRODUCTLISTING_DrivingRange: 'PRODUCTLISTING_DrivingRange',
    PRODUCTLISTING_Price: 'PRODUCTLISTING_Price',
    PRODUCTLISTING_SeeFullSpecs: 'PRODUCTLISTING_SeeFullSpecs',
  },
}));

describe('ProductListingCard', () => {
  const mockProduct = mockProductItems[0];
  const mockLink = mockProductListingProps.fields.data.datasource.viewAllLink.jsonValue;

  it('renders product card with vehicle information', () => {
    render(
      <ProductListingCard
        product={mockProduct}
        link={mockLink}
        prefersReducedMotion={false}
        isPageEditing={false}
      />
    );

    expect(screen.getByText('Alaris Type I Ambulance')).toBeInTheDocument();
    expect(screen.getByText('$185,000')).toBeInTheDocument();
    expect(screen.getByText('Advanced Life Support')).toBeInTheDocument();
    expect(screen.getByText('450 miles')).toBeInTheDocument();
  });

  it('renders vehicle image correctly', () => {
    render(
      <ProductListingCard
        product={mockProduct}
        link={mockLink}
        prefersReducedMotion={false}
        isPageEditing={false}
      />
    );

    const image = screen.getByTestId('image-wrapper');
    expect(image).toHaveAttribute('src', '/images/alaris-type-1-ambulance.jpg');
    expect(image).toHaveAttribute('alt', 'Alaris Type I Ambulance');
  });

  it('renders with spotlight effect wrapper', () => {
    render(
      <ProductListingCard
        product={mockProduct}
        link={mockLink}
        prefersReducedMotion={false}
        isPageEditing={false}
      />
    );

    expect(screen.getByTestId('card-spotlight')).toBeInTheDocument();
  });
});
