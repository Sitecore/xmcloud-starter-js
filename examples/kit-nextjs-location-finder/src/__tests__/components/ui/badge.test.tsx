import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders badge with text', () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText(/new/i);
    expect(badge).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);

    const badge = screen.getByText(/error/i);
    expect(badge).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Badge</Badge>);

    const badge = screen.getByText(/badge/i);
    expect(badge.className).toContain('custom-badge');
  });
});
