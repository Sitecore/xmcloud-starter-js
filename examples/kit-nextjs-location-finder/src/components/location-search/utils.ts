import type { Dealership, DealershipFields } from './location-search.props';

// Helper function to get plain value from Sitecore field
const getFieldValue = (field: { jsonValue?: { value?: string } } | undefined): string => {
  return field?.jsonValue?.value || '';
};

// Function to geocode an address using Google Maps Geocoding API
export const geocodeAddress = async (
  address: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> => {
  try {
    // Log the API key for debugging (mask most of it for security)
    const maskedKey = apiKey
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
      : 'undefined';
    console.log(`Geocoding address with API key: ${maskedKey}`);

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }

    console.error('Geocoding failed:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Function to calculate distance between two coordinates using Haversine formula
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number.parseFloat(distance.toFixed(1));
};

// Function to calculate distance between two zip codes using Google Maps Distance Matrix API
export const calculateDistance = async (
  origin: string,
  destination: string,
  apiKey: string
): Promise<number> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
      )}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${apiKey}`
    );
    const data = await response.json();

    if (
      data.status === 'OK' &&
      data.rows &&
      data.rows.length > 0 &&
      data.rows[0].elements &&
      data.rows[0].elements.length > 0 &&
      data.rows[0].elements[0].status === 'OK'
    ) {
      // Convert meters to miles and round to 1 decimal place
      const distanceInMiles = Number.parseFloat(
        (data.rows[0].elements[0].distance.value / 1609.34).toFixed(1)
      );
      return distanceInMiles;
    }

    // Fallback to a mock distance if the API fails
    return Number.parseFloat((Math.random() * 200).toFixed(1));
  } catch (error) {
    console.error('Error calculating distance:', error);
    // Fallback to a mock distance if the API fails
    return Number.parseFloat((Math.random() * 200).toFixed(1));
  }
};

// Function to enrich dealership data with coordinates and distances
export const enrichDealerships = async (
  dealerships: DealershipFields[],
  zipCode: string,
  apiKey: string
): Promise<Dealership[]> => {
  console.log('Enriching dealerships with coordinates and distances from zip code:', zipCode);
  console.log('Dealerships to enrich:', dealerships);

  if (!dealerships || dealerships.length === 0) {
    console.warn('No dealerships to enrich');
    return [];
  }

  // First, geocode all dealerships to get coordinates
  const dealershipsWithCoords = await Promise.all(
    dealerships.map(async (dealership) => {
      // Create a new object that extends the original dealership fields
      const enrichedDealership: Dealership = { ...dealership };

      const fullAddress = `${getFieldValue(dealership.dealershipAddress)}, ${getFieldValue(
        dealership.dealershipCity
      )}, ${getFieldValue(dealership.dealershipState)} ${getFieldValue(
        dealership.dealershipZipCode
      )}`;
      const coords = await geocodeAddress(fullAddress, apiKey);

      if (coords) {
        enrichedDealership.latitude = coords.lat;
        enrichedDealership.longitude = coords.lng;
      }

      return enrichedDealership;
    })
  );

  // Geocode the search zip code
  const originCoords = await geocodeAddress(zipCode, apiKey);

  if (!originCoords) {
    // console.warn('Could not geocode origin zip code:', zipCode);
    // If we can't geocode the origin, just return the dealerships with coordinates but no distances
    return dealershipsWithCoords;
  }

  // Calculate distances
  const dealershipsWithDistance = dealershipsWithCoords.map((dealership) => {
    const enrichedDealership = { ...dealership };

    if (dealership.latitude && dealership.longitude) {
      // Use Haversine formula for quick distance calculation
      const distance = calculateHaversineDistance(
        originCoords.lat,
        originCoords.lng,
        dealership.latitude,
        dealership.longitude
      );

      enrichedDealership.distance = distance;
    } else {
      // Fallback to a mock distance
      const mockDistance = Number.parseFloat((Math.random() * 200).toFixed(1));

      enrichedDealership.distance = mockDistance;
    }

    return enrichedDealership;
  });

  // Sort by distance
  const sortedDealerships = dealershipsWithDistance.sort((a, b) => {
    // Handle undefined distances (should be rare but possible)
    if (a.distance === undefined && b.distance === undefined) return 0;
    if (a.distance === undefined) return 1; // Push undefined distances to the end
    if (b.distance === undefined) return -1;

    // Normal case: sort by distance ascending (closest first)
    return a.distance - b.distance;
  });

  return sortedDealerships;
};
