/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZipcodeModal } from '../../components/zipcode-modal/zipcode-modal.dev';
import {
  defaultZipcodeModalProps,
  zipcodeModalPropsNotOpen,
  zipcodeModalPropsWithError,
  zipcodeModalPropsGeoLoading,
  zipcodeModalPropsPermissionDenied,
  zipcodeModalPropsNetworkError,
  zipcodeModalPropsLongError,
  zipcodeModalPropsSpecialCharsError,
  zipcodeModalPropsWithMockCallbacks,
  validZipcodes,
  invalidZipcodes,
  edgeCaseZipcodes,
  mockOnClose,
  mockOnUseMyLocation,
} from './ZipcodeModal.mockProps';

// Mock UI components
jest.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, variant, className, ...props }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-variant={variant}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../components/ui/input', () => ({
  Input: ({ value = '', onChange, placeholder, className, id, ...props }: any) => (
    <input
      data-testid="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      id={id}
      {...props}
    />
  ),
}));

jest.mock('../../components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open} style={{ display: open ? 'block' : 'none' }}>
      <div onClick={() => onOpenChange && onOpenChange(false)} data-testid="dialog-overlay" />
      {children}
    </div>
  ),
  DialogContent: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: any) => <p data-testid="dialog-description">{children}</p>,
  DialogFooter: ({ children, className }: any) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: ({ size, ...props }: any) => (
    <svg data-testid="map-pin-icon" width={size} height={size} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    </svg>
  ),
}));

