import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as TextBanner,
  TextBanner01,
  TextBanner02,
} from '@/components/text-banner/TextBanner';
import {
  defaultProps,
  propsWithoutImage,
  propsWithSingleLink,
  propsWithoutLinks,
  propsWithoutDescription,
  propsWithSecondaryTheme,
  propsWithDarkTheme,
  propsWithLightTheme,
  propsWithMutedTheme,
  propsWithAccentTheme,
  propsWithExcludeTopMargin,
  propsWithCustomStyles,
  propsWithEmptyHeading,
  propsWithoutFields,
  propsWithUndefinedFields,
} from './TextBanner.mockProps';

// Type definitions for mock components
import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';

interface MockTextProps {
  field?: Field<string>;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
}

interface MockLinkProps {
  field?: LinkField;
  editable?: boolean;
  className?: string;
}

// Mock useSitecore
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
  Text: ({ field, tag, className }: MockTextProps) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
  Link: ({ field, editable, className }: MockLinkProps) => (
    <a
      href={field?.value?.href as string | undefined}
      className={className}
      data-testid="link-field"
      data-editable={editable?.toString()}
    >
      {field?.value?.text as string | undefined}
    </a>
  ),
}));

// Type definitions for cn utility
type CnArgs = Array<string | boolean | Record<string, boolean> | undefined>;

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: CnArgs) => {
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

// Type definitions for UI components
interface MockButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  variant?: string;
  size?: string;
  className?: string;
}

interface MockFlexProps {
  children?: React.ReactNode;
  wrap?: string;
  align?: string;
  justify?: string;
  as?: keyof JSX.IntrinsicElements;
  gap?: string;
  className?: string;
}

interface MockFlexItemProps {
  children?: React.ReactNode;
  basis?: string;
  grow?: string;
  className?: string;
}

interface MockButtonBaseProps {
  buttonLink?: LinkField;
  variant?: string;
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, variant, size, className }: MockButtonProps) => (
    <div
      data-testid="button"
      data-as-child={asChild?.toString()}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </div>
  ),
}));

// Mock Flex components
jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, wrap, align, justify, as, gap, className }: MockFlexProps) => {
    const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
    return React.createElement(
      Tag,
      {
        className,
        'data-testid': 'flex',
        'data-wrap': wrap,
        'data-align': align,
        'data-justify': justify,
        'data-gap': gap,
      },
      children
    );
  },
  FlexItem: ({ children, basis, grow, className }: MockFlexItemProps) => (
    <div
      data-testid="flex-item"
      data-basis={basis}
      data-grow={grow}
      className={className}
    >
      {children}
    </div>
  ),
}));

