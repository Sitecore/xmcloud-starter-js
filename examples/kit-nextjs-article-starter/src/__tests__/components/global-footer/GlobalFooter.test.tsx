import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as GlobalFooter } from '@/components/global-footer/GlobalFooter';
import type { GlobalFooterProps, FooterSocialLink } from '@/components/global-footer/global-footer.props';
import {
  defaultProps,
  propsWithoutPromoLink,
  propsWithoutSocialLinks,
  propsWithoutDatasource,
  propsWithoutFields,
  propsEditing,
  mockPageData,
} from './GlobalFooter.mockProps';

// Mock the cn utility
type ClassValue = string | number | boolean | undefined | null | Record<string, boolean>;
jest.mock('@/lib/utils', () => ({
  cn: (...args: ClassValue[]) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && arg !== null) {
          return Object.keys(arg)
            .filter((key) => (arg as Record<string, boolean>)[key])
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  },
}));

// Mock component prop interfaces
interface MockTextProps {
  field?: { value?: string };
  className?: string;
  encode?: boolean;
}

interface MockAppPlaceholderProps {
  name?: string;
  rendering?: { uid?: string };
  page?: unknown;
  componentMap?: unknown;
}

// Mock the useSitecore hook
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, className }: MockTextProps) => {
    return React.createElement('span', { className }, field?.value || '');
  },
  AppPlaceholder: ({ name, rendering }: MockAppPlaceholderProps) => (
    <div data-testid={`placeholder-${name}`} data-rendering={rendering?.uid}>
      Placeholder: {name}
    </div>
  ),
}));

// Mock Logo props interface
interface MockLogoProps {
  logo?: { value?: { src?: string; alt?: string } };
}

// Mock FooterCallout props interface
interface MockFooterCalloutProps {
  fields: {
    title?: { value?: string };
    description?: { value?: string };
    linkOptional?: { value?: { href?: string; text?: string } };
  };
}

// Mock EditableImageButton props interface
interface MockEditableImageButtonProps {
  buttonLink?: { value?: { href?: string } };
  icon?: { value?: { src?: string; alt?: string } };
  className?: string;
  variant?: string;
  size?: string;
  isPageEditing?: boolean;
}

// Mock NoDataFallback props interface
interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock the Logo component
jest.mock('@/components/logo/Logo.dev', () => ({
  Default: ({ logo }: MockLogoProps) => (
    <div data-testid="footer-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo?.value?.src} alt={logo?.value?.alt} />
    </div>
  ),
}));

// Mock FooterCallout component
jest.mock('@/components/footer-navigation-callout/FooterNavigationCallout.dev', () => ({
  Default: ({ fields }: MockFooterCalloutProps) => (
    <div data-testid="footer-callout">
      <div data-testid="callout-title">{fields.title?.value}</div>
      <div data-testid="callout-description">{fields.description?.value}</div>
      {fields.linkOptional?.value && (
        <a href={fields.linkOptional.value.href} data-testid="callout-link">
          {fields.linkOptional.value.text}
        </a>
      )}
    </div>
  ),
}));

