import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as BreadcrumbsDefault } from '../../components/breadcrumbs/Breadcrumbs';
import {
  breadcrumbsPropsWithAncestors,
  breadcrumbsPropsWithLongName,
  breadcrumbsPropsNoAncestors,
  breadcrumbsPropsNoFields,
} from './Breadcrumbs.mockProps';

// Mock the UI breadcrumb components
jest.mock('../../components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="breadcrumb">{children}</nav>
  ),
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol data-testid="breadcrumb-list">{children}</ol>
  ),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="breadcrumb-item">{children}</li>
  ),
  BreadcrumbLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a data-testid="breadcrumb-link" href={href}>
      {children}
    </a>
  ),
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="breadcrumb-page">{children}</span>
  ),
  BreadcrumbSeparator: () => <span data-testid="breadcrumb-separator">/</span>,
}));

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">No data for {componentName}</div>
  ),
}));

describe('Breadcrumbs', () => {
  it('renders breadcrumbs with ancestors and current page', () => {
    render(<BreadcrumbsDefault {...breadcrumbsPropsWithAncestors} />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();

    // Check links
    const links = screen.getAllByTestId('breadcrumb-link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/products');

    // Check separators
    const separators = screen.getAllByTestId('breadcrumb-separator');
    expect(separators).toHaveLength(2);
  });

  it('truncates long page names correctly', () => {
    render(<BreadcrumbsDefault {...breadcrumbsPropsWithLongName} />);

    const currentPage = screen.getByTestId('breadcrumb-page');
    expect(currentPage).toBeInTheDocument();
    expect(currentPage.textContent).toContain('...');
    expect(currentPage.textContent?.length).toBeLessThanOrEqual(28); // 25 chars + '...'
  });

  it('renders only home link when there are no ancestors', () => {
    render(<BreadcrumbsDefault {...breadcrumbsPropsNoAncestors} />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();

    // When ancestors is empty array, component shows only home link
    const link = screen.getByTestId('breadcrumb-link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders NoDataFallback when fields are missing', () => {
    render(<BreadcrumbsDefault {...breadcrumbsPropsNoFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Breadcrumbs')).toBeInTheDocument();
  });
});
