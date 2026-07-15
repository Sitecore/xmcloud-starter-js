import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container5050 } from '@/components/container/container-5050/Container5050';
import {
  defaultProps,
  propsWithExcludeTopMargin,
  propsWithoutStyles,
  propsWithEmptyPlaceholders,
  propsWithOnlyLeftPlaceholder,
  propsWithOnlyRightPlaceholder,
  propsWithoutDynamicId,
  propsWithUndefinedParams,
  mockSitecoreContext,
  mockSitecoreContextEditing,
} from './Container5050.mockProps';

// Type definitions for mock components
interface MockPlaceholderProps {
  name?: string;
}

interface MockFlexProps {
  children?: React.ReactNode;
  wrap?: string;
}

interface MockFlexItemProps {
  children?: React.ReactNode;
  basis?: string;
  as?: React.ElementType;
}

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name }: MockPlaceholderProps) => (
    <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>
  ),
  AppPlaceholder: ({ name }: MockPlaceholderProps) => (
    <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>
  ),
  useSitecore: jest.fn(),
  withDatasourceCheck:
    () =>
    <T extends object>(Component: React.ComponentType<T>) =>
      Component,
}));

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
        if (typeof arg === 'object' && !Array.isArray(arg)) {
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

describe('Container5050 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
  });

  describe('Basic rendering', () => {
    it('should render container with both placeholders', () => {
      const { container } = render(<Container5050 {...defaultProps} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('container--5050', 'mt-4');
    });

    it('should render left placeholder', () => {
      render(<Container5050 {...defaultProps} />);

      const leftPlaceholder = screen.getByTestId(
        'placeholder-container-fifty-left-main-5050'
      );
      expect(leftPlaceholder).toBeInTheDocument();
    });

    it('should render right placeholder', () => {
      render(<Container5050 {...defaultProps} />);

      const rightPlaceholder = screen.getByTestId(
        'placeholder-container-fifty-right-main-5050'
      );
      expect(rightPlaceholder).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const { container } = render(<Container5050 {...defaultProps} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toHaveClass('custom-5050-style');
    });
  });

  describe('Layout structure', () => {
    it('should render with Flex wrapper', () => {
      render(<Container5050 {...defaultProps} />);

      const flex = screen.getByTestId('flex');
      expect(flex).toBeInTheDocument();
      expect(flex).toHaveAttribute('data-wrap', 'nowrap');
    });

    it('should render two FlexItems with 1/2 basis', () => {
      render(<Container5050 {...defaultProps} />);

      const flexItems = screen.getAllByTestId('flex-item');
      expect(flexItems.length).toBe(2);
      expect(flexItems[0]).toHaveAttribute('data-basis', '1/2');
      expect(flexItems[1]).toHaveAttribute('data-basis', '1/2');
    });

    it('should render FlexItems as div elements', () => {
      render(<Container5050 {...defaultProps} />);

      const flexItems = screen.getAllByTestId('flex-item');
      flexItems.forEach((item) => {
        expect(item.tagName).toBe('DIV');
      });
    });
  });

  describe('Margin handling', () => {
    it('should apply default top margin when excludeTopMargin is 0', () => {
      const { container } = render(<Container5050 {...defaultProps} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toHaveClass('mt-4');
      expect(section).not.toHaveClass('mt-0');
    });

    it('should exclude top margin when excludeTopMargin is 1', () => {
      const { container } = render(<Container5050 {...propsWithExcludeTopMargin} />);

      const section = container.querySelector('section.container--5050');
      // Component includes both mt-4 (base) and mt-0 (conditional), relying on CSS specificity
      expect(section).toHaveClass('mt-0');
      expect(section).toHaveClass('mt-4');
    });

    it('should apply default margin when excludeTopMargin is not provided', () => {
      const propsWithoutMarginParam = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          excludeTopMargin: undefined,
        },
      } as unknown as typeof defaultProps;

      const { container } = render(<Container5050 {...propsWithoutMarginParam} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toHaveClass('mt-4');
    });
  });

  describe('Styles handling', () => {
    it('should apply custom styles parameter', () => {
      const { container } = render(<Container5050 {...defaultProps} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toHaveClass('custom-5050-style');
    });

    it('should handle empty styles parameter', () => {
      const { container } = render(<Container5050 {...propsWithoutStyles} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toHaveClass('container--5050', 'mt-4');
      expect(section?.className).not.toContain('undefined');
    });

    it('should handle undefined styles parameter', () => {
      const propsWithUndefinedStyles = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          styles: undefined,
        },
      } as unknown as typeof defaultProps;

      const { container } = render(<Container5050 {...propsWithUndefinedStyles} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Empty placeholder handling', () => {
    it('should not render when placeholders are empty and not in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container5050 {...propsWithEmptyPlaceholders} />);

      const section = container.querySelector('section.container--5050');
      expect(section).not.toBeInTheDocument();
    });

    it('should render when placeholders are empty but in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContextEditing as ReturnType<typeof useSitecore>);
      const propsEditing = {
        ...propsWithEmptyPlaceholders,
        page: mockSitecoreContextEditing.page,
      };
      const { container } = render(<Container5050 {...propsEditing} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });

    it('should render when left placeholder is populated', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container5050 {...propsWithOnlyLeftPlaceholder} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });

    it('should render when right placeholder is populated', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container5050 {...propsWithOnlyRightPlaceholder} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Children handling', () => {
    it('should render when left child is provided', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const propsWithEmptyPlaceholdersAndLeftChild = {
        ...propsWithEmptyPlaceholders,
        left: <div>Left child</div> as React.ReactElement,
      };

      const { container } = render(
        <Container5050 {...propsWithEmptyPlaceholdersAndLeftChild} />
      );

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });

    it('should render when right child is provided', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const propsWithEmptyPlaceholdersAndRightChild = {
        ...propsWithEmptyPlaceholders,
        right: <div>Right child</div> as React.ReactElement,
      };

      const { container } = render(
        <Container5050 {...propsWithEmptyPlaceholdersAndRightChild} />
      );

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });

    it('should render when both children are provided', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const propsWithEmptyPlaceholdersAndBothChildren = {
        ...propsWithEmptyPlaceholders,
        left: <div>Left child</div> as React.ReactElement,
        right: <div>Right child</div> as React.ReactElement,
      };

      const { container } = render(
        <Container5050 {...propsWithEmptyPlaceholdersAndBothChildren} />
      );

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Placeholder key generation', () => {
    it('should generate correct placeholder keys with DynamicPlaceholderId', () => {
      render(<Container5050 {...defaultProps} />);

      expect(
        screen.getByTestId('placeholder-container-fifty-left-main-5050')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('placeholder-container-fifty-right-main-5050')
      ).toBeInTheDocument();
    });

    it('should generate placeholder keys without DynamicPlaceholderId', () => {
      render(<Container5050 {...propsWithoutDynamicId} />);

      expect(screen.getByTestId('placeholder-container-fifty-left-')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-container-fifty-right-')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined params gracefully', () => {
      const propsWithMissingParams = {
        ...propsWithUndefinedParams,
        rendering: {
          ...propsWithUndefinedParams.rendering,
          placeholders: {
            'container-fifty-left-undefined': [
              {
                componentName: 'LeftContent',
              },
            ],
          },
        },
      };

      const { container } = render(<Container5050 {...propsWithMissingParams} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();
    });

    it('should handle undefined rendering', () => {
      const propsWithUndefinedRendering = {
        ...defaultProps,
        rendering: undefined as unknown as typeof defaultProps.rendering,
      };

      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container5050 {...propsWithUndefinedRendering} />);

      // Should not render when rendering is undefined and not in editing mode
      const section = container.querySelector('section.container--5050');
      expect(section).not.toBeInTheDocument();
    });

    it('should render null when empty and not in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockSitecoreContext as ReturnType<typeof useSitecore>);
      const { container } = render(<Container5050 {...propsWithEmptyPlaceholders} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component structure', () => {
    it('should render section as root element', () => {
      const { container } = render(<Container5050 {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe('SECTION');
    });

    it('should have correct class hierarchy', () => {
      const { container } = render(<Container5050 {...defaultProps} />);

      const section = container.querySelector('section.container--5050');
      expect(section).toBeInTheDocument();

      const flex = section?.querySelector('[data-testid="flex"]');
      expect(flex).toBeInTheDocument();

      const flexItems = section?.querySelectorAll('[data-testid="flex-item"]');
      expect(flexItems?.length).toBe(2);
    });

    it('should render placeholders inside FlexItems', () => {
      render(<Container5050 {...defaultProps} />);

      const flexItems = screen.getAllByTestId('flex-item');
      
      const leftPlaceholder = flexItems[0].querySelector(
        '[data-testid="placeholder-container-fifty-left-main-5050"]'
      );
      expect(leftPlaceholder).toBeInTheDocument();

      const rightPlaceholder = flexItems[1].querySelector(
        '[data-testid="placeholder-container-fifty-right-main-5050"]'
      );
      expect(rightPlaceholder).toBeInTheDocument();
    });
  });
});

