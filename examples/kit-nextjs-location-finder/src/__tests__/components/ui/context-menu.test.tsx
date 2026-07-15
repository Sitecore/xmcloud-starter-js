import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';

// Mock Radix UI ContextMenu
jest.mock('@radix-ui/react-context-menu', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="context-menu-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <div data-testid="context-menu-trigger">{children as React.ReactNode}</div>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Content = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="context-menu-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'ContextMenuContent';

  const Item = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="context-menu-item" {...props}>
        {children}
      </div>
    )
  );
  Item.displayName = 'ContextMenuItem';

  const CheckboxItem = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const RadioGroup = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const RadioItem = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Label = ({ children }: React.PropsWithChildren) => <div>{children as React.ReactNode}</div>;

  const Separator = React.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ ...props }, ref) => <div ref={ref} {...props} />
  );
  Separator.displayName = 'ContextMenuSeparator';

  const Sub = ({ children }: React.PropsWithChildren) => <div>{children as React.ReactNode}</div>;

  const SubTrigger = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const SubContent = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const ItemIndicator = ({ children }: React.PropsWithChildren) => (
    <span>{children as React.ReactNode}</span>
  );

  return {
    Root,
    Trigger,
    Portal,
    Content,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Label,
    Separator,
    Sub,
    SubTrigger,
    SubContent,
    ItemIndicator,
  };
});

describe('ContextMenu', () => {
  it('renders context menu with trigger', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
      </ContextMenu>
    );

    expect(screen.getByTestId('context-menu-trigger')).toBeInTheDocument();
  });

  it('renders context menu content', () => {
    render(
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    );

    expect(screen.getByTestId('context-menu-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('context-menu-item')).toHaveLength(2);
  });

  it('renders context menu items', () => {
    render(
      <ContextMenuContent>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    );

    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });
});
