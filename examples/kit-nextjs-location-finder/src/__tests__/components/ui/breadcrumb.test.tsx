import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

describe('Breadcrumb', () => {
  it('renders breadcrumb navigation', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/current/i)).toBeInTheDocument();
  });

  it('renders breadcrumb links', () => {
    render(<BreadcrumbLink href="/products">Products</BreadcrumbLink>);

    const link = screen.getByText(/products/i);
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('renders breadcrumb page as span', () => {
    render(<BreadcrumbPage>Current Page</BreadcrumbPage>);

    const page = screen.getByText(/current page/i);
    expect(page).toBeInTheDocument();
    expect(page.tagName).toBe('SPAN');
  });
});
