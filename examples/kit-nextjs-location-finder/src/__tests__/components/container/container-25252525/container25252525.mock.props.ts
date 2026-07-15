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

// Simple mock props for Container25252525 component (4 column layout)
export const mockContainer25252525Props = {
  rendering: {
    componentName: 'Container25252525',
    placeholders: {
      'container-25-one-main': [{ componentName: 'Col1Component' }],
      'container-25-two-main': [{ componentName: 'Col2Component' }],
      'container-25-three-main': [{ componentName: 'Col3Component' }],
      'container-25-four-main': [{ componentName: 'Col4Component' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-25252525-styles',
  },  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainer25252525PropsNoMargin = {
  rendering: {
    componentName: 'Container25252525',
    placeholders: {
      'container-25-one-test': [{ componentName: 'Col1Component' }],
      'container-25-two-test': [{ componentName: 'Col2Component' }],
      'container-25-three-test': [{ componentName: 'Col3Component' }],
      'container-25-four-test': [{ componentName: 'Col4Component' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-25252525',
  },  page: mockPageBase,
  componentMap: testComponentMap,
};
