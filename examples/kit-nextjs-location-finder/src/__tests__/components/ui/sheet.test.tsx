import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

// Mock Radix UI Dialog (Sheet uses Dialog)
jest.mock('@radix-ui/react-dialog', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="sheet-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <button data-testid="sheet-trigger">{children as React.ReactNode}</button>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Overlay = React.forwardRef<HTMLDivElement, Record<string, unknown>>(({ ...props }, ref) => (
    <div ref={ref} data-testid="sheet-overlay" {...props} />
  ));
  Overlay.displayName = 'SheetOverlay';

  const Content = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="sheet-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'SheetContent';

  const Title = React.forwardRef<HTMLHeadingElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <h2 ref={ref} {...props}>
        {children}
      </h2>
    )
  );
  Title.displayName = 'SheetTitle';

  const Description = React.forwardRef<HTMLParagraphElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <p ref={ref} {...props}>
        {children}
      </p>
    )
  );
  Description.displayName = 'SheetDescription';

  const Close = ({ children }: React.PropsWithChildren) => (
    <button>{children as React.ReactNode}</button>
  );

  return {
    Root,
    Trigger,
    Portal,
    Overlay,
    Content,
    Title,
    Description,
    Close,
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  X: () => <span>×</span>,
}));

describe('Sheet', () => {
  it('renders sheet with trigger', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
      </Sheet>
    );

    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
  });

  it('renders sheet content', () => {
    render(
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetHeader>
      </SheetContent>
    );

    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    expect(screen.getByText(/sheet title/i)).toBeInTheDocument();
  });

  it('renders sheet with different sides', () => {
    const { rerender } = render(<SheetContent side="right">Right</SheetContent>);
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();

    rerender(<SheetContent side="left">Left</SheetContent>);
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
  });
});
