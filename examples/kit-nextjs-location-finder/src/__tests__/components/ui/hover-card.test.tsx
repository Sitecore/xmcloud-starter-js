import React from 'react';
import { render, screen } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

// Mock Radix UI HoverCard
jest.mock('@radix-ui/react-hover-card', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="hover-card-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <span data-testid="hover-card-trigger">{children as React.ReactNode}</span>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Content = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{
      sideOffset?: number;
      align?: string;
      alignOffset?: number;
      side?: string;
      [key: string]: unknown;
    }>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ children, sideOffset, align, alignOffset, side, ...props }, ref) => (
      <div ref={ref} data-testid="hover-card-content" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Content.displayName = 'HoverCardContent';

  return {
    Root,
    Trigger,
    Portal,
    Content,
  };
});

describe('HoverCard', () => {
  it('renders hover card with trigger', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
      </HoverCard>
    );

    expect(screen.getByTestId('hover-card-trigger')).toBeInTheDocument();
  });

  it('renders hover card content', () => {
    render(<HoverCardContent>Card details</HoverCardContent>);

    expect(screen.getByTestId('hover-card-content')).toBeInTheDocument();
    expect(screen.getByText(/card details/i)).toBeInTheDocument();
  });

  it('renders hover card with trigger and content', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>@username</HoverCardTrigger>
        <HoverCardContent>User profile</HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText(/@username/i)).toBeInTheDocument();
  });
});
