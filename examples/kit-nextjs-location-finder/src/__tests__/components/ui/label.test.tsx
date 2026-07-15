import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('renders label with text', () => {
    render(<Label>Email address</Label>);

    const label = screen.getByText(/email address/i);
    expect(label).toBeInTheDocument();
  });

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>
    );

    const label = screen.getByText(/email/i);
    expect(label).toHaveAttribute('for', 'email');
  });

  it('applies custom className', () => {
    render(<Label className="custom-label">Label</Label>);

    const label = screen.getByText(/label/i);
    expect(label.className).toContain('custom-label');
  });
});
