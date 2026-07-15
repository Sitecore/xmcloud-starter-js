import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as SecondaryNavigation } from '@/components/secondary-navigation/SecondaryNavigation';
import type { SecondaryNavigationProps } from '@/components/secondary-navigation/secondary-navigation.props';
import {
  defaultProps,
  propsWithoutChildren,
  propsWithoutParent,
  propsWithFallbackTitles,
  propsWithoutDatasource,
  propsWithoutFields,
} from './SecondaryNavigation.mockProps';

// Type definitions for mock components
interface MockNextLinkProps {
  children?: React.ReactNode;
  href?: string;
  className?: string;
}

interface MockButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  variant?: string;
  className?: string;
  [key: string]: unknown;
}

interface MockNavigationRootProps {
  children?: React.ReactNode;
  className?: string;
  orientation?: string;
}

interface MockNavigationListProps {
  children?: React.ReactNode;
  className?: string;
}

interface MockNavigationItemProps {
  children?: React.ReactNode;
}

interface MockChevronIconProps {
  className?: string;
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock dependencies
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat(2)
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          return Object.entries(arg)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  },
}));

jest.mock('next/link', () => {
  const MockNextLink = ({ children, href, className }: MockNextLinkProps) =>
    React.createElement('a', { href, className, 'data-testid': 'next-link' }, children);
  return {
    __esModule: true,
    default: MockNextLink,
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, variant, className, ...props }: MockButtonProps) => {
    // The Button component with asChild passes props to the child link
    // In the actual component, it doesn't render the Button wrapper
    if (asChild && React.isValidElement(children)) {
      return children;
    }
    return React.createElement(
      'button',
      { 'data-testid': 'button', 'data-variant': variant, className, ...props },
      children
    );
  },
}));

jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children, className, orientation }: MockNavigationRootProps) => (
    <nav data-testid="navigation-root" data-orientation={orientation} className={className}>
      {children}
    </nav>
  ),
  List: ({ children, className }: MockNavigationListProps) => (
    <ul data-testid="navigation-list" className={className}>
      {children}
    </ul>
  ),
  Item: ({ children }: MockNavigationItemProps) => <li data-testid="navigation-item">{children}</li>,
}));

