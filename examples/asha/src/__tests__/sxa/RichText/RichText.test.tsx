/**
 * Unit tests for RichText component
 * Tests basic rendering, empty states, and parameter handling
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as RichText } from 'components/sxa/RichText';
import {
  defaultRichTextProps,
  richTextPropsNullFields,
  richTextPropsEmptyField,
  richTextPropsEmptyValue,
  richTextPropsNoId,
  richTextPropsNoStyles,
  richTextPropsMultipleStyles,
  richTextPropsComplexHtml,
  richTextPropsSpecialChars,
  richTextPropsStyledText,
  richTextPropsHeadingContent,
  richTextPropsLinkContent,
} from './RichText.mockProps';

describe('RichText Component', () => {
  describe('Rendering', () => {
    it('should render rich text content', () => {
      const { container } = render(<RichText {...defaultRichTextProps} />);

      expect(container.querySelector('.component.rich-text')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
    });

    it('should render HTML content from field', () => {
      const { container } = render(<RichText {...defaultRichTextProps} />);

      const content = container.querySelector('.component-content');
      expect(content?.innerHTML).toContain('<strong>rich text</strong>');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<RichText {...defaultRichTextProps} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toHaveClass('custom-styles');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<RichText {...defaultRichTextProps} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toHaveAttribute('id', 'richtext-1');
    });
  });

  describe('Empty States', () => {
    it('should show placeholder when fields is null', () => {
      render(<RichText {...richTextPropsNullFields} />);

      expect(screen.getByText('Rich text')).toBeInTheDocument();
      expect(screen.getByText('Rich text')).toHaveClass('is-empty-hint');
    });

    it('should render empty content when Text field is missing', () => {
      const { container } = render(<RichText {...richTextPropsEmptyField} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      const content = container.querySelector('.component-content');
      expect(content).toBeInTheDocument();
      // When fields.Text is missing, the ContentSdkRichText component renders nothing
      expect(content).toBeEmptyDOMElement();
    });

    it('should render empty content gracefully when value is empty string', () => {
      const { container } = render(<RichText {...richTextPropsEmptyValue} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
    });
  });

  describe('Parameters', () => {
    it('should work without RenderingIdentifier', () => {
      const { container } = render(<RichText {...richTextPropsNoId} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      expect(component).not.toHaveAttribute('id');
    });

    it('should work without custom styles', () => {
      const { container } = render(<RichText {...richTextPropsNoStyles} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toBeInTheDocument();
      expect(component).toHaveAttribute('id', 'richtext-2');
    });

    it('should handle multiple CSS classes in styles param', () => {
      const { container } = render(<RichText {...richTextPropsMultipleStyles} />);

      const component = container.querySelector('.component.rich-text');
      expect(component).toHaveClass('style-1');
      expect(component).toHaveClass('style-2');
      expect(component).toHaveClass('style-3');
    });
  });

  describe('Content Variations', () => {
    it('should render complex HTML with nested elements', () => {
      const { container } = render(<RichText {...richTextPropsComplexHtml} />);

      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('a[href="/link"]')).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelectorAll('li')).toHaveLength(2);
    });

    it('should render text with special characters', () => {
      const { container } = render(<RichText {...richTextPropsSpecialChars} />);

      expect(container.innerHTML).toContain('&amp;');
    });

    it('should render inline styles from Sitecore', () => {
      const { container } = render(<RichText {...richTextPropsStyledText} />);

      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveAttribute('style', 'color: red;');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<RichText {...defaultRichTextProps} />);

      expect(container.querySelector('.component')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
    });

    it('should preserve heading hierarchy from content', () => {
      const { container } = render(<RichText {...richTextPropsHeadingContent} />);

      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('should preserve link attributes for screen readers', () => {
      const { container } = render(<RichText {...richTextPropsLinkContent} />);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/page');
      expect(link).toHaveAttribute('title', 'Go to page');
    });
  });
});
