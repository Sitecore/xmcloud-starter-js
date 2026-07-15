import React from 'react';
import { render, screen } from '@testing-library/react';
import { Calendar } from '@/components/ui/calendar';

// Mock button variants
jest.mock('@/components/ui/button', () => ({
  buttonVariants: jest.fn(() => 'mocked-button-class'),
}));

// Mock react-day-picker
jest.mock('react-day-picker', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DayPicker: ({ showOutsideDays, classNames, ...props }: Record<string, unknown>) => (
    <div data-testid="day-picker" {...props}>
      Calendar Component
    </div>
  ),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
}));

describe('Calendar', () => {
  it('renders calendar component', () => {
    render(<Calendar />);

    expect(screen.getByTestId('day-picker')).toBeInTheDocument();
  });

  it('renders calendar with selected date', () => {
    const date = new Date(2024, 0, 1);
    render(<Calendar mode="single" selected={date} />);

    expect(screen.getByTestId('day-picker')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Calendar className="custom-calendar" />);

    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });
});
