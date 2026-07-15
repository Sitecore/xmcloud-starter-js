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

// Simple mock props for Container5050 component
export const mockContainer5050Props = {
  rendering: {
    componentName: 'Container5050',
    placeholders: {
      'container-fifty-left-main': [{ componentName: 'LeftComponent' }],
      'container-fifty-right-main': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-5050-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer5050PropsNoMargin = {
  rendering: {
    componentName: 'Container5050',
    placeholders: {
      'container-fifty-left-test': [{ componentName: 'LeftComponent' }],
      'container-fifty-right-test': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-5050',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
