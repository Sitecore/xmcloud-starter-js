import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import {
  defaultProps,
  propsWithLongName,
  propsWithoutAncestors,
  propsWithSingleAncestor,
  propsWithMixedTitles,
  propsEmptyAncestors,
  propsWithoutFields,
} from './Breadcrumbs.mockProps';

// Mock UI components
jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: { children?: React.ReactNode }) => <nav data-testid="breadcrumb">{children}</nav>,
  BreadcrumbList: ({ children }: { children?: React.ReactNode }) => <ol data-testid="breadcrumb-list">{children}</ol>,
  BreadcrumbItem: ({ children }: { children?: React.ReactNode }) => <li data-testid="breadcrumb-item">{children}</li>,
  BreadcrumbLink: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} data-testid="breadcrumb-link">
      {children}
    </a>
  ),
  BreadcrumbPage: ({ children }: { children?: React.ReactNode }) => <span data-testid="breadcrumb-page">{children}</span>,
  BreadcrumbSeparator: () => <span data-testid="breadcrumb-separator">/</span>,
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName?: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('Breadcrumbs Component', () => {
  describe('Basic rendering', () => {
    it('should render breadcrumb navigation', () => {
      render(<Breadcrumbs {...defaultProps} />);

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-list')).toBeInTheDocument();
    });

    it('should render all ancestor links', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const links = screen.getAllByTestId('breadcrumb-link');
      expect(links.length).toBe(3); // Home, Articles, Technology

      expect(links[0]).toHaveTextContent('Home');
      expect(links[0]).toHaveAttribute('href', '/');
      
      expect(links[1]).toHaveTextContent('Articles');
      expect(links[1]).toHaveAttribute('href', '/articles');
      
      expect(links[2]).toHaveTextContent('Tech');
      expect(links[2]).toHaveAttribute('href', '/articles/technology');
    });

    it('should render current page as breadcrumb page (not link)', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const currentPage = screen.getByTestId('breadcrumb-page');
      expect(currentPage).toBeInTheDocument();
      expect(currentPage).toHaveTextContent('Current Page Title');
    });

    it('should render separators between breadcrumb items', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const separators = screen.getAllByTestId('breadcrumb-separator');
      expect(separators.length).toBe(3); // Between 3 ancestors and current page
    });

    it('should render correct number of breadcrumb items', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items.length).toBe(4); // 3 ancestors + current page
    });
  });

  describe('Title handling', () => {
    it('should use navigationTitle when available', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const techLink = screen.getAllByTestId('breadcrumb-link')[2];
      expect(techLink).toHaveTextContent('Tech'); // navigationTitle
    });

    it('should fall back to title when navigationTitle is not available', () => {
      render(<Breadcrumbs {...propsWithMixedTitles} />);

      const links = screen.getAllByTestId('breadcrumb-link');
      const secondLink = links[1];
      expect(secondLink).toHaveTextContent('Page Without Nav Title'); // Falls back to title
    });

    it('should handle missing URL gracefully', () => {
      render(<Breadcrumbs {...propsWithMixedTitles} />);

      const links = screen.getAllByTestId('breadcrumb-link');
      const lastLink = links[2];
      expect(lastLink).toHaveAttribute('href', '');
    });
  });

  describe('Page name truncation', () => {
    it('should truncate long page names to 25 characters', () => {
      render(<Breadcrumbs {...propsWithLongName} />);

      const currentPage = screen.getByTestId('breadcrumb-page');
      expect(currentPage.textContent).toMatch(/\.\.\.$/); // Ends with ...
      expect(currentPage.textContent!.length).toBeLessThanOrEqual(28); // 25 chars + '...'
    });

    it('should not truncate short page names', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const currentPage = screen.getByTestId('breadcrumb-page');
      expect(currentPage).toHaveTextContent('Current Page Title');
      expect(currentPage.textContent).not.toMatch(/\.\.\.$/);
    });
  });

  describe('Edge cases', () => {
    it('should render home link when no ancestors', () => {
      render(<Breadcrumbs {...(propsWithoutAncestors as unknown as Parameters<typeof Breadcrumbs>[0])} />);

      const link = screen.getByTestId('breadcrumb-link');
      expect(link).toHaveTextContent('Home');
      expect(link).toHaveAttribute('href', '/');
    });

    it('should render with single ancestor', () => {
      render(<Breadcrumbs {...propsWithSingleAncestor} />);

      const links = screen.getAllByTestId('breadcrumb-link');
      expect(links.length).toBe(1);
      expect(links[0]).toHaveTextContent('Home');
    });

    it('should handle empty ancestors array', () => {
      render(<Breadcrumbs {...(propsEmptyAncestors as unknown as Parameters<typeof Breadcrumbs>[0])} />);

      // When ancestors array is empty (but defined), should show home link
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('should render NoDataFallback when fields is null', () => {
      render(<Breadcrumbs {...(propsWithoutFields as unknown as Parameters<typeof Breadcrumbs>[0])} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Breadcrumbs');
    });

    it('should handle missing datasource gracefully', () => {
      const propsWithoutDatasource = {
        params: {},
        fields: {
          data: {},
        },
        rendering: defaultProps.rendering,
        page: defaultProps.page,
      };

      render(<Breadcrumbs {...(propsWithoutDatasource as unknown as Parameters<typeof Breadcrumbs>[0])} />);

      // Should render home link fallback
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should render nav element', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const nav = screen.getByTestId('breadcrumb');
      expect(nav).toBeInTheDocument();
    });

    it('should render ordered list', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const list = screen.getByTestId('breadcrumb-list');
      expect(list).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic nav element', () => {
      render(<Breadcrumbs {...defaultProps} />);

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('should use semantic list structure', () => {
      render(<Breadcrumbs {...defaultProps} />);

      expect(screen.getByTestId('breadcrumb-list')).toBeInTheDocument();
      expect(screen.getAllByTestId('breadcrumb-item').length).toBeGreaterThan(0);
    });

    it('should render current page without link', () => {
      render(<Breadcrumbs {...defaultProps} />);

      const currentPage = screen.getByTestId('breadcrumb-page');
      expect(currentPage.tagName).not.toBe('A');
    });
  });
});

