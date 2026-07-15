import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ContainerFullWidth } from '../../components/container/container-full-width/ContainerFullWidth';
import {
  defaultContainerFullWidthProps,
  containerFullWidthWithStyles,
  containerFullWidthNoTopMargin,
  containerFullWidthWithContent,
} from './ContainerFullWidth.mockProps';

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
  Flex: ({ children }: { children: React.ReactNode }) => <div data-testid="flex">{children}</div>,
  FlexItem: ({ children, basis }: { children: React.ReactNode; basis?: string }) => (
    <div data-testid="flex-item" data-basis={basis}>
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

describe('ContainerFullWidth', () => {
  it('renders with default props', () => {
    const { container } = render(<ContainerFullWidth {...defaultContainerFullWidthProps} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('@container');
    expect(section).toHaveClass('container--full-width');
  });

  it('renders placeholder with correct dynamic name', () => {
    render(<ContainerFullWidth {...defaultContainerFullWidthProps} />);

    const placeholder = screen.getByTestId('app-placeholder');
    expect(placeholder).toHaveAttribute('data-name', 'container-fullwidth-1');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<ContainerFullWidth {...containerFullWidthWithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<ContainerFullWidth {...containerFullWidthNoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<ContainerFullWidth {...defaultContainerFullWidthProps} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders Flex component', () => {
    render(<ContainerFullWidth {...defaultContainerFullWidthProps} />);

    const flex = screen.getByTestId('flex');
    expect(flex).toBeInTheDocument();
  });

  it('renders FlexItem with full basis', () => {
    render(<ContainerFullWidth {...defaultContainerFullWidthProps} />);

    const flexItem = screen.getByTestId('flex-item');
    expect(flexItem).toHaveAttribute('data-basis', 'full');
  });

  it('renders with content in placeholder', () => {
    render(<ContainerFullWidth {...containerFullWidthWithContent} />);

    const placeholder = screen.getByTestId('app-placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('has group class for styling', () => {
    const { container } = render(<ContainerFullWidth {...defaultContainerFullWidthProps} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('group');
  });
});
