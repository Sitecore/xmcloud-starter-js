import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoModal } from '@/components/video/VideoModal.dev';

// Mock react-youtube
jest.mock('react-youtube', () => {
  return function YouTube({ videoId }: { videoId: string }) {
    return (
      <div data-testid="youtube-modal-player" data-video-id={videoId}>
        YouTube Modal Player
      </div>
    );
  };
});

// Mock focus-trap-react
jest.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const motion = {
    div: ({
      children,
      onClick,
      className,
      role,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      variants?: unknown;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }) => (
      <div onClick={onClick} className={className} role={role} {...props}>
        {children}
      </div>
    ),
  };
  return { motion, m: motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="close-icon">X</span>,
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label'?: string }) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

// Mock useVideo hook
const mockSetPlayingVideoId = jest.fn();
jest.mock('@/contexts/VideoContext', () => ({
  useVideo: () => ({
    setPlayingVideoId: mockSetPlayingVideoId,
  }),
}));

// Mock body scroll utilities
jest.mock('@/utils/bodyClass', () => ({
  preventScroll: jest.fn(),
  allowScroll: jest.fn(),
}));

// Mock extractVideoId utility
jest.mock('@/utils/video', () => ({
  extractVideoId: (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
  },
}));

// Mock Portal component
jest.mock('@/components/portal/portal.dev', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="portal">{children}</div>
  ),
}));

describe('VideoModal', () => {
  const mockOnClose = jest.fn();
  const mockComponentRef = { current: null };
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    videoUrl: 'https://www.youtube.com/watch?v=abc123xyz',
    componentRef: mockComponentRef,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<VideoModal {...defaultProps} />);

    const portal = screen.getByTestId('portal');
    expect(portal).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders YouTube player with correct video ID', () => {
    render(<VideoModal {...defaultProps} />);

    const youtubePlayer = screen.getByTestId('youtube-modal-player');
    expect(youtubePlayer).toBeInTheDocument();
    expect(youtubePlayer).toHaveAttribute('data-video-id', 'abc123xyz');
  });

  it('calls onClose when close button is clicked', () => {
    render(<VideoModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
