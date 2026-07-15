import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ContainerFullBleed } from '../../../../components/container/container-full-bleed/ContainerFullBleed';
import {
  mockContainerFullBleedProps,
  mockContainerFullBleedPropsNoMargin,
} from './containerfullbleed.mock.props';

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

describe('ContainerFullBleed Component', () => {
  it('renders with basic props', () => {
    render(<ContainerFullBleed {...(mockContainerFullBleedProps as unknown as React.ComponentProps<typeof ContainerFullBleed>)} />);

    expect(screen.getByTestId('flex-container')).toBeInTheDocument();
    expect(screen.getByTestId('flex-item')).toHaveAttribute('data-basis', 'full');
    expect(screen.getByTestId('sitecore-placeholder')).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const { container } = render(<ContainerFullBleed {...(mockContainerFullBleedProps as unknown as React.ComponentProps<typeof ContainerFullBleed>)} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-fullbleed-styles');
    expect(section).toHaveClass('container--full-bleed');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<ContainerFullBleed {...(mockContainerFullBleedPropsNoMargin as unknown as React.ComponentProps<typeof ContainerFullBleed>)} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
    expect(section).toHaveClass('mb-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<ContainerFullBleed {...(mockContainerFullBleedProps as unknown as React.ComponentProps<typeof ContainerFullBleed>)} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('my-8');
    expect(section).toHaveClass('sm:my-16');
  });
});
