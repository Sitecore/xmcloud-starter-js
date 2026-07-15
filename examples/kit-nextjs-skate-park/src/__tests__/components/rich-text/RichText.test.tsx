import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as RichText } from '../../../components/rich-text/RichText';
import {
  mockRichTextProps,
  mockRichTextPropsSimple,
  mockRichTextPropsEmpty,
  mockRichTextPropsNoFields,
} from './RichText.mockProps';

const getRichTextComponent = () => document.querySelector('.rich-text');

describe('RichText Component should', () => {
  it('render without crashing', () => {
    render(<RichText {...mockRichTextProps} />);
    expect(getRichTextComponent()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<RichText {...mockRichTextProps} />);
    expect(getRichTextComponent()).toHaveClass('component', 'rich-text', 'richtext-styles');
  });

  it('have correct ID attribute', () => {
    render(<RichText {...mockRichTextProps} />);
    expect(getRichTextComponent()).toHaveAttribute('id', 'richtext-test-id');
  });

  it('render rich text content with HTML formatting', () => {
    render(<RichText {...mockRichTextProps} />);
    const boldText = screen.getByText('bold');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');

    const italicText = screen.getByText('emphasis');
    expect(italicText).toBeInTheDocument();
    expect(italicText.tagName).toBe('EM');
  });

  it('render simple paragraph text', () => {
    render(<RichText {...mockRichTextPropsSimple} />);
    expect(screen.getByText('Simple paragraph text.')).toBeInTheDocument();
  });

  it('apply different styles correctly', () => {
    render(<RichText {...mockRichTextPropsSimple} />);
    expect(getRichTextComponent()).toHaveClass('component', 'rich-text', 'simple-styles');
  });

  it('handle empty text gracefully', () => {
    render(<RichText {...mockRichTextPropsEmpty} />);
    const componentDiv = getRichTextComponent();
    expect(componentDiv).toBeInTheDocument();
    expect(componentDiv).toHaveAttribute('id', 'richtext-empty-id');
  });

  it('show empty hint when no fields are provided', () => {
    render(<RichText {...mockRichTextPropsNoFields} />);
    const emptyHint = screen.getByText('Rich text');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });

  it('render component-content div', () => {
    render(<RichText {...mockRichTextProps} />);
    expect(document.querySelector('.component-content')).toBeInTheDocument();
  });
});

describe('RichText Component Error Handling should', () => {
  it('handle null fields gracefully', () => {
    render(<RichText {...{ ...mockRichTextPropsNoFields, fields: null as unknown as typeof mockRichTextPropsNoFields.fields }} />);
    expect(screen.getByText('Rich text')).toBeInTheDocument();
  });

  it('handle undefined params gracefully', () => {
    render(<RichText {...{ ...mockRichTextProps, params: {} as typeof mockRichTextProps.params }} />);
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('render without styles parameter', () => {
    render(<RichText {...{ ...mockRichTextProps, params: { RenderingIdentifier: 'test-id' } as typeof mockRichTextProps.params }} />);
    expect(screen.getByText('bold')).toBeInTheDocument();
  });
});
