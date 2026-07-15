/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as ImageGalleryDefault,
  FiftyFifty,
  Grid,
  FeaturedImage,
  NoSpacing,
} from '../../components/image-gallery/ImageGallery';
import {
  defaultImageGalleryProps,
  imageGalleryPropsNoFields,
  imageGalleryPropsMinimal,
  imageGalleryPropsEditing,
} from './ImageGallery.mockProps';

// Mock the Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
  useSitecore: jest.fn(() => ({ page: { mode: { isEditing: false } } })),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock ImageWrapper component
jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, alt }: any) => {
    if (!image?.value?.src) return null;
    return (
      <img
        src={image.value.src}
        alt={image.value.alt || alt}
        className={className}
        data-testid="gallery-image"
      />
    );
  },
}));

// Mock the gallery variant components
jest.mock('../../components/image-gallery/ImageGallery.dev', () => ({
  ImageGalleryDefault: ({ fields, isPageEditing }: any) => {
    if (!fields) return null;
    const { title, description, image1, image2, image3, image4 } = fields;

    return (
      <section data-testid="image-gallery-default">
        <div data-testid="gallery-content">
          {title?.value && <h2 data-testid="gallery-title">{title.value}</h2>}
          {description?.value && <p data-testid="gallery-description">{description.value}</p>}

          <div data-testid="gallery-images">
            {image1?.value?.src && (
              <img src={image1.value.src} alt={image1.value.alt} data-testid="gallery-image-1" />
            )}
            {image2?.value?.src && (
              <img src={image2.value.src} alt={image2.value.alt} data-testid="gallery-image-2" />
            )}
            {image3?.value?.src && (
              <img src={image3.value.src} alt={image3.value.alt} data-testid="gallery-image-3" />
            )}
            {image4?.value?.src && (
              <img src={image4.value.src} alt={image4.value.alt} data-testid="gallery-image-4" />
            )}
          </div>

          <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
        </div>
      </section>
    );
  },
}));

jest.mock('../../components/image-gallery/ImageGalleryGrid.dev', () => ({
  ImageGalleryGrid: ({ isPageEditing }: any) => (
    <section data-testid="image-gallery-grid">
      <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
    </section>
  ),
}));

jest.mock('../../components/image-gallery/ImageGalleryFiftyFifty.dev', () => ({
  ImageGalleryFiftyFifty: ({ isPageEditing }: any) => (
    <section data-testid="image-gallery-fifty-fifty">
      <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
    </section>
  ),
}));

jest.mock('../../components/image-gallery/ImageGalleryFeaturedImage.dev', () => ({
  ImageGalleryFeaturedImage: ({ isPageEditing }: any) => (
    <section data-testid="image-gallery-featured-image">
      <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
    </section>
  ),
}));

jest.mock('../../components/image-gallery/ImageGalleryNoSpacing.dev', () => ({
  ImageGalleryNoSpacing: ({ isPageEditing }: any) => (
    <section data-testid="image-gallery-no-spacing">
      <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
    </section>
  ),
}));

// Mock hooks
jest.mock('../../hooks/use-parallax-enhanced-optimized', () => ({
  useParallaxEnhancedOptimized: () => ({ isParallaxActive: false }),
}));

jest.mock('../../hooks/use-match-media', () => ({
  useMatchMedia: () => false,
}));

