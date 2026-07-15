import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from '@/components/ui/toast';

// Mock Radix UI Toast
jest.mock('@radix-ui/react-toast', () => {
  const Provider = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Root = React.forwardRef<HTMLLIElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <li ref={ref} data-testid="toast" {...props}>
        {children}
      </li>
    )
  );
  Root.displayName = 'ToastRoot';

  const Title = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="toast-title" {...props}>
        {children}
      </div>
    )
  );
  Title.displayName = 'ToastTitle';

  const Description = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="toast-description" {...props}>
        {children}
      </div>
    )
  );
  Description.displayName = 'ToastDescription';

  const Action = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<{ altText?: string }>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ children, altText, ...props }, ref) => (
      <button ref={ref} data-testid="toast-action" {...props}>
        {children}
      </button>
    )
  );
  Action.displayName = 'ToastAction';

  const Close = ({ children }: React.PropsWithChildren) => (
    <button data-testid="toast-close">{children as React.ReactNode}</button>
  );

  const Viewport = React.forwardRef<HTMLOListElement, Record<string, unknown>>(
    ({ ...props }, ref) => <ol ref={ref} data-testid="toast-viewport" {...props} />
  );
  Viewport.displayName = 'ToastViewport';

  return {
    Provider,
    Root,
    Title,
    Description,
    Action,
    Close,
    Viewport,
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  X: () => <span>×</span>,
}));

describe('Toast', () => {
  it('renders toast with title and description', () => {
    render(
      <Toast>
        <ToastTitle>Success</ToastTitle>
        <ToastDescription>Your changes have been saved.</ToastDescription>
      </Toast>
    );

    expect(screen.getByTestId('toast-title')).toBeInTheDocument();
    expect(screen.getByTestId('toast-description')).toBeInTheDocument();
  });

  it('renders toast action button', () => {
    render(<ToastAction altText="Undo">Undo</ToastAction>);

    expect(screen.getByTestId('toast-action')).toBeInTheDocument();
  });

  it('renders toast close button', () => {
    render(<ToastClose />);

    expect(screen.getByTestId('toast-close')).toBeInTheDocument();
  });
});
