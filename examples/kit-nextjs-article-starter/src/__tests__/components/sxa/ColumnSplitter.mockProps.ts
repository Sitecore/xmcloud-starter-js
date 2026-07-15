import { ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';

// Mock page object
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

// Default props with all columns enabled
export const defaultProps = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '1,2,3',
    ColumnWidth1: 'col-4',
    ColumnWidth2: 'col-4',
    ColumnWidth3: 'col-4',
    Styles1: 'custom-style-1',
    Styles2: 'custom-style-2',
    Styles3: 'custom-style-3',
    RenderingIdentifier: 'column-splitter-id',
    styles: 'custom-splitter-style',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2,3',
      ColumnWidth1: 'col-4',
      ColumnWidth2: 'col-4',
      ColumnWidth3: 'col-4',
      Styles1: 'custom-style-1',
      Styles2: 'custom-style-2',
      Styles3: 'custom-style-3',
      RenderingIdentifier: 'column-splitter-id',
      styles: 'custom-splitter-style',
    },
  } as ComponentRendering,
};

// Props with two columns
export const propsWithTwoColumns = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '1,2',
    ColumnWidth1: 'col-6',
    ColumnWidth2: 'col-6',
    Styles1: 'first-column',
    Styles2: 'second-column',
    RenderingIdentifier: 'two-column-splitter',
    styles: 'two-column-layout',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2',
      ColumnWidth1: 'col-6',
      ColumnWidth2: 'col-6',
      Styles1: 'first-column',
      Styles2: 'second-column',
      RenderingIdentifier: 'two-column-splitter',
      styles: 'two-column-layout',
    },
  } as ComponentRendering,
};

// Props with single column
export const propsWithOneColumn = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '1',
    ColumnWidth1: 'col-12',
    Styles1: 'full-width',
    RenderingIdentifier: 'one-column-splitter',
    styles: '',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1',
      ColumnWidth1: 'col-12',
      Styles1: 'full-width',
      RenderingIdentifier: 'one-column-splitter',
      styles: '',
    },
  } as ComponentRendering,
};

// Props without column widths
export const propsWithoutColumnWidths = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '1,2',
    RenderingIdentifier: 'no-width-splitter',
    styles: 'default-style',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2',
      RenderingIdentifier: 'no-width-splitter',
      styles: 'default-style',
    },
  } as ComponentRendering,
};

// Props without column styles
export const propsWithoutColumnStyles = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '1,2',
    ColumnWidth1: 'col-6',
    ColumnWidth2: 'col-6',
    RenderingIdentifier: 'no-style-splitter',
    styles: '',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2',
      ColumnWidth1: 'col-6',
      ColumnWidth2: 'col-6',
      RenderingIdentifier: 'no-style-splitter',
      styles: '',
    },
  } as ComponentRendering,
};

// Props with empty enabled placeholders
export const propsWithNoColumns = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '',
    RenderingIdentifier: 'empty-splitter',
    styles: 'empty-layout',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '',
      RenderingIdentifier: 'empty-splitter',
      styles: 'empty-layout',
    },
  } as ComponentRendering,
};

// Props with maximum columns (8)
export const propsWithMaxColumns = {
  page: mockPage,
  params: {
    EnabledPlaceholders: '1,2,3,4,5,6,7,8',
    ColumnWidth1: 'col-3',
    ColumnWidth2: 'col-3',
    ColumnWidth3: 'col-3',
    ColumnWidth4: 'col-3',
    ColumnWidth5: 'col-3',
    ColumnWidth6: 'col-3',
    ColumnWidth7: 'col-3',
    ColumnWidth8: 'col-3',
    RenderingIdentifier: 'max-columns-splitter',
    styles: 'eight-columns',
  },
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    params: {
      EnabledPlaceholders: '1,2,3,4,5,6,7,8',
      ColumnWidth1: 'col-3',
      ColumnWidth2: 'col-3',
      ColumnWidth3: 'col-3',
      ColumnWidth4: 'col-3',
      ColumnWidth5: 'col-3',
      ColumnWidth6: 'col-3',
      ColumnWidth7: 'col-3',
      ColumnWidth8: 'col-3',
      RenderingIdentifier: 'max-columns-splitter',
      styles: 'eight-columns',
    },
  } as ComponentRendering,
};

