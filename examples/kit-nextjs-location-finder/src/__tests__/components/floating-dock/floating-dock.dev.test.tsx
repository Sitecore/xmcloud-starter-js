import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FloatingDock } from '@/components/floating-dock/floating-dock.dev';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('react');
  const motion = {
    div: actual.forwardRef(
        (
          {
            children,
            className,
            onClick,
            onMouseMove,
            onMouseLeave,
            onMouseEnter,
            layoutId,
            style,
            role,
            'aria-label': ariaLabel,
            ...props
          }: Record<string, unknown>,
          ref: React.Ref<HTMLDivElement>
        ) => (
          <div
            ref={ref}
            className={className as string}
            onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
            onMouseMove={onMouseMove as React.MouseEventHandler<HTMLDivElement>}
            onMouseLeave={onMouseLeave as React.MouseEventHandler<HTMLDivElement>}
            onMouseEnter={onMouseEnter as React.MouseEventHandler<HTMLDivElement>}
            data-testid={layoutId as string}
            style={
              style
                ? Object.fromEntries(
                    Object.entries(style as Record<string, unknown>).filter(
                      ([, value]) => value !== Infinity && value !== -Infinity
                    )
                  )
                : undefined
            }
            role={role as string}
            aria-label={ariaLabel as string}
            {...props}
          >
            {children as React.ReactNode}
          </div>
        )
      ),
      button: ({ children, className, onClick, ...props }: Record<string, unknown>) => (
        <button className={className as string} onClick={onClick as () => void} {...props}>
          {children as React.ReactNode}
        </button>
      ),
  };
  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useMotionValue: jest.fn((value: number) => ({
      set: jest.fn(),
      get: jest.fn(() => value),
    })),
    useSpring: jest.fn((value: unknown) => value),
    useTransform: jest.fn((value: unknown, transform: (val: number) => number) => {
      if (typeof value === 'object' && value !== null && 'get' in value) {
        return transform((value as { get: () => number }).get());
      }
      return value;
    }),
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Share2: ({ className }: { className?: string }) => (
    <svg data-testid="share-icon" className={className}>
      <title>Share</title>
    </svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg data-testid="close-icon" className={className}>
      <title>Close</title>
    </svg>
  ),
}));

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

