/* eslint-disable */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PromoImageDefault } from '../../components/promo-image/PromoImageDefault.dev';
import {
  defaultPromoImageProps,
  promoImagePropsMinimal,
  promoImagePropsNoImage,
  promoImagePropsNoHeading,
  promoImagePropsNoDescription,
  promoImagePropsNoLink,
  promoImagePropsEmptyLinkEditing,
  promoImagePropsBlue,
  promoImagePropsGreen,
  promoImagePropsOrange,
  promoImagePropsNoColorScheme,
  promoImagePropsNoFields,
  promoImagePropsEmptyFields,
  promoImagePropsEditing,
  promoImagePropsRichText,
  promoImagePropsLongContent,
} from './PromoImage.mockProps';

// Mock window.matchMedia for reduced motion
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
    <div
      className={className}
      data-testid="sitecore-richtext"
      dangerouslySetInnerHTML={{ __html: field?.value || children }}
      {...props}
    />
  ),
}));

jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ children, buttonLink, isPageEditing, ...props }: any) => (
    <button
      data-testid="promo-button"
      data-href={buttonLink?.value?.href}
      data-editing={isPageEditing}
      {...props}
    >
      {buttonLink?.value?.text || children}
    </button>
  ),
}));

jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, wrapperClass, priority, ...props }: any) => (
    <div className={wrapperClass} data-testid="image-wrapper">
      <img
        src={image?.value?.src}
        alt={image?.value?.alt}
        className={className}
        data-priority={priority}
        data-testid="promo-bg-image"
        {...props}
      />
    </div>
  ),
}));

