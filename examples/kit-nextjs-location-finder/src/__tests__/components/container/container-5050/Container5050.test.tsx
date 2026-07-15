import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container5050 } from '../../../../components/container/container-5050/Container5050';
import { mockContainer5050Props, mockContainer5050PropsNoMargin } from './container5050.mock.props';

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

describe('Container5050 Component', () => {
  it('renders with basic props and dual placeholders', () => {
    render(<Container5050 {...mockContainer5050Props} />);

    expect(screen.getByTestId('flex-container')).toHaveAttribute('data-wrap', 'nowrap');
    const flexItems = screen.getAllByTestId('flex-item');
    expect(flexItems).toHaveLength(2);
    expect(flexItems[0]).toHaveAttribute('data-basis', '1/2');
    expect(flexItems[1]).toHaveAttribute('data-basis', '1/2');

    const placeholders = screen.getAllByTestId('sitecore-placeholder');
    expect(placeholders).toHaveLength(2);
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container5050 {...mockContainer5050Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-5050-styles');
    expect(section).toHaveClass('container--5050');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container5050 {...mockContainer5050PropsNoMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container5050 {...mockContainer5050Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });
});
