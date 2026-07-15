/**
 * Unit tests for LinkList component
 * Tests basic rendering and parameter handling for all variants
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Default as LinkListDefault,
  AnchorNav,
  FooterLinks,
  HeaderPrimaryLinks,
  HeaderSecondaryLinks,
} from 'components/sxa/LinkList';
import {
  defaultLinkListProps,
  anchorNavLinkListProps,
  linkListPropsEmptyTitle,
  linkListPropsNoLinks,
  linkListPropsMinimal,
  linkListPropsNullFields,
} from './LinkList.mockProps';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock console.error to suppress React key warnings
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn((message, ...args) => {
    // Suppress React key warnings for components we can't modify
    if (
      typeof message === 'string' &&
      message.includes('Each child in a list should have a unique "key" prop')
    ) {
      return;
    }
    originalConsoleError(message, ...args);
  });
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock the Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({
    field,
    children,
    className,
    prefetch,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any;
    children?: React.ReactNode;
    className?: string;
    prefetch?: boolean;
  }) => {
    if (!field || !field.value) return React.createElement(React.Fragment, {}, children);
    return React.createElement(
      'a',
      {
        href: field.value.href,
        title: field.value.title,
        className,
        'data-prefetch': prefetch,
      },
      field.value.text || children
    );
  },
  Text: ({
    field,
    tag: Tag = 'span',
    className,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any;
    tag?: string;
    className?: string;
  }) => {
    if (!field) return React.createElement(Tag, { className }, '');
    return React.createElement(Tag, { className }, field.value || '');
  },
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
        isNormal: true,
        isPreview: false,
      },
      layout: {
        sitecore: {
          route: {
            fields: {},
          },
        },
      },
      locale: 'en',
    },
  }),
}));

describe('LinkList Component', () => {
  describe('Default Variant', () => {
    it('should render link list with proper structure', () => {
      const { container } = render(<LinkListDefault {...defaultLinkListProps} />);

      expect(container.querySelector('[data-class-change]')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('ul[aria-label="Navigation options"]')).toBeInTheDocument();
      expect(screen.getByText('Navigation Links')).toBeInTheDocument();
    });

    it('should render all links with correct classes', () => {
      const { container } = render(<LinkListDefault {...defaultLinkListProps} />);

      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveAttribute('href', '/');
      expect(links[1]).toHaveAttribute('href', '/about');
      expect(links[2]).toHaveAttribute('href', '/contact');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<LinkListDefault {...defaultLinkListProps} />);

      const component = container.querySelector('[data-class-change]');
      expect(component).toHaveAttribute('id', 'linklist-1');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<LinkListDefault {...defaultLinkListProps} />);

      const component = container.querySelector('[data-class-change]');
      expect(component).toHaveClass('linklist-styles');
    });

    it('should handle empty title gracefully', () => {
      const { container } = render(<LinkListDefault {...linkListPropsEmptyTitle} />);

      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('ul[aria-label="Navigation options"]')).toBeInTheDocument();
    });

    it('should handle no links gracefully', () => {
      const { container } = render(<LinkListDefault {...linkListPropsNoLinks} />);

      expect(container.querySelector('h3')).toBeInTheDocument();
      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(0);
    });

    it('should work with minimal parameters', () => {
      const { container } = render(<LinkListDefault {...linkListPropsMinimal} />);

      expect(container.querySelector('[data-class-change]')).toBeInTheDocument();
      const component = container.querySelector('[data-class-change]');
      expect(component).not.toHaveAttribute('id');
    });

    it('should handle null fields gracefully', () => {
      const { container } = render(<LinkListDefault {...linkListPropsNullFields} />);

      expect(container.querySelector('[data-class-change]')).toBeInTheDocument();
      expect(container.querySelector('h3')).toHaveTextContent('Link List');
    });
  });

  describe('AnchorNav Variant', () => {
    it('should render anchor navigation with proper structure', () => {
      const { container } = render(<AnchorNav {...anchorNavLinkListProps} />);

      expect(container.querySelector('.sticky')).toBeInTheDocument();
      expect(container.querySelector('.shadow-lg')).toBeInTheDocument();
      expect(container.querySelector('ul[aria-label="Navigation options"]')).toBeInTheDocument();
    });

    it('should render anchor links', () => {
      const { container } = render(<AnchorNav {...anchorNavLinkListProps} />);

      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '#section1');
      expect(links[1]).toHaveAttribute('href', '#section2');
    });

    it('should handle click events for smooth scrolling', () => {
      // Mock scrollIntoView
      const mockScrollIntoView = jest.fn();
      document.getElementById = jest.fn().mockReturnValue({
        scrollIntoView: mockScrollIntoView,
      });

      const { container } = render(<AnchorNav {...anchorNavLinkListProps} />);

      const link = container.querySelector('a[href="#section1"]');
      fireEvent.click(link!);

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });

  describe('FooterLinks Variant', () => {
    it('should render footer links with proper structure', () => {
      const { container } = render(<FooterLinks {...defaultLinkListProps} />);

      expect(container.querySelector('[data-class-change]')).toBeInTheDocument();
      expect(container.querySelector('.flex')).toBeInTheDocument();
    });

    it('should render links with separators', () => {
      const { container } = render(<FooterLinks {...defaultLinkListProps} />);

      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(3);
      // Check for separator spans
      const separators = container.querySelectorAll('span');
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe('HeaderPrimaryLinks Variant', () => {
    it('should render header primary links as list', () => {
      const { container } = render(<HeaderPrimaryLinks {...defaultLinkListProps} />);

      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelector('.flex')).toBeInTheDocument();
      expect(container.querySelector('.gap-4')).toBeInTheDocument();
    });

    it('should render links as list items', () => {
      const { container } = render(<HeaderPrimaryLinks {...defaultLinkListProps} />);

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(3);
    });
  });

  describe('HeaderSecondaryLinks Variant', () => {
    it('should render header secondary links with title', () => {
      const { container } = render(<HeaderSecondaryLinks {...defaultLinkListProps} />);

      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(screen.getByText('Navigation Links')).toBeInTheDocument();
    });

    it('should render links in list structure', () => {
      const { container } = render(<HeaderSecondaryLinks {...defaultLinkListProps} />);

      const ul = container.querySelector('ul');
      expect(ul).toBeInTheDocument();
      const links = ul!.querySelectorAll('a');
      expect(links).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<LinkListDefault {...defaultLinkListProps} />);

      const list = screen.getByRole('list', { name: 'Navigation options' });
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute('aria-label', 'Navigation options');
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<LinkListDefault {...defaultLinkListProps} />);

      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelector('li')).toBeInTheDocument();
    });
  });
});
