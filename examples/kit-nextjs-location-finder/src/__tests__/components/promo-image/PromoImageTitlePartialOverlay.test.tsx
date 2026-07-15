import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PromoTitlePartialOverlay } from '@/components/promo-image/PromoImageTitlePartialOverlay.dev';
import { mockPromoImagePropsFireTruck } from './promo-image.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-component' }, field?.value);
  }),
  RichText: jest.fn(({ field, className }) => (
    <div
      className={className}
      data-testid="richtext-component"
      dangerouslySetInnerHTML={{ __html: field?.value }}
    />
  )),
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

jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink }: { buttonLink: { value: { text: string; href: string } } }) => (
    <button data-testid="button" data-href={buttonLink.value.href}>
      {buttonLink.value.text}
    </button>
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image }: { image: { value: { src: string; alt: string } } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="image-wrapper" src={image.value.src} alt={image.value.alt} />
  ),
}));

jest.mock('@/hooks/use-match-media', () => ({
  useMatchMedia: jest.fn(() => false),
}));

describe('PromoImageTitlePartialOverlay', () => {
  it('renders title with partial overlay effect', () => {
    render(<PromoTitlePartialOverlay {...mockPromoImagePropsFireTruck} />);

    expect(screen.getByText('Professional Fire Suppression Systems')).toBeInTheDocument();
    expect(screen.getByTestId('richtext-component')).toBeInTheDocument();
  });

  it('renders fire truck image with overlay', () => {
    render(<PromoTitlePartialOverlay {...mockPromoImagePropsFireTruck} />);

    const image = screen.getByTestId('image-wrapper');
    expect(image).toHaveAttribute('src', '/images/alaris-fire-truck-action.jpg');
    expect(image).toHaveAttribute('alt', 'Alaris Fire Truck Fighting Fire');
  });

  it('renders button with partial overlay styling', () => {
    render(<PromoTitlePartialOverlay {...mockPromoImagePropsFireTruck} />);

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('View Fire Equipment');
    expect(button).toHaveAttribute('data-href', '/vehicles/fire-trucks');
  });
});
