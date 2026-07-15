import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as RowSplitter } from '../../../components/row-splitter/RowSplitter';
import {
  mockRowSplitterProps,
  mockRowSplitterPropsTwo,
  mockRowSplitterPropsSingle,
  mockRowSplitterPropsNoStyles,
  mockRowSplitterPropsMax,
  mockRowSplitterPropsEmpty,
} from './RowSplitter.mockProps';

const getRowSplitterDiv = () => document.querySelector('.row-splitter');
const getRowDivs = () => document.querySelectorAll('.container-fluid');

describe('RowSplitter Component should', () => {
  it('render without crashing', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    expect(getRowSplitterDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    expect(getRowSplitterDiv()).toHaveClass('component', 'row-splitter', 'rowsplitter-styles');
  });

  it('have correct ID attribute', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    expect(getRowSplitterDiv()).toHaveAttribute('id', 'rowsplitter-test-id');
  });

  it('render correct number of rows based on EnabledPlaceholders', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    expect(getRowDivs()).toHaveLength(3);
  });

  it('apply custom styles to each row', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    const rowDivs = getRowDivs();
    expect(rowDivs[0]).toHaveClass('first-row-style');
    expect(rowDivs[1]).toHaveClass('second-row-style');
    expect(rowDivs[2]).toHaveClass('third-row-style');
  });

  it('render placeholders for each row', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    expect(screen.getByTestId('placeholder-row-1-{*}')).toBeInTheDocument();
    expect(screen.getByTestId('placeholder-row-2-{*}')).toBeInTheDocument();
    expect(screen.getByTestId('placeholder-row-3-{*}')).toBeInTheDocument();
  });

  it('render two rows with different styles', () => {
    render(<RowSplitter {...mockRowSplitterPropsTwo} />);
    expect(getRowDivs()).toHaveLength(2);
    const rowDivs = getRowDivs();
    expect(rowDivs[0]).toHaveClass('hero-section');
    expect(rowDivs[1]).toHaveClass('content-section');
  });

  it('render single row', () => {
    render(<RowSplitter {...mockRowSplitterPropsSingle} />);
    expect(getRowDivs()).toHaveLength(1);
    expect(getRowDivs()[0]).toHaveClass('full-page-style');
  });

  it('handle missing styles parameters', () => {
    render(<RowSplitter {...mockRowSplitterPropsNoStyles} />);
    expect(getRowDivs()).toHaveLength(3);
  });

  it('render maximum number of rows (8)', () => {
    render(<RowSplitter {...mockRowSplitterPropsMax} />);
    expect(getRowDivs()).toHaveLength(8);
  });

  it('handle empty EnabledPlaceholders parameter', () => {
    render(<RowSplitter {...mockRowSplitterPropsEmpty} />);
    expect(getRowDivs()).toHaveLength(1);
    expect(screen.getByTestId('placeholder-row-0-{*}')).toBeInTheDocument();
  });

  it('render container-fluid divs for rows', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);
    expect(document.querySelectorAll('.container-fluid')).toHaveLength(3);
  });

  it('generate correct placeholder names with row numbers', () => {
    render(<RowSplitter {...mockRowSplitterPropsTwo} />);
    expect(screen.getByTestId('placeholder-row-1-{*}')).toHaveTextContent('Placeholder: row-1-{*}');
    expect(screen.getByTestId('placeholder-row-2-{*}')).toHaveTextContent('Placeholder: row-2-{*}');
  });
});

describe('RowSplitter Component Error Handling should', () => {
  it('handle undefined EnabledPlaceholders', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { EnabledPlaceholders, ...paramsWithoutEnabled } = mockRowSplitterProps.params;
    render(<RowSplitter {...{ ...mockRowSplitterProps, params: paramsWithoutEnabled }} />);
    expect(getRowSplitterDiv()).toBeInTheDocument();
  });

  it('handle missing Styles parameters', () => {
    render(<RowSplitter {...mockRowSplitterPropsNoStyles} />);
    expect(getRowDivs()).toHaveLength(3);
  });

  it('handle non-numeric placeholder values', () => {
    render(<RowSplitter {...{ ...mockRowSplitterProps, params: { ...mockRowSplitterProps.params, EnabledPlaceholders: 'abc,xyz' } }} />);
    expect(getRowSplitterDiv()).toBeInTheDocument();
  });

  it('handle empty params object', () => {
    render(<RowSplitter {...{ ...mockRowSplitterProps, params: {} as typeof mockRowSplitterProps.params }} />);
    expect(getRowSplitterDiv()).toBeInTheDocument();
  });
});
