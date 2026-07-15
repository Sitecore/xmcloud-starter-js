import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardSpotlight } from '@/components/card-spotlight/card-spotlight.dev';

// Mock framer-motion/motion
jest.mock('motion/react', () => {
  const motion = {
    div: ({ children, style, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props} style={style as React.CSSProperties}>
        {children}
      </div>
    ),
  };
  return {
    useMotionValue: jest.fn(() => ({ set: jest.fn(), get: jest.fn(() => 0) })),
    useMotionTemplate: jest.fn(() => 'mocked-gradient'),
    motion,
    m: motion,
  };
});

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

describe('CardSpotlight Component', () => {
  it('renders children correctly', () => {
    render(
      <CardSpotlight>
        <p>Test Content</p>
      </CardSpotlight>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with spotlight effect when not reduced motion', () => {
    const { container } = render(
      <CardSpotlight>
        <p>Spotlight Test</p>
      </CardSpotlight>
    );

    // Check that component renders with correct data attribute
    const component = container.querySelector('[data-component="CardSpotlight"]');
    expect(component).toBeInTheDocument();

    // Check that spotlight effect container exists
    const spotlightEffect = container.querySelector('.pointer-events-none');
    expect(spotlightEffect).toBeInTheDocument();
  });

  it('does not render spotlight when prefersReducedMotion is true', () => {
    const { container } = render(
      <CardSpotlight prefersReducedMotion>
        <p>Reduced Motion Test</p>
      </CardSpotlight>
    );

    // Spotlight effect should not be rendered
    const spotlightEffect = container.querySelector('.pointer-events-none');
    expect(spotlightEffect).not.toBeInTheDocument();
  });
});
