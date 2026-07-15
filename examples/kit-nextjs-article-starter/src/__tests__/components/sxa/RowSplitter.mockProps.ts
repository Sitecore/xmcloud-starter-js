import { ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';

// Mock page object
const mockPage: Page = {
  mode: {
    name: 'normal' as PageMode['name'],
    isEditing: false,
    isPreview: false,
    isNormal: true,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Default props with all rows enabled
export const defaultProps = {
  params: {
    EnabledPlaceholders: '1,2,3',
    Styles1: 'row-style-1',
    Styles2: 'row-style-2',
    Styles3: 'row-style-3',
    RenderingIdentifier: 'row-splitter-id',
    styles: 'custom-row-splitter-style',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2,3',
      Styles1: 'row-style-1',
      Styles2: 'row-style-2',
      Styles3: 'row-style-3',
      RenderingIdentifier: 'row-splitter-id',
      styles: 'custom-row-splitter-style',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props with two rows
export const propsWithTwoRows = {
  params: {
    EnabledPlaceholders: '1,2',
    Styles1: 'first-row',
    Styles2: 'second-row',
    RenderingIdentifier: 'two-row-splitter',
    styles: 'two-row-layout',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2',
      Styles1: 'first-row',
      Styles2: 'second-row',
      RenderingIdentifier: 'two-row-splitter',
      styles: 'two-row-layout',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props with single row
export const propsWithOneRow = {
  params: {
    EnabledPlaceholders: '1',
    Styles1: 'single-row',
    RenderingIdentifier: 'one-row-splitter',
    styles: '',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1',
      Styles1: 'single-row',
      RenderingIdentifier: 'one-row-splitter',
      styles: '',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props without row styles
export const propsWithoutRowStyles = {
  params: {
    EnabledPlaceholders: '1,2',
    RenderingIdentifier: 'no-row-styles',
    styles: 'default-style',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2',
      RenderingIdentifier: 'no-row-styles',
      styles: 'default-style',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props with empty enabled placeholders
export const propsWithNoRows = {
  params: {
    EnabledPlaceholders: '',
    RenderingIdentifier: 'empty-splitter',
    styles: 'empty-layout',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '',
      RenderingIdentifier: 'empty-splitter',
      styles: 'empty-layout',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props with maximum rows (8)
export const propsWithMaxRows = {
  params: {
    EnabledPlaceholders: '1,2,3,4,5,6,7,8',
    Styles1: 'row-1',
    Styles2: 'row-2',
    Styles3: 'row-3',
    Styles4: 'row-4',
    Styles5: 'row-5',
    Styles6: 'row-6',
    Styles7: 'row-7',
    Styles8: 'row-8',
    RenderingIdentifier: 'max-rows-splitter',
    styles: 'eight-rows',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2,3,4,5,6,7,8',
      Styles1: 'row-1',
      Styles2: 'row-2',
      Styles3: 'row-3',
      Styles4: 'row-4',
      Styles5: 'row-5',
      Styles6: 'row-6',
      Styles7: 'row-7',
      Styles8: 'row-8',
      RenderingIdentifier: 'max-rows-splitter',
      styles: 'eight-rows',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props with non-sequential row numbers
export const propsWithNonSequentialRows = {
  params: {
    EnabledPlaceholders: '2,5,7',
    Styles2: 'second-row',
    Styles5: 'fifth-row',
    Styles7: 'seventh-row',
    RenderingIdentifier: 'non-sequential',
    styles: 'custom-layout',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '2,5,7',
      Styles2: 'second-row',
      Styles5: 'fifth-row',
      Styles7: 'seventh-row',
      RenderingIdentifier: 'non-sequential',
      styles: 'custom-layout',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props without styles
export const propsWithoutStyles = {
  params: {
    EnabledPlaceholders: '1,2',
    Styles1: 'row-1',
    Styles2: 'row-2',
    RenderingIdentifier: 'no-styles',
    styles: '',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2',
      Styles1: 'row-1',
      Styles2: 'row-2',
      RenderingIdentifier: 'no-styles',
      styles: '',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props without RenderingIdentifier
export const propsWithoutId = {
  params: {
    EnabledPlaceholders: '1',
    Styles1: 'row-1',
    RenderingIdentifier: '',
    styles: 'custom-style',
  },
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1',
      Styles1: 'row-1',
      RenderingIdentifier: '',
      styles: 'custom-style',
    },
  } as ComponentRendering,
  page: mockPage,
};

// Props with undefined params
export const propsWithUndefinedParams = {
  params: {} as typeof defaultProps.params,
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    params: {} as typeof defaultProps.rendering.params,
  } as ComponentRendering,
  page: mockPage,
};