// Mock EditableImageButton component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableImageButton: ({ buttonLink, icon, className, variant, size, isPageEditing }: MockEditableImageButtonProps) => (
    <button
      data-testid="social-link-button"
      data-href={buttonLink?.value?.href}
      data-variant={variant}
      data-size={size}
      data-editing={isPageEditing}
      className={className}
    >
      {icon?.value?.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon.value.src} alt={icon.value.alt} />
      )}
    </button>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('GlobalFooter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockPageData);
  });

  describe('Basic rendering', () => {
    it('should render footer with all fields in normal mode', () => {
      render(<GlobalFooter {...defaultProps} />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByTestId('footer-logo')).toBeInTheDocument();
      expect(screen.getByTestId('footer-callout')).toBeInTheDocument();
      expect(screen.getByText('© 2024 Company Name. All rights reserved.')).toBeInTheDocument();
    });

    it('should render footer as a footer element', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('bg-primary', 'text-white');
    });

    it('should render logo section', () => {
      render(<GlobalFooter {...defaultProps} />);

      const logo = screen.getByTestId('footer-logo');
      expect(logo).toBeInTheDocument();
      expect(logo.querySelector('img')).toHaveAttribute('src', '/images/footer-logo.svg');
    });

    it('should render placeholder for footer columns', () => {
      render(<GlobalFooter {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-container-footer-column');
      expect(placeholder).toBeInTheDocument();
    });

    it('should render callout section with correct data', () => {
      render(<GlobalFooter {...defaultProps} />);

      expect(screen.getByTestId('callout-title')).toHaveTextContent('Stay Connected');
      expect(screen.getByTestId('callout-description')).toHaveTextContent(
        'Subscribe to our newsletter for updates'
      );
      expect(screen.getByTestId('callout-link')).toHaveAttribute('href', '/newsletter');
    });

    it('should render copyright text', () => {
      render(<GlobalFooter {...defaultProps} />);

      const copyrightText = screen.getByText('© 2024 Company Name. All rights reserved.');
      expect(copyrightText).toBeInTheDocument();
      expect(copyrightText).toHaveClass('text-sm', 'text-white/80');
    });
  });

  describe('Social links rendering', () => {
    it('should render all social links', () => {
      render(<GlobalFooter {...defaultProps} />);

      const socialButtons = screen.getAllByTestId('social-link-button');
      expect(socialButtons).toHaveLength(3);
    });

    it('should render social links with correct attributes', () => {
      render(<GlobalFooter {...defaultProps} />);

      const socialButtons = screen.getAllByTestId('social-link-button');
      expect(socialButtons[0]).toHaveAttribute('data-href', 'https://facebook.com');
      expect(socialButtons[1]).toHaveAttribute('data-href', 'https://twitter.com');
      expect(socialButtons[2]).toHaveAttribute('data-href', 'https://instagram.com');
    });

    it('should render social links with ghost variant', () => {
      render(<GlobalFooter {...defaultProps} />);

      const socialButtons = screen.getAllByTestId('social-link-button');
      socialButtons.forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'ghost');
      });
    });

    it('should render social links with icon size in normal mode', () => {
      render(<GlobalFooter {...defaultProps} />);

      const socialButtons = screen.getAllByTestId('social-link-button');
      socialButtons.forEach((button) => {
        expect(button).toHaveAttribute('data-size', 'icon');
        expect(button).toHaveAttribute('data-editing', 'false');
      });
    });

    it('should render social links with default size in editing mode', () => {
      render(<GlobalFooter {...propsEditing} />);

      const socialButtons = screen.getAllByTestId('social-link-button');
      socialButtons.forEach((button) => {
        expect(button).toHaveAttribute('data-size', 'default');
        expect(button).toHaveAttribute('data-editing', 'true');
      });
    });

    it('should handle empty social links array', () => {
      render(<GlobalFooter {...propsWithoutSocialLinks} />);

      const socialButtons = screen.queryAllByTestId('social-link-button');
      expect(socialButtons).toHaveLength(0);
    });
  });

  describe('Optional fields handling', () => {
    it('should render without promo link', () => {
      render(<GlobalFooter {...propsWithoutPromoLink} />);

      expect(screen.getByTestId('footer-logo')).toBeInTheDocument();
      expect(screen.getByTestId('footer-callout')).toBeInTheDocument();
      expect(screen.queryByTestId('callout-link')).not.toBeInTheDocument();
    });

    it('should render with empty datasource', () => {
      render(<GlobalFooter {...propsWithoutDatasource} />);

      // Component should still render but with no content
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.queryByTestId('footer-logo')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should render correct grid layout for main content', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('max-w-screen-xl', 'mx-auto');
    });

    it('should render bottom section with border', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const bottomBorder = container.querySelector('.border-t');
      expect(bottomBorder).toBeInTheDocument();
      expect(bottomBorder).toHaveClass('border-white/10');
    });

    it('should apply container query classes', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('@container');
    });
  });

  describe('Placeholder integration', () => {
    it('should pass rendering object to Placeholder', () => {
      render(<GlobalFooter {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-container-footer-column');
      expect(placeholder).toHaveAttribute('data-rendering', 'footer-uid');
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<GlobalFooter {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Global Footer');
    });

    it('should render NoDataFallback when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as unknown as GlobalFooterProps['fields'],
      };

      render(<GlobalFooter {...propsWithUndefinedFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
    });

    it('should handle missing datasource gracefully', () => {
      render(<GlobalFooter {...propsWithoutDatasource} />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.queryByTestId('callout-title')).toBeInTheDocument();
    });

    it('should handle undefined social links results', () => {
      const propsWithUndefinedSocialLinks = {
        ...defaultProps,
        fields: {
          data: {
            datasource: {
              ...defaultProps.fields?.data?.datasource,
              footerSocialLinks: {} as unknown as { results: FooterSocialLink[] },
            },
          },
        },
      };

      render(<GlobalFooter {...propsWithUndefinedSocialLinks} />);

      const socialButtons = screen.queryAllByTestId('social-link-button');
      expect(socialButtons).toHaveLength(0);
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply responsive grid classes', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('@md:grid-cols-2', '@lg:grid-cols-12');
    });

    it('should apply responsive padding classes', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const contentContainer = container.querySelector('.py-12');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('px-4', '@xl:px-8');
    });

    it('should style social links container', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const socialContainer = container.querySelector('.flex.space-x-4');
      expect(socialContainer).toBeInTheDocument();
    });

    it('should apply responsive flex classes to bottom section', () => {
      const { container } = render(<GlobalFooter {...defaultProps} />);

      const bottomSection = container.querySelector('.global-footer__bottom');
      expect(bottomSection).toBeInTheDocument();
      expect(bottomSection).toHaveClass('@md:flex-row', 'flex-col');
    });
  });

  describe('Accessibility', () => {
    it('should render footer with contentinfo role', () => {
      render(<GlobalFooter {...defaultProps} />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should render copyright text with proper encoding disabled', () => {
      render(<GlobalFooter {...defaultProps} />);

      const copyrightText = screen.getByText('© 2024 Company Name. All rights reserved.');
      expect(copyrightText).toBeInTheDocument();
    });
  });
});

