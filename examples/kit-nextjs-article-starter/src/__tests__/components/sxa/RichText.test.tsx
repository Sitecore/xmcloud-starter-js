import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as RichText } from '@/components/sxa/RichText';
import type { Field } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithSimpleText,
  propsWithEmptyText,
  propsWithoutStyles,
  propsWithTrailingSpaces,
  propsWithoutId,
  propsWithoutFields,
  propsWithoutTextField,
  propsWithNullFields,
  propsWithNullTextField,
  propsWithUndefinedId,
} from './RichText.mockProps';

// Type definitions for mock components
interface MockRichTextProps {
  field?: Field<string>;
}

// Mock Sitecore SDK RichText component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field }: MockRichTextProps) => (
    <div data-testid="rich-text-content">
      {field?.value || ''}
    </div>
  ),
}));

describe('RichText Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render rich text with default structure', () => {
      const { container } = render(<RichText {...defaultProps} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toBeInTheDocument();
      expect(richText).toHaveClass('custom-rich-text-style');
    });

    it('should render text content', () => {
      render(<RichText {...defaultProps} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('This is rich text content');
    });

    it('should have correct rendering identifier', () => {
      const { container } = render(<RichText {...defaultProps} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveAttribute('id', 'rich-text-id');
    });

    it('should render simple text correctly', () => {
      render(<RichText {...propsWithSimpleText} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toHaveTextContent('Simple text');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      const { container } = render(<RichText {...defaultProps} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toBeInTheDocument();

      const componentContent = richText?.querySelector('.component-content');
      expect(componentContent).toBeInTheDocument();

      const content = componentContent?.querySelector('[data-testid="rich-text-content"]');
      expect(content).toBeInTheDocument();
    });

    it('should combine component classes correctly', () => {
      const { container } = render(<RichText {...defaultProps} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveClass('component', 'rich-text', 'custom-rich-text-style');
    });
  });

  describe('Styles and parameters', () => {
    it('should handle empty styles parameter', () => {
      const { container } = render(<RichText {...propsWithoutStyles} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveClass('component', 'rich-text');
    });

    it('should trim trailing whitespace from styles', () => {
      const { container } = render(<RichText {...propsWithTrailingSpaces} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveClass('component', 'rich-text', 'custom-style');
    });

    it('should handle empty RenderingIdentifier', () => {
      const { container } = render(<RichText {...propsWithoutId} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).not.toHaveAttribute('id');
    });

    it('should handle undefined RenderingIdentifier', () => {
      const { container } = render(<RichText {...propsWithUndefinedId} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).not.toHaveAttribute('id');
    });

    it('should handle params without styles', () => {
      const propsWithoutStylesParam = {
        ...defaultProps,
        params: {
          RenderingIdentifier: 'test-id',
          styles: '',
        },
      };

      const { container } = render(<RichText {...propsWithoutStylesParam} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toBeInTheDocument();
    });
  });

  describe('Fallback rendering', () => {
    it('should render fallback when fields is missing', () => {
      const { container } = render(<RichText {...propsWithoutFields} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toBeInTheDocument();

      const componentContent = richText?.querySelector('.component-content');
      const fallback = componentContent?.querySelector('.is-empty-hint');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Rich text');
    });

    it('should render fallback when fields is null', () => {
      const { container } = render(<RichText {...propsWithNullFields} />);

      const componentContent = container.querySelector('.component-content');
      const fallback = componentContent?.querySelector('.is-empty-hint');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Rich text');
    });

    it('should render RichText SDK component when Text field is missing', () => {
      render(<RichText {...propsWithoutTextField} />);

      // Component renders RichText SDK even without Text field
      const richTextContent = screen.getByTestId('rich-text-content');
      expect(richTextContent).toBeInTheDocument();
    });

    it('should render RichText SDK component when Text field is null', () => {
      render(<RichText {...propsWithNullTextField} />);

      // Component renders RichText SDK even when Text field is null
      const richTextContent = screen.getByTestId('rich-text-content');
      expect(richTextContent).toBeInTheDocument();
    });

    it('should render fallback with correct structure', () => {
      const { container } = render(<RichText {...propsWithoutFields} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveClass('no-fields-style');
      expect(richText).toHaveAttribute('id', 'no-fields-id');

      const componentContent = richText?.querySelector('.component-content');
      expect(componentContent).toBeInTheDocument();

      const fallback = componentContent?.querySelector('.is-empty-hint');
      expect(fallback?.tagName).toBe('SPAN');
      expect(fallback).toHaveClass('is-empty-hint');
    });
  });

  describe('Empty content handling', () => {
    it('should render with empty text', () => {
      render(<RichText {...propsWithEmptyText} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('');
    });

    it('should not show fallback for empty text when fields exist', () => {
      const { container } = render(<RichText {...propsWithEmptyText} />);

      const fallback = container.querySelector('.is-empty-hint');
      expect(fallback).not.toBeInTheDocument();

      const richTextContent = screen.getByTestId('rich-text-content');
      expect(richTextContent).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle params with empty strings', () => {
      const emptyParams = {
        styles: '',
        RenderingIdentifier: '',
      };
      const propsWithEmptyParams = {
        params: emptyParams,
        fields: defaultProps.fields,
      };

      const { container } = render(<RichText {...propsWithEmptyParams} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toBeInTheDocument();
    });

    it('should render content when Text field has value', () => {
      render(<RichText {...defaultProps} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toBeInTheDocument();
      expect(content.textContent).toContain('This is rich text content');
    });

    it('should pass correct field to RichText SDK component', () => {
      render(<RichText {...defaultProps} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toHaveTextContent(defaultProps.fields.Text.value);
    });
  });

  describe('Content rendering', () => {
    it('should render HTML content from text field', () => {
      render(<RichText {...defaultProps} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toHaveTextContent('This is rich text content');
      expect(content).toHaveTextContent('Heading');
      expect(content).toHaveTextContent('Item 1');
      expect(content).toHaveTextContent('Item 2');
    });

    it('should render simple paragraph', () => {
      render(<RichText {...propsWithSimpleText} />);

      const content = screen.getByTestId('rich-text-content');
      expect(content).toHaveTextContent('Simple text');
    });

    it('should handle complex HTML structure', () => {
      render(<RichText {...defaultProps} />);

      const content = screen.getByTestId('rich-text-content');
      const fullText = content.textContent || '';
      
      expect(fullText).toContain('This is rich text content');
      expect(fullText).toContain('Heading');
      expect(fullText).toContain('Item 1');
      expect(fullText).toContain('Item 2');
    });
  });

  describe('CSS classes', () => {
    it('should apply component and rich-text classes', () => {
      const { container } = render(<RichText {...defaultProps} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveClass('component');
      expect(richText).toHaveClass('rich-text');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<RichText {...defaultProps} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText).toHaveClass('custom-rich-text-style');
    });

    it('should apply is-empty-hint class to fallback', () => {
      const { container } = render(<RichText {...propsWithoutFields} />);

      const fallback = container.querySelector('.is-empty-hint');
      expect(fallback).toHaveClass('is-empty-hint');
    });

    it('should not have undefined in className', () => {
      const { container } = render(<RichText {...propsWithoutStyles} />);

      const richText = container.querySelector('.component.rich-text');
      expect(richText?.className).not.toContain('undefined');
    });
  });
});

