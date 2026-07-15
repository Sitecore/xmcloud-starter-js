import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Title } from '@/components/sxa/Title';
import type { Field } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutStyles,
  propsWithoutTag,
  propsWithoutDatasource,
  propsWithEmptyFields,
  mockPageData,
  mockPageDataEditing,
  mockPageDataWithoutTitle,
  mockParams,
} from './Title.mockProps';

// Type definitions for mock components
interface MockTextProps {
  field?: Field<string>;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  editable?: boolean;
}

// Mock the useSitecore hook
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag, className, editable }: MockTextProps) => {
    const Tag = (tag || 'h2') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-editable': editable?.toString() }, field?.value || 'Add Title');
  },
}));

describe('Title Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockPageData);
  });

  describe('Rendering in normal mode', () => {
    it('should render with datasource title when available', () => {
      render(<Title {...defaultProps} />);

      expect(screen.getByText('Datasource Title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render with context title when datasource is not available', () => {
      mockUseSitecore.mockReturnValue(mockPageData);
      render(<Title {...(propsWithoutDatasource as unknown as Parameters<typeof Title>[0])} />);

      expect(screen.getByText('Context Title')).toBeInTheDocument();
    });

    it('should render with page title when datasource and context are not available', () => {
      const propsWithoutBoth = {
        params: mockParams,
        fields: { data: { datasource: null, contextItem: null } },
      };
      mockUseSitecore.mockReturnValue(mockPageData);
      render(<Title {...(propsWithoutBoth as unknown as Parameters<typeof Title>[0])} />);

      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('should render with default text when all sources are not available', () => {
      mockUseSitecore.mockReturnValue(mockPageDataWithoutTitle);
      render(<Title {...(propsWithEmptyFields as unknown as Parameters<typeof Title>[0])} />);

      expect(screen.getByText('Add Title')).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      render(<Title {...defaultProps} />);

      const container = screen.getByText('Datasource Title').closest('.component.title');
      expect(container).toHaveClass('component', 'title', 'custom-title-style');
    });

    it('should render without custom styles when not provided', () => {
      render(<Title {...propsWithoutStyles} />);

      const container = screen.getByText('Datasource Title').closest('.component.title');
      expect(container).toHaveClass('component', 'title');
      expect(container).not.toHaveClass('custom-title-style');
    });

    it('should use custom tag when provided', () => {
      render(<Title {...defaultProps} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should use default tag when not provided', () => {
      render(<Title {...propsWithoutTag} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should have correct rendering identifier', () => {
      render(<Title {...defaultProps} />);

      const container = screen.getByText('Datasource Title').closest('.component.title');
      expect(container).toHaveAttribute('id', 'title-rendering-id');
    });
  });

  describe('Rendering in editing mode', () => {
    beforeEach(() => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
    });

    it('should render with editable text in editing mode', () => {
      render(<Title {...defaultProps} />);

      const textElement = screen.getByText('Datasource Title');
      expect(textElement).toHaveAttribute('data-editable', 'true');
    });

    it('should render with editable text when not in normal mode', () => {
      const editingModeData = {
        page: {
          ...mockPageDataEditing.page,
          mode: {
            isEditing: true,
            isNormal: false,
          },
        },
      };
      mockUseSitecore.mockReturnValue(editingModeData);
      
      render(<Title {...defaultProps} />);

      const textElement = screen.getByText('Datasource Title');
      expect(textElement).toHaveAttribute('data-editable', 'true');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      render(<Title {...defaultProps} />);

      const container = screen.getByText('Datasource Title').closest('.component.title');
      expect(container).toHaveClass('component', 'title', 'custom-title-style');
      
      const contentDiv = container?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
      
      const titleElement = contentDiv?.querySelector('.field-title');
      expect(titleElement).toBeInTheDocument();
    });

    it('should pass correct props to Text component', () => {
      render(<Title {...defaultProps} />);

      const textElement = screen.getByText('Datasource Title');
      expect(textElement).toHaveClass('field-title');
      expect(textElement.tagName).toBe('H1');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty field values gracefully', () => {
      mockUseSitecore.mockReturnValue(mockPageDataWithoutTitle);
      render(<Title {...(propsWithEmptyFields as unknown as Parameters<typeof Title>[0])} />);

      expect(screen.getByText('Add Title')).toBeInTheDocument();
    });

    it('should handle missing params gracefully', () => {
      const propsWithoutParams = {
        params: {},
        fields: defaultProps.fields,
      };
      
      render(<Title {...propsWithoutParams} />);

      expect(screen.getByText('Datasource Title')).toBeInTheDocument();
    });

    it('should handle missing fields gracefully', () => {
      const propsWithoutFields = {
        params: defaultProps.params,
        fields: null as unknown as typeof defaultProps.fields,
      };
      
      mockUseSitecore.mockReturnValue(mockPageDataWithoutTitle);
      render(<Title {...(propsWithoutFields as unknown as Parameters<typeof Title>[0])} />);

      expect(screen.getByText('Add Title')).toBeInTheDocument();
    });
  });
});
