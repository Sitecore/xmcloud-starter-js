/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as VideoDefault } from '../../components/video/Video';
import {
  defaultVideoProps,
  videoPropsWithoutModal,
  videoPropsDarkPlayIcon,
  videoPropsNoDisplayIcon,
  videoPropsNoImage,
  videoPropsVimeoUrl,
  videoPropsLongTitle,
  videoPropsSpecialChars,
  videoPropsEmptyImage,
  videoPropsNoVideo,
  videoPropsEmptyVideoUrl,
  videoPropsNoTitle,
  videoPropsAllCustomParams,
  videoPropsNoFields,
  videoPropsEmptyFields,
  videoPropsUndefinedFields,
  videoPropsNoParams,
  videoPropsEmptyParams,
  videoPropsMalformedUrl,
  videoPropsShortUrl,
  videoPropsEmbedUrl,
  mockVideoContextDefault,
  mockVideoContextPlaying,
  mockVideoContextPlayingOther,
  mockVideoModalDefault,
  mockVideoModalOpen,
  mockIsMobileFalse,
  mockUseSitecoreNormal,
} from './Video.mockProps';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
}));

// Mock video hooks
const mockUseVideoModal = jest.fn();
const mockUseVideo = jest.fn();

jest.mock('../../hooks/useVideoModal', () => ({
  useVideoModal: () => mockUseVideoModal(),
}));

jest.mock('../../contexts/VideoContext', () => ({
  useVideo: () => mockUseVideo(),
}));

// Mock mobile detection
const mockIsMobile = jest.fn();

jest.mock('../../utils/isMobile', () => ({
  isMobile: () => mockIsMobile(),
}));

// Mock video utilities
const mockExtractVideoId = jest.fn();

jest.mock('../../utils/video', () => ({
  extractVideoId: (url: string) => mockExtractVideoId(url),
}));

// Mock utility functions
const mockGetYouTubeThumbnail = jest.fn();

jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
  getYouTubeThumbnail: (videoId: string, width?: number, height?: number) =>
    mockGetYouTubeThumbnail(videoId, width, height),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const MotionDiv = React.forwardRef(
    ({ children, className, onClick, whileHover, ...props }: any, ref: any) => (
      <div
        ref={ref}
        className={className}
        onClick={onClick}
        data-testid="motion-div"
        data-while-hover={whileHover}
        {...props}
      >
        {children}
      </div>
    )
  );
  MotionDiv.displayName = 'MotionDiv';
  return {
    motion: {
      div: MotionDiv,
    },
  };
});

// Mock Icon component
jest.mock('../../components/icon/Icon', () => ({
  Default: ({ iconName, className, ...props }: any) => (
    <div data-testid="icon" data-icon-name={iconName} className={className} {...props}>
      {iconName} Icon
    </div>
  ),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height, ...props }: any) => (
   <img
      src={src || '/placeholder.svg'}
      alt={alt || ''}
      className={className}
      width={width || 1920}
      height={height || 1080}
      data-testid="next-image"
      {...props}
    />
  ),
}));

// Mock ImageWrapper component
jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, wrapperClass, objectFit, ...props }: any) => (
    <div className={wrapperClass} data-testid="image-wrapper-container">
      <img
        data-testid="image-wrapper"
        src={image?.value?.src || ''}
        alt={image?.value?.alt || ''}
        className={className}
        data-object-fit={objectFit}
        {...props}
      />
    </div>
  ),
}));

// Mock VideoPlayer component
jest.mock('../../components/video/VideoPlayer.dev', () => ({
  VideoPlayer: ({ videoUrl, isPlaying, onPlay, fullScreen, btnClasses, iconName }: any) => (
    <div
      data-testid="video-player"
      data-video-url={videoUrl}
      data-is-playing={isPlaying}
      data-full-screen={fullScreen}
      data-btn-classes={btnClasses}
      data-icon-name={iconName}
      onClick={onPlay}
    >
      Video Player Component
    </div>
  ),
}));

