import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

// Mock Radix UI Tooltip
jest.mock('@radix-ui/react-tooltip', () => {
  const Provider = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="tooltip-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <button data-testid="tooltip-trigger">{children as React.ReactNode}</button>
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
      <div ref={ref} data-testid="tooltip-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'TooltipContent';

  return {
    Provider,
    Root,
    Trigger,
    Portal,
    Content,
  };
});

describe('Tooltip', () => {
  it('renders tooltip with trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
  });

  it('renders tooltip content', () => {
    render(<TooltipContent>Tooltip text</TooltipContent>);

    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    expect(screen.getByText(/tooltip text/i)).toBeInTheDocument();
  });

  it('renders tooltip provider', () => {
    render(
      <TooltipProvider>
        <span>Content</span>
      </TooltipProvider>
    );

    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });
});
