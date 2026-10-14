import '@testing-library/jest-dom';
import React from 'react';

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span' }) => {
    if (!field || !field.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  RichText: ({ field }) => {
    if (!field || !field.value) return null;
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: field.value } });
  },
  Link: ({ field, children }) => {
    if (!field || !field.value) return React.createElement(React.Fragment, {}, children);
    const linkText = field?.value?.text || children;
    return React.createElement('a', { href: field.value.href }, linkText);
  },
  AppPlaceholder: ({ name }) => React.createElement('div', { 'data-testid': 'app-placeholder', 'data-name': name }),
  withDatasourceCheck: () => (component) => component,
}));

// Avoid loading lucide-react ESM in Jest runtime.
jest.mock('lucide-react', () => ({
  Image: (props) => React.createElement('svg', { ...props, 'data-testid': 'lucide-image-icon' }),
}));
