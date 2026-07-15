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

// Simple mock props for Container3070 component
export const mockContainer3070Props = {
  rendering: {
    componentName: 'Container3070',
    placeholders: {
      'container-thirty-left-main': [{ componentName: 'LeftComponent' }],
      'container-seventy-right-main': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-3070-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer3070PropsNoMargin = {
  rendering: {
    componentName: 'Container3070',
    placeholders: {
      'container-thirty-left-test': [{ componentName: 'LeftComponent' }],
      'container-seventy-right-test': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-3070',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
