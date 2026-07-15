import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as MediaSection } from '@/components/media-section/MediaSection.dev';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithOnlyVideo,
  propsWithOnlyImage,
  propsWithReducedMotion,
  propsWithPausedVideo,
  propsWithLargeImage,
  propsWithImageNoSize,
  propsWithNoMedia,
  propsWithVideoAndReducedMotion,
  propsWithCustomClass,
  mockSitecoreContext,
  mockSitecoreContextEditing,
} from './MediaSection.mockProps';

// Type definitions for mock components
interface MockImageWrapperProps {
  image?: ImageField;
  className?: string;
  alt?: string;
}

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(),
}));

// Mock ImageWrapper component
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, alt }: MockImageWrapperProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image?.value?.src as string | undefined}
      alt={alt || (image?.value?.alt as string | undefined)}
      className={className}
      data-testid="image-wrapper"
    />
  ),
}));

// Mock useIntersectionObserver hook
jest.mock('@/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: jest.fn(() => [true, { current: null }]),
}));

// Mock next/image
jest.mock('next/image', () => ({
  getImageProps: jest.fn(({ src, width, height, alt }) => ({
    props: {
      src: src,
      width: width,
      height: height,
      alt: alt,
    },
  })),
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => args.filter(Boolean).join(' '),
}));

import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const mockUseSitecore = useSitecore as jest.MockedFunction<typeof useSitecore>;
const mockUseIntersectionObserver = useIntersectionObserver as jest.MockedFunction<
  typeof useIntersectionObserver
>;

