import React from 'react';
import { render, screen } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

// Mock Radix UI Collapsible
jest.mock('@radix-ui/react-collapsible', () => ({
  Root: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="collapsible-root" {...props}>
      {children}
    </div>
  ),
  CollapsibleTrigger: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button data-testid="collapsible-trigger" {...props}>
      {children}
    </button>
  ),
  CollapsibleContent: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="collapsible-content" {...props}>
      {children}
    </div>
  ),
}));

describe('Collapsible', () => {
  it('renders collapsible with trigger and content', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByTestId('collapsible-root')).toBeInTheDocument();
    expect(screen.getByTestId('collapsible-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('collapsible-content')).toBeInTheDocument();
  });

  it('renders collapsible trigger as button', () => {
    render(<CollapsibleTrigger>Show more</CollapsibleTrigger>);

    const trigger = screen.getByTestId('collapsible-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('renders collapsible content', () => {
    render(<CollapsibleContent>Expandable content here</CollapsibleContent>);

    expect(screen.getByText(/expandable content here/i)).toBeInTheDocument();
  });
});
