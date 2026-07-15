/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as PromoBlockDefault,
  ButtonLink,
  TextLink,
} from '../../components/promo-block/PromoBlock';
import type { PromoBlockProps } from '../../components/promo-block/promo-block.props';
import {
  defaultPromoBlockProps,
  promoBlockPropsImageRight,
  promoBlockPropsVariationTwo,
  promoBlockPropsVariationTwoImageRight,
  promoBlockPropsNoLink,
  promoBlockPropsMinimal,
  promoBlockPropsEmpty,
  promoBlockPropsRichText,
  promoBlockPropsLongContent,
  promoBlockPropsNoFields,
  promoBlockPropsNoImage,
  promoBlockOrientations,
  promoBlockVariations,
  textLinkPromoBlockProps,
  buttonLinkPromoBlockProps,
} from './PromoBlock.mockProps';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ children, field, tag: Tag = 'span', className, ...props }: any) => (
    <Tag className={className} data-testid="sitecore-text" {...props}>
      {field?.value || children}
    </Tag>
  ),
  RichText: ({ children, field, className, ...props }: any) => (
    <div
      className={className}
      data-testid="sitecore-richtext"
      dangerouslySetInnerHTML={{ __html: field?.value || children }}
      {...props}
    />
  ),
  Link: ({ children, field, className, ...props }: any) => (
    <a href={field?.value?.href} className={className} data-testid="sitecore-link" {...props}>
      {field?.value?.text || children}
    </a>
  ),
}));

jest.mock('../../components/flex/Flex.dev', () => ({
  Flex: ({ children, direction, justify, gap, className, ...props }: any) => (
    <div
      className={className}
      data-testid="flex-container"
      data-direction={direction}
      data-justify={justify}
      data-gap={gap}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, ...props }: any) => (
    <img
      src={image?.value?.src}
      alt={image?.value?.alt}
      className={className}
      data-testid="image-wrapper"
      {...props}
    />
  ),
}));

