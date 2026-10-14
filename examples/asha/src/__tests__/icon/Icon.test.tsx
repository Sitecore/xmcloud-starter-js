/* eslint-disable */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { sharedAttributes, Default as Icon, SvgProps } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';

// Mock the dynamic imports for SVG icons
const MockFacebookIcon = (props: SvgProps) => (
  <svg data-testid="facebook-icon" {...sharedAttributes(props)}>
    <path d="M11.548 20" />
  </svg>
);

const MockInstagramIcon = (props: SvgProps) => (
  <svg data-testid="instagram-icon" {...sharedAttributes(props)}>
    <path d="M10 0" />
  </svg>
);

const MockArrowLeftIcon = (props: SvgProps) => (
  <svg data-testid="arrow-left-icon" {...sharedAttributes(props)}>
    <path d="M0 0" />
  </svg>
);

const MockPlayIcon = (props: SvgProps) => (
  <svg data-testid="play-icon" {...sharedAttributes(props)}>
    <path d="M5 5" />
  </svg>
);

const MockEmailIcon = (props: SvgProps) => (
  <svg data-testid="email-icon" {...sharedAttributes(props)}>
    <path d="M0 0" />
  </svg>
);

jest.mock('@/components/icon/svg/FacebookIcon.dev.tsx', () => ({
  __esModule: true,
  default: MockFacebookIcon,
}));

jest.mock('@/components/icon/svg/InstagramIcon.dev.tsx', () => ({
  __esModule: true,
  default: MockInstagramIcon,
}));

jest.mock('@/components/icon/svg/arrow-left.dev.tsx', () => ({
  __esModule: true,
  default: MockArrowLeftIcon,
}));

jest.mock('@/components/icon/svg/play.dev.tsx', () => ({
  __esModule: true,
  default: MockPlayIcon,
}));

jest.mock('@/components/icon/svg/EmailIcon.dev.tsx', () => ({
  __esModule: true,
  default: MockEmailIcon,
}));

describe('Icon Component Helper Functions', () => {
  describe('sharedAttributes', () => {
    it('includes aria-hidden by default', () => {
      const props = { isAriaHidden: true };
      const attributes = sharedAttributes(props);
      expect(attributes['aria-hidden']).toBe(true);
    });

    it('does not include aria-hidden when isAriaHidden is false', () => {
      const props = { isAriaHidden: false };
      const attributes = sharedAttributes(props);
      expect(attributes['aria-hidden']).toBeUndefined();
    });

    it('includes aria-label when altText is provided', () => {
      const props = { altText: 'Facebook social link' };
      const attributes = sharedAttributes(props);
      expect(attributes['aria-label']).toBe('Facebook social link');
    });

    it('does not include aria-label when altText is not provided', () => {
      const props = {};
      const attributes = sharedAttributes(props);
      expect(attributes['aria-label']).toBeUndefined();
    });

    it('passes through other props', () => {
      const props = { className: 'custom-class', 'data-testid': 'test' };
      const attributes = sharedAttributes(props);
      expect(attributes['className']).toBe('custom-class');
      expect(attributes['data-testid']).toBe('test');
    });

    it('filters out isAriaHidden and altText from spread props', () => {
      const props = { isAriaHidden: true, altText: 'Test', className: 'custom' };
      const attributes = sharedAttributes(props);
      // These should be handled conditionally, not spread
      expect(attributes['className']).toBe('custom');
      expect(attributes['aria-hidden']).toBe(true);
      expect(attributes['aria-label']).toBe('Test');
    });
  });

  describe('Icon enumeration', () => {
    it('has expected icon name values', () => {
      expect(IconName.FACEBOOK).toBeDefined();
      expect(IconName.INSTAGRAM).toBeDefined();
      expect(IconName.TWITTER).toBeDefined();
      expect(IconName.LINKEDIN).toBeDefined();
      expect(IconName.ARROW_LEFT).toBeDefined();
      expect(IconName.ARROW_RIGHT).toBeDefined();
    });
  });

  describe('Default Icon Component', () => {
    it('renders null initially before icon loads', () => {
      const { container } = render(<Icon iconName={IconName.FACEBOOK} />);
      // Initially null while loading
      expect(container.firstChild).toBeNull();
    });

    it('loads and renders Facebook icon', async () => {
      render(<Icon iconName={IconName.FACEBOOK} />);

      await waitFor(() => {
        expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
      });
    });

    it('loads and renders Instagram icon', async () => {
      render(<Icon iconName={IconName.INSTAGRAM} />);

      await waitFor(() => {
        expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
      });
    });

    it('loads and renders arrow-left icon', async () => {
      render(<Icon iconName={IconName.ARROW_LEFT} />);

      await waitFor(() => {
        expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      });
    });

    it('loads and renders play icon', async () => {
      render(<Icon iconName={IconName.PLAY} />);

      await waitFor(() => {
        expect(screen.getByTestId('play-icon')).toBeInTheDocument();
      });
    });

    it('passes isAriaHidden prop to loaded icon', async () => {
      render(<Icon iconName={IconName.EMAIL} isAriaHidden={false} />);

      await waitFor(() => {
        const icon = screen.getByTestId('email-icon');
        expect(icon).toBeInTheDocument();
        // isAriaHidden false means aria-hidden should not be present
        expect(icon).not.toHaveAttribute('aria-hidden');
      });
    });

    it('passes isAriaHidden true by default', async () => {
      render(<Icon iconName={IconName.EMAIL} />);

      await waitFor(() => {
        const icon = screen.getByTestId('email-icon');
        expect(icon).toBeInTheDocument();
        // isAriaHidden defaults to true, so aria-hidden should be "true"
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('passes additional props to loaded icon', async () => {
      render(
        <Icon iconName={IconName.FACEBOOK} className="custom-icon" data-testid="facebook-test" />
      );

      await waitFor(() => {
        const icon = screen.getByTestId('facebook-test');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('custom-icon');
      });
    });

    it('passes altText through to loaded icon', async () => {
      render(<Icon iconName={IconName.FACEBOOK} altText="Facebook social link" />);

      await waitFor(() => {
        const icon = screen.getByTestId('facebook-icon');
        expect(icon).toBeInTheDocument();
        // altText is converted to aria-label by sharedAttributes
        expect(icon).toHaveAttribute('aria-label', 'Facebook social link');
      });
    });

    it('returns null for unmapped icon names', () => {
      const { container } = render(<Icon iconName={'UNKNOWN' as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('re-renders when iconName prop changes', async () => {
      const { rerender } = render(<Icon iconName={IconName.FACEBOOK} />);

      await waitFor(() => {
        expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
      });

      rerender(<Icon iconName={IconName.INSTAGRAM} />);

      await waitFor(() => {
        expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
      });
    });
  });
});
