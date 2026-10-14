/**
 * Unit tests for RowSplitter component
 * Tests row layout rendering with various configurations
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
import { Default as RowSplitter } from 'components/sxa/RowSplitter';
import {
  twoRowSplitterProps,
  threeRowSplitterProps,
  singleRowSplitterProps,
  noRowsSplitterProps,
  missingPlaceholdersProps,
} from './RowSplitter.mockProps';

// Mock the Placeholder component
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name }: any) => <div data-placeholder={name} className="placeholder" />,
  AppPlaceholder: ({ name }: any) => <div data-placeholder={name} className="placeholder" />,
  withDatasourceCheck: () => (Component: React.ComponentType<any>) => Component,
}));
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('RowSplitter Component', () => {
  describe('Basic Rendering', () => {
    it('should render row splitter with base classes', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const splitter = container.querySelector('.row-splitter');
      expect(splitter).toHaveClass('custom-row-style');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const splitter = container.querySelector('#row-splitter-1');
      expect(splitter).toBeInTheDocument();
    });
  });

  describe('Row Layout', () => {
    it('should render 2 rows when EnabledPlaceholders is "1,2"', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(2);
    });

    it('should render 3 rows when EnabledPlaceholders is "1,2,3"', () => {
      const { container } = render(<RowSplitter {...threeRowSplitterProps} />);

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(3);
    });

    it('should render single row', () => {
      const { container } = render(<RowSplitter {...singleRowSplitterProps} />);

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(1);
    });
  });

  describe('Row Styles', () => {
    it('should apply row-specific styles', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const row1 = container.querySelector('.row-style-1');
      const row2 = container.querySelector('.row-style-2');

      expect(row1).toBeInTheDocument();
      expect(row2).toBeInTheDocument();
    });

    it('should apply container-fluid class to each row wrapper', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const containerFluids = container.querySelectorAll('.container-fluid');
      expect(containerFluids.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle rows without custom styles', () => {
      const { container } = render(<RowSplitter {...threeRowSplitterProps} />);

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(3);
    });
  });

  describe('Placeholders', () => {
    it('should render placeholder for each row', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      const placeholder1 = container.querySelector('[data-placeholder="row-1-{*}"]');
      const placeholder2 = container.querySelector('[data-placeholder="row-2-{*}"]');

      expect(placeholder1).toBeInTheDocument();
      expect(placeholder2).toBeInTheDocument();
    });

    it('should render placeholders with correct names', () => {
      const { container } = render(<RowSplitter {...threeRowSplitterProps} />);

      expect(container.querySelector('[data-placeholder="row-1-{*}"]')).toBeInTheDocument();
      expect(container.querySelector('[data-placeholder="row-2-{*}"]')).toBeInTheDocument();
      expect(container.querySelector('[data-placeholder="row-3-{*}"]')).toBeInTheDocument();
    });

    it('should wrap each placeholder in proper div structure', () => {
      const { container } = render(<RowSplitter {...singleRowSplitterProps} />);

      const containerFluid = container.querySelector('.container-fluid');
      expect(containerFluid).toBeInTheDocument();

      const row = containerFluid?.querySelector('.row');
      expect(row).toBeInTheDocument();

      const placeholder = row?.querySelector('.placeholder');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty EnabledPlaceholders', () => {
      const { container } = render(<RowSplitter {...noRowsSplitterProps} />);

      const splitter = container.querySelector('.row-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should handle missing EnabledPlaceholders param', () => {
      const { container } = render(<RowSplitter {...missingPlaceholdersProps} />);

      const splitter = container.querySelector('.row-splitter');
      expect(splitter).toBeInTheDocument();

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(0);
    });

    it('should handle missing row style params', () => {
      const propsWithoutStyles = {
        ...twoRowSplitterProps,
        params: {
          ...twoRowSplitterProps.params,
          Styles1: '',
          Styles2: '',
        },
      };

      const { container } = render(<RowSplitter {...propsWithoutStyles} />);

      const placeholders = container.querySelectorAll('.placeholder');
      expect(placeholders).toHaveLength(2);
    });
  });

  describe('Structure', () => {
    it('should have proper HTML structure', () => {
      const { container } = render(<RowSplitter {...twoRowSplitterProps} />);

      // Parent div with component class
      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toBeInTheDocument();

      // Each row wrapper should be container-fluid
      const containerFluids = splitter?.querySelectorAll('.container-fluid');
      expect(containerFluids?.length).toBeGreaterThanOrEqual(2);
    });

    it('should nest placeholder properly', () => {
      const { container } = render(<RowSplitter {...singleRowSplitterProps} />);

      // Structure: .row-splitter > .container-fluid > div > .row > Placeholder
      const splitter = container.querySelector('.row-splitter');
      const containerFluid = splitter?.querySelector('.container-fluid');
      const row = containerFluid?.querySelector('.row');
      const placeholder = row?.querySelector('.placeholder');

      expect(splitter).toBeInTheDocument();
      expect(containerFluid).toBeInTheDocument();
      expect(row).toBeInTheDocument();
      expect(placeholder).toBeInTheDocument();
    });
  });
});
