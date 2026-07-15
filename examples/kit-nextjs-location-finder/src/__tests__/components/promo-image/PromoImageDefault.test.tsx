import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PromoImageDefault } from '@/components/promo-image/PromoImageDefault.dev';
import { mockPromoImageProps, mockPromoImagePropsNoLink } from './promo-image.mock.props';

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

describe('PromoImageDefault', () => {
  it('renders promo with emergency vehicle image and content', () => {
    render(<PromoImageDefault {...mockPromoImageProps} />);

    expect(screen.getByText('Save Lives with Advanced Emergency Vehicles')).toBeInTheDocument();
    expect(screen.getByTestId('richtext-component')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent('Explore Ambulance Fleet');
  });

  it('renders vehicle image with vignette overlay', () => {
    render(<PromoImageDefault {...mockPromoImageProps} />);

    const image = screen.getByTestId('image-wrapper');
    expect(image).toHaveAttribute('src', '/images/alaris-ambulance-action.jpg');
    expect(image).toHaveAttribute('alt', 'Alaris Ambulance in Emergency Response');
  });

  it('does not render button when link is not provided', () => {
    render(<PromoImageDefault {...mockPromoImagePropsNoLink} />);

    expect(screen.getByText('Professional Training Programs')).toBeInTheDocument();
    expect(screen.queryByTestId('button')).not.toBeInTheDocument();
  });
});
