import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Logo } from '@/components/logo/Logo.dev';
import type { LogoProps } from '@/components/logo/logo.props';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutClassName,
  propsWithLargeLogo,
  propsWithPngLogo,
  propsWithoutAlt,
  propsWithoutLogoValue,
  propsWithoutSrc,
  propsWithoutLogo,
  propsWithEmptyClassName,
} from './Logo.mockProps';

// Type definitions for mock components
interface MockImageWrapperProps {
  image?: ImageField;
  className?: string;
  sizes?: string;
  alt?: string;
}

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object') {
          return Object.keys(arg)
            .filter((key) => arg[key])
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  },
}));

// Mock ImageWrapper component
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, sizes, alt }: MockImageWrapperProps) => (
    <div data-testid="image-wrapper" className={className} data-sizes={sizes} data-alt={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image?.value?.src as string | undefined} alt={alt || (image?.value?.alt as string | undefined)} />
    </div>
  ),
}));

describe('Logo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render logo with all props', () => {
      render(<Logo {...defaultProps} />);

      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('should render logo image with correct src', () => {
      const { container } = render(<Logo {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/logo.svg');
    });

    it('should render logo with correct alt text', () => {
      const { container } = render(<Logo {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Home');
    });

    it('should pass "Home" as alt text to ImageWrapper', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveAttribute('data-alt', 'Home');
    });
  });

  describe('ClassName handling', () => {
    it('should apply custom className', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('custom-logo-class');
    });

    it('should apply default classes', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('w-full', 'object-contain');
    });

    it('should render with only default classes when no className provided', () => {
      render(<Logo {...propsWithoutClassName} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('w-full', 'object-contain');
      expect(wrapper).not.toHaveClass('custom-logo-class');
    });

    it('should render with empty className', () => {
      render(<Logo {...propsWithEmptyClassName} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('w-full', 'object-contain');
    });

    it('should apply custom className with large logo', () => {
      render(<Logo {...propsWithLargeLogo} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('large-logo-class', 'w-full', 'object-contain');
    });
  });

  describe('Different logo formats', () => {
    it('should render SVG logo', () => {
      const { container } = render(<Logo {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/logo.svg');
    });

    it('should render PNG logo', () => {
      const { container } = render(<Logo {...propsWithPngLogo} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/logo.png');
    });

    it('should render large logo', () => {
      const { container } = render(<Logo {...propsWithLargeLogo} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/logo-large.svg');
    });
  });

  describe('ImageWrapper integration', () => {
    it('should pass logo field to ImageWrapper', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should pass responsive sizes to ImageWrapper', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveAttribute(
        'data-sizes',
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      );
    });

    it('should pass alt text as "Home" to ImageWrapper', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveAttribute('data-alt', 'Home');
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should return empty fragment when logo value is undefined', () => {
      const { container } = render(<Logo {...propsWithoutLogoValue} />);

      expect(screen.queryByTestId('image-wrapper')).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should return empty fragment when logo is undefined', () => {
      const { container } = render(<Logo {...propsWithoutLogo} />);

      expect(screen.queryByTestId('image-wrapper')).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should return empty fragment when src is empty', () => {
      const { container } = render(<Logo {...propsWithoutSrc} />);

      expect(screen.queryByTestId('image-wrapper')).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should render when logo has no alt text', () => {
      const { container } = render(<Logo {...propsWithoutAlt} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });

    it('should handle missing logo.value.src gracefully', () => {
      const propsWithMissingSrc: LogoProps = {
        ...defaultProps,
        logo: {
          value: {
            src: null as unknown as string,
            alt: 'Logo',
            width: 164,
            height: 40,
          },
        },
      };

      const { container } = render(<Logo {...propsWithMissingSrc} />);

      expect(screen.queryByTestId('image-wrapper')).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply w-full class for full width', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('w-full');
    });

    it('should apply object-contain for proper aspect ratio', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('object-contain');
    });

    it('should combine default and custom classes', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveClass('w-full', 'object-contain', 'custom-logo-class');
    });
  });

  describe('Responsive behavior', () => {
    it('should set responsive sizes attribute', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      const sizes = wrapper.getAttribute('data-sizes');
      
      expect(sizes).toBe('(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
    });
  });

  describe('Accessibility', () => {
    it('should always use "Home" as alt text for accessibility', () => {
      render(<Logo {...defaultProps} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveAttribute('data-alt', 'Home');
    });

    it('should use "Home" alt text even when original logo has different alt', () => {
      render(<Logo {...propsWithoutAlt} />);

      const wrapper = screen.getByTestId('image-wrapper');
      expect(wrapper).toHaveAttribute('data-alt', 'Home');
    });

    it('should provide meaningful alt text for screen readers', () => {
      const { container } = render(<Logo {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Home');
    });
  });
});

