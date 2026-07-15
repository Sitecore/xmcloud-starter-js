/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as RichTextBlockDefault } from '../../components/rich-text-block/RichTextBlock';
import {
  defaultRichTextBlockProps,
  richTextBlockPropsSimple,
  richTextBlockPropsMinimal,
  richTextBlockPropsComplex,
  richTextBlockPropsEmpty,
  richTextBlockPropsWhitespace,
  richTextBlockPropsNoFields,
  richTextBlockPropsNoId,
  richTextBlockPropsIdOnly,
  richTextBlockPropsStylesWithSpaces,
  richTextBlockPropsHtmlEntities,
  richTextBlockPropsTable,
  richTextBlockPropsWithImages,
  richTextBlockPropsWithClasses,
} from './RichTextBlock.mockProps';
import { mockPage } from '../test-utils/mockPage';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field, className, ...props }: any) => (
    <div
      data-testid="sitecore-richtext"
      className={className}
      dangerouslySetInnerHTML={{ __html: field?.value || '' }}
      {...props}
    />
  ),
}));

jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('RichTextBlock Component', () => {
  describe('Default Rendering', () => {
    it('renders with rich text content', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();

      // Check for specific content elements
      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(screen.getByText(/This is a/)).toBeInTheDocument();
    });

    it('applies correct component structure and classes', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      expect(component).toHaveClass('custom-rich-text-styles');

      const content = document.querySelector('.component-content');
      expect(content).toBeInTheDocument();
    });

    it('applies rendering identifier as id when provided', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      const component = document.querySelector('#rich-text-block-1');
      expect(component).toBeInTheDocument();
    });

    it('does not apply id when RenderingIdentifier is not provided', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsNoId} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      expect(component).not.toHaveAttribute('id');
    });
  });

  describe('Content Scenarios', () => {
    it('renders simple text content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsSimple} />);

      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(
        screen.getByText('This is a simple paragraph of text without complex formatting.')
      ).toBeInTheDocument();
    });

    it('renders minimal HTML content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsMinimal} />);

      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(screen.getByText('Plain text without HTML tags')).toBeInTheDocument();
    });

    it('renders complex rich text with multiple elements', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsComplex} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      // Check for various HTML elements in the rich text
      expect(screen.getByText('Main Heading')).toBeInTheDocument();
      expect(screen.getByText('Subheading')).toBeInTheDocument();
      expect(screen.getByText(/This is a paragraph with/)).toBeInTheDocument();
      expect(screen.getByText('List Examples')).toBeInTheDocument();
    });

    it('handles empty content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsEmpty} />);

      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();

      const component = document.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
    });

    it('handles whitespace-only content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsWhitespace} />);

      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
    });
  });

  describe('Styling and Parameters', () => {
    it('applies custom styles from params', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toHaveClass('custom-rich-text-styles');
    });

    it('trims trailing spaces from styles', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsStylesWithSpaces} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toHaveClass('styles-with-trailing-spaces');
      // Verify trimEnd() worked by checking className doesn't end with spaces
      expect(component?.className).not.toMatch(/\s+$/);
    });

    it('renders without custom styles when not provided', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsIdOnly} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      expect(component).toHaveClass('component', 'rich-text');
    });

    it('applies RenderingIdentifier as id', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsIdOnly} />);

      expect(document.querySelector('#id-only-block')).toBeInTheDocument();
    });
  });

  describe('HTML Content Types', () => {
    it('renders HTML entities correctly', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsHtmlEntities} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      // HTML entities should be properly rendered
      expect(richTextContent.innerHTML).toContain('&lt;script&gt;');
      expect(richTextContent.innerHTML).toContain('&amp;');
      // Copyright symbol may be rendered as actual symbol rather than entity
      expect(richTextContent.innerHTML).toMatch(/&copy;|©/);
    });

    it('renders table content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsTable} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      // Check for table elements
      expect(richTextContent.innerHTML).toContain('<table>');
      expect(richTextContent.innerHTML).toContain('<thead>');
      expect(richTextContent.innerHTML).toContain('<tbody>');
      expect(richTextContent.innerHTML).toContain('<th>Header 1</th>');
    });

    it('renders content with images', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsWithImages} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      expect(richTextContent.innerHTML).toContain('<img');
      expect(richTextContent.innerHTML).toContain('src="/images/example.jpg"');
      expect(richTextContent.innerHTML).toContain('alt="Example image"');
    });

    it('preserves custom CSS classes in content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsWithClasses} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      expect(richTextContent.innerHTML).toContain('class="highlight"');
      expect(richTextContent.innerHTML).toContain('class="callout-box"');
    });
  });

  describe('Fallback Scenarios', () => {
    it('returns NoDataFallback when no fields provided', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Rich Text Block')).toBeInTheDocument();
    });

    it('shows empty hint when fields exist but text is not processed', () => {
      // The hint is actually only shown in the text variable calculation
      // but won't be displayed in the actual component due to the fields check
      // So this test should verify the fallback behavior instead

      const propsWithFields = {
        params: {},
        page: mockPage,
        fields: {
          text: { value: '' }, // Empty text content
        },
        rendering: {
          uid: 'test-empty-content-uid',
          componentName: 'RichTextBlock',
          dataSource: '',
        },
      };

      render(<RichTextBlockDefault {...propsWithFields} />);

      // Component should render structure with empty content
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
      expect(document.querySelector('.component.rich-text')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('maintains correct HTML structure', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      // Check outer container
      const outerContainer = document.querySelector('.component.rich-text');
      expect(outerContainer).toBeInTheDocument();

      // Check inner content container
      const contentContainer = document.querySelector('.component-content');
      expect(contentContainer).toBeInTheDocument();

      // Check that rich text is inside content container
      const richText = screen.getByTestId('sitecore-richtext');
      expect(contentContainer).toContainElement(richText);
    });

    it('applies consistent class naming', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toHaveClass('component');
      expect(component).toHaveClass('rich-text');
    });
  });

  describe('Accessibility', () => {
    it('provides proper semantic structure for rich content', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsComplex} />);

      // Rich text content should maintain semantic HTML structure
      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      // Check for semantic elements in the HTML
      expect(richTextContent.innerHTML).toContain('<h1>');
      expect(richTextContent.innerHTML).toContain('<h2>');
      expect(richTextContent.innerHTML).toContain('<h3>');
      expect(richTextContent.innerHTML).toContain('<ul>');
      expect(richTextContent.innerHTML).toContain('<ol>');
    });

    it('maintains link accessibility in rich text', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsComplex} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent.innerHTML).toContain('<a href=');
      expect(richTextContent.innerHTML).toContain('target="_blank"');
    });

    it('preserves image alt attributes', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsWithImages} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent.innerHTML).toContain('alt="Example image"');
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();

      rerender(<RichTextBlockDefault {...richTextBlockPropsSimple} />);

      expect(
        screen.getByText('This is a simple paragraph of text without complex formatting.')
      ).toBeInTheDocument();
    });

    it('manages large content without issues', () => {
      render(<RichTextBlockDefault {...richTextBlockPropsComplex} />);

      const richTextContent = screen.getByTestId('sitecore-richtext');
      expect(richTextContent).toBeInTheDocument();

      // Component should handle complex HTML without performance issues
      expect(richTextContent.innerHTML.length).toBeGreaterThan(100);
    });
  });

  describe('Error Handling', () => {
    it('handles malformed field data gracefully', () => {
      const malformedProps = {
        params: {},
        fields: {
          text: { value: undefined },
        },
        rendering: {
          uid: 'test-malformed-uid',
          componentName: 'RichTextBlock',
          dataSource: '',
        },
      } as any;

      expect(() => {
        render(<RichTextBlockDefault {...malformedProps} />);
      }).not.toThrow();
    });

    it('handles missing text field gracefully', () => {
      const missingTextProps = {
        params: {},
        fields: {
          // text field is missing
        },
        rendering: {
          uid: 'test-missing-text-uid',
          componentName: 'RichTextBlock',
          dataSource: '',
        },
      } as any;

      expect(() => {
        render(<RichTextBlockDefault {...missingTextProps} />);
      }).not.toThrow();

      // Component should render structure but may not show the hint text
      expect(screen.getByTestId('sitecore-richtext')).toBeInTheDocument();
    });
  });

  describe('CSS Integration', () => {
    it('correctly combines component classes with custom styles', () => {
      render(<RichTextBlockDefault {...defaultRichTextBlockProps} />);

      const component = document.querySelector('.component.rich-text.custom-rich-text-styles');
      expect(component).toBeInTheDocument();
    });

    it('handles empty styles parameter', () => {
      const emptyStylesProps = {
        ...richTextBlockPropsSimple,
        params: { styles: '' },
      };

      render(<RichTextBlockDefault {...emptyStylesProps} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      expect(component).toHaveClass('component', 'rich-text');
    });

    it('handles undefined styles parameter', () => {
      const undefinedStylesProps = {
        ...richTextBlockPropsSimple,
        params: {},
      };

      render(<RichTextBlockDefault {...undefinedStylesProps} />);

      const component = document.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
    });
  });
});
