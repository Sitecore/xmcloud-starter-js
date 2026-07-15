import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ImageGallery, Grid } from '@/components/image-gallery/ImageGallery';
import { mockImageGalleryProps } from './image-gallery.mock.props';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
        isNormal: true,
      },
    },
  })),
}));

// Mock child components
jest.mock('@/components/image-gallery/ImageGallery.dev', () => ({
  ImageGalleryDefault: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="image-gallery-default">
      ImageGalleryDefault - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  ),
}));

jest.mock('@/components/image-gallery/ImageGalleryGrid.dev', () => ({
  ImageGalleryGrid: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="image-gallery-grid">
      ImageGalleryGrid - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  ),
}));

jest.mock('@/components/image-gallery/ImageGalleryFeaturedImage.dev', () => ({
  ImageGalleryFeaturedImage: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="image-gallery-featured">
      ImageGalleryFeaturedImage - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  ),
}));

jest.mock('@/components/image-gallery/ImageGalleryFiftyFifty.dev', () => ({
  ImageGalleryFiftyFifty: () => <div data-testid="image-gallery-fifty-fifty" />,
}));

jest.mock('@/components/image-gallery/ImageGalleryNoSpacing.dev', () => ({
  ImageGalleryNoSpacing: () => <div data-testid="image-gallery-no-spacing" />,
}));

describe('ImageGallery Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the default variant without crashing', () => {
    render(<ImageGallery {...mockImageGalleryProps} />);
    expect(screen.getByTestId('image-gallery-default')).toBeInTheDocument();
    expect(screen.getByText(/Normal/)).toBeInTheDocument();
  });

  it('passes isPageEditing prop correctly', () => {
    const mockPageEditing = {
      mode: {
        isEditing: true,
        isPreview: false,
        isNormal: false,
        name: 'edit' as const,
        designLibrary: { isVariantGeneration: false },
        isDesignLibrary: false,
      },
      layout: {
        sitecore: {
          context: {},
          route: null,
        },
      },
      locale: 'en',
    } as Page;

    render(
      <ImageGallery
        {...mockImageGalleryProps}
        page={mockPageEditing}
      />
    );
    expect(screen.getByText(/Editing/)).toBeInTheDocument();
  });

  it('renders the Grid variant correctly', () => {
    render(<Grid {...mockImageGalleryProps} />);
    expect(screen.getByTestId('image-gallery-grid')).toBeInTheDocument();
  });
});
