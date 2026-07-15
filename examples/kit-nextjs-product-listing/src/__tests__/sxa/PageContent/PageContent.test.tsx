/**
 * Unit tests for PageContent component
 * Tests basic rendering and parameter handling for all variants
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as PageContentDefault, TitleAndBody } from 'components/sxa/PageContent';
import {
  defaultPageContentProps,
  pageContentPropsEmptyContent,
  pageContentPropsSimpleContent,
  pageContentPropsMinimal,
  mockSitecoreContextNormal,
} from './PageContent.mockProps';

// Mock the Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RichText: ({ field }: { field?: any }) => {
    if (!field || !field.value) return null;
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: field.value } });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Text: ({ field, tag: Tag = 'span' }: { field?: any; tag?: string }) => {
    if (!field || !field.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Link: ({ field, children }: { field?: any; children?: React.ReactNode }) => {
    if (!field || !field.value) return React.createElement(React.Fragment, {}, children);
    return React.createElement('a', { href: field.value.href }, children);
  },
  useSitecore: () => mockSitecoreContextNormal,
}));

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}));

describe('PageContent Component', () => {
  describe('Default Variant', () => {
    it('should render page content with proper structure', () => {
      const { container } = render(<PageContentDefault {...defaultPageContentProps} />);

      expect(container.querySelector('.component.content')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
      expect(container.querySelector('.field-content')).toBeInTheDocument();
    });

    it('should render rich text content', () => {
      const { container } = render(<PageContentDefault {...defaultPageContentProps} />);

      const contentDiv = container.querySelector('.field-content');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv?.innerHTML).toContain('<p>This is the main content');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<PageContentDefault {...defaultPageContentProps} />);

      const component = container.querySelector('.component.content');
      expect(component).toHaveAttribute('id', 'pagecontent-1');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<PageContentDefault {...defaultPageContentProps} />);

      const component = container.querySelector('.component.content');
      expect(component).toHaveClass('pagecontent-styles');
    });

    it('should handle empty content gracefully', () => {
      const { container } = render(<PageContentDefault {...pageContentPropsEmptyContent} />);

      expect(container.querySelector('.component.content')).toBeInTheDocument();
      expect(container.querySelector('.field-content')).toBeEmptyDOMElement();
    });

    it('should handle simple text content', () => {
      const { container } = render(<PageContentDefault {...pageContentPropsSimpleContent} />);

      const contentDiv = container.querySelector('.field-content');
      expect(contentDiv?.textContent).toBe('Simple text content without HTML.');
    });

    it('should work with minimal parameters', () => {
      const { container } = render(<PageContentDefault {...pageContentPropsMinimal} />);

      expect(container.querySelector('.component.content')).toBeInTheDocument();
      const component = container.querySelector('.component.content');
      expect(component).not.toHaveAttribute('id');
    });
  });

  describe('TitleAndBody Variant', () => {
    it('should render title and body with proper structure', () => {
      const { container } = render(<TitleAndBody {...defaultPageContentProps} />);

      expect(container.querySelector('.bg-brand-gray95')).toBeInTheDocument();
      expect(container.querySelector('.py-16')).toBeInTheDocument();
      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('should render title and content', () => {
      render(<TitleAndBody {...defaultPageContentProps} />);

      expect(screen.getByText('Welcome to Our Site')).toBeInTheDocument();
      // Check that rich text content is rendered
      expect(screen.getByText(/This is the main content/)).toBeInTheDocument();
    });

    it('should render call-to-action link', () => {
      const { container } = render(<TitleAndBody {...defaultPageContentProps} />);

      const link = container.querySelector('a[href="#components"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Explore Components');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<PageContentDefault {...defaultPageContentProps} />);

      expect(container.querySelector('.component')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
      expect(container.querySelector('.field-content')).toBeInTheDocument();
    });

    it('should render proper heading hierarchy in TitleAndBody', () => {
      const { container } = render(<TitleAndBody {...defaultPageContentProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('text-4xl', 'font-bold');
    });
  });
});
