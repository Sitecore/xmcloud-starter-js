import { ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';

// Mock page object with all required Page properties
const mockPageBase: Page = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as PageMode['name'],
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
};

const mockPageEditing: Page = {
  ...mockPageBase,
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as PageMode['name'],
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
};

export const mockSitecoreContext = {
  page: mockPageBase,
};

export const mockSitecoreContextEditing = {
  page: mockPageEditing,
};

export const defaultProps = {
  params: {
    DynamicPlaceholderId: 'main-70',
    styles: 'custom-70-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container70',
    dataSource: '',
    placeholders: {
      'container-seventy-main-70': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

export const propsWithExcludeTopMargin = {
  params: {
    DynamicPlaceholderId: 'no-margin',
    styles: '',
    excludeTopMargin: '1',
  },
  rendering: {
    componentName: 'Container70',
    dataSource: '',
    placeholders: {
      'container-seventy-no-margin': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

export const propsWithEmptyPlaceholders = {
  params: {
    DynamicPlaceholderId: 'empty',
    styles: '',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container70',
    dataSource: '',
    placeholders: {},
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

export const propsWithChildren = {
  ...defaultProps,
  children: 'Child content' as React.ReactNode,
};

