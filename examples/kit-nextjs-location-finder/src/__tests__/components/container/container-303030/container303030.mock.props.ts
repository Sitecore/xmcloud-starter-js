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

// Simple mock props for Container303030 component
export const mockContainer303030Props = {
  rendering: {
    componentName: 'Container303030',
    placeholders: {
      'container-thirty-left-main': [{ componentName: 'LeftComponent' }],
      'container-thirty-center-main': [{ componentName: 'CenterComponent' }],
      'container-thirty-right-main': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-303030-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer303030PropsNoMargin = {
  rendering: {
    componentName: 'Container303030',
    placeholders: {
      'container-thirty-left-test': [{ componentName: 'LeftComponent' }],
      'container-thirty-center-test': [{ componentName: 'CenterComponent' }],
      'container-thirty-right-test': [{ componentName: 'RightComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-303030',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
