import type { GlobalHeaderProps } from '../../components/global-header/global-header.props';
import type { LinkField, ImageField, Page } from '@sitecore-content-sdk/nextjs';

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

/**
 * Mock page object for editing mode
 */
const mockPageEditing = {
  mode: {
    isEditing: true,
    isNormal: false,
    isPreview: false,
    name: 'edit' as const,
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

// Inline utility functions
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt },
  }) as unknown as ImageField;

const mockLogoImageField = createMockImageField('/logo.svg', 'SYNC Audio Logo');
const mockLinkField = createMockLinkField('/home', 'Home');
const mockContactLinkField = createMockLinkField('/contact', 'Contact Us');

const mockPrimaryNavLinks = [
  {
    link: { jsonValue: mockLinkField },
    children: { results: [] },
  },
  {
    link: {
      jsonValue: createMockLinkField('/products', 'Products'),
    },
    children: {
      results: [
        {
          link: {
            jsonValue: createMockLinkField('/products/headphones', 'Headphones'),
          },
          children: { results: [] },
        },
      ],
    },
  },
];

const mockUtilityNavLinks = [
  {
    link: {
      jsonValue: createMockLinkField('/search', 'Search'),
    },
  },
  {
    link: {
      jsonValue: createMockLinkField('/cart', 'Cart'),
    },
  },
];

export const defaultGlobalHeaderProps: GlobalHeaderProps = {
  rendering: { componentName: 'GlobalHeader', params: {} },
  params: { mock_param: '' },
  page: mockPageNormal,
  fields: {
    data: {
      item: {
        logo: { jsonValue: mockLogoImageField },
        primaryNavigationLinks: { targetItems: mockPrimaryNavLinks },
        headerContact: { jsonValue: mockContactLinkField },
        utilityNavigationLinks: { targetItems: mockUtilityNavLinks },
      },
    },
  },
  isPageEditing: false,
};

export const globalHeaderPropsNoFields: GlobalHeaderProps = {
  rendering: { componentName: 'GlobalHeader', params: {} },
  params: { mock_param: '' },
  page: mockPageNormal,
  fields: {
    data: {
      item: {
        utilityNavigationLinks: { targetItems: [] },
      },
    },
  },
  isPageEditing: false,
};

export const globalHeaderPropsMinimal: GlobalHeaderProps = {
  rendering: { componentName: 'GlobalHeader', params: {} },
  params: { mock_param: '' },
  page: mockPageNormal,
  fields: {
    data: {
      item: {
        logo: { jsonValue: mockLogoImageField },
        utilityNavigationLinks: { targetItems: [] },
      },
    },
  },
  isPageEditing: false,
};

export const globalHeaderPropsEditing: GlobalHeaderProps = {
  ...defaultGlobalHeaderProps,
  page: mockPageEditing,
  isPageEditing: true,
};

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
