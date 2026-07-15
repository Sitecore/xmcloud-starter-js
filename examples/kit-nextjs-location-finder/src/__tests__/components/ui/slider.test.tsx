import React from 'react';
import { render, screen } from '@testing-library/react';
import { Slider } from '@/components/ui/slider';

// Mock Radix UI Slider
jest.mock('@radix-ui/react-slider', () => {
  const Root = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, className, ...props }, ref) => (
      <span ref={ref} data-testid="slider" className={className as string} {...props}>
        {children as React.ReactNode}
      </span>
    )
  );
  Root.displayName = 'SliderRoot';

  const Track = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <span data-testid="slider-track" className={className}>
      {children as React.ReactNode}
    </span>
  );

  const Range = ({ className }: { className?: string }) => (
    <span data-testid="slider-range" className={className} />
  );

  const Thumb = ({ className }: { className?: string }) => (
    <span data-testid="slider-thumb" className={className} />
  );

  return {
    Root,
    Track,
    Range,
    Thumb,
  };
});

describe('Slider', () => {
  it('renders slider', () => {
    render(<Slider />);

    expect(screen.getByTestId('slider')).toBeInTheDocument();
  });

  it('renders slider track and range', () => {
    render(<Slider />);

    expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    expect(screen.getByTestId('slider-range')).toBeInTheDocument();
  });

  it('renders slider thumb', () => {
    render(<Slider />);

    expect(screen.getByTestId('slider-thumb')).toBeInTheDocument();
  });
});
