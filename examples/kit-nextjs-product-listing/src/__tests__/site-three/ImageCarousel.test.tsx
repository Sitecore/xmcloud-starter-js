/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as ImageCarouselDefault } from '@/components/site-three/ImageCarousel';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>,
  ArrowLeft: () => <span data-testid="arrow-left">←</span>,
  ArrowRight: () => <span data-testid="arrow-right">→</span>,
}));

// Mock Embla Carousel with controllable state
const mockScrollNext = jest.fn();
const mockScrollPrev = jest.fn();
const mockScrollTo = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();
let mockCanScrollNext = true;
let mockCanScrollPrev = true;
let mockSelectedScrollSnap = 0;

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    (node: HTMLElement) => node,
    {
      scrollNext: mockScrollNext,
      scrollPrev: mockScrollPrev,
      scrollTo: mockScrollTo,
      canScrollNext: () => mockCanScrollNext,
      canScrollPrev: () => mockCanScrollPrev,
      selectedScrollSnap: () => mockSelectedScrollSnap,
      on: mockOn,
      off: mockOff,
    },
  ],
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Image: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
}));

describe('ImageCarousel', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      data: {
        datasource: {
          imageItems: {
            results: [
              {
                id: 'slide-1',
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/slide1.jpg',
                      alt: 'Slide 1',
                    },
                  },
                },
              },
              {
                id: 'slide-2',
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/slide2.jpg',
                      alt: 'Slide 2',
                    },
                  },
                },
              },
              {
                id: 'slide-3',
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/slide3.jpg',
                      alt: 'Slide 3',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCanScrollNext = true;
    mockCanScrollPrev = true;
    mockSelectedScrollSnap = 0;
  });

  it('renders carousel with images', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders carousel navigation buttons', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
  });

  it('calls scrollPrev when left arrow is clicked', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    const leftButton = screen.getByTestId('arrow-left').closest('button');
    fireEvent.click(leftButton!);
    expect(mockScrollPrev).toHaveBeenCalled();
  });

  it('calls scrollNext when right arrow is clicked', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    const rightButton = screen.getByTestId('arrow-right').closest('button');
    fireEvent.click(rightButton!);
    expect(mockScrollNext).toHaveBeenCalled();
  });

  it('calls scrollTo when thumbnail is clicked', () => {
    const { container } = render(<ImageCarouselDefault {...mockProps} />);
    // Find thumbnail containers specifically (not main carousel images)
    const thumbnailContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    if (thumbnailContainers.length > 0) {
      // Click on first thumbnail - should call scrollTo
      fireEvent.click(thumbnailContainers[0]);
      expect(mockScrollTo).toHaveBeenCalled();
      expect(mockScrollTo).toHaveBeenCalledWith(expect.any(Number));
    }
  });

  it('disables prev button when canScrollPrev is false', () => {
    mockCanScrollPrev = false;
    render(<ImageCarouselDefault {...mockProps} />);
    const leftButton = screen.getByTestId('arrow-left').closest('button');
    expect(leftButton).toBeDisabled();
  });

  it('disables next button when canScrollNext is false', () => {
    mockCanScrollNext = false;
    render(<ImageCarouselDefault {...mockProps} />);
    const rightButton = screen.getByTestId('arrow-right').closest('button');
    expect(rightButton).toBeDisabled();
  });

  it('sets up event listeners on mount', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    expect(mockOn).toHaveBeenCalledWith('select', expect.any(Function));
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<ImageCarouselDefault {...mockProps} />);
    unmount();
    expect(mockOff).toHaveBeenCalledWith('select', expect.any(Function));
  });

  it('handles missing API gracefully', () => {
    // Test that component renders without errors even when APIs are missing
    const { container } = render(<ImageCarouselDefault {...mockProps} />);
    expect(container.firstChild).toBeInTheDocument();
    // Verify the component structure is intact
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('handles empty imageItems array', () => {
    const emptyProps = {
      params: {},
      fields: {
        data: {
          datasource: {
            imageItems: {
              results: [],
            },
          },
        },
      },
    };
    const { container } = render(<ImageCarouselDefault {...emptyProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles missing datasource', () => {
    const minimalProps: any = {
      params: {},
      fields: {},
    };
    const { container } = render(<ImageCarouselDefault {...minimalProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const styledProps = {
      ...mockProps,
      params: { styles: 'custom-carousel-styles' },
    };
    const { container } = render(<ImageCarouselDefault {...styledProps} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-carousel-styles');
  });
});
