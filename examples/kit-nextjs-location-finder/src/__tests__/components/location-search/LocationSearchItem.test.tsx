import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LocationSearchItem } from '@/components/location-search/LocationSearchItem.dev';
import { mockDealerships } from './location-search.mock.props';

// Mock Text component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) =>
    React.createElement(tag, { className }, field?.value || '')
  ),
}));

describe('LocationSearchItem', () => {
  const mockOnSelect = jest.fn();
  const dealership = mockDealerships[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dealership information correctly', () => {
    const { getByText } = render(
      <LocationSearchItem dealership={dealership} isSelected={false} onSelect={mockOnSelect} />
    );

    expect(getByText('Downtown Auto Center')).toBeInTheDocument();
    expect(getByText('123 Main St')).toBeInTheDocument();
    expect(getByText('5.2mi')).toBeInTheDocument();
  });

  it('applies selected styling when isSelected is true', () => {
    const { container } = render(
      <LocationSearchItem dealership={dealership} isSelected={true} onSelect={mockOnSelect} />
    );

    const itemDiv = container.querySelector('[data-component="LocationSearchItem"]');
    expect(itemDiv).toHaveClass('bg-primary');
    expect(itemDiv).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onSelect when clicked', () => {
    const { container } = render(
      <LocationSearchItem dealership={dealership} isSelected={false} onSelect={mockOnSelect} />
    );

    const itemDiv = container.querySelector('[data-component="LocationSearchItem"]');
    if (itemDiv) {
      fireEvent.click(itemDiv);
    }

    expect(mockOnSelect).toHaveBeenCalledWith(dealership);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });
});
