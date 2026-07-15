import React from 'react';
import { render } from '@testing-library/react';
import { Toaster } from '@/components/ui/sonner';

// Mock sonner
jest.mock('sonner', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Toaster: ({ toastOptions, ...props }: Record<string, unknown>) => (
    <div data-testid="sonner-toaster" {...props} />
  ),
}));

describe('Sonner', () => {
  it('renders sonner toaster', () => {
    const { container } = render(<Toaster />);

    expect(container.querySelector('[data-testid="sonner-toaster"]')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(<Toaster position="top-right" />);

    expect(container.querySelector('[data-testid="sonner-toaster"]')).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });
});
