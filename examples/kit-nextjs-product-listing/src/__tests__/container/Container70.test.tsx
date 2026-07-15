import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container70 } from '../../components/container/container-70/Container70';
import {
  defaultContainer70Props,
  container70WithStyles,
  container70NoTopMargin,
  container70WithContent,
} from './Container70.mockProps';

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

describe('Container70', () => {
  it('renders with default props', () => {
    const { container } = render(<Container70 {...defaultContainer70Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'Container70');
  });

  it('renders placeholder with correct dynamic name', () => {
    render(<Container70 {...defaultContainer70Props} />);

    const placeholder = screen.getByTestId('app-placeholder');
    expect(placeholder).toHaveAttribute('data-name', 'container-seventy-1');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container70 {...container70WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container70 {...container70NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container70 {...defaultContainer70Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders Flex component', () => {
    render(<Container70 {...defaultContainer70Props} />);

    const flex = screen.getByTestId('flex');
    expect(flex).toBeInTheDocument();
  });

  it('renders FlexItem with full basis', () => {
    render(<Container70 {...defaultContainer70Props} />);

    const flexItem = screen.getByTestId('flex-item');
    expect(flexItem).toHaveAttribute('data-basis', 'full');
  });

  it('renders with content in placeholder', () => {
    render(<Container70 {...container70WithContent} />);

    const placeholder = screen.getByTestId('app-placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('has data-class-change attribute', () => {
    const { container } = render(<Container70 {...defaultContainer70Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-class-change');
  });
});
