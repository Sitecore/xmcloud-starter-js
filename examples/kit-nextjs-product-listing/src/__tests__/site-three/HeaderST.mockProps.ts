/* eslint-disable */
import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

// Inline utility functions
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt },
  }) as unknown as ImageField;

// Default mock props for HeaderST component
export const defaultHeaderSTProps = {
  rendering: { componentName: 'HeaderST' },
  params: {
    styles: 'bg-white shadow-sm',
    showSearchBox: 'true',
    showMiniCart: 'true',
    DynamicPlaceholderId: 'main-nav',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('/images/sync-logo.svg', 'SYNC Audio Logo'),
    SupportLink: createMockLinkField('/support', 'Support'),
    SearchLink: createMockLinkField('/search', 'Search Products'),
    CartLink: createMockLinkField('/cart', 'Shopping Cart'),
  },
};

// Mock props without optional features
export const headerSTPropsBasic = {
  rendering: { componentName: 'HeaderST' },
  params: {
    DynamicPlaceholderId: 'main-nav',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('/images/sync-logo-alt.svg', 'SYNC Logo'),
    SupportLink: createMockLinkField('/help', 'Help & Support'),
    SearchLink: createMockLinkField('/search', 'Search'),
    CartLink: createMockLinkField('/shopping-cart', 'Cart'),
  },
};

// Mock props with custom styles
export const headerSTPropsCustomStyles = {
  rendering: { componentName: 'HeaderST' },
  params: {
    styles: 'bg-primary text-white custom-header-class',
    showSearchBox: 'false',
    showMiniCart: 'false',
    DynamicPlaceholderId: 'header-nav',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('/images/sync-logo-white.svg', 'SYNC Audio White Logo'),
    SupportLink: createMockLinkField('/support-center', 'Support Center'),
    SearchLink: createMockLinkField('/search-products', 'Product Search'),
    CartLink: createMockLinkField('/cart', 'View Cart'),
  },
};

// Mock props with empty fields
export const headerSTPropsEmpty = {
  rendering: { componentName: 'HeaderST' },
  params: {
    DynamicPlaceholderId: 'nav',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('', ''),
    SupportLink: createMockLinkField('', ''),
    SearchLink: createMockLinkField('', ''),
    CartLink: createMockLinkField('', ''),
  },
};

// Mock props with missing fields
export const headerSTPropsNoFields = {
  rendering: { componentName: 'HeaderST' },
  params: {
    DynamicPlaceholderId: 'nav',
  },
  page: mockPage,
  fields: null as any,
};

// Mock props with long text values
export const headerSTPropsLongText = {
  rendering: { componentName: 'HeaderST' },
  params: {
    styles: 'complex-styling with-multiple-classes and-very-long-custom-class-names',
    showSearchBox: 'true',
    showMiniCart: 'true',
    DynamicPlaceholderId: 'main-navigation-placeholder',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField(
      '/images/sync-audio-professional-equipment-logo-v2.svg',
      'SYNC Audio Professional Equipment Company Logo'
    ),
    SupportLink: createMockLinkField(
      '/customer-support-help-center',
      'Customer Support & Help Center'
    ),
    SearchLink: createMockLinkField(
      '/advanced-product-search-and-filtering',
      'Advanced Product Search & Filtering'
    ),
    CartLink: createMockLinkField(
      '/shopping-cart-checkout-review',
      'Shopping Cart & Checkout Review'
    ),
  },
};

// Mock props for different parameter combinations
export const headerSTPropsSearchBoxOnly = {
  rendering: { componentName: 'HeaderST' },
  params: {
    showSearchBox: 'true',
    showMiniCart: 'false',
    DynamicPlaceholderId: 'nav',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('/images/logo.svg', 'Logo'),
    SupportLink: createMockLinkField('/support', 'Support'),
    SearchLink: createMockLinkField('/search', 'Search'),
    CartLink: createMockLinkField('/cart', 'Cart'),
  },
};

export const headerSTPropsMiniCartOnly = {
  rendering: { componentName: 'HeaderST' },
  params: {
    showSearchBox: 'false',
    showMiniCart: 'true',
    DynamicPlaceholderId: 'nav',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('/images/logo.svg', 'Logo'),
    SupportLink: createMockLinkField('/support', 'Support'),
    SearchLink: createMockLinkField('/search', 'Search'),
    CartLink: createMockLinkField('/cart', 'Cart'),
  },
};

// Mock props with special characters
export const headerSTPropsSpecialChars = {
  rendering: { componentName: 'HeaderST' },
  params: {
    styles: 'class-with-"quotes" & special/chars',
    DynamicPlaceholderId: 'nav-with-åccénts',
  },
  page: mockPage,
  fields: {
    Logo: createMockImageField('/images/logo-ñ.svg', 'Logó with Àccents'),
    SupportLink: createMockLinkField('/suppört', 'Suppört & Hëlp'),
    SearchLink: createMockLinkField('/search?q=àudio', 'Seärch Prodücts'),
    CartLink: createMockLinkField('/cart#itéms', 'Shopping Cärt'),
  },
};
