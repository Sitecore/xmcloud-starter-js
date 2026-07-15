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

// Simple mock props for ContainerFullWidth component
export const mockContainerFullWidthProps = {
  rendering: {
    componentName: 'ContainerFullWidth',
    placeholders: {
      'container-fullwidth-main': [{ componentName: 'SampleComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-fullwidth-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainerFullWidthPropsNoMargin = {
  rendering: {
    componentName: 'ContainerFullWidth',
    placeholders: {
      'container-fullwidth-test': [{ componentName: 'SampleComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-fullwidth',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props for empty container
export const mockContainerFullWidthPropsEmpty = {
  rendering: {
    componentName: 'ContainerFullWidth',
    placeholders: {},
  },
  params: {
    DynamicPlaceholderId: 'empty',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
