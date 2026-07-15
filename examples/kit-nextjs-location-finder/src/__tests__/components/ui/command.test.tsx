import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">🔍</span>,
}));

// Mock Dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: React.PropsWithChildren) => <div>{children as React.ReactNode}</div>,
  DialogContent: ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  ),
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock cmdk
jest.mock('cmdk', () => {
  const CommandRoot = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, ...props }, ref) => (
    <div ref={ref} data-testid="command" {...props}>
      {children as React.ReactNode}
    </div>
  ));
  CommandRoot.displayName = 'Command';

  const Input = React.forwardRef<HTMLInputElement, Record<string, unknown>>(({ ...props }, ref) => (
    <input ref={ref} data-testid="command-input" {...props} />
  ));
  Input.displayName = 'CommandInput';

  const List = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="command-list" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  List.displayName = 'CommandList';

  const Empty = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="command-empty" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Empty.displayName = 'CommandEmpty';

  const Group = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{ heading?: string }>>(
    ({ children, heading, ...props }, ref) => (
      <div ref={ref} data-testid="command-group" {...props}>
        {heading && <div>{heading}</div>}
        {children}
      </div>
    )
  );
  Group.displayName = 'CommandGroup';

  const Item = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="command-item" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Item.displayName = 'CommandItem';

  const Separator = React.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ ...props }, ref) => <div ref={ref} data-testid="command-separator" {...props} />
  );
  Separator.displayName = 'CommandSeparator';

  // Attach sub-components to the main Command
  Object.assign(CommandRoot, {
    Input,
    List,
    Empty,
    Group,
    Item,
    Separator,
  });

  return {
    Command: CommandRoot,
  };
});

describe('Command', () => {
  it('renders command component', () => {
    render(<Command />);

    expect(screen.getByTestId('command')).toBeInTheDocument();
  });

  it('renders command input', () => {
    render(<CommandInput placeholder="Search..." />);

    expect(screen.getByTestId('command-input')).toBeInTheDocument();
  });

  it('renders command list with items', () => {
    render(
      <CommandList>
        <CommandGroup>
          <CommandItem>Item 1</CommandItem>
          <CommandItem>Item 2</CommandItem>
        </CommandGroup>
      </CommandList>
    );

    expect(screen.getByTestId('command-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('command-item')).toHaveLength(2);
  });
});
