import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as SecondaryNavigation } from '@/components/secondary-navigation/SecondaryNavigation';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    className,
    prefetch,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    prefetch?: boolean;
  }) => (
    <a href={href} className={className} data-prefetch={prefetch?.toString()}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockNextLink';
  return MockLink;
});

// Mock Button component to handle asChild prop properly
jest.mock('@/components/ui/button', () => {
  const Button = ({
    children,
    asChild,
    variant,
    className,
    onClick,
    ...props
  }: React.PropsWithChildren<{
    asChild?: boolean;
    variant?: string;
    className?: string;
    onClick?: () => void;
  }> &
    React.ComponentProps<'button'>) => {
    if (asChild && React.isValidElement(children)) {
      // When asChild is true, render children directly (typically a link)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        className: [className, (children as any).props?.className].filter(Boolean).join(' '),
      });
    }

    return (
      <button
        data-testid="ui-button"
        data-variant={variant}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  };
  Button.displayName = 'MockButton';
  return { Button };
});

// Mock Radix UI NavigationMenu components
jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({
    children,
    className,
    orientation,
  }: React.PropsWithChildren<{ className?: string; orientation?: string }>) => (
    <nav data-testid="navigation-menu-root" className={className} data-orientation={orientation}>
      {children}
    </nav>
  ),
  List: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <ul data-testid="navigation-menu-list" className={className}>
      {children}
    </ul>
  ),
  Item: ({ children }: React.PropsWithChildren) => (
    <li data-testid="navigation-menu-item">{children}</li>
  ),
}));

// Mock Radix UI ChevronDownIcon
jest.mock('@radix-ui/react-icons', () => ({
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>
      ▼
    </span>
  ),
}));

