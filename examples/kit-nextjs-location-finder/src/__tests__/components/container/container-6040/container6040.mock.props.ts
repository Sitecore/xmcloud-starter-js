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

// Simple mock props for Container6040 component
export const mockContainer6040Props = {
  rendering: {
    componentName: 'Container6040',
    placeholders: {
      'container-sixty-left-main': [{ componentName: 'LeftComponent' }],
      'container-forty-right-main': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-6040-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer6040PropsNoMargin = {
  rendering: {
    componentName: 'Container6040',
    placeholders: {
      'container-sixty-left-test': [{ componentName: 'LeftComponent' }],
      'container-forty-right-test': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-6040',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
