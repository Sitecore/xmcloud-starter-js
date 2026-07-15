import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuccessCompact } from '@/components/forms/success/success-compact.dev';

//  Mock lucide-react (in case global mocks aren’t loaded)
jest.mock('lucide-react', () => ({
  CheckCircle: () => <svg data-testid="check-circle-icon" />,
}));

describe('SuccessCompact Component', () => {
  const mockMessage = 'Operation completed successfully!';

  it('renders the success message correctly', () => {
    render(<SuccessCompact successMessage={mockMessage} />);

    //  Message text should be rendered
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
  });

  it('renders the success icon', () => {
    render(<SuccessCompact successMessage={mockMessage} />);

    //  Check that the icon appears
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
  });

  it('contains animation and transition classes', () => {
    const { container } = render(<SuccessCompact successMessage={mockMessage} />);

    //  Outer wrapper animation class
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv?.className).toContain('animate-fade-in');

    //  Message has animation too
    const message = screen.getByText(mockMessage);
    expect(message.className).toContain('animate-fade-in');
  });

  it('renders the pulsing background span', () => {
    render(<SuccessCompact successMessage={mockMessage} />);

    //  The ping background span exists
    const pingSpan = document.querySelector('span.animate-ping');
    expect(pingSpan).toBeInTheDocument();
  });
});
