import React from 'react';
import { render, screen } from '@testing-library/react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock Radix UI Dialog
jest.mock('@radix-ui/react-dialog', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-root">{children as React.ReactNode}</div>
  );
  Root.displayName = 'Dialog';

  const Trigger = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
    ({ children }, ref) => (
      <button ref={ref} data-testid="dialog-trigger">
        {children}
      </button>
    )
  );
  Trigger.displayName = 'DialogTrigger';

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );
  Portal.displayName = 'DialogPortal';

  const Overlay = React.forwardRef<HTMLDivElement, Record<string, unknown>>(({ ...props }, ref) => (
    <div ref={ref} data-testid="dialog-overlay" {...props} />
  ));
  Overlay.displayName = 'DialogOverlay';

  const Content = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="dialog-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'DialogContent';

  const Title = React.forwardRef<HTMLHeadingElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <h2 ref={ref} data-testid="dialog-title" {...props}>
        {children}
      </h2>
    )
  );
  Title.displayName = 'DialogTitle';

  const Description = React.forwardRef<HTMLParagraphElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <p ref={ref} {...props}>
        {children}
      </p>
    )
  );
  Description.displayName = 'DialogDescription';

  const Close = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
    ({ children }, ref) => (
      <button ref={ref} data-testid="dialog-close">
        {children}
      </button>
    )
  );
  Close.displayName = 'DialogClose';

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

describe('Dialog', () => {
  it('renders dialog content with title', () => {
    render(
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
      </DialogContent>
    );

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Dialog Title');
  });
});
