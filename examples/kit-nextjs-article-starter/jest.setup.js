const React = require('react');
require('@testing-library/jest-dom');

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Filter out fill and other Next.js Image specific props that aren't valid HTML attributes
    const { fill, priority, quality, placeholder, blurDataURL, unoptimized, loader, ...imgProps } = props || {};
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', imgProps);
  },
}));

// Mock Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: jest.fn(({ field }) => {
    return React.createElement('div', { 'data-testid': 'rich-text-content' }, field?.value || 'No content');
  }),
  Field: ({ field }) => {
    return React.createElement('span', {}, field?.value || '');
  },
}));

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  cn: (...classes) => {
    return classes.filter(Boolean).join(' ');
  },
}));

// Mock NoDataFallback component
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }) => 
    React.createElement('div', { 'data-testid': 'no-data-fallback' }, 
      `${componentName} requires a datasource item assigned.`
    ),
}));

// Avoid loading lucide-react ESM directly in Jest.
jest.mock('lucide-react', () => ({
  Image: (props) => React.createElement('svg', { ...props, 'data-testid': 'lucide-image-icon' }),
}));

// Suppress expected console errors in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress specific React warnings that are expected in tests
  console.error = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : args[0]?.toString() || '';
    
    // Suppress specific expected warnings
    if (
      message.includes('An empty string') ||
      message.includes('was not wrapped in act') ||
      message.includes('Each child in a list should have a unique') ||
      message.includes('Not implemented: navigation') ||
      message.includes('Warning: ReactDOM.render') ||
      message.includes('React does not recognize the `fill` prop') ||
      message.includes('fill="true"') ||
      message.includes('Received `true` for a non-boolean attribute `fill`')
    ) {
      return;
    }
    
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : args[0]?.toString() || '';
    
    // Suppress specific expected warnings
    if (
      message.includes('was not wrapped in act') ||
      message.includes('Not implemented')
    ) {
      return;
    }
    
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

