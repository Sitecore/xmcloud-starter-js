import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as RichTextBlock } from '@/components/rich-text-block/RichTextBlock';
import {
  defaultProps,
  propsWithoutFields,
  propsWithNullFields,
  propsWithoutStyles,
  propsWithoutId,
  propsWithEmptyText,
  propsWithUndefinedText,
  propsWithComplexHtml,
  propsWithMultipleStyles,
} from './RichTextBlock.mockProps';

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat(2)
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          return Object.entries(arg)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  },
}));

// RichText component is already mocked in jest.setup.js

describe('RichTextBlock Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering with valid fields', () => {
    it('should render the rich text content when fields are provided', () => {
      render(<RichTextBlock {...defaultProps} />);

      expect(screen.getByTestId('rich-text-content')).toBeInTheDocument();
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent(
        'This is a test rich text content'
      );
    });

    it('should render with correct component attributes', () => {
      render(<RichTextBlock {...defaultProps} />);

      // Find the container div that wraps the RichText component
      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toHaveAttribute('data-component-name', 'rich-text-block');
      expect(container).toHaveAttribute('id', 'test-rendering-id');
    });

    it('should apply custom styles when provided in params', () => {
      render(<RichTextBlock {...defaultProps} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toHaveClass('prose', 'custom-styles');
    });

    it('should render without custom styles when not provided in params', () => {
      render(<RichTextBlock {...propsWithoutStyles} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toHaveClass('prose');
      expect(container).not.toHaveClass('custom-styles');
    });

    it('should render without id when RenderingIdentifier is not provided', () => {
      render(<RichTextBlock {...propsWithoutId} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).not.toHaveAttribute('id');
    });
  });

  describe('Rendering without fields', () => {
    it('should render NoDataFallback when fields are not provided', () => {
      render(<RichTextBlock {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('no-data-fallback')).toHaveTextContent(
        'Rich Text Block requires a datasource item assigned.'
      );
    });

    it('should render NoDataFallback when fields are null', () => {
      render(<RichTextBlock {...propsWithNullFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text field value', () => {
      render(<RichTextBlock {...propsWithEmptyText} />);

      expect(screen.getByTestId('rich-text-content')).toBeInTheDocument();
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent('No content');
    });

    it('should handle undefined text field value', () => {
      render(<RichTextBlock {...propsWithUndefinedText} />);

      expect(screen.getByTestId('rich-text-content')).toBeInTheDocument();
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent('No content');
    });

    it('should handle complex HTML content in text field', () => {
      render(<RichTextBlock {...propsWithComplexHtml} />);

      expect(screen.getByTestId('rich-text-content')).toBeInTheDocument();
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent('Title');
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent('bold');
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent('italic');
    });

    it('should handle multiple CSS classes in styles param', () => {
      render(<RichTextBlock {...propsWithMultipleStyles} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toHaveClass('prose', 'custom-style-1', 'custom-style-2');
    });
  });

  describe('Component structure', () => {
    it('should render the correct DOM structure', () => {
      render(<RichTextBlock {...defaultProps} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toBeInTheDocument();
      expect(container?.tagName).toBe('DIV');
      expect(container).toHaveClass('prose');
    });

    it('should pass the correct field to RichText component', () => {
      // RichText is already mocked in jest.setup.js
      // We can verify it was called correctly by checking the rendered output
      render(<RichTextBlock {...defaultProps} />);

      // Verify that the RichText content is rendered with the correct field value
      expect(screen.getByTestId('rich-text-content')).toBeInTheDocument();
      expect(screen.getByTestId('rich-text-content')).toHaveTextContent(
        'This is a test rich text content'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper data attributes for testing and identification', () => {
      render(<RichTextBlock {...defaultProps} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toHaveAttribute('data-component-name', 'rich-text-block');
    });

    it('should maintain semantic structure with prose class', () => {
      render(<RichTextBlock {...defaultProps} />);

      const container = screen.getByTestId('rich-text-content').parentElement;
      expect(container).toHaveClass('prose');
    });
  });
});
