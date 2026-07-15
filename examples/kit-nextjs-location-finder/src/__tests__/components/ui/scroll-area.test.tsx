import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock Radix UI ScrollArea
jest.mock('@radix-ui/react-scroll-area', () => {
  const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="scroll-area" {...props}>
        {children}
      </div>
    )
  );
  Root.displayName = 'ScrollAreaRoot';

  const Viewport = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="scroll-viewport" {...props}>
        {children}
      </div>
    )
  );
  Viewport.displayName = 'ScrollAreaViewport';

  const ScrollAreaScrollbar = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ orientation?: string }>
  >(({ children, orientation, ...props }, ref) => (
    <div ref={ref} data-testid={`scrollbar-${orientation}`} {...props}>
      {children}
    </div>
  ));
  ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

  const ScrollAreaThumb = React.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ ...props }, ref) => <div ref={ref} data-testid="scroll-thumb" {...props} />
  );
  ScrollAreaThumb.displayName = 'ScrollAreaThumb';

  const Corner = React.forwardRef<HTMLDivElement, Record<string, unknown>>(({ ...props }, ref) => (
    <div ref={ref} data-testid="scroll-corner" {...props} />
  ));
  Corner.displayName = 'ScrollAreaCorner';

  return {
    Root,
    Viewport,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    Corner,
  };
});

describe('ScrollArea', () => {
  it('renders scroll area', () => {
    render(<ScrollArea>Content</ScrollArea>);

    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
  });

  it('renders viewport with content', () => {
    render(<ScrollArea>Scrollable content here</ScrollArea>);

    expect(screen.getByTestId('scroll-viewport')).toBeInTheDocument();
    expect(screen.getByText(/scrollable content here/i)).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<ScrollArea className="custom-scroll">Content</ScrollArea>);

    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toBeInTheDocument();
  });
});
