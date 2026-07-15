import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ColumnSplitter } from '@/components/sxa/ColumnSplitter';
import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithTwoColumns,
  propsWithOneColumn,
  propsWithoutColumnWidths,
  propsWithoutColumnStyles,
  propsWithNoColumns,
  propsWithMaxColumns,
} from './ColumnSplitter.mockProps';

// Type definition for AppPlaceholder mock
interface MockAppPlaceholderProps {
  name?: string;
  rendering?: ComponentRendering;
}

// Mock the Placeholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  AppPlaceholder: ({ name, rendering }: MockAppPlaceholderProps) => (
    <div data-testid={`placeholder-${name || 'undefined'}`} data-rendering={rendering?.componentName}>
      Placeholder Content for {name || 'undefined'}
    </div>
  ),
}));

describe('ColumnSplitter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render column splitter with default structure', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toBeInTheDocument();
      expect(splitter).toHaveClass('custom-splitter-style');
    });

    it('should have correct rendering identifier', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toHaveAttribute('id', 'column-splitter-id');
    });

    it('should render correct number of columns based on EnabledPlaceholders', () => {
      render(<ColumnSplitter {...defaultProps} />);

      expect(screen.getByTestId('placeholder-column-1-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-column-2-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-column-3-{*}')).toBeInTheDocument();
    });
  });

  describe('Column configuration', () => {
    it('should apply correct column widths', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns[0]).toHaveClass('col-4', 'custom-style-1');
      expect(columns[1]).toHaveClass('col-4', 'custom-style-2');
      expect(columns[2]).toHaveClass('col-4', 'custom-style-3');
    });

    it('should render two columns correctly', () => {
      const { container } = render(<ColumnSplitter {...propsWithTwoColumns} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns.length).toBe(2);
      expect(columns[0]).toHaveClass('col-6', 'first-column');
      expect(columns[1]).toHaveClass('col-6', 'second-column');
    });

    it('should render single column correctly', () => {
      const { container } = render(<ColumnSplitter {...propsWithOneColumn} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns.length).toBe(1);
      expect(columns[0]).toHaveClass('col-12', 'full-width');
    });

    it('should render maximum columns (8) correctly', () => {
      render(<ColumnSplitter {...propsWithMaxColumns} />);

      for (let i = 1; i <= 8; i++) {
        expect(screen.getByTestId(`placeholder-column-${i}-{*}`)).toBeInTheDocument();
      }
    });
  });

  describe('Column styles and widths', () => {
    it('should handle columns without specified widths', () => {
      const { container } = render(<ColumnSplitter {...propsWithoutColumnWidths} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns.length).toBe(2);
      // Columns should still render but without width classes
      expect(columns[0]).toBeInTheDocument();
      expect(columns[1]).toBeInTheDocument();
    });

    it('should handle columns without specified styles', () => {
      const { container } = render(<ColumnSplitter {...propsWithoutColumnStyles} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns[0]).toHaveClass('col-6');
      expect(columns[1]).toHaveClass('col-6');
    });

    it('should apply column-specific styles correctly', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns[0]).toHaveClass('custom-style-1');
      expect(columns[1]).toHaveClass('custom-style-2');
      expect(columns[2]).toHaveClass('custom-style-3');
    });
  });

  describe('Placeholder rendering', () => {
    it('should render placeholders with correct names', () => {
      render(<ColumnSplitter {...defaultProps} />);

      const placeholder1 = screen.getByTestId('placeholder-column-1-{*}');
      const placeholder2 = screen.getByTestId('placeholder-column-2-{*}');
      const placeholder3 = screen.getByTestId('placeholder-column-3-{*}');

      expect(placeholder1).toHaveAttribute('data-rendering', 'ColumnSplitter');
      expect(placeholder2).toHaveAttribute('data-rendering', 'ColumnSplitter');
      expect(placeholder3).toHaveAttribute('data-rendering', 'ColumnSplitter');
    });

    it('should wrap placeholders in row divs', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      columns.forEach((column) => {
        const rowDiv = column.querySelector('.row');
        expect(rowDiv).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty EnabledPlaceholders', () => {
      const { container } = render(<ColumnSplitter {...propsWithNoColumns} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toBeInTheDocument();
      
      // Empty string splits to [''], resulting in one empty column
      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns.length).toBe(1);
    });

    it('should handle undefined EnabledPlaceholders', () => {
      const propsWithUndefined = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          EnabledPlaceholders: undefined,
        } as unknown as typeof defaultProps.params,
        rendering: {
          ...defaultProps.rendering,
          params: {
            ...defaultProps.params,
            EnabledPlaceholders: undefined,
          } as unknown as typeof defaultProps.params,
        },
      };

      const { container } = render(<ColumnSplitter {...propsWithUndefined} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toBeInTheDocument();
      
      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns.length).toBe(0);
    });

    it('should handle missing params gracefully', () => {
      const emptyParams = {} as typeof defaultProps.params;
      const propsWithoutParams = {
        rendering: {
          ...defaultProps.rendering,
          params: emptyParams,
        },
        params: emptyParams,
        page: defaultProps.page,
      };

      const { container } = render(<ColumnSplitter {...propsWithoutParams} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should handle missing RenderingIdentifier', () => {
      const propsWithoutId = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          RenderingIdentifier: undefined,
        } as unknown as typeof defaultProps.params,
        rendering: {
          ...defaultProps.rendering,
          params: {
            ...defaultProps.params,
            RenderingIdentifier: undefined,
          } as unknown as typeof defaultProps.params,
        },
      };

      const { container } = render(<ColumnSplitter {...propsWithoutId} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).not.toHaveAttribute('id');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toHaveClass('row', 'component', 'column-splitter');

      const columns = splitter?.querySelectorAll(':scope > div');
      expect(columns?.length).toBe(3);

      columns?.forEach((column) => {
        const rowDiv = column.querySelector('.row');
        expect(rowDiv).toBeInTheDocument();
      });
    });

    it('should apply container styles to main wrapper', () => {
      const { container } = render(<ColumnSplitter {...defaultProps} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toHaveClass('custom-splitter-style');
    });

    it('should handle empty styles parameter', () => {
      const { container } = render(<ColumnSplitter {...propsWithOneColumn} />);

      const splitter = container.querySelector('.row.component.column-splitter');
      expect(splitter).toHaveClass('row', 'component', 'column-splitter');
      expect(splitter?.className).not.toContain('undefined');
    });
  });

  describe('Dynamic column numbering', () => {
    it('should handle non-sequential column numbers', () => {
      const propsWithNonSequential = {
        ...defaultProps,
        params: {
          EnabledPlaceholders: '2,5,7',
          ColumnWidth2: 'col-4',
          ColumnWidth5: 'col-4',
          ColumnWidth7: 'col-4',
          RenderingIdentifier: 'non-sequential',
          styles: '',
        },
        rendering: {
          ...defaultProps.rendering,
          params: {
            EnabledPlaceholders: '2,5,7',
            ColumnWidth2: 'col-4',
            ColumnWidth5: 'col-4',
            ColumnWidth7: 'col-4',
            RenderingIdentifier: 'non-sequential',
            styles: '',
          },
        },
      };

      render(<ColumnSplitter {...propsWithNonSequential} />);

      expect(screen.getByTestId('placeholder-column-2-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-column-5-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-column-7-{*}')).toBeInTheDocument();
    });

    it('should apply correct widths to non-sequential columns', () => {
      const propsWithNonSequential = {
        ...defaultProps,
        params: {
          EnabledPlaceholders: '3,6',
          ColumnWidth3: 'col-8',
          ColumnWidth6: 'col-4',
          Styles3: 'main-column',
          Styles6: 'sidebar-column',
          RenderingIdentifier: 'asymmetric',
          styles: 'asymmetric-layout',
        },
        rendering: {
          ...defaultProps.rendering,
          params: {
            EnabledPlaceholders: '3,6',
            ColumnWidth3: 'col-8',
            ColumnWidth6: 'col-4',
            Styles3: 'main-column',
            Styles6: 'sidebar-column',
            RenderingIdentifier: 'asymmetric',
            styles: 'asymmetric-layout',
          },
        },
      };

      const { container } = render(<ColumnSplitter {...propsWithNonSequential} />);

      const columns = container.querySelectorAll('.row.component.column-splitter > div');
      expect(columns[0]).toHaveClass('col-8', 'main-column');
      expect(columns[1]).toHaveClass('col-4', 'sidebar-column');
    });
  });
});

