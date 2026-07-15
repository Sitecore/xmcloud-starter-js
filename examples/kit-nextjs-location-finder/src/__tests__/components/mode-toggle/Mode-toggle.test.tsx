import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModeToggle } from '../../../components/mode-toggle/mode-toggle.dev';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Component-specific overrides for lucide-react icons (with enhanced props for testing)
// Note: The global mock provides basic Sun/Moon icons, but we override them here for specific testing needs
jest.mock('lucide-react', () => {
  const createMockIcon = (name: string) => {
    const MockIcon = ({
      className,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      ...props
    }: {
      className?: string;
      size?: number;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }) =>
      React.createElement(
        'span',
        {
          'data-testid': `${name.toLowerCase()}-icon`,
          className,
          'data-size': size?.toString(),
          'data-stroke-width': strokeWidth?.toString(),
          'data-absolute-stroke-width': absoluteStrokeWidth?.toString(),
          ...props,
        },
        name
      );
    MockIcon.displayName = `Mock${name}`;
    return MockIcon;
  };

  return {
    Sun: createMockIcon('Sun'),
    Moon: createMockIcon('Moon'),
    // Include other common icons from global setup
    X: createMockIcon('X'),
    Facebook: createMockIcon('Facebook'),
    Linkedin: createMockIcon('Linkedin'),
    Twitter: createMockIcon('Twitter'),
    Link: createMockIcon('Link'),
    Check: createMockIcon('Check'),
    Mail: createMockIcon('Mail'),
  };
});

// Mock UI components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children, align }: React.PropsWithChildren<{ align?: string }>) => (
    <div data-testid="dropdown-menu-content" data-align={align}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button data-testid="dropdown-menu-item" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenuTrigger: ({ children, asChild }: React.PropsWithChildren<{ asChild?: boolean }>) => (
    <div data-testid="dropdown-menu-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
}));

// Override global button mock for this component's specific needs
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,
    size,
    ...props
  }: React.PropsWithChildren<{
    variant?: string;
    size?: string;
  }> &
    React.ComponentProps<'button'>) => (
    <button data-testid="theme-toggle-button" data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  ),
}));

describe('ModeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
    });
  });

  describe('Rendering', () => {
    it('renders the component with all required elements', () => {
      render(<ModeToggle />);

      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-menu-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const customClassName = 'custom-toggle-class';
      render(<ModeToggle className={customClassName} />);

      const wrapper = screen.getByTestId('dropdown-menu').parentElement;
      expect(wrapper).toHaveClass(customClassName);
    });

    it('renders with correct button variant and size', () => {
      render(<ModeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
      expect(button).toHaveAttribute('data-size', 'icon');
    });

    it('renders accessibility text for screen readers', () => {
      render(<ModeToggle />);

      expect(screen.getByText('Toggle theme')).toBeInTheDocument();
      expect(screen.getByText('Toggle theme')).toHaveClass('sr-only');
    });
  });

  describe('Theme Menu Options', () => {
    it('renders all theme options in the dropdown menu', () => {
      render(<ModeToggle />);

      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('sets dropdown menu content alignment to "end"', () => {
      render(<ModeToggle />);

      const menuContent = screen.getByTestId('dropdown-menu-content');
      expect(menuContent).toHaveAttribute('data-align', 'end');
    });
  });

  describe('Theme Switching Functionality', () => {
    it('calls setTheme with "light" when Light option is clicked', () => {
      render(<ModeToggle />);

      const lightOption = screen.getByText('Light').closest('[data-testid="dropdown-menu-item"]');
      fireEvent.click(lightOption!);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('calls setTheme with "dark" when Dark option is clicked', () => {
      render(<ModeToggle />);

      const darkOption = screen.getByText('Dark').closest('[data-testid="dropdown-menu-item"]');
      fireEvent.click(darkOption!);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('calls setTheme with "system" when System option is clicked', () => {
      render(<ModeToggle />);

      const systemOption = screen.getByText('System').closest('[data-testid="dropdown-menu-item"]');
      fireEvent.click(systemOption!);

      expect(mockSetTheme).toHaveBeenCalledWith('system');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icons', () => {
    it('renders Sun icon with correct styling classes', () => {
      render(<ModeToggle />);

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toHaveClass(
        'h-[1.2rem]',
        'w-[1.2rem]',
        'rotate-0',
        'scale-100',
        'transition-all',
        'dark:-rotate-90',
        'dark:scale-0'
      );
    });

    it('renders Moon icon with correct styling classes', () => {
      render(<ModeToggle />);

      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toHaveClass(
        'absolute',
        'h-[1.2rem]',
        'w-[1.2rem]',
        'rotate-90',
        'scale-0',
        'transition-all',
        'dark:rotate-0',
        'dark:scale-100'
      );
    });

    it('renders icons with correct size and stroke properties', () => {
      render(<ModeToggle />);

      const sunIcon = screen.getByTestId('sun-icon');
      const moonIcon = screen.getByTestId('moon-icon');

      expect(sunIcon).toHaveAttribute('data-size', '18');
      expect(sunIcon).toHaveAttribute('data-stroke-width', '2');
      expect(sunIcon).toHaveAttribute('data-absolute-stroke-width', 'true');

      expect(moonIcon).toHaveAttribute('data-size', '18');
      expect(moonIcon).toHaveAttribute('data-stroke-width', '2');
      expect(moonIcon).toHaveAttribute('data-absolute-stroke-width', 'true');
    });
  });

  describe('useTheme Hook Integration', () => {
    it('properly integrates with useTheme hook', () => {
      render(<ModeToggle />);

      expect(useTheme).toHaveBeenCalled();
    });

    it('handles missing setTheme function gracefully', () => {
      (useTheme as jest.Mock).mockReturnValue({});

      expect(() => render(<ModeToggle />)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('renders without className prop', () => {
      render(<ModeToggle />);

      const wrapper = screen.getByTestId('dropdown-menu').parentElement;
      expect(wrapper).toBeInTheDocument();
    });

    it('handles multiple rapid theme switches', () => {
      render(<ModeToggle />);

      const lightOption = screen.getByText('Light').closest('[data-testid="dropdown-menu-item"]');
      const darkOption = screen.getByText('Dark').closest('[data-testid="dropdown-menu-item"]');
      const systemOption = screen.getByText('System').closest('[data-testid="dropdown-menu-item"]');

      fireEvent.click(lightOption!);
      fireEvent.click(darkOption!);
      fireEvent.click(systemOption!);

      expect(mockSetTheme).toHaveBeenCalledTimes(3);
      expect(mockSetTheme).toHaveBeenNthCalledWith(1, 'light');
      expect(mockSetTheme).toHaveBeenNthCalledWith(2, 'dark');
      expect(mockSetTheme).toHaveBeenNthCalledWith(3, 'system');
    });
  });
});
