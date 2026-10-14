/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PromoAnimatedDefault } from '../../components/promo-animated/PromoAnimatedDefault.dev';
import {
  defaultPromoAnimatedProps,
  promoAnimatedPropsMinimal,
  promoAnimatedPropsNoImage,
  promoAnimatedPropsNoLinks,
  promoAnimatedPropsPrimaryOnly,
  promoAnimatedPropsSecondaryOnly,
  promoAnimatedPropsEditing,
  promoAnimatedPropsEmptyLinksEditing,
  promoAnimatedPropsBlue,
  promoAnimatedPropsGreen,
  promoAnimatedPropsOrange,
  promoAnimatedPropsNoFields,
  promoAnimatedPropsEmptyFields,
  promoAnimatedPropsNoColorScheme,
} from './PromoAnimated.mockProps';

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ children, field, tag: Tag = 'span', className, ...props }: any) => (
    <Tag className={className} data-testid="sitecore-text" {...props}>
      {field?.value || children}
    </Tag>
  ),
  RichText: ({ children, field, className, ...props }: any) => (
    <div className={className} data-testid="sitecore-richtext" {...props}>
      {field?.value || children}
    </div>
  ),
}));

jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ children, buttonLink, variant, isPageEditing, ...props }: any) => (
    <button
      data-testid={variant === 'secondary' ? 'secondary-button' : 'primary-button'}
      data-href={buttonLink?.value?.href}
      data-editing={isPageEditing}
      {...props}
    >
      {buttonLink?.value?.text || children}
    </button>
  ),
}));

jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, wrapperClass, sizes, priority, ...props }: any) => (
    <div className={wrapperClass} data-testid="image-wrapper">
      <img
        src={image?.value?.src}
        alt={image?.value?.alt}
        className={className}
        data-sizes={sizes}
        data-priority={priority}
        data-testid="promo-image"
        {...props}
      />
    </div>
  ),
}));

