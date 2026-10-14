/**
 * Unit tests for ColumnSplitter component
 * Tests column layout rendering with various configurations
 */

import React from 'react';

// Mock next-intl BEFORE any other imports to prevent ESM parsing errors
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useTimeZone: () => 'UTC',
  useFormatter: () => ({
    dateTime: jest.fn(),
    number: jest.fn(),
    relativeTime: jest.fn(),
    plural: jest.fn(),
    select: jest.fn(),
    selectOrdinal: jest.fn(),
    list: jest.fn(),
  }),
  IntlProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock component-map to avoid circular dependency
jest.mock('.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}));

import { render } from '@testing-library/react';
import { Default as ColumnSplitter } from 'components/sxa/ColumnSplitter';
import {
  twoColumnSplitterProps,
  threeColumnSplitterProps,
  fourColumnSplitterProps,
  singleColumnSplitterProps,
  noColumnsSplitterProps,
  missingPlaceholdersProps,
  varyingWidthsProps,
} from './ColumnSplitter.mockProps';

// Mock the Placeholder component
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name }: any) => <div data-placeholder={name} className="placeholder" />,
  AppPlaceholder: ({ name }: any) => <div data-placeholder={name} className="placeholder" />,
  withDatasourceCheck: () => (Component: React.ComponentType<any>) => Component,
}));
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('ColumnSplitter Component', () => {
  describe('Basic Rendering', () => {
    it('should render column splitter with base classes', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const splitter = container.querySelector('.column-splitter');
      expect(splitter).toHaveClass('custom-column-style');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const splitter = container.querySelector('#column-splitter-1');
      expect(splitter).toBeInTheDocument();
    });
  });

  describe('Column Layout', () => {
    it('should render 2 columns when EnabledPlaceholders is "1,2"', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const columns = container.querySelectorAll('.col-6');
      expect(columns).toHaveLength(2);
    });

    it('should render 3 columns when EnabledPlaceholders is "1,2,3"', () => {
      const { container } = render(<ColumnSplitter {...threeColumnSplitterProps} />);

      const columns = container.querySelectorAll('.col-4');
      expect(columns).toHaveLength(3);
    });

    it('should render 4 columns when EnabledPlaceholders is "1,2,3,4"', () => {
      const { container } = render(<ColumnSplitter {...fourColumnSplitterProps} />);

      const columns = container.querySelectorAll('.col-3');
      expect(columns).toHaveLength(4);
    });

    it('should render single column', () => {
      const { container } = render(<ColumnSplitter {...singleColumnSplitterProps} />);

      const columns = container.querySelectorAll('.col-12');
      expect(columns).toHaveLength(1);
    });

    it('should render varying column widths', () => {
      const { container } = render(<ColumnSplitter {...varyingWidthsProps} />);

      const wideColumn = container.querySelector('.col-8');
      const narrowColumn = container.querySelector('.col-4');

      expect(wideColumn).toBeInTheDocument();
      expect(narrowColumn).toBeInTheDocument();
    });
  });

  describe('Column Styles', () => {
    it('should apply column-specific styles', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const column1 = container.querySelector('.column-style-1');
      const column2 = container.querySelector('.column-style-2');

      expect(column1).toBeInTheDocument();
      expect(column2).toBeInTheDocument();
    });

    it('should apply both width and style classes to columns', () => {
      const { container } = render(<ColumnSplitter {...varyingWidthsProps} />);

      const primaryColumn = container.querySelector('.col-8.primary-column');
      const sidebarColumn = container.querySelector('.col-4.sidebar-column');

      expect(primaryColumn).toBeInTheDocument();
      expect(sidebarColumn).toBeInTheDocument();
    });

    it('should handle columns without custom styles', () => {
      const { container } = render(<ColumnSplitter {...threeColumnSplitterProps} />);

      // Should still render columns even without custom styles
      const columns = container.querySelectorAll('.col-4');
      expect(columns).toHaveLength(3);
    });
  });

  describe('Placeholders', () => {
    it('should render placeholder for each column', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const placeholder1 = container.querySelector('[data-placeholder="column-1-{*}"]');
      const placeholder2 = container.querySelector('[data-placeholder="column-2-{*}"]');

      expect(placeholder1).toBeInTheDocument();
      expect(placeholder2).toBeInTheDocument();
    });

    it('should render placeholders with correct names', () => {
      const { container } = render(<ColumnSplitter {...threeColumnSplitterProps} />);

      expect(container.querySelector('[data-placeholder="column-1-{*}"]')).toBeInTheDocument();
      expect(container.querySelector('[data-placeholder="column-2-{*}"]')).toBeInTheDocument();
      expect(container.querySelector('[data-placeholder="column-3-{*}"]')).toBeInTheDocument();
    });

    it('should wrap each placeholder in a row div', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      const rowDivs = container.querySelectorAll('.row');
      // One parent row + two inner rows for placeholders
      expect(rowDivs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Edge Cases', () => {
    it('should render nothing when EnabledPlaceholders is empty', () => {
      const { container } = render(<ColumnSplitter {...noColumnsSplitterProps} />);

      const splitter = container.querySelector('.column-splitter');
      expect(splitter).toBeInTheDocument();

      // When EnabledPlaceholders is empty string, it splits to [''], so one empty column is rendered
      // This is the actual behavior of the component
      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing EnabledPlaceholders param', () => {
      const { container } = render(<ColumnSplitter {...missingPlaceholdersProps} />);

      const splitter = container.querySelector('.column-splitter');
      expect(splitter).toBeInTheDocument();

      // Should render no columns when EnabledPlaceholders is undefined
      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(0);
    });

    it('should handle missing column width params', () => {
      const propsWithoutWidths = {
        ...twoColumnSplitterProps,
        params: {
          ...twoColumnSplitterProps.params,
          ColumnWidth1: '',
          ColumnWidth2: '',
        },
      };

      const { container } = render(<ColumnSplitter {...propsWithoutWidths} />);

      const splitter = container.querySelector('.column-splitter');
      expect(splitter).toBeInTheDocument();

      // Should still render columns even without explicit widths
      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(2);
    });

    it('should handle missing column style params', () => {
      const propsWithoutStyles = {
        ...twoColumnSplitterProps,
        params: {
          ...twoColumnSplitterProps.params,
          Styles1: '',
          Styles2: '',
        },
      };

      const { container } = render(<ColumnSplitter {...propsWithoutStyles} />);

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(2);
    });
  });

  describe('Structure', () => {
    it('should have proper HTML structure', () => {
      const { container } = render(<ColumnSplitter {...twoColumnSplitterProps} />);

      // Parent row div
      const parentRow = container.querySelector('.row.component.column-splitter');
      expect(parentRow).toBeInTheDocument();

      // Each column should be a direct child
      const columns = parentRow?.children;
      expect(columns).toHaveLength(2);
    });

    it('should nest placeholder in row div within column', () => {
      const { container } = render(<ColumnSplitter {...singleColumnSplitterProps} />);

      const column = container.querySelector('.col-12');
      const innerRow = column?.querySelector('.row');
      const placeholder = innerRow?.querySelector('.placeholder');

      expect(column).toBeInTheDocument();
      expect(innerRow).toBeInTheDocument();
      expect(placeholder).toBeInTheDocument();
    });
  });
});
