import type { GlobalFooterProps } from '../../components/global-footer/global-footer.props';
import type { Field, LinkField, ImageField, Page } from '@sitecore-content-sdk/nextjs';

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
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt },
  }) as unknown as ImageField;

const mockTaglineField = createMockField('Your trusted audio gear provider');
const mockEmailTitleField = createMockField('Subscribe to our newsletter');
const mockCopyrightField = createMockField('© 2024 SYNC Audio. All rights reserved.');

const mockLinkField = createMockLinkField('/test-link', 'Test Link');
const mockSocialLinkField = createMockLinkField('https://facebook.com', 'Facebook');
const mockImageField = createMockImageField('/test-icon.svg', 'Social Icon');

const mockFooterNavLinks = [
  {
    link: { jsonValue: mockLinkField },
  },
  {
    link: {
      jsonValue: createMockLinkField('/about', 'About Us'),
    },
  },
];

const mockSocialLinks = [
  {
    link: { jsonValue: mockSocialLinkField },
    socialIcon: { jsonValue: mockImageField },
  },
];

const mockDictionary = {
  FOOTER_EmailSubmitLabel: 'Subscribe',
  FOOTER_EmailPlaceholder: 'Enter your email',
  FOOTER_EmailErrorMessage: 'Please enter a valid email',
  FOOTER_EmailSuccessMessage: 'Successfully subscribed!',
};

export const defaultGlobalFooterProps: GlobalFooterProps = {
  rendering: { componentName: 'GlobalFooter', params: {} },
  params: { mock_param: '' },
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        footerNavLinks: {
          results: mockFooterNavLinks,
        },
        socialLinks: {
          results: mockSocialLinks,
        },
        tagline: { jsonValue: mockTaglineField },
        emailSubscriptionTitle: { jsonValue: mockEmailTitleField },
        footerCopyright: { jsonValue: mockCopyrightField },
      },
    },
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const globalFooterPropsNoFields: GlobalFooterProps = {
  rendering: { componentName: 'GlobalFooter', params: {} },
  params: { mock_param: '' },
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        footerNavLinks: { results: [] },
        socialLinks: { results: [] },
      },
    },
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const globalFooterPropsMinimal: GlobalFooterProps = {
  rendering: { componentName: 'GlobalFooter', params: {} },
  params: { mock_param: '' },
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        footerNavLinks: { results: [] },
        socialLinks: { results: [] },
        tagline: { jsonValue: mockTaglineField },
      },
    },
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const globalFooterPropsEditing: GlobalFooterProps = {
  ...defaultGlobalFooterProps,
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
