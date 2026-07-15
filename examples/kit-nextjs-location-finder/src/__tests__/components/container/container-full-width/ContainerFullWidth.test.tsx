import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ContainerFullWidth } from '../../../../components/container/container-full-width/ContainerFullWidth';
import {
  mockContainerFullWidthProps,
  mockContainerFullWidthPropsNoMargin,
} from './containerfullwidth.mock.props';

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

describe('ContainerFullWidth Component', () => {
  it('renders with basic props', () => {
    render(<ContainerFullWidth {...(mockContainerFullWidthProps as unknown as React.ComponentProps<typeof ContainerFullWidth>)} />);

    expect(screen.getByTestId('flex-container')).toBeInTheDocument();
    expect(screen.getByTestId('flex-item')).toHaveAttribute('data-basis', 'full');
    expect(screen.getByTestId('sitecore-placeholder')).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const { container } = render(<ContainerFullWidth {...(mockContainerFullWidthProps as unknown as React.ComponentProps<typeof ContainerFullWidth>)} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-fullwidth-styles');
    expect(section).toHaveClass('container--full-width');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<ContainerFullWidth {...(mockContainerFullWidthPropsNoMargin as unknown as React.ComponentProps<typeof ContainerFullWidth>)} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
    expect(section).not.toHaveClass('mt-4');
  });

  it('includes top margin by default', () => {
    const { container } = render(<ContainerFullWidth {...(mockContainerFullWidthProps as unknown as React.ComponentProps<typeof ContainerFullWidth>)} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
    expect(section).not.toHaveClass('mt-0');
  });
});
