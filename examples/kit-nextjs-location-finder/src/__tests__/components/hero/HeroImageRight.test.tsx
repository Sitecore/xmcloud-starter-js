import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroImageRight } from '@/components/hero/HeroImageRight.dev';
import { mockHeroProps } from './hero.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: Record<string, unknown>) => {
    const TextTag = tag as keyof JSX.IntrinsicElements;
    const fieldValue = (field as { value?: string })?.value || '';
    return React.createElement(TextTag, { className: className as string }, fieldValue);
  },
}));

// Mock child components
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, wrapperClass, className }: Record<string, unknown>) => (
    <div className={wrapperClass as string} data-testid="image-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={(image as { value?: { src?: string } })?.value?.src}
        className={className as string}
        alt="hero"
      />
    </div>
  ),
}));

jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="animated-section">
      {children}
    </div>
  ),
}));

jest.mock('@/components/forms/zipcode/ZipcodeSearchForm.dev', () => ({
  Default: ({ placeholder, buttonText }: { placeholder: string; buttonText: string }) => (
    <form data-testid="zipcode-form">
      <input placeholder={placeholder} />
      <button type="submit">{buttonText}</button>
    </form>
  ),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink, variant }: Record<string, unknown>) => {
    const link = buttonLink as { value?: { text?: string } };
    return (
      <button data-testid="button-base" data-variant={variant as string}>
        {link?.value?.text}
      </button>
    );
  },
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@/lib/constants', () => ({
  USER_ZIPCODE: 'user_zipcode',
}));

describe('HeroImageRight Component', () => {
  beforeEach(() => {
    // Mock window.matchMedia
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

  it('renders with split layout - content left, image right', () => {
    const { container } = render(<HeroImageRight {...mockHeroProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
  });

  it('displays content on left side with form', () => {
    render(<HeroImageRight {...mockHeroProps} />);

    expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
    expect(
      screen.getByText('Discover amazing features and services tailored for you.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('zipcode-form')).toBeInTheDocument();
  });

  it('renders banner overlay on right side image', () => {
    render(<HeroImageRight {...mockHeroProps} />);

    expect(screen.getByText('Special Offer: Get 20% off on all services')).toBeInTheDocument();
    const button = screen.getByTestId('button-base');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-variant', 'default');
  });
});
