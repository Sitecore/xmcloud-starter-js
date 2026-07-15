import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageGalleryDefault } from '@/components/image-gallery/ImageGallery.dev';
import { mockImageGalleryProps } from './image-gallery.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: Record<string, unknown>) => {
    const TextTag = tag as keyof JSX.IntrinsicElements;
    const fieldValue = (field as { value?: string })?.value || '';
    return React.createElement(TextTag, { className: className as string }, fieldValue);
  },
}));

// Mock child components
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={(image as { value?: { src?: string } })?.value?.src}
      className={className as string}
      data-testid="image-wrapper"
      alt="gallery"
    />
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@/hooks/use-parallax-enhanced-optimized', () => ({
  useParallaxEnhancedOptimized: jest.fn(() => ({
    isParallaxActive: false,
  })),
}));

jest.mock('@/hooks/use-match-media', () => ({
  useMatchMedia: jest.fn(() => false),
}));

jest.mock('@/hooks/use-container-query', () => ({
  useContainerQuery: jest.fn(() => false),
}));

describe('ImageGalleryDefault Component', () => {
  it('renders without crashing with all images', () => {
    const { container } = render(<ImageGalleryDefault {...mockImageGalleryProps} />);
    expect(container).toBeInTheDocument();

    const images = screen.getAllByTestId('image-wrapper');
    expect(images).toHaveLength(4);
  });

  it('displays title and description', () => {
    render(<ImageGalleryDefault {...mockImageGalleryProps} />);

    expect(screen.getByText('Our Amazing Gallery')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Explore our collection of stunning images showcasing design and innovation.'
      )
    ).toBeInTheDocument();
  });

  it('shows accessibility notice when reduced motion is preferred', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMatchMedia } = require('@/hooks/use-match-media');
    useMatchMedia.mockReturnValue(true);

    render(<ImageGalleryDefault {...mockImageGalleryProps} />);

    expect(screen.getByText(/Parallax effects have been disabled/)).toBeInTheDocument();
  });
});
