import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container70 } from '@/components/container/container-70/Container70';
import {
  defaultProps,
  propsWithExcludeTopMargin,
  propsWithEmptyPlaceholders,
  mockSitecoreContext,
  mockSitecoreContextEditing,
} from './Container70.mockProps';

interface MockPlaceholderProps {
  name?: string;
}

interface MockFlexProps {
  children?: React.ReactNode;
  className?: string;
}

interface MockFlexItemProps {
  children?: React.ReactNode;
  basis?: string;
}

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name }: MockPlaceholderProps) => <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>,
  AppPlaceholder: ({ name }: MockPlaceholderProps) => <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>,
  useSitecore: jest.fn(),
  withDatasourceCheck:
    () =>
    <T extends object>(Component: React.ComponentType<T>) =>
      Component,
}));

jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, className }: MockFlexProps) => (
    <div data-testid="flex" className={className}>
      {children}
    </div>
  ),
  FlexItem: ({ children, basis }: MockFlexItemProps) => (
    <div data-testid="flex-item" data-basis={basis}>
      {children}
    </div>
  ),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: (string | Record<string, boolean> | undefined)[]) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object') {
          return Object.keys(arg)
            .filter((key) => arg[key])
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  },
}));

import { useSitecore } from '@sitecore-content-sdk/nextjs';

const mockUseSitecore = useSitecore as jest.MockedFunction<typeof useSitecore>;

describe('Container70 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
  });

  describe('Basic rendering', () => {
    it('should render container with placeholder', () => {
      render(<Container70 {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-seventy-main-70')).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const { container } = render(<Container70 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-70-style');
    });

    it('should have data-component attribute', () => {
      const { container } = render(<Container70 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('data-component', 'Container70');
    });

    it('should have data-class-change attribute', () => {
      const { container } = render(<Container70 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('data-class-change');
    });
  });

  describe('Layout structure', () => {
    it('should render with Flex wrapper', () => {
      render(<Container70 {...defaultProps} />);

      const flex = screen.getByTestId('flex');
      expect(flex).toBeInTheDocument();
      expect(flex).toHaveClass('group-[.is-inset]:p-0');
    });

    it('should render FlexItem with full basis', () => {
      render(<Container70 {...defaultProps} />);

      const flexItem = screen.getByTestId('flex-item');
      expect(flexItem).toHaveAttribute('data-basis', 'full');
    });

    it('should render centered 70% width container', () => {
      const { container } = render(<Container70 {...defaultProps} />);

      const centeredDiv = container.querySelector('.mx-auto.md\\:max-w-\\[70\\%\\]');
      expect(centeredDiv).toBeInTheDocument();
    });
  });

  describe('Margin handling', () => {
    it('should apply default top margin', () => {
      const { container } = render(<Container70 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-4');
    });

    it('should exclude top margin when excludeTopMargin is 1', () => {
      const { container } = render(<Container70 {...propsWithExcludeTopMargin} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-0');
    });
  });

  describe('Empty placeholder handling', () => {
    it('should not render when placeholder is empty and not editing', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container70 {...propsWithEmptyPlaceholders} />);

      expect(container.firstChild).toBeNull();
    });

    it('should render when placeholder is empty but in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContextEditing as ReturnType<typeof useSitecore>);
      const propsEditing = {
        ...propsWithEmptyPlaceholders,
        page: mockSitecoreContextEditing.page,
      };
      const { container } = render(<Container70 {...propsEditing} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should render when children are provided', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const propsWithEmptyAndChildren = {
        ...propsWithEmptyPlaceholders,
        children: 'Child content' as unknown as React.ReactElement,
      };

      const { container } = render(<Container70 {...propsWithEmptyAndChildren} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      const { container } = render(<Container70 {...defaultProps} />);

      const section = container.querySelector('section');
      const flex = section?.querySelector('[data-testid="flex"]');
      const flexItem = flex?.querySelector('[data-testid="flex-item"]');
      const centeredDiv = flexItem?.querySelector('.mx-auto');
      const placeholder = centeredDiv?.querySelector('[data-testid^="placeholder-"]');

      expect(section).toBeInTheDocument();
      expect(flex).toBeInTheDocument();
      expect(flexItem).toBeInTheDocument();
      expect(centeredDiv).toBeInTheDocument();
      expect(placeholder).toBeInTheDocument();
    });
  });
});

