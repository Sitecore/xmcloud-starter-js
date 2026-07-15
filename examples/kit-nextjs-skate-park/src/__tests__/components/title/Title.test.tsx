import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Title } from '../../../components/title/Title';
import { mockTitleProps, mockTitlePropsEditing, mockTitlePropsNoFields } from './Title.mockProps';

const getTitleElement = (text: string) => screen.getByText(text).closest('.component');

describe('Title Component should', () => {
  it('render without crashing', () => {
    render(<Title {...mockTitleProps} />);
    expect(screen.getByText('Test Title from Datasource')).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Title {...mockTitleProps} />);
    expect(getTitleElement('Test Title from Datasource')).toHaveClass('component', 'title', 'test-styles');
  });

  it('have correct ID attribute', () => {
    render(<Title {...mockTitleProps} />);
    expect(getTitleElement('Test Title from Datasource')).toHaveAttribute('id', 'test-id');
  });

  it('render with different styles', () => {
    render(<Title {...mockTitlePropsEditing} />);
    expect(getTitleElement('Editing Mode Title')).toHaveClass('component', 'title', 'editing-styles');
  });

  it('render with different ID', () => {
    render(<Title {...mockTitlePropsEditing} />);
    expect(getTitleElement('Editing Mode Title')).toHaveAttribute('id', 'editing-id');
  });

  it('handle missing fields gracefully', () => {
    render(<Title {...mockTitlePropsNoFields} />);
    const component = document.querySelector('.component.title');
    expect(component).toBeInTheDocument();
  });

  it('render as a link in preview mode', () => {
    render(<Title {...mockTitleProps} />);
    const linkElement = screen.getByText('Test Title from Datasource').closest('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-page');
  });
});

describe('Title Component Accessibility should', () => {
  it('have accessible links with proper href', () => {
    render(<Title {...mockTitleProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-page');
  });

  it('have descriptive link text', () => {
    render(<Title {...mockTitleProps} />);
    expect(screen.getByRole('link', { name: /Test Title from Datasource/i })).toBeInTheDocument();
  });

  it('maintain accessibility with different content', () => {
    render(<Title {...mockTitlePropsEditing} />);
    // In editing mode, the title is not wrapped in a link
    expect(screen.getByText('Editing Mode Title')).toBeInTheDocument();
  });
});

describe('Title Component Edge Cases should', () => {
  it('render correct DOM structure', () => {
    render(<Title {...mockTitleProps} />);
    const container = getTitleElement('Test Title from Datasource');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('component', 'title');
    
    const contentDiv = container?.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
    
    const fieldTitle = contentDiv?.querySelector('.field-title');
    expect(fieldTitle).toBeInTheDocument();
  });

  it('handle missing params gracefully', () => {
    const propsWithoutParams = {
      ...mockTitleProps,
      params: {} as typeof mockTitleProps.params,
    };
    
    render(<Title {...propsWithoutParams} />);
    expect(screen.getByText('Test Title from Datasource')).toBeInTheDocument();
  });

  it('handle null fields gracefully', () => {
    const propsWithNullFields = {
      ...mockTitleProps,
      fields: null as unknown as typeof mockTitleProps.fields,
    };
    
    render(<Title {...propsWithNullFields} />);
    const component = document.querySelector('.component.title');
    expect(component).toBeInTheDocument();
  });

  it('handle undefined fields gracefully', () => {
    const propsWithUndefinedFields = {
      ...mockTitleProps,
      fields: undefined as unknown as typeof mockTitleProps.fields,
    };
    
    render(<Title {...propsWithUndefinedFields} />);
    const component = document.querySelector('.component.title');
    expect(component).toBeInTheDocument();
  });

  it('handle missing rendering identifier', () => {
    const propsWithoutId = {
      ...mockTitleProps,
      params: {
        styles: 'test-styles',
      } as typeof mockTitleProps.params,
    };
    
    render(<Title {...propsWithoutId} />);
    expect(screen.getByText('Test Title from Datasource')).toBeInTheDocument();
  });
});
