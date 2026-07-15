import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Mock Radix UI DropdownMenu
jest.mock('@radix-ui/react-dropdown-menu', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <button data-testid="dropdown-trigger">{children as React.ReactNode}</button>
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
      <div ref={ref} data-testid="dropdown-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'DropdownMenuContent';

  const Item = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="dropdown-item" {...props}>
        {children}
      </div>
    )
  );
  Item.displayName = 'DropdownMenuItem';

  const Label = ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-label">{children as React.ReactNode}</div>
  );

  const Separator = React.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ ...props }, ref) => <div ref={ref} data-testid="dropdown-separator" {...props} />
  );
  Separator.displayName = 'DropdownMenuSeparator';

  const CheckboxItem = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const RadioGroup = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const RadioItem = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Sub = ({ children }: React.PropsWithChildren) => <div>{children as React.ReactNode}</div>;

  const SubTrigger = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const SubContent = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Group = ({ children }: React.PropsWithChildren) => <div>{children as React.ReactNode}</div>;

  const ItemIndicator = ({ children }: React.PropsWithChildren) => (
    <span>{children as React.ReactNode}</span>
  );

  return {
    Root,
    Trigger,
    Portal,
    Content,
    Item,
    Label,
    Separator,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Sub,
    SubTrigger,
    SubContent,
    Group,
    ItemIndicator,
  };
});

describe('DropdownMenu', () => {
  it('renders dropdown menu with trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
      </DropdownMenu>
    );

    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
  });

  it('renders dropdown menu content with items', () => {
    render(
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    );

    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  it('renders dropdown menu separator', () => {
    render(<DropdownMenuSeparator />);

    expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument();
  });
});
