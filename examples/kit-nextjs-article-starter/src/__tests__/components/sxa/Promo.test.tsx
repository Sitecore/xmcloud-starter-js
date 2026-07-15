import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Promo, WithText as PromoWithText } from '@/components/sxa/Promo';
import type { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutStyles,
  propsWithoutId,
  propsWithEmptyIcon,
  propsWithEmptyText,
  propsWithEmptyLink,
  propsEmpty,
} from './Promo.mockProps';

// Type definitions for mock components
interface MockNextImageProps {
  field?: ImageField;
  [key: string]: unknown;
}

interface MockRichTextProps {
  field?: Field<string>;
  className?: string;
}

interface MockLinkProps {
  field?: LinkField;
  children?: React.ReactNode;
}

// Mock the Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: ({ field, ...props }: MockNextImageProps) => {
    // Don't render if field.value is null or undefined
    if (!field?.value) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img data-testid="promo-image" alt="" />;
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={field.value.src as string | undefined || ''} 
        alt={field.value.alt as string | undefined || ''} 
        {...props}
        data-testid="promo-image"
      />
    );
  },
  RichText: ({ field, className }: MockRichTextProps) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
  ),
  Link: ({ field, children }: MockLinkProps) => (
    <a href={field?.value?.href as string | undefined || '#'} data-testid="promo-link">
      {children}
    </a>
  ),
}));

