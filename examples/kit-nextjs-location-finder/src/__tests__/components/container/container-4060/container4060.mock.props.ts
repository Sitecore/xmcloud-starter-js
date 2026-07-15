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

// Simple mock props for Container4060 component
export const mockContainer4060Props = {
  rendering: {
    componentName: 'Container4060',
    placeholders: {
      'container-forty-left-main': [{ componentName: 'LeftComponent' }],
      'container-sixty-right-main': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-4060-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer4060PropsNoMargin = {
  rendering: {
    componentName: 'Container4060',
    placeholders: {
      'container-forty-left-test': [{ componentName: 'LeftComponent' }],
      'container-sixty-right-test': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-4060',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
