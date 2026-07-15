import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const motion = {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <span {...props}>{children as React.ReactNode}</span>
    ),
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p {...props}>{children as React.ReactNode}</p>
    ),
  };
  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    useMotionValue: () => ({ get: () => 0, set: jest.fn() }),
    useSpring: () => ({ get: () => 0 }),
    useTransform: () => ({ get: () => 0 }),
  };
});

// Mock next/link
jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  Link.displayName = 'Link';
  return Link;
});

// Mock hooks
jest.mock('@/hooks/use-match-media', () => ({
  useMatchMedia: () => false,
}));

jest.mock('@/hooks/use-container-query', () => ({
  useContainerQuery: () => false,
}));

describe('AnimatedHoverNav', () => {
  const mockRef = { current: null };

  it('renders navigation with children', () => {
    render(
      <AnimatedHoverNav parentRef={mockRef}>
        <div data-testid="nav-item">Home</div>
        <div data-testid="nav-item">About</div>
      </AnimatedHoverNav>
    );

    const items = screen.getAllByTestId('nav-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
  });

  it('renders with horizontal orientation', () => {
    const { container } = render(
      <AnimatedHoverNav parentRef={mockRef} orientation="horizontal">
        <div>Content</div>
      </AnimatedHoverNav>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <AnimatedHoverNav parentRef={mockRef} indicatorClassName="custom-indicator">
        <div>Item</div>
      </AnimatedHoverNav>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText(/item/i)).toBeInTheDocument();
  });
});
