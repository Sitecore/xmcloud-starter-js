import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Mock Radix UI ToggleGroup
jest.mock('@radix-ui/react-toggle-group', () => {
  const Root = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="toggle-group" {...props}>
      {children as React.ReactNode}
    </div>
  );

  const Item = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<Record<string, unknown> & { value?: string }>
  >(({ children, value, ...props }, ref) => (
    <button ref={ref} data-testid={`toggle-item-${value}`} {...props}>
      {children as React.ReactNode}
    </button>
  ));
  Item.displayName = 'ToggleGroupItem';

  return {
    Root,
    Item,
  };
});

describe('ToggleGroup', () => {
  it('renders toggle group', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByTestId('toggle-group')).toBeInTheDocument();
  });

  it('renders toggle group items', () => {
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByTestId('toggle-item-bold')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-item-italic')).toBeInTheDocument();
  });

  it('renders toggle group with variant', () => {
    render(
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByTestId('toggle-group')).toBeInTheDocument();
  });
});
