import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container7030 } from '@/components/container/container-7030/Container7030';
import {
  defaultProps,
  propsWithExcludeTopMargin,
  propsWithEmptyPlaceholders,
  propsWithOnlyLeftPlaceholder,
  propsWithOnlyRightPlaceholder,
  mockSitecoreContext,
  mockSitecoreContextEditing,
} from './Container7030.mockProps';

interface MockPlaceholderProps {
  name?: string;
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

interface MockFlexProps {
  children?: React.ReactNode;
  wrap?: string;
}

interface MockFlexItemProps {
  children?: React.ReactNode;
  basis?: string;
  as?: React.ElementType;
}

jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, wrap }: MockFlexProps) => (
    <div data-testid="flex" data-wrap={wrap}>
      {children}
    </div>
  ),
  FlexItem: ({ children, basis, as: Component = 'div' }: MockFlexItemProps) => (
    <Component data-testid="flex-item" data-basis={basis}>
      {children}
    </Component>
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

describe('Container7030 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
  });

  describe('Basic rendering', () => {
    it('should render container with both placeholders', () => {
      const { container } = render(<Container7030 {...defaultProps} />);

      const section = container.querySelector('section.container--7030');
      expect(section).toBeInTheDocument();
    });

    it('should render left placeholder (70%)', () => {
      render(<Container7030 {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-seventy-left-main-7030')).toBeInTheDocument();
    });

    it('should render right placeholder (30%)', () => {
      render(<Container7030 {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-thirty-right-main-7030')).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const { container } = render(<Container7030 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-7030-style');
    });
  });

  describe('Layout structure', () => {
    it('should render with Flex wrapper with nowrap', () => {
      render(<Container7030 {...defaultProps} />);

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveAttribute('data-wrap', 'nowrap');
    });

    it('should render FlexItems with correct basis', () => {
      render(<Container7030 {...defaultProps} />);

      const flexItems = screen.getAllByTestId('flex-item');
      expect(flexItems.length).toBe(2);
      expect(flexItems[0]).toHaveAttribute('data-basis', '7/10');
      expect(flexItems[1]).toHaveAttribute('data-basis', '3/10');
    });
  });

  describe('Margin handling', () => {
    it('should apply default top margin', () => {
      const { container } = render(<Container7030 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-4');
    });

    it('should exclude top margin when excludeTopMargin is 1', () => {
      const { container } = render(<Container7030 {...propsWithExcludeTopMargin} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-0');
    });
  });

  describe('Empty placeholder handling', () => {
    it('should not render when placeholders are empty and not editing', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container7030 {...propsWithEmptyPlaceholders} />);

      expect(container.firstChild).toBeNull();
    });

    it('should render when placeholders are empty but in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContextEditing as ReturnType<typeof useSitecore>);
      const propsEditing = {
        ...propsWithEmptyPlaceholders,
        page: mockSitecoreContextEditing.page,
      };
      const { container } = render(<Container7030 {...propsEditing} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should render when only left placeholder is populated', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container7030 {...propsWithOnlyLeftPlaceholder} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should render when only right placeholder is populated', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container7030 {...propsWithOnlyRightPlaceholder} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });
});

