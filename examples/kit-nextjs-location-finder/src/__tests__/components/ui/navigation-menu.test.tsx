import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

// Mock Radix UI NavigationMenu
jest.mock('@radix-ui/react-navigation-menu', () => {
  const Root = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <nav data-testid="navigation-menu" {...props}>
      {children as React.ReactNode}
    </nav>
  );

  const List = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <ul data-testid="navigation-list" {...props}>
      {children as React.ReactNode}
    </ul>
  );

  const Item = ({ children }: React.PropsWithChildren) => (
    <li data-testid="navigation-item">{children as React.ReactNode}</li>
  );

  const Trigger = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <button ref={ref} data-testid="navigation-trigger" {...props}>
        {children}
      </button>
    )
  );
  Trigger.displayName = 'NavigationMenuTrigger';

  const Content = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="navigation-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'NavigationMenuContent';

  const Link = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <a ref={ref} data-testid="navigation-link" {...props}>
        {children}
      </a>
    )
  );
  Link.displayName = 'NavigationMenuLink';

  const Indicator = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Viewport = React.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ ...props }, ref) => <div ref={ref} data-testid="navigation-viewport" {...props} />
  );
  Viewport.displayName = 'NavigationMenuViewport';

  return {
    Root,
    List,
    Item,
    Trigger,
    Content,
    Link,
    Indicator,
    Viewport,
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronDown: () => <span>▼</span>,
}));

describe('NavigationMenu', () => {
  it('renders navigation menu', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    render(
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    );

    expect(screen.getAllByTestId('navigation-item')).toHaveLength(2);
  });

  it('renders navigation menu content', () => {
    render(
      <NavigationMenuItem>
        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/feature1">Feature 1</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );

    expect(screen.getByTestId('navigation-content')).toBeInTheDocument();
  });
});
