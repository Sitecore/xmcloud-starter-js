import React from 'react';
import { render, screen } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Mock Radix UI RadioGroup
jest.mock('@radix-ui/react-radio-group', () => ({
  Root: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="radio-group" {...props}>
      {children}
    </div>
  ),
  Item: ({ value, ...props }: Record<string, unknown>) => (
    <button data-testid={`radio-item-${value}`} {...props} />
  ),
  Indicator: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Circle: () => <span data-testid="circle-icon">○</span>,
}));

describe('RadioGroup', () => {
  it('renders radio group', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
  });

  it('renders radio group items', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    expect(screen.getByTestId('radio-item-option1')).toBeInTheDocument();
    expect(screen.getByTestId('radio-item-option2')).toBeInTheDocument();
  });

  it('renders circle indicator icon', () => {
    render(<RadioGroupItem value="test" />);

    expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
  });
});
