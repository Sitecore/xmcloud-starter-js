import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container7030 } from '../../components/container/container-7030/Container7030';
import {
  defaultContainer7030Props,
  container7030WithStyles,
  container7030NoTopMargin,
  container7030WithContent,
} from './Container7030.mockProps';

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

describe('Container7030', () => {
  it('renders with default props', () => {
    const { container } = render(<Container7030 {...defaultContainer7030Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container--7030');
  });

  it('renders two placeholders with correct names', () => {
    render(<Container7030 {...defaultContainer7030Props} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(2);
    expect(placeholders[0]).toHaveAttribute('data-name', 'container-seventy-left-dynamic');
    expect(placeholders[1]).toHaveAttribute('data-name', 'container-thirty-right-dynamic');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container7030 {...container7030WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container7030 {...container7030NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container7030 {...defaultContainer7030Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders Flex component with correct props', () => {
    render(<Container7030 {...defaultContainer7030Props} />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-wrap', 'nowrap');
  });

  it('renders two FlexItems with 7/10 and 3/10 basis (70/30 split)', () => {
    render(<Container7030 {...defaultContainer7030Props} />);

    const flexItems = screen.getAllByTestId('flex-item');
    expect(flexItems).toHaveLength(2);
    expect(flexItems[0]).toHaveAttribute('data-basis', '7/10');
    expect(flexItems[1]).toHaveAttribute('data-basis', '3/10');
  });

  it('renders with content in placeholders', () => {
    render(<Container7030 {...container7030WithContent} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(2);
  });

  it('applies correct container class name', () => {
    const { container } = render(<Container7030 {...defaultContainer7030Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('container--7030');
  });
});
