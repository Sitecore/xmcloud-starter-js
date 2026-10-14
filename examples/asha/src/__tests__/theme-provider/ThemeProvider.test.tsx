/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../components/theme-provider/theme-provider.dev';
import {
  defaultThemeProviderProps,
  themeProviderPropsLightDefault,
  themeProviderPropsDarkDefault,
  themeProviderPropsCustomAttribute,
  themeProviderPropsMultipleThemes,
  themeProviderPropsWithTransitions,
  themeProviderPropsNoChildren,
  themeProviderPropsUndefinedChildren,
  themeProviderPropsSingleChild,
  themeProviderPropsNestedChildren,
  themeProviderPropsCustomStorage,
  themeProviderPropsForced,
  themeProviderPropsMinimal,
  themeProviderPropsComplexChildren,
  themeProviderPropsReactFragment,
  themeProviderPropsWithFunctions,
} from './ThemeProvider.mockProps';

// Mock next-themes
const mockNextThemesProvider = jest.fn();
jest.mock('next-themes', () => ({
  ThemeProvider: (props: any) => mockNextThemesProvider(props),
}));

describe('ThemeProvider Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation that renders children
    mockNextThemesProvider.mockImplementation(({ children, ...props }) =>
      React.createElement(
        'div',
        {
          'data-testid': 'next-themes-provider',
          'data-props': JSON.stringify(props),
        },
        children
      )
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders ThemeProvider with default configuration', () => {
      render(<ThemeProvider {...defaultThemeProviderProps} />);

      expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
      expect(screen.getByTestId('child-component-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-component-2')).toBeInTheDocument();
      expect(mockNextThemesProvider).toHaveBeenCalledTimes(1);
    });

    it('passes all props correctly to NextThemesProvider', () => {
      render(<ThemeProvider {...defaultThemeProviderProps} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          attribute: 'class',
          defaultTheme: 'system',
          enableSystem: true,
          disableTransitionOnChange: true,
          children: expect.any(Array),
        })
      );
    });

    it('renders children correctly', () => {
      render(<ThemeProvider {...defaultThemeProviderProps} />);

      expect(screen.getByText('Child Component 1')).toBeInTheDocument();
      expect(screen.getByText('Child Component 2')).toBeInTheDocument();
    });

    it('acts as a pure wrapper around NextThemesProvider', () => {
      const { container } = render(<ThemeProvider {...defaultThemeProviderProps} />);

      // Should only render the NextThemesProvider, no additional wrapper elements
      const provider = screen.getByTestId('next-themes-provider');
      expect(provider).toBeInTheDocument();

      // Verify no extra wrapper div from our component
      expect(container.firstChild).toBe(provider);
    });
  });

  describe('Theme Configuration', () => {
    it('handles light theme default', () => {
      render(<ThemeProvider {...themeProviderPropsLightDefault} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultTheme: 'light',
          enableSystem: false,
        })
      );

      expect(screen.getByTestId('light-child')).toBeInTheDocument();
    });

    it('handles dark theme default', () => {
      render(<ThemeProvider {...themeProviderPropsDarkDefault} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultTheme: 'dark',
          enableSystem: false,
        })
      );

      expect(screen.getByTestId('dark-child')).toBeInTheDocument();
    });

    it('handles custom attribute configuration', () => {
      render(<ThemeProvider {...themeProviderPropsCustomAttribute} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          attribute: 'data-theme',
          storageKey: 'custom-theme-key',
        })
      );

      expect(screen.getByTestId('custom-attr-child')).toBeInTheDocument();
    });

    it('handles multiple themes configuration', () => {
      render(<ThemeProvider {...themeProviderPropsMultipleThemes} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          themes: ['light', 'dark', 'blue', 'green', 'purple'],
          defaultTheme: 'blue',
        })
      );
    });

    it('handles transition and color scheme settings', () => {
      render(<ThemeProvider {...themeProviderPropsWithTransitions} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          disableTransitionOnChange: false,
          enableColorScheme: true,
        })
      );
    });
  });

  describe('Children Handling', () => {
    it('handles single child component', () => {
      render(<ThemeProvider {...themeProviderPropsSingleChild} />);

      expect(screen.getByTestId('single-child')).toBeInTheDocument();
      expect(screen.getByText('Single Child Component')).toBeInTheDocument();
    });

    it('handles nested children structure', () => {
      render(<ThemeProvider {...themeProviderPropsNestedChildren} />);

      expect(screen.getByTestId('nested-container')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child-2')).toBeInTheDocument();
      expect(screen.getByTestId('deeply-nested')).toBeInTheDocument();
      expect(screen.getByTestId('deeply-nested-child')).toBeInTheDocument();
    });

    it('handles complex children structure', () => {
      render(<ThemeProvider {...themeProviderPropsComplexChildren} />);

      expect(screen.getByTestId('header-component')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-widgets')).toBeInTheDocument();
      expect(screen.getByTestId('footer-component')).toBeInTheDocument();
    });

    it('handles React Fragment children', () => {
      render(<ThemeProvider {...themeProviderPropsReactFragment} />);

      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('handles no children gracefully', () => {
      render(<ThemeProvider {...themeProviderPropsNoChildren} />);

      expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          children: [],
        })
      );
    });

    it('handles undefined children gracefully', () => {
      expect(() => {
        render(<ThemeProvider {...themeProviderPropsUndefinedChildren} />);
      }).not.toThrow();

      expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
    });
  });

  describe('Advanced Configuration', () => {
    it('handles custom storage configuration', () => {
      render(<ThemeProvider {...themeProviderPropsCustomStorage} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          storageKey: 'sync-audio-theme',
          value: 'dark',
        })
      );
    });

    it('handles forced theme configuration', () => {
      render(<ThemeProvider {...themeProviderPropsForced} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          forcedTheme: 'dark',
        })
      );
    });

    it('handles minimal props configuration', () => {
      render(<ThemeProvider {...themeProviderPropsMinimal} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.anything(),
        })
      );

      expect(screen.getByTestId('minimal-child')).toBeInTheDocument();
    });

    it('handles function props and nonce', () => {
      render(<ThemeProvider {...themeProviderPropsWithFunctions} />);

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          onSystemThemeChange: expect.any(Function),
          nonce: 'test-nonce-123',
        })
      );
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all props except children to NextThemesProvider', () => {
      const customProps = {
        attribute: 'data-custom-theme',
        defaultTheme: 'custom',
        enableSystem: false,
        disableTransitionOnChange: false,
        storageKey: 'custom-key',
        themes: ['light', 'dark', 'custom'],
        value: 'custom',
        forcedTheme: undefined,
        enableColorScheme: true,
        nonce: 'custom-nonce',
        children: [
          <div data-testid="test-child" key="test">
            Test
          </div>,
        ],
      };

      render(
        <ThemeProvider {...customProps}>
          <div data-testid="test-child">Test Child</div>
        </ThemeProvider>
      );

      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          attribute: 'data-custom-theme',
          defaultTheme: 'custom',
          enableSystem: false,
          disableTransitionOnChange: false,
          storageKey: 'custom-key',
          themes: ['light', 'dark', 'custom'],
          value: 'custom',
          enableColorScheme: true,
          nonce: 'custom-nonce',
          children: expect.anything(),
        })
      );
    });

    it('preserves prop types and values', () => {
      const booleanProps = {
        enableSystem: true,
        disableTransitionOnChange: false,
        enableColorScheme: true,
        children: <div data-testid="boolean-test">Boolean Test</div>,
      };

      render(<ThemeProvider {...booleanProps} />);

      const call = mockNextThemesProvider.mock.calls[0][0];
      expect(call.enableSystem).toBe(true);
      expect(call.disableTransitionOnChange).toBe(false);
      expect(call.enableColorScheme).toBe(true);
    });
  });

  describe('Component Behavior', () => {
    it('re-renders correctly when props change', () => {
      const { rerender } = render(<ThemeProvider {...themeProviderPropsLightDefault} />);

      expect(screen.getByTestId('light-child')).toBeInTheDocument();

      rerender(<ThemeProvider {...themeProviderPropsDarkDefault} />);

      expect(screen.getByTestId('dark-child')).toBeInTheDocument();
      expect(screen.queryByTestId('light-child')).not.toBeInTheDocument();
    });

    it('handles dynamic children updates', () => {
      const initialProps = {
        ...defaultThemeProviderProps,
        children: <div data-testid="initial-child">Initial Child</div>,
      };

      const { rerender } = render(<ThemeProvider {...initialProps} />);

      expect(screen.getByTestId('initial-child')).toBeInTheDocument();

      const updatedProps = {
        ...defaultThemeProviderProps,
        children: <div data-testid="updated-child">Updated Child</div>,
      };

      rerender(<ThemeProvider {...updatedProps} />);

      expect(screen.getByTestId('updated-child')).toBeInTheDocument();
      expect(screen.queryByTestId('initial-child')).not.toBeInTheDocument();
    });

    it('maintains provider functionality across re-renders', () => {
      const { rerender } = render(<ThemeProvider {...defaultThemeProviderProps} />);

      expect(mockNextThemesProvider).toHaveBeenCalledTimes(1);

      rerender(<ThemeProvider {...defaultThemeProviderProps} />);

      expect(mockNextThemesProvider).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles NextThemesProvider errors gracefully', () => {
      mockNextThemesProvider.mockImplementation(() => {
        throw new Error('NextThemesProvider error');
      });

      expect(() => {
        render(<ThemeProvider {...defaultThemeProviderProps} />);
      }).toThrow('NextThemesProvider error');
    });

    it('handles malformed children gracefully', () => {
      const propsWithMalformedChildren = {
        ...defaultThemeProviderProps,
        children: null,
      };

      expect(() => {
        render(<ThemeProvider {...propsWithMalformedChildren} />);
      }).not.toThrow();
    });

    it('handles missing props gracefully', () => {
      expect(() => {
        render(
          <ThemeProvider>
            <div data-testid="no-props-child">No Props Child</div>
          </ThemeProvider>
        );
      }).not.toThrow();

      expect(screen.getByTestId('no-props-child')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not introduce performance overhead', () => {
      const startTime = performance.now();

      render(<ThemeProvider {...defaultThemeProviderProps} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 100ms for a simple wrapper)
      expect(renderTime).toBeLessThan(100);
    });

    it('handles rapid re-renders efficiently', () => {
      const { rerender } = render(<ThemeProvider {...defaultThemeProviderProps} />);

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(<ThemeProvider {...defaultThemeProviderProps} />);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 10 re-renders should complete quickly
      expect(totalTime).toBeLessThan(100);
    });

    it('maintains consistent render performance', () => {
      const renderTimes: number[] = [];

      for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        const { unmount } = render(<ThemeProvider {...defaultThemeProviderProps} />);
        const endTime = performance.now();

        renderTimes.push(endTime - startTime);
        unmount();
      }

      // All render times should be reasonably consistent (within 50ms of each other)
      const maxTime = Math.max(...renderTimes);
      const minTime = Math.min(...renderTimes);
      expect(maxTime - minTime).toBeLessThan(50);
    });
  });

  describe('Integration', () => {
    it('integrates seamlessly with next-themes', () => {
      render(<ThemeProvider {...defaultThemeProviderProps} />);

      expect(mockNextThemesProvider).toHaveBeenCalledTimes(1);
      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          attribute: 'class',
          defaultTheme: 'system',
          enableSystem: true,
          disableTransitionOnChange: true,
        })
      );
    });

    it('preserves NextThemesProvider component props interface', () => {
      const allNextThemesProps = {
        attribute: 'class',
        defaultTheme: 'system',
        enableSystem: true,
        disableTransitionOnChange: true,
        enableColorScheme: false,
        storageKey: 'theme',
        themes: ['light', 'dark'],
        value: undefined,
        forcedTheme: undefined,
        nonce: undefined,
        children: <div>Test</div>,
      };

      render(<ThemeProvider {...allNextThemesProps} />);

      // Should accept all standard NextThemesProvider props
      expect(mockNextThemesProvider).toHaveBeenCalledWith(
        expect.objectContaining(allNextThemesProps)
      );
    });

    it('works with React component composition', () => {
      const ComposedComponent = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="composed-wrapper">
          <ThemeProvider {...defaultThemeProviderProps}>{children}</ThemeProvider>
        </div>
      );

      render(
        <ComposedComponent>
          <div data-testid="composed-child">Composed Child</div>
        </ComposedComponent>
      );

      expect(screen.getByTestId('composed-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
      expect(screen.getByTestId('composed-child')).toBeInTheDocument();
    });
  });

  describe('TypeScript Integration', () => {
    it('accepts valid NextThemesProvider props', () => {
      // This test verifies the component accepts the correct prop types
      const validProps = {
        attribute: 'class' as const,
        defaultTheme: 'system',
        enableSystem: true,
        children: <div>Valid Props</div>,
      };

      expect(() => {
        render(<ThemeProvider {...validProps} />);
      }).not.toThrow();
    });

    it('passes children prop correctly', () => {
      const TestChild = () => <div data-testid="typescript-child">TypeScript Child</div>;

      render(
        <ThemeProvider attribute="class">
          <TestChild />
        </ThemeProvider>
      );

      expect(screen.getByTestId('typescript-child')).toBeInTheDocument();
    });
  });
});
