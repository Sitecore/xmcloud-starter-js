import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Video } from '@/components/video/Video';
import { mockVideoProps } from './video.mock.props';

// Mock VideoPlayer
jest.mock('@/components/video/VideoPlayer.dev', () => ({
  VideoPlayer: () => <div data-testid="video-player">Video Player</div>,
}));

// Mock VideoModal
jest.mock('@/components/video/VideoModal.dev', () => ({
  VideoModal: () => <div data-testid="video-modal">Video Modal</div>,
}));

// Mock useVideoModal hook
jest.mock('@/hooks/useVideoModal', () => ({
  useVideoModal: () => ({
    isOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
  }),
}));

// Mock useVideo hook
const mockSetPlayingVideoId = jest.fn();
jest.mock('@/contexts/VideoContext', () => ({
  useVideo: () => ({
    playingVideoId: null,
    setPlayingVideoId: mockSetPlayingVideoId,
  }),
}));

// Mock Icon component
jest.mock('@/components/icon/Icon', () => ({
  Default: () => <div data-testid="icon">Play Icon</div>,
}));

// Mock ImageWrapper component
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image }: { image: { value?: { src?: string; alt?: string } } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="image-wrapper" src={image.value?.src} alt={image.value?.alt} />
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const motion = {
    div: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
  };
  return { motion, m: motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

// Mock isMobile utility
jest.mock('@/utils/isMobile', () => ({
  isMobile: () => false,
}));

// Mock extractVideoId utility
jest.mock('@/utils/video', () => ({
  extractVideoId: (url?: string) => {
    if (!url) return '';
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
  },
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock getYouTubeThumbnail utility
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  getYouTubeThumbnail: () => 'https://img.youtube.com/vi/test/maxresdefault.jpg',
}));

describe('Video', () => {
  it('renders video with image thumbnail', () => {
    render(<Video {...mockVideoProps} />);

    const imageWrapper = screen.getByTestId('image-wrapper');
    expect(imageWrapper).toBeInTheDocument();
    expect(imageWrapper).toHaveAttribute(
      'src',
      'https://example.com/alaris-ambulance-thumbnail.jpg'
    );
    expect(imageWrapper).toHaveAttribute('alt', 'Alaris Type I Ambulance Tour');
  });

  it('renders NoDataFallback when fields are not provided', () => {
    render(<Video rendering={mockVideoProps.rendering} params={mockVideoProps.params} page={mockVideoProps.page} />);

    const fallback = screen.getByTestId('no-data-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent('Video');
  });
});
