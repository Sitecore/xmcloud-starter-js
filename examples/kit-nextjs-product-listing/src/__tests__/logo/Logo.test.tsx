/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as LogoDefault } from '../../components/logo/Logo.dev';
import {
  defaultLogoProps,
  logoPropsNoImage,
  logoPropsMinimal,
  logoPropsCustomClass,
} from './Logo.mockProps';

// Mock ImageWrapper component
jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, sizes, alt }: any) => {
    if (!image?.value?.src) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.value.src}
        alt={image.value.alt || alt}
        className={className}
        data-sizes={sizes}
        data-testid="logo-image"
      />
    );
  },
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Logo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Behavior', () => {
    it('renders logo image with all properties', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute('src', '/logo/company-logo.svg');
      expect(logoImage).toHaveAttribute('alt', 'Company Logo');
    });

    it('applies custom className correctly', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('w-full', 'object-contain', 'custom-logo-class');
    });

    it('includes proper image sizes attribute', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveAttribute(
        'data-sizes',
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      );
    });
  });

  describe('Content Scenarios', () => {
    it('handles missing logo image gracefully', () => {
      render(<LogoDefault {...logoPropsNoImage} />);

      // Should not render anything when no image src
      expect(screen.queryByTestId('logo-image')).not.toBeInTheDocument();
    });

    it('renders with minimal props (no className)', () => {
      render(<LogoDefault {...logoPropsMinimal} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute('src', '/logo/company-logo.svg');

      // Should have default classes but no custom class
      expect(logoImage).toHaveClass('w-full', 'object-contain');
      expect(logoImage).not.toHaveClass('custom-logo-class');
    });

    it('handles custom CSS classes correctly', () => {
      render(<LogoDefault {...logoPropsCustomClass} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('w-full', 'object-contain', 'header-logo', 'w-32', 'h-16');
    });
  });

  describe('Image Properties', () => {
    it('sets correct alt attribute', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveAttribute('alt', 'Company Logo');
    });

    it('uses fallback alt text when image alt is missing', () => {
      const propsWithoutAlt = {
        ...defaultLogoProps,
        logo: {
          value: { src: '/logo/company-logo.svg', alt: '', width: '200', height: '100' },
        } as any,
      };

      render(<LogoDefault {...propsWithoutAlt} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveAttribute('alt', 'Home'); // Fallback alt text
    });

    it('maintains responsive image behavior', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('w-full', 'object-contain');
      expect(logoImage).toHaveAttribute(
        'data-sizes',
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      );
    });
  });

  describe('CSS Classes', () => {
    it('applies default CSS classes', () => {
      render(<LogoDefault {...logoPropsMinimal} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('w-full');
      expect(logoImage).toHaveClass('object-contain');
    });

    it('combines default and custom classes', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage.className).toContain('w-full object-contain custom-logo-class');
    });

    it('handles multiple custom CSS classes', () => {
      render(<LogoDefault {...logoPropsCustomClass} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('header-logo');
      expect(logoImage).toHaveClass('w-32');
      expect(logoImage).toHaveClass('h-16');
    });
  });

  describe('Empty States', () => {
    it('returns empty fragment when no logo src', () => {
      const { container } = render(<LogoDefault {...logoPropsNoImage} />);

      expect(container.firstChild).toBeNull();
    });

    it('returns empty fragment when logo is undefined', () => {
      const propsNoLogo = { className: 'test-class' };
      const { container } = render(<LogoDefault {...propsNoLogo} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component Integration', () => {
    it('integrates properly with ImageWrapper component', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      // Should pass correct props to ImageWrapper
      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute('src', '/logo/company-logo.svg');
      expect(logoImage).toHaveAttribute('alt', 'Company Logo');
    });

    it('maintains proper image aspect ratio classes', () => {
      render(<LogoDefault {...defaultLogoProps} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('object-contain');
    });
  });
});
