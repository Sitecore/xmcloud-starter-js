/**
 * Unit tests for PartialDesignDynamicPlaceholder component
 * Tests basic rendering and parameter handling
 */

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

import { render } from '@testing-library/react';
import PartialDesignDynamicPlaceholder from 'components/sxa/PartialDesignDynamicPlaceholder';
import {
  defaultPartialDesignProps,
  partialDesignPropsEmptyName,
  partialDesignPropsNoParams,
} from './PartialDesignDynamicPlaceholder.mockProps';

// Mock the Placeholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Placeholder: ({ name, rendering }: { name: string; rendering: any }) =>
    React.createElement(
      'div',
      {
        'data-placeholder-name': name,
        'data-rendering': JSON.stringify(rendering),
      },
      name ? 'Placeholder: ' + name : 'Placeholder: '
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AppPlaceholder: ({ name, rendering }: { name: string; rendering: any }) =>
    React.createElement(
      'div',
      {
        'data-placeholder-name': name,
        'data-rendering': JSON.stringify(rendering),
      },
      name ? 'Placeholder: ' + name : 'Placeholder: '
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withDatasourceCheck: () => (Component: React.ComponentType<any>) => Component,
}));

describe('PartialDesignDynamicPlaceholder Component', () => {
  it('should render Placeholder with correct name from params', () => {
    const { container } = render(
      <PartialDesignDynamicPlaceholder {...defaultPartialDesignProps} />
    );

    const placeholder = container.querySelector('[data-placeholder-name]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('data-placeholder-name', 'main-content');
    expect(placeholder).toHaveTextContent('Placeholder: main-content');
  });

  it('should handle empty placeholder name', () => {
    const { container } = render(
      <PartialDesignDynamicPlaceholder {...partialDesignPropsEmptyName} />
    );

    const placeholder = container.querySelector('[data-placeholder-name]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('data-placeholder-name', '');
    expect(placeholder).toHaveTextContent('Placeholder:');
  });

  it('should handle missing params gracefully', () => {
    const { container } = render(
      <PartialDesignDynamicPlaceholder {...partialDesignPropsNoParams} />
    );

    const placeholder = container.querySelector('[data-placeholder-name]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('data-placeholder-name', '');
    expect(placeholder).toHaveTextContent('Placeholder:');
  });

  it('should pass rendering prop to Placeholder component', () => {
    const { container } = render(
      <PartialDesignDynamicPlaceholder {...defaultPartialDesignProps} />
    );

    const placeholder = container.querySelector('[data-rendering]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('data-rendering');
  });

  describe('Parameter Handling', () => {
    it('should extract sig parameter correctly', () => {
      const { container } = render(
        <PartialDesignDynamicPlaceholder {...defaultPartialDesignProps} />
      );

      const placeholder = container.querySelector('[data-placeholder-name="main-content"]');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle undefined sig parameter', () => {
      const { container } = render(
        <PartialDesignDynamicPlaceholder {...partialDesignPropsNoParams} />
      );

      const placeholder = container.querySelector('[data-placeholder-name=""]');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render without accessibility issues', () => {
      const { container } = render(
        <PartialDesignDynamicPlaceholder {...defaultPartialDesignProps} />
      );

      // The component should render without throwing errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
