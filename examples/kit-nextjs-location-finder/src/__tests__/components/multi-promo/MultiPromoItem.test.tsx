import React from 'react';
import { render } from '@testing-library/react';
import { Default as MultiPromoItem } from '@/components/multi-promo/MultiPromoItem.dev';
import { mockMultiPromoItems } from './multi-promo.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) =>
    React.createElement(tag, { className }, field?.value || '')
  ),
  Link: jest.fn(({ field, children }) => (
    <a href={field?.value?.href} data-testid="link">
      {field?.value?.text || children}
    </a>
  )),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: jest.fn(({ image, className, wrapperClass }) => (
    <div className={wrapperClass} data-testid="image-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image?.value?.src}
        alt={image?.value?.alt}
        className={className}
        data-testid="promo-image"
      />
    </div>
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, variant, asChild, className }) => (
    <button data-variant={variant} data-as-child={asChild} className={className}>
      {children}
    </button>
  )),
}));

describe('MultiPromoItem', () => {
  const item = mockMultiPromoItems[0];

  it('renders promo item with image, heading, and link', () => {
    const { getByText, getByTestId } = render(<MultiPromoItem {...item} />);

    expect(getByTestId('image-wrapper')).toBeInTheDocument();
    expect(getByTestId('promo-image')).toHaveAttribute('src', '/images/promo-1.jpg');
    expect(getByText('Premium Product')).toBeInTheDocument();
    expect(getByTestId('link')).toBeInTheDocument();
    expect(getByTestId('link')).toHaveAttribute('href', '/products/premium');
  });

  it('renders item without link when link is not provided', () => {
    const itemWithoutLink = {
      ...item,
      link: undefined,
    };
    const { queryByTestId, getByText } = render(<MultiPromoItem {...itemWithoutLink} />);

    expect(getByText('Premium Product')).toBeInTheDocument();
    expect(queryByTestId('link')).not.toBeInTheDocument();
  });

  it('renders all content correctly for different items', () => {
    const secondItem = mockMultiPromoItems[1];
    const { getByText, getByTestId } = render(<MultiPromoItem {...secondItem} />);

    expect(getByText('Featured Service')).toBeInTheDocument();
    expect(getByTestId('promo-image')).toHaveAttribute('src', '/images/promo-2.jpg');
    expect(getByTestId('link')).toHaveAttribute('href', '/services/featured');
  });
});
