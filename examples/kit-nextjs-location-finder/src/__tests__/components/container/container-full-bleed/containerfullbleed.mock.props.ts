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

// Simple mock props for ContainerFullBleed component
export const mockContainerFullBleedProps = {
  rendering: {
    componentName: 'ContainerFullBleed',
    placeholders: {
      'container-fullbleed-main': [{ componentName: 'SampleComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'main',
    styles: 'custom-fullbleed-styles',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props with exclude top margin
export const mockContainerFullBleedPropsNoMargin = {
  rendering: {
    componentName: 'ContainerFullBleed',
    placeholders: {
      'container-fullbleed-test': [{ componentName: 'SampleComponent' }],
    },
  },
  params: {
    DynamicPlaceholderId: 'test',
    excludeTopMargin: '1',
    styles: 'no-margin-fullbleed',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};

// Mock props for empty container
export const mockContainerFullBleedPropsEmpty = {
  rendering: {
    componentName: 'ContainerFullBleed',
    placeholders: {},
  },
  params: {
    DynamicPlaceholderId: 'empty',
  },
  page: mockPageBase,
  componentMap: testComponentMap,
};
