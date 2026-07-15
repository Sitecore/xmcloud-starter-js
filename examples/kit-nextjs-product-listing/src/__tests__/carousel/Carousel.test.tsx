import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Default as CarouselDefault } from '../../components/carousel/Carousel';
import {
  defaultCarouselProps,
  carouselWithSingleSlide,
  carouselWithStyles,
} from './Carousel.mockProps';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">Left</span>,
  ChevronRight: () => <span data-testid="chevron-right">Right</span>,
  Pause: () => <span data-testid="pause-icon">Pause</span>,
  Play: () => <span data-testid="play-icon">Play</span>,
}));

// Mock Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: ({
    field,
    className,
  }: {
    field: { value: { src: string; alt: string } };
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="carousel-image"
      src={field?.value?.src}
      alt={field?.value?.alt || ''}
      className={className}
    />
  ),
  Link: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <a data-testid="carousel-link" className={className}>
      {children}
    </a>
  ),
  Text: ({ field }: { field: { value: string } }) => (
    <span data-testid="carousel-text">{field?.value}</span>
  ),
}));

// Mock Button component
jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    asChild,
    variant,
    size,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    asChild?: boolean;
    variant?: string;
    size?: string;
    className?: string;
  }) => (
    <button
      data-testid="carousel-button"
      onClick={onClick}
      data-as-child={asChild}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock useMediaQuery hook
jest.mock('../../hooks/use-media-query', () => ({
  useMediaQuery: jest.fn(() => false),
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Carousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders carousel with slides', () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-image')).toHaveLength(1); // Only current slide visible
    expect(screen.getAllByTestId('carousel-text')).toHaveLength(2); // Title and body text
  });

  it('renders navigation controls', () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
  });

  it('renders slide indicators', () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    const indicators = screen.getAllByRole('tab');
    expect(indicators).toHaveLength(3); // Three slides
  });

  it('navigates to next slide on next button click', async () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    const nextButton = screen
      .getAllByTestId('carousel-button')
      .find((btn) => btn.querySelector('[data-testid="chevron-right"]'));

    const indicators = screen.getAllByRole('tab');

    // Initially, first indicator should be selected
    expect(indicators[0]).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(nextButton!);

    // After navigation, second indicator should be selected
    await waitFor(() => {
      expect(indicators[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('navigates to previous slide on previous button click', async () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    const prevButton = screen
      .getAllByTestId('carousel-button')
      .find((btn) => btn.querySelector('[data-testid="chevron-left"]'));

    const indicators = screen.getAllByRole('tab');

    fireEvent.click(prevButton!);

    // Should wrap to last slide (third indicator)
    await waitFor(() => {
      expect(indicators[2]).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('toggles play/pause state', () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    // Initially should show pause icon (playing)
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();

    const playPauseButton = screen
      .getAllByTestId('carousel-button')
      .find((btn) => btn.querySelector('[data-testid="pause-icon"]'));

    fireEvent.click(playPauseButton!);

    // Should now show play icon (paused)
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
  });

  it('navigates to specific slide via indicator', async () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    const indicators = screen.getAllByRole('tab');
    fireEvent.click(indicators[2]); // Click third indicator

    await waitFor(() => {
      expect(indicators[2]).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('applies custom styles from params', () => {
    render(<CarouselDefault {...carouselWithStyles} />);

    const carouselContainer = screen
      .getByRole('group')
      .closest('[aria-roledescription="carousel"]');
    expect(carouselContainer).toHaveClass('custom-carousel-class');
  });

  it('renders single slide correctly', () => {
    render(<CarouselDefault {...carouselWithSingleSlide} />);

    const indicators = screen.getAllByRole('tab');
    expect(indicators).toHaveLength(1);
  });

  it('has proper ARIA attributes', () => {
    render(<CarouselDefault {...defaultCarouselProps} />);

    // The carousel container should have the role description and label
    const carousel = screen.getByRole('group').closest('[aria-roledescription="carousel"]');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    expect(carousel).toHaveAttribute('aria-label', 'Sustainability initiatives carousel');

    const slide = screen.getByRole('group');
    expect(slide).toHaveAttribute('aria-roledescription', 'slide');
    expect(slide).toHaveAttribute('tabIndex', '0');
  });
});