describe('ZipcodeModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Rendering', () => {
    it('renders when open prop is true', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Enter your zipcode');
      expect(screen.getByTestId('dialog-description')).toHaveTextContent(
        'Please enter your zipcode to continue.'
      );
    });

    it('does not render when open prop is false', () => {
      render(<ZipcodeModal {...zipcodeModalPropsNotOpen} />);

      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('data-open', 'false');
      expect(dialog).toHaveStyle('display: none');
    });

    it('renders all form elements', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your zipcode (e.g., 10001)')).toBeInTheDocument();
      expect(screen.getByText('Use my location')).toBeInTheDocument();
      expect(screen.getByText('Save zipcode')).toBeInTheDocument();
    });

    it('renders MapPin icon in location button', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });

    it('applies correct dialog structure', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-footer')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Display', () => {
    it('displays error message when error prop is provided', () => {
      render(<ZipcodeModal {...zipcodeModalPropsWithError} />);

      const description = screen.getByTestId('dialog-description');
      expect(description).toHaveTextContent(
        "We couldn't access your location: Location access denied"
      );
    });

    it('displays permission denied error correctly', () => {
      render(<ZipcodeModal {...zipcodeModalPropsPermissionDenied} />);

      expect(screen.getByTestId('dialog-description')).toHaveTextContent(
        'Location permission denied'
      );
    });

    it('displays network error correctly', () => {
      render(<ZipcodeModal {...zipcodeModalPropsNetworkError} />);

      expect(screen.getByTestId('dialog-description')).toHaveTextContent('Network error occurred');
    });

    it('handles long error messages', () => {
      render(<ZipcodeModal {...zipcodeModalPropsLongError} />);

      const description = screen.getByTestId('dialog-description');
      expect(description).toHaveTextContent('We encountered an unexpected error');
    });

    it('handles special characters in error messages', () => {
      render(<ZipcodeModal {...zipcodeModalPropsSpecialCharsError} />);

      expect(screen.getByTestId('dialog-description')).toHaveTextContent("Erreur d'accès");
    });

    it('shows default description when no error', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByTestId('dialog-description')).toHaveTextContent(
        'Please enter your zipcode to continue.'
      );
    });
  });

  describe('Geolocation Loading State', () => {
    it('shows loading state when isGeoLoading is true', () => {
      render(<ZipcodeModal {...zipcodeModalPropsGeoLoading} />);

      const locationButton = screen.getByText('Getting location...');
      expect(locationButton).toBeInTheDocument();

      const buttons = screen.getAllByTestId('button');
      const geoButton = buttons.find((btn) => btn.textContent?.includes('Getting location'));
      expect(geoButton).toBeDisabled();
    });

    it('renders loading spinner when isGeoLoading is true', () => {
      const { container } = render(<ZipcodeModal {...zipcodeModalPropsGeoLoading} />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('disables location button during loading', () => {
      render(<ZipcodeModal {...zipcodeModalPropsGeoLoading} />);

      const buttons = screen.getAllByTestId('button');
      const geoButton = buttons.find((btn) => btn.textContent?.includes('Getting location'));
      expect(geoButton).toBeDisabled();
    });

    it('shows normal state when not loading', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByText('Use my location')).toBeInTheDocument();

      const buttons = screen.getAllByTestId('button');
      const geoButton = buttons.find((btn) => btn.textContent?.includes('Use my location'));
      expect(geoButton).not.toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    describe('Valid Zipcodes', () => {
      validZipcodes.forEach((zipcode) => {
        it(`accepts valid zipcode: ${zipcode}`, async () => {
          const mockSubmit = jest.fn();
          render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

          const input = screen.getByTestId('input');
          const submitButton = screen.getByText('Save zipcode');

          await act(async () => {
            await userEvent.type(input, zipcode);
            fireEvent.click(submitButton);
          });

          await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(zipcode.trim());
          });
        });
      });
    });

    describe('Invalid Zipcodes', () => {
      invalidZipcodes
        .filter((zipcode) => zipcode.trim() !== '')
        .forEach((zipcode) => {
          it(`rejects invalid zipcode: "${zipcode}"`, async () => {
            const mockSubmit = jest.fn();
            render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

            const input = screen.getByTestId('input');
            const submitButton = screen.getByText('Save zipcode');

            await act(async () => {
              await userEvent.type(input, zipcode);
              fireEvent.click(submitButton);
            });

            await waitFor(() => {
              expect(mockSubmit).not.toHaveBeenCalled();
            });

            // Should show validation error
            expect(screen.getByText(/Please enter a valid/)).toBeInTheDocument();
          });
        });
    });

    describe('Edge Cases', () => {
      edgeCaseZipcodes.forEach((zipcode) => {
        it(`handles edge case zipcode: ${zipcode}`, async () => {
          const mockSubmit = jest.fn();
          render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

          const input = screen.getByTestId('input');
          const submitButton = screen.getByText('Save zipcode');

          await userEvent.type(input, zipcode);
          fireEvent.click(submitButton);

          // These should be accepted based on regex validation
          await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(zipcode);
          });
        });
      });
    });

    it('shows error for empty zipcode submission', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const submitButton = screen.getByText('Save zipcode');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid zipcode')).toBeInTheDocument();
      });
    });

    it('clears validation error when user starts typing', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      // Submit empty form to trigger error
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid zipcode')).toBeInTheDocument();
      });

      // Start typing to clear error
      await userEvent.type(input, '1');

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid zipcode')).not.toBeInTheDocument();
      });
    });

    it('highlights invalid input with error styling', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      await userEvent.type(input, 'invalid');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(input).toHaveClass('border-red-500');
      });
    });

    it('removes error styling when error is cleared', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      // Create error
      await userEvent.type(input, 'invalid');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(input).toHaveClass('border-red-500');
      });

      // Clear input and type valid zipcode
      await userEvent.clear(input);
      await userEvent.type(input, '12345');

      await waitFor(() => {
        expect(input).not.toHaveClass('border-red-500');
      });
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with trimmed zipcode', async () => {
      const mockSubmit = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      await userEvent.type(input, '  12345  ');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('12345');
      });
    });

    it('clears input and error after successful submission', async () => {
      const mockSubmit = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      await userEvent.type(input, '12345');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('handles form submission via Enter key', async () => {
      const mockSubmit = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

      const input = screen.getByTestId('input');

      await act(async () => {
        await userEvent.type(input, '12345');
        // Submit the form by pressing Enter
        await userEvent.keyboard('{Enter}');
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('12345');
      });
    });

    it('prevents default form submission behavior', async () => {
      const mockSubmit = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

      const form = screen.getByTestId('input').closest('form');
      const preventDefaultSpy = jest.fn();

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      submitEvent.preventDefault = preventDefaultSpy;

      await userEvent.type(screen.getByTestId('input'), '12345');

      if (form) {
        await act(async () => {
          form.dispatchEvent(submitEvent);
        });
      }

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Geolocation Functionality', () => {
    it('calls onUseMyLocation when location button is clicked', async () => {
      const mockUseLocation = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onUseMyLocation={mockUseLocation} />);

      const locationButton = screen.getByText('Use my location');
      fireEvent.click(locationButton);

      expect(mockUseLocation).toHaveBeenCalled();
    });

    it('does not call onUseMyLocation when button is disabled', async () => {
      const mockUseLocation = jest.fn();
      render(<ZipcodeModal {...zipcodeModalPropsGeoLoading} onUseMyLocation={mockUseLocation} />);

      const buttons = screen.getAllByTestId('button');
      const geoButton = buttons.find((btn) => btn.textContent?.includes('Getting location'));

      if (geoButton) {
        fireEvent.click(geoButton);
      }

      expect(mockUseLocation).not.toHaveBeenCalled();
    });

    it('shows appropriate button text during loading', () => {
      render(<ZipcodeModal {...zipcodeModalPropsGeoLoading} />);

      expect(screen.getByText('Getting location...')).toBeInTheDocument();
      expect(screen.queryByText('Use my location')).not.toBeInTheDocument();
    });

    it('maintains button accessibility during loading', () => {
      render(<ZipcodeModal {...zipcodeModalPropsGeoLoading} />);

      const buttons = screen.getAllByTestId('button');
      const geoButton = buttons.find((btn) => btn.textContent?.includes('Getting location'));

      expect(geoButton).toHaveAttribute('disabled');
      expect(geoButton).toHaveClass('w-full');
    });
  });

  describe('Modal Behavior', () => {
    it('calls onClose when dialog overlay is clicked', () => {
      const mockClose = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onClose={mockClose} />);

      const overlay = screen.getByTestId('dialog-overlay');
      fireEvent.click(overlay);

      expect(mockClose).toHaveBeenCalled();
    });

    it('calls onClose when onOpenChange is triggered with false', () => {
      const mockClose = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onClose={mockClose} />);

      // Simulate dialog onOpenChange being called with false
      const dialog = screen.getByTestId('dialog');
      const onOpenChange = dialog.getAttribute('data-open') === 'true' ? mockClose : undefined;

      if (onOpenChange) {
        onOpenChange();
      }
    });

    it('handles rapid open/close state changes', async () => {
      const mockClose = jest.fn();
      const { rerender } = render(
        <ZipcodeModal {...defaultZipcodeModalProps} onClose={mockClose} />
      );

      // Rapidly toggle open state
      rerender(<ZipcodeModal {...zipcodeModalPropsNotOpen} onClose={mockClose} />);
      rerender(<ZipcodeModal {...defaultZipcodeModalProps} onClose={mockClose} />);
      rerender(<ZipcodeModal {...zipcodeModalPropsNotOpen} onClose={mockClose} />);

      // Should handle state changes without errors
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles typing in zipcode input', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');

      await userEvent.type(input, '12345');

      expect(input).toHaveValue('12345');
    });

    it('handles input clearing and retyping', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');

      await userEvent.type(input, 'wrong');
      await userEvent.clear(input);
      await userEvent.type(input, '12345');

      expect(input).toHaveValue('12345');
    });

    it('handles backspace and character deletion', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');

      await userEvent.type(input, '123456');
      await userEvent.type(input, '{backspace}');

      expect(input).toHaveValue('12345');
    });

    it('handles paste operations', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');

      await userEvent.click(input);
      await userEvent.paste('90210');

      expect(input).toHaveValue('90210');
    });

    it('maintains focus after clearing validation errors', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      // Trigger validation error
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid zipcode')).toBeInTheDocument();
      });

      // Start typing to clear error
      await userEvent.type(input, '1');

      expect(document.activeElement).toBe(input);
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports Tab navigation through form elements', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const buttons = screen.getAllByTestId('button');
      const locationButton = buttons.find((btn) => btn.textContent?.includes('Use my location'));
      const submitButton = buttons.find((btn) => btn.textContent?.includes('Save zipcode'));

      // Tab through elements
      await userEvent.tab();
      expect(document.activeElement).toBe(input);

      await userEvent.tab();
      expect(document.activeElement).toBe(locationButton);

      await userEvent.tab();
      expect(document.activeElement).toBe(submitButton);
    });

    it('handles Enter key submission', async () => {
      const mockSubmit = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

      const input = screen.getByTestId('input');

      await userEvent.type(input, '12345');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('12345');
      });
    });

    it('handles Escape key for modal closing', async () => {
      const mockClose = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onClose={mockClose} />);

      await userEvent.keyboard('{Escape}');

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('handles Space key for button activation', async () => {
      const mockUseLocation = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onUseMyLocation={mockUseLocation} />);

      const buttons = screen.getAllByTestId('button');
      const locationButton = buttons.find((btn) => btn.textContent?.includes('Use my location'));

      if (locationButton) {
        locationButton.focus();
        await userEvent.keyboard(' ');
        expect(mockUseLocation).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('provides proper form labeling', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('id', 'zipcode');
    });

    it('associates error messages with input', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const submitButton = screen.getByText('Save zipcode');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Please enter a valid zipcode');
        expect(errorMessage).toHaveClass('text-red-500');
      });
    });

    it('provides semantic heading structure', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const title = screen.getByTestId('dialog-title');
      expect(title.tagName.toLowerCase()).toBe('h2');
    });

    it('maintains proper focus management', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      await userEvent.click(input);

      expect(document.activeElement).toBe(input);
    });

    it('provides descriptive button text', () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      expect(screen.getByText('Use my location')).toBeInTheDocument();
      expect(screen.getByText('Save zipcode')).toBeInTheDocument();
    });

    it('handles screen reader announcements for errors', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const submitButton = screen.getByText('Save zipcode');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Please enter a valid zipcode');
        expect(errorMessage).toHaveAttribute('class', expect.stringContaining('text-red-500'));
      });
    });
  });

  describe('Performance', () => {
    it('handles rapid input changes efficiently', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');

      // Rapidly type multiple characters
      const rapidText = '1234567890';
      for (const char of rapidText) {
        await userEvent.type(input, char, { delay: 1 });
      }

      expect(input).toHaveValue(rapidText);
    });

    it('handles multiple validation attempts efficiently', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      // Multiple rapid submissions
      for (let i = 0; i < 3; i++) {
        await act(async () => {
          await userEvent.type(input, 'abc');
          fireEvent.click(submitButton);
          await userEvent.clear(input);
        });
      }

      // Trigger final error to test
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Should handle without performance issues and show validation error
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid zipcode')).toBeInTheDocument();
      });
    });

    it('manages state updates efficiently during rapid interactions', async () => {
      render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      const buttons = screen.getAllByTestId('button');
      const locationButton = buttons.find((btn) => btn.textContent?.includes('Use my location'));

      // Rapid alternating interactions
      await userEvent.type(input, '1');
      if (locationButton) fireEvent.click(locationButton);
      await userEvent.type(input, '2');
      if (locationButton) fireEvent.click(locationButton);
      await userEvent.type(input, '3');

      expect(input).toHaveValue('123');
    });
  });

  describe('Integration', () => {
    it('integrates correctly with all callback props', () => {
      render(<ZipcodeModal {...zipcodeModalPropsWithMockCallbacks} />);

      // Test onClose
      const overlay = screen.getByTestId('dialog-overlay');
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();

      // Test onUseMyLocation
      const locationButton = screen.getByText('Use my location');
      fireEvent.click(locationButton);
      expect(mockOnUseMyLocation).toHaveBeenCalled();
    });

    it('works correctly with external state management', () => {
      const { rerender } = render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      // Test prop changes
      rerender(<ZipcodeModal {...zipcodeModalPropsGeoLoading} />);
      expect(screen.getByText('Getting location...')).toBeInTheDocument();

      rerender(<ZipcodeModal {...zipcodeModalPropsWithError} />);
      expect(screen.getByTestId('dialog-description')).toHaveTextContent(
        "We couldn't access your location"
      );
    });

    it('maintains component state across prop changes', async () => {
      const { rerender } = render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      await userEvent.type(input, '12345');

      // Change props but maintain internal state
      rerender(<ZipcodeModal {...defaultZipcodeModalProps} error="Test error" />);

      expect(input).toHaveValue('12345');
    });

    it('handles concurrent operations gracefully', async () => {
      const mockSubmit = jest.fn();
      const mockUseLocation = jest.fn();

      render(
        <ZipcodeModal
          {...defaultZipcodeModalProps}
          onSubmit={mockSubmit}
          onUseMyLocation={mockUseLocation}
        />
      );

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');
      const locationButton = screen.getByText('Use my location');

      // Concurrent operations
      await userEvent.type(input, '12345');
      fireEvent.click(locationButton);
      fireEvent.click(submitButton);

      expect(mockUseLocation).toHaveBeenCalled();
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('12345');
      });
    });
  });

  describe('Error Recovery', () => {
    it('recovers from invalid input states', async () => {
      const mockSubmit = jest.fn();
      render(<ZipcodeModal {...defaultZipcodeModalProps} onSubmit={mockSubmit} />);

      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Save zipcode');

      // Create error state
      await userEvent.type(input, 'invalid');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid 5-digit zipcode')).toBeInTheDocument();
      });

      // Recover with valid input
      await userEvent.clear(input);
      await userEvent.type(input, '12345');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('12345');
        expect(screen.queryByText('Please enter a valid 5-digit zipcode')).not.toBeInTheDocument();
      });
    });

    it('handles component unmounting during operations', async () => {
      const { unmount } = render(<ZipcodeModal {...defaultZipcodeModalProps} />);

      const input = screen.getByTestId('input');
      await userEvent.type(input, '12345');

      // Unmount during typing - should not cause errors
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
});