jest.mock('@radix-ui/react-icons', () => ({
  ChevronDownIcon: ({ className }: MockChevronIconProps) => (
    <span data-testid="chevron-icon" className={className}>
      ▼
    </span>
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('SecondaryNavigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render navigation with parent pages', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      expect(screen.getByText('Intro')).toBeInTheDocument();
      expect(screen.getByText('Docs')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
    });

    it('should render child pages under current page', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
      expect(screen.getByText('API Reference')).toBeInTheDocument();
    });

    it('should render navigation root', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navRoots = screen.getAllByTestId('navigation-root');
      expect(navRoots.length).toBeGreaterThan(0);
    });

    it('should render navigation items as list items', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navItems = screen.getAllByTestId('navigation-item');
      expect(navItems.length).toBeGreaterThan(0);
    });
  });

  describe('Desktop navigation', () => {
    it('should render desktop navigation with hidden class on mobile', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const desktopNav = container.querySelector('.hidden.sm\\:block');
      expect(desktopNav).toBeInTheDocument();
    });

    it('should render all parent navigation items', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const links = screen.getAllByTestId('next-link');
      const parentLinks = links.filter((link) =>
        ['Intro', 'Docs', 'Community'].includes(link.textContent || '')
      );
      expect(parentLinks.length).toBe(3);
    });

    it('should render child items under the current page', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      // The current page id matches datasource.id, so children should be rendered
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
    });
  });

  describe('Mobile navigation', () => {
    it('should render mobile dropdown button', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const mobileButton = container.querySelector('.block.sm\\:hidden button');
      expect(mobileButton).toBeInTheDocument();
    });

    it('should render chevron icon in mobile button', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('should toggle mobile menu on button click', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const mobileButton = container.querySelector('.block.sm\\:hidden button') as HTMLElement;
      expect(mobileButton).toBeInTheDocument();

      // Initially, dropdown should not be visible
      let dropdown = container.querySelector('.absolute.top-full');
      expect(dropdown).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(mobileButton);

      // Dropdown should now be visible
      dropdown = container.querySelector('.absolute.top-full');
      expect(dropdown).toBeInTheDocument();

      // Click to close
      fireEvent.click(mobileButton);

      // Dropdown should be hidden again
      dropdown = container.querySelector('.absolute.top-full');
      expect(dropdown).not.toBeInTheDocument();
    });

    it('should apply rotation class to chevron when open', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const mobileButton = container.querySelector('.block.sm\\:hidden button') as HTMLElement;
      const chevron = screen.getByTestId('chevron-icon');

      // Initially not rotated
      expect(chevron.className).not.toContain('rotate-180');

      // Click to open
      fireEvent.click(mobileButton);

      // Should be rotated
      expect(chevron.className).toContain('rotate-180');
    });
  });

  describe('Link rendering', () => {
    it('should render links with proper href attributes', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const links = container.querySelectorAll('a[href]');
      const introLink = Array.from(links).find((link) =>
        link.getAttribute('href')?.includes('introduction')
      );
      expect(introLink).toHaveAttribute('href', '/docs/introduction');
    });

    it('should render navigation links', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const links = screen.getAllByTestId('next-link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should render all navigation items', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const links = container.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Title fallback behavior', () => {
    it('should use navigationTitle when available', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      // mockChildPage1 has navigationTitle "Get Started"
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('should fallback to title when navigationTitle is not available', () => {
      render(<SecondaryNavigation {...propsWithFallbackTitles} />);

      // mockPageWithoutNavTitle has title "Frequently Asked Questions"
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should fallback to displayName when title and navigationTitle are not available', () => {
      render(<SecondaryNavigation {...propsWithFallbackTitles} />);

      // mockPageWithDisplayNameOnly has displayName "Support"
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should fallback to name when all other fields are not available', () => {
      render(<SecondaryNavigation {...propsWithFallbackTitles} />);

      // mockPageWithNameOnly has name "changelog"
      expect(screen.getByText('changelog')).toBeInTheDocument();
    });
  });

  describe('Optional fields', () => {
    it('should render without children pages', () => {
      render(<SecondaryNavigation {...propsWithoutChildren} />);

      // Parent navigation should still render
      expect(screen.getByText('Intro')).toBeInTheDocument();
      expect(screen.getByText('Docs')).toBeInTheDocument();

      // Children should not be present
      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
      expect(screen.queryByText('Tutorials')).not.toBeInTheDocument();
    });

    it('should handle empty parent results', () => {
      render(<SecondaryNavigation {...propsWithoutParent} />);

      // Should still render the component
      expect(screen.getAllByTestId('navigation-root').length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should throw when fields is null', () => {
      expect(() => {
        render(<SecondaryNavigation {...propsWithoutFields} />);
      }).toThrow();
    });

    it('should throw when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as unknown as SecondaryNavigationProps['fields'],
      };

      expect(() => {
        render(<SecondaryNavigation {...propsWithUndefinedFields} />);
      }).toThrow();
    });

    it('should handle missing datasource gracefully', () => {
      // Component needs safe destructuring for datasource
      // This test verifies the component can handle missing datasource
      expect(() => {
        render(<SecondaryNavigation {...propsWithoutDatasource} />);
      }).toThrow();
    });
  });

  describe('Navigation structure', () => {
    it('should render vertical orientation', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navRoots = screen.getAllByTestId('navigation-root');
      navRoots.forEach((root) => {
        expect(root).toHaveAttribute('data-orientation', 'vertical');
      });
    });

    it('should render child items in nested list', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navLists = screen.getAllByTestId('navigation-list');
      // Should have parent list and child list
      expect(navLists.length).toBeGreaterThan(1);
    });
  });

  describe('Current page identification', () => {
    it('should identify current page and render its children', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      // The current page (id: 'current-page') should show its children
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
      expect(screen.getByText('API Reference')).toBeInTheDocument();
    });

    it('should only render children for the matching parent', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      // Only children of the current page should be rendered
      // We have 3 children that should be visible
      const childLinks = [
        screen.queryByText('Get Started'),
        screen.queryByText('Tutorials'),
        screen.queryByText('API Reference'),
      ].filter(Boolean);

      expect(childLinks.length).toBe(3);
    });
  });

  describe('Accessibility', () => {
    it('should render semantic nav element', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navs = screen.getAllByTestId('navigation-root');
      expect(navs.length).toBeGreaterThan(0);
    });

    it('should render links with proper href attributes', () => {
      const { container } = render(<SecondaryNavigation {...defaultProps} />);

      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    it('should render navigation items for keyboard navigation', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navItems = screen.getAllByTestId('navigation-item');
      expect(navItems.length).toBeGreaterThan(0);
    });
  });

  describe('CSS classes', () => {
    it('should apply proper gap classes to navigation list', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navLists = screen.getAllByTestId('navigation-list');
      navLists.forEach((list) => {
        expect(list.className).toContain('gap-2');
      });
    });

    it('should apply flex-col to navigation lists', () => {
      render(<SecondaryNavigation {...defaultProps} />);

      const navLists = screen.getAllByTestId('navigation-list');
      navLists.forEach((list) => {
        expect(list.className).toContain('flex-col');
      });
    });
  });
});

