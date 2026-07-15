import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as PageContent } from '../../../components/page-content/PageContent';
import {
  mockPageContentProps,
  mockPageContentPropsRich,
  mockPageContentPropsSimple,
  mockPageContentPropsNoContent,
  mockPageContentPropsEmpty,
} from './PageContent.mockProps';

const getContentDiv = () => document.querySelector('.content');

describe('PageContent Component should', () => {
  it('render without crashing', () => {
    render(<PageContent {...mockPageContentProps} />);
    expect(getContentDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<PageContent {...mockPageContentProps} />);
    expect(getContentDiv()).toHaveClass('component', 'content', 'pagecontent-styles');
  });

  it('have correct ID attribute', () => {
    render(<PageContent {...mockPageContentProps} />);
    expect(getContentDiv()).toHaveAttribute('id', 'pagecontent-test-id');
  });

  it('render content with HTML formatting', () => {
    render(<PageContent {...mockPageContentProps} />);
    const strongText = screen.getByText('formatting');
    expect(strongText).toBeInTheDocument();
    expect(strongText.tagName).toBe('STRONG');

    const emText = screen.getByText('styles');
    expect(emText).toBeInTheDocument();
    expect(emText.tagName).toBe('EM');
  });

  it('render rich HTML content', () => {
    render(<PageContent {...mockPageContentPropsRich} />);
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText(/Paragraph with/)).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('render simple paragraph content', () => {
    render(<PageContent {...mockPageContentPropsSimple} />);
    expect(screen.getByText('Simple page content text.')).toBeInTheDocument();
  });

  it('show placeholder when no content field', () => {
    render(<PageContent {...mockPageContentPropsNoContent} />);
    expect(screen.getByText('[Content]')).toBeInTheDocument();
  });

  it('handle empty content gracefully', () => {
    render(<PageContent {...mockPageContentPropsEmpty} />);
    expect(getContentDiv()).toBeInTheDocument();
  });

  it('render component-content div', () => {
    render(<PageContent {...mockPageContentProps} />);
    expect(document.querySelector('.component-content')).toBeInTheDocument();
  });

  it('render field-content div', () => {
    render(<PageContent {...mockPageContentProps} />);
    expect(document.querySelector('.field-content')).toBeInTheDocument();
  });

  it('render content inside proper nested structure', () => {
    render(<PageContent {...mockPageContentProps} />);
    const contentDiv = getContentDiv();
    const componentContentDiv = contentDiv?.querySelector('.component-content');
    const fieldContentDiv = componentContentDiv?.querySelector('.field-content');

    expect(contentDiv).toBeInTheDocument();
    expect(componentContentDiv).toBeInTheDocument();
    expect(fieldContentDiv).toBeInTheDocument();
  });
});

describe('PageContent Component Error Handling should', () => {
  it('handle null Content field', () => {
    render(<PageContent {...{ ...mockPageContentProps, fields: { Content: null as unknown as typeof mockPageContentProps.fields.Content } }} />);
    expect(screen.getByText('[Content]')).toBeInTheDocument();
  });

  it('handle undefined fields object', () => {
    render(<PageContent {...{ ...mockPageContentProps, fields: undefined as unknown as typeof mockPageContentProps.fields }} />);
    expect(screen.getByText('[Content]')).toBeInTheDocument();
  });

  it('render without params', () => {
    render(<PageContent {...{ ...mockPageContentProps, params: {} as typeof mockPageContentProps.params }} />);
    expect(screen.getByText('formatting')).toBeInTheDocument();
  });
});
