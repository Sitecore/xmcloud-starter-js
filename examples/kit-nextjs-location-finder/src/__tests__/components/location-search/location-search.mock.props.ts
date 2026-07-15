import type {
  LocationSearchProps,
  Dealership,
} from '@/components/location-search/location-search.props';
import { Page } from '@sitecore-content-sdk/nextjs';

export const mockDealerships: Dealership[] = [
  {
    dealershipName: { jsonValue: { value: 'Downtown Auto Center' } },
    dealershipAddress: { jsonValue: { value: '123 Main St' } },
    dealershipCity: { jsonValue: { value: 'Atlanta' } },
    dealershipState: { jsonValue: { value: 'GA' } },
    dealershipZipCode: { jsonValue: { value: '30303' } },
    distance: 5.2,
    latitude: 33.749,
    longitude: -84.388,
  },
  {
    dealershipName: { jsonValue: { value: 'Northside Motors' } },
    dealershipAddress: { jsonValue: { value: '456 Peachtree Rd' } },
    dealershipCity: { jsonValue: { value: 'Sandy Springs' } },
    dealershipState: { jsonValue: { value: 'GA' } },
    dealershipZipCode: { jsonValue: { value: '30328' } },
    distance: 12.5,
    latitude: 33.924,
    longitude: -84.378,
  },
  {
    dealershipName: { jsonValue: { value: 'Southside Auto' } },
    dealershipAddress: { jsonValue: { value: '789 Market St' } },
    dealershipCity: { jsonValue: { value: 'Decatur' } },
    dealershipState: { jsonValue: { value: 'GA' } },
    dealershipZipCode: { jsonValue: { value: '30030' } },
    distance: 8.7,
    latitude: 33.774,
    longitude: -84.296,
  },
];

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

export const mockLocationSearchProps: LocationSearchProps = {
  rendering: {
    componentName: 'LocationSearch',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    data: {
      datasource: {
        title: { jsonValue: { value: 'Find a Dealership Near You' } },
        defaultZipCode: '30303',
        googleMapsApiKey: 'test-api-key',
      },
      dealerships: {
        results: mockDealerships,
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
  defaultZipCode: '30303',
  googleMapsApiKey: 'test-api-key',
};
