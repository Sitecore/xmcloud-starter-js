/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as VideoDefault,
  TextCenter as VideoTextCenter,
} from '@/components/site-three/Video';
import { mockPage } from '../test-utils/mockPage';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  Image: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
}));

// Mock VideoBase component
jest.mock('@/components/video/Video', () => ({
  VideoBase: ({ videoLink, thumbnailImage }: any) => (
    <div data-testid="video-base">
      <span data-testid="video-link">{videoLink?.value?.href}</span>
      <span data-testid="video-thumbnail">{thumbnailImage?.value?.src}</span>
    </div>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: () => <div data-testid="no-data-fallback">No data available</div>,
}));

describe('Video Component', () => {
  const mockProps = {
    rendering: {
      uid: 'video-uid',
      componentName: 'Video',
    },
    params: {
      styles: 'test-styles',
      darkPlayIcon: 'true',
      useModal: 'true',
      displayIcon: 'true',
    },
    page: mockPage,
    fields: {
      video: {
        value: {
          href: 'https://youtube.com/watch?v=test',
        },
      },
      image: {
        value: {
          src: '/images/thumbnail.jpg',
          alt: 'Video thumbnail',
        },
      },
      image2: {
        value: {
          src: '/images/background.jpg',
          alt: 'Background image',
        },
      },
      title: {
        value: 'Watch Our Story',
      },
      caption: {
        value: 'Learn about our journey and mission',
      },
    },
  };

  describe('Default variant', () => {
    it('renders video component with title and caption', () => {
      render(<VideoDefault {...mockProps} />);
      expect(screen.getByText('Watch Our Story')).toBeInTheDocument();
      expect(screen.getByText('Learn about our journey and mission')).toBeInTheDocument();
    });

    it('renders background image', () => {
      render(<VideoDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      const backgroundImage = images.find(
        (img) => img.getAttribute('src') === '/images/background.jpg'
      );
      expect(backgroundImage).toBeInTheDocument();
    });

    it('renders VideoBase component', () => {
      render(<VideoDefault {...mockProps} />);
      expect(screen.getByTestId('video-base')).toBeInTheDocument();
    });

    it('shows NoDataFallback when fields are missing', () => {
      render(
        <VideoDefault
          fields={undefined}
          params={{}}
          page={mockPage}
          rendering={{ uid: 'test', componentName: 'Video' }}
        />
      );
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });

    it('applies custom styles from params', () => {
      const { container } = render(<VideoDefault {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('handles missing title gracefully', () => {
      const propsWithoutTitle = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          title: undefined,
        },
      };
      render(<VideoDefault {...propsWithoutTitle} />);
      expect(screen.getByTestId('video-base')).toBeInTheDocument();
    });

    it('handles missing background image gracefully', () => {
      const propsWithoutImage2 = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          image2: undefined,
        },
      };
      render(<VideoDefault {...propsWithoutImage2} />);
      expect(screen.getByText('Watch Our Story')).toBeInTheDocument();
    });
  });

  describe('TextCenter variant', () => {
    it('renders text center layout with title and caption', () => {
      render(<VideoTextCenter {...mockProps} />);
      expect(screen.getByText('Watch Our Story')).toBeInTheDocument();
      expect(screen.getByText('Learn about our journey and mission')).toBeInTheDocument();
    });

    it('renders background image in text center variant', () => {
      render(<VideoTextCenter {...mockProps} />);
      const images = screen.getAllByRole('img');
      const backgroundImage = images.find(
        (img) => img.getAttribute('src') === '/images/background.jpg'
      );
      expect(backgroundImage).toBeInTheDocument();
    });

    it('renders VideoBase component in text center variant', () => {
      render(<VideoTextCenter {...mockProps} />);
      expect(screen.getByTestId('video-base')).toBeInTheDocument();
    });

    it('shows NoDataFallback when fields are missing in text center variant', () => {
      render(
        <VideoTextCenter
          fields={undefined}
          params={{}}
          page={mockPage}
          rendering={{ uid: 'test', componentName: 'Video' }}
        />
      );
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });

    it('applies custom styles in text center variant', () => {
      const { container } = render(<VideoTextCenter {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('handles missing caption in text center variant', () => {
      const propsWithoutCaption = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          caption: undefined,
        },
      };
      render(<VideoTextCenter {...propsWithoutCaption} />);
      expect(screen.getByText('Watch Our Story')).toBeInTheDocument();
      expect(screen.getByTestId('video-base')).toBeInTheDocument();
    });

    it('handles partial fields in text center variant', () => {
      const partialProps = {
        ...mockProps,
        fields: {
          title: { value: 'Partial Title' },
          video: mockProps.fields.video,
        },
      };
      render(<VideoTextCenter {...partialProps} />);
      expect(screen.getByText('Partial Title')).toBeInTheDocument();
      expect(screen.getByTestId('video-base')).toBeInTheDocument();
    });
  });
});
