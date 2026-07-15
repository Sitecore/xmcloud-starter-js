import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as PromoAnimated, ImageRight } from '@/components/promo-animated/PromoAnimated';
import type { PromoAnimatedProps } from '@/components/promo-animated/promo-animated.props';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsEditing,
  propsPrimaryColorScheme,
  propsSecondaryColorScheme,
  propsWithoutDescription,
  propsWithoutLinks,
  propsWithoutPrimaryLink,
  propsWithoutSecondaryLink,
  propsWithCustomStyles,
  propsWithPositionRight,
  propsWithoutFields,
} from './PromoAnimated.mockProps';

// Type definitions for mock components
interface MockTextProps {
  field?: { value?: string };
  tag?: string;
}

interface MockRichTextProps {
  field?: { value?: string };
}

interface MockImageWrapperProps {
  image?: ImageField;
  className?: string;
  wrapperClass?: string;
}

interface MockAnimatedSectionProps {
  children?: React.ReactNode;
  className?: string;
  animationType?: string;
}

interface MockButtonBaseProps {
  buttonLink?: LinkField;
  variant?: string;
  isPageEditing?: boolean;
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
  Text: ({ field, tag }: MockTextProps) => {
    const Tag = tag || 'span';
    return React.createElement(Tag, {}, field?.value || '');
  },
  RichText: ({ field }: MockRichTextProps) =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: field?.value || '' },
    }),
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, wrapperClass }: MockImageWrapperProps) => (
    <div data-testid="image-wrapper" className={wrapperClass}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image?.value?.src as string | undefined}
        alt={image?.value?.alt as string | undefined}
        className={className}
      />
    </div>
  ),
}));

jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children, className, animationType }: MockAnimatedSectionProps) => (
    <div data-testid="animated-section" data-animation-type={animationType} className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink, variant, isPageEditing }: MockButtonBaseProps) => {
    if (!buttonLink?.value?.href && !isPageEditing) return null;
    return (
      <a
        data-testid="button-component"
        data-variant={variant || 'default'}
        href={buttonLink?.value?.href as string | undefined}
      >
        {buttonLink?.value?.text}
      </a>
    );
  },
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
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

