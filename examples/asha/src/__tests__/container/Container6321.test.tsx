import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container6321 } from '../../components/container/container-6321/Container6321';
import {
  defaultContainer6321Props,
  container6321WithStyles,
  container6321NoTopMargin,
  container6321WithContent,
} from './Container6321.mockProps';

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

describe('Container6321', () => {
  it('renders with default props', () => {
    const { container } = render(<Container6321 {...defaultContainer6321Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container--6321');
  });

  it('renders six placeholders with correct names', () => {
    render(<Container6321 {...defaultContainer6321Props} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(6);
    expect(placeholders[0]).toHaveAttribute('data-name', 'container-sixty-thirty-one-dynamic');
    expect(placeholders[1]).toHaveAttribute('data-name', 'container-sixty-thirty-two-dynamic');
    expect(placeholders[2]).toHaveAttribute('data-name', 'container-sixty-thirty-three-dynamic');
    expect(placeholders[3]).toHaveAttribute('data-name', 'container-sixty-thirty-four-dynamic');
    expect(placeholders[4]).toHaveAttribute('data-name', 'container-sixty-thirty-five-dynamic');
    expect(placeholders[5]).toHaveAttribute('data-name', 'container-sixty-thirty-six-dynamic');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container6321 {...container6321WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-grid-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container6321 {...container6321NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container6321 {...defaultContainer6321Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-10');
  });

  it('has correct background color', () => {
    const { container } = render(<Container6321 {...defaultContainer6321Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-[#f5f5f5]');
  });

  it('renders with content in placeholders', () => {
    render(<Container6321 {...container6321WithContent} />);

    const placeholders = screen.getAllByTestId('app-placeholder');
    expect(placeholders).toHaveLength(6);
  });

  it('renders grid container with correct max width', () => {
    const { container } = render(<Container6321 {...defaultContainer6321Props} />);

    const gridContainer = container.querySelector('.max-w-\\[1760px\\]');
    expect(gridContainer).toBeInTheDocument();
  });

  it('applies correct container class name', () => {
    const { container } = render(<Container6321 {...defaultContainer6321Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('container--6321');
  });

  it('renders grid with flex-wrap', () => {
    const { container } = render(<Container6321 {...defaultContainer6321Props} />);

    const gridContainer = container.querySelector('.flex-wrap');
    expect(gridContainer).toBeInTheDocument();
  });
});
