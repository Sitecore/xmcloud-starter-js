import { Page } from '@sitecore-content-sdk/nextjs';
import { testComponentMap } from '@/__tests__/test-utils/component-props';

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

// Simple mock props for Container70 component
export const mockContainer70Props = {
  rendering: {
    componentName: 'Container70',
    placeholders: {
      'container-seventy-main': [{ componentName: 'SampleComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-container-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer70PropsNoMargin = {
  rendering: {
    componentName: 'Container70',
    placeholders: {
      'container-seventy-test': [{ componentName: 'SampleComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-container',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props for empty container
export const mockContainer70PropsEmpty = {
  rendering: {
    componentName: 'Container70',
    placeholders: {},
  },
  params: {
    DynamicPlaceholderId: 'empty',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
