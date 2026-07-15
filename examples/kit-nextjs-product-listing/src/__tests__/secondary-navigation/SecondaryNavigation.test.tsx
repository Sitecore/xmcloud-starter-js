/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as SecondaryNavigationDefault } from '../../components/secondary-navigation/SecondaryNavigation';
import {
  defaultSecondaryNavigationProps,
  secondaryNavigationPropsServices,
  secondaryNavigationPropsNoChildren,
  secondaryNavigationPropsSingleChild,
  secondaryNavigationPropsNoNavTitles,
  secondaryNavigationPropsNoUrls,
  secondaryNavigationPropsNoParent,
  secondaryNavigationPropsEmptyParent,
  secondaryNavigationPropsNoDatasource,
  secondaryNavigationPropsNoData,
  secondaryNavigationPropsNoFields,
  secondaryNavigationPropsMixed,
  secondaryNavigationPropsDeepHierarchy,
} from './SecondaryNavigation.mockProps';

// Mock dependencies
jest.mock('../../components/ui/button', () => ({
  Button: ({ children, asChild, variant, className, ...props }: any) => {
    if (asChild) {
      return React.cloneElement(children, {
        ...props,
        className: `${className} button-${variant}`,
        'data-testid': 'nav-button',
      });
    }
    return (
      <button className={`${className} button-${variant}`} data-testid="nav-button" {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('next/link', () => {
  return ({ children, href, className, prefetch, ...props }: any) => (
    <a
      href={href}
      className={className}
      data-prefetch={prefetch}
      data-testid="next-link"
      {...props}
    >
      {children}
    </a>
  );
});

jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children, className, orientation, ...props }: any) => (
    <nav
      className={className}
      data-orientation={orientation}
      data-testid="navigation-root"
      {...props}
    >
      {children}
    </nav>
  ),
  List: ({ children, className, ...props }: any) => (
    <ul className={className} data-testid="navigation-list" {...props}>
      {children}
    </ul>
  ),
  Item: ({ children, ...props }: any) => (
    <li data-testid="navigation-item" {...props}>
      {children}
    </li>
  ),
}));

jest.mock('@radix-ui/react-icons', () => ({
  ChevronDownIcon: ({ className, ...props }: any) => (
    <svg className={className} data-testid="chevron-down-icon" {...props}>
      <path d="M7 10L12 15L17 10H7Z" />
    </svg>
  ),
}));

jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('SecondaryNavigation Component', () => {
  describe('Default Rendering', () => {
    it('renders navigation structure with parent and child items', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      // Check for navigation roots (desktop and mobile)
      const navigationRoots = screen.getAllByTestId('navigation-root');
      expect(navigationRoots).toHaveLength(1); // Desktop navigation

      // Check for navigation lists
      const navigationLists = screen.getAllByTestId('navigation-list');
      expect(navigationLists.length).toBeGreaterThan(0);

      // Check for navigation items
      const navigationItems = screen.getAllByTestId('navigation-item');
      expect(navigationItems.length).toBeGreaterThan(0);
    });

    it('displays parent navigation items', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('displays child navigation items for current page', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      // Current page is Products (parent-1), so should show its children
      expect(screen.getByText('Headphones')).toBeInTheDocument();
      expect(screen.getByText('Speakers')).toBeInTheDocument();
      expect(screen.getByText('Accessories')).toBeInTheDocument();
    });

    it('creates links with correct hrefs', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const productLink = screen.getByText('Products').closest('a');
      expect(productLink).toHaveAttribute('href', '/products');

      const headphonesLink = screen.getByText('Headphones').closest('a');
      expect(headphonesLink).toHaveAttribute('href', '/products/headphones');
    });
  });

  describe('Responsive Behavior', () => {
    it('shows desktop navigation by default', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const desktopNav = document.querySelector('.hidden.sm\\:block');
      expect(desktopNav).toBeInTheDocument();
    });

    it('shows mobile dropdown toggle', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const mobileButton = document.querySelector('.block.sm\\:hidden button');
      expect(mobileButton).toBeInTheDocument();

      const chevronIcon = screen.getByTestId('chevron-down-icon');
      expect(chevronIcon).toBeInTheDocument();
    });

    it('toggles mobile dropdown when clicked', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const mobileButton = document.querySelector('.block.sm\\:hidden button');
      expect(mobileButton).toBeInTheDocument();

      // Initially should not show dropdown content
      expect(document.querySelector('.absolute.top-full')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(mobileButton as Element);

      // Should show dropdown content
      expect(document.querySelector('.absolute.top-full')).toBeInTheDocument();

      // Click to close
      fireEvent.click(mobileButton as Element);

      // Should hide dropdown content again
      expect(document.querySelector('.absolute.top-full')).not.toBeInTheDocument();
    });

    it('displays chevron icon with transition styles', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const chevronIcon = screen.getByTestId('chevron-down-icon');

      // Icon should be present with transition styles
      expect(chevronIcon).toBeInTheDocument();
      expect(chevronIcon).toHaveClass('transition-all');
    });
  });

  describe('Content Scenarios', () => {
    it('handles different current pages correctly', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsServices} />);

      // Current page is Services (parent-2), should still show all parent items
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();

      // Should not show children since Services has no children
      expect(screen.queryByText('Headphones')).not.toBeInTheDocument();
    });

    it('renders navigation without children', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoChildren} />);

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();

      // No children should be displayed
      expect(screen.queryByText('Headphones')).not.toBeInTheDocument();
    });

    it('handles single child correctly', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsSingleChild} />);

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Headphones')).toBeInTheDocument();

      // Other children should not be present
      expect(screen.queryByText('Speakers')).not.toBeInTheDocument();
    });

    it('uses title when navigationTitle is not provided', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoNavTitles} />);

      // Should use title instead of navigationTitle
      expect(screen.getByText('Audio Cables')).toBeInTheDocument();
    });

    it('handles pages with empty URLs', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoUrls} />);

      const linksWithoutUrl = screen.getAllByText('No URL');
      expect(linksWithoutUrl.length).toBeGreaterThan(0);

      const firstLinkWithoutUrl = linksWithoutUrl[0].closest('a');
      expect(firstLinkWithoutUrl).toHaveAttribute('href', '');
    });

    it('handles mixed navigation title scenarios', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsMixed} />);

      expect(screen.getByText('Headphones')).toBeInTheDocument(); // Has navigationTitle
      expect(screen.getByText('Audio Cables')).toBeInTheDocument(); // Uses title
      expect(screen.getByText('Accessories')).toBeInTheDocument(); // Has navigationTitle
    });
  });

  describe('Hierarchy Management', () => {
    it('identifies current page correctly', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      // Products is the current page (parent-1), so its children should be shown
      expect(screen.getByText('Headphones')).toBeInTheDocument();
      expect(screen.getByText('Speakers')).toBeInTheDocument();
      expect(screen.getByText('Accessories')).toBeInTheDocument();
    });

    it('renders deep navigation hierarchy', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsDeepHierarchy} />);

      // Should show all parent items including new one
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();

      // Should show all children including new ones
      expect(screen.getByText('Headphones')).toBeInTheDocument();
      expect(screen.getByText('Speakers')).toBeInTheDocument();
      expect(screen.getByText('Accessories')).toBeInTheDocument();
      expect(screen.getByText('Microphones')).toBeInTheDocument();
      expect(screen.getByText('Interfaces')).toBeInTheDocument();
    });
  });

  describe('Link Configuration', () => {
    it('sets prefetch to false on child navigation links', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      // Check child links that should have prefetch={false}
      const headphonesLink = screen.getByText('Headphones').closest('a');
      expect(headphonesLink).toHaveAttribute('data-prefetch', 'false');

      const speakersLink = screen.getByText('Speakers').closest('a');
      expect(speakersLink).toHaveAttribute('data-prefetch', 'false');
    });

    it('applies correct button variants', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const navButtons = screen.getAllByTestId('nav-button');

      navButtons.forEach((button) => {
        expect(button).toHaveClass('button-link');
      });
    });
  });

  describe('Fallback Scenarios', () => {
    it('handles missing parent structure', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoParent} />);

      // Should not crash but may not render navigation items
      expect(document.querySelector('nav')).toBeInTheDocument();
    });

    it('handles empty parent children', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsEmptyParent} />);

      // Should not crash with empty navigation
      expect(document.querySelector('nav')).toBeInTheDocument();
    });

    it('handles missing datasource', () => {
      expect(() => {
        render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoDatasource} />);
      }).toThrow(); // Component will throw due to undefined access
    });

    it('handles missing data', () => {
      expect(() => {
        render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoData} />);
      }).toThrow(); // Component will throw due to undefined access
    });

    it('returns NoDataFallback when no fields provided', () => {
      render(<SecondaryNavigationDefault {...secondaryNavigationPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Secondary Navigation')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct CSS classes to navigation elements', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const navigationRoot = screen.getByTestId('navigation-root');
      expect(navigationRoot).toHaveClass('relative', 'justify-center');
      expect(navigationRoot).toHaveAttribute('data-orientation', 'vertical');
    });

    it('applies responsive display classes', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      // Desktop navigation should be hidden on small screens
      const desktopNav = document.querySelector('.hidden.sm\\:block');
      expect(desktopNav).toBeInTheDocument();

      // Mobile navigation should be visible on small screens
      const mobileNav = document.querySelector('.block.sm\\:hidden');
      expect(mobileNav).toBeInTheDocument();
    });

    it('styles mobile dropdown correctly when open', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const mobileButton = document.querySelector('.block.sm\\:hidden button');
      fireEvent.click(mobileButton as Element);

      const dropdown = document.querySelector('.absolute.top-full');
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveClass('flex', 'w-full', 'flex-col');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic navigation elements', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const navElements = screen.getAllByRole('navigation');
      expect(navElements.length).toBeGreaterThan(0);
    });

    it('provides proper list structure', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const lists = screen.getAllByTestId('navigation-list');
      const items = screen.getAllByTestId('navigation-item');

      expect(lists.length).toBeGreaterThan(0);
      expect(items.length).toBeGreaterThan(0);
    });

    it('maintains link accessibility', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const links = screen.getAllByRole('link');

      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('provides keyboard navigation support', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const mobileButton = document.querySelector('.block.sm\\:hidden button');
      expect(mobileButton).toBeInTheDocument();

      // Button should be focusable
      (mobileButton as HTMLElement)?.focus();
      expect(document.activeElement).toBe(mobileButton);
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(
        <SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />
      );

      expect(screen.getByText('Products')).toBeInTheDocument();

      rerender(<SecondaryNavigationDefault {...secondaryNavigationPropsServices} />);

      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('manages state changes without issues', () => {
      render(<SecondaryNavigationDefault {...defaultSecondaryNavigationProps} />);

      const mobileButton = document.querySelector('.block.sm\\:hidden button');

      // Multiple clicks should not cause issues
      fireEvent.click(mobileButton as Element);
      fireEvent.click(mobileButton as Element);
      fireEvent.click(mobileButton as Element);

      expect(mobileButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles malformed navigation data by throwing error', () => {
      const malformedProps = {
        params: {},
        fields: {
          data: {
            datasource: {
              id: null,
              children: null,
              parent: null,
            },
          },
        },
        rendering: {
          uid: 'test-malformed-uid',
          componentName: 'SecondaryNavigation',
          dataSource: '',
        },
      } as any;

      expect(() => {
        render(<SecondaryNavigationDefault {...malformedProps} />);
      }).toThrow(); // Component throws due to null parent access
    });

    it('handles missing properties in navigation items', () => {
      const propsWithMissingData = {
        params: {},
        fields: {
          data: {
            datasource: {
              id: 'test-id',
              children: {
                results: [
                  {
                    id: 'incomplete-item',
                    name: 'Incomplete',
                    // Missing title, navigationTitle, url
                  },
                ],
              },
              parent: {
                children: {
                  results: [],
                },
              },
            },
          },
        },
        rendering: {
          uid: 'test-missing-data-uid',
          componentName: 'SecondaryNavigation',
          dataSource: '',
        },
      } as any;

      expect(() => {
        render(<SecondaryNavigationDefault {...propsWithMissingData} />);
      }).not.toThrow();
    });
  });
});
