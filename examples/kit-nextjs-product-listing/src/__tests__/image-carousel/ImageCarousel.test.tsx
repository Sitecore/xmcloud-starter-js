/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as ImageCarousel,
  LeftRightPreview,
  FullBleed,
  PreviewBelow,
  FeaturedImageLeft,
} from '@/components/image-carousel/ImageCarousel';
import { ImageCarouselProps } from '@/components/image-carousel/image-carousel.props';
import { mockPage } from '../test-utils/mockPage';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
      },
    },
  }),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock the variant implementations
jest.mock('@/components/image-carousel/ImageCarouselDefault.dev', () => ({
  ImageCarouselDefault: ({ isPageEditing }: any) => (
    <div data-testid="carousel-default">
      Default Carousel - Editing: {isPageEditing ? 'Yes' : 'No'}
    </div>
  ),
}));

jest.mock('@/components/image-carousel/ImageCarouselLeftRightPreview.dev', () => ({
  ImageCarouselLeftRightPreview: ({ isPageEditing }: any) => (
    <div data-testid="carousel-left-right">
      LeftRightPreview Carousel - Editing: {isPageEditing ? 'Yes' : 'No'}
    </div>
  ),
}));

jest.mock('@/components/image-carousel/ImageCarouselFullBleed.dev', () => ({
  ImageCarouselFullBleed: ({ isPageEditing }: any) => (
    <div data-testid="carousel-full-bleed">
      FullBleed Carousel - Editing: {isPageEditing ? 'Yes' : 'No'}
    </div>
  ),
}));

jest.mock('@/components/image-carousel/ImageCarouselPreviewBelow.dev', () => ({
  ImageCarouselPreviewBelow: ({ isPageEditing }: any) => (
    <div data-testid="carousel-preview-below">
      PreviewBelow Carousel - Editing: {isPageEditing ? 'Yes' : 'No'}
    </div>
  ),
}));

jest.mock('@/components/image-carousel/ImageCarouselFeaturedImageLeft.dev', () => ({
  ImageCarouselFeaturedImageLeft: ({ isPageEditing }: any) => (
    <div data-testid="carousel-featured-left">
      FeaturedImageLeft Carousel - Editing: {isPageEditing ? 'Yes' : 'No'}
    </div>
  ),
}));

describe('ImageCarousel Component', () => {
  const mockProps: ImageCarouselProps = {
    rendering: {
      uid: 'test-uid',
      componentName: 'ImageCarousel',
      dataSource: '',
    },
    params: {},
    page: mockPage,
    fields: {
      data: {
        datasource: {
          title: { jsonValue: { value: 'Test Carousel' } },
          imageItems: {
            results: [
              {
                image: {
                  jsonValue: {
                    value: {
                      src: '/image1.jpg',
                      alt: 'Image 1',
                    },
                  },
                },
                backgroundText: { jsonValue: { value: 'Text 1' } },
                link: { jsonValue: { value: { href: '/link1' } } },
              },
            ],
          },
        },
      },
    },
    isPageEditing: false,
  };

  describe('Default variant', () => {
    it('renders the default carousel variant', () => {
      render(<ImageCarousel {...mockProps} />);
      expect(screen.getByTestId('carousel-default')).toBeInTheDocument();
      expect(screen.getByText(/Default Carousel/)).toBeInTheDocument();
    });

    it('passes isPageEditing prop correctly', () => {
      render(<ImageCarousel {...mockProps} />);
      expect(screen.getByText(/Editing: No/)).toBeInTheDocument();
    });
  });

  describe('LeftRightPreview variant', () => {
    it('renders the LeftRightPreview carousel variant', () => {
      render(<LeftRightPreview {...mockProps} />);
      expect(screen.getByTestId('carousel-left-right')).toBeInTheDocument();
      expect(screen.getByText(/LeftRightPreview Carousel/)).toBeInTheDocument();
    });
  });

  describe('FullBleed variant', () => {
    it('renders the FullBleed carousel variant', () => {
      render(<FullBleed {...mockProps} />);
      expect(screen.getByTestId('carousel-full-bleed')).toBeInTheDocument();
      expect(screen.getByText(/FullBleed Carousel/)).toBeInTheDocument();
    });
  });

  describe('PreviewBelow variant', () => {
    it('renders the PreviewBelow carousel variant', () => {
      render(<PreviewBelow {...mockProps} />);
      expect(screen.getByTestId('carousel-preview-below')).toBeInTheDocument();
      expect(screen.getByText(/PreviewBelow Carousel/)).toBeInTheDocument();
    });
  });

  describe('FeaturedImageLeft variant', () => {
    it('renders the FeaturedImageLeft carousel variant', () => {
      render(<FeaturedImageLeft {...mockProps} />);
      expect(screen.getByTestId('carousel-featured-left')).toBeInTheDocument();
      expect(screen.getByText(/FeaturedImageLeft Carousel/)).toBeInTheDocument();
    });
  });
});
