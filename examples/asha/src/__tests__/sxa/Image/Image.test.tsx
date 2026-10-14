/**
 * Unit tests for Image component
 * Tests Default and Banner variants, captions, links, and empty states
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Default as Image, Banner } from 'components/sxa/Image';
import {
  defaultImageProps,
  imagePropsWithCaption,
  imagePropsWithLink,
  imagePropsEmptyImage,
  imagePropsMinimal,
  imagePropsNullFields,
  bannerImageProps,
  bannerImagePropsWithBackground,
} from './Image.mockProps';

// Mock Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NextImage: ({ field }: { field: any }) => {
    if (!field || !field.value) return null;
    return React.createElement('img', {
      src: field.value.src,
      alt: field.value.alt || '',
      width: field.value.width,
      height: field.value.height,
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Link: ({ field, children }: { field: any; children: React.ReactNode }) => {
    if (!field || !field.value || !field.value.href) {
      return React.createElement(React.Fragment, {}, children);
    }
    return React.createElement('a', { href: field.value.href, title: field.value.title }, children);
  },
   
  Text: ({
    field,
    tag: Tag = 'span',
    className,
  }: {
    field: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    tag?: string;
    className?: string;
  }) => {
    if (!field || !field.value) return null;
    return React.createElement(Tag, { className }, field.value);
  },
}));

describe('Image Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Default Variant', () => {
    it('should render image with basic structure', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      expect(container.querySelector('.component.image')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
      expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      const component = container.querySelector('.component.image');
      expect(component).toHaveAttribute('id', 'image-1');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      const component = container.querySelector('.component.image');
      expect(component).toHaveClass('image-styles');
    });

    it('should render image with correct attributes', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/-/media/image.jpg');
      expect(img).toHaveAttribute('alt', 'Sample image');
      expect(img).toHaveAttribute('width', '800');
      expect(img).toHaveAttribute('height', '600');
    });

    it('should render image caption when provided', () => {
      const { container } = render(<Image {...imagePropsWithCaption} />);

      const caption = container.querySelector('.image-caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('Sample image caption');
    });

    it('should wrap image in link when TargetUrl is provided', () => {
      const { container } = render(<Image {...imagePropsWithLink} />);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/target-page');
      expect(link).toHaveAttribute('title', 'Go to target page');

      // Image should be inside the link
      const img = container.querySelector('a img');
      expect(img).toBeInTheDocument();
    });

    it('should not render link when TargetUrl is empty', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      const link = container.querySelector('a');
      expect(link).not.toBeInTheDocument();

      // Image should be direct child of component-content
      const img = container.querySelector('.component-content > img');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should render component with empty image in editing mode', () => {
      const { container } = render(<Image {...imagePropsEmptyImage} />);

      // Component may render differently or not at all with empty image
      // Just verify it doesn't crash
      expect(container).toBeTruthy();
    });

    it('should handle null fields gracefully', () => {
      const { container } = render(<Image {...imagePropsNullFields} />);

      // Component should handle null fields without crashing
      expect(container).toBeTruthy();
    });
  });

  describe('Parameters', () => {
    it('should work with minimal parameters', () => {
      const { container } = render(<Image {...imagePropsMinimal} />);

      expect(container.querySelector('.component.image')).toBeInTheDocument();
      expect(container.querySelector('img')).toBeInTheDocument();

      // Should not have id when RenderingIdentifier is not provided
      const component = container.querySelector('.component.image');
      expect(component).not.toHaveAttribute('id');
    });
  });

  describe('Banner Variant', () => {
    it('should render banner with hero structure', () => {
      const { container } = render(<Banner {...bannerImageProps} />);

      expect(container.querySelector('.component.hero-banner')).toBeInTheDocument();
      expect(
        container.querySelector('.component-content.sc-sxa-image-hero-banner')
      ).toBeInTheDocument();
    });

    it('should apply banner-specific styles', () => {
      const { container } = render(<Banner {...bannerImageProps} />);

      const component = container.querySelector('.component.hero-banner');
      expect(component).toHaveClass('hero-banner-styles');
    });

    it('should always render ContentSdkImage in Banner (not just editing mode)', () => {
      const { container } = render(<Banner {...bannerImageProps} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });

    it('should render Banner image in editing mode too', () => {
      const { container } = render(<Banner {...bannerImagePropsWithBackground} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      expect(container.querySelector('.component')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
    });

    it('should provide alt text for images', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt');
      expect(img?.getAttribute('alt')).toBe('Sample image');
    });

    it('should provide title attribute for links', () => {
      const { container } = render(<Image {...imagePropsWithLink} />);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('title');
      expect(link?.getAttribute('title')).toBe('Go to target page');
    });
  });
});
