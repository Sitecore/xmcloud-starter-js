import React from 'react';
import { render, screen } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// Mock Radix UI Popover
jest.mock('@radix-ui/react-popover', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="popover-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <button data-testid="popover-trigger">{children as React.ReactNode}</button>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Content = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ sideOffset?: number }>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ children, sideOffset, ...props }, ref) => (
      <div ref={ref} data-testid="popover-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'PopoverContent';

  return {
    Root,
    Trigger,
    Portal,
    Content,
  };
});

describe('Popover', () => {
  it('renders popover with trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
      </Popover>
    );

    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
  });

  it('renders popover content', () => {
    render(<PopoverContent>Popover content</PopoverContent>);

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    expect(screen.getByText(/popover content/i)).toBeInTheDocument();
  });

  it('renders popover with trigger and content', () => {
    render(
      <Popover>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent>Details</PopoverContent>
      </Popover>
    );

    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });
});
