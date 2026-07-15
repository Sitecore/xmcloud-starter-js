import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container70 } from '../../../../components/container/container-70/Container70';
import { mockContainer70Props, mockContainer70PropsNoMargin } from './container70.mock.props';

// Mock Flex components
jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="flex-container" className={className}>
      {children}
    </div>
  ),
  FlexItem: ({ children, basis }: { children: React.ReactNode; basis?: string }) => (
    <div data-testid="flex-item" data-basis={basis}>
      {children}
    </div>
  ),
}));

// All other mocks are handled globally in jest.setup.js

describe('Container70 Component', () => {
  it('renders with basic props', () => {
    render(<Container70 {...mockContainer70Props} />);

    expect(screen.getByTestId('flex-container')).toBeInTheDocument();
    expect(screen.getByTestId('flex-item')).toHaveAttribute('data-basis', 'full');
    expect(screen.getByTestId('sitecore-placeholder')).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container70 {...mockContainer70Props} />);

    const section = container.querySelector('[data-component="Container70"]');
    expect(section).toHaveClass('custom-container-styles');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container70 {...mockContainer70PropsNoMargin} />);

    const section = container.querySelector('[data-component="Container70"]');
    expect(section).toHaveClass('mt-0');
    expect(section).not.toHaveClass('mt-4');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container70 {...mockContainer70Props} />);

    const section = container.querySelector('[data-component="Container70"]');
    expect(section).toHaveClass('mt-4');
    expect(section).not.toHaveClass('mt-0');
  });
});
