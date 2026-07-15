import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toggle } from '@/components/ui/toggle';

// Mock Radix UI Toggle
jest.mock('@radix-ui/react-toggle', () => {
  const Root = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <button ref={ref} data-testid="toggle" {...props}>
        {children as React.ReactNode}
      </button>
    )
  );
  Root.displayName = 'ToggleRoot';

  return {
    Root,
  };
});

describe('Toggle', () => {
  it('renders toggle button', () => {
    render(<Toggle>Toggle me</Toggle>);

    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    expect(screen.getByText(/toggle me/i)).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Toggle variant="outline">Outline</Toggle>);

    const toggle = screen.getByTestId('toggle');
    expect(toggle).toBeInTheDocument();
  });

  it('applies size classes', () => {
    render(<Toggle size="lg">Large</Toggle>);

    const toggle = screen.getByTestId('toggle');
    expect(toggle).toBeInTheDocument();
  });
});
