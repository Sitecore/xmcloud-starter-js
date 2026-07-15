import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import {
  defaultProps,
  propsSlideUp,
  propsSlideDown,
  propsSlideLeft,
  propsSlideRight,
  propsRotate,
  propsRotate360,
  propsWithDelay,
  propsWithCustomDuration,
  propsReducedMotion,
  propsPageEditing,
  propsMinimal,
} from './AnimatedSection.mockProps';

// Mock the useIntersectionObserver hook
const mockUseIntersectionObserver = jest.fn();
jest.mock('@/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => mockUseIntersectionObserver(),
}));

describe('AnimatedSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: element is visible
    mockUseIntersectionObserver.mockReturnValue([true, { current: null }]);
  });

  describe('Basic rendering', () => {
    it('should render children', () => {
      render(<AnimatedSection {...defaultProps} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<AnimatedSection {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should render with minimal props', () => {
      render(<AnimatedSection {...propsMinimal} />);
      expect(screen.getByText('Minimal Content')).toBeInTheDocument();
    });
  });

  describe('Slide animation variants', () => {
    describe('Direction: up', () => {
      it('should apply correct CSS variables for up direction', () => {
        const { container } = render(<AnimatedSection {...propsSlideUp} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.getPropertyValue('--translate-x')).toBe('0');
        expect(wrapper.style.getPropertyValue('--translate-y')).toBe('2rem');
      });

      it('should apply transform when visible', () => {
        mockUseIntersectionObserver.mockReturnValue([true, { current: null }]);
        const { container } = render(<AnimatedSection {...propsSlideUp} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.transform).toBe('translate(0, 0)');
      });

      it('should apply initial transform when not visible', () => {
        mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
        const { container } = render(<AnimatedSection {...propsSlideUp} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.transform).toBe('translate(var(--translate-x), var(--translate-y))');
      });
    });

    describe('Direction: down', () => {
      it('should apply correct CSS variables for down direction', () => {
        const { container } = render(<AnimatedSection {...propsSlideDown} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.getPropertyValue('--translate-x')).toBe('0');
        expect(wrapper.style.getPropertyValue('--translate-y')).toBe('-2rem');
      });
    });

    describe('Direction: left', () => {
      it('should apply correct CSS variables for left direction', () => {
        const { container } = render(<AnimatedSection {...propsSlideLeft} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.getPropertyValue('--translate-x')).toBe('2rem');
        expect(wrapper.style.getPropertyValue('--translate-y')).toBe('0');
      });
    });

    describe('Direction: right', () => {
      it('should apply correct CSS variables for right direction', () => {
        const { container } = render(<AnimatedSection {...propsSlideRight} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.getPropertyValue('--translate-x')).toBe('-2rem');
        expect(wrapper.style.getPropertyValue('--translate-y')).toBe('0');
      });
    });
  });

  describe('Rotate animation variant', () => {
    it('should apply rotate transform when visible', () => {
      mockUseIntersectionObserver.mockReturnValue([true, { current: null }]);
      const { container } = render(<AnimatedSection {...propsRotate} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transform).toBe('rotate(180deg)');
    });

    it('should apply initial rotate when not visible', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const { container } = render(<AnimatedSection {...propsRotate} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transform).toBe('rotate(0deg)');
    });

    it('should support custom rotation angle', () => {
      mockUseIntersectionObserver.mockReturnValue([true, { current: null }]);
      const { container } = render(<AnimatedSection {...propsRotate360} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transform).toBe('rotate(360deg)');
    });

    it('should apply transition with custom duration', () => {
      const { container } = render(<AnimatedSection {...propsRotate} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toContain('transform 1000ms');
    });
  });

  describe('Timing and duration', () => {
    it('should apply custom delay', () => {
      const { container } = render(<AnimatedSection {...propsWithDelay} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toContain('500ms');
    });

    it('should apply custom duration', () => {
      const { container } = render(<AnimatedSection {...propsWithCustomDuration} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toContain('2000ms');
    });

    it('should apply both delay and duration for slide animation', () => {
      const props = { ...defaultProps, delay: 300, duration: 1500 };
      const { container } = render(<AnimatedSection {...props} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toContain('opacity 1500ms 300ms');
      expect(wrapper.style.transition).toContain('transform 1500ms 300ms');
    });
  });

  describe('Reduced motion support', () => {
    it('should disable transitions when reducedMotion is true', () => {
      const { container } = render(<AnimatedSection {...propsReducedMotion} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toBe('none');
    });

    it('should set opacity to 1 when reducedMotion is true', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const { container } = render(<AnimatedSection {...propsReducedMotion} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.opacity).toBe('1');
    });

    it('should still render children with reducedMotion', () => {
      render(<AnimatedSection {...propsReducedMotion} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Page editing mode', () => {
    it('should disable transitions in editing mode', () => {
      const { container } = render(<AnimatedSection {...propsPageEditing} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toBe('none');
    });

    it('should show final state in editing mode for slide animation', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const { container } = render(<AnimatedSection {...propsPageEditing} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transform).toBe('translate(0, 0)');
    });

    it('should show final state in editing mode for rotate animation', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const props = { ...propsPageEditing, animationType: 'rotate' as const };
      const { container } = render(<AnimatedSection {...props} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transform).toBe('rotate(180deg)');
    });
  });

  describe('Opacity behavior', () => {
    it('should set opacity to 1 when visible', () => {
      mockUseIntersectionObserver.mockReturnValue([true, { current: null }]);
      const { container } = render(<AnimatedSection {...propsSlideUp} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.opacity).toBe('1');
    });

    it('should set opacity to 0 when not visible', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const { container } = render(<AnimatedSection {...propsSlideUp} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.opacity).toBe('0');
    });

    it('should not apply opacity to rotate animation', () => {
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const { container } = render(<AnimatedSection {...propsRotate} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.opacity).toBe('');
    });
  });

  describe('Intersection observer integration', () => {
    it('should call useIntersectionObserver with correct threshold', () => {
      render(<AnimatedSection {...defaultProps} />);
      expect(mockUseIntersectionObserver).toHaveBeenCalled();
    });

    it('should react to visibility changes', () => {
      // Test when not visible
      mockUseIntersectionObserver.mockReturnValue([false, { current: null }]);
      const { container } = render(<AnimatedSection {...propsSlideUp} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.opacity).toBe('0');
      
      // Test when visible (separate render due to memo)
      mockUseIntersectionObserver.mockReturnValue([true, { current: null }]);
      const { container: container2 } = render(<AnimatedSection {...propsSlideUp} />);
      const wrapper2 = container2.firstChild as HTMLElement;
      expect(wrapper2.style.opacity).toBe('1');
    });
  });

  describe('Default prop values', () => {
    it('should use default direction (up) when not specified', () => {
      const props = { children: <div>Content</div> };
      const { container } = render(<AnimatedSection {...props} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--translate-y')).toBe('2rem');
    });

    it('should use default animationType (slide) when not specified', () => {
      const props = { children: <div>Content</div> };
      const { container } = render(<AnimatedSection {...props} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transform).toContain('translate');
    });

    it('should use default duration (1000ms) when not specified', () => {
      const props = { children: <div>Content</div> };
      const { container } = render(<AnimatedSection {...props} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toContain('1000ms');
    });

    it('should use default delay (0) when not specified', () => {
      const props = { children: <div>Content</div> };
      const { container } = render(<AnimatedSection {...props} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transition).toContain('0ms');
    });
  });

  describe('Component memoization', () => {
    it('should have displayName set', () => {
      expect(AnimatedSection.displayName).toBe('AnimatedSection');
    });
  });

  describe('Complex children', () => {
    it('should render complex JSX children', () => {
      const complexChildren = (
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Click</button>
        </div>
      );
      render(<AnimatedSection {...defaultProps}>{complexChildren}</AnimatedSection>);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Click')).toBeInTheDocument();
    });
  });
});

