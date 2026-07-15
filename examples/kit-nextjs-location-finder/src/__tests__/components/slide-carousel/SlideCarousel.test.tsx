import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  SlideCarousel,
  SlideCarouselItemWrap,
} from '@/components/slide-carousel/SlideCarousel.dev';

// Mock UI carousel components
jest.mock('@/components/ui/carousel', () => {
  const MockCarousel = ({
    children,
    setApi,
    className,
  }: {
    children: React.ReactNode;
    setApi?: (api: {
      canScrollPrev: () => boolean;
      canScrollNext: () => boolean;
      selectedScrollSnap: () => number;
      scrollPrev: () => void;
      scrollNext: () => void;
      scrollTo: (index: number) => void;
      on: (event: string, callback: () => void) => void;
      off: (event: string, callback: () => void) => void;
    }) => void;
    opts?: Record<string, unknown>;
    className?: string;
  }) => {
    React.useEffect(() => {
      if (setApi) {
        // Mock carousel API
        const mockApi = {
          canScrollPrev: jest.fn(() => true),
          canScrollNext: jest.fn(() => true),
          selectedScrollSnap: jest.fn(() => 0),
          scrollPrev: jest.fn(),
          scrollNext: jest.fn(),
          scrollTo: jest.fn(),
          on: jest.fn(),
          off: jest.fn(),
        };
        setApi(mockApi);
      }
    }, [setApi]);

    return (
      <div data-testid="carousel" className={className}>
        {children}
      </div>
    );
  };
  MockCarousel.displayName = 'MockCarousel';

  const MockCarouselContent = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="carousel-content" className={className}>
      {children}
    </div>
  );
  MockCarouselContent.displayName = 'MockCarouselContent';

  const MockCarouselItem = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="carousel-item" className={className}>
      {children}
    </div>
  );
  MockCarouselItem.displayName = 'MockCarouselItem';

  return {
    Carousel: MockCarousel,
    CarouselContent: MockCarouselContent,
    CarouselItem: MockCarouselItem,
  };
});

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('SlideCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const createSlideCarousel = (itemCount = 3, className = '') => (
    <SlideCarousel className={className}>
      {Array.from({ length: itemCount }, (_, index) => (
        <SlideCarouselItemWrap key={index}>
          <div>Slide {index + 1}</div>
        </SlideCarouselItemWrap>
      ))}
    </SlideCarousel>
  );

  it('renders carousel with navigation buttons and pagination dots', async () => {
    render(createSlideCarousel(3));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-item')).toHaveLength(3);

    // Check for navigation buttons by testid since they use icons
    const prevButton = screen.getAllByTestId('ui-button')[0]; // First button is prev
    const nextButton = screen.getAllByTestId('ui-button')[1]; // Second button is next
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Check for pagination dots
    const paginationDots = screen.getAllByLabelText(/go to slide/i);
    expect(paginationDots).toHaveLength(3);
  });

  it('applies custom className to the section', () => {
    const customClass = 'custom-carousel-class';
    const { container } = render(createSlideCarousel(2, customClass));

    const section = container.querySelector('section');
    expect(section).toHaveClass(customClass);
  });

  it('handles single item carousel correctly', async () => {
    render(createSlideCarousel(1));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Should still render but with different behavior
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-item')).toHaveLength(1);
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
  });

  it('handles navigation button clicks', async () => {
    render(createSlideCarousel(3));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const prevButton = screen.getAllByTestId('ui-button')[0]; // First button is prev
    const nextButton = screen.getAllByTestId('ui-button')[1]; // Second button is next

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    // Buttons should be clickable (not testing actual scroll as that's mocked)
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('handles pagination dot clicks', async () => {
    render(createSlideCarousel(3));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const secondDot = screen.getByLabelText('Go to slide 2');
    fireEvent.click(secondDot);

    expect(secondDot).toBeInTheDocument();
  });

  it('does not render pagination when no items', () => {
    render(<SlideCarousel>{[]}</SlideCarousel>);

    const paginationDots = screen.queryAllByLabelText(/go to slide/i);
    expect(paginationDots).toHaveLength(0);
  });

  it('handles window resize events', async () => {
    render(createSlideCarousel(3));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Check that resize event listener was added
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('cleans up event listeners on unmount', async () => {
    const { unmount } = render(createSlideCarousel(3));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    unmount();

    // Check that resize event listener was removed
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('updates carousel state properly with multiple items', async () => {
    render(createSlideCarousel(5));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Should have 5 pagination dots
    const paginationDots = screen.getAllByLabelText(/go to slide/i);
    expect(paginationDots).toHaveLength(5);

    // First dot should have aria-current="true" initially
    expect(paginationDots[0]).toHaveAttribute('aria-current', 'true');
  });

  it('renders correct carousel structure and classes', () => {
    const { container } = render(createSlideCarousel(2));

    const section = container.querySelector('section');
    const carousel = screen.getByTestId('carousel');
    const carouselContent = screen.getByTestId('carousel-content');

    expect(section).toBeInTheDocument();
    expect(carousel).toHaveClass('w-full');
    expect(carouselContent).toHaveClass('ml-0');
  });
});

describe('SlideCarouselItemWrap Component', () => {
  it('renders children with correct styling', () => {
    render(
      <SlideCarouselItemWrap>
        <div>Test Content</div>
      </SlideCarouselItemWrap>
    );

    const carouselItem = screen.getByTestId('carousel-item');
    expect(carouselItem).toBeInTheDocument();
    expect(carouselItem).toHaveClass('pl-[20px]');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className along with default classes', () => {
    render(
      <SlideCarouselItemWrap className="custom-item-class">
        <div>Test Content</div>
      </SlideCarouselItemWrap>
    );

    const carouselItem = screen.getByTestId('carousel-item');
    expect(carouselItem).toHaveClass('pl-[20px]', 'custom-item-class');
  });
});