jest.mock('../../components/animated-section/AnimatedSection.dev', () => ({
  Default: ({
    children,
    className,
    direction,
    delay,
    reducedMotion,
    isPageEditing,
    ...props
  }: any) => (
    <div
      className={className}
      data-testid="animated-section"
      data-direction={direction}
      data-delay={delay}
      data-reduced-motion={reducedMotion}
      data-editing={isPageEditing}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../hooks/use-match-media', () => ({
  useMatchMedia: (query: string) => query.includes('prefers-reduced-motion'),
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('PromoImage Component', () => {
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
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      await waitFor(() => {
        expect(screen.getByText('Experience Premium Audio')).toBeInTheDocument();
        expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
        expect(screen.getByTestId('promo-bg-image')).toBeInTheDocument();
        expect(screen.getByTestId('promo-button')).toBeInTheDocument();
      });
    });

    it('renders background image with correct attributes', async () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      await waitFor(() => {
        const image = screen.getByTestId('promo-bg-image');
        expect(image).toHaveAttribute('src', '/images/promo-hero-bg.jpg');
        expect(image).toHaveAttribute('alt', 'Promo Background Image');
        expect(image).toHaveAttribute('data-priority', 'true');
      });
    });

    it('renders heading with correct tag and styling', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Experience Premium Audio');
      expect(heading).toHaveClass('font-heading');
    });

    it('renders description with RichText component', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const description = screen.getByTestId('sitecore-richtext');
      expect(description).toBeInTheDocument();
      expect(description.innerHTML).toContain('Discover our range of high-quality audio equipment');
    });

    it('renders action button with correct link', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const button = screen.getByTestId('promo-button');
      expect(button).toHaveTextContent('Explore Collection');
      expect(button).toHaveAttribute('data-href', '/products/premium');
    });

    it('applies section styling and data attributes', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-component', 'Promo Image');
      expect(section).toHaveClass('@container', 'border-b-2', 'border-t-2');
    });
  });

  describe('Content Scenarios', () => {
    it('renders with minimal content', () => {
      render(<PromoImageDefault {...promoImagePropsMinimal} />);

      expect(screen.getByText('Simple Heading')).toBeInTheDocument();
      expect(screen.getByTestId('promo-bg-image')).toBeInTheDocument();
      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
      expect(screen.queryByTestId('sitecore-richtext')).not.toBeInTheDocument();
    });

    it('handles missing background image gracefully', () => {
      render(<PromoImageDefault {...promoImagePropsNoImage} />);

      expect(screen.getByText('Text Only Promo')).toBeInTheDocument();
      const bgImage = screen.getByTestId('promo-bg-image');
      expect(bgImage).toHaveAttribute('alt', '');
      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
    });

    it('handles missing heading gracefully', () => {
      render(<PromoImageDefault {...promoImagePropsNoHeading} />);

      const heading = screen.queryByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('');
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
    });

    it('handles missing description gracefully', () => {
      render(<PromoImageDefault {...promoImagePropsNoDescription} />);

      expect(screen.getByText('Heading Only')).toBeInTheDocument();
      expect(screen.queryByTestId('sitecore-richtext')).not.toBeInTheDocument();
      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
    });

    it('hides button when no link provided and not in editing mode', () => {
      render(<PromoImageDefault {...promoImagePropsNoLink} />);

      expect(screen.getByText('Information Display')).toBeInTheDocument();
      expect(screen.queryByTestId('promo-button')).not.toBeInTheDocument();
    });

    it('shows button in editing mode even with empty link', () => {
      render(<PromoImageDefault {...promoImagePropsEmptyLinkEditing} />);

      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
      expect(screen.getByTestId('promo-button')).toHaveAttribute('data-editing', 'true');
    });

    it('returns NoDataFallback when no fields provided', () => {
      render(<PromoImageDefault {...promoImagePropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Promo Image')).toBeInTheDocument();
    });

    it('handles empty field values', () => {
      render(<PromoImageDefault {...promoImagePropsEmptyFields} />);

      // Should render structure but with empty content
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
    });
  });

  describe('Rich Text Content', () => {
    it('renders complex rich text content correctly', () => {
      render(<PromoImageDefault {...promoImagePropsRichText} />);

      const richText = screen.getByTestId('sitecore-richtext');
      expect(richText.innerHTML).toContain('<h3>Advanced Audio Technology</h3>');
      expect(richText.innerHTML).toContain('<strong>crystal-clear sound</strong>');
      expect(richText.innerHTML).toContain('<ul>');
    });

    it('handles long content without layout issues', () => {
      render(<PromoImageDefault {...promoImagePropsLongContent} />);

      expect(
        screen.getByText('Revolutionary Audio Experience for Modern Professionals and Audiophiles')
      ).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(screen.getByTestId('promo-bg-image')).toBeInTheDocument();
    });
  });

  describe('Animation Configuration', () => {
    it('configures animated sections with correct properties', async () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      await waitFor(() => {
        const animatedSections = screen.getAllByTestId('animated-section');

        // Should have multiple animated sections for different content
        expect(animatedSections.length).toBeGreaterThan(0);

        // Check that sections have proper direction
        animatedSections.forEach((section) => {
          expect(section).toHaveAttribute('data-direction', 'right');
          expect(section).toHaveAttribute('data-reduced-motion', 'true');
        });
      });
    });

    it('applies staggered delays to content sections', async () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      await waitFor(() => {
        const animatedSections = screen.getAllByTestId('animated-section');

        // Look for sections with delays
        const sectionsWithDelay = animatedSections.filter((section) =>
          section.getAttribute('data-delay')
        );

        expect(sectionsWithDelay.length).toBeGreaterThan(0);

        // Check for specific delay values
        const delayValues = sectionsWithDelay.map((section) =>
          parseInt(section.getAttribute('data-delay') || '0')
        );

        expect(delayValues).toContain(600); // Description delay
        expect(delayValues).toContain(1200); // Button delay
      });
    });
  });

  describe('Reduced Motion Handling', () => {
    it('detects and applies reduced motion preference', async () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      await waitFor(() => {
        const animatedSections = screen.getAllByTestId('animated-section');

        animatedSections.forEach((section) => {
          expect(section).toHaveAttribute('data-reduced-motion', 'true');
        });
      });
    });
  });

  describe('Color Scheme Variants', () => {
    it('handles different color scheme options', () => {
      const colorSchemeVariants = [
        promoImagePropsBlue,
        promoImagePropsGreen,
        promoImagePropsOrange,
      ];

      colorSchemeVariants.forEach((props) => {
        const { unmount } = render(<PromoImageDefault {...props} />);

        expect(screen.getByText('Experience Premium Audio')).toBeInTheDocument();

        unmount();
      });
    });

    it('handles missing color scheme gracefully', () => {
      render(<PromoImageDefault {...promoImagePropsNoColorScheme} />);

      expect(screen.getByText('Default Color Scheme')).toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('passes editing state to child components', () => {
      render(<PromoImageDefault {...promoImagePropsEditing} />);

      const animatedSections = screen.getAllByTestId('animated-section');
      animatedSections.forEach((section) => {
        expect(section).toHaveAttribute('data-editing', 'true');
      });

      const button = screen.getByTestId('promo-button');
      expect(button).toHaveAttribute('data-editing', 'true');
    });

    it('shows content even when values are empty in editing mode', () => {
      render(<PromoImageDefault {...promoImagePropsEmptyLinkEditing} />);

      // Button should be visible in editing mode even with empty link
      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct section structure and classes', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('@container');
      expect(section).toHaveAttribute('data-component', 'Promo Image');

      // Check for image container structure
      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toHaveClass('w-full', 'h-full');
    });

    it('includes vignette overlay for visual effect', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      // The vignette overlay should be present (styled div after image)
      const overlays = document.querySelectorAll('.pointer-events-none.absolute.inset-0');
      expect(overlays.length).toBeGreaterThan(0);
    });

    it('applies responsive content positioning', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      // Check for responsive content container classes
      const contentContainer = document.querySelector('.relative.z-10');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('flex', 'flex-col', 'justify-center');
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Experience Premium Audio');
    });

    it('provides semantic section structure', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-component', 'Promo Image');
    });

    it('ensures images have proper alt text', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const image = screen.getByTestId('promo-bg-image');
      expect(image).toHaveAttribute('alt', 'Promo Background Image');
    });

    it('maintains proper content hierarchy', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      const button = screen.getByRole('button');

      expect(heading).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('sets image priority for above-the-fold content', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const image = screen.getByTestId('promo-bg-image');
      expect(image).toHaveAttribute('data-priority', 'true');
    });

    it('handles re-renders without errors', () => {
      const { rerender } = render(<PromoImageDefault {...defaultPromoImageProps} />);

      expect(screen.getByText('Experience Premium Audio')).toBeInTheDocument();

      rerender(<PromoImageDefault {...promoImagePropsMinimal} />);

      expect(screen.getByText('Simple Heading')).toBeInTheDocument();
    });

    it('manages component state efficiently', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      // Component should render all expected elements without issues
      expect(screen.getByTestId('promo-bg-image')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(screen.getByTestId('promo-button')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('uses container queries for responsive behavior', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('@container');
    });

    it('applies responsive typography classes', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.className).toContain('@xs:text-3xl');
      expect(heading.className).toContain('@sm:text-4xl');
      expect(heading.className).toContain('@lg:text-5xl');
    });

    it('includes responsive spacing and positioning', () => {
      render(<PromoImageDefault {...defaultPromoImageProps} />);

      // Check for responsive padding/margin classes in content container
      const contentContainer = document.querySelector('.relative.z-10');
      expect(contentContainer?.className).toContain('@xs:pl-8');
      expect(contentContainer?.className).toContain('@sm:pl-12');
      expect(contentContainer?.className).toContain('@md:pl-16');
    });
  });
});
