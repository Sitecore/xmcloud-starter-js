import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Logo } from '@/components/logo/Logo.dev';
import type { ImageField } from '@sitecore-content-sdk/nextjs';

//  Mock ImageWrapper component
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  __esModule: true,
  Default: ({
    image,
    className,
    sizes,
    alt,
  }: {
    image: ImageField;
    className?: string;
    sizes?: string;
    alt?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="mock-image-wrapper"
      src={image?.value?.src}
      alt={alt}
      className={className}
      sizes={sizes}
    />
  ),
}));

//  Mock cn() util
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Logo Component', () => {
  const mockLogo: ImageField = {
    value: {
      src: '/test-logo.png',
    },
  };

  it('renders the ImageWrapper with correct props', () => {
    render(<Logo logo={mockLogo} />);

    const img = screen.getByTestId('mock-image-wrapper');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-logo.png');
    expect(img).toHaveAttribute('alt', 'Home');
  });

  it('applies default and custom class names correctly', () => {
    render(<Logo logo={mockLogo} className="custom-class" />);

    const img = screen.getByTestId('mock-image-wrapper');
    expect(img.className).toContain('w-full');
    expect(img.className).toContain('object-contain');
    expect(img.className).toContain('custom-class');
  });

  it('returns empty fragment when logo is missing', () => {
    const { container } = render(<Logo logo={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns empty fragment when logo src is missing', () => {
    const invalidLogo: ImageField = { value: { src: '' } };
    const { container } = render(<Logo logo={invalidLogo} />);
    expect(container.firstChild).toBeNull();
  });
});
