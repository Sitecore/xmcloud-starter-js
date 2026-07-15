import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders textarea field', () => {
    render(<Textarea placeholder="Enter description" />);

    const textarea = screen.getByPlaceholderText(/enter description/i);
    expect(textarea).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Textarea value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test content' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-textarea" data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea.className).toContain('custom-textarea');
  });
});
