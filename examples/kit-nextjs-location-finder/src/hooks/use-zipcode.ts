'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { USER_ZIPCODE } from '@/lib/constants';
import { hasNavigator, hasSessionStorage, isBrowser } from '@/utils/browser';

type ZipcodeState = {
  zipcode: string | null;
  loading: boolean;
  error: string | null;
  showModal: boolean;
};

const STORAGE_KEY = USER_ZIPCODE;

const GEOLOCATION_TIMEOUT = 8000; // 8 seconds timeout before showing modal

export function useZipcode(defaultZipcode: string) {
  const [state, setState] = useState<ZipcodeState>({
    zipcode: null,
    loading: false, // Start as false — defer geolocation until after LCP
    error: null,
    showModal: false,
  });

  // Use refs to track timeout and geolocation status
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const geolocationCompletedRef = useRef(false);

  // Function to show the modal as a fallback
  const showFallbackModal = useCallback(() => {
    // Only show the modal if geolocation hasn't completed yet
    if (!geolocationCompletedRef.current) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation request timed out. Please enter your zipcode manually.',
        showModal: true,
      }));
    }
  }, []);

  // Function to fetch zipcode using geolocation
  const fetchZipcode = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null, showModal: false }));

    if (!isBrowser) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Reset the geolocation completed flag
    geolocationCompletedRef.current = false;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to show the modal if geolocation takes too long
    timeoutRef.current = setTimeout(showFallbackModal, GEOLOCATION_TIMEOUT);

    // Check if geolocation is supported by the browser
    if (!hasNavigator() || !navigator.geolocation) {
      clearTimeout(timeoutRef.current);
      geolocationCompletedRef.current = true;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
        showModal: true,
      }));
      return;
    }

    // Try IP-based geolocation as a fallback if browser geolocation fails
    const tryIpBasedGeolocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP geolocation failed');

        const data = await response.json();

        if (data.postal) {
          if (hasSessionStorage()) {
            sessionStorage.setItem(STORAGE_KEY, data.postal);
          }

          setState((prev) => ({
            ...prev,
            zipcode: data.postal,
            loading: false,
            error: null,
            showModal: false,
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error('IP geolocation error:', error);
        return false;
      }
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Mark geolocation as completed to prevent timeout from showing modal
          geolocationCompletedRef.current = true;

          // Clear the timeout since we got a response
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          const { latitude, longitude } = position.coords;

          // Use OpenStreetMap's Nominatim service for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'LocationSearchApp', // Add user agent to avoid rate limiting
              },
              cache: 'no-cache', // Avoid caching issues
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address data');
          }

          const data = await response.json();

          // Extract postal code (zipcode)
          const zipcode = data.address?.postcode || null;

          if (zipcode) {
            // Save to sessionStorage
            if (hasSessionStorage()) {
              sessionStorage.setItem(STORAGE_KEY, zipcode);
            }

            setState((prev) => {
              return {
                ...prev,
                zipcode,
                loading: false,
                error: null,
                showModal: false,
              };
            });
          } else {
            // If no zipcode found in geocoding response, try IP-based geolocation
            const ipGeoSuccess = await tryIpBasedGeolocation();

            if (!ipGeoSuccess) {
              // If IP geolocation also fails, show the modal
              setState((prev) => ({
                ...prev,
                loading: false,
                error: 'Could not determine your zipcode from your location',
                showModal: true,
              }));
            }
          }
        } catch (error) {
          console.error('Error in geolocation process:', error);

          // Try IP-based geolocation as fallback
          const ipGeoSuccess = await tryIpBasedGeolocation();

          if (!ipGeoSuccess) {
            setState((prev) => ({
              ...prev,
              zipcode: null,
              loading: false,
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              showModal: true,
            }));
          }
        }
      },
      async (error) => {
        // Mark geolocation as completed to prevent timeout from showing modal
        geolocationCompletedRef.current = true;

        // Clear the timeout since we got a response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        let errorMessage = 'Failed to get location';

        // Handle specific geolocation errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out';
            break;
        }

        // Try IP-based geolocation as fallback
        const ipGeoSuccess = await tryIpBasedGeolocation();

        if (!ipGeoSuccess) {
          setState((prev) => ({
            ...prev,
            zipcode: null,
            loading: false,
            error: errorMessage,
            showModal: true, // Show modal when geolocation is denied
          }));
        }
      },
      // Add options for better geolocation performance and cross-browser compatibility
      {
        enableHighAccuracy: false, // Set to false for faster response
        timeout: 10000, // 10 seconds timeout for the geolocation API itself
        maximumAge: 60000, // Accept cached positions up to 1 minute old for faster response
      }
    );
  }, [showFallbackModal]);

  // Function to manually update zipcode
  const updateZipcode = useCallback((newZipcode: string | null) => {
    if (hasSessionStorage()) {
      if (newZipcode) {
        sessionStorage.setItem(STORAGE_KEY, newZipcode);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    setState((prev) => ({
      ...prev,
      zipcode: newZipcode,
      loading: false,
      error: null,
      showModal: false,
    }));
  }, []);

  // Function to close the modal without updating zipcode
  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showModal: false,
    }));
  }, []);

  // Cleanup function to clear timeouts
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Try to get zipcode from sessionStorage first (synchronous & fast)
    const storedZipcode = hasSessionStorage() ? sessionStorage.getItem(STORAGE_KEY) : null;

    if (storedZipcode) {
      setState((prev) => ({
        ...prev,
        zipcode: storedZipcode,
        loading: false,
      }));
    }
    // If no stored zipcode, do NOT auto-trigger geolocation.
    // The consumer component calls fetchZipcode() explicitly on user interaction
    // (e.g. "Use my location" button) to avoid a disruptive permission prompt
    // that blocks LCP and degrades page load performance.

    // Cleanup timeouts when component unmounts
    return cleanup;
  }, [fetchZipcode, cleanup]);

  return {
    ...state,
    // If no zipcode from geolocation, use the default
    zipcode: state.zipcode || defaultZipcode,
    updateZipcode,
    fetchZipcode,
    closeModal,
  };
}
