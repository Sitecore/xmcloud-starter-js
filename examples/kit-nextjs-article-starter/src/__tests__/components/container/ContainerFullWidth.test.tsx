import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ContainerFullWidth } from '@/components/container/container-full-width/ContainerFullWidth';
import {
  defaultProps,
  propsWithExcludeTopMargin,
  propsWithEmptyPlaceholders,
  propsWithoutDynamicId,
  mockSitecoreContext,
  mockSitecoreContextEditing,
} from './ContainerFullWidth.mockProps';

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

describe('ContainerFullWidth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
  });

  describe('Basic rendering', () => {
    it('should render container with placeholder', () => {
      const { container } = render(<ContainerFullWidth {...defaultProps} />);

      const section = container.querySelector('section.container--full-width');
      expect(section).toBeInTheDocument();
    });

    it('should render placeholder', () => {
      render(<ContainerFullWidth {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-fullwidth-main-fullwidth')).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const { container } = render(<ContainerFullWidth {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-fullwidth-style');
    });

    it('should apply @container class', () => {
      const { container } = render(<ContainerFullWidth {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('@container', 'container--full-width', 'group');
    });
  });

  describe('Margin handling', () => {
    it('should apply default top margin when excludeTopMargin is 0', () => {
      const { container } = render(<ContainerFullWidth {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-4');
    });

    it('should exclude top margin when excludeTopMargin is 1', () => {
      const { container } = render(<ContainerFullWidth {...propsWithExcludeTopMargin} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mt-0');
    });
  });

  describe('Layout structure', () => {
    it('should render with Flex wrapper', () => {
      render(<ContainerFullWidth {...defaultProps} />);

      expect(screen.getByTestId('flex')).toBeInTheDocument();
    });

    it('should apply group-[.is-inset]:p-0 class to Flex', () => {
      render(<ContainerFullWidth {...defaultProps} />);

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('group-[.is-inset]:p-0');
    });

    it('should render FlexItem with full basis', () => {
      render(<ContainerFullWidth {...defaultProps} />);

      const flexItem = screen.getByTestId('flex-item');
      expect(flexItem).toHaveAttribute('data-basis', 'full');
    });
  });

  describe('Empty placeholder handling', () => {
    it('should not render when placeholder is empty and not in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<ContainerFullWidth {...propsWithEmptyPlaceholders} />);

      expect(container.firstChild).toBeNull();
    });

    it('should render when placeholder is empty but in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContextEditing as ReturnType<typeof useSitecore>);
      const propsEditing = {
        ...propsWithEmptyPlaceholders,
        page: mockSitecoreContextEditing.page,
      };
      const { container } = render(<ContainerFullWidth {...propsEditing} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render when children are provided', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const propsWithEmptyAndChildren = {
        ...propsWithEmptyPlaceholders,
        children: 'Child content' as unknown as React.ReactElement,
      };

      const { container } = render(<ContainerFullWidth {...propsWithEmptyAndChildren} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Placeholder key generation', () => {
    it('should generate correct placeholder key with DynamicPlaceholderId', () => {
      render(<ContainerFullWidth {...defaultProps} />);

      expect(screen.getByTestId('placeholder-container-fullwidth-main-fullwidth')).toBeInTheDocument();
    });

    it('should generate placeholder key without DynamicPlaceholderId', () => {
      render(<ContainerFullWidth {...propsWithoutDynamicId} />);

      expect(screen.getByTestId('placeholder-container-fullwidth-')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should render section as root element', () => {
      const { container } = render(<ContainerFullWidth {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section?.tagName).toBe('SECTION');
    });

    it('should have correct class hierarchy', () => {
      const { container } = render(<ContainerFullWidth {...defaultProps} />);

      const section = container.querySelector('section');
      const flex = section?.querySelector('[data-testid="flex"]');
      const flexItem = flex?.querySelector('[data-testid="flex-item"]');

      expect(section).toBeInTheDocument();
      expect(flex).toBeInTheDocument();
      expect(flexItem).toBeInTheDocument();
    });
  });
});

