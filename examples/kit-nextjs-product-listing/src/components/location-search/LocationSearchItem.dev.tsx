import type { LocationSearchItemProps } from './location-search.props';
import { Text } from '@sitecore-content-sdk/nextjs';
import { getFieldValue } from '@/lib/component-props';

export const LocationSearchItem = ({
  dealership,
  isSelected,
  onSelect,
}: LocationSearchItemProps) => {
  return (
    <div
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
          {getFieldValue(dealership?.dealershipName) && (
            <Text
              tag="p"
              field={getFieldValue(dealership.dealershipName)}
              className="font-heading @md:text-3xl text-2xl font-normal"
            />
          )}
          <p className="font-heading mt-3 text-lg">
            <Text field={getFieldValue(dealership.dealershipAddress)} />
            {', '}
            <Text field={getFieldValue(dealership.dealershipCity)} />{' '}
            <Text field={getFieldValue(dealership.dealershipZipCode)} />
          </p>
        </div>
        {dealership.distance !== undefined && (
          <span className="font-heading whitespace-nowrap text-right">
            {dealership.distance.toFixed(1)}mi
          </span>
        )}
      </div>
    </div>
  );
};
