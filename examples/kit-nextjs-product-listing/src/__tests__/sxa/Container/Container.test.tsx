import React from 'react';

// Mock next-intl BEFORE any other imports to prevent ESM parsing errors
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useTimeZone: () => 'UTC',
  useFormatter: () => ({
    dateTime: jest.fn(),
    number: jest.fn(),
    relativeTime: jest.fn(),
    plural: jest.fn(),
    select: jest.fn(),
    selectOrdinal: jest.fn(),
    list: jest.fn(),
  }),
  IntlProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock component-map to avoid circular dependency
jest.mock('.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}));

import { render, screen } from '@testing-library/react';
import { Default as Container } from '@/components/sxa/Container';
import {
  defaultProps,
  propsWithContainer,
  propsWithBackgroundImage,
  propsWithoutStyles,
  propsWithoutGridParameters,
  propsWithoutId,
} from './Container.mockProps';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name, rendering }: { name: string; rendering: { componentName: string } }) => (
    <div data-testid={`placeholder-${name}`} data-rendering={rendering.componentName}>
      Placeholder Content
    </div>
  ),
  AppPlaceholder: ({ name, rendering }: { name: string; rendering: { componentName?: string } & Record<string, unknown> }) => (
    <div data-testid={`placeholder-${name}`} data-rendering={rendering?.componentName || JSON.stringify(rendering)}>
      AppPlaceholder: {name}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withDatasourceCheck: () => (Component: React.ComponentType<any>) => Component,
}));

describe('Container Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render container with default structure', () => {
      render(<Container {...defaultProps} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
      expect(container).toHaveClass(
        'component',
        'container-default',
        'col-12',
        'custom-container-style'
      );
    });

    it('should render with correct placeholder', () => {
      render(<Container {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-main')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-container-main')).toHaveAttribute(
        'data-rendering',
        'Container'
      );
    });

    it('should have correct rendering identifier', () => {
      render(<Container {...defaultProps} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
      expect(container).toHaveAttribute('id', 'container-rendering-id');
    });
  });

  describe('Container wrapper', () => {
    it('should render with container wrapper when styles include "container"', () => {
      render(<Container {...propsWithContainer} />);

      const wrapper = screen
        .getByTestId('placeholder-container-main')
        .closest('.container-wrapper');
      expect(wrapper).toBeInTheDocument();

      const container = wrapper?.querySelector('.component.container-default');
      expect(container).toBeInTheDocument();
    });

    it('should not render container wrapper when styles do not include "container"', () => {
      render(<Container {...defaultProps} />);

      const wrapper = screen
        .getByTestId('placeholder-container-main')
        .closest('.container-wrapper');
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  describe('Background image handling', () => {
    it('should apply background image when BackgroundImage param contains mediaurl', () => {
      render(<Container {...propsWithBackgroundImage} />);

      const contentDiv = screen
        .getByTestId('placeholder-container-main')
        .closest('.component-content');
      expect(contentDiv).toHaveStyle("background-image: url('/test-image.jpg')");
    });

    it('should not apply background image when BackgroundImage param is empty', () => {
      render(<Container {...defaultProps} />);

      const contentDiv = screen
        .getByTestId('placeholder-container-main')
        .closest('.component-content');
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
        page: defaultProps.page,
      };

      render(<Container {...propsWithInvalidBackground} />);

      const contentDiv = screen
        .getByTestId('placeholder-container-main')
        .closest('.component-content');
      expect(contentDiv).not.toHaveAttribute('style');
    });
  });

  describe('Styles and parameters', () => {
    it('should combine GridParameters and Styles correctly', () => {
      render(<Container {...defaultProps} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
      expect(container).toHaveClass('col-12', 'custom-container-style');
    });

    it('should handle empty Styles parameter', () => {
      render(<Container {...propsWithoutStyles} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
      expect(container).toHaveClass('col-12');
      expect(container).not.toHaveClass('custom-container-style');
    });

    it('should handle empty GridParameters', () => {
      render(<Container {...propsWithoutGridParameters} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
      expect(container).toHaveClass('custom-container-style');
      expect(container).not.toHaveClass('col-12');
    });

    it('should handle empty RenderingIdentifier', () => {
      render(<Container {...propsWithoutId} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
      expect(container).not.toHaveAttribute('id');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      render(<Container {...defaultProps} />);

      const container = screen
        .getByTestId('placeholder-container-main')
        .closest('.component.container-default');
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
      const emptyParams = {} as Record<string, string>;
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
        DynamicPlaceholderId: '',
      };

      const propsWithUndefinedPlaceholder = {
        ...defaultProps,
        params: undefinedPlaceholderParams,
        rendering: {
          ...defaultProps.rendering,
          params: undefinedPlaceholderParams,
        },
        page: defaultProps.page,
      };

      render(<Container {...propsWithUndefinedPlaceholder} />);

      const container = screen.getByTestId('placeholder-container-').closest('div');
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
        page: defaultProps.page,
      };

      render(<Container {...propsWithComplexBackground} />);

      const contentDiv = screen
        .getByTestId('placeholder-container-main')
        .closest('.component-content');
      expect(contentDiv).toHaveStyle(
        "background-image: url('https://example.com/path/to/image.jpg')"
      );
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
        page: defaultProps.page,
      };

      render(<Container {...propsWithUppercaseMediaUrl} />);

      const contentDiv = screen
        .getByTestId('placeholder-container-main')
        .closest('.component-content');
      expect(contentDiv).toHaveStyle("background-image: url('/test-image.jpg')");
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
        page: defaultProps.page,
      };

      render(<Container {...propsWithComplexMediaUrl} />);

      const contentDiv = screen
        .getByTestId('placeholder-container-main')
        .closest('.component-content');
      expect(contentDiv).toHaveStyle("background-image: url('/path/to/image.jpg')");
    });
  });
});
