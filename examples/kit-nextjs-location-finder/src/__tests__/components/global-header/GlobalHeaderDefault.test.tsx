import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalHeaderDefault } from '@/components/global-header/GlobalHeaderDefault.dev';
import { mockGlobalHeaderProps } from './global-header.mock.props';

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({ field }: Record<string, unknown>) => {
    const linkField = field as { value?: { text?: string; href?: string } };
    return <a href={linkField?.value?.href}>{linkField?.value?.text}</a>;
  },
}));

// Mock UI components
jest.mock('@/components/ui/navigation-menu', () => ({
  NavigationMenu: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <nav className={className} data-testid="navigation-menu">
      {children}
    </nav>
  ),
  NavigationMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  NavigationMenuList: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <ul className={className}>{children}</ul>,
}));

jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, asChild, className }: Record<string, unknown>) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: `${className || ''} button-${variant} button-${size}`.trim(),
      });
    }
    return (
      <button className={`button-${variant} button-${size}` as string} data-testid="button">
        {children as React.ReactNode}
      </button>
    );
  },
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, alt, className }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={(image as { value?: { src?: string } })?.value?.src}
      alt={alt as string}
      className={className as string}
      data-testid="image-wrapper"
    />
  ),
}));

jest.mock('@/components/ui/animated-hover-nav', () => ({
  AnimatedHoverNav: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-hover-nav">{children}</div>
  ),
}));

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('react');
  const motion = {
    header: actual.forwardRef(
      (
        { children, className }: { children: React.ReactNode; className?: string },
        ref: React.Ref<HTMLElement>
      ) => (
        <header ref={ref} className={className}>
          {children}
        </header>
      )
    ),
    div: actual.forwardRef(
      (
        { children, className, onClick }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) => (
        <div
          ref={ref}
          className={className as string}
          onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
        >
          {children as React.ReactNode}
        </div>
      )
    ),
    nav: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  };
  return { motion, m: motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

jest.mock('lucide-react', () => ({
  Menu: () => <span data-testid="menu-icon">Menu</span>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@/hooks/use-match-media', () => ({
  useMatchMedia: jest.fn(() => false),
}));

describe('GlobalHeaderDefault Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<GlobalHeaderDefault {...mockGlobalHeaderProps} />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('displays logo and navigation menu', () => {
    render(<GlobalHeaderDefault {...mockGlobalHeaderProps} />);

    expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
    expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();
  });

  it('displays mobile menu trigger', () => {
    render(<GlobalHeaderDefault {...mockGlobalHeaderProps} />);

    expect(screen.getByTestId('sheet')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });
});
