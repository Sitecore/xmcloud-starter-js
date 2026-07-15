import React from 'react';
import { render } from '@testing-library/react';
import { GoogleMap } from '@/components/location-search/GoogleMap.dev';
import { mockDealerships } from './location-search.mock.props';

describe('GoogleMap', () => {
  const mockProps = {
    apiKey: 'test-api-key',
    center: { lat: 33.749, lng: -84.388 },
    zoom: 10,
    selectedDealership: null,
    dealerships: mockDealerships,
    onDealershipSelect: jest.fn(),
  };

  beforeEach(() => {
    // Mock window.google
    delete (window as { google?: unknown }).google;
  });

  it('renders loading state when map is not loaded', () => {
    const { getByText } = render(<GoogleMap {...mockProps} />);

    expect(getByText('Loading map...')).toBeInTheDocument();
  });

  it('renders map container with correct dimensions', () => {
    const { container } = render(<GoogleMap {...mockProps} />);

    const mapDiv = container.querySelector('.h-full.w-full');
    expect(mapDiv).toBeInTheDocument();
  });

  it('renders with provided dealerships', () => {
    const { container } = render(<GoogleMap {...mockProps} dealerships={mockDealerships} />);

    expect(container.firstChild).toBeInTheDocument();
    // Map component is present (loading or loaded)
    const mapContainer = container.querySelector('.h-full.w-full');
    expect(mapContainer).toBeInTheDocument();
  });
});