describe('MediaSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
    mockUseIntersectionObserver.mockReturnValue([true, { current: null } as unknown as React.RefObject<HTMLDivElement | null>]);

    // Mock HTMLMediaElement play and pause methods
    window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = jest.fn();
  });

  describe('Basic rendering', () => {
    it('should render media section with video', () => {
      const { container } = render(<MediaSection {...defaultProps} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should render video with correct attributes', () => {
      const { container } = render(<MediaSection {...defaultProps} />);

      const video = container.querySelector('video') as HTMLVideoElement;
      expect(video).toBeTruthy();
      // Check boolean properties
      expect(video.muted).toBe(true);
      expect(video.loop).toBe(true);
      expect(video).toHaveAttribute('playsInline');
      expect(video).toHaveAttribute('preload', 'metadata');
      expect(video).toHaveAttribute('loading', 'lazy');
    });

    it('should render video with correct source', () => {
      const { container } = render(<MediaSection {...defaultProps} />);

      const source = container.querySelector('source');
      expect(source).toHaveAttribute('src', '/videos/test-video.mp4');
      expect(source).toHaveAttribute('type', 'video/mp4');
    });

    it('should apply custom className', () => {
      const { container } = render(<MediaSection {...defaultProps} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper?.className).toContain('custom-media-class');
    });
  });

  describe('Video-only rendering', () => {
    it('should render video without image fallback', () => {
      const { container } = render(<MediaSection {...propsWithOnlyVideo} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();

      const imageWrapper = screen.queryByTestId('image-wrapper');
      expect(imageWrapper).not.toBeInTheDocument();
    });

    it('should render video with correct classes', () => {
      const { container } = render(<MediaSection {...propsWithOnlyVideo} />);

      const video = container.querySelector('video');
      expect(video?.className).toContain('rounded-md');
      expect(video?.className).toContain('object-cover');
    });
  });

  describe('Image-only rendering', () => {
    it('should render image when no video provided', () => {
      render(<MediaSection {...propsWithOnlyImage} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toBeInTheDocument();
    });

    it('should render image with correct src', () => {
      render(<MediaSection {...propsWithOnlyImage} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toHaveAttribute('src', '/images/test-image.jpg');
    });

    it('should apply correct classes to image', () => {
      render(<MediaSection {...propsWithOnlyImage} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper.className).toContain('rounded-md');
      expect(imageWrapper.className).toContain('object-cover');
    });
  });

  describe('Reduced motion handling', () => {
    it('should not render video when reducedMotion is true', () => {
      const { container } = render(<MediaSection {...propsWithReducedMotion} />);

      const video = container.querySelector('video');
      expect(video).not.toBeInTheDocument();
    });

    it('should render image when reducedMotion is true', () => {
      render(<MediaSection {...propsWithReducedMotion} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toBeInTheDocument();
    });

    it('should render image when both video and reducedMotion are present', () => {
      render(<MediaSection {...propsWithVideoAndReducedMotion} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toBeInTheDocument();
      expect(imageWrapper).toHaveAttribute('src', '/images/test-image.jpg');
    });

    it('should not render video with reducedMotion even if pause is false', () => {
      const { container } = render(<MediaSection {...propsWithVideoAndReducedMotion} />);

      const video = container.querySelector('video');
      expect(video).not.toBeInTheDocument();
    });
  });

  describe('Pause functionality', () => {
    it('should handle paused video', () => {
      const { container } = render(<MediaSection {...propsWithPausedVideo} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should render video when pause is true', () => {
      const { container } = render(<MediaSection {...propsWithPausedVideo} />);

      const source = container.querySelector('source');
      expect(source).toHaveAttribute('src', '/videos/test-video.mp4');
    });
  });

  describe('Intersection observer', () => {
    it('should handle video when not intersecting', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null } as unknown as React.RefObject<HTMLDivElement | null>]);

      const { container } = render(<MediaSection {...defaultProps} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should handle video when intersecting', () => {
      mockUseIntersectionObserver.mockReturnValue([true, { current: null } as unknown as React.RefObject<HTMLDivElement | null>]);

      const { container } = render(<MediaSection {...defaultProps} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });
  });

  describe('Image sizing', () => {
    it('should handle large image dimensions', () => {
      render(<MediaSection {...propsWithLargeImage} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toBeInTheDocument();
      expect(imageWrapper).toHaveAttribute('src', '/images/large-image.jpg');
    });

    it('should handle image without explicit size', () => {
      render(<MediaSection {...propsWithImageNoSize} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should not render when no media provided', () => {
      const { container } = render(<MediaSection {...propsWithNoMedia} />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined video gracefully', () => {
      const { container } = render(<MediaSection {...propsWithOnlyImage} />);

      const video = container.querySelector('video');
      expect(video).not.toBeInTheDocument();
    });

    it('should handle undefined image gracefully', () => {
      render(<MediaSection {...propsWithOnlyVideo} />);

      const imageWrapper = screen.queryByTestId('image-wrapper');
      expect(imageWrapper).not.toBeInTheDocument();
    });

    it('should handle empty className', () => {
      const { container } = render(<MediaSection {...propsWithOnlyVideo} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Editing mode', () => {
    it('should handle editing mode with relative URLs', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContextEditing as ReturnType<typeof useSitecore>);

      const { container } = render(<MediaSection {...defaultProps} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });
  });

  describe('Custom classes', () => {
    it('should apply multiple custom classes', () => {
      const { container } = render(<MediaSection {...propsWithCustomClass} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper?.className).toContain('aspect-280/356');
      expect(wrapper?.className).toContain('custom-class');
    });

    it('should combine default and custom classes on video', () => {
      const { container } = render(<MediaSection {...propsWithCustomClass} />);

      const video = container.querySelector('video');
      expect(video?.className).toContain('rounded-md');
      expect(video?.className).toContain('object-cover');
      expect(video?.className).toContain('aspect-280/356');
    });

    it('should combine default and custom classes on image', () => {
      const propsImageWithClass = {
        ...propsWithOnlyImage,
        className: 'custom-image-class',
      };

      render(<MediaSection {...propsImageWithClass} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper.className).toContain('custom-image-class');
      expect(imageWrapper.className).toContain('rounded-md');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on video', () => {
      const { container } = render(<MediaSection {...defaultProps} />);

      const video = container.querySelector('video');
      expect(video).toHaveAttribute('aria-hidden', 'true');
    });

    it('should pass alt prop to ImageWrapper component', () => {
      render(<MediaSection {...propsWithOnlyImage} />);

      const imageWrapper = screen.getByTestId('image-wrapper');
      expect(imageWrapper).toBeInTheDocument();
      // ImageWrapper receives alt="" prop from MediaSection component
      expect(imageWrapper).toHaveAttribute('alt');
    });
  });

  describe('Component structure', () => {
    it('should render with correct wrapper structure', () => {
      const { container } = render(<MediaSection {...defaultProps} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper).toBeInTheDocument();

      const video = wrapper?.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should render video inside wrapper', () => {
      const { container } = render(<MediaSection {...propsWithOnlyVideo} />);

      const wrapper = container.querySelector('.relative');
      const video = wrapper?.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should render image inside wrapper', () => {
      const { container } = render(<MediaSection {...propsWithOnlyImage} />);

      const wrapper = container.querySelector('.relative');
      const imageWrapper = wrapper?.querySelector('[data-testid="image-wrapper"]');
      expect(imageWrapper).toBeInTheDocument();
    });
  });
});

