import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as RowSplitter } from '@/components/sxa/RowSplitter';
import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithTwoRows,
  propsWithOneRow,
  propsWithoutRowStyles,
  propsWithNoRows,
  propsWithMaxRows,
  propsWithNonSequentialRows,
  propsWithoutStyles,
  propsWithoutId,
  propsWithUndefinedParams,
} from './RowSplitter.mockProps';

// Type definitions for mock components
interface MockAppPlaceholderProps {
  name?: string;
  rendering?: ComponentRendering;
}

// Mock the AppPlaceholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  AppPlaceholder: ({ name, rendering }: MockAppPlaceholderProps) => (
    <div data-testid={`placeholder-${name || 'empty'}`} data-rendering={rendering?.componentName}>
      Placeholder Content for {name || 'empty'}
    </div>
  ),
}));

describe('RowSplitter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render row splitter with default structure', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toBeInTheDocument();
      expect(splitter).toHaveClass('custom-row-splitter-style');
    });

    it('should have correct rendering identifier', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toHaveAttribute('id', 'row-splitter-id');
    });

    it('should render correct number of rows based on EnabledPlaceholders', () => {
      render(<RowSplitter {...defaultProps} />);

      expect(screen.getByTestId('placeholder-row-1-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-row-2-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-row-3-{*}')).toBeInTheDocument();
    });
  });

  describe('Row configuration', () => {
    it('should apply correct row styles', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0]).toHaveClass('container-fluid', 'row-style-1');
      expect(rows[1]).toHaveClass('container-fluid', 'row-style-2');
      expect(rows[2]).toHaveClass('container-fluid', 'row-style-3');
    });

    it('should render two rows correctly', () => {
      const { container } = render(<RowSplitter {...propsWithTwoRows} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows.length).toBe(2);
      expect(rows[0]).toHaveClass('container-fluid', 'first-row');
      expect(rows[1]).toHaveClass('container-fluid', 'second-row');
    });

    it('should render single row correctly', () => {
      const { container } = render(<RowSplitter {...propsWithOneRow} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows.length).toBe(1);
      expect(rows[0]).toHaveClass('container-fluid', 'single-row');
    });

    it('should render maximum rows (8) correctly', () => {
      render(<RowSplitter {...propsWithMaxRows} />);

      for (let i = 1; i <= 8; i++) {
        expect(screen.getByTestId(`placeholder-row-${i}-{*}`)).toBeInTheDocument();
      }
    });
  });

  describe('Row styles', () => {
    it('should handle rows without specified styles', () => {
      const { container } = render(<RowSplitter {...propsWithoutRowStyles} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows.length).toBe(2);
      expect(rows[0]).toHaveClass('container-fluid');
      expect(rows[1]).toHaveClass('container-fluid');
    });

    it('should trim trailing whitespace from row styles', () => {
      const propsWithTrailingSpace = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          Styles1: 'row-style-1   ',
        },
        rendering: {
          ...defaultProps.rendering,
          params: {
            ...defaultProps.params,
            Styles1: 'row-style-1   ',
          },
        },
        page: defaultProps.page,
      };

      const { container } = render(<RowSplitter {...propsWithTrailingSpace} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0].className).toBe('container-fluid row-style-1');
    });

    it('should apply row-specific styles correctly', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0]).toHaveClass('row-style-1');
      expect(rows[1]).toHaveClass('row-style-2');
      expect(rows[2]).toHaveClass('row-style-3');
    });
  });

  describe('Placeholder rendering', () => {
    it('should render placeholders with correct names', () => {
      render(<RowSplitter {...defaultProps} />);

      const placeholder1 = screen.getByTestId('placeholder-row-1-{*}');
      const placeholder2 = screen.getByTestId('placeholder-row-2-{*}');
      const placeholder3 = screen.getByTestId('placeholder-row-3-{*}');

      expect(placeholder1).toHaveAttribute('data-rendering', 'RowSplitter');
      expect(placeholder2).toHaveAttribute('data-rendering', 'RowSplitter');
      expect(placeholder3).toHaveAttribute('data-rendering', 'RowSplitter');
    });

    it('should wrap placeholders in row divs', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      rows.forEach((row) => {
        const innerDiv = row.querySelector('div > .row');
        expect(innerDiv).toBeInTheDocument();
      });
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toHaveClass('component', 'row-splitter');

      const rows = splitter?.querySelectorAll(':scope > .container-fluid');
      expect(rows?.length).toBe(3);

      rows?.forEach((row) => {
        const innerDiv = row.querySelector('div');
        expect(innerDiv).toBeInTheDocument();

        const rowDiv = innerDiv?.querySelector('.row');
        expect(rowDiv).toBeInTheDocument();
      });
    });

    it('should apply container-fluid class to each row wrapper', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      rows.forEach((row) => {
        expect(row).toHaveClass('container-fluid');
      });
    });

    it('should nest row div inside container-fluid', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      rows.forEach((row) => {
        const rowDiv = row.querySelector('div > .row');
        expect(rowDiv).toBeInTheDocument();
      });
    });
  });

  describe('Styles and parameters', () => {
    it('should handle empty styles parameter', () => {
      const { container } = render(<RowSplitter {...propsWithoutStyles} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toHaveClass('component', 'row-splitter');
      expect(splitter?.className).not.toContain('undefined');
    });

    it('should handle empty RenderingIdentifier', () => {
      const { container } = render(<RowSplitter {...propsWithoutId} />);

      const splitter = container.querySelector('.component.row-splitter');
      // Empty string renders as id=""
      expect(splitter).toHaveAttribute('id', '');
    });

    it('should apply container styles to main wrapper', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toHaveClass('custom-row-splitter-style');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty EnabledPlaceholders', () => {
      const { container } = render(<RowSplitter {...propsWithNoRows} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toBeInTheDocument();

      // Empty string splits to [''], resulting in one empty row
      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows.length).toBe(1);
    });

    it('should handle undefined EnabledPlaceholders', () => {
      const propsWithUndefined = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          EnabledPlaceholders: undefined,
        },
        rendering: {
          ...defaultProps.rendering,
          params: {
            ...defaultProps.params,
            EnabledPlaceholders: undefined,
          },
        },
        page: defaultProps.page,
      };

      const { container } = render(<RowSplitter {...(propsWithUndefined as unknown as Parameters<typeof RowSplitter>[0])} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toBeInTheDocument();

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows.length).toBe(0);
    });

    it('should handle missing params gracefully', () => {
      const { container } = render(<RowSplitter {...propsWithUndefinedParams} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should handle missing RenderingIdentifier', () => {
      const propsWithUndefinedId = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          RenderingIdentifier: undefined,
        },
        rendering: {
          ...defaultProps.rendering,
          params: {
            ...defaultProps.params,
            RenderingIdentifier: undefined,
          },
        },
        page: defaultProps.page,
      };

      const { container } = render(<RowSplitter {...(propsWithUndefinedId as unknown as Parameters<typeof RowSplitter>[0])} />);

      const splitter = container.querySelector('.component.row-splitter');
      expect(splitter).not.toHaveAttribute('id');
    });
  });

  describe('Dynamic row numbering', () => {
    it('should handle non-sequential row numbers', () => {
      render(<RowSplitter {...propsWithNonSequentialRows} />);

      expect(screen.getByTestId('placeholder-row-2-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-row-5-{*}')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-row-7-{*}')).toBeInTheDocument();
    });

    it('should apply correct styles to non-sequential rows', () => {
      const { container } = render(<RowSplitter {...propsWithNonSequentialRows} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0]).toHaveClass('second-row');
      expect(rows[1]).toHaveClass('fifth-row');
      expect(rows[2]).toHaveClass('seventh-row');
    });

    it('should generate correct placeholder keys for non-sequential rows', () => {
      render(<RowSplitter {...propsWithNonSequentialRows} />);

      const placeholder2 = screen.getByTestId('placeholder-row-2-{*}');
      const placeholder5 = screen.getByTestId('placeholder-row-5-{*}');
      const placeholder7 = screen.getByTestId('placeholder-row-7-{*}');

      expect(placeholder2).toHaveTextContent('row-2-{*}');
      expect(placeholder5).toHaveTextContent('row-5-{*}');
      expect(placeholder7).toHaveTextContent('row-7-{*}');
    });
  });

  describe('Container fluid styling', () => {
    it('should apply container-fluid with row styles', () => {
      const { container } = render(<RowSplitter {...defaultProps} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0].className).toContain('container-fluid');
      expect(rows[0].className).toContain('row-style-1');
    });

    it('should handle empty row styles', () => {
      const { container } = render(<RowSplitter {...propsWithoutRowStyles} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0].className).toBe('container-fluid');
      expect(rows[1].className).toBe('container-fluid');
    });

    it('should trim trailing whitespace from combined classes', () => {
      const propsWithTrailingSpaces = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          Styles1: '   ',
        },
        rendering: {
          ...defaultProps.rendering,
          params: {
            ...defaultProps.params,
            Styles1: '   ',
          },
        },
        page: defaultProps.page,
      };

      const { container } = render(<RowSplitter {...propsWithTrailingSpaces} />);

      const rows = container.querySelectorAll('.component.row-splitter > .container-fluid');
      expect(rows[0].className).toBe('container-fluid');
    });
  });
});

