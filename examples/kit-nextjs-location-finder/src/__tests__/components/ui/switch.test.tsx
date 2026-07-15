import React from 'react';
import { render, screen } from '@testing-library/react';
import { Switch } from '@/components/ui/switch';

// Mock Radix UI Switch
jest.mock('@radix-ui/react-switch', () => {
  const Root = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, className, ...props }, ref) => (
    <button ref={ref} data-testid="switch" className={className as string} {...props}>
      {children as React.ReactNode}
    </button>
  ));
  Root.displayName = 'SwitchRoot';

  const Thumb = ({ className }: { className?: string }) => (
    <span data-testid="switch-thumb" className={className} />
  );

  return {
    Root,
    Thumb,
  };
});

describe('Switch', () => {
  it('renders switch', () => {
    render(<Switch />);

    expect(screen.getByTestId('switch')).toBeInTheDocument();
  });

  it('renders switch thumb', () => {
    render(<Switch />);

    expect(screen.getByTestId('switch-thumb')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Switch className="custom-switch" />);

    const switchEl = screen.getByTestId('switch');
    expect(switchEl.className).toContain('custom-switch');
  });
});
