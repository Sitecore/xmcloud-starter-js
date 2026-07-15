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
    DynamicPlaceholderId: 'main-fullwidth',
    styles: 'custom-fullwidth-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-main-fullwidth': [
        {
          componentName: 'Content',
        },
      ],
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
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-no-margin': [
        {
          componentName: 'Content',
        },
      ],
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
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {},
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

export const propsWithChildren = {
  ...defaultProps,
  children: 'Test child content' as React.ReactNode,
};

export const propsWithoutDynamicId = {
  params: {
    DynamicPlaceholderId: '',
    styles: 'test-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-': [
        {
          componentName: 'Content',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

