import React from 'react';
import { render, screen } from '@testing-library/react';
import { IGQLTextField } from '@/lib/component-props';
import type { Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
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

// Mock component-map BEFORE importing PlaceholderTabs to avoid circular dependency
jest.mock('../../components/component-library/.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}), { virtual: true });

// Import PlaceholderTabs after mocking component-map
import { Default as PlaceholderTabs } from '../../components/component-library/PlaceholderTabs';

// Mock lucide-react to avoid ES module parsing issues
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="lucide-x">X</span>,
}));

// Mock next-intl to avoid ES module parsing issues
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock NoDataFallback to avoid change-case ES module issues
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock component-map using virtual module
jest.mock('.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}), { virtual: true });

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field: { value: string } }) => (
    <span data-testid="tab-text">{field?.value}</span>
  ),
  Placeholder: ({ name }: { name: string; rendering: unknown }) => (
    <div data-testid="placeholder" data-name={name} />
  ),
  AppPlaceholder: ({ name }: { name: string; rendering: unknown }) => (
    <div data-testid="app-placeholder" data-name={name} />
  ),
  withDatasourceCheck: () => (component: React.ComponentType) => component,
}));

// Mock shadcn Tabs components
jest.mock('shadcd/components/ui/tabs', () => ({
  Tabs: ({
    children,
    defaultValue,
    className,
  }: {
    children: React.ReactNode;
    defaultValue?: string;
    className?: string;
  }) => (
    <div data-testid="tabs" data-default-value={defaultValue} className={className}>
      {children}
    </div>
  ),
  TabsList: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="tabs-list" className={className}>
      {children}
    </div>
  ),
  TabsTrigger: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => (
    <button data-testid="tabs-trigger" data-value={value} className={className}>
      {children}
    </button>
  ),
  TabsContent: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => (
    <div data-testid="tabs-content" data-value={value} className={className}>
      {children}
    </div>
  ),
}));

const defaultProps = {
  params: {
    styles: '',
    DynamicPlaceholderId: '123',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              id: 'tab-1',
              title: {
                jsonValue: {
                  value: 'Tab 1',
                },
              } as IGQLTextField,
            },
            {
              id: 'tab-2',
              title: {
                jsonValue: {
                  value: 'Tab 2',
                },
              } as IGQLTextField,
            },
            {
              id: 'tab-3',
              title: {
                jsonValue: {
                  value: 'Tab 3',
                },
              } as IGQLTextField,
            },
          ],
        },
      },
    },
  },
  rendering: {
    componentName: 'PlaceholderTabs',
    dataSource: '',
  },
  page: mockPageNormal,
};

describe('PlaceholderTabs', () => {
  it('renders tabs with all props', () => {
    render(<PlaceholderTabs {...defaultProps} />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
  });

  it('renders tab triggers', () => {
    render(<PlaceholderTabs {...defaultProps} />);

    const triggers = screen.getAllByTestId('tabs-trigger');
    expect(triggers).toHaveLength(3);
    expect(triggers[0]).toHaveAttribute('data-value', 'tab-1');
    expect(triggers[1]).toHaveAttribute('data-value', 'tab-2');
    expect(triggers[2]).toHaveAttribute('data-value', 'tab-3');
  });

  it('renders tab content areas', () => {
    render(<PlaceholderTabs {...defaultProps} />);

    const contents = screen.getAllByTestId('tabs-content');
    expect(contents).toHaveLength(3);
  });

  it('renders placeholders for each tab', () => {
    render(<PlaceholderTabs {...defaultProps} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(3);
    expect(placeholders[0]).toHaveAttribute('data-name', 'tab-content-one-123');
    expect(placeholders[1]).toHaveAttribute('data-name', 'tab-content-two-123');
    expect(placeholders[2]).toHaveAttribute('data-name', 'tab-content-three-123');
  });

  it('sets default active tab to first tab', () => {
    render(<PlaceholderTabs {...defaultProps} />);

    const tabs = screen.getByTestId('tabs');
    expect(tabs).toHaveAttribute('data-default-value', 'tab-1');
  });

  it('applies custom styles from params', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: {
        ...defaultProps.params,
        styles: 'custom-style',
      },
    };

    const { container } = render(<PlaceholderTabs {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-style');
  });

  it('handles empty tabs array', () => {
    const propsWithoutTabs = {
      ...defaultProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [],
            },
          },
        },
      },
    };

    const { container } = render(<PlaceholderTabs {...propsWithoutTabs} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
  });

  it('limits tabs to maximum of 5', () => {
    const propsWithManyTabs = {
      ...defaultProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                ...defaultProps.fields.data.datasource.children.results,
                {
                  id: 'tab-4',
                  title: {
                    jsonValue: {
                      value: 'Tab 4',
                    },
                  } as IGQLTextField,
                },
                {
                  id: 'tab-5',
                  title: {
                    jsonValue: {
                      value: 'Tab 5',
                    },
                  } as IGQLTextField,
                },
                {
                  id: 'tab-6',
                  title: {
                    jsonValue: {
                      value: 'Tab 6',
                    },
                  } as IGQLTextField,
                },
              ],
            },
          },
        },
      },
    };

    render(<PlaceholderTabs {...propsWithManyTabs} />);

    const triggers = screen.getAllByTestId('tabs-trigger');
    expect(triggers).toHaveLength(5); // Should only render first 5 tabs
  });

  it('renders tab titles', () => {
    render(<PlaceholderTabs {...defaultProps} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('includes data-component attribute', () => {
    const { container } = render(<PlaceholderTabs {...defaultProps} />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-component', 'tabs');
  });
});
