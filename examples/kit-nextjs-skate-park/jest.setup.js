import '@testing-library/jest-dom';

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

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
      layout: {
        sitecore: {
          route: {
            fields: {
              Title: {
                value: 'Test Title',
              },
            },
          },
        },
      },
    },
  }),
  Text: ({ field, children, tag, ...props }) => {
    const Tag = tag || 'span';
    if (field?.value) {
      return <Tag {...props}>{field.value}</Tag>;
    }
    return <Tag {...props}>{children}</Tag>;
  },
  Link: ({ field, children, ...props }) => {
    if (field?.value?.href) {
      return <a href={field.value.href} {...props}>{children || field.value.text}</a>;
    }
    if (children) {
      return <span {...props}>{children}</span>;
    }
    return <span {...props}>{field?.value?.text || ''}</span>;
  },
  Placeholder: ({ name, rendering, ...props }) => (
    <div data-testid={`placeholder-${name}`} {...props}>
      Placeholder: {name}
    </div>
  ),
  AppPlaceholder: ({ name, rendering, ...props }) => (
    <div data-testid={`placeholder-${name}`} {...props}>
      Placeholder: {name}
    </div>
  ),
  NextImage: ({ field, ...props }) => {
    if (field?.value?.src) {
      return <img src={field.value.src} alt={field.value.alt || ''} {...props} />;
    }
    return <img {...props} />;
  },
  RichText: ({ field, ...props }) => {
    if (field?.value) {
      return <div {...props} dangerouslySetInnerHTML={{ __html: field.value }} />;
    }
    return <div {...props} />;
  },
  withDatasourceCheck: () => (Component) => Component,
}));

// Mock component-map to avoid circular dependencies in tests
jest.mock('.sitecore/component-map', () => ({}), { virtual: true });

// Suppress console warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('for a non-boolean attribute') ||
        args[0].includes('editable') ||
        args[0].includes('An update to') ||
        args[0].includes('was not wrapped in act'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