jest.mock('../../components/animated-section/AnimatedSection.dev', () => ({
  Default: ({
    children,
    className,
    animationType,
    delay,
    reducedMotion,
    isPageEditing,
    divWithImage,
    ...props
  }: any) => (
    <div
      className={className}
      data-testid="animated-section"
      data-animation-type={animationType}
      data-delay={delay}
      data-reduced-motion={reducedMotion}
      data-editing={isPageEditing}
      data-has-image-ref={!!divWithImage}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('PromoAnimated Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock matchMedia for reduced motion
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  describe('Default Rendering', () => {
    it('renders with all content elements', async () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      await waitFor(() => {
        expect(screen.getByText('Revolutionary Audio Experience')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Discover our latest collection of premium audio devices designed to elevate your listening experience to new heights.'
          )
        ).toBeInTheDocument();
        expect(screen.getByTestId('promo-image')).toBeInTheDocument();
        expect(screen.getByTestId('primary-button')).toBeInTheDocument();
        expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
      });
    });

    it('renders image with correct attributes', async () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      await waitFor(() => {
        const image = screen.getByTestId('promo-image');
        expect(image).toHaveAttribute('src', '/images/promo-hero.jpg');
        expect(image).toHaveAttribute('alt', 'Promotional Hero Image');
        expect(image).toHaveAttribute('data-priority', 'true');
        expect(image).toHaveAttribute('data-sizes', '(min-width: 768px) 452px, 350px');
      });
    });

    it('renders title with correct heading tag and styling', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Revolutionary Audio Experience');
      expect(title).toHaveClass('font-heading');
    });

    it('renders description with RichText component', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const description = screen.getByTestId('sitecore-richtext');
      expect(description).toHaveTextContent(
        'Discover our latest collection of premium audio devices'
      );
      expect(description).toHaveClass('prose');
    });
  });

  describe('Button Rendering', () => {
    it('renders both primary and secondary buttons', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const primaryButton = screen.getByTestId('primary-button');
      const secondaryButton = screen.getByTestId('secondary-button');

      expect(primaryButton).toHaveTextContent('Shop Now');
      expect(primaryButton).toHaveAttribute('data-href', '/products/featured');

      expect(secondaryButton).toHaveTextContent('Learn More');
      expect(secondaryButton).toHaveAttribute('data-href', '/about');
    });

    it('renders only primary button when secondary is not provided', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsPrimaryOnly} />);

      expect(screen.getByTestId('primary-button')).toBeInTheDocument();
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });

    it('renders only secondary button when primary is not provided', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsSecondaryOnly} />);

      expect(screen.queryByTestId('primary-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    });

    it('hides buttons when no links are provided and not in editing mode', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsNoLinks} />);

      expect(screen.queryByTestId('primary-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });

    it('shows buttons in editing mode even with empty links', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsEmptyLinksEditing} />);

      expect(screen.getByTestId('primary-button')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    });
  });

  describe('Animation Configuration', () => {
    it('configures animated sections with correct properties', async () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      await waitFor(() => {
        const animatedSections = screen.getAllByTestId('animated-section');

        // Should have multiple animated sections for different content
        expect(animatedSections.length).toBeGreaterThan(0);

        // Check reduced motion is passed through
        animatedSections.forEach((section) => {
          expect(section).toHaveAttribute('data-reduced-motion');
        });
      });
    });

    it('applies staggered delays to content sections', async () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      await waitFor(() => {
        const animatedSections = screen.getAllByTestId('animated-section');

        // Look for sections with delays
        const sectionsWithDelay = animatedSections.filter((section) =>
          section.getAttribute('data-delay')
        );

        expect(sectionsWithDelay.length).toBeGreaterThan(0);
      });
    });

    it('configures rotating animation for sprite element', async () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      await waitFor(() => {
        const rotatingSection = screen
          .getAllByTestId('animated-section')
          .find((section) => section.getAttribute('data-animation-type') === 'rotate');

        expect(rotatingSection).toBeInTheDocument();
        expect(rotatingSection).toHaveAttribute('data-has-image-ref', 'true');
      });
    });
  });

  describe('Reduced Motion Handling', () => {
    beforeEach(() => {
      // Mock reduced motion preference
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    it('detects and applies reduced motion preference', async () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      await waitFor(() => {
        const animatedSections = screen.getAllByTestId('animated-section');

        animatedSections.forEach((section) => {
          expect(section).toHaveAttribute('data-reduced-motion', 'true');
        });
      });
    });
  });

  describe('Color Scheme Variants', () => {
    it('applies color scheme to sprite and background elements', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsBlue} />);

      // The color scheme should be applied via utility functions
      // We test that the component renders without crashing with different color schemes
      expect(screen.getByText('Revolutionary Audio Experience')).toBeInTheDocument();
    });

    it('handles different color scheme options', () => {
      const colorSchemeVariants = [
        promoAnimatedPropsBlue,
        promoAnimatedPropsGreen,
        promoAnimatedPropsOrange,
      ];

      colorSchemeVariants.forEach((props) => {
        const { unmount } = render(<PromoAnimatedDefault {...props} />);

        expect(screen.getByText('Revolutionary Audio Experience')).toBeInTheDocument();

        unmount();
      });
    });

    it('handles missing color scheme gracefully', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsNoColorScheme} />);

      expect(screen.getByText('Default Color Scheme')).toBeInTheDocument();
    });
  });

  describe('Content Scenarios', () => {
    it('renders with minimal content', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsMinimal} />);

      expect(screen.getByText('Simple Title')).toBeInTheDocument();
      expect(screen.getByTestId('promo-image')).toBeInTheDocument();
      expect(screen.queryByTestId('sitecore-richtext')).not.toBeInTheDocument();
      expect(screen.queryByTestId('primary-button')).not.toBeInTheDocument();
    });

    it('handles missing image gracefully', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsNoImage} />);

      expect(screen.getByText('Text Only Promo')).toBeInTheDocument();
      // Image element is still rendered but with empty src
      const image = screen.getByTestId('promo-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', '');
      expect(screen.getByTestId('primary-button')).toBeInTheDocument();
    });

    it('returns NoDataFallback when no fields provided', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Promo Animated')).toBeInTheDocument();
    });

    it('handles empty field values', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsEmptyFields} />);

      // Should render structure but with empty content
      // Empty field values still render the component structure
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('passes editing state to child components', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsEditing} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      animatedSections.forEach((section) => {
        expect(section).toHaveAttribute('data-editing', 'true');
      });

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-editing', 'true');
      });
    });

    it('shows content even when values are empty in editing mode', () => {
      render(<PromoAnimatedDefault {...promoAnimatedPropsEmptyLinksEditing} />);

      // Buttons should be visible in editing mode even with empty links
      expect(screen.getByTestId('primary-button')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct container classes', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      // Check for section element (without role="region" as it may not be set)
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('promo-animated', '@container');
    });

    it('uses responsive grid layout', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('@md:grid-cols-2');
    });

    it('applies proper image styling and wrapper classes', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toHaveClass('relative', 'aspect-square', 'w-full');

      const image = screen.getByTestId('promo-image');
      expect(image).toHaveClass('aspect-square', 'rounded-full', 'object-cover');
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Revolutionary Audio Experience');
    });

    it('provides semantic section structure', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      // Check for semantic HTML structure
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('promo-animated');
    });

    it('maintains proper content hierarchy', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      const buttons = screen.getAllByRole('button');

      expect(heading).toBeInTheDocument();
      expect(buttons).toHaveLength(2);
    });

    it('ensures images have proper alt text', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const image = screen.getByTestId('promo-image');
      expect(image).toHaveAttribute('alt', 'Promotional Hero Image');
    });
  });

  describe('Performance', () => {
    it('sets image priority for above-the-fold content', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const image = screen.getByTestId('promo-image');
      expect(image).toHaveAttribute('data-priority', 'true');
    });

    it('uses appropriate responsive image sizes', () => {
      render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      const image = screen.getByTestId('promo-image');
      expect(image).toHaveAttribute('data-sizes', '(min-width: 768px) 452px, 350px');
    });

    it('handles re-renders without errors', () => {
      const { rerender } = render(<PromoAnimatedDefault {...defaultPromoAnimatedProps} />);

      expect(screen.getByText('Revolutionary Audio Experience')).toBeInTheDocument();

      rerender(<PromoAnimatedDefault {...promoAnimatedPropsMinimal} />);

      expect(screen.getByText('Simple Title')).toBeInTheDocument();
    });
  });
});
