/**
 * Unit tests for ContentBlock component
 * Tests basic rendering, content display, and empty states
 */

import React from 'react';
import { render } from '@testing-library/react';
import ContentBlock from 'components/sxa/ContentBlock';
import {
  defaultContentBlockProps,
  contentBlockPropsComplex,
  contentBlockPropsEmptyHeading,
  contentBlockPropsEmptyContent,
  contentBlockPropsEmpty,
  contentBlockPropsSpecialChars,
  contentBlockPropsNullFields,
} from './ContentBlock.mockProps';

// Mock the withDatasourceCheck HOC and Sitecore components
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag: Tag = 'span',
    className,
    ...props
  }: {
    field: any;
    tag?: string;
    className?: string;
    [key: string]: any;
  }) => {
    if (!field || typeof field.value !== 'string' || field.value.trim() === '') return null;
    return React.createElement(Tag, { className, ...props }, field.value);
  },
  RichText: ({
    field,
    className,
    ...props
  }: {
    field: any;
    className?: string;
    [key: string]: any;
  }) => {
    if (!field || typeof field.value !== 'string' || field.value.trim() === '') return null;
    return React.createElement('div', {
      className,
      ...props,
      dangerouslySetInnerHTML: { __html: field.value },
    });
  },
  withDatasourceCheck: jest.fn(() => (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
      // Simulate withDatasourceCheck HOC behavior: return null if fields are missing
      if (!props.fields) {
        return null;
      }
      return React.createElement(Component, props);
    };
    WrappedComponent.displayName = `withDatasourceCheck(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
  }),
}));
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('ContentBlock Component', () => {
  describe('Basic Rendering', () => {
    it('should render content block with heading and content', () => {
      const { container } = render(<ContentBlock {...defaultContentBlockProps} />);

      expect(container.querySelector('.contentBlock')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('.contentTitle')).toBeInTheDocument();
      expect(container.querySelector('.contentDescription')).toBeInTheDocument();
    });

    it('should render heading text', () => {
      const { container } = render(<ContentBlock {...defaultContentBlockProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toHaveTextContent('Sample Heading');
    });

    it('should render content as rich text', () => {
      const { container } = render(<ContentBlock {...defaultContentBlockProps} />);

      const content = container.querySelector('.contentDescription');
      expect(content?.innerHTML).toContain('<p>This is sample rich text content.</p>');
    });
  });

  describe('Content Variations', () => {
    it('should render complex HTML content', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsComplex} />);

      const content = container.querySelector('.contentDescription');
      expect(content?.innerHTML).toContain('<strong>bold text</strong>');
      expect(content?.innerHTML).toContain('<em>italic text</em>');
      expect(content?.innerHTML).toContain('<ul>');
      expect(content?.innerHTML).toContain('<li>List item 1</li>');
      expect(content?.innerHTML).toContain('<a href="/link">link</a>');
    });

    it('should render long headings', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsComplex} />);

      const heading = container.querySelector('h2');
      const expectedText =
        'This is a very long heading that might be used for SEO purposes and testing';
      expect(heading).toHaveTextContent(expectedText);
    });

    it('should handle special characters in heading', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsSpecialChars} />);

      const heading = container.querySelector('h2');
      expect(heading).toHaveTextContent('Heading with & special <characters>');
    });

    it('should handle special characters in content', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsSpecialChars} />);

      const content = container.querySelector('.contentDescription');
      expect(content?.innerHTML).toContain('&amp;');
      expect(content?.innerHTML).toContain('&lt;special&gt;');
      expect(content?.innerHTML).toContain('"characters"'); // Quotes are decoded in HTML
    });
  });

  describe('Empty States', () => {
    it('should handle empty heading gracefully', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsEmptyHeading} />);

      const heading = container.querySelector('h2');
      expect(heading).not.toBeInTheDocument();
      expect(container.querySelector('.contentBlock')).toBeInTheDocument();
    });

    it('should handle empty content gracefully', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsEmptyContent} />);

      const content = container.querySelector('.contentDescription');
      expect(content).not.toBeInTheDocument();
      expect(container.querySelector('.contentBlock')).toBeInTheDocument();
    });

    it('should handle both empty heading and content', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsEmpty} />);

      expect(container.querySelector('.contentBlock')).toBeInTheDocument();
      expect(container.querySelector('h2')).not.toBeInTheDocument();
      expect(container.querySelector('.contentDescription')).not.toBeInTheDocument();
    });

    it('should handle null fields gracefully with withDatasourceCheck HOC', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsNullFields} />);

      expect(container.querySelector('.contentBlock')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<ContentBlock {...defaultContentBlockProps} />);

      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('.contentTitle')).toBeInTheDocument();
      expect(container.querySelector('.contentDescription')).toBeInTheDocument();
    });

    it('should use proper heading hierarchy', () => {
      const { container } = render(<ContentBlock {...defaultContentBlockProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading?.tagName).toBe('H2');
    });

    it('should preserve HTML structure in content', () => {
      const { container } = render(<ContentBlock {...contentBlockPropsComplex} />);

      const content = container.querySelector('.contentDescription');
      expect(content?.querySelector('strong')).toBeInTheDocument();
      expect(content?.querySelector('em')).toBeInTheDocument();
      expect(content?.querySelector('ul')).toBeInTheDocument();
      expect(content?.querySelectorAll('li')).toHaveLength(2);
    });
  });
});
