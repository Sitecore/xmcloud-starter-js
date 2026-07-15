import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PromoAnimatedImageRight } from '@/components/promo-animated/PromoAnimatedImageRight.dev';
import { mockPromoAnimatedPropsFireTruck } from './promo-animated.mock.props';

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
  ButtonBase: ({
    buttonLink,
    variant,
  }: {
    buttonLink: { value: { text: string; href: string } };
    variant?: string;
  }) => (
    <button data-testid={`button-${variant || 'primary'}`} data-href={buttonLink.value.href}>
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

jest.mock('@/components/promo-animated/promo-animated.util', () => ({
  animatedSpriteRenderingParams: jest.fn(() => 'sprite-class'),
  imageBgExtensionRenderingParams: jest.fn(() => 'image-bg-class'),
}));

describe('PromoAnimatedImageRight', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders image right variant with fire truck content', () => {
    render(<PromoAnimatedImageRight {...mockPromoAnimatedPropsFireTruck} />);

    expect(screen.getByText('Professional Fire & Rescue Equipment')).toBeInTheDocument();
    expect(screen.getByTestId('richtext-component')).toBeInTheDocument();
  });

  it('renders fire truck image with correct attributes', () => {
    render(<PromoAnimatedImageRight {...mockPromoAnimatedPropsFireTruck} />);

    const image = screen.getByTestId('image-wrapper');
    expect(image).toHaveAttribute('src', '/images/alaris-fire-truck-hero.jpg');
    expect(image).toHaveAttribute('alt', 'Alaris Fire Truck with High-Pressure System');
  });

  it('renders buttons with correct links', () => {
    render(<PromoAnimatedImageRight {...mockPromoAnimatedPropsFireTruck} />);

    expect(screen.getByTestId('button-primary')).toHaveTextContent('Explore Fire Trucks');
    expect(screen.getByTestId('button-primary')).toHaveAttribute(
      'data-href',
      '/vehicles/fire-trucks'
    );
    expect(screen.getByTestId('button-secondary')).toHaveTextContent('Download Specs');
  });
});
