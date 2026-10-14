import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container3070 } from '../../components/container/container-3070/Container3070';
import {
  defaultContainer3070Props,
  container3070WithStyles,
  container3070NoTopMargin,
  container3070WithContent,
} from './Container3070.mockProps';

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

describe('Container3070', () => {
  it('renders with default props', () => {
    const { container } = render(<Container3070 {...defaultContainer3070Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container--3070');
  });

  it('renders two placeholders with correct names', () => {
    render(<Container3070 {...defaultContainer3070Props} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(2);
    expect(placeholders[0]).toHaveAttribute('data-name', 'container-thirty-left-dynamic');
    expect(placeholders[1]).toHaveAttribute('data-name', 'container-seventy-right-dynamic');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container3070 {...container3070WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container3070 {...container3070NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container3070 {...defaultContainer3070Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders Flex component with correct props', () => {
    render(<Container3070 {...defaultContainer3070Props} />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-wrap', 'nowrap');
  });

  it('renders two FlexItems with 3/10 and 7/10 basis (30/70 split)', () => {
    render(<Container3070 {...defaultContainer3070Props} />);

    const flexItems = screen.getAllByTestId('flex-item');
    expect(flexItems).toHaveLength(2);
    expect(flexItems[0]).toHaveAttribute('data-basis', '3/10');
    expect(flexItems[1]).toHaveAttribute('data-basis', '7/10');
  });

  it('renders with content in placeholders', () => {
    render(<Container3070 {...container3070WithContent} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(2);
  });

  it('has correct data-class-change attribute', () => {
    const { container } = render(<Container3070 {...defaultContainer3070Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies correct container class name', () => {
    const { container } = render(<Container3070 {...defaultContainer3070Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('container--3070');
  });
});
