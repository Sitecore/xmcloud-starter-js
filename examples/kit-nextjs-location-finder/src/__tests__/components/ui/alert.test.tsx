import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert', () => {
  it('renders alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>
    );

    expect(screen.getByText(/alert title/i)).toBeInTheDocument();
    expect(screen.getByText(/alert description text/i)).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
      </Alert>
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('destructive');
  });

  it('renders AlertTitle as h5 element', () => {
    render(<AlertTitle>Title</AlertTitle>);

    const title = screen.getByText(/title/i);
    expect(title.tagName).toBe('H5');
  });
});