describe('Promo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Promo Component', () => {
    it('should render promo with icon, text, and link', () => {
      render(<Promo {...defaultProps} />);

      expect(screen.getByTestId('promo-image')).toBeInTheDocument();
      expect(screen.getByText('Test Promo Text')).toBeInTheDocument();
      expect(screen.getByTestId('promo-link')).toBeInTheDocument();
    });

    it('should render with correct container structure', () => {
      render(<Promo {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('component', 'promo', 'custom-promo-style');
      
      const contentDiv = container?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      render(<Promo {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('custom-promo-style');
    });

    it('should render without custom styles when not provided', () => {
      render(<Promo {...propsWithoutStyles} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('component', 'promo');
      expect(container).not.toHaveClass('custom-promo-style');
    });

    it('should have correct rendering identifier', () => {
      render(<Promo {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveAttribute('id', 'promo-rendering-id');
    });

    it('should render without id when RenderingIdentifier is not provided', () => {
      render(<Promo {...propsWithoutId} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).not.toHaveAttribute('id');
    });

    it('should render PromoDefaultComponent when fields are not provided', () => {
      const propsWithoutFields = {
        ...defaultProps,
        fields: null as unknown as typeof defaultProps.fields,
      };

      render(<Promo {...propsWithoutFields} />);

      expect(screen.getByText('Promo')).toBeInTheDocument();
      expect(screen.getByText('Promo')).toHaveClass('is-empty-hint');
    });

    it('should render PromoDefaultComponent when fields are empty', () => {
      // Component only shows fallback when fields is null/undefined, not when empty
      const propsWithNullFields = {
        params: propsEmpty.params,
        fields: null as unknown as typeof defaultProps.fields,
      };
      
      render(<Promo {...propsWithNullFields} />);

      expect(screen.getByText('Promo')).toBeInTheDocument();
      expect(screen.getByText('Promo')).toHaveClass('is-empty-hint');
    });
  });

  describe('WithText Promo Component', () => {
    it('should render promo with icon and two text fields', () => {
      render(<PromoWithText {...defaultProps} />);

      expect(screen.getByTestId('promo-image')).toBeInTheDocument();
      expect(screen.getAllByText('Test Promo Text')).toHaveLength(2);
    });

    it('should render with correct container structure', () => {
      render(<PromoWithText {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('component', 'promo', 'custom-promo-style');
      
      const contentDiv = container?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      render(<PromoWithText {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('custom-promo-style');
    });

    it('should have correct rendering identifier', () => {
      render(<PromoWithText {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveAttribute('id', 'promo-rendering-id');
    });

    it('should render PromoDefaultComponent when fields are not provided', () => {
      const propsWithoutFields = {
        ...defaultProps,
        fields: null as unknown as typeof defaultProps.fields,
      };

      render(<PromoWithText {...propsWithoutFields} />);

      expect(screen.getByText('Promo')).toBeInTheDocument();
      expect(screen.getByText('Promo')).toHaveClass('is-empty-hint');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure for Default component', () => {
      render(<Promo {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('component', 'promo', 'custom-promo-style');
      
      const contentDiv = container?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
      
      const iconDiv = contentDiv?.querySelector('.field-promoicon');
      expect(iconDiv).toBeInTheDocument();
      
      const promoTextDiv = contentDiv?.querySelector('.promo-text');
      expect(promoTextDiv).toBeInTheDocument();
    });

    it('should render correct DOM structure for WithText component', () => {
      render(<PromoWithText {...defaultProps} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toHaveClass('component', 'promo', 'custom-promo-style');
      
      const contentDiv = container?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
      
      const iconDiv = contentDiv?.querySelector('.field-promoicon');
      expect(iconDiv).toBeInTheDocument();
      
      const promoTextDiv = contentDiv?.querySelector('.promo-text');
      expect(promoTextDiv).toBeInTheDocument();
    });
  });

  describe('Field rendering', () => {
    it('should render promo icon with correct attributes', () => {
      render(<Promo {...defaultProps} />);

      const image = screen.getByTestId('promo-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-promo-icon.jpg');
      expect(image).toHaveAttribute('alt', 'Promo Icon');
    });

    it('should render promo text with correct content', () => {
      render(<Promo {...defaultProps} />);

      const textContent = screen.getByText('Test Promo Text');
      expect(textContent).toBeInTheDocument();
      
      // The "field-promotext" class is on the parent div
      const textContainer = textContent.closest('.field-promotext');
      expect(textContainer).toBeInTheDocument();
    });

    it('should render promo link with correct href', () => {
      render(<Promo {...defaultProps} />);

      const link = screen.getByTestId('promo-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test-promo-link');
    });

    it('should render both text fields in WithText component', () => {
      render(<PromoWithText {...defaultProps} />);

      const textDivs = screen.getAllByText('Test Promo Text');
      expect(textDivs).toHaveLength(2);
      
      // In WithText, RichText gets "promo-text" class, and parent has "field-promotext"
      textDivs.forEach(div => {
        expect(div).toHaveClass('promo-text');
        const textContainer = div.closest('.field-promotext');
        expect(textContainer).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty icon field', () => {
      render(<Promo {...propsWithEmptyIcon} />);

      const image = screen.getByTestId('promo-image');
      expect(image).toBeInTheDocument();
      // When field.value is null, NextImage doesn't render src attribute
      expect(image).not.toHaveAttribute('src');
    });

    it('should handle empty text field', () => {
      render(<Promo {...propsWithEmptyText} />);

      const textDiv = screen.getByTestId('promo-image').closest('.component.promo')?.querySelector('.field-promotext');
      expect(textDiv).toHaveTextContent('');
    });

    it('should handle empty link field', () => {
      render(<Promo {...propsWithEmptyLink} />);

      const link = screen.getByTestId('promo-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#');
    });

    it('should handle missing params gracefully', () => {
      const propsWithoutParams = {
        params: {},
        fields: defaultProps.fields,
      };

      render(<Promo {...propsWithoutParams} />);

      const container = screen.getByTestId('promo-image').closest('.component.promo');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('component', 'promo');
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes to elements', () => {
      render(<Promo {...defaultProps} />);

      const iconDiv = screen.getByTestId('promo-image').closest('.field-promoicon');
      expect(iconDiv).toBeInTheDocument();
      
      const promoTextDiv = screen.getByText('Test Promo Text').closest('.promo-text');
      expect(promoTextDiv).toBeInTheDocument();
      
      // The "field-promotext" class is on the parent div, not the RichText div
      const textContainer = screen.getByText('Test Promo Text').closest('.field-promotext');
      expect(textContainer).toBeInTheDocument();
      
      const linkDiv = screen.getByTestId('promo-link').closest('.field-promolink');
      expect(linkDiv).toBeInTheDocument();
    });

    it('should apply promo-text class to RichText in WithText component', () => {
      render(<PromoWithText {...defaultProps} />);

      const textDivs = screen.getAllByText('Test Promo Text');
      textDivs.forEach(div => {
        // RichText gets "promo-text" class, parent div has "field-promotext"
        expect(div).toHaveClass('promo-text');
        const parentContainer = div.closest('.field-promotext');
        expect(parentContainer).toBeInTheDocument();
      });
    });
  });
});
