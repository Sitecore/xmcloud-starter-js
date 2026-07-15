import React from 'react';
import { render } from '@testing-library/react';
import { mockLocationSearchProps } from './location-search.mock.props';

// Mock useSitecore
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: jest.fn(({ field, tag = 'span', className }) =>
    React.createElement(tag, { className }, field?.value || '')
  ),
}));

// Mock variant components
jest.mock('@/components/location-search/LocationSearchDefault.dev', () => ({
  LocationSearchDefault: jest.fn(({ isPageEditing }) => (
    <div data-testid="location-search-default" data-editing={isPageEditing}>
      Default Variant
    </div>
  )),
}));

jest.mock('@/components/location-search/LocationSearchMapRight.dev', () => ({
  LocationSearchMapRight: jest.fn(({ isPageEditing }) => (
    <div data-testid="location-search-map-right" data-editing={isPageEditing}>
      MapRight Variant
    </div>
  )),
}));

jest.mock('@/components/location-search/LocationSearchMapTopAllCentered.dev', () => ({
  LocationSearchMapTopAllCentered: jest.fn(({ isPageEditing }) => (
    <div data-testid="location-search-map-top-all-centered" data-editing={isPageEditing}>
      MapTopAllCentered Variant
    </div>
  )),
}));

jest.mock('@/components/location-search/LocationSearchMapRightTitleZipCentered.dev', () => ({
  LocationSearchMapRightTitleZipCentered: jest.fn(({ isPageEditing }) => (
    <div data-testid="location-search-map-right-title-zip-centered" data-editing={isPageEditing}>
      MapRightTitleZipCentered Variant
    </div>
  )),
}));

jest.mock('@/components/location-search/LocationSearchTitleZipCentered.dev', () => ({
  LocationSearchTitleZipCentered: jest.fn(({ isPageEditing }) => (
    <div data-testid="location-search-title-zip-centered" data-editing={isPageEditing}>
      TitleZipCentered Variant
    </div>
  )),
}));

describe('LocationSearch', () => {
  beforeEach(() => {
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });
  });

  it('renders Default variant correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Default } = require('@/components/location-search/LocationSearch');
    const { getByTestId } = render(<Default {...mockLocationSearchProps} />);

    expect(getByTestId('location-search-default')).toBeInTheDocument();
    expect(getByTestId('location-search-default')).toHaveAttribute('data-editing', 'false');
  });

  it('renders MapRight variant correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MapRight } = require('@/components/location-search/LocationSearch');
    const { getByTestId } = render(<MapRight {...mockLocationSearchProps} />);

    expect(getByTestId('location-search-map-right')).toBeInTheDocument();
  });

  it('passes isEditing prop from Sitecore context', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Default } = require('@/components/location-search/LocationSearch');
    const { getByTestId } = render(
      <Default
        {...mockLocationSearchProps}
        page={{
          ...mockLocationSearchProps.page,
          mode: {
            isEditing: true,
            isPreview: false,
            isNormal: false,
          },
        }}
      />
    );

    expect(getByTestId('location-search-default')).toHaveAttribute('data-editing', 'true');
  });
});
