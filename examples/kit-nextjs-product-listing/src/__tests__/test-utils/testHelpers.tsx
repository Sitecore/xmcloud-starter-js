/**
 * Test helper utilities for component testing
 * Provides automatic page prop injection for components that require it
 */
import type { ComponentProps } from '@/lib/component-props';
import { mockPage } from './mockPage';

/**
 * Automatically adds page prop to component props if missing
 * This helps tests work after App Router refactor where page became required
 */
export function withPageProp<T extends Partial<ComponentProps>>(
  props: T
): T & { page: ComponentProps['page'] } {
  return {
    ...props,
    page: props.page || mockPage,
  } as T & { page: ComponentProps['page'] };
}

/**
 * Creates default component props with page included
 * Use this in test files to ensure page is always provided
 */
export function createComponentProps<T extends Partial<ComponentProps>>(
  props: T
): T & ComponentProps {
  return {
    rendering: {
      componentName: 'TestComponent',
      params: {},
    },
    params: {},
    page: mockPage,
    ...props,
  } as T & ComponentProps;
}

