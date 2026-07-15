// Mock data for RowSplitter component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with 3 rows
export const mockRowSplitterProps = {
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    uid: 'rowsplitter-uid',
  },
  params: {
    styles: 'rowsplitter-styles',
    RenderingIdentifier: 'rowsplitter-test-id',
    EnabledPlaceholders: '1,2,3',
    Styles1: 'first-row-style',
    Styles2: 'second-row-style',
    Styles3: 'third-row-style',
  },
  page: mockPage,
};

// Mock props with 2 rows
export const mockRowSplitterPropsTwo = {
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    uid: 'rowsplitter-two-uid',
  },
  params: {
    styles: 'two-row-styles',
    RenderingIdentifier: 'rowsplitter-two-id',
    EnabledPlaceholders: '1,2',
    Styles1: 'hero-section',
    Styles2: 'content-section',
  },
  page: mockPage,
};

// Mock props with single row
export const mockRowSplitterPropsSingle = {
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    uid: 'rowsplitter-single-uid',
  },
  params: {
    styles: 'single-row-styles',
    RenderingIdentifier: 'rowsplitter-single-id',
    EnabledPlaceholders: '1',
    Styles1: 'full-page-style',
  },
  page: mockPage,
};

// Mock props with no row styles
export const mockRowSplitterPropsNoStyles = {
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    uid: 'rowsplitter-nostyles-uid',
  },
  params: {
    styles: 'nostyles-styles',
    RenderingIdentifier: 'rowsplitter-nostyles-id',
    EnabledPlaceholders: '1,2,3',
  },
  page: mockPage,
};

// Mock props with maximum rows (8)
export const mockRowSplitterPropsMax = {
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    uid: 'rowsplitter-max-uid',
  },
  params: {
    styles: 'max-row-styles',
    RenderingIdentifier: 'rowsplitter-max-id',
    EnabledPlaceholders: '1,2,3,4,5,6,7,8',
    Styles1: 'header',
    Styles2: 'hero',
    Styles3: 'features',
    Styles4: 'testimonials',
    Styles5: 'pricing',
    Styles6: 'faq',
    Styles7: 'cta',
    Styles8: 'footer',
  },
  page: mockPage,
};

// Mock props with empty enabled placeholders
export const mockRowSplitterPropsEmpty = {
  rendering: {
    componentName: 'RowSplitter',
    dataSource: '',
    uid: 'rowsplitter-empty-uid',
  },
  params: {
    styles: 'empty-styles',
    RenderingIdentifier: 'rowsplitter-empty-id',
    EnabledPlaceholders: '',
  },
  page: mockPage,
};

