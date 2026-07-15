import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as ColumnSplitter } from '../../../components/column-splitter/ColumnSplitter';
import {
  mockColumnSplitterProps,
  mockColumnSplitterPropsTwo,
  mockColumnSplitterPropsSingle,
  mockColumnSplitterPropsNoWidths,
  mockColumnSplitterPropsMax,
  mockColumnSplitterPropsEmpty,
} from './ColumnSplitter.mockProps';
import { mockPage } from '../../mocks/mockPage';

const getColumnSplitterDiv = () => document.querySelector('.column-splitter');
const getRowDivs = () => document.querySelectorAll('.row .row');
const getColumnDivs = () => Array.from(getColumnSplitterDiv()?.children || []);

describe('ColumnSplitter Component should', () => {
  it('render without crashing', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    expect(getColumnSplitterDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    expect(getColumnSplitterDiv()).toHaveClass('row', 'component', 'column-splitter', 'columnsplitter-styles');
  });

  it('have correct ID attribute', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    expect(getColumnSplitterDiv()).toHaveAttribute('id', 'columnsplitter-test-id');
  });

  it('render correct number of columns based on EnabledPlaceholders', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    expect(getRowDivs()).toHaveLength(3);
  });

  it('apply column width classes to each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    const columnDivs = getColumnDivs();
    expect(columnDivs[0]).toHaveClass('col-4');
    expect(columnDivs[1]).toHaveClass('col-4');
    expect(columnDivs[2]).toHaveClass('col-4');
  });

  it('apply custom styles to each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    const columnDivs = getColumnDivs();
    expect(columnDivs[0]).toHaveClass('first-column-style');
    expect(columnDivs[1]).toHaveClass('second-column-style');
    expect(columnDivs[2]).toHaveClass('third-column-style');
  });

  it('render placeholders for each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);
    expect(screen.getByTestId('placeholder-column-1-{*}')).toBeInTheDocument();
    expect(screen.getByTestId('placeholder-column-2-{*}')).toBeInTheDocument();
    expect(screen.getByTestId('placeholder-column-3-{*}')).toBeInTheDocument();
  });

  it('render two columns with different widths', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsTwo} />);
    expect(getRowDivs()).toHaveLength(2);
    const columnDivs = getColumnDivs();
    expect(columnDivs[0]).toHaveClass('col-8');
    expect(columnDivs[1]).toHaveClass('col-4');
  });

  it('render single column with full width', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsSingle} />);
    expect(getRowDivs()).toHaveLength(1);
    expect(getColumnDivs()[0]).toHaveClass('col-12');
  });

  it('handle missing column width parameters', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsNoWidths} />);
    expect(getRowDivs()).toHaveLength(2);
  });

  it('render maximum number of columns (8)', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsMax} />);
    expect(getRowDivs()).toHaveLength(8);
  });

  it('handle empty EnabledPlaceholders parameter', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsEmpty} />);
    expect(getRowDivs()).toHaveLength(1);
    expect(screen.getByTestId('placeholder-column--{*}')).toBeInTheDocument();
  });

  it('generate correct placeholder names with column numbers', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsTwo} />);
    expect(screen.getByTestId('placeholder-column-1-{*}')).toHaveTextContent('Placeholder: column-1-{*}');
    expect(screen.getByTestId('placeholder-column-2-{*}')).toHaveTextContent('Placeholder: column-2-{*}');
  });
});

describe('ColumnSplitter Component Error Handling should', () => {
  it('handle undefined EnabledPlaceholders', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { EnabledPlaceholders, ...paramsWithoutEnabled } = mockColumnSplitterProps.params;
    render(<ColumnSplitter {...{ ...mockColumnSplitterProps, params: paramsWithoutEnabled, page: mockPage }} />);
    expect(getColumnSplitterDiv()).toBeInTheDocument();
  });

  it('handle missing ColumnWidth parameters', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsNoWidths} />);
    expect(getRowDivs()).toHaveLength(2);
  });

  it('handle missing Styles parameters', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Styles1, Styles2, Styles3, ...paramsWithoutStyles } = mockColumnSplitterProps.params;
    render(<ColumnSplitter {...{ ...mockColumnSplitterProps, params: paramsWithoutStyles, page: mockPage }} />);
    expect(getRowDivs()).toHaveLength(3);
  });

  it('handle non-numeric placeholder values', () => {
    render(<ColumnSplitter {...{ ...mockColumnSplitterProps, params: { ...mockColumnSplitterProps.params, EnabledPlaceholders: 'abc,def' }, page: mockPage }} />);
    expect(getColumnSplitterDiv()).toBeInTheDocument();
  });
});
