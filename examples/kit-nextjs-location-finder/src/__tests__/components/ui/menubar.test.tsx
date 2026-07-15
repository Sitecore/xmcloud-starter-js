import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';

// Mock Radix UI Menubar
jest.mock('@radix-ui/react-menubar', () => {
  const Root = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="menubar-root" {...props}>
      {children as React.ReactNode}
    </div>
  );

  const Menu = ({ children }: React.PropsWithChildren) => (
    <div data-testid="menubar-menu">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <button data-testid="menubar-trigger">{children as React.ReactNode}</button>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Content = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ sideOffset?: number; alignOffset?: number }>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ children, sideOffset, alignOffset, ...props }, ref) => (
      <div ref={ref} data-testid="menubar-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'MenubarContent';

  const Item = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="menubar-item" {...props}>
        {children}
      </div>
    )
  );
  Item.displayName = 'MenubarItem';

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
  Separator.displayName = 'MenubarSeparator';

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
    Menu,
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
    Group,
    ItemIndicator,
  };
});

describe('Menubar', () => {
  it('renders menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByTestId('menubar-root')).toBeInTheDocument();
  });

  it('renders menubar menu with trigger', () => {
    render(
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
      </MenubarMenu>
    );

    expect(screen.getByTestId('menubar-trigger')).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });

  it('renders menubar content with items', () => {
    render(
      <MenubarContent>
        <MenubarItem>New</MenubarItem>
        <MenubarItem>Open</MenubarItem>
      </MenubarContent>
    );

    expect(screen.getAllByTestId('menubar-item')).toHaveLength(2);
  });
});