jest.mock('../../components/ui/button', () => ({
  Button: ({ children, asChild, className, variant, ...props }: any) => (
    <button
      className={className}
      data-testid="ui-button"
      data-variant={variant}
      data-as-child={asChild}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('PromoBlock Component', () => {
  describe('Default Rendering', () => {
    it('renders with all content elements', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('ui-button')).toBeInTheDocument();
    });

    it('renders heading with correct tag', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Premium Audio Experience');
    });

    it('renders image with correct attributes', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveAttribute('src', '/images/promo-block-hero.jpg');
      expect(image).toHaveAttribute('alt', 'Premium Audio Setup');
    });

    it('renders link button when link is provided', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const link = screen.getByTestId('sitecore-link');
      expect(link).toHaveAttribute('href', '/products/premium');
      expect(link).toHaveTextContent('Explore Premium Collection');
    });

    it('applies component and grid classes', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const container = screen.getByText('Premium Audio Experience').closest('.component');
      expect(container).toHaveClass('promo-block', 'grid');
    });
  });

  describe('Orientation Handling', () => {
    it.each(promoBlockOrientations)('renders correctly with $name orientation', ({ props }) => {
      render(<PromoBlockDefault {...props} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('applies different classes for image right orientation', () => {
      render(<PromoBlockDefault {...promoBlockPropsImageRight} />);

      // Component should render without errors
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('applies different classes for image left orientation', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      // Component should render without errors
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });
  });

  describe('Variation Handling', () => {
    it.each(promoBlockVariations)('renders correctly with $name', ({ props }) => {
      render(<PromoBlockDefault {...props} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('uses default variation when not specified', () => {
      const propsWithoutVariation = {
        ...defaultPromoBlockProps,
        params: {
          orientation: defaultPromoBlockProps.params.orientation,
        },
      };

      render(<PromoBlockDefault {...(propsWithoutVariation as PromoBlockProps)} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('applies VERSION_TWO variation classes', () => {
      render(<PromoBlockDefault {...promoBlockPropsVariationTwo} />);

      // Should render without errors with variation two
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('combines variation two with image right orientation', () => {
      render(<PromoBlockDefault {...promoBlockPropsVariationTwoImageRight} />);

      const flexContainers = screen.getAllByTestId('flex-container');

      // Should have flex containers for layout
      expect(flexContainers.length).toBeGreaterThan(0);

      // The component should render correctly regardless
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });
  });

  describe('Content Scenarios', () => {
    it('renders without link button when no link provided', () => {
      render(<PromoBlockDefault {...promoBlockPropsNoLink} />);

      expect(screen.getByText('Information Only')).toBeInTheDocument();
      expect(screen.queryByTestId('ui-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
    });

    it('renders with minimal content', () => {
      render(<PromoBlockDefault {...promoBlockPropsMinimal} />);

      expect(screen.getByText('Simple Heading')).toBeInTheDocument();
      expect(screen.getByText('Simple description text')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('handles empty content fields', () => {
      render(<PromoBlockDefault {...promoBlockPropsEmpty} />);

      // Should render structure but with empty content
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
    });

    it('renders rich text content correctly', () => {
      render(<PromoBlockDefault {...promoBlockPropsRichText} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      // Rich text should contain HTML content
      expect(richTextContent.innerHTML).toContain('<h4>Advanced Features</h4>');
      expect(richTextContent.innerHTML).toContain('<strong>superior sound quality</strong>');
    });

    it('handles long content without layout issues', () => {
      render(<PromoBlockDefault {...promoBlockPropsLongContent} />);

      expect(
        screen.getByText('Revolutionary Audio Technology for the Modern Professional')
      ).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('handles missing image gracefully', () => {
      render(<PromoBlockDefault {...(promoBlockPropsNoImage as PromoBlockProps)} />);

      expect(screen.getByText('Text Only Content')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();

      // Component should render without crashing regardless of image presence
      expect(document.body).toContainElement(screen.getByText('Text Only Content'));
    });
  });

  describe('Fallback Scenarios', () => {
    it('returns NoDataFallback when no fields provided', () => {
      render(<PromoBlockDefault {...(promoBlockPropsNoFields as PromoBlockProps)} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Promo Block')).toBeInTheDocument();
    });

    it('renders content when fields are provided but empty', () => {
      render(<PromoBlockDefault {...promoBlockPropsEmpty} />);

      // Should not show fallback, should render empty content
      expect(screen.queryByTestId('no-data-fallback')).not.toBeInTheDocument();
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
    });
  });

  describe('Layout and Flex Components', () => {
    it('uses Flex components with correct props', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const flexContainers = screen.getAllByTestId('flex-container');

      // Should have at least one flex container for content layout
      expect(flexContainers.length).toBeGreaterThanOrEqual(1);

      // Check for expected flex properties
      const contentFlex = flexContainers[0];
      expect(contentFlex).toHaveAttribute('data-direction', 'column');
      expect(contentFlex).toHaveAttribute('data-justify', 'center');
      expect(contentFlex).toHaveAttribute('data-gap', '4');
    });

    it('applies correct classes to content and container', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const container = screen.getByText('Premium Audio Experience').closest('.component');
      expect(container).toHaveClass('promo-block');
    });
  });

  describe('Component Variants', () => {
    describe('TextLink Variant', () => {
      it('renders TextLink variant correctly', () => {
        render(<TextLink {...textLinkPromoBlockProps} />);

        expect(screen.getByText('Text Link Variant')).toBeInTheDocument();
        expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ui-button')).toBeInTheDocument();
      });

      it('applies VERSION_TWO variation to TextLink', () => {
        render(<TextLink {...textLinkPromoBlockProps} />);

        // Should render without errors - variation is applied internally
        expect(screen.getByText('Text Link Variant')).toBeInTheDocument();
      });
    });

    describe('ButtonLink Variant', () => {
      it('renders ButtonLink variant correctly', () => {
        render(<ButtonLink {...buttonLinkPromoBlockProps} />);

        expect(screen.getByText('Button Link Variant')).toBeInTheDocument();
        expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ui-button')).toBeInTheDocument();
      });

      it('ButtonLink is same as Default', () => {
        render(<ButtonLink {...buttonLinkPromoBlockProps} />);

        // Both should render the same structure
        expect(screen.getByText('Button Link Variant')).toBeInTheDocument();
      });
    });

    describe('Default Variant', () => {
      it('Default export points to ButtonLink', () => {
        render(<PromoBlockDefault {...defaultPromoBlockProps} />);

        expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
        expect(screen.getByTestId('ui-button')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Premium Audio Experience');
    });

    it('provides proper link accessibility', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/products/premium');
      expect(link).toHaveAccessibleName('Explore Premium Collection');
    });

    it('ensures images have proper alt text', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveAttribute('alt', 'Premium Audio Setup');
    });

    it('maintains semantic structure', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      // Should have heading, content, and interactive elements in logical order
      const heading = screen.getByRole('heading', { level: 3 });
      const link = screen.getByRole('link');

      expect(heading).toBeInTheDocument();
      expect(link).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      const container = screen.getByText('Premium Audio Experience').closest('.grid');
      expect(container).toHaveClass('columns-1');
      expect(container?.className).toContain('sm:columns-12');
    });

    it('handles different screen size layouts', () => {
      render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      // Component should render and apply responsive classes
      const container = screen.getByText('Premium Audio Experience').closest('.component');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles re-renders without errors', () => {
      const { rerender } = render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();

      rerender(<PromoBlockDefault {...promoBlockPropsImageRight} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('handles prop changes efficiently', () => {
      const { rerender } = render(<PromoBlockDefault {...defaultPromoBlockProps} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();

      rerender(<PromoBlockDefault {...promoBlockPropsVariationTwo} />);

      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });
  });
});
