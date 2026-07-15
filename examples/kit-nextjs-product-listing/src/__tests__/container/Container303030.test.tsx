import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container303030 } from '../../components/container/container-303030/Container303030';
import {
  defaultContainer303030Props,
  container303030WithStyles,
  container303030NoTopMargin,
  container303030WithContent,
} from './Container303030.mockProps';

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

// Mock FlexItem component
jest.mock('../../components/flex/Flex.dev', () => ({
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

describe('Container303030', () => {
  it('renders with default props', () => {
    const { container } = render(<Container303030 {...defaultContainer303030Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container--303030');
  });

  it('renders three placeholders with correct names', () => {
    render(<Container303030 {...defaultContainer303030Props} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(3);
    expect(placeholders[0]).toHaveAttribute('data-name', 'container-thirty-left-dynamic');
    expect(placeholders[1]).toHaveAttribute('data-name', 'container-thirty-center-dynamic');
    expect(placeholders[2]).toHaveAttribute('data-name', 'container-thirty-right-dynamic');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container303030 {...container303030WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container303030 {...container303030NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container303030 {...defaultContainer303030Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders three column divs (30/30/30 split)', () => {
    const { container } = render(<Container303030 {...defaultContainer303030Props} />);

    const columns = container.querySelectorAll('.lg\\:w-1\\/3');
    expect(columns).toHaveLength(3);
  });

  it('renders with content in placeholders', () => {
    render(<Container303030 {...container303030WithContent} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(3);
  });

  it('has correct data-class-change attribute', () => {
    const { container } = render(<Container303030 {...defaultContainer303030Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies correct container class name', () => {
    const { container } = render(<Container303030 {...defaultContainer303030Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('container--303030');
  });

  it('uses max-w-[1760px] wrapper class', () => {
    const { container } = render(<Container303030 {...defaultContainer303030Props} />);

    const wrapper = container.querySelector('.max-w-\\[1760px\\]');
    expect(wrapper).toBeInTheDocument();
  });
});
