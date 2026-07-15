import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as AnimatedSection } from '../../components/animated-section/AnimatedSection.dev';
import {
  defaultProps,
  rotateProps,
  reducedMotionProps,
  editingProps,
} from './AnimatedSection.mockProps';

// We'll mock the useIntersectionObserver hook to control visibility and ref
const mockUseIntersectionObserver = jest.fn();

jest.mock('../../components/animated-section/animated-section.props', () => ({
  // re-export types for TS; tests don't need runtime behavior
}));

jest.mock('../../hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => mockUseIntersectionObserver(),
}));

describe('AnimatedSection', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders children and applies provided className', () => {
    mockUseIntersectionObserver.mockReturnValue([false, null]);
    const { container } = render(<AnimatedSection {...defaultProps} />);

    expect(screen.getByTestId('animated-child')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('applies rotate transform when animationType is rotate and visible', () => {
    mockUseIntersectionObserver.mockReturnValue([true, null]);
    const { container } = render(<AnimatedSection {...rotateProps} />);

    // expect inline style transform to contain rotate(90deg)
    const style = (container.firstChild as HTMLElement).style.transform;
    expect(style).toContain('rotate(90deg)');
  });

  it('uses opacity 1 when visible and reducedMotion false', () => {
    mockUseIntersectionObserver.mockReturnValue([true, null]);
    const { container } = render(<AnimatedSection {...defaultProps} />);

    const opacity = (container.firstChild as HTMLElement).style.opacity;
    expect(opacity).toBe('1');
  });

  it('uses no transition when reducedMotion is true', () => {
    mockUseIntersectionObserver.mockReturnValue([false, null]);
    const { container } = render(<AnimatedSection {...reducedMotionProps} />);

    const transition = (container.firstChild as HTMLElement).style.transition;
    expect(transition).toBe('none');
  });

  it('forces visible styles when isPageEditing is true even if not visible', () => {
    mockUseIntersectionObserver.mockReturnValue([false, null]);
    const { container } = render(<AnimatedSection {...editingProps} />);

    // Component uses isPageEditing to force transform to visible state, but
    // opacity is only driven by reducedMotion || isVisible. Assert transform is
    // the visible transform when isPageEditing is true.
    const transform = (container.firstChild as HTMLElement).style.transform;
    expect(transform).toContain('translate(0, 0)');
  });
});