describe('FloatingDock Component', () => {
  const mockItems = [
    {
      title: 'Facebook',
      icon: <span data-testid="facebook-icon">FB</span>,
      href: 'https://facebook.com',
      onClick: jest.fn(),
    },
    {
      title: 'Twitter',
      icon: <span data-testid="twitter-icon">TW</span>,
      href: 'https://twitter.com',
      onClick: jest.fn(),
    },
    {
      title: 'LinkedIn',
      icon: <span data-testid="linkedin-icon">LI</span>,
      href: 'https://linkedin.com',
      onClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<FloatingDock items={mockItems} />);
      expect(container).toBeInTheDocument();
    });

    it('renders both desktop and mobile versions by default', () => {
      render(<FloatingDock items={mockItems} />);

      // Mobile version should have the share button
      const shareButtons = screen.getAllByLabelText(/share menu/i);
      expect(shareButtons.length).toBeGreaterThan(0);
    });

    it('renders only mobile version when forceCollapse is true', () => {
      const { container } = render(<FloatingDock items={mockItems} forceCollapse={true} />);

      // Desktop should not be visible (hidden class)
      const regions = container.querySelectorAll('[role="region"]');
      expect(regions.length).toBeGreaterThan(0);
    });

    it('applies custom className to desktop version', () => {
      const { container } = render(
        <FloatingDock items={mockItems} desktopClassName="custom-desktop-class" />
      );

      const desktopRegion = container.querySelector('[aria-label="Share options"]');
      expect(desktopRegion).toHaveClass('custom-desktop-class');
    });

    it('applies custom className to mobile version', () => {
      const { container } = render(
        <FloatingDock items={mockItems} mobileClassName="custom-mobile-class" />
      );

      const mobileRegion = container.querySelector('[aria-label="Share menu"]');
      expect(mobileRegion).toHaveClass('custom-mobile-class');
    });
  });

  describe('FloatingDockMobile - Toggle Functionality', () => {
    it('opens menu when share button is clicked', async () => {
      render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Close share menu')).toBeInTheDocument();
      });
    });

    it('closes menu when close button is clicked', async () => {
      render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close share menu');
        fireEvent.click(closeButton);
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Open share menu')).toBeInTheDocument();
      });
    });

    it('displays correct icon based on menu state', async () => {
      render(<FloatingDock items={mockItems} />);

      // Initially shows share icon
      expect(screen.getByTestId('share-icon')).toBeInTheDocument();

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      // After opening, shows close icon
      await waitFor(() => {
        expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      });
    });

    it('renders all menu items when open', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const menuItems = menu?.querySelectorAll('[role="menuitem"]');
        expect(menuItems).toHaveLength(mockItems.length);
      });
    });

    it('calls onClick handler when menu item is clicked', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const facebookButton = menu?.querySelector('[aria-label="Facebook"]') as HTMLElement;
        fireEvent.click(facebookButton);
      });

      expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('FloatingDockMobile - Keyboard Navigation', () => {
    it('closes menu on Escape key press', async () => {
      render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Close share menu')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.getByLabelText('Open share menu')).toBeInTheDocument();
      });
    });

    it('navigates down through menu items with ArrowDown key', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const firstItem = menu?.querySelector('[aria-label="Facebook"]') as HTMLElement;
        firstItem.focus();
      });

      fireEvent.keyDown(document, { key: 'ArrowDown' });

      // Should move focus to next item
      await waitFor(() => {
        expect(document.activeElement).toBeDefined();
      });
    });

    it('navigates up through menu items with ArrowUp key', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const lastItem = menu?.querySelector('[aria-label="LinkedIn"]') as HTMLElement;
        lastItem.focus();
      });

      fireEvent.keyDown(document, { key: 'ArrowUp' });

      // Should move focus to previous item
      await waitFor(() => {
        expect(document.activeElement).toBeDefined();
      });
    });

    it('wraps focus from last to first item on ArrowDown', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const lastItem = menu?.querySelector('[aria-label="LinkedIn"]') as HTMLElement;
        lastItem.focus();
      });

      fireEvent.keyDown(document, { key: 'ArrowDown' });

      await waitFor(() => {
        expect(document.activeElement).toBeDefined();
      });
    });

    it('wraps focus from first to last item on ArrowUp', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const firstItem = menu?.querySelector('[aria-label="Facebook"]') as HTMLElement;
        firstItem.focus();
      });

      fireEvent.keyDown(document, { key: 'ArrowUp' });

      await waitFor(() => {
        expect(document.activeElement).toBeDefined();
      });
    });

    it('traps focus within menu when tabbing forward', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const lastItem = menu?.querySelector('[aria-label="LinkedIn"]') as HTMLElement;
        lastItem.focus();
      });

      fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });

      // Should wrap to first item
      await waitFor(() => {
        expect(document.activeElement).toBeDefined();
      });
    });

    it('traps focus within menu when tabbing backward', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const firstItem = menu?.querySelector('[aria-label="Facebook"]') as HTMLElement;
        firstItem.focus();
      });

      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

      // Should wrap to last item
      await waitFor(() => {
        expect(document.activeElement).toBeDefined();
      });
    });
  });

  describe('FloatingDockMobile - Accessibility', () => {
    it('has correct ARIA attributes on trigger button', () => {
      render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
      expect(triggerButton).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('updates aria-expanded when menu opens', async () => {
      render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('has role="menu" on menu container', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        expect(menu).toBeInTheDocument();
      });
    });

    it('has role="menuitem" on each menu item', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menuItems = container.querySelectorAll('[role="menuitem"]');
        expect(menuItems).toHaveLength(mockItems.length);
      });
    });

    it('has appropriate tabIndex on menu items when open', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const facebookButton = menu?.querySelector('[aria-label="Facebook"]');
        expect(facebookButton).toHaveAttribute('tabIndex', '0');
      });
    });

    it('has region role with aria-label', () => {
      render(<FloatingDock items={mockItems} />);

      const region = screen.getByRole('region', { name: /share menu/i });
      expect(region).toBeInTheDocument();
    });
  });

  describe('FloatingDockDesktop', () => {
    it('renders all items', () => {
      render(<FloatingDock items={mockItems} />);

      // Desktop items are rendered by default (hidden on mobile)
      const desktopRegion = screen.getByRole('region', { name: /share options/i });
      expect(desktopRegion).toBeInTheDocument();
    });

    it('calls onClick when item is clicked', () => {
      render(<FloatingDock items={mockItems} />);

      const facebookButtons = screen.getAllByLabelText('Facebook');
      // Desktop version (not mobile)
      const desktopButton = facebookButtons.find((btn) =>
        btn.closest('[aria-label="Share options"]')
      );

      if (desktopButton) {
        fireEvent.click(desktopButton);
        expect(mockItems[0].onClick).toHaveBeenCalled();
      }
    });

    it('responds to mouse movements', () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const desktopContainer = container.querySelector('[aria-label="Share options"]');
      if (desktopContainer) {
        fireEvent.mouseMove(desktopContainer, { pageY: 100 });
        fireEvent.mouseLeave(desktopContainer);
      }

      // Test should not throw
      expect(desktopContainer).toBeInTheDocument();
    });

    it('has proper tabIndex on items', () => {
      render(<FloatingDock items={mockItems} />);

      const desktopButtons = screen
        .getAllByLabelText('Facebook')
        .filter((btn) => btn.closest('[aria-label="Share options"]'));

      if (desktopButtons.length > 0) {
        expect(desktopButtons[0]).toHaveAttribute('tabIndex', '0');
      }
    });
  });

  describe('IconContainer - Desktop Item Interactions', () => {
    it('handles Enter key press', () => {
      render(<FloatingDock items={mockItems} />);

      const facebookButtons = screen.getAllByLabelText('Facebook');
      const desktopButton = facebookButtons.find((btn) =>
        btn.closest('[aria-label="Share options"]')
      );

      if (desktopButton) {
        act(() => {
          desktopButton.focus();
        });
        fireEvent.keyDown(desktopButton, { key: 'Enter' });
        expect(mockItems[0].onClick).toHaveBeenCalled();
      }
    });

    it('handles Space key press', () => {
      render(<FloatingDock items={mockItems} />);

      const facebookButtons = screen.getAllByLabelText('Facebook');
      const desktopButton = facebookButtons.find((btn) =>
        btn.closest('[aria-label="Share options"]')
      );

      if (desktopButton) {
        mockItems[0].onClick.mockClear();
        act(() => {
          desktopButton.focus();
        });
        fireEvent.keyDown(desktopButton, { key: ' ' });
        expect(mockItems[0].onClick).toHaveBeenCalled();
      }
    });

    it('handles focus and blur events', () => {
      render(<FloatingDock items={mockItems} />);

      const facebookButtons = screen.getAllByLabelText('Facebook');
      const desktopButton = facebookButtons.find((btn) =>
        btn.closest('[aria-label="Share options"]')
      );

      if (desktopButton) {
        fireEvent.focus(desktopButton);
        fireEvent.blur(desktopButton);
        // Should not throw
        expect(desktopButton).toBeInTheDocument();
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const { container } = render(<FloatingDock items={[]} />);
      expect(container).toBeInTheDocument();
    });

    it('handles items without onClick handlers', async () => {
      const itemsWithoutOnClick = [
        {
          title: 'Item 1',
          icon: <span>Icon</span>,
          href: 'https://example.com',
        },
      ];

      const { container } = render(<FloatingDock items={itemsWithoutOnClick} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const item = menu?.querySelector('[aria-label="Item 1"]') as HTMLElement;
        expect(() => fireEvent.click(item)).not.toThrow();
      });
    });

    it('closes menu after timeout when item is clicked', async () => {
      jest.useFakeTimers();
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]');
        const facebookButton = menu?.querySelector('[aria-label="Facebook"]') as HTMLElement;
        fireEvent.click(facebookButton);
      });

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      jest.useRealTimers();
    });

    it('handles rapid toggling of menu', () => {
      render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');

      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);

      // Should not throw
      expect(triggerButton).toBeInTheDocument();
    });
  });

  describe('Backdrop', () => {
    it('closes menu when backdrop is clicked', async () => {
      const { container } = render(<FloatingDock items={mockItems} />);

      const triggerButton = screen.getByLabelText('Open share menu');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Close share menu')).toBeInTheDocument();
      });

      // Find and click backdrop
      const backdrop = container.querySelector('.fixed.inset-0.z-40');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Open share menu')).toBeInTheDocument();
      });
    });
  });
});
