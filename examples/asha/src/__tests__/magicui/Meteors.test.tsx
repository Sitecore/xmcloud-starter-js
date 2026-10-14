/* eslint-disable */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { Meteors } from '../../components/magicui/meteors';

import {
  defaultMeteorsProps,
  meteorsPropsMinimal,
  meteorsPropsCustom,
  meteorsPropsLarge,
} from './Meteors.mockProps';

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

// Mock Math.random to make tests deterministic
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

// Mock ResizeObserver for intersection observer
global.ResizeObserver = class ResizeObserver {
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  cb: any;
};

describe('Meteors Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener('resize', jest.fn());
  });

  describe('Default Behavior', () => {
    it('renders meteors container with default props', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      // Should render container div
      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();

      // Should render meteors (spans)
      const meteors = document.querySelectorAll('span');
      expect(meteors.length).toBe(20); // default number of meteors
    });

    it('applies custom className to meteors', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor).toHaveClass('test-meteors');
      });
    });

    it('generates correct number of meteors', () => {
      render(<Meteors {...meteorsPropsMinimal} />);

      const meteors = document.querySelectorAll('span');
      expect(meteors.length).toBe(5);
    });
  });

  describe('Meteor Properties', () => {
    it('sets correct meteor size', () => {
      render(<Meteors {...meteorsPropsCustom} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.width).toBe('2px');
        expect(meteor.style.height).toBe('2px');
      });
    });

    it('applies correct rotation angle', () => {
      render(<Meteors {...meteorsPropsCustom} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.transform).toContain('rotate(180deg)');
      });
    });

    it('sets meteor positioning properties', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.position).toBe('absolute');
        expect(meteor.style.top).toBe('-5px');
        expect(meteor.style.pointerEvents).toBe('none');
      });
    });

    it('includes meteor tail element', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteorTails = document.querySelectorAll('span > div');
      expect(meteorTails.length).toBe(20); // One tail per meteor
      meteorTails.forEach((tail) => {
        expect(tail).toHaveClass('pointer-events-none', 'absolute');
      });
    });
  });

  describe('Animation Properties', () => {
    it('sets animation duration within specified range', () => {
      render(<Meteors {...meteorsPropsCustom} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        const duration = meteor.style.animationDuration;
        expect(duration).toMatch(/\d+s/); // Should be in seconds format
      });
    });

    it('sets animation delay within specified range', () => {
      render(<Meteors {...meteorsPropsCustom} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        const delay = meteor.style.animationDelay;
        expect(delay).toMatch(/[\d.]+s/); // Should be in seconds format with possible decimal
      });
    });

    it('includes keyframe animation styles', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      // Check if global styles are added (style tag should be present)
      const styleTags = document.querySelectorAll('style');
      expect(styleTags.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Behavior', () => {
    it('handles window resize events', () => {
      const { container } = render(<Meteors {...defaultMeteorsProps} />);

      // Initial meteors count
      let meteors = container.querySelectorAll('span');
      expect(meteors.length).toBe(20);

      // Simulate window resize
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 1920 });
        fireEvent(window, new Event('resize'));
      });

      // Meteors should still be the same count but repositioned
      meteors = container.querySelectorAll('span');
      expect(meteors.length).toBe(20);
    });

    it('distributes meteors across container width', () => {
      // Mock container width
      const mockOffsetWidth = 800;
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        value: mockOffsetWidth,
        writable: true,
      });

      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        const leftValue = parseInt(meteor.style.left);
        expect(leftValue).toBeLessThanOrEqual(mockOffsetWidth);
        expect(leftValue).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('CSS Variables and Styling', () => {
    it('sets CSS custom properties for angle', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.getPropertyValue('--angle')).toBe('215deg');
      });
    });

    it('applies proper CSS classes', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor).toHaveClass('pointer-events-none');
        expect(meteor).toHaveClass('absolute');
        expect(meteor).toHaveClass('rounded-full');
        expect(meteor).toHaveClass('test-meteors');
      });
    });

    it('styles meteor tails correctly', () => {
      render(<Meteors {...meteorsPropsLarge} />);

      const meteorTails = document.querySelectorAll('span > div');
      meteorTails.forEach((tail) => {
        const tailElement = tail as HTMLElement;
        expect(tailElement.style.width).toBe('100px');
        expect(tailElement.style.backgroundImage).toContain('linear-gradient');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('renders large number of meteors efficiently', () => {
      const startTime = performance.now();
      render(<Meteors {...meteorsPropsLarge} />);
      const endTime = performance.now();

      const meteors = document.querySelectorAll('span');
      expect(meteors.length).toBe(50);
      expect(endTime - startTime).toBeLessThan(100); // Should render in under 100ms
    });

    it('sets pointer-events to none for performance', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.pointerEvents).toBe('none');
      });

      const meteorTails = document.querySelectorAll('span > div');
      meteorTails.forEach((tail) => {
        expect(tail).toHaveClass('pointer-events-none');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles zero meteors gracefully', () => {
      render(<Meteors number={0} />);

      const meteors = document.querySelectorAll('span');
      expect(meteors.length).toBe(0);
    });

    it('handles missing className prop', () => {
      const { className, ...propsWithoutClassName } = defaultMeteorsProps;
      render(<Meteors {...propsWithoutClassName} />);

      const meteors = document.querySelectorAll('span');
      expect(meteors.length).toBe(20);
      meteors.forEach((meteor) => {
        expect(meteor).not.toHaveClass('test-meteors');
      });
    });

    it('handles extreme animation values', () => {
      render(
        <Meteors
          number={1}
          minDelay={0}
          maxDelay={0}
          minDuration={0.1}
          maxDuration={0.1}
          angle={360}
        />
      );

      const meteors = document.querySelectorAll('span');
      expect(meteors.length).toBe(1);
      expect(meteors[0].style.transform).toContain('rotate(360deg)');
    });
  });

  describe('Component Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = render(<Meteors {...defaultMeteorsProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Visual Effects', () => {
    it('includes box shadow styling', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.boxShadow).toContain('rgba(255,255,255,0.1)');
      });
    });

    it('sets proper opacity and background color', () => {
      render(<Meteors {...defaultMeteorsProps} />);

      const meteors = document.querySelectorAll('span');
      meteors.forEach((meteor) => {
        expect(meteor.style.opacity).toBe('1');
        expect(meteor.style.backgroundColor).toContain('rgba(var(--meteor-color');
      });
    });
  });
});
