import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import { Page } from '@sitecore-content-sdk/nextjs';

//  Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data">No data for {componentName}</div>
  )),
}));

//  Mock breadcrumb UI components
jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: React.ComponentProps<'nav'>) => <nav>{children}</nav>,
  BreadcrumbList: ({ children }: React.ComponentProps<'ol'>) => <ol>{children}</ol>,
  BreadcrumbItem: ({ children }: React.ComponentProps<'li'>) => <li>{children}</li>,
  BreadcrumbLink: ({ children, href }: React.ComponentProps<'a'>) => <a href={href}>{children}</a>,
  BreadcrumbPage: ({ children }: React.ComponentProps<'span'>) => <span>{children}</span>,
  BreadcrumbSeparator: () => <span>/</span>,
}));

// ----------------------
//  Mock Data
// ----------------------
const mockRendering = {
  componentName: 'Breadcrumbs',
};
const mockParams = {};

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

const mockPropsWithAncestors = {
  rendering: mockRendering,
  params: mockParams,
  fields: {
    data: {
      datasource: {
        name: 'Product A',
        ancestors: [
          {
            name: 'Home',
            title: { jsonValue: { value: 'Home' } },
            navigationTitle: { jsonValue: { value: 'Homepage' } },
            url: { href: '/home' },
          },
          {
            name: 'Products',
            title: { jsonValue: { value: 'Products' } },
            navigationTitle: { jsonValue: { value: 'Our Products' } },
            url: { href: '/products' },
          },
        ],
      },
    },
  },
  page: mockPageBase,
};

const mockPropsWithoutAncestors = {
  rendering: mockRendering,
  params: mockParams,
  fields: {
    data: {
      datasource: {
        name: 'Home',
        ancestors: [],
      },
    },
  },
  page: mockPageBase,
};

const mockPropsMissingFields = {
  rendering: mockRendering,
  params: mockParams,
  fields: undefined,
} as unknown as React.ComponentProps<typeof Breadcrumbs>;

// ----------------------
//  Tests
// ----------------------
describe('Breadcrumbs Component', () => {
  it('renders breadcrumbs with ancestors correctly', () => {
    render(<Breadcrumbs {...mockPropsWithAncestors} />);

    expect(screen.getByText('Homepage')).toBeInTheDocument();
    expect(screen.getByText('Our Products')).toBeInTheDocument();
    expect(screen.getByText('Product A')).toBeInTheDocument();
  });

  it('renders only Home breadcrumb when no ancestors', () => {
    render(<Breadcrumbs {...mockPropsWithoutAncestors} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders NoDataFallback when fields are missing', () => {
    render(<Breadcrumbs {...mockPropsMissingFields} />);
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
    expect(screen.getByText(/No data for Breadcrumbs/i)).toBeInTheDocument();
  });

  it('truncates long breadcrumb name correctly', () => {
    const longName = 'This is a very long breadcrumb name exceeding normal length';
    const mockProps = {
      rendering: mockRendering,
      params: mockParams,
      fields: {
        data: {
          datasource: {
            name: longName,
            ancestors: [
              {
                name: 'Home',
                title: { jsonValue: { value: 'Home' } },
                navigationTitle: { jsonValue: { value: 'Home' } },
                url: { href: '/home' },
              },
            ],
          },
        },
      },
      page: mockPageBase,
    };

    render(<Breadcrumbs {...mockProps} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('This is a very long brea...')).toBeInTheDocument();
  });
});
