import type {
  BreadcrumbsProps,
  BreadcrumbsPage,
} from '../../components/breadcrumbs/breadcrumbs.props';
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

// Mock breadcrumbs with ancestors
export const breadcrumbsPropsWithAncestors: BreadcrumbsProps = {
  rendering: { componentName: 'Breadcrumbs', params: {} },
  params: {},
  fields: {
    data: {
      datasource: {
        ancestors: [
          {
            name: 'Home',
            title: {
              jsonValue: { value: 'Home Page' },
            },
            navigationTitle: {
              jsonValue: { value: 'Home' },
            },
            url: { href: '/' },
          },
          {
            name: 'Products',
            title: {
              jsonValue: { value: 'Products Catalog' },
            },
            navigationTitle: {
              jsonValue: { value: 'Products' },
            },
            url: { href: '/products' },
          },
        ],
        name: 'Current Page',
      },
    },
  },
  page: mockPageNormal,
};

// Mock breadcrumbs with long name to test truncation
export const breadcrumbsPropsWithLongName: BreadcrumbsProps = {
  rendering: { componentName: 'Breadcrumbs', params: {} },
  params: {},
  fields: {
    data: {
      datasource: {
        ancestors: [
          {
            name: 'Home',
            title: {
              jsonValue: { value: 'Home Page' },
            },
            navigationTitle: {
              jsonValue: { value: 'Home' },
            },
            url: { href: '/' },
          },
        ],
        name: 'This is a very long page name that should be truncated',
      },
    },
  },
  page: mockPageNormal,
};

// Mock breadcrumbs without ancestors (home page)
export const breadcrumbsPropsNoAncestors: BreadcrumbsProps = {
  rendering: { componentName: 'Breadcrumbs', params: {} },
  params: {},
  fields: {
    data: {
      datasource: {
        ancestors: undefined as unknown as BreadcrumbsPage[],
        name: 'Home',
      },
    },
  },
  page: mockPageNormal,
};

// Mock breadcrumbs with no fields
export const breadcrumbsPropsNoFields: BreadcrumbsProps = {
  rendering: { componentName: 'Breadcrumbs', params: {} },
  params: {},
  fields: undefined as unknown as BreadcrumbsProps['fields'],
  page: mockPageNormal,
};
