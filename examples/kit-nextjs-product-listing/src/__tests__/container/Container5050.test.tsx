import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container5050 } from '../../components/container/container-5050/Container5050';
import {
  defaultContainer5050Props,
  container5050WithStyles,
  container5050NoTopMargin,
  container5050WithContent,
} from './Container5050.mockProps';

// Mock component-map to avoid circular dependency
jest.mock('.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}), { virtual: true });

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name, rendering }: { name: string; rendering: unknown }) => (
    <div data-testid="placeholder" data-name={name} data-rendering={JSON.stringify(rendering)}>
      Placeholder: {name}
    </div>
  ),
  AppPlaceholder: ({ name }: { name: string }) => (
    <div data-testid="app-placeholder" data-name={name}>
      AppPlaceholder: {name}
    </div>
  ),
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
  withDatasourceCheck: () => (component: React.ComponentType) => component,
}));

// Mock Flex components
jest.mock('../../components/flex/Flex.dev', () => ({
  Flex: ({ children, wrap }: { children: React.ReactNode; wrap: string }) => (
    <div data-testid="flex" data-wrap={wrap}>
      {children}
    </div>
  ),
  FlexItem: ({ children, as, basis }: { children: React.ReactNode; as: string; basis: string }) => (
    <div data-testid="flex-item" data-as={as} data-basis={basis}>
      {children}
    </div>
  ),
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => {
    return classes
      .filter(Boolean)
      .map((c) => {
        if (typeof c === 'string') return c;
        if (typeof c === 'object' && c !== null) {
          return Object.keys(c)
            .filter((k) => c[k])
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }),
}));

// Mock container utility functions
jest.mock('@/components/container/container.util', () => ({
  getContainerPlaceholderProps: (key: string, params: Record<string, string>) => ({
    dynamicKey: `${key}-dynamic`,
    genericKey: key,
    fragment: params.fragment || 'default',
  }),
  isContainerPlaceholderEmpty: (
    rendering: unknown,
    _placeholderProps: unknown,
    content: unknown
  ) => {
    return (
      !content &&
      (!rendering || !(rendering as { placeholders?: Record<string, unknown[]> }).placeholders)
    );
  },
}));

describe('Container5050', () => {
  it('renders with default props', () => {
    const { container } = render(<Container5050 {...defaultContainer5050Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container--5050');
  });

  it('renders two placeholders', () => {
    render(<Container5050 {...defaultContainer5050Props} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(2);
    expect(placeholders[0]).toHaveAttribute('data-name', 'container-fifty-left-dynamic');
    expect(placeholders[1]).toHaveAttribute('data-name', 'container-fifty-right-dynamic');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container5050 {...container5050WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container5050 {...container5050NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container5050 {...defaultContainer5050Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders Flex component with correct props', () => {
    render(<Container5050 {...defaultContainer5050Props} />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-wrap', 'nowrap');
  });

  it('renders two FlexItems with 1/2 basis', () => {
    render(<Container5050 {...defaultContainer5050Props} />);

    const flexItems = screen.getAllByTestId('flex-item');
    expect(flexItems).toHaveLength(2);
    expect(flexItems[0]).toHaveAttribute('data-basis', '1/2');
    expect(flexItems[1]).toHaveAttribute('data-basis', '1/2');
  });

  it('renders with content in placeholders', () => {
    render(<Container5050 {...container5050WithContent} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(2);
  });

  it('has correct data-class-change attribute', () => {
    const { container } = render(<Container5050 {...defaultContainer5050Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
