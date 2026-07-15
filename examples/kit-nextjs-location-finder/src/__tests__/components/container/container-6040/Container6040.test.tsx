import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container6040 } from '../../../../components/container/container-6040/Container6040';
import { mockContainer6040Props, mockContainer6040PropsNoMargin } from './container6040.mock.props';

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

describe('Container6040 Component', () => {
  it('renders with basic props and dual placeholders', () => {
    render(<Container6040 {...mockContainer6040Props} />);

    expect(screen.getByTestId('flex-container')).toHaveAttribute('data-wrap', 'nowrap');
    const flexItems = screen.getAllByTestId('flex-item');
    expect(flexItems).toHaveLength(2);
    expect(flexItems[0]).toHaveAttribute('data-basis', '6/10');
    expect(flexItems[1]).toHaveAttribute('data-basis', '4/10');

    const placeholders = screen.getAllByTestId('sitecore-placeholder');
    expect(placeholders).toHaveLength(2);
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container6040 {...mockContainer6040Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-6040-styles');
    expect(section).toHaveClass('container--6040');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container6040 {...mockContainer6040PropsNoMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container6040 {...mockContainer6040Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });
});
