import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

// Mock Button
jest.mock('@/components/ui/button', () => {
  const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
  >(({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children as React.ReactNode}
    </button>
  ));
  Button.displayName = 'Button';

  return {
    Button,
    buttonVariants: jest.fn(() => 'mocked-button-class'),
  };
});

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span>‹</span>,
  ChevronRight: () => <span>›</span>,
  MoreHorizontal: () => <span>...</span>,
}));

describe('Pagination', () => {
  it('renders pagination with items', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'pagination');
  });

  it('renders pagination previous button', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders pagination next button', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
