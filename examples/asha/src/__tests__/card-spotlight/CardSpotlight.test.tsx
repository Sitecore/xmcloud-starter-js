import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardSpotlight } from '../../components/card-spotlight/card-spotlight.dev';
import {
  defaultCardSpotlightProps,
  cardSpotlightReducedMotion,
  cardSpotlightWithClassName,
  cardSpotlightWithAttributes,
} from './CardSpotlight.mockProps';

// Mock framer-motion
jest.mock('motion/react', () => ({
  useMotionValue: jest.fn(() => ({
    set: jest.fn(),
  })),
  useMotionTemplate: jest.fn(() => 'mocked-motion-template'),
  motion: {
    div: ({ children, style, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined | boolean | Record<string, boolean>)[]) => {
    return classes
      .filter((c) => typeof c === 'string' || typeof c === 'object')
      .map((c) => {
        if (typeof c === 'object') {
          return Object.entries(c)
            .filter(([, value]) => value)
            .map(([key]) => key)
            .join(' ');
        }
        return c;
      })
      .filter(Boolean)
      .join(' ');
  },
}));

describe('CardSpotlight', () => {
  it('renders with default props', () => {
    render(<CardSpotlight {...defaultCardSpotlightProps} />);

    expect(screen.getByTestId('spotlight-content')).toBeInTheDocument();
    expect(screen.getByText('Test Spotlight Content')).toBeInTheDocument();
    expect(
      screen.getByTestId('spotlight-content').closest('[data-component="CardSpotlight"]')
    ).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<CardSpotlight {...defaultCardSpotlightProps} />);

    const content = screen.getByTestId('spotlight-content');
    expect(content).toHaveTextContent('Test Spotlight Content');
  });

  it('applies custom className', () => {
    render(<CardSpotlight {...cardSpotlightWithClassName} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]');
    expect(container).toHaveClass('custom-spotlight-class');
  });

  it('passes through additional HTML attributes', () => {
    render(<CardSpotlight {...cardSpotlightWithAttributes} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]');
    expect(container).toHaveAttribute('data-custom', 'test-value');
    expect(container).toHaveAttribute('aria-label', 'Custom spotlight card');
  });

  it('responds to mouse enter and leave events', () => {
    render(<CardSpotlight {...defaultCardSpotlightProps} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]')!;

    // Initially should not have spotlight class
    expect(container.className).not.toContain('spotlight');

    // Mouse enter should add spotlight class
    fireEvent.mouseEnter(container);
    expect(container.className).toContain('spotlight');

    // Mouse leave should remove spotlight class
    fireEvent.mouseLeave(container);
    expect(container.className).not.toContain('spotlight');
  });

  it('responds to focus and blur events', () => {
    render(<CardSpotlight {...defaultCardSpotlightProps} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]')!;

    // Focus should add spotlight class
    fireEvent.focus(container);
    expect(container.className).toContain('spotlight');

    // Blur should remove spotlight class
    fireEvent.blur(container);
    expect(container.className).not.toContain('spotlight');
  });

  it('handles mouse move events', () => {
    render(<CardSpotlight {...defaultCardSpotlightProps} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]')!;

    // Mouse enter first to enable spotlight
    fireEvent.mouseEnter(container);

    // Mock getBoundingClientRect
    (container as HTMLElement).getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 100,
      right: 500,
      bottom: 500,
      width: 400,
      height: 400,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    }));

    // Mouse move should update spotlight position
    fireEvent.mouseMove(container, { clientX: 250, clientY: 250 });

    // Component should still be in the document
    expect(container).toBeInTheDocument();
  });

  it('disables spotlight effects when prefersReducedMotion is true', () => {
    render(<CardSpotlight {...cardSpotlightReducedMotion} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]')!;

    // Mouse enter should not add spotlight class when reduced motion is preferred
    fireEvent.mouseEnter(container);
    expect(container.className).not.toContain('spotlight');
  });

  it('is keyboard accessible with tabIndex 0', () => {
    render(<CardSpotlight {...defaultCardSpotlightProps} />);

    const container = screen
      .getByTestId('spotlight-content')
      .closest('[data-component="CardSpotlight"]');
    expect(container).toHaveAttribute('tabIndex', '0');
  });

  it('renders children wrapper with relative positioning', () => {
    const { container } = render(<CardSpotlight {...defaultCardSpotlightProps} />);

    // Find the inner wrapper that contains children
    const childrenWrapper = container.querySelector('.relative.z-\\[2\\]');
    expect(childrenWrapper).toBeInTheDocument();
  });
});
