import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container } from '@/components/sxa/Container';
import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithContainer,
  propsWithBackgroundImage,
  propsWithoutStyles,
  propsWithoutGridParameters,
  propsWithoutId,
} from './Container.mockProps';

// Type definition for AppPlaceholder mock
interface MockAppPlaceholderProps {
  name?: string;
  rendering?: ComponentRendering;
}

// Mock the Placeholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  AppPlaceholder: ({ name, rendering }: MockAppPlaceholderProps) => (
    <div data-testid={`placeholder-${name || 'undefined'}`} data-rendering={rendering?.componentName}>
      Placeholder Content
    </div>
  ),
}));

describe('Container Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render container with default structure', () => {
      render(<Container {...defaultProps} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).toHaveClass('component', 'container-default', 'col-12', 'custom-container-style');
    });

    it('should render with correct placeholder', () => {
      render(<Container {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-main')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-container-main')).toHaveAttribute('data-rendering', 'Container');
    });

    it('should have correct rendering identifier', () => {
      render(<Container {...defaultProps} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).toHaveAttribute('id', 'container-rendering-id');
    });
  });

  describe('Container wrapper', () => {
    it('should render with container wrapper when styles include "container"', () => {
      render(<Container {...propsWithContainer} />);

      const wrapper = screen.getByTestId('placeholder-container-main').closest('.container-wrapper');
      expect(wrapper).toBeInTheDocument();
      
      const container = wrapper?.querySelector('.component.container-default');
      expect(container).toBeInTheDocument();
    });

    it('should not render container wrapper when styles do not include "container"', () => {
      render(<Container {...defaultProps} />);

      const wrapper = screen.getByTestId('placeholder-container-main').closest('.container-wrapper');
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  describe('Background image handling', () => {
    it('should apply background image when BackgroundImage param contains mediaurl', () => {
      render(<Container {...propsWithBackgroundImage} />);

      const contentDiv = screen.getByTestId('placeholder-container-main').closest('.component-content');
      expect(contentDiv).toHaveStyle('background-image: url(\'/test-image.jpg\')');
    });

    it('should not apply background image when BackgroundImage param is empty', () => {
      render(<Container {...defaultProps} />);

      const contentDiv = screen.getByTestId('placeholder-container-main').closest('.component-content');
      expect(contentDiv).not.toHaveAttribute('style');
    });

    it('should not apply background image when BackgroundImage param does not match mediaurl pattern', () => {
      const invalidBackgroundParams = {
        ...defaultProps.params,
        BackgroundImage: 'invalid-background-image',
      };
      
      const propsWithInvalidBackground = {
        ...defaultProps,
        params: invalidBackgroundParams,
        rendering: {
          ...defaultProps.rendering,
          params: invalidBackgroundParams,
        },
      };

      render(<Container {...propsWithInvalidBackground} />);

      const contentDiv = screen.getByTestId('placeholder-container-main').closest('.component-content');
      expect(contentDiv).not.toHaveAttribute('style');
    });
  });

  describe('Styles and parameters', () => {
    it('should combine GridParameters and Styles correctly', () => {
      render(<Container {...defaultProps} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).toHaveClass('col-12', 'custom-container-style');
    });

    it('should handle empty Styles parameter', () => {
      render(<Container {...propsWithoutStyles} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).toHaveClass('col-12');
      expect(container).not.toHaveClass('custom-container-style');
    });

    it('should handle empty GridParameters', () => {
      render(<Container {...propsWithoutGridParameters} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).toHaveClass('custom-container-style');
      expect(container).not.toHaveClass('col-12');
    });

    it('should handle empty RenderingIdentifier', () => {
      render(<Container {...propsWithoutId} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).not.toHaveAttribute('id');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      render(<Container {...defaultProps} />);

      const container = screen.getByTestId('placeholder-container-main').closest('.component.container-default');
      expect(container).toHaveClass('component', 'container-default');
      
      const contentDiv = container?.querySelector('.component-content');
      expect(contentDiv).toBeInTheDocument();
      
      const rowDiv = contentDiv?.querySelector('.row');
      expect(rowDiv).toBeInTheDocument();
      
      const placeholder = rowDiv?.querySelector('[data-testid="placeholder-container-main"]');
      expect(placeholder).toBeInTheDocument();
    });

    it('should pass correct props to Placeholder component', () => {
      render(<Container {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-container-main');
      expect(placeholder).toHaveAttribute('data-rendering', 'Container');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing params gracefully', () => {
      const emptyParams = {} as typeof defaultProps.params;
      const propsWithoutParams = {
        rendering: {
          ...defaultProps.rendering,
          params: emptyParams,
        },
        params: emptyParams,
        page: defaultProps.page,
      };

      render(<Container {...propsWithoutParams} />);

      const container = screen.getByTestId('placeholder-container-undefined').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle undefined DynamicPlaceholderId', () => {
      const undefinedPlaceholderParams = {
        ...defaultProps.params,
        DynamicPlaceholderId: undefined,
      } as unknown as typeof defaultProps.params;
      
      const propsWithUndefinedPlaceholder = {
        ...defaultProps,
        params: undefinedPlaceholderParams,
        rendering: {
          ...defaultProps.rendering,
          params: undefinedPlaceholderParams,
        },
      };

      render(<Container {...propsWithUndefinedPlaceholder} />);

      const container = screen.getByTestId('placeholder-container-undefined').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle complex background image URLs', () => {
      const complexBackgroundParams = {
        ...defaultProps.params,
        BackgroundImage: 'mediaurl="https://example.com/path/to/image.jpg"',
      };
      
      const propsWithComplexBackground = {
        ...defaultProps,
        params: complexBackgroundParams,
        rendering: {
          ...defaultProps.rendering,
          params: complexBackgroundParams,
        },
      };

      render(<Container {...propsWithComplexBackground} />);

      const contentDiv = screen.getByTestId('placeholder-container-main').closest('.component-content');
      expect(contentDiv).toHaveStyle('background-image: url(\'https://example.com/path/to/image.jpg\')');
    });
  });

  describe('Media URL pattern matching', () => {
    it('should handle case-insensitive mediaurl pattern', () => {
      const uppercaseMediaUrlParams = {
        ...defaultProps.params,
        BackgroundImage: 'MEDIAURL="/test-image.jpg"',
      };
      
      const propsWithUppercaseMediaUrl = {
        ...defaultProps,
        params: uppercaseMediaUrlParams,
        rendering: {
          ...defaultProps.rendering,
          params: uppercaseMediaUrlParams,
        },
      };

      render(<Container {...propsWithUppercaseMediaUrl} />);

      const contentDiv = screen.getByTestId('placeholder-container-main').closest('.component-content');
      expect(contentDiv).toHaveStyle('background-image: url(\'/test-image.jpg\')');
    });

    it('should extract correct URL from complex mediaurl string', () => {
      const complexMediaUrlParams = {
        ...defaultProps.params,
        BackgroundImage: 'some text mediaurl="/path/to/image.jpg" more text',
      };
      
      const propsWithComplexMediaUrl = {
        ...defaultProps,
        params: complexMediaUrlParams,
        rendering: {
          ...defaultProps.rendering,
          params: complexMediaUrlParams,
        },
      };

      render(<Container {...propsWithComplexMediaUrl} />);

      const contentDiv = screen.getByTestId('placeholder-container-main').closest('.component-content');
      expect(contentDiv).toHaveStyle('background-image: url(\'/path/to/image.jpg\')');
    });
  });
});