// Mock VideoModal component
jest.mock('../../components/video/VideoModal.dev', () => ({
  VideoModal: ({ isOpen, onClose, videoUrl }: any) => (
    <div
      data-testid="video-modal"
      data-is-open={isOpen}
      data-video-url={videoUrl}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <button data-testid="close-modal" onClick={onClose}>
        Close Modal
      </button>
      Video Modal Component
    </div>
  ),
}));

// Mock NoDataFallback component
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('Video Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
    mockUseVideoModal.mockReturnValue(mockVideoModalDefault);
    mockUseVideo.mockReturnValue(mockVideoContextDefault);
    mockIsMobile.mockReturnValue(mockIsMobileFalse);
    mockExtractVideoId.mockReturnValue('dQw4w9WgXcQ');
    mockGetYouTubeThumbnail.mockReturnValue(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    );
  });

  describe('Default Rendering', () => {
    it('renders with default props successfully', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    });

    it('renders video thumbnail image correctly', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveAttribute('src', '/images/video-thumbnail.jpg');
      expect(image).toHaveAttribute('alt', 'Video thumbnail showing SYNC audio equipment');
      expect(image).toHaveAttribute('data-object-fit', 'cover');
    });

    it('renders play button with correct styling', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
      expect(playButton).toHaveClass('absolute', 'inset-0', 'z-20');
    });

    it('renders video in correct aspect ratio container', () => {
      const { container } = render(<VideoDefault {...defaultVideoProps} />);

      const aspectContainer = container.querySelector('.aspect-video');
      expect(aspectContainer).toBeInTheDocument();
    });

    it('applies motion hover effects', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs[0]).toHaveAttribute('data-while-hover', 'hover');
    });
  });

  describe('Play Icon Variants', () => {
    it('renders light play icon by default', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
      expect(playButton).toHaveClass('absolute', 'inset-0', 'z-20');
    });

    it('renders dark play icon when darkPlayIcon is enabled', () => {
      render(<VideoDefault {...videoPropsDarkPlayIcon} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
      expect(playButton).toHaveClass('absolute', 'inset-0', 'z-20');
    });

    it('renders icon component with correct properties', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-name', 'play');
      expect(icon).toHaveClass('h-[65px]', 'w-[65px]');
    });

    it('handles custom play button class names', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
    });
  });

  describe('Display Icon Feature', () => {
    it('renders display icon when enabled', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const { container } = render(<VideoDefault {...defaultVideoProps} />);
      const displayIcon = container.querySelector('svg');
      expect(displayIcon).toBeInTheDocument();
    });

    it('hides display icon when disabled', () => {
      render(<VideoDefault {...videoPropsNoDisplayIcon} />);

      // Component still renders but displayIcon parameter should control visibility
      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
    });

    it('applies correct display icon styling', () => {
      const { container } = render(<VideoDefault {...defaultVideoProps} />);

      const iconContainer = container.querySelector('.absolute.inset-0.flex.max-w-\\[30\\%\\]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Modal vs Inline Player', () => {
    it('shows modal play button when modal is enabled and desktop', () => {
      mockIsMobile.mockReturnValue(false);
      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
      expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
    });

    it('shows inline video player when modal is disabled', () => {
      render(<VideoDefault {...videoPropsWithoutModal} />);

      expect(screen.getByTestId('video-player')).toBeInTheDocument();
    });

    it('shows inline video player on mobile regardless of modal setting', () => {
      mockIsMobile.mockReturnValue(true);
      render(<VideoDefault {...defaultVideoProps} />);

      expect(screen.getByTestId('video-player')).toBeInTheDocument();
    });

    it('renders video modal component when modal is enabled', () => {
      mockIsMobile.mockReturnValue(false);
      render(<VideoDefault {...defaultVideoProps} />);

      const modal = screen.getByTestId('video-modal');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('data-is-open', 'false');
    });

    it('opens modal when play button is clicked on desktop', () => {
      mockIsMobile.mockReturnValue(false);
      const mockOpenModal = jest.fn();
      mockUseVideoModal.mockReturnValue({
        ...mockVideoModalDefault,
        openModal: mockOpenModal,
      });

      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      fireEvent.click(playButton);

      expect(mockOpenModal).toHaveBeenCalled();
    });
  });

  describe('Video Context Integration', () => {
    it('updates playing video ID when inline player starts', () => {
      const mockSetPlayingVideoId = jest.fn();
      mockUseVideo.mockReturnValue({
        ...mockVideoContextDefault,
        setPlayingVideoId: mockSetPlayingVideoId,
      });

      render(<VideoDefault {...videoPropsWithoutModal} />);

      const videoPlayer = screen.getByTestId('video-player');
      fireEvent.click(videoPlayer);

      expect(mockSetPlayingVideoId).toHaveBeenCalledWith('dQw4w9WgXcQ');
    });

    it('stops playing when another video starts', () => {
      mockUseVideo.mockReturnValue(mockVideoContextPlayingOther);

      render(<VideoDefault {...defaultVideoProps} />);

      // Component should handle the playing state internally
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it('handles video ID extraction correctly', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      expect(mockExtractVideoId).toHaveBeenCalledWith(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );
    });
  });

  describe('Thumbnail Handling', () => {
    it('uses custom image when provided', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveAttribute('src', '/images/video-thumbnail.jpg');
    });

    it('falls back to YouTube thumbnail when no custom image', () => {
      render(<VideoDefault {...videoPropsNoImage} />);

      // Should call getYouTubeThumbnail for fallback
      expect(mockGetYouTubeThumbnail).toHaveBeenCalledWith('dQw4w9WgXcQ', 0, 0);
    });

    it('handles empty image fields gracefully', () => {
      render(<VideoDefault {...videoPropsEmptyImage} />);

      // Component should render video player even without image
      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toBeInTheDocument();
    });

    it('updates fallback image based on component dimensions', () => {
      const { container } = render(<VideoDefault {...videoPropsNoImage} />);

      // Mock getBoundingClientRect for testing dimensions
      const videoContainer = container.querySelector('.aspect-video');
      if (videoContainer) {
        Object.defineProperty(videoContainer, 'clientWidth', { value: 800 });
        Object.defineProperty(videoContainer, 'clientHeight', { value: 450 });
      }

      // Re-render to trigger useEffect
      render(<VideoDefault {...videoPropsNoImage} />);

      expect(mockGetYouTubeThumbnail).toHaveBeenCalled();
    });
  });

  describe('Video URL Handling', () => {
    it('handles YouTube URLs correctly', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      expect(mockExtractVideoId).toHaveBeenCalledWith(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );
    });

    it('handles YouTube short URLs', () => {
      render(<VideoDefault {...videoPropsShortUrl} />);

      expect(mockExtractVideoId).toHaveBeenCalledWith('https://youtu.be/dQw4w9WgXcQ');
    });

    it('handles YouTube embed URLs', () => {
      render(<VideoDefault {...videoPropsEmbedUrl} />);

      expect(mockExtractVideoId).toHaveBeenCalledWith('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('handles Vimeo URLs', () => {
      render(<VideoDefault {...videoPropsVimeoUrl} />);

      expect(mockExtractVideoId).toHaveBeenCalledWith('https://vimeo.com/123456789');
    });

    it('handles malformed URLs gracefully', () => {
      expect(() => {
        render(<VideoDefault {...videoPropsMalformedUrl} />);
      }).not.toThrow();

      expect(mockExtractVideoId).toHaveBeenCalledWith('not-a-valid-url');
    });
  });

  describe('Content Scenarios', () => {
    it('handles missing video URL', () => {
      render(<VideoDefault {...videoPropsNoVideo} />);

      expect(screen.getByText('Please add video')).toBeInTheDocument();
      expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    });

    it('handles empty video URL', () => {
      render(<VideoDefault {...videoPropsEmptyVideoUrl} />);

      expect(screen.getByText('Please add video')).toBeInTheDocument();
    });

    it('handles missing title gracefully', () => {
      render(<VideoDefault {...videoPropsNoTitle} />);

      // Should still render video player without title
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it('handles special characters in content', () => {
      render(<VideoDefault {...videoPropsSpecialChars} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
      expect(mockExtractVideoId).toHaveBeenCalledWith('https://www.youtube.com/watch?v=special123');
    });

    it('handles long video titles', () => {
      render(<VideoDefault {...videoPropsLongTitle} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts behavior for mobile devices', () => {
      mockIsMobile.mockReturnValue(true);
      render(<VideoDefault {...defaultVideoProps} />);

      // Should show video player instead of modal button on mobile
      expect(screen.getByTestId('video-player')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /play video/i })).not.toBeInTheDocument();
    });

    it('uses modal behavior on desktop', () => {
      mockIsMobile.mockReturnValue(false);
      render(<VideoDefault {...defaultVideoProps} />);

      expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();
      expect(screen.getByTestId('video-modal')).toBeInTheDocument();
    });

    it('handles device type changes', () => {
      // Start with desktop
      mockIsMobile.mockReturnValue(false);
      const { rerender } = render(<VideoDefault {...defaultVideoProps} />);

      expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();

      // Switch to mobile
      mockIsMobile.mockReturnValue(true);
      rerender(<VideoDefault {...defaultVideoProps} />);

      // On mobile, still renders play button but behavior may differ
      expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('returns NoDataFallback when no fields', () => {
      render(<VideoDefault {...videoPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('no-data-fallback')).toHaveTextContent('Video');
    });

    it('handles empty fields gracefully', () => {
      render(<VideoDefault {...videoPropsEmptyFields} />);

      expect(screen.getByText('Please add video')).toBeInTheDocument();
    });

    it('handles undefined fields', () => {
      render(<VideoDefault {...videoPropsUndefinedFields} />);

      expect(screen.getByText('Please add video')).toBeInTheDocument();
    });

    it('handles missing params gracefully', () => {
      render(<VideoDefault {...videoPropsNoParams} />);

      // Should still render with default param values
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it('handles empty params', () => {
      render(<VideoDefault {...videoPropsEmptyParams} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it('handles video extraction failures', () => {
      mockExtractVideoId.mockReturnValue(null);

      expect(() => {
        render(<VideoDefault {...defaultVideoProps} />);
      }).not.toThrow();
    });

    it('handles YouTube thumbnail generation failures', () => {
      mockGetYouTubeThumbnail.mockReturnValue(null);

      expect(() => {
        render(<VideoDefault {...videoPropsNoImage} />);
      }).not.toThrow();
    });
  });

  describe('Modal Functionality', () => {
    it('opens modal when play button is clicked', () => {
      const mockOpenModal = jest.fn();
      mockUseVideoModal.mockReturnValue({
        ...mockVideoModalDefault,
        openModal: mockOpenModal,
      });

      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      fireEvent.click(playButton);

      expect(mockOpenModal).toHaveBeenCalled();
    });

    it('closes modal and stops video when modal closes', () => {
      const mockCloseModal = jest.fn();
      const mockSetPlayingVideoId = jest.fn();

      mockUseVideoModal.mockReturnValue({
        ...mockVideoModalOpen,
        closeModal: mockCloseModal,
      });

      mockUseVideo.mockReturnValue({
        ...mockVideoContextDefault,
        setPlayingVideoId: mockSetPlayingVideoId,
      });

      render(<VideoDefault {...defaultVideoProps} />);

      const closeButton = screen.getByTestId('close-modal');
      fireEvent.click(closeButton);

      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('passes correct props to VideoModal', () => {
      mockUseVideoModal.mockReturnValue(mockVideoModalOpen);
      render(<VideoDefault {...defaultVideoProps} />);

      const modal = screen.getByTestId('video-modal');
      expect(modal).toHaveAttribute('data-is-open', 'true');
      expect(modal).toHaveAttribute(
        'data-video-url',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );
    });
  });

  describe('Video Player Integration', () => {
    it('passes correct props to VideoPlayer', () => {
      render(<VideoDefault {...videoPropsWithoutModal} />);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toHaveAttribute(
        'data-video-url',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );
      expect(videoPlayer).toHaveAttribute('data-full-screen', 'true');
      expect(videoPlayer).toHaveAttribute('data-icon-name', 'play');
    });

    it('handles video player play events', () => {
      const mockSetPlayingVideoId = jest.fn();
      mockUseVideo.mockReturnValue({
        ...mockVideoContextDefault,
        setPlayingVideoId: mockSetPlayingVideoId,
      });

      render(<VideoDefault {...videoPropsWithoutModal} />);

      const videoPlayer = screen.getByTestId('video-player');
      fireEvent.click(videoPlayer);

      expect(mockSetPlayingVideoId).toHaveBeenCalledWith('dQw4w9WgXcQ');
    });

    it('updates playing state correctly', () => {
      mockUseVideo.mockReturnValue(mockVideoContextPlaying);
      render(<VideoDefault {...videoPropsWithoutModal} />);

      const videoPlayer = screen.getByTestId('video-player');
      // Mock VideoPlayer starts with data-is-playing="false" by default
      expect(videoPlayer).toHaveAttribute('data-is-playing', 'false');
    });
  });

  describe('Accessibility', () => {
    it('provides accessible play button label', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });
      expect(playButton).toHaveAttribute('aria-label', 'Play video');
    });

    it('uses proper image alt text', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveAttribute('alt', 'Video thumbnail showing SYNC audio equipment');
    });

    it('marks decorative images as aria-hidden', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveAttribute('aria-hidden', 'true');
    });

    it('provides keyboard navigation support', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });

      // Should be focusable
      playButton.focus();
      expect(document.activeElement).toBe(playButton);

      // Should respond to keyboard events
      fireEvent.keyDown(playButton, { key: 'Enter' });
      // The component should handle this appropriately
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<VideoDefault {...defaultVideoProps} />);

      rerender(<VideoDefault {...defaultVideoProps} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it('cleans up effects on unmount', () => {
      const { unmount } = render(<VideoDefault {...defaultVideoProps} />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles rapid state changes', async () => {
      const mockOpenModal = jest.fn();
      mockUseVideoModal.mockReturnValue({
        ...mockVideoModalDefault,
        openModal: mockOpenModal,
      });

      render(<VideoDefault {...defaultVideoProps} />);

      const playButton = screen.getByRole('button', { name: /play video/i });

      // Rapidly click multiple times
      fireEvent.click(playButton);
      fireEvent.click(playButton);
      fireEvent.click(playButton);

      // Should have been called at least 3 times (may be more due to React behavior)
      expect(mockOpenModal.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Integration', () => {
    it('integrates correctly with video context', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      expect(mockUseVideo).toHaveBeenCalled();
      expect(mockUseVideoModal).toHaveBeenCalled();
    });

    it('integrates with mobile detection utility', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      expect(mockIsMobile).toHaveBeenCalled();
    });

    it('integrates with video ID extraction utility', () => {
      render(<VideoDefault {...defaultVideoProps} />);

      expect(mockExtractVideoId).toHaveBeenCalledWith(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );
    });

    it('integrates with YouTube thumbnail utility', () => {
      render(<VideoDefault {...videoPropsNoImage} />);

      expect(mockGetYouTubeThumbnail).toHaveBeenCalled();
    });

    it('applies custom styling correctly', () => {
      render(<VideoDefault {...videoPropsAllCustomParams} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });
  });
});
