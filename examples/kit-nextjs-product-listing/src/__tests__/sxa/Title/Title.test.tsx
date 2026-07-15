/**
 * Unit tests for Title component
 * Tests basic rendering and parameter handling
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Default as Title } from 'components/sxa/Title';
import {
  defaultTitleProps,
  titlePropsEmptyTitle,
  titlePropsMinimal,
  titlePropsNullFields,
  titlePropsSpecialChars,
} from './Title.mockProps';

// Mock Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Text: ({ field, tag: Tag = 'span' }: { field: any; tag?: string }) => {
    if (!field || !field.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Link: ({ field, children }: { field: any; children: React.ReactNode }) => {
    if (!field || !field.value) return React.createElement(React.Fragment, {}, children);
    return React.createElement('a', { href: field.value.href, title: field.value.title }, children);
  },
}));

describe('Title Component', () => {
  describe('Basic Rendering', () => {
    it('should render title component structure', () => {
      const { container } = render(<Title {...defaultTitleProps} />);

      expect(container.querySelector('.component.title')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
      expect(container.querySelector('.field-title')).toBeInTheDocument();
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<Title {...defaultTitleProps} />);

      const component = container.querySelector('.component.title');
      expect(component).toHaveAttribute('id', 'title-1');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<Title {...defaultTitleProps} />);

      const component = container.querySelector('.component.title');
      expect(component).toHaveClass('title-styles');
    });

    it('should render with link when in normal mode', () => {
      const { container } = render(<Title {...defaultTitleProps} />);

      expect(container.querySelector('a')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should handle null fields gracefully', () => {
      const { container } = render(<Title {...titlePropsNullFields} />);

      expect(container.querySelector('.component.title')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
    });

    it('should handle empty title values', () => {
      const { container } = render(<Title {...titlePropsEmptyTitle} />);

      expect(container.querySelector('.component.title')).toBeInTheDocument();
      expect(container.querySelector('a')).toBeInTheDocument();
    });
  });

  describe('Parameters', () => {
    it('should work with minimal parameters', () => {
      const { container } = render(<Title {...titlePropsMinimal} />);

      expect(container.querySelector('.component.title')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
      // Should not have id when RenderingIdentifier is not provided
      const component = container.querySelector('.component.title');
      expect(component).not.toHaveAttribute('id');
    });

    it('should handle special characters in title', () => {
      const { container } = render(<Title {...titlePropsSpecialChars} />);

      expect(container.querySelector('.component.title')).toBeInTheDocument();
      expect(container.querySelector('a')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<Title {...defaultTitleProps} />);

      expect(container.querySelector('.component')).toBeInTheDocument();
      expect(container.querySelector('.component-content')).toBeInTheDocument();
      expect(container.querySelector('.field-title')).toBeInTheDocument();
    });

    it('should render as link for navigation', () => {
      const { container } = render(<Title {...defaultTitleProps} />);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });
  });
});
