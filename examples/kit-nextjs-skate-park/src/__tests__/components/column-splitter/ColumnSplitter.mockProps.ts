// Mock data for ColumnSplitter component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with 3 columns
export const mockColumnSplitterProps = {
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: 'columnsplitter-uid',
  },
  params: {
    styles: 'columnsplitter-styles',
    RenderingIdentifier: 'columnsplitter-test-id',
    EnabledPlaceholders: '1,2,3',
    ColumnWidth1: 'col-4',
    ColumnWidth2: 'col-4',
    ColumnWidth3: 'col-4',
    Styles1: 'first-column-style',
    Styles2: 'second-column-style',
    Styles3: 'third-column-style',
  },
  page: mockPage,
};

// Mock props with 2 columns (different widths)
export const mockColumnSplitterPropsTwo = {
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: 'columnsplitter-two-uid',
  },
  params: {
    styles: 'two-column-styles',
    RenderingIdentifier: 'columnsplitter-two-id',
    EnabledPlaceholders: '1,2',
    ColumnWidth1: 'col-8',
    ColumnWidth2: 'col-4',
    Styles1: '',
    Styles2: '',
  },
  page: mockPage,
};

// Mock props with single column
export const mockColumnSplitterPropsSingle = {
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: 'columnsplitter-single-uid',
  },
  params: {
    styles: 'single-column-styles',
    RenderingIdentifier: 'columnsplitter-single-id',
    EnabledPlaceholders: '1',
    ColumnWidth1: 'col-12',
    Styles1: 'full-width-style',
  },
  page: mockPage,
};

// Mock props with no column widths specified
export const mockColumnSplitterPropsNoWidths = {
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: 'columnsplitter-nowidths-uid',
  },
  params: {
    styles: 'nowidths-styles',
    RenderingIdentifier: 'columnsplitter-nowidths-id',
    EnabledPlaceholders: '1,2',
    Styles1: 'first-style',
    Styles2: 'second-style',
  },
  page: mockPage,
};

// Mock props with maximum columns (8)
export const mockColumnSplitterPropsMax = {
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: 'columnsplitter-max-uid',
  },
  params: {
    styles: 'max-column-styles',
    RenderingIdentifier: 'columnsplitter-max-id',
    EnabledPlaceholders: '1,2,3,4,5,6,7,8',
    ColumnWidth1: 'col-1',
    ColumnWidth2: 'col-1',
    ColumnWidth3: 'col-2',
    ColumnWidth4: 'col-2',
    ColumnWidth5: 'col-2',
    ColumnWidth6: 'col-1',
    ColumnWidth7: 'col-1',
    ColumnWidth8: 'col-2',
    Styles1: '',
    Styles2: '',
    Styles3: '',
    Styles4: '',
    Styles5: '',
    Styles6: '',
    Styles7: '',
    Styles8: '',
  },
  page: mockPage,
};

// Mock props with no enabled placeholders
export const mockColumnSplitterPropsEmpty = {
  rendering: {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: 'columnsplitter-empty-uid',
  },
  params: {
    styles: 'empty-styles',
    RenderingIdentifier: 'columnsplitter-empty-id',
    EnabledPlaceholders: '',
  },
  page: mockPage,
};

