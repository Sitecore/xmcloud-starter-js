import React from 'react';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Mock Radix UI AspectRatio
jest.mock('@radix-ui/react-aspect-ratio', () => ({
  Root: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="aspect-ratio" {...props}>
      {children}
    </div>
  ),
}));

describe('AspectRatio', () => {
  it('renders aspect ratio container', () => {
    render(
      <AspectRatio ratio={16 / 9}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/image.jpg" alt="Test" />
      </AspectRatio>
    );

    expect(screen.getByTestId('aspect-ratio')).toBeInTheDocument();
  });

  it('renders children inside aspect ratio', () => {
    render(
      <AspectRatio ratio={1}>
        <span>Content</span>
      </AspectRatio>
    );

    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('renders with different aspect ratios', () => {
    const { rerender } = render(<AspectRatio ratio={16 / 9}>16:9</AspectRatio>);
    expect(screen.getByTestId('aspect-ratio')).toBeInTheDocument();

    rerender(<AspectRatio ratio={4 / 3}>4:3</AspectRatio>);
    expect(screen.getByTestId('aspect-ratio')).toBeInTheDocument();
  });
});
