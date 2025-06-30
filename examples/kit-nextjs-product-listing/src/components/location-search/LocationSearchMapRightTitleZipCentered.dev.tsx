'use client';

import type React from 'react';
import { useMemo, useCallback, useState, useEffect } from 'react';
import type { LocationSearchProps, Dealership } from './location-search.props';
import { LocationSearchItem } from './LocationSearchItem.dev';
import { enrichDealerships } from './utils';
import { Button } from '@/components/ui/button';
import { GoogleMap } from './GoogleMap.dev';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { useZipcode } from '@/hooks/use-zipcode';
import { ZipcodeModal } from '@/components/zipcode-modal/zipcode-modal.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { useMatchMedia } from '@/hooks/use-match-media';

export const LocationSearchMapRightTitleZipCentered = (props: LocationSearchProps) => {
  const { fields, isPageEditing } = props;
  const datasource = fields?.data?.datasource || {};
  const title = datasource.title;
  const defaultZipCode = datasource?.defaultZipCode || '';
  const [showChangeZipcodeModal, setShowChangeZipcodeModal] = useState(false);
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  // Use the zipcode hook with the default zipcode
  const {
    zipcode: geoZipcode,
    loading: geoLoading,
    error: geoError,
    showModal,
    fetchZipcode,
    updateZipcode,
    closeModal,
  } = useZipcode(defaultZipCode);

  // Access dealerships correctly from the props structure
  const initialDealerships = useMemo(() => {
    return fields?.data?.dealerships?.results || [];
  }, [fields?.data?.dealerships?.results]);

  // Use environment variable for Google Maps API key
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const [zipCode, setZipCode] = useState(defaultZipCode);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [selectedDealership, setSelectedDealership] = useState<Dealership | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.749, lng: -84.388 });
  const [isLoading, setIsLoading] = useState(true); // Start with loading state

  // Function to update dealerships based on zipcode
  const updateDealershipsWithZipcode = useCallback(
    async (zip: string) => {
      if (!zip || initialDealerships.length === 0) return;

      setIsLoading(true);
      try {
        //Refreshing dealerships with zipcode
        const enrichedDealerships = await enrichDealerships(
          initialDealerships,
          zip,
          googleMapsApiKey
        );

        setDealerships(enrichedDealerships);

        if (enrichedDealerships.length > 0) {
          handleSelectDealership(enrichedDealerships[0]);
        }
      } catch (error) {
        console.error('Error updating dealerships:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [initialDealerships, googleMapsApiKey]
  );

  // Update local zipcode when geolocation zipcode changes
  useEffect(() => {
    if (geoZipcode && geoZipcode !== zipCode) {
      setZipCode(geoZipcode);
      // Force a refresh of dealerships when zipcode is updated via geolocation
      updateDealershipsWithZipcode(geoZipcode);
    }
  }, [geoZipcode, zipCode, updateDealershipsWithZipcode]);

  // Initial load of dealerships with coordinates and distances
  useEffect(() => {
    const initializeDealerships = async () => {
      if (initialDealerships.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Enrich dealerships with coordinates and distances
        const enrichedDealerships = await enrichDealerships(
          initialDealerships,
          zipCode,
          googleMapsApiKey
        );

        setDealerships(enrichedDealerships);

        // Select the first dealership by default
        if (enrichedDealerships.length > 0) {
          handleSelectDealership(enrichedDealerships[0]);
        }
      } catch (error) {
        console.error('Error initializing dealerships:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDealerships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDealerships, googleMapsApiKey]);

  // Update distances when zip code changes
  useEffect(() => {
    updateDealershipsWithZipcode(zipCode);
  }, [zipCode, updateDealershipsWithZipcode]);

  const handleSelectDealership = (dealership: Dealership) => {
    setSelectedDealership(dealership);
    if (dealership.latitude && dealership.longitude) {
      setMapCenter({ lat: dealership.latitude, lng: dealership.longitude });
    }
  };

  const handleUseMyLocation = () => {
    // Clear any existing zipcode in state to ensure we see the update
    setZipCode('');
    // Trigger geolocation
    fetchZipcode();
  };

  // Handle modal submission
  const handleModalSubmit = (zipcode: string) => {
    updateZipcode(zipcode);
    setZipCode(zipcode);
    setShowChangeZipcodeModal(false);
  };

  const hasPagesPositionStyles: boolean = props?.params?.styles
    ? props?.params?.styles.includes('position-')
    : false;

  if (fields) {
    return (
      <div
        className="@container bg-background text-foreground group relative"
        data-component="LocationSearch"
      >
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          {googleMapsApiKey === '' && isPageEditing && (
            <AnimatedSection
              direction="up"
              className="relative z-20"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <p className="border-default bg-secondary text-secondary-foreground max-w-3/4 absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform p-4 text-center text-xl">
                Please set the Google Maps API key in the environment variables to enable the map.
              </p>
            </AnimatedSection>
          )}
          <div
            className={cn('group', {
              'position-center': !hasPagesPositionStyles,
              [props?.params?.styles]: props?.params?.styles,
            })}
            data-class-change
          >
            {title?.jsonValue && (
              <AnimatedSection
                direction="up"
                className="relative z-20"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
              >
                <Text tag="h2" className="mb-3" field={title?.jsonValue} />
              </AnimatedSection>
            )}
            <AnimatedSection
              direction="up"
              className="relative z-20"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              delay={200}
            >
              <div
                className={cn(
                  'mb-11 flex flex-wrap items-center gap-2 group-[.position-center]:justify-center',
                  {
                    'opacity-20': googleMapsApiKey === '' && isPageEditing,
                  }
                )}
              >
                <span className="font-heading text-lg font-light">Locations near</span>
                <Button
                  variant="link"
                  onClick={() => setShowChangeZipcodeModal(true)}
                  className="font-heading flex p-0 text-lg font-bold underline decoration-current underline-offset-2 transition-all duration-200 hover:decoration-transparent group-data-[component=LocationSearch]:py-0"
                  disabled={geoLoading}
                >
                  {!geoLoading ? (
                    <>
                      {zipCode}
                      <span className="sr-only">Change Location</span>
                    </>
                  ) : (
                    <>
                      <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-b-2"></div>
                      <span className="font-heading flex text-lg font-bold underline underline-offset-4">
                        Detecting location...
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </AnimatedSection>
          </div>
          <AnimatedSection
            direction="up"
            className="relative z-20"
            isPageEditing={isPageEditing}
            reducedMotion={prefersReducedMotion}
            delay={400}
          >
            <div
              className={cn('grid grid-cols-1 gap-[60px] md:grid-cols-2', {
                'opacity-20': googleMapsApiKey === '' && isPageEditing,
              })}
            >
              <div className="max-h-[500px] space-y-6 overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="py-4 text-center">Loading dealerships...</div>
                ) : dealerships.length === 0 ? (
                  <div className="py-4 text-center">
                    No dealerships found
                    {/* Show the count for debugging */}
                    <span className="mt-2 block text-xs text-gray-400">
                      (Initial count from Sitecore: {initialDealerships.length})
                    </span>
                  </div>
                ) : (
                  dealerships.map((dealership, index) => (
                    <LocationSearchItem
                      key={index}
                      dealership={dealership}
                      isSelected={
                        selectedDealership?.dealershipName?.jsonValue?.value ===
                        dealership.dealershipName?.jsonValue?.value
                      }
                      onSelect={handleSelectDealership}
                    />
                  ))
                )}
              </div>
              <div className="relative h-[500px] overflow-hidden rounded-md bg-white">
                <GoogleMap
                  apiKey={googleMapsApiKey}
                  center={mapCenter}
                  zoom={12}
                  selectedDealership={selectedDealership}
                  dealerships={dealerships}
                  onDealershipSelect={handleSelectDealership}
                />
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Modal for when geolocation is denied */}
        <ZipcodeModal
          open={showModal || showChangeZipcodeModal}
          onClose={() => {
            closeModal();
            setShowChangeZipcodeModal(false);
          }}
          onSubmit={handleModalSubmit}
          onUseMyLocation={handleUseMyLocation}
          isGeoLoading={geoLoading}
          error={geoError}
        />
      </div>
    );
  }
  return <NoDataFallback componentName="LocationSearchMapRightTitleZipCentered" />;
};
