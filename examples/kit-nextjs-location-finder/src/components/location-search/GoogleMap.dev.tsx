/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, useEffect, useState } from 'react';
import type { GoogleMapProps } from './google-maps.props';
import { useGoogleMaps } from '@/hooks/use-google-maps';

export const GoogleMap = ({
  apiKey,
  center,
  zoom,
  selectedDealership,
  dealerships,
  onDealershipSelect,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const bounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the global Google Maps loader hook
  const { isLoaded, error } = useGoogleMaps(apiKey);

  // Helper function to get plain value from Sitecore field
  const getFieldValue = (field: { jsonValue?: { value?: string } } | undefined): string => {
    return field?.jsonValue?.value || '';
  };

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const mapOptions = {
      center,
      zoom,
      // Disable most controls for a cleaner look
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      // Keep only the Google logo (required by Google Maps terms)
      // Use a subtle, clean styling that aligns with Google's branding
      styles: [
        {
          featureType: 'administrative',
          elementType: 'all',
          stylers: [{ saturation: '-100' }],
        },
        {
          featureType: 'administrative.province',
          elementType: 'all',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{ saturation: -100 }, { lightness: 65 }, { visibility: 'on' }],
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [{ saturation: '-100' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [{ visibility: 'simplified' }],
        },
        {
          featureType: 'road.arterial',
          elementType: 'all',
          stylers: [{ lightness: '30' }],
        },
        {
          featureType: 'road.local',
          elementType: 'all',
          stylers: [{ lightness: '40' }],
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{ saturation: -100 }, { visibility: 'simplified' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ hue: '#ffff00' }, { lightness: -25 }, { saturation: -97 }],
        },
        {
          featureType: 'water',
          elementType: 'labels',
          stylers: [{ lightness: -25 }, { saturation: -100 }],
        },
      ],
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add city label
    const cityLabel = document.createElement('div');
    cityLabel.className = 'city-label';
    cityLabel.textContent = selectedDealership
      ? getFieldValue(selectedDealership.dealershipCity)
      : 'Atlanta';
    cityLabel.style.position = 'absolute';
    cityLabel.style.bottom = '16px';
    cityLabel.style.right = '16px';
    cityLabel.style.color = '#333';
    cityLabel.style.fontSize = '24px';
    cityLabel.style.fontWeight = 'bold';
    cityLabel.style.textShadow = '1px 1px 3px rgba(255,255,255,0.5)';

    newMap.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(cityLabel);

    return () => {
      // Clean up
    };
  }, [isLoaded, center, zoom, selectedDealership]);

  // Update markers when dealerships change
  useEffect(() => {
    if (!map || !dealerships.length) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    // Clear any existing bounce timeout
    if (bounceTimeoutRef.current) {
      clearTimeout(bounceTimeoutRef.current);
      bounceTimeoutRef.current = null;
    }

    // Create new markers
    const newMarkers = dealerships
      .map((dealership) => {
        if (!dealership.latitude || !dealership.longitude) return null;

        const isSelected =
          selectedDealership?.dealershipName?.jsonValue?.value ===
          dealership.dealershipName?.jsonValue?.value;

        // Use the specified SVG files for markers
        const iconUrl = isSelected ? '/img/icons/location.svg' : '/img/icons/default.svg';

        const marker = new window.google.maps.Marker({
          position: { lat: dealership.latitude, lng: dealership.longitude },
          map,
          title: getFieldValue(dealership.dealershipName),
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(isSelected ? 64 : 12, isSelected ? 64 : 12),
            anchor: new window.google.maps.Point(16, 32),
          },
          // Only set animation for the selected dealership
          animation: isSelected ? window.google.maps.Animation.BOUNCE : null,
        });

        // If this is the selected marker, set a timeout to stop the bounce animation
        if (isSelected && marker.getAnimation()) {
          bounceTimeoutRef.current = setTimeout(() => {
            marker.setAnimation(null);
          }, 2000); // Stop bouncing after 2 seconds
        }

        // Add click event
        marker.addListener('click', () => {
          onDealershipSelect(dealership);
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">${getFieldValue(
              dealership.dealershipName
            )}</h3>
            <p style="margin: 0; font-size: 14px;">
              ${getFieldValue(dealership.dealershipAddress)}, ${getFieldValue(
                dealership.dealershipCity
              )}, ${getFieldValue(dealership.dealershipState)} ${getFieldValue(
                dealership.dealershipZipCode
              )}
            </p>
            ${
              dealership.distance !== undefined
                ? `<p style="margin: 8px 0 0; font-size: 14px;"><strong>${dealership.distance.toFixed(
                    1
                  )} mi</strong></p>`
                : ''
            }
          </div>
        `,
        });

        marker.addListener('mouseover', () => {
          // infoWindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        return marker;
      })
      .filter(Boolean);

    setMarkers(newMarkers as any[]);

    // Center map on selected dealership
    if (selectedDealership?.latitude && selectedDealership?.longitude) {
      map.panTo({ lat: selectedDealership.latitude, lng: selectedDealership.longitude });
    }

    return () => {
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current);
      }
      newMarkers.forEach((marker) => marker && marker.setMap(null));
    };
  }, [map, dealerships, selectedDealership, onDealershipSelect, markers]);

  return (
    <div ref={mapRef} className="h-full w-full">
      {!isLoaded && !error && (
        <div className="flex h-full w-full items-center justify-center bg-gray-300">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
      {error && (
        <div className="flex h-full w-full items-center justify-center bg-gray-300">
          <div className="text-center px-4">
            <div className="text-lg font-medium text-red-600">Failed to load map</div>
            <p className="mt-1 text-sm text-gray-600">{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
