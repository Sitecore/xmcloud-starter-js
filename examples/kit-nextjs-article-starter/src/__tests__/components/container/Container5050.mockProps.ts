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

// Mock Sitecore context
export const mockSitecoreContext = {
  page: mockPage,
};

export const mockSitecoreContextEditing = {
  page: mockPageEditing,
};

// Default props with placeholders
export const defaultProps = {
  params: {
    DynamicPlaceholderId: 'main-5050',
    styles: 'custom-5050-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left-main-5050': [
        {
          componentName: 'LeftContent',
        },
      ],
      'container-fifty-right-main-5050': [
        {
          componentName: 'RightContent',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props with exclude top margin
export const propsWithExcludeTopMargin = {
  params: {
    DynamicPlaceholderId: 'no-margin-5050',
    styles: 'custom-style',
    excludeTopMargin: '1',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left-no-margin-5050': [
        {
          componentName: 'LeftContent',
        },
      ],
      'container-fifty-right-no-margin-5050': [
        {
          componentName: 'RightContent',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props without styles
export const propsWithoutStyles = {
  params: {
    DynamicPlaceholderId: 'no-style-5050',
    styles: '',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left-no-style-5050': [
        {
          componentName: 'LeftContent',
        },
      ],
      'container-fifty-right-no-style-5050': [
        {
          componentName: 'RightContent',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props with empty placeholders (not editing mode)
export const propsWithEmptyPlaceholders = {
  params: {
    DynamicPlaceholderId: 'empty-5050',
    styles: 'custom-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {},
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props with left child element - children are passed in tests directly
export const propsWithLeftChild = {
  ...defaultProps,
};

// Props with right child element - children are passed in tests directly
export const propsWithRightChild = {
  ...defaultProps,
};

// Props with both child elements - children are passed in tests directly
export const propsWithBothChildren = {
  ...defaultProps,
};

// Props with only left placeholder populated
export const propsWithOnlyLeftPlaceholder = {
  params: {
    DynamicPlaceholderId: 'left-only-5050',
    styles: 'left-only-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left-left-only-5050': [
        {
          componentName: 'LeftContent',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props with only right placeholder populated
export const propsWithOnlyRightPlaceholder = {
  params: {
    DynamicPlaceholderId: 'right-only-5050',
    styles: 'right-only-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-right-right-only-5050': [
        {
          componentName: 'RightContent',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props without DynamicPlaceholderId
export const propsWithoutDynamicId = {
  params: {
    DynamicPlaceholderId: '',
    styles: 'no-id-style',
    excludeTopMargin: '0',
  },
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left-': [
        {
          componentName: 'LeftContent',
        },
      ],
      'container-fifty-right-': [
        {
          componentName: 'RightContent',
        },
      ],
    },
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

// Props with undefined params
export const propsWithUndefinedParams = {
  params: {} as Record<string, string>,
  rendering: {
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {},
  } as ComponentRendering,
  page: mockSitecoreContext.page,
};

