/**
 * Test fixtures and mock data for ColumnSplitter component
 */

import { ComponentProps } from 'lib/component-props';
import { Page } from '@sitecore-content-sdk/nextjs';
import { mockPage as sharedMockPage } from '../../test-utils/mockPage';

type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type ColumnWidths = {
  [K in ColumnNumber as `ColumnWidth${K}`]?: string;
};

type ColumnStyles = {
  [K in ColumnNumber as `Styles${K}`]?: string;
};

interface ColumnSplitterProps extends ComponentProps {
  params: ComponentProps['params'] & ColumnWidths & ColumnStyles;
}

/**
 * Mock page object
 */
export const mockPage: Page = sharedMockPage;

/**
 * Mock rendering object
 */
export const mockRendering = {
  componentName: 'ColumnSplitter',
  dataSource: '',
  uid: 'column-splitter-uid',
  placeholders: {
    'column-1-{*}': [],
    'column-2-{*}': [],
    'column-3-{*}': [],
    'column-4-{*}': [],
  },
};

/**
 * Default props with 2 columns
 */
export const twoColumnSplitterProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    EnabledPlaceholders: '1,2',
    RenderingIdentifier: 'column-splitter-1',
    styles: 'custom-column-style',
    ColumnWidth1: 'col-6',
    ColumnWidth2: 'col-6',
    Styles1: 'column-style-1',
    Styles2: 'column-style-2',
  },
  page: mockPage,
};

/**
 * Props with 3 columns
 */
export const threeColumnSplitterProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    EnabledPlaceholders: '1,2,3',
    RenderingIdentifier: 'column-splitter-3',
    styles: '',
    ColumnWidth1: 'col-4',
    ColumnWidth2: 'col-4',
    ColumnWidth3: 'col-4',
    Styles1: '',
    Styles2: '',
    Styles3: '',
  },
  page: mockPage,
};

/**
 * Props with 4 columns
 */
export const fourColumnSplitterProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    EnabledPlaceholders: '1,2,3,4',
    RenderingIdentifier: 'column-splitter-4',
    styles: 'four-column-layout',
    ColumnWidth1: 'col-3',
    ColumnWidth2: 'col-3',
    ColumnWidth3: 'col-3',
    ColumnWidth4: 'col-3',
  },
  page: mockPage,
};

/**
 * Props with single column
 */
export const singleColumnSplitterProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    EnabledPlaceholders: '1',
    RenderingIdentifier: 'column-splitter-single',
    styles: '',
    ColumnWidth1: 'col-12',
  },
  page: mockPage,
};

/**
 * Props with no enabled placeholders
 */
export const noColumnsSplitterProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    EnabledPlaceholders: '',
    RenderingIdentifier: 'column-splitter-empty',
    styles: '',
  },
  page: mockPage,
};

/**
 * Props with missing EnabledPlaceholders
 */
export const missingPlaceholdersProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'column-splitter-missing',
    styles: 'test-style',
  },
  page: mockPage,
};

/**
 * Props with varying column widths
 */
export const varyingWidthsProps: ColumnSplitterProps = {
  rendering: mockRendering,
  params: {
    EnabledPlaceholders: '1,2',
    RenderingIdentifier: 'column-splitter-varying',
    styles: '',
    ColumnWidth1: 'col-8',
    ColumnWidth2: 'col-4',
    Styles1: 'primary-column',
    Styles2: 'sidebar-column',
  },
  page: mockPage,
};