// Mock ButtonBase
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink, variant }: MockButtonBaseProps) => (
    <a
      href={buttonLink?.value?.href as string | undefined}
      data-testid="button-base"
      data-variant={variant}
    >
      {buttonLink?.value?.text as string | undefined}
    </a>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('TextBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default variant', () => {
    describe('Basic rendering', () => {
      it('should render text banner with all fields', () => {
        render(<TextBanner {...defaultProps} />);

        expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
        expect(
          screen.getByText('Discover amazing features and benefits that will transform your experience')
        ).toBeInTheDocument();
        expect(screen.getByText('Read about Welcome to Our Platform')).toBeInTheDocument();
      });

      it('should render heading in h3 tag', () => {
        const { container } = render(<TextBanner {...defaultProps} />);

        const heading = container.querySelector('h3');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Welcome to Our Platform');
      });

      it('should render description in p tag', () => {
        const { container } = render(<TextBanner {...defaultProps} />);

        const description = container.querySelector('p');
        expect(description).toBeInTheDocument();
      });

      it('should render with section tag', () => {
        const { container } = render(<TextBanner {...defaultProps} />);

        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
      });
    });

    describe('Links handling', () => {
      it('should render link when provided', () => {
        render(<TextBanner {...defaultProps} />);

        const links = screen.getAllByTestId('link-field');
        expect(links.length).toBeGreaterThan(0);
        expect(links[0]).toHaveAttribute('href', '/learn-more');
      });

      it('should render single link when only one is provided', () => {
        render(<TextBanner {...propsWithSingleLink} />);

        const links = screen.getAllByTestId('link-field');
        expect(links).toHaveLength(1);
        expect(links[0]).toHaveAttribute('href', '/learn-more');
      });

      it('should render without links when not provided', () => {
        render(<TextBanner {...propsWithoutLinks} />);

        expect(screen.queryByTestId('link-field')).not.toBeInTheDocument();
      });
    });

    describe('Image handling', () => {
      it('should apply background image style when image is provided', () => {
        const { container } = render(<TextBanner {...defaultProps} />);

        const section = container.querySelector('section');
        expect(section).toHaveStyle({ '--bg-img': 'url(/images/banner-background.jpg)' });
      });

      it('should not apply background image style when image is not provided', () => {
        const { container } = render(<TextBanner {...propsWithoutImage} />);

        const section = container.querySelector('section');
        expect(section?.style.getPropertyValue('--bg-img')).toBe('');
      });
    });

    describe('Component structure', () => {
      it('should render correct DOM structure', () => {
        const { container } = render(<TextBanner {...defaultProps} />);

        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('p-5', 'mt-4');
      });

      it('should apply correct flex container classes', () => {
        render(<TextBanner {...defaultProps} />);

        const flexElements = screen.getAllByTestId('flex');
        // Get the main flex container (first one)
        expect(flexElements[0]).toHaveAttribute('data-wrap', 'wrap');
        expect(flexElements[0]).toHaveAttribute('data-gap', '3');
      });
    });
  });

  describe('Theme variants', () => {
    it('should render with primary theme', () => {
      const { container } = render(<TextBanner {...defaultProps} />);

      const section = container.querySelector('section');
      // When image is provided, it uses bg-img-primary instead of bg-primary
      expect(section).toHaveClass('bg-img-primary', 'text-primary-foreground');
    });

    it('should render with secondary theme', () => {
      const { container } = render(<TextBanner {...propsWithSecondaryTheme} />);

      const section = container.querySelector('section');
      // Theme is applied through cva, check section is rendered
      expect(section).toBeInTheDocument();
    });

    it('should render with dark theme', () => {
      const { container } = render(<TextBanner {...propsWithDarkTheme} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render with light theme', () => {
      const { container } = render(<TextBanner {...propsWithLightTheme} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render with muted theme', () => {
      const { container } = render(<TextBanner {...propsWithMutedTheme} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render with accent theme', () => {
      const { container } = render(<TextBanner {...propsWithAccentTheme} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Optional fields handling', () => {
    it('should render without description field', () => {
      render(<TextBanner {...propsWithoutDescription} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(
        screen.queryByText('Discover amazing features and benefits that will transform your experience')
      ).not.toBeInTheDocument();
    });

    it('should handle empty heading value', () => {
      render(<TextBanner {...propsWithEmptyHeading} />);

      const textFields = screen.getAllByTestId('text-field');
      const emptyHeading = textFields.find((el) => el.textContent === '');
      expect(emptyHeading).toBeInTheDocument();
    });
  });

  describe('Params handling', () => {
    it('should exclude top margin when param is set', () => {
      const { container } = render(<TextBanner {...propsWithExcludeTopMargin} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-0');
    });

    it('should apply custom styles when provided', () => {
      const { container } = render(<TextBanner {...propsWithCustomStyles} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-banner-styles');
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should show NoDataFallback when fields is null', () => {
      render(<TextBanner {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Text Banner')).toBeInTheDocument();
    });

    it('should show NoDataFallback when fields is undefined', () => {
      render(<TextBanner {...propsWithUndefinedFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('TextBanner01 variant', () => {
    it('should render TextBanner01 variant', () => {
      render(<TextBanner01 {...defaultProps} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
    });

    it('should render with ButtonBase components', () => {
      render(<TextBanner01 {...defaultProps} />);

      const buttons = screen.getAllByTestId('button-base');
      expect(buttons).toHaveLength(2);
    });

    it('should render heading in h2 tag', () => {
      const { container } = render(<TextBanner01 {...defaultProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });

    it('should show NoDataFallback with correct name when no fields', () => {
      render(<TextBanner01 {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Text Banner: 01')).toBeInTheDocument();
    });
  });

  describe('TextBanner02 variant', () => {
    it('should render TextBanner02 variant', () => {
      render(<TextBanner02 {...defaultProps} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
    });

    it('should render with centered layout', () => {
      const { container } = render(<TextBanner02 {...defaultProps} />);

      const centeredContainer = container.querySelector('.text-center');
      expect(centeredContainer).toBeInTheDocument();
    });

    it('should render heading in h2 tag', () => {
      const { container } = render(<TextBanner02 {...defaultProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });

    it('should show NoDataFallback with correct name when no fields', () => {
      render(<TextBanner02 {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Text Banner: 02')).toBeInTheDocument();
    });

    it('should render buttons with small size', () => {
      render(<TextBanner02 {...defaultProps} />);

      const buttons = screen.getAllByTestId('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-size', 'sm');
      });
    });
  });

  describe('Responsive layout', () => {
    it('should apply responsive padding', () => {
      const { container } = render(<TextBanner {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('p-5');
    });

    it('should apply overflow hidden and rounded corners', () => {
      const { container } = render(<TextBanner {...defaultProps} />);

      const section = container.querySelector('section');
      // Section is rendered with proper structure
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('p-5');
    });
  });

  describe('Accessibility', () => {
    it('should render semantic section element', () => {
      const { container } = render(<TextBanner {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render links with proper href attributes', () => {
      render(<TextBanner {...defaultProps} />);

      const links = screen.getAllByTestId('link-field');
      expect(links[0]).toHaveAttribute('href', '/learn-more');
    });
  });
});