describe('PromoAnimated Component - Default Variant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render with all fields', () => {
      render(<PromoAnimated {...defaultProps} />);

      expect(screen.getByText('Discover Excellence')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('should render as section with data-component attribute', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const section = container.querySelector('section[data-component="PromoAnimated"]');
      expect(section).toBeInTheDocument();
    });

    it('should render title in h2 tag', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Discover Excellence');
    });

    it('should render description as RichText', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      expect(container.textContent).toContain(
        'Experience the finest quality with our exclusive collection'
      );
    });

    it('should render image with proper alt text', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/promo-animated.jpg');
      expect(img).toHaveAttribute('alt', 'Promo Animated Image');
    });

    it('should render both primary and secondary links', () => {
      render(<PromoAnimated {...defaultProps} />);

      const buttons = screen.getAllByTestId('button-component');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveAttribute('href', '/shop/premium');
      expect(buttons[1]).toHaveAttribute('href', '/learn-more');
    });
  });

  describe('Component structure', () => {
    it('should apply container class', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('@container');
    });

    it('should apply grid layout classes', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const contentWrapper = container.querySelector('.promo-animated__content-wrapper');
      expect(contentWrapper).toHaveClass('grid', 'grid-cols-1');
    });

    it('should render animated sections', () => {
      render(<PromoAnimated {...defaultProps} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      expect(animatedSections.length).toBeGreaterThan(0);
    });

    it('should render rotate animation for sprite', () => {
      render(<PromoAnimated {...defaultProps} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      const rotateSection = animatedSections.find(
        (section) => section.getAttribute('data-animation-type') === 'rotate'
      );
      expect(rotateSection).toBeInTheDocument();
    });
  });

  describe('Color schemes', () => {
    it('should apply default color scheme', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should apply primary color scheme', () => {
      const { container } = render(<PromoAnimated {...propsPrimaryColorScheme} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should apply secondary color scheme', () => {
      const { container } = render(<PromoAnimated {...propsSecondaryColorScheme} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Custom styles and positioning', () => {
    it('should apply custom styles from params', () => {
      const { container } = render(<PromoAnimated {...propsWithCustomStyles} />);

      const contentWrapper = container.querySelector('.promo-animated__content-wrapper');
      expect(contentWrapper).toHaveClass('position-center');
    });

    it('should apply position-right class', () => {
      const { container } = render(<PromoAnimated {...propsWithPositionRight} />);

      const contentWrapper = container.querySelector('.promo-animated__content-wrapper');
      expect(contentWrapper).toHaveClass('position-right');
    });
  });

  describe('Optional fields', () => {
    it('should render without description', () => {
      render(<PromoAnimated {...propsWithoutDescription} />);

      expect(screen.getByText('Discover Excellence')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
    });

    it('should render without links in non-editing mode', () => {
      render(<PromoAnimated {...propsWithoutLinks} />);

      expect(screen.getByText('Discover Excellence')).toBeInTheDocument();
      expect(screen.queryByTestId('button-component')).not.toBeInTheDocument();
    });

    it('should render without primary link', () => {
      render(<PromoAnimated {...propsWithoutPrimaryLink} />);

      const buttons = screen.getAllByTestId('button-component');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute('href', '/learn-more');
    });

    it('should render without secondary link', () => {
      render(<PromoAnimated {...propsWithoutSecondaryLink} />);

      const buttons = screen.getAllByTestId('button-component');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute('href', '/shop/premium');
    });
  });

  describe('Editing mode', () => {
    it('should render links in editing mode even without href', () => {
      const propsEditingNoLinks = {
        ...propsEditing,
        fields: {
          ...propsEditing.fields,
          primaryLink: { value: {} } as unknown as LinkField,
          secondaryLink: { value: {} } as unknown as LinkField,
        },
      };

      render(<PromoAnimated {...propsEditingNoLinks} />);

      expect(screen.getByText('Discover Excellence')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<PromoAnimated {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Promo Animated');
    });

    it('should render NoDataFallback when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as unknown as PromoAnimatedProps['fields'],
      };

      render(<PromoAnimated {...propsWithUndefinedFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render image with alt text', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Promo Animated Image');
    });

    it('should render links with proper href', () => {
      render(<PromoAnimated {...defaultProps} />);

      const buttons = screen.getAllByTestId('button-component');
      expect(buttons[0]).toHaveAttribute('href', '/shop/premium');
      expect(buttons[1]).toHaveAttribute('href', '/learn-more');
    });

    it('should render heading with semantic h2 tag', () => {
      const { container } = render(<PromoAnimated {...defaultProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });
  });
});

describe('PromoAnimated Component - ImageRight Variant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render with all fields', () => {
      render(<ImageRight {...defaultProps} />);

      expect(screen.getByText('Discover Excellence')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
    });

    it('should render as section with data-component attribute', () => {
      const { container } = render(<ImageRight {...defaultProps} />);

      const section = container.querySelector('section[data-component="PromoAnimated"]');
      expect(section).toBeInTheDocument();
    });

    it('should apply order-2 class to image container', () => {
      const { container } = render(<ImageRight {...defaultProps} />);

      const imageContainer = container.querySelector('.promo-animated__image');
      expect(imageContainer).toHaveClass('@md:order-2');
    });

    it('should apply order-1 class to content container', () => {
      const { container } = render(<ImageRight {...defaultProps} />);

      const contentContainer = container.querySelector('.promo-animated__content');
      expect(contentContainer).toHaveClass('@md:order-1');
    });
  });

  describe('Edge cases', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<ImageRight {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Promo Animated: Image Right');
    });
  });

  describe('Variant comparison', () => {
    it('should render same content as Default variant but with different order', () => {
      const { container: defaultContainer } = render(<PromoAnimated {...defaultProps} />);
      const { container: imageRightContainer } = render(<ImageRight {...defaultProps} />);

      // Both should have the same text content
      expect(defaultContainer.textContent).toContain('Discover Excellence');
      expect(imageRightContainer.textContent).toContain('Discover Excellence');

      // But different layout classes
      const defaultImageContainer = defaultContainer.querySelector('.promo-animated__image');
      const imageRightImageContainer = imageRightContainer.querySelector(
        '.promo-animated__image'
      );

      expect(defaultImageContainer).not.toHaveClass('@md:order-2');
      expect(imageRightImageContainer).toHaveClass('@md:order-2');
    });
  });
});

describe('PromoAnimated - Reduced Motion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect prefers-reduced-motion media query', () => {
    const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    window.matchMedia = matchMediaMock as typeof window.matchMedia;

    render(<PromoAnimated {...defaultProps} />);

    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});


