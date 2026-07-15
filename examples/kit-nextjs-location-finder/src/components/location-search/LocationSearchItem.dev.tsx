'use client';

import type { LocationSearchItemProps } from './location-search.props';
import { Text } from '@sitecore-content-sdk/nextjs';
import { generatePlaceSchema } from '@/lib/structured-data/schema';
import { StructuredData } from '@/components/structured-data/StructuredData';

export const LocationSearchItem = ({
  dealership,
  isSelected,
  onSelect,
}: LocationSearchItemProps) => {
  // Generate Place schema for this location
  const placeSchema = generatePlaceSchema(
    dealership.dealershipName?.jsonValue?.value?.toString() || 'Dealership',
    dealership.dealershipAddress?.jsonValue?.value?.toString(),
    dealership.dealershipCity?.jsonValue?.value?.toString(),
    undefined, // region/state not in data
    dealership.dealershipZipCode?.jsonValue?.value?.toString(),
    'US',
    dealership.latitude,
    dealership.longitude
  );

  // Generate unique ID from dealership name and address
  const dealershipName = dealership.dealershipName?.jsonValue?.value?.toString() || 'location';
  const dealershipAddress = dealership.dealershipAddress?.jsonValue?.value?.toString() || '';
  const uniqueId = `${dealershipName}-${dealershipAddress}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

  return (
    <>
      {/* Structured data for this location */}
      <StructuredData id={`place-schema-${uniqueId}`} data={placeSchema} />
      
      <article
        className={`border-1 cursor-pointer p-5 transition-colors ${
          isSelected
            ? 'bg-primary text-primary-foreground rounded-default border-primary'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/70 border-border '
        }`}
        onClick={() => onSelect(dealership)}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter' ? onSelect(dealership) : null)}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        data-component="LocationSearchItem"
      >
        <div className="flex items-start justify-between">
          <div>
            {dealership?.dealershipName?.jsonValue && (
              <Text
                tag="h3"
                field={dealership.dealershipName.jsonValue}
                className="font-heading @md:text-3xl text-2xl font-normal"
              />
            )}
            <p className="font-heading mt-3 text-lg">
              <Text field={dealership.dealershipAddress?.jsonValue} />
              {', '}
              <Text field={dealership.dealershipCity?.jsonValue} />{' '}
              <Text field={dealership.dealershipZipCode?.jsonValue} />
            </p>
          </div>
          {dealership.distance !== undefined && (
            <span className="font-heading whitespace-nowrap text-right">
              {dealership.distance.toFixed(1)}mi
            </span>
          )}
        </div>
      </article>
    </>
  );
};
