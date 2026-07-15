import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

// Mock Radix UI Separator
jest.mock('@radix-ui/react-separator', () => ({
  Root: ({
    orientation,
    decorative,
    className,
  }: {
    orientation?: string;
    decorative?: boolean;
    className?: string;
  }) => (
    <div
      data-testid="separator"
      data-orientation={orientation}
      aria-hidden={decorative}
      className={className}
    />
  ),
}));

describe('Separator', () => {
  it('renders separator with default horizontal orientation', () => {
    render(<Separator />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders separator with vertical orientation', () => {
    render(<Separator orientation="vertical" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('applies custom className', () => {
    render(<Separator className="custom-separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator.className).toContain('custom-separator');
  });
});
