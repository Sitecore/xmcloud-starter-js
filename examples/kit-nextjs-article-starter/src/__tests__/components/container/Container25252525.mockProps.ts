import { ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';

const mockPage: Page = {
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
  ...mockPage,
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
  page: mockPage,
};

export const mockSitecoreContextEditing = {
  page: mockPageEditing,
};

export const defaultProps = {
  params: {
    DynamicPlaceholderId: 'main-25',
    styles: 'custom-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one-main-25': [{ componentName: 'Col1' }],
      'container-25-two-main-25': [{ componentName: 'Col2' }],
      'container-25-three-main-25': [{ componentName: 'Col3' }],
      'container-25-four-main-25': [{ componentName: 'Col4' }],
    },
  } as ComponentRendering,
  children: document.createElement('div') as Element,
  page: mockSitecoreContext.page,
};

export const propsWithExcludeTopMargin = {
  params: {
    DynamicPlaceholderId: 'no-margin',
    styles: '',
    excludeTopMargin: '1',
  },
  rendering: {
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one-no-margin': [{ componentName: 'Col1' }],
      'container-25-two-no-margin': [{ componentName: 'Col2' }],
      'container-25-three-no-margin': [{ componentName: 'Col3' }],
      'container-25-four-no-margin': [{ componentName: 'Col4' }],
    },
  } as ComponentRendering,
  children: document.createElement('div') as Element,
  page: mockSitecoreContext.page,
};

export const propsWithEmptyPlaceholders = {
  params: {
    DynamicPlaceholderId: 'empty',
    styles: '',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {},
  } as ComponentRendering,
  children: document.createElement('div') as Element,
  page: mockSitecoreContext.page,
};

