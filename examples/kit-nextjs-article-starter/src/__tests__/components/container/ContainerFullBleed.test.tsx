import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ContainerFullBleed } from '@/components/container/container-full-bleed/ContainerFullBleed';
import {
  defaultProps,
  propsWithPrimaryBackground,
  propsWithSecondaryBackground,
  propsWithTertiaryBackground,
  propsWithTransparentBackground,
  propsWithInset,
  propsWithBackgroundImage,
  propsWithExcludeTopMargin,
  propsWithInsetAndTransparent,
} from './ContainerFullBleed.mockProps';

interface MockPlaceholderProps {
  name?: string;
}

interface MockFlexProps {
  children?: React.ReactNode;
  fullBleed?: boolean;
  className?: string;
}

interface MockFlexItemProps {
  children?: React.ReactNode;
  basis?: string;
}

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name }: MockPlaceholderProps) => <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>,
  AppPlaceholder: ({ name }: MockPlaceholderProps) => <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>,
  withDatasourceCheck:
    () =>
    <T extends object>(Component: React.ComponentType<T>) =>
      Component,
}));

jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, fullBleed, className }: MockFlexProps) => (
    <div data-testid="flex" data-full-bleed={fullBleed} className={className}>
      {children}
    </div>
  ),
  FlexItem: ({ children, basis }: MockFlexItemProps) => (
    <div data-testid="flex-item" data-basis={basis}>
      {children}
    </div>
  ),
}));

describe('ContainerFullBleed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render container with placeholder', () => {
      render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      expect(screen.getByTestId('placeholder-container-fullbleed-main-fullbleed')).toBeInTheDocument();
    });

    it('should render with container--full-bleed class', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('container--full-bleed');
    });

    it('should have @container and group classes', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('@container', 'group');
    });
  });

  describe('Background color variants', () => {
    it('should apply primary background classes', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithPrimaryBackground as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('has-bg', 'bg-primary', 'text-primary-foreground');
    });

    it('should apply secondary background classes', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithSecondaryBackground as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('has-bg', 'bg-secondary', 'text-secondary-foreground');
    });

    it('should apply tertiary background classes', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithTertiaryBackground as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('has-bg', 'bg-tertiary', 'text-tertiary-foreground');
    });

    it('should apply transparent background class', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithTransparentBackground as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-transparent');
    });
  });

  describe('Inset variant', () => {
    it('should apply inset classes when inset is 1 and backgroundColor is set', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithInset as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('is-inset');
      // Check for some inset-related classes
      expect(section?.className).toContain('px-');
      expect(section?.className).toContain('rounded-3xl');
    });

    it('should not apply inset when backgroundColor is transparent', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithInsetAndTransparent as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).not.toHaveClass('is-inset');
    });
  });

  describe('Background image', () => {
    it('should apply background image styles when provided', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithBackgroundImage as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveStyle({
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: 'cover',
      });
    });

    it('should not apply background image when not provided', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      // Check that style attribute is either empty or doesn't contain backgroundImage
      const style = section?.getAttribute('style');
      expect(style).toBeFalsy();
    });
  });

  describe('Margin handling', () => {
    it('should apply default margin', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      // Default margin variant should include margin classes
      expect(section?.className).toMatch(/my-/);
    });

    it('should exclude margin when excludeTopMargin is 1', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithExcludeTopMargin as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-0', 'mb-0');
    });
  });

  describe('Padding variants', () => {
    it('should apply background padding when backgroundColor is set and not transparent', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithPrimaryBackground as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      // Should have padding classes
      expect(section?.className).toMatch(/py-/);
    });

    it('should apply no padding when backgroundColor is transparent', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithTransparentBackground as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-0');
    });

    it('should apply no padding when inset is true', () => {
      const { container } = render(<ContainerFullBleed {...(propsWithInset as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-0');
    });
  });

  describe('Layout structure', () => {
    it('should render with Flex wrapper', () => {
      render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const flex = screen.getByTestId('flex');
      expect(flex).toBeInTheDocument();
      expect(flex).toHaveAttribute('data-full-bleed', 'true');
    });

    it('should apply group-[.is-inset]:p-0 class to Flex', () => {
      render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('group-[.is-inset]:p-0');
    });

    it('should render FlexItem with full basis', () => {
      render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const flexItem = screen.getByTestId('flex-item');
      expect(flexItem).toHaveAttribute('data-basis', 'full');
    });
  });

  describe('Custom styles', () => {
    it('should apply custom styles parameter', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-fullbleed-style');
    });
  });

  describe('Component structure', () => {
    it('should render section as root element', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      expect(section?.tagName).toBe('SECTION');
    });

    it('should have correct class hierarchy', () => {
      const { container } = render(<ContainerFullBleed {...(defaultProps as unknown as Parameters<typeof ContainerFullBleed>[0])} />);

      const section = container.querySelector('section');
      const flex = section?.querySelector('[data-testid="flex"]');
      const flexItem = flex?.querySelector('[data-testid="flex-item"]');
      const placeholder = flexItem?.querySelector('[data-testid^="placeholder-"]');

      expect(section).toBeInTheDocument();
      expect(flex).toBeInTheDocument();
      expect(flexItem).toBeInTheDocument();
      expect(placeholder).toBeInTheDocument();
    });
  });
});