describe('SecondaryNavigation Component', () => {
  // Mock page object with all required Page properties
  const mockPageBase = {
    mode: {
      isEditing: false,
      isPreview: false,
      isNormal: true,
      name: 'normal' as const,
      designLibrary: { isVariantGeneration: false },
      isDesignLibrary: false,
    },
    layout: {
      sitecore: {
        context: {},
        route: null,
      },
    },
    locale: 'en',
  } as Page;

  const mockRendering = { componentName: 'SecondaryNavigation' };

  const mockNavigationData = {
    fields: {
      data: {
        datasource: {
          id: 'current-page-id',
          children: {
            results: [
              {
                id: 'child1',
                name: 'Child Page 1',
                title: { jsonValue: { value: 'Child Title 1' } },
                navigationTitle: { jsonValue: { value: 'Nav Child 1' } },
                url: { href: '/child1' },
              },
              {
                id: 'child2',
                name: 'Child Page 2',
                title: { jsonValue: { value: 'Child Title 2' } },
                url: { href: '/child2' },
              },
            ],
          },
          parent: {
            children: {
              results: [
                {
                  id: 'parent1',
                  name: 'Parent Page 1',
                  title: { jsonValue: { value: 'Parent Title 1' } },
                  navigationTitle: { jsonValue: { value: 'Nav Parent 1' } },
                  url: { href: '/parent1' },
                },
                {
                  id: 'current-page-id',
                  name: 'Current Page',
                  title: { jsonValue: { value: 'Current Title' } },
                  navigationTitle: { jsonValue: { value: 'Nav Current' } },
                  url: { href: '/current' },
                },
                {
                  id: 'parent3',
                  name: 'Parent Page 3',
                  title: { jsonValue: { value: 'Parent Title 3' } },
                  url: { href: '/parent3' },
                },
              ],
            },
          },
        },
      },
    },
    params: {},
    rendering: mockRendering,
    page: mockPageBase,
  };

  beforeEach(() => {
    // Mock window.matchMedia for responsive tests
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Rendering with valid data', () => {
    it('renders navigation menu with parent items', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      expect(screen.getAllByTestId('navigation-menu-root')).toHaveLength(1); // Desktop only (mobile shows when dropdown opened)
      expect(screen.getAllByTestId('navigation-menu-list')).toHaveLength(2); // Parent list + child list
      expect(screen.getAllByText('Nav Parent 1')).toHaveLength(1); // Desktop only
      expect(screen.getAllByText('Nav Current')).toHaveLength(1); // Desktop only
      expect(screen.getAllByText('Parent Title 3')).toHaveLength(1); // Desktop only (no navigationTitle, falls back to title)
    });

    it('renders child items for current page', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Child items should be rendered under the current page
      expect(screen.getAllByText('Nav Child 1')).toHaveLength(1); // Desktop only
      expect(screen.getAllByText('Child Title 2')).toHaveLength(1); // Desktop only (no navigationTitle, falls back to title)
    });

    it('renders correct links with proper href attributes', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      const parentLinks = screen.getAllByRole('link');
      const parent1Links = parentLinks.filter((link) => link.getAttribute('href') === '/parent1');
      const currentLinks = parentLinks.filter((link) => link.getAttribute('href') === '/current');
      const child1Links = parentLinks.filter((link) => link.getAttribute('href') === '/child1');

      expect(parent1Links).toHaveLength(1); // Desktop only
      expect(currentLinks).toHaveLength(1); // Desktop only
      expect(child1Links).toHaveLength(1); // Desktop only
    });
  });

  describe('Desktop vs Mobile rendering', () => {
    it('renders desktop navigation with correct CSS classes', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      const desktopNav = screen.getAllByTestId('navigation-menu-root')[0];
      expect(desktopNav).toHaveClass('hidden', 'sm:block');
    });

    it('renders mobile dropdown button with chevron icon', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Target the mobile dropdown button specifically by finding the button containing the chevron icon
      const chevronIcon = screen.getByTestId('chevron-down-icon');
      const mobileDropdownButton = chevronIcon.closest('button');

      expect(mobileDropdownButton).toBeInTheDocument();
      expect(chevronIcon).toBeInTheDocument();
    });

    it('mobile dropdown is initially closed', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      const chevronIcon = screen.getByTestId('chevron-down-icon');
      const mobileDropdownButton = chevronIcon.closest('button') as HTMLButtonElement;

      expect(mobileDropdownButton).not.toHaveClass('rounded-bl-none', 'rounded-br-none');
      expect(chevronIcon).not.toHaveClass('rotate-180');

      // Initially, only desktop navigation should be visible
      expect(screen.getAllByTestId('navigation-menu-root')).toHaveLength(1);
    });
  });

  describe('Mobile dropdown functionality', () => {
    it('toggles mobile dropdown when button is clicked', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      const chevronIcon = screen.getByTestId('chevron-down-icon');
      const mobileDropdownButton = chevronIcon.closest('button') as HTMLButtonElement;

      // Initially closed
      expect(chevronIcon).not.toHaveClass('rotate-180');

      // Click to open
      fireEvent.click(mobileDropdownButton);
      expect(chevronIcon).toHaveClass('rotate-180');
      expect(mobileDropdownButton).toHaveClass('rounded-bl-none', 'rounded-br-none');

      // Click to close
      fireEvent.click(mobileDropdownButton);
      expect(chevronIcon).not.toHaveClass('rotate-180');
      expect(mobileDropdownButton).not.toHaveClass('rounded-bl-none', 'rounded-br-none');
    });

    it('shows mobile navigation content when dropdown is open', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      const chevronIcon = screen.getByTestId('chevron-down-icon');
      const mobileDropdownButton = chevronIcon.closest('button') as HTMLButtonElement;

      // Open dropdown
      fireEvent.click(mobileDropdownButton);

      // Check that mobile navigation content is visible (should now have desktop + mobile)
      const mobileNavRoots = screen.getAllByTestId('navigation-menu-root');
      expect(mobileNavRoots).toHaveLength(2); // Desktop + Mobile (in dropdown)
    });
  });

  describe('Navigation preferences', () => {
    it('prefers navigationTitle over title when available', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Should show navigationTitle when available
      expect(screen.getAllByText('Nav Parent 1')).toHaveLength(1);
      expect(screen.queryByText('Parent Title 1')).not.toBeInTheDocument();

      // Should show navigationTitle for children too
      expect(screen.getAllByText('Nav Child 1')).toHaveLength(1);
      expect(screen.queryByText('Child Title 1')).not.toBeInTheDocument();
    });

    it('falls back to title when navigationTitle is not available', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Should show title when navigationTitle is not available
      expect(screen.getAllByText('Parent Title 3')).toHaveLength(1);
      expect(screen.getAllByText('Child Title 2')).toHaveLength(1);
    });

    it('handles missing titles gracefully', () => {
      const dataWithMissingTitles = {
        ...mockNavigationData,
        fields: {
          data: {
            datasource: {
              id: 'current-page-id',
              children: { results: [] },
              parent: {
                children: {
                  results: [
                    {
                      id: 'parent-no-title',
                      name: 'Parent No Title',
                      url: { href: '/no-title' },
                    },
                  ],
                },
              },
            },
          },
        },
      };

      expect(() => render(<SecondaryNavigation {...dataWithMissingTitles} />)).not.toThrow();
    });
  });

  describe('Link behavior', () => {
    it('sets prefetch to false for navigation links', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Only child navigation links have prefetch attribute (they use NextLink with prefetch prop)
      const childLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('/child'));
      childLinks.forEach((link) => {
        expect(link).toHaveAttribute('data-prefetch', 'false');
      });
    });

    it('handles empty or missing href values', () => {
      const dataWithEmptyHref = {
        ...mockNavigationData,
        fields: {
          data: {
            datasource: {
              id: 'current-page-id',
              children: { results: [] },
              parent: {
                children: {
                  results: [
                    {
                      id: 'parent-no-url',
                      name: 'Parent No URL',
                      title: { jsonValue: { value: 'No URL Parent' } },
                      url: { href: '' },
                    },
                  ],
                },
              },
            },
          },
        },
      };

      render(<SecondaryNavigation {...dataWithEmptyHref} />);

      // The link exists and has an empty href
      const linkWithEmptyHref = screen.getByText('No URL Parent').closest('a');
      expect(linkWithEmptyHref).toHaveAttribute('href', '');
    });
  });

  describe('Error handling and edge cases', () => {
    it('renders fallback when fields are missing', () => {
      const propsWithoutFields = {
        fields: undefined,
        params: {},
        rendering: mockRendering,
        page: mockPageBase,
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
      render(<SecondaryNavigation {...(propsWithoutFields as any)} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('No data for Secondary Navigation')).toBeInTheDocument();
    });

    it('handles missing parent children gracefully', () => {
      const propsWithoutParentChildren = {
        fields: {
          data: {
            datasource: {
              id: 'test-id',
              children: { results: [] },
              parent: {},
            },
          },
        },
        params: {},
        rendering: mockRendering,
        page: mockPageBase,
      };

      expect(() => render(<SecondaryNavigation {...propsWithoutParentChildren} />)).not.toThrow();
    });

    it('renders empty navigation when no parent results', () => {
      const propsWithEmptyParent = {
        fields: {
          data: {
            datasource: {
              id: 'test-id',
              children: { results: [] },
              parent: { children: { results: [] } },
            },
          },
        },
        params: {},
        rendering: mockRendering,
        page: mockPageBase,
      };

      render(<SecondaryNavigation {...propsWithEmptyParent} />);

      // Should still render navigation structure but without items
      expect(screen.getAllByTestId('navigation-menu-root')).toHaveLength(1); // Desktop only
      expect(screen.getAllByTestId('navigation-menu-list')).toHaveLength(1); // Just parent list, no children
    });
  });

  describe('Current page identification', () => {
    it('identifies current page and renders its children', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Current page should show its children
      expect(screen.getAllByText('Nav Child 1')).toHaveLength(1);
      expect(screen.getAllByText('Child Title 2')).toHaveLength(1);
    });

    it('does not render children for non-current pages', () => {
      const dataWithDifferentCurrentPage = {
        ...mockNavigationData,
        fields: {
          data: {
            datasource: {
              id: 'different-page-id', // Different from any parent id
              children: {
                results: [
                  {
                    id: 'should-not-show',
                    name: 'Should Not Show',
                    title: { jsonValue: { value: 'Hidden Child' } },
                    url: { href: '/hidden' },
                  },
                ],
              },
              parent: {
                children: {
                  results: [
                    {
                      id: 'parent1',
                      name: 'Parent Page 1',
                      title: { jsonValue: { value: 'Parent Title 1' } },
                      url: { href: '/parent1' },
                    },
                  ],
                },
              },
            },
          },
        },
      };

      render(<SecondaryNavigation {...dataWithDifferentCurrentPage} />);

      // Children should not be rendered since current page doesn't match any parent
      expect(screen.queryByText('Hidden Child')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses proper semantic HTML elements', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      // Should use nav elements
      expect(screen.getAllByTestId('navigation-menu-root')).toHaveLength(1);

      // Should use list elements
      expect(screen.getAllByTestId('navigation-menu-list')).toBeTruthy();

      // Should use list items
      expect(screen.getAllByTestId('navigation-menu-item')).toBeTruthy();
    });

    it('mobile dropdown button is focusable', () => {
      render(<SecondaryNavigation {...mockNavigationData} />);

      const chevronIcon = screen.getByTestId('chevron-down-icon');
      const mobileButton = chevronIcon.closest('button') as HTMLButtonElement;

      expect(mobileButton).toBeInTheDocument();

      // Button should be focusable (has role="button")
      mobileButton.focus();
      expect(document.activeElement).toBe(mobileButton);
    });
  });
});