jest.mock('../../hooks/use-container-query', () => ({
  useContainerQuery: () => false,
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('ImageGallery Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders complete gallery with all content', () => {
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);

      // Check main structure
      expect(screen.getByTestId('image-gallery-default')).toBeInTheDocument();
      expect(screen.getByTestId('gallery-content')).toBeInTheDocument();

      // Check text content
      expect(screen.getByTestId('gallery-title')).toHaveTextContent('Gallery Showcase');
      expect(screen.getByTestId('gallery-description')).toHaveTextContent(
        'Explore our stunning collection'
      );

      // Check all images are present
      expect(screen.getByTestId('gallery-image-1')).toBeInTheDocument();
      expect(screen.getByTestId('gallery-image-2')).toBeInTheDocument();
      expect(screen.getByTestId('gallery-image-3')).toBeInTheDocument();
      expect(screen.getByTestId('gallery-image-4')).toBeInTheDocument();

      // Verify image sources and alt text
      const image1 = screen.getByTestId('gallery-image-1');
      expect(image1).toHaveAttribute('src', '/gallery/image1.jpg');
      expect(image1).toHaveAttribute('alt', 'Professional Portrait');
    });

    it('displays proper editing state', () => {
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);

      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });
  });

  describe('Content Scenarios', () => {
    it('handles empty images gracefully', () => {
      render(<ImageGalleryDefault {...imageGalleryPropsNoFields} />);

      expect(screen.getByTestId('image-gallery-default')).toBeInTheDocument();
      expect(screen.queryByTestId('gallery-title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gallery-description')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gallery-image-1')).not.toBeInTheDocument();
    });

    it('renders with partial image content', () => {
      render(<ImageGalleryDefault {...imageGalleryPropsMinimal} />);

      expect(screen.getByTestId('image-gallery-default')).toBeInTheDocument();
      expect(screen.getByTestId('gallery-title')).toHaveTextContent('Gallery Showcase');

      // Should have first two images
      expect(screen.getByTestId('gallery-image-1')).toBeInTheDocument();
      expect(screen.getByTestId('gallery-image-2')).toBeInTheDocument();

      // Should not have third and fourth images (empty)
      expect(screen.queryByTestId('gallery-image-3')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gallery-image-4')).not.toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('correctly reflects editing state', () => {
      const { useSitecore } = jest.requireMock('@sitecore-content-sdk/nextjs');

      // Test editing mode
      useSitecore.mockReturnValue({ page: { mode: { isEditing: true } } });
      const { unmount } = render(<ImageGalleryDefault {...imageGalleryPropsEditing} />);
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('editing');
      unmount();

      // Test normal mode
      useSitecore.mockReturnValue({ page: { mode: { isEditing: false } } });
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });
  });

  describe('Gallery Variants', () => {
    it('renders Grid variant', () => {
      render(<Grid {...defaultImageGalleryProps} />);
      expect(screen.getByTestId('image-gallery-grid')).toBeInTheDocument();
    });

    it('renders FiftyFifty variant', () => {
      render(<FiftyFifty {...defaultImageGalleryProps} />);
      expect(screen.getByTestId('image-gallery-fifty-fifty')).toBeInTheDocument();
    });

    it('renders FeaturedImage variant', () => {
      render(<FeaturedImage {...defaultImageGalleryProps} />);
      expect(screen.getByTestId('image-gallery-featured-image')).toBeInTheDocument();
    });

    it('renders NoSpacing variant', () => {
      render(<NoSpacing {...defaultImageGalleryProps} />);
      expect(screen.getByTestId('image-gallery-no-spacing')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic section structure', () => {
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);

      const gallery = screen.getByTestId('image-gallery-default');
      expect(gallery.tagName.toLowerCase()).toBe('section');
    });

    it('provides proper alt text for images', () => {
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);

      const image1 = screen.getByTestId('gallery-image-1');
      const image2 = screen.getByTestId('gallery-image-2');

      expect(image1).toHaveAttribute('alt', 'Professional Portrait');
      expect(image2).toHaveAttribute('alt', 'Landscape Photography');
    });
  });

  describe('Image Structure', () => {
    it('renders gallery images container', () => {
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);

      const imagesContainer = screen.getByTestId('gallery-images');
      expect(imagesContainer).toBeInTheDocument();
    });

    it('displays images with proper sources', () => {
      render(<ImageGalleryDefault {...defaultImageGalleryProps} />);

      const images = screen.getAllByTestId(/gallery-image-\d/);
      expect(images).toHaveLength(4);

      expect(images[0]).toHaveAttribute('src', '/gallery/image1.jpg');
      expect(images[1]).toHaveAttribute('src', '/gallery/image2.jpg');
      expect(images[2]).toHaveAttribute('src', '/gallery/image3.jpg');
      expect(images[3]).toHaveAttribute('src', '/gallery/image4.jpg');
    });
  });
});
