import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoPlayer } from '@/components/video/VideoPlayer.dev';

// Mock react-youtube
jest.mock('react-youtube', () => {
  return function YouTube({ videoId, className }: { videoId: string; className: string }) {
    return (
      <div data-testid="youtube-player" data-video-id={videoId} className={className}>
        YouTube Player
      </div>
    );
  };
});

// Mock Icon component
jest.mock('@/components/icon/Icon', () => ({
  Default: ({ iconName, className }: { iconName: string; className: string }) => (
    <div data-testid="icon" data-icon-name={iconName} className={className}>
      {iconName}
    </div>
  ),
}));

// Mock useVideo hook
const mockSetPlayingVideoId = jest.fn();
jest.mock('@/contexts/VideoContext', () => ({
  useVideo: () => ({
    playingVideoId: null,
    setPlayingVideoId: mockSetPlayingVideoId,
  }),
}));

// Mock extractVideoId utility
jest.mock('@/utils/video', () => ({
  extractVideoId: (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
  },
}));

describe('VideoPlayer', () => {
  const mockOnPlay = jest.fn();
  const defaultProps = {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isPlaying: false,
    onPlay: mockOnPlay,
    btnClasses: 'test-btn-class',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders play button when not playing', () => {
    render(<VideoPlayer {...defaultProps} />);

    const playButton = screen.getByRole('button', { name: /play video/i });
    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveClass('test-btn-class');

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon-name', 'play');
  });

  it('calls onPlay when play button is clicked', () => {
    render(<VideoPlayer {...defaultProps} />);

    const playButton = screen.getByRole('button', { name: /play video/i });
    fireEvent.click(playButton);

    expect(mockOnPlay).toHaveBeenCalledTimes(1);
  });

  it('renders YouTube player with correct video ID', () => {
    render(<VideoPlayer {...defaultProps} isPlaying={true} />);

    const youtubePlayer = screen.getByTestId('youtube-player');
    expect(youtubePlayer).toBeInTheDocument();
    expect(youtubePlayer).toHaveAttribute('data-video-id', 'dQw4w9WgXcQ');
  });
});
