import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Image, Banner as ImageBanner } from '@/components/sxa/Image';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutStyles,
  propsWithoutLink,
  propsWithEmptyImage,
  propsWithoutAlt,
  propsEditing,
} from './Image.mockProps';

// Type definitions for mock components
interface MockNextImageProps {
  field?: ImageField;
  [key: string]: unknown;
}

interface MockLinkProps {
  field?: LinkField;
  children?: React.ReactNode;
}

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: ({ field, ...props }: MockNextImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={field?.value?.src as string | undefined || ''}
      alt={field?.value?.alt as string | undefined || ''}
      {...props}
      data-testid="next-image"
    />
  ),
  Link: ({ field, children }: MockLinkProps) => (
    <a href={field?.value?.href as string | undefined || '#'} data-testid="content-link">
      {children}
    </a>
  ),
  Text: ({ field, tag: Tag = 'span' }: { field?: { value?: string }; tag?: string }) =>
    field?.value ? React.createElement(Tag, { 'data-testid': 'image-caption' }, field.value) : null,
}));

describe('Image Component', () => {
  describe('Default Image Component', () => {
    it('should render image with correct attributes', () => {
      render(<Image {...defaultProps} />);

      const image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Image');
    });

    it('should render with correct container structure using figure element', () => {
      render(<Image {...defaultProps} />);

      const figure = document.querySelector('figure.component.image');
      expect(figure).toBeInTheDocument();
      expect(figure).toHaveClass('component', 'image', 'custom-image-style');

      const contentDiv = figure?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      render(<Image {...defaultProps} />);

      const figure = document.querySelector('figure.component.image');
      expect(figure).toHaveClass('custom-image-style');
    });

    it('should render without custom styles when not provided', () => {
      render(<Image {...propsWithoutStyles} />);

      const figure = document.querySelector('figure.component.image');
      expect(figure).toHaveClass('component', 'image');
      expect(figure).not.toHaveClass('custom-image-style');
    });

    it('should wrap image with link when not in editing mode and TargetUrl is provided', () => {
      render(<Image {...defaultProps} />);

      const link = screen.getByTestId('content-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test-link');

      const image = link.querySelector('[data-testid="next-image"]');
      expect(image).toBeInTheDocument();
    });

    it('should not wrap image with link when in editing mode', () => {
      render(<Image {...propsEditing} />);

      expect(screen.queryByTestId('content-link')).not.toBeInTheDocument();
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });

    it('should not wrap image with link when TargetUrl is not provided', () => {
      render(<Image {...propsWithoutLink} />);

      expect(screen.queryByTestId('content-link')).not.toBeInTheDocument();
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });

    it('should render image caption', () => {
      render(<Image {...defaultProps} />);

      const caption = screen.getByTestId('image-caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('Test Image Caption');
    });

    it('should handle missing fields gracefully with empty hint', () => {
      const propsWithoutFields = {
        ...defaultProps,
        fields: null as unknown as typeof defaultProps.fields,
      };

      render(<Image {...propsWithoutFields} />);

      const figure = document.querySelector('figure.component.image');
      expect(figure).toBeInTheDocument();
      expect(figure).toHaveTextContent('Image');
    });
  });

  describe('Banner Image Component', () => {
    it('should render image in hero-banner figure element', () => {
      render(<ImageBanner {...defaultProps} />);

      const figure = document.querySelector('figure.component.hero-banner');
      expect(figure).toBeInTheDocument();
      expect(figure).toHaveClass('custom-image-style');
    });

    it('should always render image regardless of editing mode', () => {
      render(<ImageBanner {...defaultProps} />);

      const image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('should render image in editing mode', () => {
      render(<ImageBanner {...propsEditing} />);

      const image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
    });

    it('should render image when empty image field provided', () => {
      render(<ImageBanner {...propsWithEmptyImage} />);

      const figure = document.querySelector('figure.component.hero-banner');
      expect(figure).toBeInTheDocument();
    });

    it('should not wrap image with link (Banner is not clickable)', () => {
      render(<ImageBanner {...defaultProps} />);

      expect(screen.queryByTestId('content-link')).not.toBeInTheDocument();
    });

    it('should include sc-sxa-image-hero-banner class on content wrapper', () => {
      render(<ImageBanner {...defaultProps} />);

      const contentDiv = document.querySelector('.sc-sxa-image-hero-banner');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Image field alt text', () => {
    it('should use alt text from image field when provided', () => {
      render(<Image {...defaultProps} />);

      const image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('alt', 'Test Image');
    });

    it('should use empty alt text when not provided in Default', () => {
      render(<Image {...propsWithoutAlt} />);

      const image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('alt', '');
    });

    it('should use Hero banner alt text as fallback in Banner', () => {
      render(<ImageBanner {...propsWithoutAlt} />);

      const image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('alt', '');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing params styles gracefully', () => {
      const propsWithoutParams = {
        ...defaultProps,
        params: { ...defaultProps.params, styles: '' },
      };

      render(<Image {...propsWithoutParams} />);

      const figure = document.querySelector('figure.component.image');
      expect(figure).toBeInTheDocument();
    });

    it('should handle undefined TargetUrl field values', () => {
      render(<Image {...propsWithEmptyImage} />);

      const figure = document.querySelector('figure.component.image');
      expect(figure).toBeInTheDocument();
    });
  });
});
