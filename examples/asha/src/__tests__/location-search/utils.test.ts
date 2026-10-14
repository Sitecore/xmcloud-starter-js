import {
  geocodeAddress,
  calculateHaversineDistance,
  calculateDistance,
  enrichDealerships,
} from '@/components/location-search/utils';
import type { DealershipFields } from '@/components/location-search/location-search.props';

// Mock global fetch
global.fetch = jest.fn();

describe('Location Search Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console mocks
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('geocodeAddress', () => {
    const mockApiKey = 'test-api-key-12345678';

    it('returns coordinates for a valid address', async () => {
      const mockResponse = {
        status: 'OK',
        results: [
          {
            geometry: {
              location: {
                lat: 40.7128,
                lng: -74.006,
              },
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await geocodeAddress('New York, NY', mockApiKey);

      expect(result).toEqual({ lat: 40.7128, lng: -74.006 });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://maps.googleapis.com/maps/api/geocode/json')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('New York, NY'))
      );
    });

    it('returns null when geocoding fails with non-OK status', async () => {
      const mockResponse = {
        status: 'ZERO_RESULTS',
        error_message: 'Address not found',
        results: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await geocodeAddress('Invalid Address 12345', mockApiKey);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Geocoding failed:',
        'ZERO_RESULTS',
        'Address not found'
      );
    });

    it('returns null when API returns no results', async () => {
      const mockResponse = {
        status: 'OK',
        results: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await geocodeAddress('Test Address', mockApiKey);

      expect(result).toBeNull();
    });

    it('returns null and logs error when fetch throws an exception', async () => {
      const mockError = new Error('Network error');

      (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await geocodeAddress('Test Address', mockApiKey);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error geocoding address:', mockError);
    });

    it('logs masked API key for debugging', async () => {
      const mockResponse = {
        status: 'OK',
        results: [
          {
            geometry: {
              location: { lat: 40.7128, lng: -74.006 },
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await geocodeAddress('Test Address', mockApiKey);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Geocoding address with API key: test...5678')
      );
    });

    it('handles undefined API key gracefully', async () => {
      const mockResponse = {
        status: 'REQUEST_DENIED',
        error_message: 'Invalid API key',
        results: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await geocodeAddress('Test Address', '');

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('undefined'));
    });
  });

  describe('calculateHaversineDistance', () => {
    it('calculates distance between New York and Los Angeles', () => {
      // New York coordinates
      const nyLat = 40.7128;
      const nyLon = -74.006;

      // Los Angeles coordinates
      const laLat = 34.0522;
      const laLon = -118.2437;

      const distance = calculateHaversineDistance(nyLat, nyLon, laLat, laLon);

      // Expected distance is approximately 2451 miles
      expect(distance).toBeGreaterThan(2400);
      expect(distance).toBeLessThan(2500);
    });

    it('calculates distance between close locations', () => {
      // Two points approximately 10 miles apart
      const lat1 = 40.7128;
      const lon1 = -74.006;
      const lat2 = 40.8;
      const lon2 = -74.1;

      const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(5);
      expect(distance).toBeLessThan(15);
    });

    it('returns 0 for identical coordinates', () => {
      const lat = 40.7128;
      const lon = -74.006;

      const distance = calculateHaversineDistance(lat, lon, lat, lon);

      expect(distance).toBe(0);
    });

    it('returns distance with 1 decimal place precision', () => {
      const distance = calculateHaversineDistance(40.7128, -74.006, 34.0522, -118.2437);

      // Check that the result has at most 1 decimal place
      const decimalPart = distance.toString().split('.')[1];
      expect(decimalPart ? decimalPart.length : 0).toBeLessThanOrEqual(1);
    });

    it('handles negative coordinates correctly', () => {
      // Sydney, Australia coordinates
      const sydLat = -33.8688;
      const sydLon = 151.2093;

      // Melbourne, Australia coordinates
      const melLat = -37.8136;
      const melLon = 144.9631;

      const distance = calculateHaversineDistance(sydLat, sydLon, melLat, melLon);

      // Expected distance is approximately 443 miles
      expect(distance).toBeGreaterThan(400);
      expect(distance).toBeLessThan(500);
    });

    it('handles coordinates crossing the equator', () => {
      const lat1 = 10; // Northern hemisphere
      const lon1 = 0;
      const lat2 = -10; // Southern hemisphere
      const lon2 = 0;

      const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);

      // Should be approximately 1385 miles
      expect(distance).toBeGreaterThan(1300);
      expect(distance).toBeLessThan(1500);
    });
  });

  describe('calculateDistance', () => {
    const mockApiKey = 'test-api-key';

    it('returns distance in miles for valid zip codes', async () => {
      const mockResponse = {
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'OK',
                distance: {
                  value: 16093.4, // 10 miles in meters
                },
              },
            ],
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const distance = await calculateDistance('10001', '10002', mockApiKey);

      expect(distance).toBe(10);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://maps.googleapis.com/maps/api/distancematrix/json')
      );
    });

    it('converts meters to miles correctly', async () => {
      const mockResponse = {
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'OK',
                distance: {
                  value: 80467, // 50 miles in meters
                },
              },
            ],
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const distance = await calculateDistance('10001', '19019', mockApiKey);

      expect(distance).toBe(50);
    });

    it('returns distance with 1 decimal place precision', async () => {
      const mockResponse = {
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'OK',
                distance: {
                  value: 24140.1, // 15 miles in meters
                },
              },
            ],
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const distance = await calculateDistance('10001', '10003', mockApiKey);

      const decimalPart = distance.toString().split('.')[1];
      expect(decimalPart ? decimalPart.length : 0).toBeLessThanOrEqual(1);
    });

    it('returns random fallback distance when API returns non-OK status', async () => {
      const mockResponse = {
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'NOT_FOUND',
              },
            ],
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const distance = await calculateDistance('00000', '99999', mockApiKey);

      expect(distance).toBeGreaterThanOrEqual(0);
      expect(distance).toBeLessThan(200);
    });

    it('returns random fallback distance when API status is not OK', async () => {
      const mockResponse = {
        status: 'INVALID_REQUEST',
        rows: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const distance = await calculateDistance('invalid', 'invalid', mockApiKey);

      expect(distance).toBeGreaterThanOrEqual(0);
      expect(distance).toBeLessThan(200);
    });

    it('returns random fallback distance when fetch throws error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const distance = await calculateDistance('10001', '10002', mockApiKey);

      expect(distance).toBeGreaterThanOrEqual(0);
      expect(distance).toBeLessThan(200);
      expect(console.error).toHaveBeenCalledWith('Error calculating distance:', expect.any(Error));
    });

    it('encodes origin and destination correctly', async () => {
      const mockResponse = {
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'OK',
                distance: { value: 16093.4 },
              },
            ],
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await calculateDistance('New York, NY 10001', 'Boston, MA 02101', mockApiKey);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('New York, NY 10001'))
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('Boston, MA 02101'))
      );
    });
  });

  describe('enrichDealerships', () => {
    const mockApiKey = 'test-api-key';

    const createMockDealership = (overrides?: Partial<DealershipFields>): DealershipFields => ({
      dealershipName: {
        jsonValue: { value: overrides?.dealershipName?.jsonValue?.value || 'Test Dealership' },
      },
      dealershipAddress: {
        jsonValue: {
          value: overrides?.dealershipAddress?.jsonValue?.value || '123 Main St',
        },
      },
      dealershipCity: {
        jsonValue: { value: overrides?.dealershipCity?.jsonValue?.value || 'New York' },
      },
      dealershipState: {
        jsonValue: { value: overrides?.dealershipState?.jsonValue?.value || 'NY' },
      },
      dealershipZipCode: {
        jsonValue: { value: overrides?.dealershipZipCode?.jsonValue?.value || '10001' },
      },
    });

    beforeEach(() => {
      // Mock successful geocoding responses
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('geocode')) {
          return Promise.resolve({
            json: async () => ({
              status: 'OK',
              results: [
                {
                  geometry: {
                    location: { lat: 40.7128, lng: -74.006 },
                  },
                },
              ],
            }),
          });
        }
        return Promise.resolve({
          json: async () => ({ status: 'ERROR' }),
        });
      });
    });

    it('enriches dealerships with coordinates and distances', async () => {
      const dealerships = [createMockDealership()];

      const result = await enrichDealerships(dealerships, '10002', mockApiKey);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('latitude');
      expect(result[0]).toHaveProperty('longitude');
      expect(result[0]).toHaveProperty('distance');
      expect(result[0].latitude).toBe(40.7128);
      expect(result[0].longitude).toBe(-74.006);
    });

    it('returns empty array for empty dealership list', async () => {
      const result = await enrichDealerships([], '10001', mockApiKey);

      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith('No dealerships to enrich');
    });

    it('logs enrichment information', async () => {
      const dealerships = [createMockDealership()];

      await enrichDealerships(dealerships, '10001', mockApiKey);

      expect(console.log).toHaveBeenCalledWith(
        'Enriching dealerships with coordinates and distances from zip code:',
        '10001'
      );
      expect(console.log).toHaveBeenCalledWith('Dealerships to enrich:', dealerships);
    });

    it('enriches multiple dealerships', async () => {
      const dealerships = [
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Dealership 1' } },
        }),
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Dealership 2' } },
        }),
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Dealership 3' } },
        }),
      ];

      const result = await enrichDealerships(dealerships, '10001', mockApiKey);

      expect(result).toHaveLength(3);
      expect(result.every((d) => d.latitude && d.longitude && d.distance !== undefined)).toBe(true);
    });

    it('sorts dealerships by distance (closest first)', async () => {
      let callCount = 0;

      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('geocode')) {
          callCount++;
          // Return different coordinates for each dealership
          const coords = [
            { lat: 40.7128, lng: -74.006 }, // Origin
            { lat: 40.7128, lng: -74.006 }, // Same as origin (0 miles)
            { lat: 40.8, lng: -74.1 }, // ~10 miles away
            { lat: 34.0522, lng: -118.2437 }, // ~2450 miles away (LA)
          ];

          return Promise.resolve({
            json: async () => ({
              status: 'OK',
              results: [
                {
                  geometry: {
                    location: coords[callCount - 1] || coords[0],
                  },
                },
              ],
            }),
          });
        }
        return Promise.resolve({
          json: async () => ({ status: 'ERROR' }),
        });
      });

      const dealerships = [
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Far Dealership' } },
        }),
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Medium Dealership' } },
        }),
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Close Dealership' } },
        }),
      ];

      const result = await enrichDealerships(dealerships, '10001', mockApiKey);

      // Check that distances are in ascending order
      expect(result[0].distance).toBeLessThanOrEqual(result[1].distance || Infinity);
      expect(result[1].distance).toBeLessThanOrEqual(result[2].distance || Infinity);
    });

    it('handles dealerships without coordinates gracefully', async () => {
      let callCount = 0;

      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('geocode')) {
          callCount++;
          // First call: dealership geocoding fails
          // Second call: origin zip code succeeds
          if (callCount === 1) {
            return Promise.resolve({
              json: async () => ({
                status: 'ZERO_RESULTS',
                results: [],
              }),
            });
          } else {
            return Promise.resolve({
              json: async () => ({
                status: 'OK',
                results: [
                  {
                    geometry: {
                      location: { lat: 40.7128, lng: -74.006 },
                    },
                  },
                ],
              }),
            });
          }
        }
        return Promise.resolve({
          json: async () => ({ status: 'ERROR' }),
        });
      });

      const dealerships = [createMockDealership()];

      const result = await enrichDealerships(dealerships, '10001', mockApiKey);

      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBeUndefined();
      expect(result[0].longitude).toBeUndefined();
      // Should have a mock distance fallback
      expect(result[0].distance).toBeGreaterThanOrEqual(0);
      expect(result[0].distance).toBeLessThan(200);
    });

    it('returns dealerships with coordinates but no distances when origin geocoding fails', async () => {
      let callCount = 0;

      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('geocode')) {
          callCount++;
          // First call: dealership succeeds
          // Last call: origin zip code fails
          if (callCount < 2) {
            return Promise.resolve({
              json: async () => ({
                status: 'OK',
                results: [
                  {
                    geometry: {
                      location: { lat: 40.7128, lng: -74.006 },
                    },
                  },
                ],
              }),
            });
          } else {
            return Promise.resolve({
              json: async () => ({
                status: 'ZERO_RESULTS',
                results: [],
              }),
            });
          }
        }
        return Promise.resolve({
          json: async () => ({ status: 'ERROR' }),
        });
      });

      const dealerships = [createMockDealership()];

      const result = await enrichDealerships(dealerships, 'invalid', mockApiKey);

      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBe(40.7128);
      expect(result[0].longitude).toBe(-74.006);
      expect(result[0].distance).toBeUndefined();
    });

    it('preserves original dealership fields', async () => {
      const originalDealership = createMockDealership({
        dealershipName: { jsonValue: { value: 'Test Dealership Name' } },
        dealershipZipCode: { jsonValue: { value: '10005' } },
      });

      const result = await enrichDealerships([originalDealership], '10001', mockApiKey);

      expect(result[0].dealershipName).toEqual(originalDealership.dealershipName);
      expect(result[0].dealershipZipCode).toEqual(originalDealership.dealershipZipCode);
      expect(result[0].dealershipAddress).toEqual(originalDealership.dealershipAddress);
    });

    it('handles undefined distances in sorting correctly', async () => {
      let callCount = 0;

      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('geocode')) {
          callCount++;
          // Origin and first 2 calls for dealerships, third dealership fails
          // Call 1: First dealership succeeds
          // Call 2: Second dealership fails
          // Call 3: Origin succeeds
          if (callCount === 1 || callCount === 3) {
            return Promise.resolve({
              json: async () => ({
                status: 'OK',
                results: [
                  {
                    geometry: {
                      location: { lat: 40.7128, lng: -74.006 },
                    },
                  },
                ],
              }),
            });
          } else {
            return Promise.resolve({
              json: async () => ({
                status: 'ZERO_RESULTS',
                results: [],
              }),
            });
          }
        }
        return Promise.resolve({
          json: async () => ({ status: 'ERROR' }),
        });
      });

      const dealerships = [
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Dealership 1' } },
        }),
        createMockDealership({
          dealershipName: { jsonValue: { value: 'Dealership 2' } },
        }),
      ];

      const result = await enrichDealerships(dealerships, '10001', mockApiKey);

      expect(result).toHaveLength(2);
      // First dealership has coordinates and distance
      expect(result[0].distance).toBeDefined();
      // Second dealership without coordinates will have mock fallback distance
      expect(result[1].distance).toBeDefined();
    });
  });
});
