/**
 * Test fixtures and mock data for PartialDesignDynamicPlaceholder component
 */

import type { ComponentProps } from 'lib/component-props';
import type { Page } from '@sitecore-content-sdk/nextjs';
import { mockPage as sharedMockPage } from '../../test-utils/mockPage';

/**
 * Base mock data for PartialDesignDynamicPlaceholder component
 */
export const mockPartialDesignData = {
  placeholderName: 'main-content',
  emptyPlaceholderName: '',
};

/**
 * Mock page object
 */
export const mockPage: Page = sharedMockPage;

/**
 * Mock rendering object
 */
export const mockRenderingWithName = {
  componentName: 'PartialDesignDynamicPlaceholder',
  params: {
    sig: mockPartialDesignData.placeholderName,
  },
};

/**
 * Mock rendering object with empty name
 */
export const mockRenderingEmptyName = {
  componentName: 'PartialDesignDynamicPlaceholder',
  params: {
    sig: mockPartialDesignData.emptyPlaceholderName,
  },
};

/**
 * Mock rendering object without params
 */
export const mockRenderingNoParams = {
  componentName: 'PartialDesignDynamicPlaceholder',
  params: {},
};

/**
 * Default props for PartialDesignDynamicPlaceholder component testing
 */
export const defaultPartialDesignProps: ComponentProps = {
  rendering: mockRenderingWithName,
  params: {},
  page: mockPage,
};

/**
 * Props with empty placeholder name
 */
export const partialDesignPropsEmptyName: ComponentProps = {
  rendering: mockRenderingEmptyName,
  params: {},
  page: mockPage,
};

/**
 * Props with no params
 */
export const partialDesignPropsNoParams: ComponentProps = {
  rendering: mockRenderingNoParams,
  params: {},
  page: mockPage,
};
