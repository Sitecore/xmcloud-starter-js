/**
 * Unit tests for Navigation component
 * Tests Default, ButtonNavigation, and Header variants with various configurations
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Default as NavigationDefault, ButtonNavigation, Header } from 'components/sxa/Navigation';
import {
  defaultNavigationProps,
  navigationWithItemsProps,
  buttonNavigationProps,
  emptyNavigationProps,
  mockUseSitecore,
} from './Navigation.mockProps';

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

// Mock the Sitecore Content SDK components and Next.js Link
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({ field, children, editable, onClick, prefetch, className }: any) => {
    if (!field?.value?.href) return null;
    return (
      <a
        href={field.value.href}
        title={field.value.title}
        className={className}
        onClick={onClick}
        data-editable={editable}
        data-prefetch={prefetch}
      >
        {children}
      </a>
    );
  },
  Text: ({ field }: any) => {
    if (!field || typeof field.value !== 'string' || field.value.trim() === '') return null;
    return <span>{field.value}</span>;
  },
  useSitecore: () => mockUseSitecore,
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

jest.mock('lucide-react', () => ({
  ArrowRight: ({ size }: any) => <svg data-size={size} className="arrow-right" />,
}));
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Navigation Component - Default Variant', () => {
  describe('Basic Rendering', () => {
    it('should render navigation with base classes', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const nav = container.querySelector('.component.navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const nav = container.querySelector('.navigation');
      expect(nav).toHaveClass('custom-nav-style');
    });

    it('should apply GridParameters from params', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const nav = container.querySelector('.navigation');
      expect(nav).toHaveClass('col-12');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const nav = container.querySelector('#navigation-1');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render placeholder when fields are empty', () => {
      const { container } = render(<NavigationDefault {...(emptyNavigationProps as any)} />);

      expect(container.querySelector('.component-content')).toHaveTextContent('[Navigation]');
    });

    it('should render placeholder with proper styling', () => {
      const { container } = render(<NavigationDefault {...(emptyNavigationProps as any)} />);

      const nav = container.querySelector('.component.navigation');
      expect(nav).toBeInTheDocument();
      expect(nav?.id).toBe('empty-nav');
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu toggle', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const label = container.querySelector('.menu-mobile-navigate-wrapper');
      const input = container.querySelector('.menu-mobile-navigate');
      const hamburger = container.querySelector('.menu-humburger');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(hamburger).toBeInTheDocument();
    });

    it('should toggle menu state on checkbox change', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const checkbox = container.querySelector('.menu-mobile-navigate') as HTMLInputElement;
      expect(checkbox?.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox?.checked).toBe(true);
    });

    it('should render nav element with ul', () => {
      const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

      const nav = container.querySelector('nav');
      const ul = container.querySelector('ul.clearfix');

      expect(nav).toBeInTheDocument();
      expect(ul).toBeInTheDocument();
    });
  });

  describe('Navigation Items', () => {
    it('should render navigation items when provided', () => {
      // Create props with navigation items
      const propsWithItems = {
        ...navigationWithItemsProps,
        fields: {
          ...navigationWithItemsProps.fields,
          item1: {
            Id: 'item1',
            DisplayName: 'Home',
            Title: { value: 'Home Page' },
            NavigationTitle: { value: 'Welcome' },
            Href: '/',
            Querystring: '',
            Children: [],
            Styles: ['nav-item'],
          },
        },
      };

      const { container } = render(<NavigationDefault {...(propsWithItems as any)} />);

      const navItems = container.querySelectorAll('li');
      expect(navItems.length).toBeGreaterThan(0);
    });
  });
});

describe('Navigation Component - ButtonNavigation Variant', () => {
  describe('Basic Rendering', () => {
    it('should render section with proper classes', () => {
      const { container } = render(<ButtonNavigation {...(buttonNavigationProps as any)} />);

      const section = container.querySelector('section.py-16');
      expect(section).toBeInTheDocument();
    });

    it('should render container with proper classes', () => {
      const { container } = render(<ButtonNavigation {...(buttonNavigationProps as any)} />);

      const containerDiv = container.querySelector('.container.mx-auto');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should render heading', () => {
      const { container } = render(<ButtonNavigation {...(buttonNavigationProps as any)} />);

      const heading = container.querySelector('h3');
      expect(heading).toHaveTextContent('Component Categories');
      expect(heading).toHaveClass(
        'text-3xl',
        'font-bold',
        'text-brand-black',
        'mb-8',
        'text-center'
      );
    });

    it('should render grid layout', () => {
      const { container } = render(<ButtonNavigation {...(buttonNavigationProps as any)} />);

      const grid = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6'
      );
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Navigation Items', () => {
    it('should render navigation items as cards', () => {
      const propsWithItems = {
        ...buttonNavigationProps,
        fields: {
          ...buttonNavigationProps.fields,
          item1: {
            Id: 'item1',
            DisplayName: 'Components',
            Title: { value: 'UI Components' },
            NavigationTitle: { value: 'Components' },
            Href: '/components',
            Querystring: '',
            Children: [],
            Styles: [],
          },
        },
      };

      const { container } = render(<ButtonNavigation {...(propsWithItems as any)} />);

      const cards = container.querySelectorAll('.bg-white.p-6.rounded-lg.shadow-md');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should render card content with title and description', () => {
      const propsWithItems = {
        ...buttonNavigationProps,
        fields: {
          ...buttonNavigationProps.fields,
          item1: {
            Id: 'item1',
            DisplayName: 'Components',
            Title: { value: 'UI Components' },
            NavigationTitle: { value: 'Components' },
            Href: '/components',
            Querystring: '',
            Children: [],
            Styles: [],
          },
        },
      };

      const { container } = render(<ButtonNavigation {...(propsWithItems as any)} />);

      const cardTitle = container.querySelector('h4');
      expect(cardTitle).toHaveTextContent('Components');
      expect(cardTitle).toHaveClass('text-xl', 'font-semibold', 'text-brand-sky');

      const description = container.querySelector('p');
      expect(description).toHaveTextContent('Explore Components components');
    });

    it('should render arrow icon', () => {
      const propsWithItems = {
        ...buttonNavigationProps,
        fields: {
          ...buttonNavigationProps.fields,
          item1: {
            Id: 'item1',
            DisplayName: 'Components',
            Title: { value: 'UI Components' },
            NavigationTitle: { value: 'Components' },
            Href: '/components',
            Querystring: '',
            Children: [],
            Styles: [],
          },
        },
      };

      const { container } = render(<ButtonNavigation {...(propsWithItems as any)} />);

      const arrow = container.querySelector('.arrow-right');
      expect(arrow).toBeInTheDocument();
      expect(arrow).toHaveAttribute('data-size', '20');
    });
  });
});

describe('Navigation Component - Header Variant', () => {
  it('should render header with title and navigation', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('.container.mx-auto.flex.justify-between.items-center');
    expect(header).toBeInTheDocument();
  });

  it('should render title', () => {
    const { container } = render(<Header />);

    const title = container.querySelector('h1');
    expect(title).toHaveTextContent('Component Library');
    expect(title).toHaveClass('text-2xl', 'font-bold');
  });

  it('should render navigation links', () => {
    const { container } = render(<Header />);

    const nav = container.querySelector('nav');
    const links = container.querySelectorAll('a');

    expect(nav).toBeInTheDocument();
    expect(links.length).toBe(3); // Home, Documentation, About
  });

  it('should render correct link texts', () => {
    const { container } = render(<Header />);

    expect(container).toHaveTextContent('Home');
    expect(container).toHaveTextContent('Documentation');
    expect(container).toHaveTextContent('About');
  });

  it('should render links with hover classes', () => {
    const { container } = render(<Header />);

    const links = container.querySelectorAll('a.hover\\:text-\\[\\#71B5F0\\]');
    expect(links.length).toBe(3);
  });
});

describe('Navigation Component - Accessibility', () => {
  it('should have proper semantic structure (Default)', () => {
    const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

    const nav = container.querySelector('nav');
    const ul = container.querySelector('ul');

    expect(nav).toBeInTheDocument();
    expect(ul).toBeInTheDocument();
  });

  it('should have proper semantic structure (Header)', () => {
    const { container } = render(<Header />);

    const nav = container.querySelector('nav');
    const ul = container.querySelector('ul');

    expect(nav).toBeInTheDocument();
    expect(ul).toBeInTheDocument();
  });

  it('should have tabIndex on navigation items', () => {
    const { container } = render(<NavigationDefault {...(defaultNavigationProps as any)} />);

    const li = container.querySelector('li');
    expect(li).toHaveAttribute('tabindex', '0');
  });
});
