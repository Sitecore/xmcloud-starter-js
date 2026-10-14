import React from 'react';

// Mock children components for testing
export const createMockChild = (testId: string, content: string) =>
  React.createElement('div', { 'data-testid': testId, key: testId }, content);

export const defaultThemeProviderProps = {
  attribute: 'class',
  defaultTheme: 'system',
  enableSystem: true,
  disableTransitionOnChange: true,
  children: [
    createMockChild('child-component-1', 'Child Component 1'),
    createMockChild('child-component-2', 'Child Component 2'),
  ],
};

export const themeProviderPropsLightDefault = {
  ...defaultThemeProviderProps,
  defaultTheme: 'light',
  enableSystem: false,
  children: [createMockChild('light-child', 'Light Theme Child')],
};

export const themeProviderPropsDarkDefault = {
  ...defaultThemeProviderProps,
  defaultTheme: 'dark',
  enableSystem: false,
  children: [createMockChild('dark-child', 'Dark Theme Child')],
};

export const themeProviderPropsCustomAttribute = {
  ...defaultThemeProviderProps,
  attribute: 'data-theme',
  storageKey: 'custom-theme-key',
  children: [createMockChild('custom-attr-child', 'Custom Attribute Child')],
};

export const themeProviderPropsMultipleThemes = {
  ...defaultThemeProviderProps,
  themes: ['light', 'dark', 'blue', 'green', 'purple'],
  defaultTheme: 'blue',
  children: [createMockChild('multi-theme-child', 'Multiple Themes Child')],
};

export const themeProviderPropsWithTransitions = {
  ...defaultThemeProviderProps,
  disableTransitionOnChange: false,
  enableColorScheme: true,
  children: [createMockChild('transition-child', 'Transitions Enabled Child')],
};

export const themeProviderPropsNoChildren = {
  ...defaultThemeProviderProps,
  children: [],
};

export const themeProviderPropsUndefinedChildren = {
  ...defaultThemeProviderProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: undefined as any,
};

export const themeProviderPropsSingleChild = {
  ...defaultThemeProviderProps,
  children: createMockChild('single-child', 'Single Child Component'),
};

export const themeProviderPropsNestedChildren = {
  ...defaultThemeProviderProps,
  children: React.createElement('div', { 'data-testid': 'nested-container', key: 'nested' }, [
    createMockChild('nested-child-1', 'Nested Child 1'),
    createMockChild('nested-child-2', 'Nested Child 2'),
    React.createElement(
      'div',
      { 'data-testid': 'deeply-nested', key: 'deep' },
      createMockChild('deeply-nested-child', 'Deeply Nested Child')
    ),
  ]),
};

export const themeProviderPropsCustomStorage = {
  ...defaultThemeProviderProps,
  storageKey: 'sync-audio-theme',
  value: 'dark',
  children: [createMockChild('custom-storage-child', 'Custom Storage Child')],
};

export const themeProviderPropsForced = {
  ...defaultThemeProviderProps,
  forcedTheme: 'dark',
  children: [createMockChild('forced-theme-child', 'Forced Theme Child')],
};

export const themeProviderPropsMinimal = {
  children: createMockChild('minimal-child', 'Minimal Props Child'),
};

export const themeProviderPropsComplexChildren = {
  ...defaultThemeProviderProps,
  children: [
    createMockChild('header-component', 'Header'),
    createMockChild('main-content', 'Main Content Area'),
    React.createElement('div', { 'data-testid': 'sidebar', key: 'sidebar' }, [
      createMockChild('sidebar-nav', 'Navigation'),
      createMockChild('sidebar-widgets', 'Widgets'),
    ]),
    createMockChild('footer-component', 'Footer'),
  ],
};

export const themeProviderPropsReactFragment = {
  ...defaultThemeProviderProps,
  children: React.createElement(React.Fragment, { key: 'fragment' }, [
    createMockChild('fragment-child-1', 'Fragment Child 1'),
    createMockChild('fragment-child-2', 'Fragment Child 2'),
  ]),
};

export const themeProviderPropsWithFunctions = {
  ...defaultThemeProviderProps,
  onSystemThemeChange: jest.fn(),
  nonce: 'test-nonce-123',
  children: [createMockChild('function-child', 'Function Props Child')],
};
