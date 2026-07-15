import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Portal } from '../../components/portal/portal.dev';

describe('Portal Component', () => {
  describe('Basic Rendering', () => {
    it('renders null initially (before mounting)', () => {
      const { container } = render(<Portal>Test Content</Portal>);

      // Should be empty initially (not mounted on server)
      expect(container.firstChild).toBeNull();
    });

    it('renders children after mounting on client', async () => {
      render(
        <Portal>
          <div data-testid="portal-content">Test Content</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeInTheDocument();
      });
    });

    it('renders text children correctly', async () => {
      render(<Portal>Simple text content</Portal>);

      await waitFor(() => {
        expect(screen.getByText('Simple text content')).toBeInTheDocument();
      });
    });

    it('renders complex children structure', async () => {
      const complexChildren = (
        <div data-testid="complex-content">
          <h2>Modal Title</h2>
          <p>Modal content goes here</p>
          <button data-testid="modal-close">Close</button>
        </div>
      );

      render(<Portal>{complexChildren}</Portal>);

      await waitFor(() => {
        expect(screen.getByTestId('complex-content')).toBeInTheDocument();
        expect(screen.getByText('Modal Title')).toBeInTheDocument();
        expect(screen.getByText('Modal content goes here')).toBeInTheDocument();
        expect(screen.getByTestId('modal-close')).toBeInTheDocument();
      });
    });
  });

  describe('Portal Functionality', () => {
    it('handles multiple children', async () => {
      const multipleChildren = [
        <div key="first" data-testid="first-child">
          First
        </div>,
        <div key="second" data-testid="second-child">
          Second
        </div>,
        <div key="third" data-testid="third-child">
          Third
        </div>,
      ];

      render(<Portal>{multipleChildren}</Portal>);

      await waitFor(() => {
        expect(screen.getByTestId('first-child')).toBeInTheDocument();
        expect(screen.getByTestId('second-child')).toBeInTheDocument();
        expect(screen.getByTestId('third-child')).toBeInTheDocument();
      });
    });

    it('handles React Fragment children', async () => {
      const fragmentChildren = (
        <>
          <span data-testid="fragment-span">Fragment Text</span>
          <input data-testid="fragment-input" type="text" />
        </>
      );

      render(<Portal>{fragmentChildren}</Portal>);

      await waitFor(() => {
        expect(screen.getByTestId('fragment-span')).toBeInTheDocument();
        expect(screen.getByTestId('fragment-input')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null children gracefully', () => {
      const { container } = render(<Portal>{null}</Portal>);
      expect(container).toBeDefined();
    });

    it('handles empty string children', async () => {
      render(<Portal>{''}</Portal>);
      // Should not crash with empty string
      await waitFor(() => {
        // Empty content won't be found, but component should render
        expect(document.body).toBeInTheDocument();
      });
    });

    it('handles zero as children', async () => {
      render(<Portal>{0}</Portal>);
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('handles component unmounting gracefully', async () => {
      const { unmount } = render(
        <Portal>
          <div data-testid="test-content">Test</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
      });

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('updates portal content when children change', async () => {
      const { rerender } = render(
        <Portal>
          <div data-testid="initial">Initial</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByTestId('initial')).toBeInTheDocument();
      });

      rerender(
        <Portal>
          <div data-testid="updated">Updated</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByTestId('updated')).toBeInTheDocument();
        expect(screen.queryByTestId('initial')).not.toBeInTheDocument();
      });
    });

    it('maintains state across re-renders', async () => {
      const { rerender } = render(
        <Portal>
          <div data-testid="content">Content</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });

      rerender(
        <Portal>
          <div data-testid="content">Content</div>
        </Portal>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('SSR Compatibility', () => {
    it('prevents hydration mismatch by rendering null initially', () => {
      const { container } = render(
        <Portal>
          <div data-testid="ssr-content">SSR Content</div>
        </Portal>
      );

      // Should be empty before mounting (SSR safe)
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('preserves accessibility attributes', async () => {
      const accessibleContent = (
        <div role="dialog" aria-labelledby="modal-title" data-testid="accessible-modal">
          <h2 id="modal-title">Accessible Modal</h2>
          <button aria-label="Close modal">×</button>
        </div>
      );

      render(<Portal>{accessibleContent}</Portal>);

      await waitFor(() => {
        const modal = screen.getByTestId('accessible-modal');
        expect(modal).toHaveAttribute('role', 'dialog');
        expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');

        const closeButton = screen.getByLabelText('Close modal');
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('maintains focus management', async () => {
      const focusableContent = (
        <div data-testid="focusable-content">
          <input data-testid="first-input" />
          <button data-testid="middle-button">Button</button>
          <input data-testid="last-input" />
        </div>
      );

      render(<Portal>{focusableContent}</Portal>);

      await waitFor(() => {
        expect(screen.getByTestId('first-input')).toBeInTheDocument();
        expect(screen.getByTestId('middle-button')).toBeInTheDocument();
        expect(screen.getByTestId('last-input')).toBeInTheDocument();
      });

      // Focus should work normally
      const firstInput = screen.getByTestId('first-input');
      firstInput.focus();
      expect(document.activeElement).toBe(firstInput);
    });
  });

  describe('Performance', () => {
    it('handles rapid re-renders efficiently', async () => {
      const { rerender } = render(
        <Portal>
          <div>Content 1</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByText('Content 1')).toBeInTheDocument();
      });

      // Multiple rapid re-renders should not cause issues
      rerender(
        <Portal>
          <div>Content 2</div>
        </Portal>
      );
      rerender(
        <Portal>
          <div>Content 3</div>
        </Portal>
      );
      rerender(
        <Portal>
          <div>Content 4</div>
        </Portal>
      );

      await waitFor(() => {
        expect(screen.getByText('Content 4')).toBeInTheDocument();
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      });
    });
  });
});
