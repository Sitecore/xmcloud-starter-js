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
    DynamicPlaceholderId: 'main-7030',
    styles: 'custom-7030-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left-main-7030': [{ componentName: 'LeftContent' }],
      'container-thirty-right-main-7030': [{ componentName: 'RightContent' }],
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
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left-no-margin': [{ componentName: 'LeftContent' }],
      'container-thirty-right-no-margin': [{ componentName: 'RightContent' }],
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
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {},
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

export const propsWithOnlyLeftPlaceholder = {
  params: {
    DynamicPlaceholderId: 'left-only',
    styles: '',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left-left-only': [{ componentName: 'LeftContent' }],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

export const propsWithOnlyRightPlaceholder = {
  params: {
    DynamicPlaceholderId: 'right-only',
    styles: '',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-thirty-right-right-only': [{ componentName: 'RightContent' }],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

