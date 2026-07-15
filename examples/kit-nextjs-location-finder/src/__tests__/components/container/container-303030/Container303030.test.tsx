import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container303030 } from '../../../../components/container/container-303030/Container303030';
import {
  mockContainer303030Props,
  mockContainer303030PropsNoMargin,
} from './container303030.mock.props';

// Mock Flex components
jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, wrap }: { children: React.ReactNode; wrap?: string }) => (
    <div data-testid="flex-container" data-wrap={wrap}>
      {children}
    </div>
  ),
  FlexItem: ({
    children,
    basis,
    as,
  }: {
    children: React.ReactNode;
    basis?: string;
    as?: string;
  }) => (
    <div data-testid="flex-item" data-basis={basis} data-as={as}>
      {children}
    </div>
  ),
}));

// All other mocks are handled globally in jest.setup.js

describe('Container303030 Component', () => {
  it('renders with basic props and triple placeholders', () => {
    const { container } = render(<Container303030 {...mockContainer303030Props} />);

    // Check for the flex container div
    const flexDiv = container.querySelector('div.w-full.mx-auto.max-w-\\[1760px\\].flex.flex-wrap');
    expect(flexDiv).toBeInTheDocument();

    const placeholders = screen.getAllByTestId('sitecore-placeholder');
    expect(placeholders).toHaveLength(3);
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container303030 {...mockContainer303030Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-303030-styles');
    expect(section).toHaveClass('container--303030');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container303030 {...mockContainer303030PropsNoMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container303030 {...mockContainer303030Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });
});
