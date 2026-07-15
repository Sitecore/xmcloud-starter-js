import React from 'react';
import { render, screen } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock Button component
jest.mock('@/components/ui/button', () => {
  const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
  >(({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children as React.ReactNode}
    </button>
  ));
  Button.displayName = 'Button';

  return {
    Button,
    buttonVariants: jest.fn(() => 'mocked-button-class'),
  };
});

// Mock embla-carousel-react
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    (node: HTMLElement | null) => {
      // Mock ref callback
      return node;
    },
    {
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      canScrollPrev: () => true,
      canScrollNext: () => true,
      on: jest.fn(),
      off: jest.fn(),
    },
  ],
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  ArrowLeft: () => <span>←</span>,
  ArrowRight: () => <span>→</span>,
}));

describe('Carousel', () => {
  it('renders carousel', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders carousel items', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByText(/slide 1/i)).toBeInTheDocument();
    expect(screen.getByText(/slide 2/i)).toBeInTheDocument();
    expect(screen.getByText(/slide 3/i)).toBeInTheDocument();
  });

  it('renders carousel with custom className', () => {
    const { container } = render(
      <Carousel className="custom-carousel">
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText(/slide/i)).toBeInTheDocument();
  });
});
