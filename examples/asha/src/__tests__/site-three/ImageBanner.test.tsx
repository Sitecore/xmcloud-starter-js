/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as ImageBannerDefault,
  Grid as ImageBannerGrid,
  FullWidthRow as ImageBannerFullWidthRow,
  SingleRowGrid as ImageBannerSingleRowGrid,
  Stacked as ImageBannerStacked,
} from '@/components/site-three/ImageBanner';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
  Image: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
}));

describe('ImageBanner', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Title: {
        value: 'Our Gallery',
      },
      Body: {
        value: 'Explore our stunning collection of images showcasing our products and services.',
      },
      Image1: {
        value: {
          src: '/images/gallery1.jpg',
          alt: 'Gallery image 1',
        },
      },
      Image2: {
        value: {
          src: '/images/gallery2.jpg',
          alt: 'Gallery image 2',
        },
      },
      Image3: {
        value: {
          src: '/images/gallery3.jpg',
          alt: 'Gallery image 3',
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders image banner with title', () => {
      render(<ImageBannerDefault {...mockProps} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
    });

    it('renders body text', () => {
      render(<ImageBannerDefault {...mockProps} />);
      expect(
        screen.getByText(
          'Explore our stunning collection of images showcasing our products and services.'
        )
      ).toBeInTheDocument();
    });

    it('renders all three images', () => {
      render(<ImageBannerDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', '/images/gallery1.jpg');
      expect(images[1]).toHaveAttribute('src', '/images/gallery2.jpg');
      expect(images[2]).toHaveAttribute('src', '/images/gallery3.jpg');
    });

    it('handles missing fields gracefully', () => {
      const minimalProps: any = {
        params: {},
        fields: {
          Title: {
            value: 'Title Only',
          },
        },
      };
      render(<ImageBannerDefault {...minimalProps} />);
      expect(screen.getByText('Title Only')).toBeInTheDocument();
    });
  });

  describe('Grid variant', () => {
    it('renders grid layout with title and body', () => {
      render(<ImageBannerGrid {...mockProps} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Explore our stunning collection of images showcasing our products and services.'
        )
      ).toBeInTheDocument();
    });

    it('renders all three images in grid layout', () => {
      render(<ImageBannerGrid {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', '/images/gallery1.jpg');
      expect(images[1]).toHaveAttribute('src', '/images/gallery2.jpg');
      expect(images[2]).toHaveAttribute('src', '/images/gallery3.jpg');
    });

    it('handles missing images in grid variant', () => {
      const propsWithoutImages: any = {
        params: mockProps.params,
        fields: {
          Title: mockProps.fields.Title,
          Body: mockProps.fields.Body,
        },
      };
      render(<ImageBannerGrid {...propsWithoutImages} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
    });
  });

  describe('FullWidthRow variant', () => {
    it('renders full width row layout with content', () => {
      render(<ImageBannerFullWidthRow {...mockProps} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Explore our stunning collection of images showcasing our products and services.'
        )
      ).toBeInTheDocument();
    });

    it('renders all three images in full width row', () => {
      render(<ImageBannerFullWidthRow {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('applies custom styles to full width row', () => {
      const { container } = render(<ImageBannerFullWidthRow {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('SingleRowGrid variant', () => {
    it('renders single row grid layout', () => {
      render(<ImageBannerSingleRowGrid {...mockProps} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Explore our stunning collection of images showcasing our products and services.'
        )
      ).toBeInTheDocument();
    });

    it('renders all images in single row grid', () => {
      render(<ImageBannerSingleRowGrid {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('handles missing body text in single row grid', () => {
      const propsWithoutBody: any = {
        params: mockProps.params,
        fields: {
          Title: mockProps.fields.Title,
          Image1: mockProps.fields.Image1,
          Image2: mockProps.fields.Image2,
          Image3: mockProps.fields.Image3,
        },
      };
      render(<ImageBannerSingleRowGrid {...propsWithoutBody} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
    });
  });

  describe('Stacked variant', () => {
    it('renders stacked layout with content', () => {
      render(<ImageBannerStacked {...mockProps} />);
      expect(screen.getByText('Our Gallery')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Explore our stunning collection of images showcasing our products and services.'
        )
      ).toBeInTheDocument();
    });

    it('renders all three images in stacked layout', () => {
      render(<ImageBannerStacked {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('handles empty fields in stacked variant', () => {
      const emptyProps: any = {
        params: {},
        fields: {},
      };
      const { container } = render(<ImageBannerStacked {...emptyProps} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });
});
