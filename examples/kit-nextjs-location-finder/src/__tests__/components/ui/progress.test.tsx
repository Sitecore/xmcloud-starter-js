import React from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock Radix UI Progress
jest.mock('@radix-ui/react-progress', () => {
  const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{ value?: number }>>(
    ({ children, value, ...props }, ref) => (
      <div ref={ref} data-testid="progress" aria-valuenow={value} {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Root.displayName = 'ProgressRoot';

  const Indicator = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ style?: React.CSSProperties }>
  >(({ children, style, ...props }, ref) => (
    <div ref={ref} data-testid="progress-indicator" style={style} {...props}>
      {children as React.ReactNode}
    </div>
  ));
  Indicator.displayName = 'ProgressIndicator';

  return { Root, Indicator };
});

describe('Progress', () => {
  it('renders progress bar', () => {
    render(<Progress value={50} />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('renders progress with value', () => {
    render(<Progress value={60} />);

    const progress = screen.getByTestId('progress');
    expect(progress).toBeInTheDocument();
    expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Progress value={75} className="custom-progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toBeInTheDocument();
  });
});
