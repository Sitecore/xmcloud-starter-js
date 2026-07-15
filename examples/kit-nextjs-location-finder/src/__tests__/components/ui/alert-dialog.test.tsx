import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

// Mock button variants
jest.mock('@/components/ui/button', () => ({
  buttonVariants: jest.fn(() => 'mocked-button-class'),
}));

// Mock Radix UI AlertDialog with complete structure
jest.mock('@radix-ui/react-alert-dialog', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="alert-dialog-root">{children}</div>
  );
  Root.displayName = 'AlertDialog';

  const Trigger = React.forwardRef(
    ({ children }: React.PropsWithChildren, ref: React.Ref<HTMLButtonElement>) => (
      <button ref={ref} data-testid="alert-dialog-trigger">
        {children}
      </button>
    )
  );
  Trigger.displayName = 'AlertDialogTrigger';

  const Portal = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  Portal.displayName = 'AlertDialogPortal';

  const Overlay = React.forwardRef(
    ({ ...props }: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} data-testid="alert-dialog-overlay" {...props} />
    )
  );
  Overlay.displayName = 'AlertDialogOverlay';

  const Content = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div ref={ref} data-testid="alert-dialog-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'AlertDialogContent';

  const Title = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLHeadingElement>
    ) => (
      <h2 ref={ref} {...props}>
        {children}
      </h2>
    )
  );
  Title.displayName = 'AlertDialogTitle';

  const Description = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLParagraphElement>
    ) => (
      <p ref={ref} {...props}>
        {children}
      </p>
    )
  );
  Description.displayName = 'AlertDialogDescription';

  const Action = React.forwardRef(
    ({ children }: React.PropsWithChildren, ref: React.Ref<HTMLButtonElement>) => (
      <button ref={ref} data-testid="alert-dialog-action">
        {children}
      </button>
    )
  );
  Action.displayName = 'AlertDialogAction';

  const Cancel = React.forwardRef(
    ({ children }: React.PropsWithChildren, ref: React.Ref<HTMLButtonElement>) => (
      <button ref={ref} data-testid="alert-dialog-cancel">
        {children}
      </button>
    )
  );
  Cancel.displayName = 'AlertDialogCancel';

  return {
    Root,
    Trigger,
    Portal,
    Overlay,
    Content,
    Title,
    Description,
    Action,
    Cancel,
  };
});

describe('AlertDialog', () => {
  it('renders alert dialog with trigger', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
      </AlertDialog>
    );

    expect(screen.getByTestId('alert-dialog-trigger')).toBeInTheDocument();
  });

  it('renders alert dialog content with title and description', () => {
    render(
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    );

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
  });

  it('renders alert dialog footer with actions', () => {
    render(
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    );

    expect(screen.getByTestId('alert-dialog-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('alert-dialog-action')).toBeInTheDocument();
  });
});
