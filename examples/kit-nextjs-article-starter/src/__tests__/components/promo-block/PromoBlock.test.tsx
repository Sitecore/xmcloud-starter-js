import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as PromoBlock, ButtonLink, TextLink } from '@/components/promo-block/PromoBlock';
import type { PromoBlockProps } from '@/components/promo-block/promo-block.props';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsImageRight,
  propsVersionTwo,
  propsVersionTwoImageRight,
  propsWithoutLink,
  propsWithoutDescription,
  propsWithoutParams,
  propsWithoutFields,
} from './PromoBlock.mockProps';

// Type definitions for mock components
interface MockTextProps {
  field?: { value?: string };
}

interface MockRichTextProps {
  field?: { value?: string };
}

interface MockLinkProps {
  field?: LinkField;
}

interface MockFlexProps {
  children?: React.ReactNode;
  direction?: string;
  justify?: string;
  gap?: string;
  className?: string;
}

interface MockImageWrapperProps {
  image?: ImageField;
  className?: string;
}

interface MockButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  [key: string]: unknown;
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock dependencies
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat(2)
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          return Object.entries(arg)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  },
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: MockTextProps) => React.createElement('span', {}, field?.value || ''),
  RichText: ({ field }: MockRichTextProps) =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: field?.value || '' },
    }),
  Link: ({ field }: MockLinkProps) => {
    if (!field?.value?.href) return null;
    return React.createElement('a', { href: field.value.href }, field.value.text);
  },
}));

jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, direction, justify, gap, className }: MockFlexProps) => (
    <div
      data-testid="flex"
      data-direction={direction}
      data-justify={justify}
      data-gap={gap}
      className={className}
    >
      {children}
    </div>
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: MockImageWrapperProps) => (
    <div data-testid="image-wrapper" className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image?.value?.src as string | undefined}
        alt={image?.value?.alt as string | undefined}
      />
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, className, ...props }: MockButtonProps) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        'data-testid': 'promo-button',
        className,
        ...(children.props || {}),
        ...props,
      } as Partial<unknown>);
    }
    return React.createElement('button', { 'data-testid': 'promo-button', className, ...props }, children);
  },
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('PromoBlock Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render with all fields', () => {
      render(<PromoBlock {...defaultProps} />);

      expect(screen.getByText('Discover Premium Quality')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('should render as component with promo-block class', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const component = container.querySelector('.component.promo-block');
      expect(component).toBeInTheDocument();
    });

    it('should render heading in h3 tag', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const heading = container.querySelector('h3');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Discover Premium Quality');
    });

    it('should render description as RichText', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      expect(container.textContent).toContain('Experience the finest craftsmanship');
    });

    it('should render image', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/promo-image.jpg');
      expect(img).toHaveAttribute('alt', 'Premium Product');
    });

    it('should render link button', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const link = container.querySelector('a[href="/shop/premium"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Shop Now');
    });
  });

  describe('Image orientation - Left', () => {
    it('should apply image-left orientation classes', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const imageContainer = container.querySelectorAll('[data-testid="image-wrapper"]')[0]
        ?.parentElement;
      const hasExpectedClasses = imageContainer?.className.includes('col-start-1') &&
        imageContainer?.className.includes('sm:col-end-13');
      expect(hasExpectedClasses).toBe(true);
    });

    it('should apply correct copy classes for image-left', () => {
      render(<PromoBlock {...defaultProps} />);

      const flexComponents = screen.getAllByTestId('flex');
      const copyFlex = flexComponents[0];
      const hasExpectedClasses = copyFlex.className.includes('px-4') &&
        copyFlex.className.includes('pb-6');
      expect(hasExpectedClasses).toBe(true);
    });
  });

  describe('Image orientation - Right', () => {
    it('should apply image-right orientation classes', () => {
      const { container } = render(<PromoBlock {...propsImageRight} />);

      const imageContainer = container.querySelectorAll('[data-testid="image-wrapper"]')[0]
        ?.parentElement;
      const hasExpectedClass = imageContainer?.className.includes('col-start-1') &&
        imageContainer?.className.includes('sm:col-end-13');
      expect(hasExpectedClass).toBe(true);
    });

    it('should apply correct copy classes for image-right', () => {
      render(<PromoBlock {...propsImageRight} />);

      const flexComponents = screen.getAllByTestId('flex');
      const copyFlex = flexComponents[0];
      const hasExpectedClass = copyFlex.className.includes('col-end-1') &&
        copyFlex.className.includes('sm:col-end-13');
      expect(hasExpectedClass).toBe(true);
    });
  });

  describe('Variation - Default', () => {
    it('should apply default variation image classes', () => {
      render(<PromoBlock {...defaultProps} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toHaveClass('aspect-video', 'object-cover', 'sm:aspect-[4/3]');
    });

    it('should apply default variation copy classes', () => {
      render(<PromoBlock {...defaultProps} />);

      const flexComponents = screen.getAllByTestId('flex');
      const copyFlex = flexComponents[0];
      expect(copyFlex.className).toContain('px-4');
      expect(copyFlex.className).toContain('pb-6');
    });
  });

  describe('Variation - Version Two', () => {
    it('should apply version-two variation image classes', () => {
      render(<PromoBlock {...propsVersionTwo} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toHaveClass('aspect-video', 'sm:aspect-[1920/1080]');
    });

    it('should apply version-two variation copy classes', () => {
      render(<PromoBlock {...propsVersionTwo} />);

      const flexComponents = screen.getAllByTestId('flex');
      const copyFlex = flexComponents[0];
      expect(copyFlex.className).toContain('p-6');
      expect(copyFlex.className).toContain('bg-white');
    });

    it('should apply text-right for version-two with image-right', () => {
      render(<PromoBlock {...propsVersionTwoImageRight} />);

      const flexComponents = screen.getAllByTestId('flex');
      const copyFlex = flexComponents[0];
      const hasExpectedClasses = copyFlex.className.includes('text-right') &&
        copyFlex.className.includes('col-start-1') &&
        copyFlex.className.includes('col-end-1');
      expect(hasExpectedClasses).toBe(true);
    });

    it('should justify-end button flex for version-two with image-right', () => {
      render(<PromoBlock {...propsVersionTwoImageRight} />);

      const flexComponents = screen.getAllByTestId('flex');
      const buttonFlex = flexComponents[1]; // Second Flex is for button
      expect(buttonFlex.className).toContain('justify-end');
    });
  });

  describe('Optional fields', () => {
    it('should render without link', () => {
      render(<PromoBlock {...propsWithoutLink} />);

      expect(screen.getByText('Discover Premium Quality')).toBeInTheDocument();
      expect(screen.queryByTestId('promo-button')).not.toBeInTheDocument();
    });

    it('should render with empty description', () => {
      render(<PromoBlock {...propsWithoutDescription} />);

      expect(screen.getByText('Discover Premium Quality')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });
  });

  describe('Default params behavior', () => {
    it('should default to image-left when orientation not specified', () => {
      const { container } = render(<PromoBlock {...propsWithoutParams} />);

      const imageContainer = container.querySelectorAll('[data-testid="image-wrapper"]')[0]
        ?.parentElement;
      const hasExpectedClass = imageContainer?.className.includes('col-start-1') &&
        imageContainer?.className.includes('sm:col-end-13');
      expect(hasExpectedClass).toBe(true);
    });

    it('should default to default variation when not specified', () => {
      render(<PromoBlock {...propsWithoutParams} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toHaveClass('aspect-video', 'sm:aspect-[4/3]');
    });
  });

  describe('Component structure', () => {
    it('should apply grid layout classes', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const component = container.querySelector('.promo-block');
      expect(component).toHaveClass('grid', 'columns-1', 'sm:columns-12');
    });

    it('should use Flex for copy container', () => {
      render(<PromoBlock {...defaultProps} />);

      const flexComponents = screen.getAllByTestId('flex');
      const copyFlex = flexComponents[0];
      expect(copyFlex).toHaveAttribute('data-direction', 'column');
      expect(copyFlex).toHaveAttribute('data-justify', 'center');
      expect(copyFlex).toHaveAttribute('data-gap', '4');
    });

    it('should use Flex for button container', () => {
      render(<PromoBlock {...defaultProps} />);

      const flexComponents = screen.getAllByTestId('flex');
      const buttonFlex = flexComponents[1];
      expect(buttonFlex).toHaveAttribute('data-gap', '2');
    });
  });

  describe('Edge cases', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<PromoBlock {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Promo Block');
    });

    it('should render NoDataFallback when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as unknown as PromoBlockProps['fields'],
      };

      render(<PromoBlock {...propsWithUndefinedFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('Component variants', () => {
    describe('ButtonLink variant', () => {
      it('should render same as Default', () => {
        const { container: defaultContainer } = render(<PromoBlock {...defaultProps} />);
        const { container: buttonLinkContainer } = render(<ButtonLink {...defaultProps} />);

        expect(defaultContainer.innerHTML).toBe(buttonLinkContainer.innerHTML);
      });

      it('should render with default variation', () => {
        render(<ButtonLink {...defaultProps} />);

        const imageWrapper = screen.getByTestId('image-wrapper');
        expect(imageWrapper).toHaveClass('aspect-video', 'sm:aspect-[4/3]');
      });
    });

    describe('TextLink variant', () => {
      it('should apply version-two variation', () => {
        render(<TextLink {...defaultProps} />);

        const imageWrapper = screen.getByTestId('image-wrapper');
        expect(imageWrapper).toHaveClass('sm:aspect-[1920/1080]');
      });

      it('should apply version-two copy styles', () => {
        render(<TextLink {...defaultProps} />);

        const flexComponents = screen.getAllByTestId('flex');
        const copyFlex = flexComponents[0];
        expect(copyFlex.className).toContain('bg-white');
        expect(copyFlex.className).toContain('p-6');
      });
    });
  });

  describe('CSS classes', () => {
    it('should apply component classes', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const component = container.querySelector('.component');
      expect(component).toHaveClass('promo-block', 'grid');
    });

    it('should apply gap classes', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const component = container.querySelector('.promo-block');
      expect(component).toHaveClass('gap-6');
    });

    it('should apply alignment classes', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const component = container.querySelector('.promo-block');
      expect(component).toHaveClass('align-middle');
    });
  });

  describe('Accessibility', () => {
    it('should render image with alt text', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Premium Product');
    });

    it('should render link with proper href', () => {
      const { container } = render(<PromoBlock {...defaultProps} />);

      const link = container.querySelector('a[href="/shop/premium"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Shop Now');
    });
  });
});

