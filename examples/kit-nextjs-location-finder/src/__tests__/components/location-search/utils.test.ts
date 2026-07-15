/* eslint-disable no-console -- test file mocks console to suppress output */
import {
  calculateHaversineDistance,
  geocodeAddress,
  calculateDistance,
  enrichDealerships,
} from '@/components/location-search/utils';
import { mockDealerships } from './location-search.mock.props';

// Mock fetch
global.fetch = jest.fn();

describe('Location Search Utils', () => {
  let originalConsoleError: typeof console.error;
  let originalConsoleWarn: typeof console.warn;
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    jest.clearAllMocks();
    // Store original console methods
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    originalConsoleLog = console.log;
  });

  afterEach(() => {
    // Restore original console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  });

  describe('calculateHaversineDistance', () => {
    it('calculates distance between two coordinates correctly', () => {
      // Atlanta to New York (approximate)
      const distance = calculateHaversineDistance(33.749, -84.388, 40.7128, -74.006);

      expect(distance).toBeGreaterThan(700);
      expect(distance).toBeLessThan(900);
    });

    it('returns 0 for same coordinates', () => {
      const distance = calculateHaversineDistance(33.749, -84.388, 33.749, -84.388);

      expect(distance).toBe(0);
    });

    it('returns a number with one decimal place', () => {
      const distance = calculateHaversineDistance(33.749, -84.388, 34.052, -84.362);

      expect(typeof distance).toBe('number');
      const decimalPart = distance.toString().split('.')[1];
      if (decimalPart) {
        expect(decimalPart.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('geocodeAddress', () => {
    it('returns coordinates on successful geocoding', async () => {
      // Suppress console.log for this test
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          status: 'OK',
          results: [
            {
              geometry: {
                location: { lat: 33.749, lng: -84.388 },
              },
            },
          ],
        }),
      });

      const result = await geocodeAddress('Atlanta, GA', 'test-api-key');

      expect(result).toEqual({ lat: 33.749, lng: -84.388 });
    });

    it('returns null on failed geocoding', async () => {
      // Suppress console.error for this test
      console.error = jest.fn();
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          status: 'ZERO_RESULTS',
        }),
      });

      const result = await geocodeAddress('Invalid Address', 'test-api-key');

      expect(result).toBeNull();
    });

    it('handles fetch errors gracefully', async () => {
      // Suppress console.error for this test
      console.error = jest.fn();
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await geocodeAddress('Atlanta, GA', 'test-api-key');

      expect(result).toBeNull();
    });
  });

  describe('calculateDistance', () => {
    it('returns distance on successful API call', async () => {
      // Suppress console.log for this test
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          status: 'OK',
          rows: [
            {
              elements: [
                {
                  status: 'OK',
                  distance: { value: 16093.4 }, // 10 miles in meters
                },
              ],
            },
          ],
        }),
      });

      const result = await calculateDistance('30303', '30328', 'test-api-key');

      expect(result).toBeCloseTo(10, 0);
    });

    it('returns fallback distance on API failure', async () => {
      // Suppress console.log for this test
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          status: 'ZERO_RESULTS',
        }),
      });

      const result = await calculateDistance('30303', 'invalid', 'test-api-key');

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(200);
    });

    it('returns fallback distance on fetch error', async () => {
      // Suppress console.error for this test
      console.error = jest.fn();
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await calculateDistance('30303', '30328', 'test-api-key');

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('enrichDealerships', () => {
    it('returns empty array when no dealerships provided', async () => {
      // Suppress console.warn and console.log for this test
      console.warn = jest.fn();
      console.log = jest.fn();

      const result = await enrichDealerships([], '30303', 'test-api-key');

      expect(result).toEqual([]);
    });

    it('enriches dealerships with coordinates', async () => {
      // Suppress console.log for this test
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          status: 'OK',
          results: [
            {
              geometry: {
                location: { lat: 33.749, lng: -84.388 },
              },
            },
          ],
        }),
      });

      const dealershipsWithoutCoords = mockDealerships.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ latitude, longitude, distance, ...rest }) => rest
      );
      const result = await enrichDealerships(dealershipsWithoutCoords, '30303', 'test-api-key');

      expect(result.length).toBe(mockDealerships.length);
      expect(result[0]).toHaveProperty('latitude');
      expect(result[0]).toHaveProperty('longitude');
    });

    it('sorts dealerships by distance', async () => {
      // Suppress console.log for this test
      console.log = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          status: 'OK',
          results: [
            {
              geometry: {
                location: { lat: 33.749, lng: -84.388 },
              },
            },
          ],
        }),
      });

      const dealershipsWithoutCoords = mockDealerships.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ latitude, longitude, distance, ...rest }) => rest
      );
      const result = await enrichDealerships(dealershipsWithoutCoords, '30303', 'test-api-key');

      for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1].distance ?? Infinity;
        const curr = result[i].distance ?? Infinity;
        expect(prev).toBeLessThanOrEqual(curr);
      }
    });
  });
});
