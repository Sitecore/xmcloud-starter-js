import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ZipcodeModal } from '@/components/zipcode-modal/zipcode-modal.dev';

// Mock UI components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: React.PropsWithChildren<{ open: boolean }>) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: React.PropsWithChildren) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: React.PropsWithChildren) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    type,
    variant,
    onClick,
    disabled,
    className,
    ...props
  }: React.PropsWithChildren<{
    type?: 'button' | 'submit';
    variant?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }>) => (
    <button
      data-testid="ui-button"
      type={type}
      data-variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock Input component
jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input data-testid="zipcode-input" {...props} />
  ),
}));

// Mock MapPin icon
jest.mock('lucide-react', () => ({
  MapPin: ({ size }: { size?: number }) => (
    <span data-testid="map-pin-icon" data-size={size}>
      📍
    </span>
  ),
}));

describe('ZipcodeModal Component', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    onUseMyLocation: jest.fn(),
    isGeoLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with form elements when open', () => {
    render(<ZipcodeModal {...mockProps} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Enter your zipcode');
    expect(screen.getByTestId('dialog-description')).toHaveTextContent(
      'Please enter your zipcode to continue.'
    );
    expect(screen.getByTestId('zipcode-input')).toBeInTheDocument();
    expect(screen.getByText('Use my location')).toBeInTheDocument();
    expect(screen.getByText('Save zipcode')).toBeInTheDocument();
  });

  it('handles form submission with valid zipcode', async () => {
    render(<ZipcodeModal {...mockProps} />);

    const input = screen.getByTestId('zipcode-input');
    const submitButton = screen.getByText('Save zipcode');

    // Enter valid zipcode
    fireEvent.change(input, { target: { value: '10001' } });
    fireEvent.click(submitButton);

    expect(mockProps.onSubmit).toHaveBeenCalledWith('10001');
    expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors for invalid zipcode', async () => {
    render(<ZipcodeModal {...mockProps} />);

    const input = screen.getByTestId('zipcode-input');
    const submitButton = screen.getByText('Save zipcode');

    // Test empty zipcode
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid zipcode')).toBeInTheDocument();
    });

    // Test invalid zipcode format
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid 5-digit zipcode')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('handles use location button correctly', () => {
    render(<ZipcodeModal {...mockProps} />);

    const locationButton = screen.getByText('Use my location').closest('button');
    fireEvent.click(locationButton!);

    expect(mockProps.onUseMyLocation).toHaveBeenCalledTimes(1);
  });
});
