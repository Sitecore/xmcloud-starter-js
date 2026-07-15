import React from 'react';
import { render, screen } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';

// Mock Radix UI Checkbox
jest.mock('@radix-ui/react-checkbox', () => {
  const Root = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, className, ...props }, ref) => (
    <button ref={ref} data-testid="checkbox" className={className as string} {...props}>
      {children as React.ReactNode}
    </button>
  ));
  Root.displayName = 'CheckboxRoot';

  const Indicator = ({ children }: React.PropsWithChildren) => (
    <span>{children as React.ReactNode}</span>
  );

  return { Root, Indicator };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
}));

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />);

    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Checkbox className="custom-checkbox" />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox.className).toContain('custom-checkbox');
  });

  it('renders check icon indicator', () => {
    render(<Checkbox />);

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });
});
